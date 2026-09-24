import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/redis';
import { MAX_PER_HOLE, type BoardKind, type BoardRow } from '@/lib/golf';

const BOARDS: Record<BoardKind, { key: string; min: number; max: number }> = {
  hole1: { key: 'hole1:board', min: 1, max: 20 },
  round: { key: 'round:board', min: 9, max: 9 * MAX_PER_HOLE },
};
const which = (v: unknown): BoardKind => (v === 'round' ? 'round' : 'hole1');
const EPOCH = 1_780_000_000; // seconds; keeps scores small and ties earliest-first

const BLOCKED = new Set(['ASS', 'FUK', 'FUC', 'FCK', 'SEX', 'CUM', 'DIK', 'DIC', 'KKK', 'NIG', 'FAG', 'TIT', 'COK', 'KUM', 'JEW', 'NAZ', 'GAY', 'WTF', 'PIS', 'POO']);

const top = async (board: string): Promise<BoardRow[]> => {
  const raw = await db().zrange<string[]>(board, 0, 9, { withScores: true });
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
      return res.status(200).json({ board: await top(BOARDS[which(req.query.board)].key) });
    }

    if (req.method === 'POST') {
      const initials = String(req.body?.initials ?? '').toUpperCase().trim();
      const strokes = Number(req.body?.strokes);
      const board = BOARDS[which(req.body?.board)];
      if (!/^[A-Z]{1,3}$/.test(initials)) return res.status(400).json({ error: 'Initials are one to three letters.' });
      if (BLOCKED.has(initials)) return res.status(400).json({ error: 'Pick different initials.' });
      if (!Number.isInteger(strokes) || strokes < board.min || strokes > board.max) return res.status(400).json({ error: 'That score is off the card.' });

      const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'anon').split(',')[0].trim();
      const rl = `hole1:rl:${ip}`;
      const hits = await db().incr(rl);
      if (hits === 1) await db().expire(rl, 60);
      if (hits > 5) return res.status(429).json({ error: 'Easy, tiger. Try again in a minute.' });

      const now = Math.floor(Date.now() / 1000) - EPOCH;
      const member = `${initials}|${Math.random().toString(36).slice(2, 10)}`;
      await db().zadd(board.key, { score: strokes * 1e9 + Math.max(0, now), member });
      await db().zremrangebyrank(board.key, 200, -1);
      const rank = await db().zrank(board.key, member);
      return res.status(201).json({ rank: rank === null ? null : rank + 1, board: await top(board.key) });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'The leaderboard is unreachable right now.' });
  }
}
