import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full h-full bg-tertiary rounded-lg border border-secondary/15 p-6 shadow-sm hover:border-secondary/40 hover:shadow-md transition-all duration-300">
        {children}
      </div>
    </motion.div>
  );
};

export default Card; 