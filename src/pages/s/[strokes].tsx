import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { SITE_URL } from '@/content';
import { scoreName, withArticle } from '@/lib/golf';

type Props = { strokes: number };

/** A shareable scorecard: crawlers read the card, people land on the course. */
export default function SharedScore({ strokes }: Props) {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);

  const title = `Holed in ${strokes} on Yash Gandhi's course`;
  const description = `That's ${withArticle(scoreName(strokes))} on Hole 1. Think you can beat it?`;
  const image = `${SITE_URL}/og?s=${strokes}`;

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
        <meta property="og:url" content={`${SITE_URL}/s/${strokes}`} />
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, res }) => {
  const strokes = Number(params?.strokes);
  if (!Number.isInteger(strokes) || strokes < 1 || strokes > 20) {
    return { redirect: { destination: '/', permanent: false } };
  }
  res.setHeader('Cache-Control', 'public, s-maxage=86400');
  return { props: { strokes } };
};
