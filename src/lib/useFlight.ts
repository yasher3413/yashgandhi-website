import { useEffect, useRef, useState } from 'react';
import type { Pt } from './course';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const same = (a: Pt, b: Pt) => a[0] === b[0] && a[1] === b[1];

/** The control point of a drawn flight line; arcPath() uses the same one. */
export const flightControl = (a: Pt, b: Pt, bend: number): Pt => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return [(a[0] + b[0]) / 2 - dy * bend, (a[1] + b[1]) / 2 + dx * bend];
};

const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
};

type Flight = { pos: Pt; lift: number; progress: number; origin: Pt; ctrl: Pt };

/**
 * Moves a ball to `target` along a gentle curve (`bend`, the same curve the
 * trail is drawn with). In the air it arcs (lift is its height, 0..1); a `roll`
 * stays on the ground and slows the way a putt does. `flying` is true from the
 * moment the target changes until the ball is at rest on it.
 */
export const useFlight = (target: Pt, ms = 900, roll = false, bend = 0) => {
  const [state, setState] = useState<Flight>({ pos: target, lift: 0, progress: 1, origin: target, ctrl: target });
  const at = useRef<Pt>(target);
  const raf = useRef(0);

  useEffect(() => {
    const start = at.current;
    if (same(start, target)) return;
    if (reduced()) {
      at.current = target;
      setState({ pos: target, lift: 0, progress: 1, origin: start, ctrl: flightControl(start, target, bend) });
      return;
    }
    const ctrl = flightControl(start, target, bend);
    const d = Math.hypot(target[0] - start[0], target[1] - start[1]);
    const dur = roll ? Math.min(1600, Math.max(500, d * 9)) : Math.min(1400, Math.max(450, ms * (d / 300)));
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = roll ? 1 - Math.pow(1 - t, 3) : 1 - Math.pow(1 - t, 2.2);
      const pos = t >= 1 ? target : quad(start, ctrl, target, e);
      const lift = roll ? 0 : Math.sin(Math.PI * Math.min(1, t * 1.08)) * Math.min(1, d / 220);
      at.current = pos;
      setState({ pos, lift: t >= 1 ? 0 : Math.max(0, lift), progress: t >= 1 ? 1 : e, origin: start, ctrl });
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms, roll, bend]);

  return { ...state, flying: !same(state.pos, target) };
};

/** The part of a flight line already travelled: the curve from origin to `progress`. */
export const partialFlight = (f: { origin: Pt; ctrl: Pt; pos: Pt; progress: number }) => {
  const c: Pt = [f.origin[0] + (f.ctrl[0] - f.origin[0]) * f.progress, f.origin[1] + (f.ctrl[1] - f.origin[1]) * f.progress];
  return `M${f.origin[0]},${f.origin[1]} Q${c[0]},${c[1]} ${f.pos[0]},${f.pos[1]}`;
};
