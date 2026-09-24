// The course drawing as a plain SVG string, for places React can't render
// into (the link-preview image). Mirrors CourseArt's layers.
import type { HoleSpec } from '@/components/course/CourseArt';
import { blob, contourRings, hills, smoothPath } from './course';

export const courseSvg = (s: HoleSpec, w: number, h: number) => {
  const rings = hills(s.w, s.h, s.hillCount ?? 3, s.seed, Math.max(s.w, s.h) / 700).flatMap(contourRings);
  const fairway = smoothPath(s.line);
  const [gx, gy, grx, gry] = s.green;
  const tee = s.line[0];
  const pin = s.shots[s.shots.length - 1];
  const parts: string[] = [];

  parts.push(
    `<defs><pattern id="mow" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="22" height="22" fill="#23714a"/><rect width="11" height="22" fill="#2a7d53"/></pattern>` +
      `<pattern id="mowg" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="10" height="10" fill="#6cc15a"/><rect width="5" height="10" fill="#77ca63"/></pattern></defs>`
  );
  parts.push(rings.map((d) => `<path d="${d}" fill="none" stroke="#f3f6ef" stroke-opacity="0.09"/>`).join(''));
  (s.water ?? []).forEach(([x, y, rx, ry], i) => parts.push(`<path d="${blob(x, y, rx, ry, s.seed + 40 + i, 0.3, 10)}" fill="#2f6fd6"/>`));
  parts.push(`<path d="${fairway}" fill="none" stroke="#1a5a3a" stroke-width="${s.width + 16}" stroke-linecap="round" stroke-linejoin="round"/>`);
  parts.push(`<path d="${fairway}" fill="none" stroke="url(#mow)" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round"/>`);
  parts.push(`<path d="${blob(gx, gy, grx + 9, gry + 9, s.seed + 7, 0.18)}" fill="#4fa047"/>`);
  parts.push(`<path d="${blob(gx, gy, grx, gry, s.seed + 7, 0.18)}" fill="url(#mowg)"/>`);
  (s.bunkers ?? []).forEach(([x, y, rx, ry], i) => {
    const d = blob(x, y, rx, ry, s.seed + 20 + i, 0.4, 8);
    parts.push(`<path d="${d}" fill="#b99d58" transform="translate(1.5 2.5)"/><path d="${d}" fill="#e7d39a"/>`);
  });
  (s.trees ?? []).forEach(([x, y, r]) =>
    parts.push(
      `<circle cx="${x + r * 0.25}" cy="${y + r * 0.35}" r="${r}" fill="#07200f" opacity="0.45"/><circle cx="${x}" cy="${y}" r="${r}" fill="#0f3a25"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${r * 0.55}" fill="#15492f"/>`
    )
  );
  parts.push(`<rect x="${tee[0] - 16}" y="${tee[1] - 9}" width="32" height="18" rx="3" fill="#2f8a5c"/>`);
  parts.push(`<circle cx="${tee[0]}" cy="${tee[1]}" r="5.4" fill="#fff"/>`);
  parts.push(`<circle cx="${pin[0]}" cy="${pin[1]}" r="4" fill="#0c2e1e"/>`);
  parts.push(`<line x1="${pin[0]}" y1="${pin[1]}" x2="${pin[0]}" y2="${pin[1] - 58}" stroke="#f3f6ef" stroke-width="2.4" stroke-linecap="round"/>`);
  parts.push(`<path d="M${pin[0] + 1},${pin[1] - 58} l32,9 l-32,10 z" fill="#ef3b2c"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="-24 -24 ${s.w + 48} ${s.h + 48}">${parts.join('')}</svg>`;
};
