import React from 'react';
import CourseArt, { type HoleSpec } from './CourseArt';
import PlayLayer from './PlayLayer';
import { SoundToggle, WindVane } from './Controls';
import { useGolf } from '@/lib/useGolf';
import { useRound } from '@/lib/round';
import { useMedia } from '@/lib/useMedia';
import { scoreName, withArticle } from '@/lib/golf';

type Props = { spec: HoleSpec; n: number; par: number; className?: string };

/** A section's hole in cart mode: the same drawing, now played for real. */
const PlayableHole = ({ spec, n, par, className = '' }: Props) => {
  const round = useRound();
  const touch = useMedia('(hover: none)');
  const done = round.scores[n - 1];
  const g = useGolf({
    spec,
    par,
    wind: round.winds[n - 1],
    sound: round.sound,
    touch,
    done,
    onHoled: (s) => round.record(n, s),
  });

  return (
    <div className="flex flex-col select-none">
      <div className="flex items-center justify-between gap-3 px-1 pb-2">
        <WindVane wind={round.winds[n - 1]} />
        <SoundToggle on={round.sound} onToggle={round.toggleSound} />
      </div>
      <CourseArt spec={spec} className={`touch-manipulation ${className}`}>
        {() => <PlayLayer spec={spec} g={g} />}
      </CourseArt>
      <p className="mt-2 px-1 font-mono text-xs text-moss tabular min-h-[1.75rem]" aria-live="polite">
        {g.holed ? (
          <span className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-pencil text-2xl text-sand">
              {g.strokes >= 10 ? 'a 10 on the card.' : `holed in ${g.strokes}. ${withArticle(scoreName(g.strokes, par))}.`}
            </span>
            {n < 9 && round.unlocked === n && !round.drivingTo && (
              <button type="button" onClick={() => round.drive(n + 1)} className="btn-flag py-2 px-4 text-sm font-sans">
                Drive to hole {n + 1}
              </button>
            )}
          </span>
        ) : g.strokes === 0 ? (
          <span className="font-pencil text-xl text-sand">grab the ball, pull back, let go</span>
        ) : (
          <>
            Stroke {g.strokes} <span className="text-chalk/30 px-1">/</span> {g.putting ? 'on the green' : `${g.toPin} yds to pin`}
          </>
        )}
      </p>
    </div>
  );
};

export default PlayableHole;
