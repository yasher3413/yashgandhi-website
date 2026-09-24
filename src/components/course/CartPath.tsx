import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { HOLES } from '@/content';
import { useRound } from '@/lib/round';
import { blob, contourRings, smoothPath, type Pt } from '@/lib/course';
import { CartGlyph } from './Controls';

// The walk between greens and tees. Every leg of the course has its own route
// and its own scenery, laid out in fractions of the strip and drawn in pixels
// so nothing stretches.

type Deco =
  | { kind: 'tree'; x: number; y: number; r: number }
  | { kind: 'pond'; x: number; y: number; rx: number; ry: number }
  | { kind: 'bunker'; x: number; y: number; rx: number; ry: number }
  | { kind: 'creek'; y: number }
  | { kind: 'hill'; x: number; y: number; r: number }
  | { kind: 'house'; x: number; y: number }
  | { kind: 'practice'; x: number; y: number }
  | { kind: 'avenue' }
  | { kind: 'note'; x: number; y: number; text: string; anchor?: 'start' | 'end' };

type Route = { h: number; via: Pt[]; deco: Deco[] };

const ROUTES: Record<number, Route> = {
  2: {
    h: 260,
    via: [[0.73, 0.16], [0.63, 0.38], [0.62, 0.62], [0.73, 0.84]],
    deco: [
      { kind: 'tree', x: 0.55, y: 0.24, r: 20 }, { kind: 'tree', x: 0.54, y: 0.5, r: 24 }, { kind: 'tree', x: 0.56, y: 0.78, r: 18 },
      { kind: 'tree', x: 0.42, y: 0.64, r: 15 }, { kind: 'tree', x: 0.7, y: 0.42, r: 16 }, { kind: 'tree', x: 0.71, y: 0.62, r: 19 },
      { kind: 'tree', x: 0.74, y: 0.9, r: 14 },
      { kind: 'note', x: 0.5, y: 0.34, text: 'through the pines', anchor: 'end' },
    ],
  },

  3: {
    h: 330,
    via: [[0.68, 0.16], [0.42, 0.3], [0.64, 0.47], [0.38, 0.63], [0.27, 0.84]],
    deco: [
      { kind: 'hill', x: 0.53, y: 0.46, r: 150 },
      { kind: 'note', x: 0.76, y: 0.5, text: 'switchbacks. hold on.', anchor: 'start' },
    ],
  },
  4: {
    h: 270,
    via: [[0.32, 0.26], [0.5, 0.5], [0.69, 0.74]],
    deco: [
      { kind: 'creek', y: 0.5 },
      { kind: 'tree', x: 0.18, y: 0.72, r: 22 }, { kind: 'tree', x: 0.83, y: 0.25, r: 20 },
      { kind: 'note', x: 0.58, y: 0.36, text: 'mind the creek', anchor: 'start' },
    ],
  },
  5: {
    h: 290,
    via: [[0.7, 0.24], [0.56, 0.44], [0.42, 0.56], [0.3, 0.76]],
    deco: [
      { kind: 'house', x: 0.6, y: 0.22 },
      { kind: 'tree', x: 0.36, y: 0.32, r: 18 }, { kind: 'tree', x: 0.62, y: 0.78, r: 22 }, { kind: 'tree', x: 0.46, y: 0.86, r: 15 },
      { kind: 'note', x: 0.66, y: 0.1, text: 'halfway house. hot dog?', anchor: 'start' },
    ],
  },

  6: {
    h: 320,
    via: [[0.28, 0.24], [0.34, 0.6], [0.5, 0.8], [0.66, 0.68], [0.8, 0.84]],
    deco: [
      { kind: 'pond', x: 0.5, y: 0.42, rx: 96, ry: 56 },
      { kind: 'tree', x: 0.18, y: 0.6, r: 20 }, { kind: 'tree', x: 0.7, y: 0.26, r: 18 },
      { kind: 'note', x: 0.6, y: 0.14, text: 'along the water', anchor: 'start' },
    ],
  },

  7: {
    h: 280,
    via: [[0.7, 0.22], [0.5, 0.5], [0.3, 0.78]],
    deco: [{ kind: 'avenue' }, { kind: 'note', x: 0.64, y: 0.72, text: 'the avenue', anchor: 'start' }],
  },
  8: {
    h: 270,
    via: [[0.34, 0.3], [0.5, 0.42], [0.66, 0.7]],
    deco: [
      { kind: 'bunker', x: 0.42, y: 0.16, rx: 32, ry: 15 }, { kind: 'bunker', x: 0.6, y: 0.26, rx: 26, ry: 13 },
      { kind: 'bunker', x: 0.4, y: 0.64, rx: 30, ry: 14 }, { kind: 'bunker', x: 0.56, y: 0.66, rx: 18, ry: 10 },
      { kind: 'bunker', x: 0.76, y: 0.48, rx: 22, ry: 12 }, { kind: 'bunker', x: 0.26, y: 0.46, rx: 16, ry: 9 },
      { kind: 'note', x: 0.62, y: 0.12, text: 'sand everywhere', anchor: 'start' },
    ],
  },

  9: {
    h: 290,
    via: [[0.68, 0.28], [0.44, 0.54], [0.3, 0.8]],
    deco: [
      { kind: 'practice', x: 0.66, y: 0.66 },
      { kind: 'tree', x: 0.3, y: 0.3, r: 20 },
      { kind: 'note', x: 0.76, y: 0.86, text: 'practice green. no time.', anchor: 'start' },
    ],
  },
};

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Where each hole's map sits across the page, as a fraction of the width. */
const sideX = (hole: number, wide: boolean) => (wide ? (HOLES[hole - 1].side === 'right' ? 0.79 : 0.21) : 0.5);

