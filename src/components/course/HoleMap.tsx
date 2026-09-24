import React, { useEffect, useMemo, useState } from 'react';
import CourseArt, { arcPath, HoleSpec, teeOf, yardScale } from './CourseArt';
import { dist, Pt } from '@/lib/course';
import { partialFlight, useFlight } from '@/lib/useFlight';

type Props = {
  spec: HoleSpec;
  active: number;
  labels: string[];
  className?: string;
  compact?: boolean;
  hideYards?: boolean;
};

/** A hole drawn in plan. The ball plays one shot per item the visitor has read. */
const HoleMap = ({ spec, active, labels, className, compact = false, hideYards = false }: Props) => {
  const tee = teeOf(spec);
  const points = useMemo<Pt[]>(() => [tee, ...spec.shots], [tee, spec.shots]);
  // The ball plays shots one at a time, even when two items arrive together
  // (side-by-side columns), so no marker is ever skipped.
  const [shown, setShown] = useState(-1);
  const goal = Math.min(active, spec.shots.length - 1);
  const target = points[shown + 1];
  const flight = useFlight(target, 900, false, 0.12);
  const { pos, lift, flying } = flight;
  const [forward, setForward] = useState(true);
  useEffect(() => {
    if (flying || shown === goal) return;
    if (goal > shown) {
      // settle on each marker for a beat before playing on
      const t = setTimeout(() => {
        setForward(true);
        setShown(shown + 1);
      }, shown < 0 ? 0 : 380);
      return () => clearTimeout(t);
    } else {
      setForward(false);
      setShown(goal);
    }
  }, [flying, shown, goal]);
  const scale = yardScale(spec);
  const k = spec.w / 400;

  return (
    <CourseArt spec={spec} className={className}>
      {() => (
        <g>
          {spec.shots.map((s, i) => {
            const live = flying && forward && i === shown;
            const played = i < shown || (i === shown && !flying) || live;
            const a = points[i];
            return (
              <path
                key={`trail${i}`}
                d={live ? partialFlight(flight) : arcPath(a, s)}
                fill="none"
                stroke="#f3f6ef"
                strokeWidth={1.6 * k}
                strokeDasharray={`${2 * k} ${5 * k}`}
                strokeLinecap="round"
                opacity={played ? 0.9 : 0.22}
                style={{ transition: 'opacity 400ms ease-out' }}
              />
            );
          })}

          {spec.shots.map((s, i) => {
            const played = i < shown || (i === shown && !flying);
            const current = i === shown && !flying;
            const last = i === spec.shots.length - 1;
            // put the label on whichever side is clear of bunkers
            const clear = (dir: number) =>
              !(spec.bunkers ?? []).some(([bx, by, rx]) => Math.hypot(s[0] + dir * (last ? 80 : 50) * k - bx, s[1] + (last ? -34 : 0) * k - by) < rx + 44 * k);
            const prefer = s[0] > spec.w * 0.55 ? -1 : 1;
            const left = (clear(prefer) || !clear(-prefer) ? prefer : -prefer) === -1;
            // the pin's label climbs off the green on a diagonal leader
            const lx = (left ? -1 : 1) * (last ? 58 : 26) * k;
            const ly = last ? -34 * k : 0;
            const yds = Math.round(dist(points[i], s) * scale);
            return (
              <g key={`m${i}`} style={{ transition: 'opacity 400ms ease-out' }} opacity={played ? 1 : 0.55}>
                <circle cx={s[0]} cy={s[1]} r={6 * k} fill="none" stroke={current ? '#ef3b2c' : '#f3f6ef'} strokeWidth={1.5 * k} />
                {!compact && (<>
                <line
                  x1={s[0] + (left ? -8 : 8) * k}
                  y1={s[1]}
                  x2={s[0] + lx}
                  y2={s[1] + ly}
                  stroke="#f3f6ef"
                  strokeOpacity="0.6"
                  strokeWidth={k}
                />
                <text
                  x={s[0] + lx + (left ? -4 : 4) * k}
                  y={s[1] + ly - 2 * k}
                  stroke="#0c2e1e"
                  strokeWidth={3.5 * k}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  textAnchor={left ? 'end' : 'start'}
                  fill="#f3f6ef"
                  fontFamily="Azeret Mono, monospace"
                  fontSize={11 * k}
                  letterSpacing="0.04em"
                >
                  {labels[i]?.toUpperCase()}
                </text>
                {!hideYards && <text
                  x={s[0] + lx + (left ? -4 : 4) * k}
                  y={s[1] + ly + 11 * k}
                  textAnchor={left ? 'end' : 'start'}
                  stroke="#0c2e1e"
                  strokeWidth={3.5 * k}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  fill="#dfe9e1"
                  fontFamily="Azeret Mono, monospace"
                  fontSize={9.5 * k}
                >
                  {yds.toLocaleString()} YDS
                </text>}
                </>)}
              </g>
            );
          })}

          <ellipse cx={pos[0] + lift * 14 * k} cy={pos[1] + lift * 18 * k} rx={5 * k} ry={3.2 * k} fill="#06170c" opacity={0.45 - lift * 0.2} />
          <circle cx={pos[0]} cy={pos[1] - lift * 10 * k} r={(4.6 + lift * 3) * k} fill="#ffffff" stroke="#0c2e1e" strokeOpacity="0.4" strokeWidth={0.8 * k} />
        </g>
      )}
    </CourseArt>
  );
};

export default HoleMap;
