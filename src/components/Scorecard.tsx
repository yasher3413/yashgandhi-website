import React, { useEffect, useState } from 'react';
import { HOLES } from '@/content';
import { useRound, isOpen } from '@/lib/round';
import { toPar } from '@/lib/golf';
import { CartPictogram, ScrollPictogram } from './course/Controls';

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

/** Scorecard shorthand: circles under par, squares over. */
const Mark = ({ strokes, par }: { strokes: number; par: number }) => {
  const d = strokes - par;
  const ring = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#2b2f8a]/70 pointer-events-none';
  return (
    <span className="relative inline-block -rotate-3 leading-none">
      {strokes}
      {d <= -1 && <span className={`${ring} w-[19px] h-[19px] rounded-full`} />}
      {d <= -2 && <span className={`${ring} w-[24px] h-[24px] rounded-full`} />}
      {d >= 1 && <span className={`${ring} w-[17px] h-[17px]`} />}
      {d >= 2 && <span className={`${ring} w-[22px] h-[22px]`} />}
    </span>
  );
};

const ModeSwitch = () => {
  const { mode, choose } = useRound();
  if (!mode) return null;
  return (
    <div role="radiogroup" aria-label="Getting around" className="flex text-ink rounded-t-[4px] overflow-hidden text-[11px] font-semibold shadow-[0_-6px_14px_-8px_rgba(0,0,0,0.4)]">
      {(['cart', 'scroll'] as const).map((m) => {
        const on = mode === m;
        const Icon = m === 'cart' ? CartPictogram : ScrollPictogram;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => !on && choose(m)}
            className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors ${on ? 'bg-card text-ink shadow-[inset_0_-2px_0_#ef3b2c]' : 'bg-[#cfd8cf] text-ink/75 hover:bg-[#dfe5dc]'}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {m === 'cart' ? 'Carting' : 'Scrolling'}
          </button>
        );
      })}
    </div>
  );
};

