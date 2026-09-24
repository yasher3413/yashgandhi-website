import React, { useEffect } from 'react';
import Hole from './course/Hole';
import { posts, specs } from '@/content';

const SUPASCRIBE = 'https://js.supascribe.com/v1/loader/OOrslRai49giI5etUxsYoWK1PlR2.js';

const Blog = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = SUPASCRIBE;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.querySelector(`script[src="${SUPASCRIBE}"]`)?.remove();
    };
  }, []);

  return (
    <Hole id="blog" n={6} name="Blog" par={3} yards="205" spec={specs.blog} labels={['42.2 km', 'Isolation', '7 countries']} side="right">
      <p className="text-lg text-mist max-w-[52ch]">
        I write about technology, psychology, and life on my Substack. Here are some of my most popular blog posts!
      </p>
      <div className="mt-6 max-w-md" data-supascribe-embed-id="135402336170" data-supascribe-subscribe />

      <ul className="mt-10">
        {posts.map((post) => (
          <li key={post.title} data-shot className="border-t border-chalk/15">
            <a href={post.link} target="_blank" rel="noopener noreferrer" className="group block py-9">
              <h3 className="text-3xl sm:text-[2.6rem] leading-[1.08] font-semibold tracking-[-0.02em] text-chalk group-hover:text-sand transition-colors duration-300 max-w-[22ch]">
                {post.title}
              </h3>
              <p className="mt-3 text-lg text-mist max-w-[56ch]">{post.excerpt}</p>
              <p className="mt-4 font-mono text-xs text-moss tabular">
                {post.date} <span className="text-chalk/30 px-1">/</span> {post.readTime}
              </p>
              <div className="mt-2 flex items-baseline justify-between gap-6">
                <p className="text-sm text-moss">{post.tags.join('  ·  ')}</p>
                <span className="font-pencil text-xl text-sand opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  read it
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Hole>
  );
};

export default Blog;
