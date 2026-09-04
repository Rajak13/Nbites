/**
 * OTP Service — generates, stores, and verifies one-time passwords.
 *
 * Storage: Redis with TTL (falls back to in-memory Map for dev if Redis is unavailable).
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

// ── Redis client (optional) ───────────────────────────────────────────────────
let redis: any = null;

async function getRedis() {
  if (redis) return redis;
  try {
    const { default: Redis } = await import('ioredis');
    const client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      connectTimeout: 2000,
    });
    await client.connect();
    redis = client;
    console.log('[OTP] Redis connected for OTP storage');
    return redis;
  } catch {
    console.warn('[OTP] Redis unavailable — using in-memory fallback (dev only)');
    return null;
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────
const OTP_TTL_SECONDS = 300;       // 5 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 900;       // 15 minutes

// ── Generate ──────────────────────────────────────────────────────────────────

export async function generateOtp(phone: string): Promise<string> {
  const otp = String(randomInt(100000, 999999)); // 6 digits, crypto-random

  const r = await getRedis();
  if (r) {
    await r.setex(`otp:${phone}`, OTP_TTL_SECONDS, JSON.stringify({ otp, attempts: 0 }));
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
  const r = await getRedis();

  // Check lockout key
  if (r) {
    const locked = await r.exists(`otp_lock:${phone}`);
    if (locked) return { success: false, reason: 'locked' };
  }

  let record: { otp: string; attempts: number; expiresAt?: number } | null = null;

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

  if (!record) return { success: false, reason: 'expired' };

  // Increment attempt count first
  record.attempts += 1;

  // Constant-time comparison
  const submittedBuf = Buffer.from(submitted.padEnd(6, ' '));
  const storedBuf = Buffer.from(record.otp.padEnd(6, ' '));
  const match = submittedBuf.length === storedBuf.length && timingSafeEqual(submittedBuf, storedBuf);

  if (!match) {
    if (record.attempts >= MAX_ATTEMPTS) {
      // Lock the phone for 15 minutes
      if (r) {
        await r.del(`otp:${phone}`);
        await r.setex(`otp_lock:${phone}`, LOCKOUT_SECONDS, '1');
      } else {
        memStore.delete(phone);
      }
      return { success: false, reason: 'locked' };
    }

    // Update attempt count
    if (r) {
      const ttl = await r.ttl(`otp:${phone}`);
      await r.setex(`otp:${phone}`, ttl > 0 ? ttl : 1, JSON.stringify(record));
    } else {
      memStore.set(phone, record as any);
    }

    return { success: false, reason: 'invalid' };
  }

  // Success — delete OTP immediately (no replay)
  if (r) {
    await r.del(`otp:${phone}`);
  } else {
    memStore.delete(phone);
  }

  return { success: true };
}
