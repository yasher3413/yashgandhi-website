import React, { useCallback, useEffect, useRef, useState } from 'react';
import { inOval, pinOf, teeOf, yardScale, type HoleSpec } from '@/components/course/CourseArt';
import { dist, Pt } from './course';
import { useFlight } from './useFlight';
import { MAX_PER_HOLE } from './golf';
import type { Wind } from './round';
import * as sfx from './sfx';

// One hole of golf: pull back from the ball, let go, live with the result.

export type Lie = 'tee' | 'fairway' | 'rough' | 'sand' | 'green' | 'holed';
type Outcome = 'fairway' | 'rough' | 'sand' | 'green' | 'holed' | 'water' | 'ob' | 'trees' | 'lipped' | 'picked';

const NOTE: Record<Outcome, string> = {
  fairway: 'fairway. nice.',
  rough: 'in the rough',
  sand: 'plugged in the sand',
  green: 'on the dance floor',
  holed: 'in the hole!',
  water: 'wet. +1, drop it back',
  ob: 'out of bounds. +1',
  trees: 'off the trees',
  lipped: 'lipped out',
  picked: 'picked up. 10 it is.',
};

/** How each lie treats the next swing. */
const LIE_PLAY: Record<Lie, { carry: number; spread: number }> = {
  tee: { carry: 1, spread: 1 },
  fairway: { carry: 1, spread: 1 },
  green: { carry: 1, spread: 1 },
  rough: { carry: 0.72, spread: 1.6 },
  sand: { carry: 0.45, spread: 2.3 },
  holed: { carry: 0, spread: 0 },
};

