import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [reduceMotion, setReduceMotion] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'projects', 'book', 'blog', 'wellness', 'listens', 'contact'];
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedTheme = window.localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme =
      storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : prefersLight
          ? 'light'
          : 'dark';
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('reduce-motion');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const initialReduce =
      stored === 'on' ? true : stored === 'off' ? false : prefersReduced;
    setReduceMotion(initialReduce);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    window.localStorage.setItem('reduce-motion', reduceMotion ? 'on' : 'off');
    window.dispatchEvent(new Event('reduce-motion-change'));
  }, [reduceMotion]);

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleReduceMotion = () => {
    setReduceMotion((prev) => !prev);
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
            {['home', 'about', 'experience', 'projects', 'book', 'blog', 'wellness', 'listens', 'contact'].map((section) => (
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
            <li className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                type="button"
                aria-label={theme === 'light' ? 'Enable dark mode' : 'Enable light mode'}
                className="w-full md:w-auto px-4 py-2 md:py-1 rounded-full text-sm transition-colors text-gray-400 hover:text-secondary border border-secondary/20"
              >
                {theme === 'light' ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-12.728l1.414 1.414m9.9 9.9l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                    />
                  </svg>
                )}
              </motion.button>
            </li>
            <li className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleReduceMotion}
                type="button"
                aria-label={reduceMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
                className={`w-full md:w-auto px-4 py-2 md:py-1 rounded-full text-sm transition-colors border border-secondary/20 ${
                  reduceMotion ? 'text-secondary' : 'text-gray-400 hover:text-secondary'
                }`}
              >
                Motion
              </motion.button>
            </li>
          </ul>
        </div>
      </nav>
     
    </>
  );
};

export default Navigation; 