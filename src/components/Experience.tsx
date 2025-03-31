import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Image from 'next/image';

const Experience = () => {
  const experiences = [
    {
      title: 'Senior Product & Operations',
      company: 'HotTakes',
      period: '2023 - Present',
      description: 'Seed-stage startup focused on creating a free-to-play sports betting platform for users to win cash prizes without any risk.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Airtable'],
      logo: '/images/hottakes-logo.jpeg',
    },
    {
      title: 'Private Equity Analyst',
      company: 'Lynwood Succession',
      period: 'Summer 2024',
      description: 'Contributed to due diligence reports for potential acquisitions, including financial modeling and market research.',
      technologies: ['MS Excel', 'MS Word', 'MS PowerPoint'],
      logo: '/images/lynwood-logo.png',
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
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
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 