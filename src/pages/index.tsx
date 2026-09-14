import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Blog from '../components/Blog';
import Book from '../components/Book';
import Contact from '../components/Contact';
import MyListens from '../components/MyListens';
import Projects from '../components/Projects';
import Wellness from '../components/Wellness';
import BackToTop from '../components/BackToTop';

export default function Home() {
  return (
    <>
      <Head>
        <title>Yash Gandhi</title>
        <meta name="description" content="Personal website of Yash Gandhi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className="min-h-screen">
        <section id="home">
          <Hero />
        </section>
        <div className="container mx-auto px-4 space-y-4">
          <section id="about">
            <About />
          </section>
          <section id="experience">
            <Experience />
          </section>
          <section id="projects">
            <Projects />
          </section>
          <section id="book">
            <Book />
          </section>
          <section id="blog">
            <Blog />
          </section>
          <section id="wellness">
            <Wellness />
          </section>
          <section id="listens">
            <MyListens />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </div>
        <BackToTop />
      </main>
    </>
  );
}
