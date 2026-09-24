import { useEffect, useRef, useState } from 'react';
import type { Pt } from './course';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Flies a ball to `target`. Returns the ground position and the height of the
 * ball above it (0..1), so the caller can draw the ball and its shadow apart.
 */
export const useFlight = (target: Pt, ms = 900) => {
  const [state, setState] = useState({ pos: target, lift: 0, flying: false });
  const from = useRef<Pt>(target);
  const raf = useRef(0);

  useEffect(() => {
    const start = from.current;
    if (start[0] === target[0] && start[1] === target[1]) return;
    if (reduced()) {
      from.current = target;
      setState({ pos: target, lift: 0, flying: false });
      return;
    }
    const d = Math.hypot(target[0] - start[0], target[1] - start[1]);
    const dur = Math.min(1400, Math.max(450, ms * (d / 300)));
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      // ball decelerates along the ground track; height is a parabola
      const e = 1 - Math.pow(1 - t, 2.2);
      const pos: Pt = [start[0] + (target[0] - start[0]) * e, start[1] + (target[1] - start[1]) * e];
      const lift = Math.sin(Math.PI * Math.min(1, t * 1.08)) * Math.min(1, d / 220);
      from.current = pos;
      setState({ pos, lift: Math.max(0, lift), flying: t < 1 });
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms]);

  return state;
};
