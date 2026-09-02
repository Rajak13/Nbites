import Redis from 'ioredis';
import { config } from './env';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  lazyConnect: true,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
});

redis.on('error', (err) => {
  // Graceful warning in case local Redis is not running
  if (config.nodeEnv === 'development') {
    console.warn('[Redis] Warning: Redis server connection issue:', err.message);
  } else {
    console.error('[Redis] Error:', err);
  }
});
