import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-20 relative"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">About Me</h2>
        <div className="bg-tertiary/50 p-8 rounded-lg backdrop-blur-sm border border-secondary/20">
          <p className="text-lg leading-relaxed">
            I'm a passionate Business & Computer Science student with expertise in product & operations.
            Currently working @ HotTakes, I focus on developing innovative solutions that make a difference.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-secondary font-semibold">Skills</h3>
              <ul className="space-y-1 text-gray-400">
                <li>JavaScript/TypeScript</li>
                <li>React/Next.js</li>
                <li>Node.js</li>
                <li>AWS</li>
                <li>Python</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-secondary font-semibold">Interests</h3>
              <ul className="space-y-1 text-gray-400">
                <li>Web Development</li>
                <li>Cloud Computing</li>
                <li>Machine Learning</li>
                <li>Figma</li>
                <li>Photoshop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default About; 