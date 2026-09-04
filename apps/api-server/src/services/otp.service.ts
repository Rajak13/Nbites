/**
 * OTP Service — generates, stores, and verifies one-time passwords.
 *
 * Storage:
 *   1. Upstash Redis REST API (zero-socket, serverless-ready HTTPS)
 *   2. Native Redis (via ioredis using REDIS_URL or REDIS_HOST)
 *   3. In-memory Map fallback (dev/local without Redis)
 *
 * Security:
 *   - 6-digit cryptographically random OTP
 *   - 300 second TTL (5 minutes)
 *   - Max 5 attempts per phone before 15-minute lockout
 *   - OTP deleted immediately on first successful verify (no replay)
 *   - Constant-time comparison to prevent timing attacks
 */

import { randomInt, timingSafeEqual } from 'crypto';

// ── In-memory fallback (dev only) ────────────────────────────────────────────
const memStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

// ── Constants ─────────────────────────────────────────────────────────────────
const OTP_TTL_SECONDS = 300;       // 5 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 900;       // 15 minutes

// ── Upstash REST API Helper ───────────────────────────────────────────────────
function isUpstashRest(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashCommand(command: (string | number)[]): Promise<any> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as any;
    return data?.result;
  } catch (err: any) {
    console.warn('[Upstash REST] Request error:', err?.message || err);
    return null;
  }
}

// ── Redis client (TCP fallback via ioredis) ──────────────────────────────────
let redis: any = null;

async function getRedis() {
  if (redis) return redis;
  try {
    const { default: Redis } = await import('ioredis');
    const redisUrl = process.env.REDIS_URL;

    let client: any;
    if (redisUrl) {
      client = new Redis(redisUrl, {
        lazyConnect: true,
        connectTimeout: 4000,
        maxRetriesPerRequest: 2,
      });
    } else {
      const host = process.env.REDIS_HOST || 'localhost';
      const isUpstash = host.includes('upstash.io');

      client = new Redis({
        host,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        tls: isUpstash ? {} : undefined,
        lazyConnect: true,
        connectTimeout: 4000,
        maxRetriesPerRequest: 2,
      });
    }

    await client.connect();
    redis = client;
    console.log('[OTP] Redis connected successfully for OTP storage');
    return redis;
  } catch (err: any) {
    console.warn('[OTP] Redis unavailable, using in-memory fallback:', err?.message || err);
    return null;
  }
}

// ── Generate ──────────────────────────────────────────────────────────────────

export async function generateOtp(phone: string): Promise<string> {
  const otp = String(randomInt(100000, 999999)); // 6 digits, crypto-random
  const record = JSON.stringify({ otp, attempts: 0 });

  if (isUpstashRest()) {
    await upstashCommand(['SETEX', `otp:${phone}`, OTP_TTL_SECONDS, record]);
    return otp;
  }

  const r = await getRedis();
  if (r) {
    await r.setex(`otp:${phone}`, OTP_TTL_SECONDS, record);
  } else {
    memStore.set(phone, { otp, expiresAt: Date.now() + OTP_TTL_SECONDS * 1000, attempts: 0 });
  }

  return otp;
}

// ── Verify ────────────────────────────────────────────────────────────────────

export type OtpVerifyResult =
  | { success: true }
  | { success: false; reason: 'invalid' | 'expired' | 'locked' };

export async function verifyOtp(phone: string, submitted: string): Promise<OtpVerifyResult> {
  // 1. Check if number is locked out
  if (isUpstashRest()) {
    const locked = await upstashCommand(['EXISTS', `otp_lock:${phone}`]);
    if (locked === 1) return { success: false, reason: 'locked' };
  } else {
    const r = await getRedis();
    if (r) {
      const locked = await r.exists(`otp_lock:${phone}`);
      if (locked) return { success: false, reason: 'locked' };
    }
  }

  // 2. Retrieve OTP record
  let record: { otp: string; attempts: number; expiresAt?: number } | null = null;

  if (isUpstashRest()) {
    const raw = await upstashCommand(['GET', `otp:${phone}`]);
    if (!raw) return { success: false, reason: 'expired' };
    try {
      record = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return { success: false, reason: 'expired' };
    }
  } else {
    const r = await getRedis();
    if (r) {
      const raw = await r.get(`otp:${phone}`);
      if (!raw) return { success: false, reason: 'expired' };
      record = JSON.parse(raw);
    } else {
      const mem = memStore.get(phone);
      if (!mem || Date.now() > mem.expiresAt) {
        memStore.delete(phone);
        return { success: false, reason: 'expired' };
      }
      record = mem;
    }
  }

  if (!record) return { success: false, reason: 'expired' };

  // Increment attempt count
  record.attempts += 1;

  // Constant-time comparison
  const submittedBuf = Buffer.from(submitted.padEnd(6, ' '));
  const storedBuf = Buffer.from(record.otp.padEnd(6, ' '));
  const match = submittedBuf.length === storedBuf.length && timingSafeEqual(submittedBuf, storedBuf);

  if (!match) {
    if (record.attempts >= MAX_ATTEMPTS) {
      // Lock phone for 15 minutes
      if (isUpstashRest()) {
        await upstashCommand(['DEL', `otp:${phone}`]);
        await upstashCommand(['SETEX', `otp_lock:${phone}`, LOCKOUT_SECONDS, '1']);
      } else {
        const r = await getRedis();
        if (r) {
          await r.del(`otp:${phone}`);
          await r.setex(`otp_lock:${phone}`, LOCKOUT_SECONDS, '1');
        } else {
          memStore.delete(phone);
        }
      }
      return { success: false, reason: 'locked' };
    }

    // Update attempt count
    if (isUpstashRest()) {
      const ttl = await upstashCommand(['TTL', `otp:${phone}`]);
      const validTtl = typeof ttl === 'number' && ttl > 0 ? ttl : 1;
      await upstashCommand(['SETEX', `otp:${phone}`, validTtl, JSON.stringify(record)]);
    } else {
      const r = await getRedis();
      if (r) {
        const ttl = await r.ttl(`otp:${phone}`);
        await r.setex(`otp:${phone}`, ttl > 0 ? ttl : 1, JSON.stringify(record));
      } else {
        memStore.set(phone, record as any);
      }
    }

    return { success: false, reason: 'invalid' };
  }

  // Success — delete OTP immediately (no replay)
  if (isUpstashRest()) {
    await upstashCommand(['DEL', `otp:${phone}`]);
  } else {
    const r = await getRedis();
    if (r) {
      await r.del(`otp:${phone}`);
    } else {
      memStore.delete(phone);
    }
  }

  return { success: true };
}
