import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Book from '../components/Book';
import Blog from '../components/Blog';
import Wellness from '../components/Wellness';
import MyListens from '../components/MyListens';
import Contact from '../components/Contact';
import Scorecard from '../components/Scorecard';
import TopoField from '../components/course/TopoField';
import CartPath from '../components/course/CartPath';
import CartGate from '../components/course/CartGate';
import ModeChooser from '../components/ModeChooser';
import Clubhouse from '../components/Clubhouse';
import { SITE_URL } from '@/content';
import { RoundProvider, useRound } from '@/lib/round';

const SECTIONS = [About, Experience, Projects, Book, Blog, Wellness, MyListens, Contact];

/**
 * The nine holes in order. Scrolling shows them all; carting shows the holes
 * reached so far, joined by cart paths, and ropes off the rest.
 */
const Course = () => {
  const { mode, unlocked, scores } = useRound();
  const cart = mode === 'cart';
  const out: React.ReactNode[] = [<Hero key="h1" />];

  for (let hole = 1; hole < 9; hole++) {
    const Next = SECTIONS[hole - 1];
    if (cart) {
      if (unlocked <= hole) {
        out.push(<CartGate key={`gate${hole}`} hole={hole} />);
        break;
      }
      out.push(<CartPath key={`path${hole + 1}`} to={hole + 1} />);
    }
    out.push(<Next key={`h${hole + 1}`} />);
  }

  const finished = cart && scores.every((s) => s !== null);
  if (finished) out.push(<Clubhouse key="clubhouse" />);
  if (!cart || unlocked === 9) {
    out.push(
      <footer key="footer" className="mx-auto max-w-[1320px] px-4 sm:px-8 pt-10 pb-16 flex flex-wrap justify-between gap-4 text-sm text-moss">
        <span>Yash Gandhi</span>
        <span>Toronto, Canada</span>
      </footer>
    );
  }
  return <>{out}</>;
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Yash Gandhi</title>
        <meta name="description" content="Yash Gandhi: engineer and operations analyst in Toronto. Incoming AI Engineering Intern at T-Mobile, author of To Have It Figured Out." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Yash Gandhi" />
        <meta property="og:description" content="Engineer & Operations Analyst. Nine holes. Tee off." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Yash Gandhi" />
        <meta name="twitter:description" content="Engineer & Operations Analyst. Nine holes. Tee off." />
        <meta name="twitter:image" content={`${SITE_URL}/og`} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <TopoField />
      <RoundProvider>
        <main className="relative pb-28">
          <Course />
        </main>
        <Scorecard />
        <ModeChooser />
      </RoundProvider>
    </>
  );
}
