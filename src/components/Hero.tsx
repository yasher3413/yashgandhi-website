import React, { useCallback, useEffect, useRef, useState } from 'react';
import CourseArt, { arcPath, inOval, pinOf, teeOf, yardScale } from './course/CourseArt';
import HoleOut from './HoleOut';
import { heroSpec as spec, RESUME } from '@/content';
import { dist, Pt } from '@/lib/course';
import { useFlight } from '@/lib/useFlight';
import * as sfx from '@/lib/sfx';

type Lie = 'tee' | 'fairway' | 'rough' | 'sand' | 'water' | 'green' | 'holed';

const LIE_NOTE: Record<Lie, string> = {
  tee: '',
  fairway: 'fairway. nice.',
  rough: 'in the rough',
  sand: 'plugged in the sand',
  water: 'wet. +1, drop it back',
  green: 'on the dance floor',
  holed: 'in the hole!',
};

const tee = teeOf(spec);
const pin = pinOf(spec);
const scale = yardScale(spec);

/** How far a full pull-back sends the ball, and the longest drive allowed. */
const SLING_POWER = 3.2;
const MAX_CARRY = 560;
const GRAB_RADIUS = 38;

/** Rough test for the mown strip: close enough to the fairway polyline. */
const onFairway = (p: Pt) => {
  for (let i = 1; i < spec.line.length; i++) {
    const [ax, ay] = spec.line[i - 1];
    const [bx, by] = spec.line[i];
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * (bx - ax) + (p[1] - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
    if (dist(p, [ax + t * (bx - ax), ay + t * (by - ay)]) < spec.width / 2 + 4) return true;
  }
  return false;
};

const judge = (p: Pt): Lie => {
  if (dist(p, pin) < 13) return 'holed';
  if (inOval(p, spec.green, 1.05)) return 'green';
  if ((spec.water ?? []).some((o) => inOval(p, o, 0.9))) return 'water';
  if ((spec.bunkers ?? []).some((o) => inOval(p, o, 0.95))) return 'sand';
  return onFairway(p) ? 'fairway' : 'rough';
};

const clampToCourse = (p: Pt): Pt => [Math.max(10, Math.min(spec.w - 10, p[0])), Math.max(10, Math.min(spec.h - 10, p[1]))];

type Wind = { mph: number; deg: number };

const WindVane = ({ wind }: { wind: Wind | null }) => (
  <p className="mt-2 flex items-center gap-2 font-mono text-[11px] text-moss tabular h-4">
    {wind && (
      <>
        {wind.mph > 0 && <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${wind.deg}deg)` }}>
          <path d="M-6 0H5M1.5-3.5L5 0l-3.5 3.5" fill="none" stroke="#e7d39a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>}
        <span>
          {wind.mph ? `WIND ${wind.mph} MPH` : 'CALM'}<span className="sr-only">, blowing at {Math.round(wind.deg)} degrees</span>
        </span>
      </>
    )}
  </p>
);

const SoundToggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={on}
    className="inline-flex items-center gap-1.5 text-moss hover:text-chalk transition-colors"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 6h2.5l3.5-3v10l-3.5-3H2.5z" fill="currentColor" fillOpacity="0.15" />
      {on ? <path d="M11 5.5a3.5 3.5 0 010 5M12.8 3.8a6 6 0 010 8.4" /> : <path d="M11 6l3.5 4M14.5 6L11 10" />}
    </svg>
    Sound {on ? 'on' : 'off'}
  </button>
);

const Hero = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [aim, setAim] = useState<Pt | null>(null);
  const [pull, setPull] = useState<Pt | null>(null);
  const [ball, setBall] = useState<Pt>(tee);
  const [trail, setTrail] = useState<Pt[]>([tee]);
  const [strokes, setStrokes] = useState(0);
  const [lie, setLie] = useState<Lie>('tee');
  const [pending, setPending] = useState<{ to: Pt; from: Pt } | null>(null);
  const [touch, setTouch] = useState(false);
  const [wind, setWind] = useState<Wind | null>(null);
  const [sound, setSound] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const { pos, lift, flying } = useFlight(ball, 1000);

  useEffect(() => {
    setTouch(window.matchMedia('(hover: none)').matches);
    // a fresh breeze every visit
    setWind({ mph: Math.floor(Math.random() * 15), deg: Math.random() * 360 });
    try {
      setSound(localStorage.getItem('course-sound') === 'on');
    } catch {
      // storage blocked; stay quiet
    }
  }, []);

  const toggleSound = () => {
    setSound((on) => {
      const next = !on;
      try {
        localStorage.setItem('course-sound', next ? 'on' : 'off');
      } catch {
        // ignore
      }
      if (next) sfx.tock(0.6);
      return next;
    });
  };

  // Settle the lie once the ball has landed.
  useEffect(() => {
    if (flying || !pending) return;
    const l = judge(pending.to);
    setLie(l);
    if (sound) {
      if (l === 'water') sfx.splash();
      else if (l === 'sand') sfx.sand();
      else if (l === 'holed') sfx.cup();
      else sfx.thud();
    }
    if (l === 'water') {
      setStrokes((s) => s + 1);
      const back = pending.from;
      const t = setTimeout(() => {
        setBall(back);
        setTrail((tr) => [...tr.slice(0, -1)]);
      }, 700);
      setPending(null);
      return () => clearTimeout(t);
    }
    if (l === 'holed') setBall(pin);
    setPending(null);
  }, [flying, pending, sound]);

  const toSvg = useCallback((e: React.PointerEvent): Pt | null => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return [p.x, p.y];
  }, []);

  const canPlay = !flying && lie !== 'holed';

  /** Where a slingshot pull would send the ball (before wind and scatter). */
  const slingTarget = (p: Pt): Pt => {
    const dx = ball[0] - p[0];
    const dy = ball[1] - p[1];
    const d = Math.min(MAX_CARRY, Math.hypot(dx, dy) * SLING_POWER);
    const a = Math.atan2(dy, dx);
    return clampToCourse([ball[0] + Math.cos(a) * d, ball[1] + Math.sin(a) * d]);
  };

  const shoot = (target: Pt) => {
    if (!canPlay) return;
    const d = dist(ball, target);
    // nobody is perfect: scatter grows with distance, and the wind pushes long shots further
    const spread = Math.min(26, d * 0.06);
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * spread;
    const drift = wind ? wind.mph * (d / 100) * 1.1 : 0;
    const wr = wind ? (wind.deg * Math.PI) / 180 : 0;
    const land = clampToCourse([
      target[0] + Math.cos(a) * r + Math.cos(wr) * drift,
      target[1] + Math.sin(a) * r + Math.sin(wr) * drift,
    ]);
    if (sound) sfx.tock(Math.min(1, 0.35 + d / 450));
    setPending({ to: land, from: ball });
    setTrail((t) => [...t, land]);
    setStrokes((s) => s + 1);
    setLie('tee');
    setBall(land);
  };

  const onCoursePointerDown = (e: React.PointerEvent) => {
    const p = toSvg(e);
    if (!p || !canPlay) return;
    // taps on the ball start a pull-back instead of a shot
    if (dist(p, pos) < grab) return;
    shoot(p);
  };

  const onBallPointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!canPlay) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setPull(toSvg(e));
  };
  const onBallPointerMove = (e: React.PointerEvent<SVGCircleElement>) => {
    if (pull) setPull(toSvg(e));
    else setAim(toSvg(e));
  };
  const onBallPointerUp = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!pull) return;
    const p = toSvg(e) ?? pull;
    setPull(null);
    if (dist(p, ball) > 12) shoot(slingTarget(p));
  };

  const reset = () => {
    setBall(tee);
    setTrail([tee]);
    setStrokes(0);
    setLie('tee');
  };

  const sling = pull && dist(pull, ball) > 6 ? slingTarget(pull) : null;
  const reticle = sling ?? (aim && !touch ? aim : null);
  const carry = reticle ? Math.round(dist(pos, reticle) * scale) : 0;
  const toPin = Math.round(dist(pos, pin) * scale);
  const last = trail[trail.length - 1];
  const holed = lie === 'holed';
  // thumbs need a bigger handle than cursors
  const grab = touch ? GRAB_RADIUS * 1.9 : GRAB_RADIUS;

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
          <p className="sm:hidden mt-3 font-pencil text-2xl leading-tight text-sand">next up: AI engineering @ T-Mobile, summer &apos;26</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="btn-flag">
              <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true">
                <path d="M1.5 1v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M2.5 1.5l10 3.2-10 3.3z" fill="currentColor" />
              </svg>
              Resume
            </a>
            <a href="#contact" className="btn-line">
              Contact Me
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 relative">
          <div className="absolute left-1 top-0 z-10 pointer-events-none select-none">
            <p className="font-display text-chalk text-5xl sm:text-6xl leading-none" style={{ fontWeight: 900 }}>1</p>
            <p className="font-mono text-[11px] text-moss mt-1 tabular">PAR 4 / {spec.yards} YDS</p>
            <WindVane wind={wind} />
          </div>

          <CourseArt spec={spec} flag={false} className={`w-full h-auto touch-manipulation select-none ${holed ? '' : 'cursor-crosshair'}`}>
            {() => (
              <g
                ref={(el) => {
                  svgRef.current = el?.ownerSVGElement ?? null;
                }}
              >
                <rect
                  width={spec.w}
                  height={spec.h}
                  fill="transparent"
                  onPointerMove={(e) => setAim(toSvg(e))}
                  onPointerLeave={() => setAim(null)}
                  onPointerDown={onCoursePointerDown}
                />

                {trail.slice(1).map((p, i) => (
                  <path key={i} d={arcPath(trail[i], p)} fill="none" stroke="#f3f6ef" strokeOpacity="0.75" strokeWidth="1.8" strokeDasharray="2 6" strokeLinecap="round" pointerEvents="none" />
                ))}

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
                  <text x="560" y="116" fontSize="28" textAnchor="end">next up: AI engineering</text>
                  <text x="560" y="142" fontSize="28" textAnchor="end">@ T-Mobile, summer &apos;26</text>
                </g>

                {/* the flag doubles as the resume */}
                <a href={RESUME} target="_blank" rel="noopener noreferrer" aria-label="Open resume (PDF)">
                  <line x1={pin[0]} y1={pin[1]} x2={pin[0]} y2={pin[1] - 58} stroke="#f3f6ef" strokeWidth="2.4" strokeLinecap="round" pointerEvents="none" />
                  <path className="flag-wave" d={`M${pin[0] + 1},${pin[1] - 58} l32,9 l-32,10 z`} fill="#ef3b2c" />
                  <text x={pin[0] + 40} y={pin[1] - 46} fontFamily="'Nanum Pen Script', cursive" fontSize="28" fill="#f3f6ef">resume</text>
                  <rect x={pin[0] - 4} y={pin[1] - 66} width="92" height="34" fill="transparent" className="cursor-pointer" />
                </a>

                {/* the slingshot band, drawn from the ball back to the finger */}
                {pull && (
                  <g pointerEvents="none">
                    <line x1={pos[0]} y1={pos[1]} x2={pull[0]} y2={pull[1]} stroke="#e7d39a" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx={pull[0]} cy={pull[1]} r="7" fill="none" stroke="#e7d39a" strokeWidth="1.6" />
                  </g>
                )}

                {/* aim line and readout */}
                {reticle && canPlay && (
                  <g pointerEvents="none">
                    <line x1={pos[0]} y1={pos[1]} x2={reticle[0]} y2={reticle[1]} stroke="#f3f6ef" strokeOpacity="0.7" strokeWidth="1.2" strokeDasharray="6 5" />
                    <circle cx={reticle[0]} cy={reticle[1]} r="11" fill="none" stroke="#f3f6ef" strokeWidth="1.2" />
                    <line x1={reticle[0] - 17} y1={reticle[1]} x2={reticle[0] - 7} y2={reticle[1]} stroke="#f3f6ef" strokeWidth="1.2" />
                    <line x1={reticle[0] + 7} y1={reticle[1]} x2={reticle[0] + 17} y2={reticle[1]} stroke="#f3f6ef" strokeWidth="1.2" />
                    <g transform={`translate(${reticle[0] + (reticle[0] > spec.w - 110 ? -22 : 22)} ${reticle[1] - 14})`}>
                      <rect x={reticle[0] > spec.w - 110 ? -88 : 0} y="-14" width="88" height="22" rx="2" fill="#0c2e1e" fillOpacity="0.85" />
                      <text x={reticle[0] > spec.w - 110 ? -80 : 8} y="2" fontFamily="'Azeret Mono', monospace" fontSize="12" fill="#f3f6ef">
                        {carry} YDS
                      </text>
                    </g>
                  </g>
                )}

                {/* landing note */}
                {!flying && strokes > 0 && lie !== 'tee' && (
                  <text
                    x={Math.min(last[0] + 14, spec.w - 170)}
                    y={Math.max(last[1] + 30, 40)}
                    fontFamily="'Nanum Pen Script', cursive"
                    fontSize="26"
                    fill={holed ? '#ef3b2c' : '#e7d39a'}
                    stroke="#0c2e1e"
                    strokeWidth="4"
                    paintOrder="stroke"
                    pointerEvents="none"
                  >
                    {LIE_NOTE[lie]}
                  </text>
                )}

                <ellipse cx={pos[0] + lift * 22} cy={pos[1] + lift * 26} rx={6} ry={3.8} fill="#06170c" opacity={0.45 - lift * 0.25} pointerEvents="none" />
                {!holed && <circle cx={pos[0]} cy={pos[1] - lift * 28} r={5.4 + lift * 5} fill="#fff" stroke="#0c2e1e" strokeOpacity="0.35" pointerEvents="none" />}

                {/* grab handle for the pull-back; only this spot swallows touch scrolling */}
                {canPlay && (
                  <circle
                    cx={pos[0]}
                    cy={pos[1]}
                    r={grab}
                    fill="transparent"
                    style={{ touchAction: 'none', cursor: pull ? 'grabbing' : 'grab' }}
                    onPointerDown={onBallPointerDown}
                    onPointerMove={onBallPointerMove}
                    onPointerUp={onBallPointerUp}
                    onPointerCancel={() => setPull(null)}
                  />
                )}
              </g>
            )}
          </CourseArt>

          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-1 font-mono text-xs text-moss tabular" aria-live="polite">
            <span>
              {holed ? null : strokes === 0 ? (
                <span className="font-pencil text-xl text-sand">
                  {touch ? 'pull back from the ball and let go' : 'click the hole to hit, or pull back from the ball'}
                </span>
              ) : (
                <>
                  Stroke {strokes} <span className="text-chalk/30 px-1">/</span> {toPin} yds to pin
                </>
              )}
            </span>
            <span className="flex items-center gap-4 font-sans text-sm">
              <SoundToggle on={sound} onToggle={toggleSound} />
              {!holed && (
                <button type="button" onClick={() => setShowBoard((v) => !v)} aria-expanded={showBoard} className="text-moss hover:text-chalk underline decoration-chalk/30">
                  Leaderboard
                </button>
              )}
              {strokes > 0 && !holed && (
                <button type="button" onClick={reset} className="text-moss hover:text-chalk underline decoration-chalk/30">
                  Reset
                </button>
              )}
            </span>
          </div>

          {(holed || showBoard) && <HoleOut strokes={holed ? strokes : null} onReset={holed ? reset : undefined} />}
        </div>
      </div>
    </section>
  );
};

export default Hero;
