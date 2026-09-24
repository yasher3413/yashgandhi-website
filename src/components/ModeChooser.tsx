import React, { useEffect, useRef } from 'react';
import { useRound, type Mode } from '@/lib/round';
import { CartPictogram, ScrollPictogram } from './course/Controls';

const OPTIONS: { mode: Mode; name: string; body: string; detail: string; Icon: typeof CartPictogram }[] = [
  {
    mode: 'cart',
    name: 'Carting',
    body: 'Play all nine holes. Each section opens once you finish the hole before it, and the cart drives you to the next tee.',
    detail: 'Post your 9-hole score at the end',
    Icon: CartPictogram,
  },
  {
    mode: 'scroll',
    name: 'Scrolling',
    body: 'See the whole site right away, top to bottom. Hole 1 is still there if you want a swing.',
    detail: 'Nothing is locked',
    Icon: ScrollPictogram,
  },
];

/** Asked once per visit, before the first tee: cart the course or scroll the site. */
const ModeChooser = () => {
  const { ready, mode, choose } = useRound();
  const first = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const open = ready && mode === null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') choose('scroll');
      if (e.key === 'Tab' && card.current) {
        const items = card.current.querySelectorAll<HTMLButtonElement>('button');
        const [a, b] = [items[0], items[items.length - 1]];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, choose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-deep/75 sm:p-6 animate-[fadein_0.3s_ease-out]">
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mode-title"
        className="w-full sm:max-w-2xl bg-card text-ink rounded-t-[10px] sm:rounded-[6px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8 animate-[sheet_0.45s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <h2 id="mode-title" className="font-display uppercase leading-[0.9] text-4xl sm:text-5xl" style={{ fontWeight: 900 }}>
          How are you getting around?
        </h2>
        <p className="mt-2 font-pencil text-2xl text-[#2b2f8a]">nine holes, one site. your call.</p>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {OPTIONS.map(({ mode, name, body, detail, Icon }, i) => (
            <button
              key={mode}
              ref={i === 0 ? first : undefined}
              type="button"
              onClick={() => choose(mode)}
              className="group text-left rounded-[4px] border border-ink/20 bg-white/60 p-4 sm:p-5 transition-[border-color,background-color,transform] duration-200 hover:border-ink hover:bg-white hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ink"
            >
              <span className="flex items-center gap-3">
                <Icon className="w-7 h-7 text-ink" />
                <span className="font-display uppercase text-3xl leading-none" style={{ fontWeight: 800 }}>
                  {name}
                </span>
              </span>
              <span className="mt-3 block text-[15px] leading-snug text-ink/85">{body}</span>
              <span className="mt-3 block font-mono text-[11px] text-ink/75">{detail}</span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-ink/75">You can switch any time from the scorecard at the bottom of the screen.</p>
      </div>
    </div>
  );
};

export default ModeChooser;
