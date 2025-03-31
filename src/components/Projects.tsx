import { motion } from "framer-motion";

const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col items-start justify-center min-h-[400px]"
    >
      <h2 className="text-4xl font-bold mb-8 text-secondary">Projects</h2>
      <div className="flex flex-col items-start space-y-4">
        <h3 className="text-2xl font-semibold text-secondary">Coming Soon...</h3>
        <p className="text-muted-foreground max-w-md">
          I'm working on some exciting projects. Stay tuned for updates!
        </p>
      </div>
    </motion.div>
  );
};

export default Projects; 