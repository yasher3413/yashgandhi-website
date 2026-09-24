import React from 'react';
import Hole from './course/Hole';
import { interests, skills, specs } from '@/content';

const About = () => (
  <Hole id="about" n={2} name="About" par={3} yards="168" spec={specs.about} labels={['Western', 'Skills', 'Interests']} side="right">
    <p data-shot className="text-2xl sm:text-[2rem] leading-[1.3] text-chalk max-w-[30ch] sm:max-w-[34ch]">
      I&apos;m a Business &amp; Computer Science student with expertise in AI/ML &amp; operations. Currently @ Western University, I focus on developing
      innovative solutions that make a difference.
    </p>

    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8">
      <div data-shot>
        <h3 className="font-display uppercase text-chalk text-3xl" style={{ fontWeight: 800 }}>
          Skills <span className="font-pencil normal-case text-sand text-2xl ml-2">in the bag</span>
        </h3>
        <ul className="mt-4">
          {skills.map((s) => (
            <li key={s} className="py-2.5 border-t border-chalk/15 text-lg text-chalk">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div data-shot>
        <h3 className="font-display uppercase text-chalk text-3xl" style={{ fontWeight: 800 }}>
          Interests <span className="font-pencil normal-case text-sand text-2xl ml-2">off the course</span>
        </h3>
        <p className="mt-5 text-lg leading-[2.1] text-chalk">
          {interests.map((s, i) => (
            <React.Fragment key={s}>
              <span className={s === 'Golf' ? 'relative inline-block' : ''}>
                {s}
                {s === 'Golf' && (
                  <svg className="absolute -inset-x-2 -inset-y-1 w-[calc(100%+1rem)] h-[calc(100%+0.5rem)] pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M8 22 C 6 8, 60 2, 90 12 C 100 18, 92 34, 50 36 C 18 38, 4 30, 12 16" fill="none" stroke="#ef3b2c" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </span>
              {i < interests.length - 1 && <> <span className="text-moss/60 px-1.5" aria-hidden="true">/</span> </>}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  </Hole>
);

export default About;
