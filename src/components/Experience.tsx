import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Image from 'next/image';

const Experience = () => {
  const experiences = [
    {
      title: 'Vertical Operations Intern',
      company: 'Super.com',
      period: '(Incoming) Summer 2025',
      description: 'Series C startup serving as a saving app that empowers users to spend less, save more, and build credit.',
      technologies: ['Operations', 'Analytics', 'Strategy'],
      logo: '/images/super-logo.png',
      website: 'https://super.com'
    },
    {
      title: 'Senior Product & Operations',
      company: 'HotTakes',
      period: '2023 - Present',
      description: 'Seed-stage startup focused on creating a free-to-play sports betting platform for users to win cash prizes without any risk.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Airtable'],
      logo: '/images/hottakes-logo.jpeg',
      website: 'https://hottakes.com/'
    },
    {
      title: 'Private Equity Analyst',
      company: 'Lynwood Succession',
      period: 'Summer 2024',
      description: 'Contributed to due diligence reports for potential acquisitions, including financial modeling and market research.',
      technologies: ['MS Excel', 'MS Word', 'MS PowerPoint'],
      logo: '/images/lynwood-logo.png',
      website: 'https://www.cbinsights.com/company/lynwood-succession'
    },
    // Add more experiences as needed
  ];

  return (
    <section className="py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-12 text-left bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
      >
        Experience
      </motion.h2>
      <div className="grid grid-cols-1 gap-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative w-24 h-12 flex items-center">
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      fill
                      className="object-contain object-left"
                      priority={index < 2}
                      sizes="96px"
                    />
                  </div>
                  <p className="text-sm text-secondary">{exp.period}</p>
                </div>
                <h3 className="text-2xl font-bold text-secondary">{exp.title}</h3>
                <p className="text-gray-400">{exp.company}</p>
                <p className="text-gray-300">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <motion.a 
                  whileHover={{ 
                    scale: 1.05,
                    x: 5
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  href={exp.website}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block mt-4 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg relative z-10"
                >
                  Visit Site →
                </motion.a>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 