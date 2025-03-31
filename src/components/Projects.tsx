import { motion } from "framer-motion";
import Link from "next/link";
import Card from "./Card";

const Projects = () => {
  const projects = [
    {
      title: "Pawfect Pitch",
      description: "A web application that helps pet owners find the perfect pitch for their pet's story. Built with Python and TypeScript for NWHacks 2025.",
      link: "https://github.com/hunterchen7/pawfect-pitch",
      tags: ["Python", "TypeScript", "React", "Flask"],
    },
    {
      title: "ClothingFinder",
      description: "A Python web application that recommends outfits based on weather and personal wardrobe. Features weather integration and smart matching algorithms.",
      link: "https://github.com/yasher3413/ClothingFinder",
      tags: ["Python", "Flask", "OpenWeather API", "SQLite"],
    },
    {
      title: "Norive Website",
      description: "A modern, responsive website built with Next.js and Tailwind CSS. Features smooth animations and a clean, professional design.",
      link: "https://github.com/yasher3413/norive-website",
      tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    },
  ];

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold mb-6 text-left bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Projects
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Here are some of my recent projects. Click on the GitHub icon to view the repository.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="h-full"
          >
            <Card className="h-full group hover:bg-secondary/5 transition-colors duration-300">
              <div className="flex flex-col h-full space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-secondary group-hover:text-secondary/90 transition-colors">
                    {project.title}
                  </h3>
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-secondary/90 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm group-hover:bg-secondary/20 transition-colors"
                    >
                      {tag}
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

export default Projects; 