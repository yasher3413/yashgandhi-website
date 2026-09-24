import { ImageResponse } from 'next/og';
import { courseSvg } from '@/lib/courseSvg';
import { heroSpec } from '@/content';
import { COURSE_PAR, MAX_PER_HOLE, scoreName, toPar, withArticle } from '@/lib/golf';

// Link-preview card: the first tee, or a shared score.

const fontCache = new Map<string, Promise<ArrayBuffer>>();

/** Google serves TTF when the request carries no browser user agent, which is what Satori reads. */
const googleFont = (family: string, weight: number, text?: string) => {
  const key = `${family}:${weight}:${text ?? ''}`;
  if (!fontCache.has(key)) {
    const q = `family=${family.replace(/ /g, '+')}:wght@${weight}${text ? `&text=${encodeURIComponent(text)}` : ''}`;
    fontCache.set(
      key,
      fetch(`https://fonts.googleapis.com/css2?${q}`)
        .then((r) => r.text())
        .then((css) => {
          const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
          if (!url) throw new Error(`No TTF for ${family}`);
          return fetch(url).then((r) => r.arrayBuffer());
        })
    );
  }
  return fontCache.get(key)!;
};

const course = `data:image/svg+xml;base64,${Buffer.from(courseSvg(heroSpec, 800, 560)).toString('base64')}`;

const C = { rough: '#14482f', deep: '#0c2e1e', chalk: '#f3f6ef', moss: '#9dbfa8', sand: '#e7d39a', flag: '#ef3b2c', card: '#f4f6f1', ink: '#12402a', pencil: '#2b2f8a' };
const PARS = [4, 3, 4, 3, 5, 3, 5, 4, 4];

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const s = Number(params.get('s'));
  const holesRaw = params.get('round') ? (params.get('h') ?? '').split('-').map(Number) : null;
  const holes =
    holesRaw && holesRaw.length === 9 && holesRaw.every((h) => Number.isInteger(h) && h >= 1 && h <= MAX_PER_HOLE) && holesRaw.reduce((a, b) => a + b, 0) === s
      ? holesRaw
      : null;
  const strokes = holes ? s : Number.isInteger(s) && s >= 1 && s <= 20 ? s : null;

  const [display, sans, mono, pencil] = await Promise.all([
    googleFont('Big Shoulders Display', 900),
    googleFont('Schibsted Grotesk', 500),
    googleFont('Azeret Mono', 500),
    googleFont('Nanum Pen Script', 400),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: 'flex', position: 'relative', background: C.rough, fontFamily: 'Schibsted Grotesk' }}>
        <img src={course} width={800} height={560} style={{ position: 'absolute', right: -40, top: 20 }} />

        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 64, top: 56 }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Big Shoulders Display', color: C.chalk, fontSize: 172, lineHeight: 0.8, textTransform: 'uppercase' }}>
            <span>Yash</span>
            <span>Gandhi</span>
          </div>
          {strokes ? (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 34 }}>
              <span style={{ fontFamily: 'Nanum Pen Script', fontSize: 58, color: C.flag, lineHeight: 1 }}>
                {holes ? `shot ${strokes} on the nine.` : `holed hole 1 in ${strokes}.`}
              </span>
              <span style={{ fontFamily: 'Nanum Pen Script', fontSize: 44, color: C.sand, lineHeight: 1.1 }}>
                {holes ? `${toPar(strokes - COURSE_PAR)} by cart. beat it?` : `that's ${withArticle(scoreName(strokes))}. beat it?`}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 34 }}>
              <span style={{ fontSize: 38, color: C.chalk }}>Engineer & Operations Analyst</span>
              <span style={{ fontFamily: 'Nanum Pen Script', fontSize: 40, color: C.sand, marginTop: 10 }}>nine holes. tee off.</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', position: 'absolute', left: 64, bottom: 44, background: C.card, borderRadius: 4, boxShadow: '0 16px 30px -12px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Azeret Mono', fontSize: 13, color: C.ink }}>
            <span style={{ padding: '8px 12px', height: 40, display: 'flex', alignItems: 'center' }}>HOLE</span>
            <span style={{ padding: '0 12px', height: 30, display: 'flex', alignItems: 'center', borderTop: `1px solid rgba(18,64,42,0.18)` }}>YOU</span>
          </div>
          {PARS.map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', width: 50, borderLeft: `1px solid rgba(18,64,42,0.18)` }}>
              <span style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Big Shoulders Display', fontSize: 28, color: C.ink }}>{i + 1}</span>
              <span style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nanum Pen Script', fontSize: 28, color: C.pencil, borderTop: `1px solid rgba(18,64,42,0.18)` }}>
                {holes ? holes[i] : i === 0 && strokes ? strokes : ''}
              </span>
            </div>
          ))}
        </div>

        <span style={{ position: 'absolute', right: 56, bottom: 48, fontFamily: 'Azeret Mono', fontSize: 20, color: C.moss }}>yashgandhi.org</span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Big Shoulders Display', data: await display, weight: 900 },
        { name: 'Schibsted Grotesk', data: await sans, weight: 500 },
        { name: 'Azeret Mono', data: await mono, weight: 500 },
        { name: 'Nanum Pen Script', data: await pencil, weight: 400 },
      ],
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400' },
    }
  );
}
