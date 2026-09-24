import React, { useEffect, useRef } from 'react';
import HoleOut from './HoleOut';
import { HOLES } from '@/content';
import { useRound } from '@/lib/round';
import { COURSE_PAR } from '@/lib/golf';

/** After the ninth hole in cart mode: the finished card, and the round leaderboard. */
const Clubhouse = () => {
  const { scores, restart } = useRound();
  const ref = useRef<HTMLElement>(null);
  const holes = scores as number[];
  const total = holes.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900);
    return () => clearTimeout(t);
  }, []);

  const again = () => {
    restart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={ref} id="clubhouse" aria-labelledby="clubhouse-title" className="relative scroll-mt-4 py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <h2 id="clubhouse-title" className="font-display uppercase text-chalk leading-[0.85] text-6xl sm:text-8xl" style={{ fontWeight: 900 }}>
          Round complete
        </h2>

        <div className="mt-10 overflow-x-auto">
          <table className="bg-card text-ink rounded-[4px] border-collapse text-center tabular shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)]">
            <tbody>
              <tr>
                <th scope="row" className="px-3 py-2 text-left font-mono text-[11px] font-medium text-ink/75 border-b border-ink/15">HOLE</th>
                {HOLES.map((h) => (
                  <td key={h.n} className="w-11 sm:w-14 border-b border-l border-ink/15 font-display text-2xl" style={{ fontWeight: 800 }}>{h.n}</td>
                ))}
                <td className="px-3 border-b border-l border-ink/15 font-mono text-[11px] text-ink/75">TOT</td>
              </tr>
              <tr>
                <th scope="row" className="px-3 py-1.5 text-left font-mono text-[11px] font-medium text-ink/75 border-b border-ink/15">PAR</th>
                {HOLES.map((h) => (
                  <td key={h.n} className="border-b border-l border-ink/15 font-mono text-sm text-ink/75">{h.par}</td>
                ))}
                <td className="border-b border-l border-ink/15 font-mono text-sm text-ink/75">{COURSE_PAR}</td>
              </tr>
              <tr>
                <th scope="row" className="px-3 py-2 text-left font-mono text-[11px] font-medium text-ink/75">YOU</th>
                {HOLES.map((h, i) => (
                  <td key={h.n} className={`border-l border-ink/15 font-pencil text-3xl leading-none ${holes[i] < h.par ? 'text-flag' : 'text-[#2b2f8a]'}`}>
                    {holes[i]}
                  </td>
                ))}
                <td className="border-l border-ink/15 px-3 font-pencil text-3xl leading-none text-[#2b2f8a]">{total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 max-w-3xl">
          <HoleOut kind="round" strokes={total} holes={holes} />
        </div>
        <button type="button" onClick={again} className="btn-line mt-8">
          Play another round
        </button>
      </div>
    </section>
  );
};

export default Clubhouse;
