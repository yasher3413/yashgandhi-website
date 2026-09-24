import React from 'react';
import Link from 'next/link';
import Hole from './course/Hole';
import { contacts, specs } from '@/content';

const Contact = () => (
  <Hole id="contact" n={9} name="Contact" par={4} yards="405" spec={specs.contact} labels={['Links', 'Chat']} side="left">
    <ul data-shot>
      {contacts.map((c) => (
        <li key={c.label} className="border-t border-chalk/15 last:border-b">
          <a
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-6 py-6"
          >
            <span className="min-w-0">
            <span className="block font-display uppercase text-chalk text-5xl sm:text-7xl leading-none group-hover:text-sand transition-colors duration-300" style={{ fontWeight: 800 }}>
              {c.label}
            </span>
            <span className="block mt-2 sm:hidden text-sm text-moss break-all">{c.handle}</span>
            </span>
            <span className="flex items-center gap-3 text-sm text-moss group-hover:text-chalk transition-colors min-w-0">
              <span className="truncate hidden sm:inline">{c.handle}</span>
              <svg width="16" height="16" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <path d="M3 9L9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </span>
          </a>
        </li>
      ))}
    </ul>

    <div data-shot className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3">
      <Link href="/book" className="btn-line text-lg px-7 py-4">
        Chat with me
      </Link>
      <span className="font-pencil text-2xl text-sand">or book a tee time</span>
    </div>
  </Hole>
);

export default Contact;
