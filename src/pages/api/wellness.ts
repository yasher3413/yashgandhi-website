import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/redis';
import { whoopGet, WhoopNotConnected } from '@/lib/whoop';

// Hole 7's live data, from WHOOP. One snapshot is cached for ten minutes so
// visitors never hit WHOOP's rate limits, and the last good one is served if
// WHOOP is down.

type Page<T> = { records: T[] };
type Scored<S> = { score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE'; score?: S };

type Recovery = Scored<{ recovery_score: number; resting_heart_rate: number; hrv_rmssd_milli: number }> & { created_at: string };
type Cycle = Scored<{ strain: number }> & { start: string; end: string | null };
type Sleep = Scored<{
  sleep_performance_percentage: number;
  stage_summary: { total_in_bed_time_milli: number; total_awake_time_milli: number };
}> & { nap: boolean; end: string };
type Workout = Scored<{ strain: number; average_heart_rate: number; distance_meter?: number }> & {
  sport_name: string;
  start: string;
  end: string;
};

export type Wellness = {
  recovery: { score: number; hrv: number; rhr: number; at: string } | null;
  sleep: { performance: number; hours: number; at: string } | null;
  strain: { day: number } | null;
  workout: { sport: string; strain: number; minutes: number; avgHr: number; meters: number | null; at: string } | null;
  updated: string;
  stale?: boolean;
};

const CACHE = 'whoop:snapshot';
const FRESH_FOR = 600;

const scored = <T extends Scored<unknown>>(rows: T[]) => rows.find((r) => r.score_state === 'SCORED' && r.score);

const fetchSnapshot = async (): Promise<Wellness> => {
  const [recoveries, cycles, sleeps, workouts] = await Promise.all([
    whoopGet<Page<Recovery>>('/recovery', { limit: 5 }),
    whoopGet<Page<Cycle>>('/cycle', { limit: 5 }),
    whoopGet<Page<Sleep>>('/activity/sleep', { limit: 10 }),
    whoopGet<Page<Workout>>('/activity/workout', { limit: 5 }),
  ]);

  const r = scored(recoveries.records);
  const c = scored(cycles.records);
  const s = scored(sleeps.records.filter((x) => !x.nap));
  const w = scored(workouts.records);

  return {
    recovery: r?.score ? { score: Math.round(r.score.recovery_score), hrv: Math.round(r.score.hrv_rmssd_milli), rhr: Math.round(r.score.resting_heart_rate), at: r.created_at } : null,
    sleep: s?.score
      ? {
          performance: Math.round(s.score.sleep_performance_percentage),
          hours: (s.score.stage_summary.total_in_bed_time_milli - s.score.stage_summary.total_awake_time_milli) / 3_600_000,
          at: s.end,
        }
      : null,
    strain: c?.score ? { day: Math.round(c.score.strain * 10) / 10 } : null,
    workout: w?.score
      ? {
          sport: w.sport_name,
          strain: Math.round(w.score.strain * 10) / 10,
          minutes: Math.round((new Date(w.end).getTime() - new Date(w.start).getTime()) / 60000),
          avgHr: Math.round(w.score.average_heart_rate),
          meters: w.score.distance_meter ?? null,
          at: w.start,
        }
      : null,
    updated: new Date().toISOString(),
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  let cached: Wellness | null = null;
  try {
    cached = await db().get<Wellness>(CACHE);
    if (cached && Date.now() - new Date(cached.updated).getTime() < FRESH_FOR * 1000) return res.status(200).json(cached);
  } catch {
    // no cache available; go straight to WHOOP
  }

  try {
    const snap = await fetchSnapshot();
    await db().set(CACHE, snap).catch(() => undefined);
    return res.status(200).json(snap);
  } catch (error) {
    console.error('Wellness fetch failed:', error);
    if (cached) return res.status(200).json({ ...cached, stale: true });
    const notConnected = error instanceof WhoopNotConnected;
    return res.status(notConnected ? 503 : 502).json({ error: notConnected ? 'not-connected' : 'unavailable' });
  }
}
