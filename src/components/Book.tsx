import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const GOODREADS_URL = 'https://www.goodreads.com/book/show/236654175-to-have-it-figured-out';

const Book = () => {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold mb-6 text-left bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Book
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          I wrote a book about the messiness of growing up, ambition, doubt, love, and the tension of becoming.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <a
          href={GOODREADS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="overflow-hidden hover:bg-secondary/5 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-8 md:gap-10">
              {/* Book cover */}
              <div className="flex-shrink-0 w-full md:w-56 aspect-[2/3] rounded-lg overflow-hidden border border-secondary/20 bg-black">
                <img
                  src="/Book%20Cover%20Frame%2023.png"
                  alt="To Have It Figured Out by Yash Gandhi"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-secondary group-hover:text-primary transition-colors mb-3">
                  To Have It Figured Out
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  186 pages · Kindle & Paperback Edition · Published June 12, 2025
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  A collection of reflections, questions, and small moments from someone still trying to make sense of it all. Through honest essays about uncertainty and everything in between, when you're no longer a kid, but not quite a &quot;figured-out&quot; adult either.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  This is not a roadmap or a list of solutions. It&apos;s a conversation for anyone who has ever looked around and wondered if they were the only one who still didn&apos;t have it all together. For anyone who&apos;s ever felt behind, overwhelmed, or quietly isolated.
                </p>
                <span className="inline-flex items-center gap-2 text-secondary font-medium group-hover:gap-3 transition-all">
                  View on Goodreads
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              </div>
            </div>
          </Card>
        </a>
      </motion.div>
    </section>
  );
};

export default Book;
