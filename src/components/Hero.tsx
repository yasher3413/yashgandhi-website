import React, { useState } from 'react';
import CourseArt, { pinOf, teeOf } from './course/CourseArt';
import PlayLayer from './course/PlayLayer';
import { SoundToggle, WindVane } from './course/Controls';
import HoleOut from './HoleOut';
import { heroSpec as spec, RESUME } from '@/content';
import { useGolf } from '@/lib/useGolf';
import { useRound } from '@/lib/round';
import { useMedia } from '@/lib/useMedia';
import { scoreName, withArticle } from '@/lib/golf';

const tee = teeOf(spec);
const pin = pinOf(spec);

/** Hole 1 itself. Remounted when the visitor changes how they get around. */
const FirstTee = () => {
  const round = useRound();
  const cart = round.mode === 'cart';
  const touch = useMedia('(hover: none)');
  const [showBoard, setShowBoard] = useState(false);
  const g = useGolf({
    spec,
    par: 4,
    wind: round.winds[0],
    sound: round.sound,
    touch,
    done: cart ? round.scores[0] : null,
    onHoled: (s) => {
      if (cart) round.record(1, s);
    },
  });

  return (
    <>
      <div className="absolute left-1 top-0 z-10 pointer-events-none select-none">
        <p className="font-display text-chalk text-5xl sm:text-6xl leading-none" style={{ fontWeight: 900 }}>1</p>
        <p className="font-mono text-[11px] text-moss mt-1 tabular">PAR 4 / {spec.yards} YDS</p>
        <WindVane wind={round.winds[0]} className="mt-2" />
      </div>

      <div className="-mx-4 sm:mx-0">
        <CourseArt spec={spec} flag={false} className="w-full h-auto touch-manipulation select-none">
          {() => (
            <PlayLayer spec={spec} g={g}>
              {/* caddie notes */}
              <g pointerEvents="none" fontFamily="'Nanum Pen Script', cursive" fill="#f3f6ef" stroke="#0c2e1e" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke">
                <line x1={tee[0] + 14} y1={tee[1] + 10} x2={tee[0] + 58} y2={tee[1] + 44} stroke="#f3f6ef" strokeOpacity="0.55" />
                <circle cx={tee[0] + 14} cy={tee[1] + 10} r="2" />
                <text x={tee[0] + 62} y={tee[1] + 52} fontSize="30">you are here: Toronto</text>

                <line x1="330" y1="300" x2="238" y2="236" stroke="#f3f6ef" strokeOpacity="0.55" />
                <circle cx="330" cy="300" r="2" />
                <text x="232" y="228" fontSize="28" textAnchor="end">Business &amp; CS,</text>
                <text x="232" y="256" fontSize="28" textAnchor="end">Western</text>

                <line x1="566" y1="226" x2="560" y2="150" stroke="#f3f6ef" strokeOpacity="0.55" />
                <circle cx="566" cy="226" r="2" />
                <text x="560" y="116" fontSize="28" textAnchor="end">just played: AI engineering</text>
                <text x="560" y="142" fontSize="28" textAnchor="end">@ T-Mobile, summer &apos;26</text>
              </g>

              {/* the flag doubles as the resume; the pole and cup stay playable */}
              <line x1={pin[0]} y1={pin[1]} x2={pin[0]} y2={pin[1] - 58} stroke="#f3f6ef" strokeWidth="2.4" strokeLinecap="round" pointerEvents="none" />
              <a href={RESUME} target="_blank" rel="noopener noreferrer" aria-label="Open resume (PDF)">
                <path className="flag-wave" d={`M${pin[0] + 1},${pin[1] - 58} l32,9 l-32,10 z`} fill="#ef3b2c" />
                <text x={pin[0] + 40} y={pin[1] - 46} fontFamily="'Nanum Pen Script', cursive" fontSize="28" fill="#f3f6ef">resume</text>
                <rect x={pin[0] - 4} y={pin[1] - 66} width="92" height="34" fill="transparent" className="cursor-pointer" />
              </a>
            </PlayLayer>
          )}
        </CourseArt>
      </div>

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-1 font-mono text-xs text-moss tabular">
        <span aria-live="polite">
          {g.holed ? (
            cart ? (
              <span className="font-pencil text-2xl text-sand">
                {g.strokes >= 10 ? 'a 10 on the card.' : `holed in ${g.strokes}. ${withArticle(scoreName(g.strokes, 4))}.`}
              </span>
            ) : null
          ) : g.strokes === 0 ? (
            <span className="font-pencil text-xl text-sand">grab the ball, pull back, let go</span>
          ) : (
            <>
              Stroke {g.strokes} <span className="text-chalk/30 px-1">/</span> {g.putting ? 'on the green' : `${g.toPin} yds to pin`}
            </>
          )}
        </span>
        <span className="flex items-center gap-4 font-sans text-sm">
          <SoundToggle on={round.sound} onToggle={round.toggleSound} />
          {!cart && !g.holed && (
            <button type="button" onClick={() => setShowBoard((v) => !v)} aria-expanded={showBoard} className="text-moss hover:text-chalk underline decoration-chalk/30">
              Leaderboard
            </button>
          )}
          {!cart && g.strokes > 0 && !g.holed && (
            <button type="button" onClick={g.reset} className="text-moss hover:text-chalk underline decoration-chalk/30">
              Reset
            </button>
          )}
          {cart && g.holed && round.unlocked === 1 && !round.drivingTo && (
            <button type="button" onClick={() => round.drive(2)} className="btn-flag py-2 px-4 text-sm">
              Drive to hole 2
            </button>
          )}
        </span>
      </div>

      {!cart && (g.holed || showBoard) && <HoleOut kind="hole1" strokes={g.holed ? g.strokes : null} onReset={g.holed ? g.reset : undefined} />}
    </>
  );
};

const Hero = () => {
  const round = useRound();
  const lockedContact = round.mode === 'cart' && round.unlocked < 9;

  return (
    <section id="home" data-hole={1} className="relative min-h-[100svh] overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 pt-10 sm:pt-14 pb-40 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center min-h-[100svh]">
        <div className="lg:col-span-5 relative z-10">
          <h1 className="font-display uppercase text-chalk leading-[0.8] tracking-[-0.01em] text-[clamp(5.2rem,17vw,11.5rem)] lg:text-[clamp(6rem,11vw,11.5rem)]" style={{ fontWeight: 900 }}>
            Yash
            <br />
            Gandhi
          </h1>
          <p className="mt-7 text-xl sm:text-2xl text-chalk font-medium max-w-md">Engineer &amp; Operations Analyst</p>
          <p className="mt-2 text-base text-moss">Toronto, Canada</p>
          <p className="sm:hidden mt-3 font-pencil text-2xl leading-tight text-sand">just played: AI engineering @ T-Mobile, summer &apos;26</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="btn-flag">
              <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true">
                <path d="M1.5 1v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M2.5 1.5l10 3.2-10 3.3z" fill="currentColor" />
              </svg>
              Resume
            </a>
            <a href={lockedContact ? '#cart-gate' : '#contact'} className="btn-line">
              Contact Me
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 relative">
          <FirstTee key={round.mode ?? 'none'} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