const Scorecard = () => {
  const round = useRound();
  const cart = round.mode === 'cart';
  const [active, setActive] = useState(1);
  const [played, setPlayed] = useState<Set<number>>(() => new Set([1]));
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('scorecard');
      // phones start folded so the card never sits on the first tee
      setCollapsed(saved ? saved === 'collapsed' : window.innerWidth < 640);
    } catch {
      // ignore
    }
  }, []);
  const fold = (next: boolean) => {
    setCollapsed(next);
    try {
      localStorage.setItem('scorecard', next ? 'collapsed' : 'open');
    } catch {
      // ignore
    }
  };

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

  const under = played.size; // scrolling: one birdie per hole visited
  const score = PAR - under;
  const carded = round.scores.map((s, i) => (s === null ? null : { s, par: HOLES[i].par })).filter(Boolean) as { s: number; par: number }[];
  const cartTotal = carded.reduce((a, c) => a + c.s, 0);
  const cartToPar = carded.reduce((a, c) => a + c.s - c.par, 0);

  return (
    <nav aria-label="Sections" className="fixed bottom-3 sm:bottom-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      <div className="flex flex-col pointer-events-auto">
      <div className="flex items-end justify-between px-1">
        <ModeSwitch />
        {!collapsed && (
          <button
            type="button"
            onClick={() => fold(true)}
            aria-expanded="true"
            aria-controls="scorecard-table"
            className="ml-auto flex items-center gap-1 rounded-t-[4px] bg-[#cfd8cf] hover:bg-[#dfe5dc] text-ink/80 px-2.5 py-1 text-[11px] font-semibold transition-colors"
          >
            Hide card
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
      {collapsed ? (
        <button
          type="button"
          onClick={() => fold(false)}
          aria-expanded="false"
          aria-controls="scorecard-table"
          aria-label={`Show scorecard. On hole ${active}, ${HOLES[active - 1].short}.`}
          className="self-center flex items-center gap-3 bg-card text-ink rounded-[4px] pl-2 pr-3 py-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6),0_2px_6px_-2px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-transform"
        >
          <span className="relative w-8 h-8 grid place-items-center font-display text-xl" style={{ fontWeight: 800 }}>
            {active}
            <Circle key={`pill${active}`} seed={active} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em]">{HOLES[active - 1].short}</span>
          <span className="font-pencil text-xl leading-none text-[#2b2f8a] -rotate-3">{cart ? (carded.length ? toPar(cartToPar) : '') : under ? `−${under}` : 'E'}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="text-ink/60"><path d="M2 6.5l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      ) : (
      <div id="scorecard-table" className="bg-card text-ink rounded-[4px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6),0_2px_6px_-2px_rgba(0,0,0,0.35)] overflow-hidden">
        <table className="border-collapse text-center tabular">
          <tbody>
            <tr className="hidden md:table-row">
              <th scope="row" className="border-b border-ink/15">
                <span className="sr-only">Section</span>
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className={`px-0 pt-1 pb-0.5 border-b border-l border-ink/15 text-[9px] uppercase tracking-[0.06em] font-semibold ${active === h.n ? 'text-flag' : 'text-ink/75'}`}>
                  {h.short}
                </td>
              ))}
              <td className="border-b border-l border-ink/15" />
            </tr>
            <tr>
              <th scope="row" className="px-2 text-left font-mono text-[9px] font-medium text-ink/75 border-b border-ink/15">
                HOLE
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className="p-0 border-b border-l border-ink/15">
                  <button
                    onClick={() => go(h.id)}
                    disabled={!isOpen(round, h.n)}
                    aria-label={`Hole ${h.n}: ${h.short}${isOpen(round, h.n) ? '' : ' (locked until you reach it)'}`}
                    aria-current={active === h.n ? 'location' : undefined}
                    className="relative block w-[28px] sm:w-[36px] md:w-[48px] h-7 font-display text-lg leading-7 hover:bg-ink/5 focus-visible:bg-ink/5 transition-colors disabled:text-ink/25 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    style={{ fontWeight: 800 }}
                  >
                    {h.n}
                    {active === h.n && <Circle key={`c${h.n}`} seed={h.n} />}
                  </button>
                </td>
              ))}
              <td className="px-2 border-b border-l border-ink/15 font-mono text-[9px] font-medium text-ink/75">OUT</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 text-left font-mono text-[9px] font-medium text-ink/75 border-b border-ink/15">
                PAR
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className="border-b border-l border-ink/15 font-mono text-[10px] text-ink/70 h-[18px]">
                  {h.par}
                </td>
              ))}
              <td className="border-b border-l border-ink/15 font-mono text-[10px] text-ink/70">{PAR}</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 text-left font-mono text-[9px] font-medium text-ink/75">
                YOU
              </th>
              {HOLES.map((h) => (
                <td key={h.n} className="border-l border-ink/15 h-6 font-pencil text-[19px] leading-none text-[#2b2f8a]">
                  {cart ? (
                    round.scores[h.n - 1] !== null && <Mark strokes={round.scores[h.n - 1]!} par={h.par} />
                  ) : (
                    played.has(h.n) && <span className="inline-block -rotate-3">{h.par - 1}</span>
                  )}
                </td>
              ))}
              <td className="border-l border-ink/15 font-pencil text-[18px] leading-none text-[#2b2f8a] px-1">
                {cart ? (
                  <>
                    <span className="inline-block -rotate-3 whitespace-nowrap">{carded.length ? toPar(cartToPar) : ''}</span>
                    <span className="sr-only">{carded.length ? `, ${cartTotal} strokes through ${carded.length}` : ''}</span>
                  </>
                ) : (
                  <>
                    <span className="inline-block -rotate-3 whitespace-nowrap">{under ? `−${under}` : 'E'}</span>
                    <span className="sr-only">, {score} strokes</span>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      )}
      </div>
    </nav>
  );
};

export default Scorecard;
