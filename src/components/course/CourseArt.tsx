import React, { useId, useMemo } from 'react';
import { blob, contourRings, hills, smoothPath, dist, Pt } from '@/lib/course';

export type Oval = [number, number, number, number];

export type HoleSpec = {
  w: number;
  h: number;
  /** Centre line of the fairway, tee first. */
  line: Pt[];
  width: number;
  /** Where each shot finishes; the last one is the pin. */
  shots: Pt[];
  green: Oval;
  bunkers?: Oval[];
  water?: Oval[];
  trees?: [number, number, number][];
  yards: number;
  seed: number;
  hillCount?: number;
};

export const pinOf = (s: HoleSpec) => s.shots[s.shots.length - 1];
export const teeOf = (s: HoleSpec) => s.line[0];

/** Yards per drawing unit, so readouts agree with the tee sign. */
export const yardScale = (s: HoleSpec) => {
  let len = 0;
  for (let i = 1; i < s.line.length; i++) len += dist(s.line[i - 1], s.line[i]);
  return s.yards / len;
};

export const inOval = (p: Pt, [cx, cy, rx, ry]: Oval, pad = 1) =>
  ((p[0] - cx) / (rx * pad)) ** 2 + ((p[1] - cy) / (ry * pad)) ** 2 <= 1;

/** A gentle draw between two points, the way a flight line is drawn in a yardage book. */
export const arcPath = (a: Pt, b: Pt, bend = 0.12) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return `M${a[0]},${a[1]} Q${mx - dy * bend},${my + dx * bend} ${b[0]},${b[1]}`;
};

type Props = {
  spec: HoleSpec;
  flag?: boolean;
  className?: string;
  children?: (ids: { uid: string }) => React.ReactNode;
};

const CourseArt = ({ spec, flag = true, className, children }: Props) => {
  const uid = useId().replace(/:/g, '');
  const { w, h, line, width, green, bunkers = [], water = [], trees = [], seed } = spec;
  const pin = pinOf(spec);
  const tee = teeOf(spec);

  const art = useMemo(() => {
    const rings = hills(w, h, spec.hillCount ?? 3, seed, Math.max(w, h) / 700).flatMap(contourRings);
    return {
      rings,
      fairway: smoothPath(line),
      green: blob(green[0], green[1], green[2], green[3], seed + 7, 0.18),
      fringe: blob(green[0], green[1], green[2] + 9, green[3] + 9, seed + 7, 0.18),
      bunkers: bunkers.map((b, i) => blob(b[0], b[1], b[2], b[3], seed + 20 + i, 0.4, 8)),
      water: water.map((o, i) => blob(o[0], o[1], o[2], o[3], seed + 40 + i, 0.3, 10)),
      waterInner: water.map((o, i) => blob(o[0], o[1], o[2] * 0.72, o[3] * 0.6, seed + 40 + i, 0.3, 10)),
    };
  }, [w, h, line, green, bunkers, water, seed, spec.hillCount]);

  return (
    <svg viewBox={`-24 -24 ${w + 48} ${h + 48}`} className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id={`mow-${uid}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <rect width="22" height="22" fill="#23714a" />
          <rect width="11" height="22" fill="#2a7d53" />
        </pattern>
        <pattern id={`mowg-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <rect width="10" height="10" fill="#6cc15a" />
          <rect width="5" height="10" fill="#77ca63" />
        </pattern>
        <radialGradient id={`fade-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id={`feather-${uid}`} maskUnits="userSpaceOnUse" x={-24} y={-24} width={w + 48} height={h + 48}>
          <rect x={-24} y={-24} width={w + 48} height={h + 48} fill={`url(#fade-${uid})`} />
        </mask>
        <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <g fill="none" stroke="#f3f6ef" strokeOpacity="0.1" strokeWidth="1" mask={`url(#feather-${uid})`}>
        {art.rings.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {art.water.map((d, i) => (
        <g key={`w${i}`}>
          <path d={d} fill="#2f6fd6" />
          <path d={art.waterInner[i]} fill="none" stroke="#7fb0ff" strokeOpacity="0.45" strokeDasharray="10 8" />
        </g>
      ))}

      <path d={art.fairway} fill="none" stroke="#0c2e1e" strokeOpacity="0.35" strokeWidth={width + 26} strokeLinecap="round" strokeLinejoin="round" filter={`url(#soft-${uid})`} />
      <path d={art.fairway} fill="none" stroke="#1a5a3a" strokeWidth={width + 16} strokeLinecap="round" strokeLinejoin="round" />
      <path d={art.fairway} fill="none" stroke={`url(#mow-${uid})`} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />

      <path d={art.fringe} fill="#4fa047" />
      <path d={art.green} fill={`url(#mowg-${uid})`} />

      {art.bunkers.map((d, i) => (
        <g key={`b${i}`}>
          <path d={d} fill="#b99d58" transform="translate(1.5 2.5)" />
          <path d={d} fill="#e7d39a" />
        </g>
      ))}

      {trees.map(([x, y, r], i) => (
        <g key={`t${i}`}>
          <circle cx={x + r * 0.25} cy={y + r * 0.35} r={r} fill="#07200f" opacity="0.45" />
          <circle cx={x} cy={y} r={r} fill="#0f3a25" />
          <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.55} fill="#15492f" />
        </g>
      ))}

      <rect x={tee[0] - 16} y={tee[1] - 9} width="32" height="18" rx="3" fill="#2f8a5c" transform={`rotate(-8 ${tee[0]} ${tee[1]})`} />
      <circle cx={tee[0] - 9} cy={tee[1] - 2} r="2.4" fill="#f3f6ef" />
      <circle cx={tee[0] + 9} cy={tee[1] + 1} r="2.4" fill="#f3f6ef" />

      <circle cx={pin[0]} cy={pin[1]} r="4" fill="#0c2e1e" />
      {flag && (
        <g>
          <line x1={pin[0]} y1={pin[1]} x2={pin[0]} y2={pin[1] - 46} stroke="#f3f6ef" strokeWidth="2" strokeLinecap="round" />
          <path className="flag-wave" d={`M${pin[0] + 1},${pin[1] - 46} l24,7 l-24,8 z`} fill="#ef3b2c" />
        </g>
      )}

      {children?.({ uid })}
    </svg>
  );
};

export default CourseArt;