const gauss = () => {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const deg = (d: number) => (d * Math.PI) / 180;

const pathLength = (line: Pt[]) => line.slice(1).reduce((s, p, i) => s + dist(line[i], p), 0);

/** Close enough to the fairway polyline to be on the mown strip. */
const onFairway = (spec: HoleSpec, p: Pt) => {
  for (let i = 1; i < spec.line.length; i++) {
    const [ax, ay] = spec.line[i - 1];
    const [bx, by] = spec.line[i];
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * (bx - ax) + (p[1] - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
    if (dist(p, [ax + t * (bx - ax), ay + t * (by - ay)]) < spec.width / 2 + 4) return true;
  }
  return false;
};

const lieAt = (spec: HoleSpec, p: Pt): Outcome => {
  if (inOval(p, spec.green, 1.2)) return 'green';
  if ((spec.water ?? []).some((o) => inOval(p, o, 0.9))) return 'water';
  if ((spec.bunkers ?? []).some((o) => inOval(p, o, 0.95))) return 'sand';
  return onFairway(spec, p) ? 'fairway' : 'rough';
};

type Seg = { from: Pt; to: Pt; via: Pt };
type Pending = { from: Pt; land: Pt; outcome: Outcome; penalty: boolean; rest: Lie };

type Opts = {
  spec: HoleSpec;
  par: number;
  wind: Wind;
  sound: boolean;
  touch: boolean;
  /** A hole already on the card starts finished. */
  done?: number | null;
  onHoled?: (strokes: number) => void;
};

export const useGolf = ({ spec, par, wind, sound, touch, done, onHoled }: Opts) => {
  const tee = teeOf(spec);
  const pin = pinOf(spec);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [unitsPerPx, setUnitsPerPx] = useState(1);
  const [ball, setBall] = useState<Pt>(done ? pin : tee);
  const [roll, setRoll] = useState(false);
  const [segs, setSegs] = useState<Seg[]>([]);
  const [via, setVia] = useState<Pt | null>(null);
  const [strokes, setStrokes] = useState(done ?? 0);
  const [lie, setLie] = useState<Lie>(done ? 'holed' : 'tee');
  const [note, setNote] = useState<{ text: string; at: Pt; good: boolean } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [pull, setPull] = useState<Pt | null>(null);
  const [focused, setFocused] = useState(false);
  const flight = useFlight(ball, 1000, roll, 0, via);
  const { pos, lift, flying } = flight;
  const onHoledRef = useRef(onHoled);
  onHoledRef.current = onHoled;

  // Full-power carry is set by par, so every hole plays about its length.
  const maxCarry = (pathLength(spec.line) / Math.max(1, par - 2)) * 1.12;
  const maxPutt = Math.max(spec.green[2], spec.green[3]) * 2.4;
  const cup = 6.5;
  const maxPullPx = touch ? 110 : 130;
  const grabPx = touch ? 46 : 30;

  const measure = useCallback(() => {
    const m = svgRef.current?.getScreenCTM();
    if (m && m.a) setUnitsPerPx(1 / m.a);
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Settle the shot once the ball has come to rest.
  useEffect(() => {
    if (flying || !pending) return;
    const { outcome, from, land, penalty, rest } = pending;
    setPending(null);
    setNote({ text: NOTE[outcome], at: land, good: outcome === 'holed' });
    if (sound) {
      if (outcome === 'water') sfx.splash();
      else if (outcome === 'sand') sfx.sand();
      else if (outcome === 'holed') sfx.cup();
      else if (outcome !== 'ob') sfx.thud();
    }

    if (penalty) {
      const t = setTimeout(() => {
        setRoll(true);
        setVia(null);
        setBall(from);
        setSegs((sg) => sg.slice(0, -1));
      }, 750);
      return () => clearTimeout(t);
    }
    if (outcome === 'holed' || outcome === 'picked') {
      setLie('holed');
      setRoll(true);
      setVia(null);
      setBall(pin);
      onHoledRef.current?.(outcome === 'picked' ? MAX_PER_HOLE : strokes);
      return;
    }
    setLie(rest);
  }, [flying, pending, sound, pin, strokes]);

  const toSvg = useCallback((e: React.PointerEvent): Pt | null => {
    const m = svgRef.current?.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return [p.x, p.y];
  }, []);

  const putting = lie === 'green';
  const canPlay = !flying && !pending && lie !== 'holed';

  /** Power 0..1 and direction for a pull to point p. */
  const aimFor = (p: Pt) => {
    const power = Math.min(1, dist(p, ball) / unitsPerPx / maxPullPx);
    const dir = Math.atan2(ball[1] - p[1], ball[0] - p[0]);
    return { power, dir };
  };

  const projected = (() => {
    if (!pull || !canPlay) return null;
    const { power, dir } = aimFor(pull);
    if (power < 0.04) return null;
    const reach = putting ? power * maxPutt : power * maxCarry * LIE_PLAY[lie].carry;
    return { at: [ball[0] + Math.cos(dir) * reach, ball[1] + Math.sin(dir) * reach] as Pt, power, reach };
  })();

  const inside = (p: Pt) => p[0] >= 0 && p[0] <= spec.w && p[1] >= 0 && p[1] <= spec.h;
  const clampIn = (p: Pt): Pt => [Math.max(4, Math.min(spec.w - 4, p[0])), Math.max(4, Math.min(spec.h - 4, p[1]))];

  const swing = (power: number, dir: number) => {
    const from = ball;
    let land: Pt;
    let outcome: Outcome;
    // where the ball was hit before the wind got to it; the flight leaves toward this
    let aimed: Pt;

    if (putting) {
      const a = dir + deg(gauss() * 1.4);
      const len = power * maxPutt * (1 + gauss() * 0.05);
      const ux = Math.cos(a);
      const uy = Math.sin(a);
      // does the roll pass over the cup, and slowly enough to drop?
      const along = (pin[0] - from[0]) * ux + (pin[1] - from[1]) * uy;
      const across = Math.abs((pin[0] - from[0]) * uy - (pin[1] - from[1]) * ux);
      const passes = along > 0 && along <= len && across < cup;
      land = [from[0] + ux * len, from[1] + uy * len];
      aimed = land;
      if ((passes && len - along < 32) || dist(land, pin) < cup * 0.9) {
        // over the cup at a gentle pace, or dying on the lip: it drops
        land = pin;
        outcome = 'holed';
      } else {
        outcome = passes ? 'lipped' : lieAt(spec, land);
      }
      setRoll(true);
    } else {
      const play = LIE_PLAY[lie];
      const carry = power * maxCarry * play.carry * (1 + gauss() * 0.04);
      // more club, less control; kept small enough that the wind is what you read
      const a = dir + deg(gauss() * (0.6 + 2.2 * power * power) * play.spread);
      // wind always pushes the same way, by an amount that grows with the carry
      const drift = (carry * wind.mph) / 100 * 1.25;
      const wr = deg(wind.deg);
      aimed = [from[0] + Math.cos(a) * carry, from[1] + Math.sin(a) * carry];
      land = [aimed[0] + Math.cos(wr) * drift, aimed[1] + Math.sin(wr) * drift];
      const tree = (spec.trees ?? []).find(([x, y, r]) => dist(land, [x, y]) < r);
      if (!inside(land)) {
        outcome = 'ob';
        land = clampIn(land);
      } else if (tree) {
        // knocked down short of the canopy
        const [tx, ty, tr] = tree;
        const back = Math.atan2(from[1] - ty, from[0] - tx) + gauss() * 0.6;
        land = clampIn([tx + Math.cos(back) * (tr + 10), ty + Math.sin(back) * (tr + 10)]);
        outcome = lieAt(spec, land) === 'water' ? 'water' : 'trees';
      } else if (dist(land, pin) < cup * 0.8) {
        outcome = 'holed';
      } else {
        outcome = lieAt(spec, land);
      }
      setRoll(false);
    }

    const penalty = outcome === 'water' || outcome === 'ob';
    const next = strokes + 1 + (penalty ? 1 : 0);
    if (outcome !== 'holed' && next >= MAX_PER_HOLE) outcome = 'picked';

    if (sound) sfx.tock(putting ? 0.35 : Math.min(1, 0.35 + power * 0.7));
    setNote(null);
    setStrokes(outcome === 'picked' ? MAX_PER_HOLE : next);
    // the ball leaves along the aim and the wind bends it onto where it lands
    const bendTo: Pt = putting ? [(from[0] + land[0]) / 2, (from[1] + land[1]) / 2] : [(from[0] + aimed[0]) / 2, (from[1] + aimed[1]) / 2];
    setVia(bendTo);
    setSegs((sg) => [...sg, { from, to: land, via: bendTo }]);
    const settled = lieAt(spec, land);
    const rest: Lie = outcome === 'lipped' ? 'green' : settled === 'water' ? lie : (settled as Lie);
    setPending({ from, land, outcome, penalty: penalty && outcome !== 'picked', rest });
    setBall(land);
  };

  const grab = {
    onPointerDown: (e: React.PointerEvent<SVGCircleElement>) => {
      if (!canPlay) return;
      e.preventDefault();
      measure();
      e.currentTarget.setPointerCapture(e.pointerId);
      setPull(toSvg(e));
    },
    onPointerMove: (e: React.PointerEvent<SVGCircleElement>) => {
      if (pull) setPull(toSvg(e));
    },
    onPointerUp: (e: React.PointerEvent<SVGCircleElement>) => {
      if (!pull) return;
      const p = toSvg(e) ?? pull;
      setPull(null);
      const { power, dir } = aimFor(p);
      if (power >= 0.06) swing(power, dir);
    },
    onPointerCancel: () => setPull(null),
    // keyboard: arrows drag the band, Enter or Space lets go, Escape drops it
    onKeyDown: (e: React.KeyboardEvent<SVGCircleElement>) => {
      if (!canPlay) return;
      const step = unitsPerPx * (e.shiftKey ? 24 : 8);
      const moves: Record<string, Pt> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (moves[e.key]) {
        e.preventDefault();
        const base = pull ?? ball;
        setPull([base[0] + moves[e.key][0], base[1] + moves[e.key][1]]);
      } else if ((e.key === 'Enter' || e.key === ' ') && pull) {
        e.preventDefault();
        const { power, dir } = aimFor(pull);
        setPull(null);
        if (power >= 0.06) swing(power, dir);
      } else if (e.key === 'Escape') {
        setPull(null);
      }
    },
    onFocus: () => {
      measure();
      setFocused(true);
    },
    onBlur: () => setFocused(false),
  };

  const reset = () => {
    setRoll(true);
    setVia(null);
    setBall(tee);
    setSegs([]);
    setStrokes(0);
    setLie('tee');
    setNote(null);
    setPending(null);
  };

  const scale = yardScale(spec);
  const readout = projected
    ? putting
      ? `${Math.max(1, Math.round(projected.reach * scale * 3))} FT`
      : `${Math.round(projected.reach * scale)} YDS · ${Math.round(projected.power * 100)}%`
    : '';

  return {
    svgRef,
    /** Convert screen pixels to drawing units so marks keep their size on any screen. */
    u: (px: number) => px * unitsPerPx,
    grabRadius: grabPx * unitsPerPx,
    pos,
    lift,
    flying,
    ball,
    segs,
    /** The shot in the air right now, drawn only as far as the ball has travelled. */
    inFlight: !!pending && flying,
    flight,
    strokes,
    lie,
    note: flying ? null : note,
    pull,
    focused,
    projected,
    readout,
    putting,
    canPlay,
    holed: lie === 'holed',
    toPin: Math.round(dist(pos, pin) * scale),
    grab,
    reset,
  };
};

export type Golf = ReturnType<typeof useGolf>;
