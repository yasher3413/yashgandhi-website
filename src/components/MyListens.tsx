import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const MyListens = () => {
  return (
    <section className="py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-12 text-left bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
      >
        My Listens
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Spotify Playlist */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-secondary">Current Playlist</h3>
              <p className="text-gray-400">A collection of my favorite country tracks</p>
              <div className="relative aspect-square w-full">
                <iframe
                  src="https://open.spotify.com/embed/playlist/2wXpQnxQ728idZVsXN24AI"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Podcast */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-secondary">Favorite Podcast</h3>
              <p className="text-gray-400">Huberman Lab - Science-based tools for everyday life</p>
              <div className="relative aspect-square w-full">
                <iframe
                  src="https://open.spotify.com/embed/show/79CkJF3UJTHFV8Dse3Oy0P"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default MyListens; 