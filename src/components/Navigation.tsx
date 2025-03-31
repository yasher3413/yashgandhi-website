import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'blog', 'listens', 'projects', 'contact'];
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if we're at the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection('contact');
        return;
      }

      // Otherwise check each section
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementCenter = (top + bottom) / 2;
          
          if (elementCenter <= windowHeight * 0.6 && elementCenter >= 0) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = sectionId === 'contact' ? 0 : 80; // Less offset for contact section
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-secondary origin-left z-50"
        style={{ scaleX }}
      />
      <nav className="fixed top-4 right-4 z-40">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden bg-primary/80 backdrop-blur-sm rounded-full p-3 border border-secondary/20"
        >
          <svg
            className="w-6 h-6 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navigation menu */}
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex absolute md:relative right-0 top-14 md:top-0 bg-primary/95 md:bg-primary/80 backdrop-blur-sm rounded-2xl md:rounded-full p-4 md:p-2 border border-secondary/20 flex-col md:flex-row min-w-[160px] md:min-w-0 md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row gap-2">
            {['home', 'about', 'experience', 'blog', 'listens', 'projects', 'contact'].map((section) => (
              <li key={section}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(section)}
                  className={`w-full md:w-auto px-4 py-2 md:py-1 rounded-full text-sm transition-colors ${
                    activeSection === section
                      ? 'bg-secondary text-primary'
                      : 'text-gray-400 hover:text-secondary'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation; 