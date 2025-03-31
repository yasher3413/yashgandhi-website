import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="h-[80vh] flex items-center justify-center relative overflow-hidden px-4"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-tertiary to-primary opacity-50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold gradient-text"
        >
          Yash Gandhi
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-lg md:text-xl text-gray-400 font-mono px-4"
        >
          Product & Operations Analyst Based in Toronto
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <a 
            href="/Yash%20Gandhi%20Resume%20%E2%80%93%202025.pdf"
            target="_blank"
            rel="noopener noreferrer" 
            className="px-6 py-3 bg-secondary/10 border border-secondary rounded-full hover:bg-secondary/20 transition-all duration-300 text-secondary text-sm md:text-base"
          >
            Resume
          </a>
          <a 
            href="#contact" 
            className="px-6 py-3 border border-secondary rounded-full hover:bg-secondary/10 transition-all duration-300 text-secondary text-sm md:text-base"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Hero; 