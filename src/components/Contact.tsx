import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <motion.section 
      id="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-20"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Contact</h2>
        <div className="bg-tertiary/50 p-8 rounded-lg backdrop-blur-sm border border-secondary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="https://www.linkedin.com/in/yashgandhi34/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-primary/50 rounded-lg border border-secondary/10 hover:border-secondary/30 transition-colors"
            >
              <svg className="w-8 h-8 text-secondary mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.016-2.005-1.22-2.005-1.22 0-1.41.952-1.41 1.94v5.669h-3v-11h2.84v1.58h.04c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.866z"/>
              </svg>
              <span className="text-secondary">LinkedIn</span>
            </motion.a>
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="https://github.com/yasher3413" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-primary/50 rounded-lg border border-secondary/10 hover:border-secondary/30 transition-colors"
            >
              <svg className="w-8 h-8 text-secondary mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-secondary">GitHub</span>
            </motion.a>
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="mailto:yashgandhi2023@gmail.com"
              className="flex flex-col items-center p-6 bg-primary/50 rounded-lg border border-secondary/10 hover:border-secondary/30 transition-colors"
            >
              <svg className="w-8 h-8 text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-secondary">Email</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default Contact; 