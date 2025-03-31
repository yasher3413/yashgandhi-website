import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const Blog = () => {
  const blogPosts = [
    {
      title: 'The Illusion of Maximization',
      excerpt: 'Why We Think We\'re Making the Best Choices (But Aren\'t)',
      date: 'Feb 28, 2025',
      readTime: '8 min read',
      link: 'https://yashgandhi.substack.com/p/the-mental-trap-14-the-illusion-of',
      tags: ['Psychology', 'Decision Making', 'Personal Growth'],
    },
    {
      title: 'Why Successful People Love To Gamble',
      excerpt: 'The Hidden Addiction of High Achievers',
      date: 'Mar 17, 2025',
      readTime: '7 min read',
      link: 'https://yashgandhi.substack.com/p/the-mental-trap-44-why-successful',
      tags: ['Psychology', 'Success', 'Behavior'],
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
        <a
          href="https://yashgandhi.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-colors duration-300"
        >
          <span className="mr-2">Subscribe to my newsletter</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
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
                    <h3 className="text-2xl font-bold text-secondary group-hover:text-secondary/90 transition-colors line-clamp-2">
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