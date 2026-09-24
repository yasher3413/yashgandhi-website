import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// The visitor's round: how they are getting around, their card, and the cart.

export type Mode = 'cart' | 'scroll';
export type Wind = { mph: number; deg: number };

type Stored = { mode: Mode | null; scores: (number | null)[]; unlocked: number };

type Round = {
  /** null until the visitor has chosen (and during server render). */
  mode: Mode | null;
  ready: boolean;
  scores: (number | null)[];
  /** In cart mode, the furthest hole the visitor may be on. */
  unlocked: number;
  /** The hole the cart is driving to right now. */
  drivingTo: number | null;
  winds: Wind[];
  sound: boolean;
  choose: (mode: Mode) => void;
  record: (hole: number, strokes: number) => void;
  drive: (to: number) => void;
  arrived: () => void;
  restart: () => void;
  toggleSound: () => void;
};

const KEY = 'yg-round';
const EMPTY: Stored = { mode: null, scores: Array(9).fill(null), unlocked: 1 };

const Ctx = createContext<Round | null>(null);

/** The next hole a cart golfer has not finished, given their card. */
const nextOpen = (scores: (number | null)[]) => {
  const i = scores.findIndex((s) => s === null);
  return i === -1 ? 9 : i + 1;
};

export const RoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [stored, setStored] = useState<Stored>(EMPTY);
  const [ready, setReady] = useState(false);
  const [drivingTo, setDrivingTo] = useState<number | null>(null);
  const [winds, setWinds] = useState<Wind[]>(() => Array(9).fill({ mph: 0, deg: 0 }));
  const [sound, setSound] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setStored({ ...EMPTY, ...JSON.parse(raw) });
      setSound(localStorage.getItem('course-sound') === 'on');
    } catch {
      // storage blocked: start fresh every time
    }
    // a different breeze on every hole, every visit
    setWinds(Array.from({ length: 9 }, () => ({ mph: 3 + Math.floor(Math.random() * 16), deg: Math.random() * 360 })));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }
  }, [stored, ready]);

  const choose = useCallback((mode: Mode) => {
    setDrivingTo(null);
    setStored((s) => ({ ...s, mode, unlocked: mode === 'cart' ? Math.max(1, nextOpen(s.scores)) : s.unlocked }));
  }, []);

  const record = useCallback((hole: number, strokes: number) => {
    setStored((s) => {
      const scores = [...s.scores];
      scores[hole - 1] = strokes;
      return { ...s, scores };
    });
  }, []);

  const drive = useCallback((to: number) => {
    setStored((s) => ({ ...s, unlocked: Math.max(s.unlocked, to) }));
    setDrivingTo(to);
  }, []);

  const arrived = useCallback(() => setDrivingTo(null), []);

  const restart = useCallback(() => {
    setDrivingTo(null);
    setStored((s) => ({ ...EMPTY, mode: s.mode }));
  }, []);

  const toggleSound = useCallback(() => {
    setSound((on) => {
      try {
        localStorage.setItem('course-sound', on ? 'off' : 'on');
      } catch {
        // ignore
      }
      return !on;
    });
  }, []);

  const value = useMemo<Round>(
    () => ({
      mode: ready ? stored.mode : null,
      ready,
      scores: stored.scores,
      unlocked: stored.unlocked,
      drivingTo,
      winds,
      sound,
      choose,
      record,
      drive,
      arrived,
      restart,
      toggleSound,
    }),
    [ready, stored, drivingTo, winds, sound, choose, record, drive, arrived, restart, toggleSound]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useRound = () => {
  const r = useContext(Ctx);
  if (!r) throw new Error('useRound needs a RoundProvider');
  return r;
};

/** Cart mode hides everything past the hole the visitor has reached. */
export const isOpen = (r: Pick<Round, 'mode' | 'unlocked'>, hole: number) => r.mode !== 'cart' || hole <= r.unlocked;
