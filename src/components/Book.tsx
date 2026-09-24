import React from 'react';
import Hole from './course/Hole';
import { GOODREADS_URL, specs } from '@/content';

const Book = () => (
  <Hole id="book" n={5} name="The Book" par={5} yards="186" note="186 pages" spec={specs.book} labels={['The book', 'The idea', 'Goodreads']} side="left">
    <p className="text-lg text-mist max-w-[52ch]">
      I wrote a book about the messiness of growing up, ambition, doubt, love, and the tension of becoming.
    </p>

    <div data-shot className="mt-12 grid sm:grid-cols-[minmax(0,15rem)_1fr] gap-8 sm:gap-10 items-start">
      <a href={GOODREADS_URL} target="_blank" rel="noopener noreferrer" className="group block w-44 sm:w-auto [perspective:1200px]">
        <img
          src="/Book%20Cover%20Frame%2023.png"
          alt="To Have It Figured Out by Yash Gandhi"
          width={470}
          height={704}
          className="w-full h-auto rounded-[2px] shadow-[0_24px_40px_-14px_rgba(0,0,0,0.75),0_4px_10px_-4px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out [transform-origin:left_center] group-hover:[transform:rotateY(-14deg)]"
        />
      </a>
      <div>
        <h3 className="font-display uppercase text-chalk text-5xl sm:text-6xl leading-[0.88]" style={{ fontWeight: 800 }}>
          To Have It Figured Out
        </h3>
        <p className="mt-4 text-sm sm:text-base text-moss tabular">186 pages · Kindle &amp; Paperback Edition · Published June 12, 2025</p>
      </div>
    </div>

    <div data-shot className="mt-12 space-y-5 max-w-[62ch]">
      <p className="text-xl leading-relaxed text-chalk">
        A collection of reflections, questions, and small moments from someone still trying to make sense of it all. Through honest essays about
        uncertainty and everything in between, when you&apos;re no longer a kid, but not quite a &quot;figured-out&quot; adult either.
      </p>
      <p className="text-lg leading-relaxed text-mist">
        This is not a roadmap or a list of solutions. It&apos;s a conversation for anyone who has ever looked around and wondered if they were the
        only one who still didn&apos;t have it all together. For anyone who&apos;s ever felt behind, overwhelmed, or quietly isolated.
      </p>
    </div>

    <div data-shot className="mt-10">
      <a href={GOODREADS_URL} target="_blank" rel="noopener noreferrer" className="btn-line">
        View on Goodreads
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 9L9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </a>
    </div>
  </Hole>
);

export default Book;
