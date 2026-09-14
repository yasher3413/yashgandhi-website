import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-[70vh] flex items-center justify-center px-4 pt-32 pb-20"
    >
      <div className="text-center max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base uppercase tracking-[0.2em] text-secondary font-medium mb-4"
        >
          Toronto, Canada
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-gray-100"
        >
          Yash Gandhi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-lg md:text-xl text-gray-400 px-4"
        >
          Engineer & Operations Analyst
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <a
            href="/Yash_Gandhi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-secondary text-primary rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 text-sm md:text-base"
          >
            Resume
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-secondary/40 rounded-lg hover:border-secondary transition-colors duration-200 text-secondary text-sm md:text-base"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Hero;
