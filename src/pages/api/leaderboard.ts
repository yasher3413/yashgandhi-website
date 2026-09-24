import type { NextApiRequest, NextApiResponse } from 'next';
import { Redis } from '@upstash/redis';
import type { BoardRow } from '@/lib/golf';

const BOARD = 'hole1:board';
const EPOCH = 1_780_000_000; // seconds; keeps scores small and ties earliest-first

let redis: Redis | null = null;
const db = () => {
  if (!redis) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) throw new Error('Leaderboard store is not configured');
    redis = new Redis({ url, token });
  }
  return redis;
};

const BLOCKED = new Set(['ASS', 'FUK', 'FUC', 'FCK', 'SEX', 'CUM', 'DIK', 'DIC', 'KKK', 'NIG', 'FAG', 'TIT', 'COK', 'KUM', 'JEW', 'NAZ', 'GAY', 'WTF', 'PIS', 'POO']);

const top = async (): Promise<BoardRow[]> => {
  const raw = await db().zrange<string[]>(BOARD, 0, 9, { withScores: true });
  const rows: BoardRow[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    rows.push({ initials: String(raw[i]).split('|')[0], strokes: Math.floor(Number(raw[i + 1]) / 1e9) });
  }
  return rows;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
      return res.status(200).json({ board: await top() });
    }

    if (req.method === 'POST') {
      const initials = String(req.body?.initials ?? '').toUpperCase().trim();
      const strokes = Number(req.body?.strokes);
      if (!/^[A-Z]{1,3}$/.test(initials)) return res.status(400).json({ error: 'Initials are one to three letters.' });
      if (BLOCKED.has(initials)) return res.status(400).json({ error: 'Pick different initials.' });
      if (!Number.isInteger(strokes) || strokes < 1 || strokes > 20) return res.status(400).json({ error: 'That score is off the card.' });

      const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'anon').split(',')[0].trim();
      const rl = `hole1:rl:${ip}`;
      const hits = await db().incr(rl);
      if (hits === 1) await db().expire(rl, 60);
      if (hits > 5) return res.status(429).json({ error: 'Easy, tiger. Try again in a minute.' });

      const now = Math.floor(Date.now() / 1000) - EPOCH;
      const member = `${initials}|${Math.random().toString(36).slice(2, 10)}`;
      await db().zadd(BOARD, { score: strokes * 1e9 + Math.max(0, now), member });
      await db().zremrangebyrank(BOARD, 200, -1);
      const rank = await db().zrank(BOARD, member);
      return res.status(201).json({ rank: rank === null ? null : rank + 1, board: await top() });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'The leaderboard is unreachable right now.' });
  }
}
