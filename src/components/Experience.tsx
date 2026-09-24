import React from 'react';
import Image from 'next/image';
import Hole from './course/Hole';
import { experiences, specs } from '@/content';

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 9L9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Experience = () => (
  <Hole
    id="experience"
    n={3}
    name="Experience"
    par={4}
    yards="436"
    spec={specs.experience}
    labels={experiences.map((e) => e.company.split(' ')[0])}
    side="left"
  >
    <ol>
      {experiences.map((exp, i) => (
        <li key={exp.company} data-shot className={`grid grid-cols-[3.25rem_1fr] sm:grid-cols-[4.5rem_1fr] gap-x-5 sm:gap-x-7 py-10 ${i ? 'border-t border-chalk/15' : 'pt-0'}`}>
          <div className="relative w-[3.25rem] h-[3.25rem] sm:w-[4.5rem] sm:h-[4.5rem]">
            <Image src={exp.logo} alt={`${exp.company} logo`} fill sizes="72px" className="object-contain p-1" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display uppercase text-chalk text-[2rem] sm:text-5xl leading-[0.92]" style={{ fontWeight: 800 }}>
              {exp.title}
            </h3>
            <p className="mt-2 text-base text-chalk flex flex-wrap items-baseline gap-x-3">
              <span className="font-medium">{exp.company}</span>
              <span className="text-chalk/30">/</span>
              <span className="font-mono text-sm tabular text-moss">{exp.period}</span>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-mist max-w-[60ch]">{exp.description}</p>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
              <p className="text-sm text-moss">{exp.technologies.join('  ·  ')}</p>
              <a href={exp.website} target="_blank" rel="noopener noreferrer" className="link-chalk text-sm font-medium">
                Visit site <Arrow />
              </a>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </Hole>
);

export default Experience;
