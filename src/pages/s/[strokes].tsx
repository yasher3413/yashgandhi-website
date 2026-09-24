import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { SITE_URL } from '@/content';
import { COURSE_PAR, MAX_PER_HOLE, scoreName, toPar, withArticle } from '@/lib/golf';

type Props = { strokes: number; holes: number[] | null };

/** A shareable scorecard: crawlers read the card, people land on the course. */
export default function SharedScore({ strokes, holes }: Props) {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);

  const round = !!holes;
  const title = round ? `Shot ${strokes} on Yash Gandhi's nine` : `Holed in ${strokes} on Yash Gandhi's course`;
  const description = round
    ? `${toPar(strokes - COURSE_PAR)} over nine holes, by cart. Think you can beat it?`
    : `That's ${withArticle(scoreName(strokes))} on Hole 1. Think you can beat it?`;
  const query = round ? `s=${strokes}&round=1&h=${holes!.join('-')}` : `s=${strokes}`;
  const image = `${SITE_URL}/og?${query}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${SITE_URL}/s/${strokes}${round ? `?${query.slice(query.indexOf('round'))}` : ''}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>
      <main className="min-h-screen grid place-items-center px-4 text-center">
        <p className="font-pencil text-3xl text-sand">
          walking you to the first tee… <Link href="/" className="underline text-chalk">go now</Link>
        </p>
      </main>
    </>
  );
}

/** A shared round must add up: nine holes, each on the card, summing to the total. */
const parseHoles = (raw: unknown, total: number): number[] | null => {
  if (typeof raw !== 'string') return null;
  const holes = raw.split('-').map(Number);
  if (holes.length !== 9 || holes.some((h) => !Number.isInteger(h) || h < 1 || h > MAX_PER_HOLE)) return null;
  return holes.reduce((a, b) => a + b, 0) === total ? holes : null;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, query, res }) => {
  const strokes = Number(params?.strokes);
  const holes = query.round ? parseHoles(query.h, strokes) : null;
  const valid = Number.isInteger(strokes) && (query.round ? !!holes : strokes >= 1 && strokes <= 20);
  if (!valid) return { redirect: { destination: '/', permanent: false } };
  res.setHeader('Cache-Control', 'public, s-maxage=86400');
  return { props: { strokes, holes } };
};
