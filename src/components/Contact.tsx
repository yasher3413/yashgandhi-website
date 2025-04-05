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
                <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.24-.49-2.08-1.71-2.08a1.86,1.86,0,0,0-1.74,1.26,2.33,2.33,0,0,0-.11.82v4.83h-3V9.74h3v1.3a3.37,3.37,0,0,1,3.05-1.68c2.23,0,3.53,1.46,3.53,4.59Z"/>
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