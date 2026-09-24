import React from 'react';
import { HOLES } from '@/content';
import { useRound } from '@/lib/round';
import { scoreName, withArticle } from '@/lib/golf';
import { CartGlyph } from './Controls';

/**
 * The end of the open course in cart mode: a roped-off cart path with the
 * cart parked at it. Finishing the hole above turns the rope into a button.
 */
const CartGate = ({ hole }: { hole: number }) => {
  const { scores, drive, choose } = useRound();
  const score = scores[hole - 1];
  const next = HOLES[hole];
  const par = HOLES[hole - 1].par;

  return (
    <div id="cart-gate" className="relative mx-auto max-w-[1320px] px-4 sm:px-8 pb-40 scroll-mt-24">
      <div className="flex flex-col items-center text-center">
        <div aria-hidden="true" className="relative w-24 h-28">
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[22px] bg-[#c9c4b2] rounded-b-full shadow-[0_0_0_4px_rgba(12,46,30,0.35)]" />
          {score === null && (
            <svg className="absolute inset-x-0 top-16 w-full h-10 overflow-visible" viewBox="0 0 96 40">
              <rect x="10" y="4" width="5" height="30" rx="1" fill="#f3f6ef" />
              <rect x="81" y="4" width="5" height="30" rx="1" fill="#f3f6ef" />
              <path d="M13 8 Q48 26 83 8" fill="none" stroke="#ef3b2c" strokeWidth="2.5" strokeDasharray="6 4" />
            </svg>
          )}
          <div className="absolute left-1/2 top-3 -translate-x-1/2 rotate-90">
            <CartGlyph size={52} />
          </div>
        </div>

        <div className="mt-6 max-w-md">
          {score === null ? (
            <>
              <p className="font-display uppercase text-chalk text-3xl sm:text-4xl leading-none" style={{ fontWeight: 800 }}>
                Cart path closed
              </p>
              <p className="mt-3 text-lg text-mist">
                Finish hole {hole} to drive to hole {next.n}, {next.short === 'Work' ? 'Experience' : next.short}.
              </p>
              <button type="button" onClick={() => choose('scroll')} className="mt-3 text-sm text-moss underline decoration-chalk/30 hover:text-chalk">
                Or switch to scrolling and see everything
              </button>
            </>
          ) : (
            <>
              <p className="font-pencil text-3xl text-sand">
                {score === 10 ? 'a 10. shake it off.' : `carded ${withArticle(scoreName(score, par))}.`}
              </p>
              <button type="button" onClick={() => drive(next.n)} className="btn-flag mt-4 text-lg px-7 py-4">
                Drive to hole {next.n}
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartGate;
