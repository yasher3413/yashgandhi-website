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
      <div className="relative w-full h-full bg-tertiary/50 backdrop-blur-sm rounded-xl border border-secondary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
        {children}
      </div>
    </motion.div>
  );
};

export default Card; 