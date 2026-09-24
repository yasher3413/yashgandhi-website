import React, { useEffect, useMemo, useRef } from 'react';
import { contourRings, hills } from '@/lib/course';

/** The ground under the whole page: faint survey contours that brighten under the pointer. */
const TopoField = () => {
  const lit = useRef<HTMLDivElement>(null);
  const rings = useMemo(() => hills(1600, 1000, 11, 1907, 1.25).flatMap(contourRings), []);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      lit.current?.style.setProperty('--mx', `${x}px`);
      lit.current?.style.setProperty('--my', `${y}px`);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const svg = (opacity: number) => (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <g fill="none" stroke="#f3f6ef" strokeOpacity={opacity} strokeWidth="1">
        {rings.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-0 pointer-events-none">
      <div className="absolute inset-0">{svg(0.05)}</div>
      <div ref={lit} className="absolute inset-0 topo-lit">
        {svg(0.32)}
      </div>
    </div>
  );
};

export default TopoField;