const Tree = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <g>
    <circle cx={x + r * 0.25} cy={y + r * 0.35} r={r} fill="#07200f" opacity="0.45" />
    <circle cx={x} cy={y} r={r} fill="#0f3a25" />
    <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.55} fill="#15492f" />
  </g>
);

const CartPath = ({ to }: { to: number }) => {
  const { drivingTo, arrived } = useRound();
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [w, setW] = useState(1200);
  const [cart, setCart] = useState<{ x: number; y: number; a: number } | null>(null);
  const wide = w >= 900;
  const active = drivingTo === to;
  const route = ROUTES[to];
  const H = wide ? route.h : Math.round(route.h * 0.85);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // phones keep the route nearer the middle
  const fx = (x: number) => (wide ? x : 0.5 + (x - 0.5) * 0.72) * w;
  const fy = (y: number) => y * H;

  const layout = useMemo(() => {
    const pts: Pt[] = [[sideX(to - 1, wide) * w, 0], ...route.via.map(([x, y]) => [fx(x), fy(y)] as Pt), [sideX(to, wide) * w, H]];
    return { d: smoothPath(pts), pts };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, w, H, wide]);

  // scenery that needs the finished route: the bridge and the tree avenue
  const [along, setAlong] = useState<{ bridge?: { x: number; y: number; a: number }; avenue: Pt[] }>({ avenue: [] });
  useLayoutEffect(() => {
    const el = path.current;
    if (!el) return;
    const len = el.getTotalLength();
    const next: typeof along = { avenue: [] };
    const creek = route.deco.find((d) => d.kind === 'creek') as { y: number } | undefined;
    if (creek) {
      let best = 0;
      for (let s = 0; s <= len; s += 4) if (Math.abs(el.getPointAtLength(s).y - fy(creek.y)) < Math.abs(el.getPointAtLength(best).y - fy(creek.y))) best = s;
      const p = el.getPointAtLength(best);
      const q = el.getPointAtLength(Math.min(len, best + 6));
      next.bridge = { x: p.x, y: p.y, a: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI };
    }
    if (route.deco.some((d) => d.kind === 'avenue')) {
      for (let s = 40; s < len - 30; s += 62) {
        const p = el.getPointAtLength(s);
        const q = el.getPointAtLength(s + 2);
        const nx = -(q.y - p.y);
        const ny = q.x - p.x;
        const nl = Math.hypot(nx, ny) || 1;
        for (const side of [-1, 1]) next.avenue.push([p.x + (nx / nl) * 40 * side, p.y + (ny / nl) * 40 * side]);
      }
    }
    setAlong(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  useEffect(() => {
    if (!active) return;
    const el = path.current;
    const box = wrap.current;
    const next = document.getElementById(HOLES[to - 1].id);
    if (!el || !box || !next) return;

    const settleAt = () => next.getBoundingClientRect().top + window.scrollY + (wide ? 104 : -8);
    if (reduced()) {
      window.scrollTo(0, settleAt());
      arrived();
      return;
    }

    const len = el.getTotalLength();
    const DRIVE = Math.min(5200, Math.max(3400, len * 7));
    const WARMUP = 500;
    let t0 = 0;
    let raf = 0;
    let settleStart = 0;

    const frame = (now: number) => {
      if (!t0) t0 = now;
      const t = Math.min(1, Math.max(0, (now - t0 - WARMUP) / DRIVE));
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const p = el.getPointAtLength(e * len);
      const q = el.getPointAtLength(Math.min(len, e * len + 4));
      const a = e >= 1 ? 90 : (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      setCart({ x: p.x, y: p.y, a });

      // the camera follows the cart, then settles where the next hole is playable
      const boxTop = box.getBoundingClientRect().top + window.scrollY;
      const target = t < 1 ? boxTop + p.y - window.innerHeight * 0.45 : settleAt();
      const y = window.scrollY;
      window.scrollTo(0, y + (target - y) * (t < 1 ? 0.12 : 0.1));

      if (t >= 1) {
        if (!settleStart) settleStart = now;
        if (Math.abs(target - window.scrollY) < 2 || now - settleStart > 1500) {
          arrived();
          return;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, to, arrived, wide]);

  return (
    <div ref={wrap} aria-hidden="true" className="relative mx-auto max-w-[1320px] pointer-events-none" style={{ height: H }}>
      <svg viewBox={`0 0 ${w} ${H}`} width={w} height={H} className="absolute inset-0 overflow-visible">
        {route.deco.map((d, i) => {
          if (d.kind === 'hill')
            return (
              <g key={i} fill="none" stroke="#f3f6ef" strokeOpacity="0.14">
                {contourRings({ x: fx(d.x), y: fy(d.y), r: d.r, rings: 6, seed: to * 13 }).map((r, j) => <path key={j} d={r} />)}
              </g>
            );
          if (d.kind === 'creek') {
            const y = fy(d.y);
            const wave = `M-40,${y} C${w * 0.2},${y - 26} ${w * 0.35},${y + 24} ${w * 0.5},${y} S${w * 0.8},${y - 22} ${w + 40},${y + 6}`;
            return (
              <g key={i}>
                <path d={wave} fill="none" stroke="#2f6fd6" strokeWidth="20" strokeLinecap="round" />
                <path d={wave} fill="none" stroke="#7fb0ff" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="10 9" />
              </g>
            );
          }
          if (d.kind === 'pond')
            return (
              <g key={i}>
                <path d={blob(fx(d.x), fy(d.y), d.rx, d.ry, to * 7, 0.3, 10)} fill="#2f6fd6" />
                <path d={blob(fx(d.x), fy(d.y), d.rx * 0.7, d.ry * 0.58, to * 7, 0.3, 10)} fill="none" stroke="#7fb0ff" strokeOpacity="0.45" strokeDasharray="10 8" />
              </g>
            );
          if (d.kind === 'bunker') {
            const b = blob(fx(d.x), fy(d.y), d.rx, d.ry, to * 5 + i, 0.4, 8);
            return (
              <g key={i}>
                <path d={b} fill="#b99d58" transform="translate(1.5 2.5)" />
                <path d={b} fill="#e7d39a" />
              </g>
            );
          }
          if (d.kind === 'tree') return <Tree key={i} x={fx(d.x)} y={fy(d.y)} r={d.r} />;
          if (d.kind === 'practice') {
            const [x, y] = [fx(d.x), fy(d.y)];
            return (
              <g key={i}>
                <path d={blob(x, y, 70, 40, 77, 0.2)} fill="#4fa047" />
                <path d={blob(x, y, 62, 33, 77, 0.2)} fill="#6cc15a" />
                {[[-30, -4], [8, 10], [34, -10]].map(([dx, dy], j) => (
                  <g key={j}>
                    <circle cx={x + dx} cy={y + dy} r="2.5" fill="#0c2e1e" />
                    <line x1={x + dx} y1={y + dy} x2={x + dx} y2={y + dy - 20} stroke="#f3f6ef" strokeWidth="1.5" />
                    <path d={`M${x + dx + 1},${y + dy - 20} l10,3 l-10,4z`} fill={j === 1 ? '#e7d39a' : '#ef3b2c'} />
                  </g>
                ))}
              </g>
            );
          }
          if (d.kind === 'house') {
            const [x, y] = [fx(d.x), fy(d.y)];
            return (
              <g key={i}>
                <rect x={x - 30} y={y - 20} width="64" height="44" rx="2" fill="#06170c" opacity="0.4" />
                <rect x={x - 34} y={y - 24} width="64" height="44" rx="2" fill="#7a3b2a" />
                <path d={`M${x - 34},${y - 2} H${x + 30}`} stroke="#5d2c1f" strokeWidth="2" />
                <path d={`M${x - 34},${y - 24} L${x - 2},${y - 2} L${x + 30},${y - 24} M${x - 34},${y + 20} L${x - 2},${y - 2} L${x + 30},${y + 20}`} stroke="#8e4a36" strokeWidth="1" fill="none" />
                <rect x={x - 38} y={y + 22} width="72" height="16" rx="1" fill="#b8a98a" />
                {[-24, -2, 20].map((tx) => (
                  <g key={tx}>
                    <circle cx={x + tx} cy={y + 30} r="5" fill="#f3f6ef" />
                    <circle cx={x + tx} cy={y + 30} r="1.5" fill="#ef3b2c" />
                  </g>
                ))}
              </g>
            );
          }
          return null;
        })}

        {along.avenue.map(([x, y], i) => (
          <Tree key={`av${i}`} x={x} y={y} r={14 + (i % 3) * 3} />
        ))}

        <path d={layout.d} fill="none" stroke="#0c2e1e" strokeOpacity="0.35" strokeWidth="30" strokeLinecap="round" />
        <path ref={path} d={layout.d} fill="none" stroke="#c9c4b2" strokeWidth="22" strokeLinecap="round" />
        <path d={layout.d} fill="none" stroke="#a9a38f" strokeWidth="22" strokeDasharray="1.5 34" />

        {along.bridge && (
          <g transform={`translate(${along.bridge.x} ${along.bridge.y}) rotate(${along.bridge.a})`}>
            <rect x="-26" y="-17" width="52" height="34" rx="2" fill="#8a6a44" />
            {[-18, -9, 0, 9, 18].map((bx) => (
              <line key={bx} x1={bx} y1="-17" x2={bx} y2="17" stroke="#6b5033" strokeWidth="1.5" />
            ))}
            <line x1="-26" y1="-17" x2="26" y2="-17" stroke="#f3f6ef" strokeWidth="2.5" />
            <line x1="-26" y1="17" x2="26" y2="17" stroke="#f3f6ef" strokeWidth="2.5" />
          </g>
        )}

        {route.deco.map((d, i) =>
          d.kind === 'note' && wide ? (
            <text key={`n${i}`} x={fx(d.x)} y={fy(d.y)} textAnchor={d.anchor ?? 'start'} fontFamily="'Nanum Pen Script', cursive" fontSize="24" fill="#e7d39a" stroke="#0c2e1e" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke">
              {d.text}
            </text>
          ) : null
        )}
      </svg>
      {active && cart && (
        <div className="absolute left-0 top-0 will-change-transform" style={{ transform: `translate(${cart.x}px, ${cart.y}px) translate(-50%, -50%) rotate(${cart.a}deg)` }}>
          <CartGlyph size={60} />
        </div>
      )}
    </div>
  );
};

export default CartPath;
