// Turns a Strava route into a golf hole: the run is the fairway, the start is
// the tee, the far end is the green.
import type { HoleSpec, Oval } from '@/components/course/CourseArt';
import { dist, Pt, rng } from './course';

/** Google encoded-polyline decoder. */
export const decodePolyline = (str: string): Pt[] => {
  const out: Pt[] = [];
  let i = 0;
  let lat = 0;
  let lng = 0;
  while (i < str.length) {
    for (const which of [0, 1]) {
      let shift = 0;
      let result = 0;
      let b: number;
      do {
        b = str.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20 && i < str.length);
      const d = result & 1 ? ~(result >> 1) : result >> 1;
      if (which === 0) lat += d;
      else lng += d;
    }
    out.push([lat / 1e5, lng / 1e5]);
  }
  return out;
};

const resample = (pts: Pt[], n: number): Pt[] => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + dist(pts[i - 1], pts[i]));
  const total = cum[cum.length - 1];
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (j < pts.length - 1 && cum[j] < target) j++;
    const seg = cum[j] - cum[j - 1] || 1;
    const t = Math.max(0, Math.min(1, (target - cum[j - 1]) / seg));
    out.push([pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * t, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * t]);
  }
  return out;
};

const minDistTo = (p: Pt, line: Pt[]) => line.reduce((m, q) => Math.min(m, dist(p, q)), Infinity);

/**
 * Lays a run out as a portrait hole. Loops are cut at their farthest point so
 * the green never sits on top of the tee.
 */
export const routeSpec = (encoded: string, meters: number): HoleSpec | null => {
  const ll = decodePolyline(encoded);
  if (ll.length < 4) return null;

  // flat projection, metres-ish
  const lat0 = (ll[0][0] * Math.PI) / 180;
  let pts: Pt[] = ll.map(([la, lo]) => [lo * Math.cos(lat0) * 111320, -la * 110540]);

  const start = pts[0];
  let far = 0;
  pts.forEach((p, i) => {
    if (dist(p, start) > dist(pts[far], start)) far = i;
  });
  const loop = dist(pts[pts.length - 1], start) < dist(pts[far], start) * 0.35;
  if (loop) pts = pts.slice(0, far + 1);
  const end = pts[pts.length - 1];

  // rotate so the tee is at the bottom and the green at the top
  const ang = Math.atan2(end[1] - start[1], end[0] - start[0]);
  const rot = -Math.PI / 2 - ang;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  pts = pts.map(([x, y]) => [(x - start[0]) * c - (y - start[1]) * s, (x - start[0]) * s + (y - start[1]) * c]);

  // fit into the 400×600 plan
  const W = 400;
  const H = 600;
  const pad = { x: 70, top: 90, bottom: 40 };
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min((W - pad.x * 2) / Math.max(1, maxX - minX), (H - pad.top - pad.bottom) / Math.max(1, maxY - minY));
  const ox = (W - (maxX - minX) * k) / 2 - minX * k;
  const oy = pad.top + (H - pad.top - pad.bottom - (maxY - minY) * k) / 2 - minY * k;
  pts = pts.map(([x, y]) => [x * k + ox, y * k + oy]);

  const line = resample(pts, 16);
  const dense = resample(pts, 80);
  const pin = line[line.length - 1];
  const mid = dense[Math.round(dense.length * 0.52)];
  const width = 40;
  const seed = Math.round(meters) % 997;
  const r = rng(seed + 3);

  // bunkers hug the fairway on alternating sides
  const bunkers: Oval[] = [0.3, 0.58, 0.8].map((f, i) => {
    const a = dense[Math.floor(dense.length * f) - 1];
    const b = dense[Math.floor(dense.length * f)];
    const nx = -(b[1] - a[1]);
    const ny = b[0] - a[0];
    const nl = Math.hypot(nx, ny) || 1;
    const side = i % 2 ? 1 : -1;
    const off = width / 2 + 20;
    return [b[0] + (nx / nl) * off * side, b[1] + (ny / nl) * off * side, 16 + r() * 6, 10 + r() * 4] as Oval;
  }).filter((o) => dist([o[0], o[1]], pin) > 40 + 28 + o[2]);

  // water and trees go where the run never went
  const open: Pt[] = [];
  for (let y = 40; y < H - 20; y += 26) for (let x = 30; x < W - 20; x += 26) open.push([x, y]);
  const clearance = (p: Pt) =>
    Math.min(minDistTo(p, dense), ...bunkers.map((b) => dist(p, [b[0], b[1]]) - b[2]), dist(p, pin) - 50);
  const byRoom = open.map((p) => ({ p, room: clearance(p) })).sort((a, b) => b.room - a.room);
  const pond = byRoom[0];
  const edge = pond ? Math.min(pond.p[0], W - pond.p[0], pond.p[1], H - pond.p[1]) - 6 : 0;
  const pr = pond ? Math.min(56, pond.room - 26, edge) : 0;
  const water: Oval[] = pond && pr > 26 ? [[pond.p[0], pond.p[1], pr, Math.min(pr * 0.82, pond.room - 30)]] : [];
  const trees: [number, number, number][] = [];
  for (const { p, room } of byRoom.slice(1)) {
    if (trees.length >= 6) break;
    if (room < 36) break;
    if (water.some((w) => dist(p, [w[0], w[1]]) < w[2] + 30)) continue;
    if (trees.some((t) => dist(p, [t[0], t[1]]) < 60)) continue;
    trees.push([p[0], p[1], 14 + r() * 10]);
  }

  return {
    w: W,
    h: H,
    line,
    width,
    shots: [mid, pin],
    green: [pin[0], pin[1], 40, 28],
    bunkers,
    water,
    trees,
    yards: Math.round((loop ? meters / 2 : meters) * 1.0936),
    seed,
    hillCount: 4,
  };
};
