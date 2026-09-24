import { Redis } from '@upstash/redis';

// The one shared store: the leaderboards and the WHOOP login both live here.
let redis: Redis | null = null;

export const db = () => {
  if (!redis) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) throw new Error('Redis store is not configured');
    redis = new Redis({ url, token });
  }
  return redis;
};
