import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import TopoField from '@/components/course/TopoField';

const UPDATED = 'September 24, 2026';
const EMAIL = 'yashgandhi2023@gmail.com';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-12">
    <h2 className="font-display uppercase text-chalk text-3xl sm:text-4xl" style={{ fontWeight: 800 }}>
      {title}
    </h2>
    <div className="mt-4 space-y-4 text-lg leading-relaxed text-mist">{children}</div>
  </section>
);

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy • Yash Gandhi</title>
        <meta name="description" content="What yashgandhi.org stores, and why." />
      </Head>
      <TopoField />
      <main className="relative mx-auto max-w-[720px] px-4 sm:px-8 pt-10 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-moss hover:text-chalk transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M8 2L4 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Back to the course
        </Link>

        <h1 className="mt-10 font-display uppercase text-chalk leading-[0.85] text-[clamp(3.5rem,11vw,6rem)]" style={{ fontWeight: 900 }}>
          Privacy
        </h1>
        <p className="mt-3 font-mono text-sm text-moss">Last updated {UPDATED}</p>
        <p className="mt-8 text-xl leading-relaxed text-chalk">
          This is Yash Gandhi&apos;s personal website. It does not sell data, run ads, or use analytics or tracking cookies. Here is everything it stores.
        </p>

        <Section title="WHOOP">
          <p>
            The site connects to one WHOOP account: Yash&apos;s own. The WHOOP authorization screen is only used by him, to let the site read his recovery,
            sleep, cycle (strain) and workout data, which Hole 7 shows publicly.
          </p>
          <p>
            The site stores the OAuth tokens WHOOP issues for that account, plus a summary of the latest numbers cached for about ten minutes, in a
            private Upstash Redis database. No other WHOOP data is kept, and nothing is shared with anyone else. Access can be revoked at any time from
            the WHOOP app, which stops the site reading any further data.
          </p>
        </Section>

        <Section title="Visitors">
          <p>
            <strong className="text-chalk font-semibold">Leaderboards.</strong> If you sign a leaderboard, the site stores the one to three initials you
            enter and your score. To stop spam, your IP address is used as a short-lived rate-limit counter that expires after 60 seconds.
          </p>
          <p>
            <strong className="text-chalk font-semibold">Booking a call.</strong> The name, email and notes you enter on the booking page are sent to
            Cal.com to create the meeting. The site itself does not store them.
          </p>
          <p>
            <strong className="text-chalk font-semibold">Your browser.</strong> Your game progress (carting or scrolling, and your scores) is kept in
            session storage for the current tab. The sound setting, the collapsed scorecard, and the last Spotify track shown are kept in local storage.
            None of this is sent anywhere.
          </p>
          <p>
            <strong className="text-chalk font-semibold">Hosting and embeds.</strong> The site is hosted on Vercel, which keeps standard server logs.
            The Spotify players and the Substack subscribe form are provided by Spotify and Supascribe, and their own privacy policies apply to them.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Email{' '}
            <a href={`mailto:${EMAIL}`} className="link-chalk">
              {EMAIL}
            </a>{' '}
            to ask about or remove anything described here.
          </p>
        </Section>
      </main>
    </>
  );
}
