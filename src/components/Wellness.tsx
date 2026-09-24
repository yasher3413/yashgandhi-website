import React, { useEffect, useState } from 'react';
import Hole from './course/Hole';
import { specs } from '@/content';
import type { Wellness as Snapshot } from '@/pages/api/wellness';

/** WHOOP's recovery zones, in course colours: green, sand, flag. */
const zone = (score: number) =>
  score >= 67
    ? { color: '#6cc15a', note: 'green day. send it.' }
    : score >= 34
      ? { color: '#e7d39a', note: 'yellow. play it safe.' }
      : { color: '#ef3b2c', note: 'red. rest day.' };

const sportName = (s: string) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const duration = (minutes: number) => (minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`);

const ago = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return h < 36 ? `${h}h ago` : new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Figure = ({ value, unit, label, color }: { value: string; unit?: string; label: string; color?: string }) => (
  <div className="border-t border-chalk/15 pt-3">
    <p className="text-sm text-moss">{label}</p>
    <p className="mt-1 font-display text-chalk text-[2.1rem] sm:text-6xl leading-none tabular whitespace-nowrap" style={{ fontWeight: 800, color }}>
      {value}
      {unit && <span className="font-mono text-sm text-moss ml-1.5 align-baseline" style={{ fontWeight: 400 }}>{unit}</span>}
    </p>
  </div>
);

const Waiting = ({ children }: { children: React.ReactNode }) => <p className="mt-6 font-pencil text-2xl text-sand min-h-[6rem]">{children}</p>;

const Heading = ({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 className="font-display uppercase text-chalk text-3xl sm:text-4xl" style={{ fontWeight: 800 }}>
      {children}
    </h3>
    {aside}
  </div>
);

const Wellness = () => {
  const [data, setData] = useState<Snapshot | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'down'>('loading');

  useEffect(() => {
    fetch('/api/wellness')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Snapshot) => {
        setData(d);
        setState('ready');
      })
      .catch(() => setState('down'));
  }, []);

  const rec = data?.recovery;
  const z = rec ? zone(rec.score) : null;
  const w = data?.workout;
  const live = state === 'ready' && !data?.stale;

  return (
    <Hole id="wellness" n={7} name="Wellness" par={5} yards="46,151" note="that's 42.2 km" spec={specs.wellness} labels={['Recovery', 'Training']} hideYards side="left">
      <div data-shot>
        <Heading
          aside={
            <span className="inline-flex items-center gap-2 text-sm text-moss">
              <span className={`w-2 h-2 rounded-full ${live ? 'bg-flag' : 'bg-moss'}`} aria-hidden="true" />
              {state === 'ready' && data ? `Live from WHOOP · ${ago(data.updated)}` : 'Live from WHOOP'}
            </span>
          }
        >
          Today&apos;s recovery
        </Heading>
        {state === 'loading' ? (
          <Waiting>reading the strap…</Waiting>
        ) : state === 'down' || !data ? (
          <Waiting>the strap is offline. check back soon.</Waiting>
        ) : (
          <>
            {z && <p className="mt-4 font-pencil text-2xl" style={{ color: z.color }}>{z.note}</p>}
            <div className="mt-6 grid grid-cols-3 gap-4 sm:gap-8">
              <Figure label="Recovery" value={rec ? `${rec.score}` : '—'} unit={rec ? '%' : undefined} color={z?.color} />
              <Figure label="HRV" value={rec ? `${rec.hrv}` : '—'} unit={rec ? 'ms' : undefined} />
              <Figure label="Resting HR" value={rec ? `${rec.rhr}` : '—'} unit={rec ? 'bpm' : undefined} />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 sm:gap-8">
              <Figure label="Sleep" value={data.sleep ? `${data.sleep.performance}` : '—'} unit={data.sleep ? '%' : undefined} />
              <Figure label="Slept" value={data.sleep ? duration(Math.round(data.sleep.hours * 60)) : '—'} />
              <Figure label="Day strain" value={data.strain ? data.strain.day.toFixed(1) : '—'} />
            </div>
          </>
        )}
      </div>

      <div data-shot className="mt-20">
        <Heading aside={w ? <span className="text-sm text-moss tabular">{ago(w.at)}</span> : undefined}>Latest workout</Heading>
        {state === 'loading' ? (
          <Waiting>checking the training log…</Waiting>
        ) : !w ? (
          <Waiting>no workouts logged lately. rest counts too.</Waiting>
        ) : (
          <>
            <p className="mt-5 text-2xl text-chalk font-medium">{sportName(w.sport)}</p>
            <div className="mt-6 grid grid-cols-3 gap-4 sm:gap-8">
              <Figure label="Strain" value={w.strain.toFixed(1)} />
              <Figure label="Time" value={duration(w.minutes)} />
              {w.meters ? <Figure label="Distance" value={(w.meters / 1000).toFixed(1)} unit="km" /> : <Figure label="Avg HR" value={`${w.avgHr}`} unit="bpm" />}
            </div>
          </>
        )}
      </div>
    </Hole>
  );
};

export default Wellness;
