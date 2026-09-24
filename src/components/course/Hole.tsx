import React, { useRef } from 'react';
import HoleMap from './HoleMap';
import type { HoleSpec } from './CourseArt';
import { useActiveShot } from '@/lib/useActiveShot';
import { useRound } from '@/lib/round';
import { useMedia } from '@/lib/useMedia';
import PlayableHole from './PlayableHole';

type Props = {
  id: string;
  n: number;
  name: string;
  par: number;
  yards: string;
  spec: HoleSpec;
  labels: string[];
  side?: 'left' | 'right';
  note?: string;
  hideYards?: boolean;
  children: React.ReactNode;
};

export const TeeSign = ({ n, name, par, yards, note }: Pick<Props, 'n' | 'name' | 'par' | 'yards' | 'note'>) => (
  <header className="flex items-stretch gap-4 sm:gap-6">
    <div className="grid place-items-center shrink-0 w-[4.5rem] sm:w-28 bg-deep rounded-[4px] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.7)] ring-1 ring-chalk/10">
      <span className="font-display text-chalk text-6xl sm:text-8xl leading-none tabular" style={{ fontWeight: 900 }}>
        {n}
      </span>
    </div>
    <div className="flex flex-col justify-center min-w-0">
      <h2 className="font-display text-chalk uppercase leading-[0.86] text-5xl sm:text-7xl lg:text-8xl" style={{ fontWeight: 800 }}>
        {name}
      </h2>
      <p className="mt-2 font-mono text-xs sm:text-sm text-moss tracking-wide tabular">
        PAR {par} <span className="text-chalk/30 px-1">/</span> {yards} YDS
        {note && <span className="font-pencil text-sand text-xl sm:text-2xl tracking-normal ml-3 align-middle">{note}</span>}
      </p>
    </div>
  </header>
);

const Hole = ({ id, n, name, par, yards, spec, labels, side = 'left', note, hideYards, children }: Props) => {
  const body = useRef<HTMLDivElement>(null);
  const active = useActiveShot(body);
  const mapFirst = side === 'left';
  const { mode } = useRound();
  const wide = useMedia('(min-width: 1024px)', true);
  const cart = mode === 'cart';
  const playable = <PlayableHole key={`p${spec.seed}`} spec={spec} n={n} par={par} className={wide ? 'mx-auto h-[calc(100vh-17rem)] w-auto max-w-full' : 'w-full h-auto'} />;

  return (
    <section id={id} data-hole={n} className="relative scroll-mt-4 py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className={`grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-12`}>
          <div className={`hidden lg:block lg:col-span-5 ${mapFirst ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="sticky top-6">
              {cart && wide ? (
                playable
              ) : (
                <HoleMap key={spec.seed} spec={spec} active={active} labels={labels} hideYards={hideYards} className="animate-[fadein_0.6s_ease-out] mx-auto h-[calc(100vh-10rem)] w-auto max-w-full" />
              )}
            </div>
          </div>
          <div className={`lg:col-span-7 ${mapFirst ? 'lg:order-2' : 'lg:order-1'}`}>
            <TeeSign n={n} name={name} par={par} yards={yards} note={note} />
            <div className={`${cart ? 'hidden' : ''} lg:hidden mt-6 sticky top-0 z-10 -mx-4 px-4 py-1 bg-rough border-b border-chalk/10 shadow-[0_12px_16px_-12px_rgba(0,0,0,0.5)]`}>
              <HoleMap key={`m${spec.seed}`} spec={spec} active={active} labels={labels} compact className="mx-auto h-[22vh] max-h-[200px] w-auto" />
            </div>
            <div ref={body} className="mt-12 sm:mt-16">
              {children}
            </div>
            {cart && !wide && <div className="mt-14 -mx-4 px-2">{playable}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hole;
