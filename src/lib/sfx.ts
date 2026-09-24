// Course sounds, synthesised so there are no audio files to ship.

let ctx: AudioContext | null = null;
const ac = () => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

const noise = (a: AudioContext, seconds: number) => {
  const buf = a.createBuffer(1, Math.ceil(a.sampleRate * seconds), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  return src;
};

const env = (a: AudioContext, at: number, peak: number, decay: number) => {
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  g.connect(a.destination);
  return g;
};

/** Club face on ball: a short bright click over a woody knock. */
export const tock = (power = 1) => {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const click = noise(a, 0.03);
  const hp = a.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2500;
  click.connect(hp).connect(env(a, t, 0.35 * power, 0.03));
  click.start(t);
  const o = a.createOscillator();
  o.frequency.setValueAtTime(1150, t);
  o.frequency.exponentialRampToValueAtTime(420, t + 0.06);
  o.connect(env(a, t, 0.25 * power, 0.09));
  o.start(t);
  o.stop(t + 0.1);
};

/** Ball landing on grass. */
export const thud = () => {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const n = noise(a, 0.12);
  const lp = a.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 420;
  n.connect(lp).connect(env(a, t, 0.4, 0.12));
  n.start(t);
};

export const sand = () => {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const n = noise(a, 0.25);
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 3200;
  bp.Q.value = 0.8;
  n.connect(bp).connect(env(a, t, 0.25, 0.25));
  n.start(t);
};

export const splash = () => {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const n = noise(a, 0.7);
  const lp = a.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(3000, t);
  lp.frequency.exponentialRampToValueAtTime(300, t + 0.6);
  n.connect(lp).connect(env(a, t, 0.45, 0.65));
  n.start(t);
};

/** Ball dropping into the cup: a few rattles off the liner. */
export const cup = () => {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  [0, 0.07, 0.12, 0.155, 0.18].forEach((dt, i) => {
    const o = a.createOscillator();
    o.type = 'triangle';
    o.frequency.value = 1800 - i * 120;
    o.connect(env(a, t + dt, 0.18 / (i + 1), 0.05));
    o.start(t + dt);
    o.stop(t + dt + 0.06);
  });
};
