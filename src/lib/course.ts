// Geometry for the drawn course: seeded blobs, contour rings and smooth paths.

export type Pt = [number, number];

export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const f = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom through points, as cubic beziers. */
export const smoothPath = (pts: Pt[], closed = false): string => {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${f(p[1][0])},${f(p[1][1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2];
    d += ` C${f(x1 + (x2 - x0) / 6)},${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)},${f(y2 - (y3 - y1) / 6)} ${f(x2)},${f(y2)}`;
  }
  return closed ? d + 'Z' : d;
};

/** An organic closed shape (bunker, green, pond) around a centre. */
export const blob = (cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.22, n = 9): string => {
  const r = rng(seed);
  const rot = r() * Math.PI;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 - wobble / 2 + r() * wobble;
    const x = Math.cos(a) * rx * k;
    const y = Math.sin(a) * ry * k;
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return smoothPath(pts, true);
};

export type Hill = { x: number; y: number; r: number; rings: number; seed: number };

/** Nested contour rings for a hill; phases are shared so rings never cross. */
export const contourRings = ({ x, y, r, rings, seed }: Hill): string[] => {
  const rand = rng(seed);
  const waves = [
    { k: 2, a: 0.1 + rand() * 0.08, p: rand() * 6.28 },
    { k: 3, a: 0.06 + rand() * 0.06, p: rand() * 6.28 },
    { k: 5, a: 0.02 + rand() * 0.03, p: rand() * 6.28 },
  ];
  const squash = 0.7 + rand() * 0.5;
  const out: string[] = [];
  for (let i = 1; i <= rings; i++) {
    const rr = (r * i) / rings;
    const pts: Pt[] = [];
    const n = 28;
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2;
      // outer rings wobble more than inner ones, like real terrain
      const w = waves.reduce((s, v) => s + v.a * (0.4 + (0.6 * i) / rings) * Math.sin(v.k * a + v.p), 0);
      pts.push([x + Math.cos(a) * rr * (1 + w), y + Math.sin(a) * rr * (1 + w) * squash]);
    }
    out.push(smoothPath(pts, true));
  }
  return out;
};

export const hills = (w: number, h: number, count: number, seed: number, scale = 1): Hill[] => {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: r() * w,
    y: r() * h,
    r: (90 + r() * 170) * scale,
    rings: 5 + Math.floor(r() * 5),
    seed: seed * 31 + i,
  }));
};

export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
