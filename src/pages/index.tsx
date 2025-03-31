import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Head from 'next/head';
import Terminal from '../components/Terminal';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Navigation from '../components/Navigation';
import ParticleBackground from '../components/ParticleBackground';
import MyListens from '../components/MyListens';
import Projects from '../components/Projects';
import BackToTop from '../components/BackToTop';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Yash Gandhi | Student | Writer | Designer | Developer</title>
        <meta name="description" content="Personal website of Yash Gandhi - a student, writer, designer, and developer based in Toronto, Canada." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        * {
          cursor: none;
        }
        body {
          cursor: none;
        }
        a, button {
          cursor: none;
        }
        :root {
          --cursor-color: #2dd4bf;
        }
        @supports (cursor: grab) {
          html {
            cursor: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='6' stroke='%232dd4bf' stroke-width='3'/%3E%3C/svg%3E") 8 8, auto;
          }
        }
      `}</style>

      <ParticleBackground />
      <motion.div
        className="pointer-events-none fixed z-50 h-4 w-4 rounded-full border-[3px] border-secondary"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <main className="relative min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="relative z-10 pt-20 pb-16 space-y-16">
          <section id="home">
            <Terminal />
            <Hero />
          </section>
          <div className="container mx-auto px-4 space-y-4">
            <section id="about">
              <About />
            </section>
            <section id="experience">
              <Experience />
            </section>
            <section id="blog">
              <Blog />
            </section>
            <section id="listens" className="relative">
              <MyListens />
            </section>
            <section id="projects" className="relative">
              <Projects />
            </section>
            <section id="contact" className="relative">
              <Contact />
            </section>
          </div>
        </div>
        <BackToTop />
      </main>
    </>
  );
} 