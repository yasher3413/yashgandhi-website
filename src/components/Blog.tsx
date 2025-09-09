import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const Blog = () => {
  useEffect(() => {
    // Load the Supascribe script
    const script = document.createElement('script');
    script.src = 'https://js.supascribe.com/v1/loader/OOrslRai49giI5etUxsYoWK1PlR2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      const existingScript = document.querySelector('script[src="https://js.supascribe.com/v1/loader/OOrslRai49giI5etUxsYoWK1PlR2.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const blogPosts = [
    {
      title: 'the straw man fallacy',
      excerpt: 'the addiction to easy arguments',
      date: 'Sep 09, 2025',
      readTime: '7 min read',
      link: 'https://open.substack.com/pub/yashgandhi/p/the-straw-man-fallacy?r=3cbkg2&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false',
      tags: ['Philosophy', 'Decision Making', 'Personal Growth'],
    },
    {
      title: '7 Countries. 17 Cities. 10 Weeks. 0 Days Off.',
      excerpt: 'How I Worked Full Time and Still Saw the World This Summer Without Taking a Single Day of PTO',
      date: 'Jul 29, 2025',
      readTime: '8 min read',
      link: 'https://open.substack.com/pub/yashgandhi/p/7-countries-17-cities-10-weeks-0?r=3cbkg2&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false',
      tags: ['Psychology', 'Lifestyle', 'Behavior'],
    },
    {
      title: 'the versions of me you\'ll never meet',
      excerpt: 'because not every version survives the becoming',
      date: 'Mar 25, 2025',
      readTime: '5 min read',
      link: 'https://yashgandhi.substack.com/p/the-versions-of-me-youll-never-meet',
      tags: ['Personal', 'Growth', 'Reflection'],
    },
  ];

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold mb-6 text-left bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Blog
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          I write about technology, psychology, and life on my Substack.
        </p>
        
        {/* Embedded Subscribe Form */}
        <div className="mb-8">
          <div 
            data-supascribe-embed-id="135402336170" 
            data-supascribe-subscribe
            className="max-w-md"
          ></div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="h-full"
          >
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card className="h-full group hover:bg-secondary/5 transition-colors duration-300">
                <div className="flex flex-col h-full space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mt-2 line-clamp-3 group-hover:text-gray-200 transition-colors">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-auto">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm group-hover:bg-secondary/20 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Blog; 