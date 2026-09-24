import React from 'react';
import Hole from './course/Hole';
import { projects, specs } from '@/content';

const Projects = () => (
  <Hole id="projects" n={4} name="Projects" par={3} yards="187" spec={specs.projects} labels={projects.map((p) => p.title.split(' ')[0])} side="right">
    <p className="text-lg text-mist max-w-[52ch]">Here are some of my recent projects. Click on a project to view its GitHub repository.</p>
    <ul className="mt-10">
      {projects.map((p) => (
        <li key={p.title} data-shot className="border-t border-chalk/15">
          <a href={p.link} target="_blank" rel="noopener noreferrer" className="group block py-9">
            <div className="flex items-start justify-between gap-6">
              <h3 className="font-display uppercase text-chalk text-4xl sm:text-6xl leading-[0.9] group-hover:text-sand transition-colors duration-300" style={{ fontWeight: 800 }}>
                {p.title}
              </h3>
              <span className="mt-2 shrink-0 text-sm text-moss group-hover:text-chalk transition-colors flex items-center gap-2">
                GitHub
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M3 9L9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-mist max-w-[60ch]">{p.description}</p>
            <p className="mt-4 text-sm text-moss">{p.tags.join('  ·  ')}</p>
          </a>
        </li>
      ))}
    </ul>
  </Hole>
);

export default Projects;
