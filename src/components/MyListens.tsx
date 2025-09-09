import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import NowPlaying from './NowPlaying';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Now Playing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="space-y-4 flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-secondary">Now Playing</h3>
              <p className="text-gray-400">What I'm listening to right now</p>
              <div className="flex-1">
                <NowPlaying />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Spotify Playlist */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="space-y-4 flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-secondary">Current Playlist</h3>
              <p className="text-gray-400">My favorite EDM tracks</p>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-[400px] h-[400px] relative">
                  <iframe
                    src="https://open.spotify.com/embed/playlist/77rK2UD8whsNGCJIWgZdyy?si=L8JUPaUyRjuHEnQInTpMnw&pi=hNgjYevpSCqKy?theme=0&compact=1"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Podcast */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="space-y-4 flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-secondary">Favorite Podcast</h3>
              <p className="text-gray-400">Tools for everyday life</p>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-[400px] h-[400px] relative">
                  <iframe
                    src="https://open.spotify.com/embed/show/79CkJF3UJTHFV8Dse3Oy0P?&compact=1"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default MyListens; 