import React, { useEffect, useState } from 'react';
import { HOLES } from '@/content';

const Circle = ({ color = '#ef3b2c', seed = 0 }: { color?: string; seed?: number }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 40 40" aria-hidden="true">
    <path
      className="pencil-draw"
      style={{ ['--len' as string]: 130 }}
      d={seed % 2 ? 'M29 8 C 18 2, 4 10, 6 22 C 8 34, 30 36, 34 24 C 37 14, 28 6, 18 7' : 'M10 10 C 20 3, 36 9, 34 22 C 32 34, 10 36, 6 24 C 3 15, 12 7, 24 7'}
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const PAR = HOLES.reduce((s, h) => s + h.par, 0);

const Scorecard = () => {
  const [active, setActive] = useState(1);
  const [played, setPlayed] = useState<Set<number>>(() => new Set([1]));

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.45;
      let cur = 1;
      document.querySelectorAll<HTMLElement>('[data-hole]').forEach((el) => {
        if (el.getBoundingClientRect().top < line) cur = Number(el.dataset.hole);
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) cur = HOLES.length;
      setActive(cur);
      setPlayed((p) => (p.has(cur) ? p : new Set(p).add(cur)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const under = played.size; // one birdie per hole visited
  const score = PAR - under;

  return (
    <nav aria-label="Sections" className="fixed bottom-3 sm:bottom-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      <div className="pointer-events-auto bg-card text-ink rounded-[4px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6),0_2px_6px_-2px_rgba(0,0,0,0.35)] overflow-hidden">
        <table className="border-collapse text-center tabular">
          <tbody>
            <tr className="hidden md:table-row">
              <th scope="row" className="border-b border-ink/15">
                <span className="sr-only">Section</span>
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className={`px-0 pt-1.5 pb-1 border-b border-l border-ink/15 text-[10px] uppercase tracking-[0.08em] font-semibold ${active === h.n ? 'text-flag' : 'text-ink/75'}`}>
                  {h.short}
                </td>
              ))}
              <td className="border-b border-l border-ink/15" />
            </tr>
            <tr>
              <th scope="row" className="px-2 sm:px-3 text-left font-mono text-[10px] font-medium text-ink/75 border-b border-ink/15">
                HOLE
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className="p-0 border-b border-l border-ink/15">
                  <button
                    onClick={() => go(h.id)}
                    aria-label={`Hole ${h.n}: ${h.short}`}
                    aria-current={active === h.n ? 'location' : undefined}
                    className="relative block w-[30px] sm:w-[40px] md:w-[62px] h-8 font-display text-xl leading-8 hover:bg-ink/5 focus-visible:bg-ink/5 transition-colors"
                    style={{ fontWeight: 800 }}
                  >
                    {h.n}
                    {active === h.n && <Circle key={`c${h.n}`} seed={h.n} />}
                  </button>
                </td>
              ))}
              <td className="px-2 sm:px-3 border-b border-l border-ink/15 font-mono text-[10px] font-medium text-ink/75">OUT</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 sm:px-3 text-left font-mono text-[10px] font-medium text-ink/75 border-b border-ink/15">
                PAR
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className="border-b border-l border-ink/15 font-mono text-[11px] text-ink/70 h-5">
                  {h.par}
                </td>
              ))}
              <td className="border-b border-l border-ink/15 font-mono text-[11px] text-ink/70">{PAR}</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 sm:px-3 text-left font-mono text-[10px] font-medium text-ink/75">
                YOU
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className="border-l border-ink/15 h-7 font-pencil text-[22px] leading-none text-[#2b2f8a]">
                  {played.has(h.n) && <span className="inline-block -rotate-3">{h.par - 1}</span>}
                </td>
              ))}
              <td className="border-l border-ink/15 font-pencil text-[20px] leading-none text-[#2b2f8a] px-1">
                <span className="inline-block -rotate-3 whitespace-nowrap">{under ? `−${under}` : 'E'}</span>
                <span className="sr-only">, {score} strokes</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </nav>
  );
};

export default Scorecard;
