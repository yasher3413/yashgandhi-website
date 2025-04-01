import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
}

const NowPlaying = () => {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-[360px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!data?.isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[360px]">
        <div className="relative w-full h-full">
          <Image
            src="/spotify-placeholder.png"
            alt="Not playing"
            fill
            className="object-cover rounded-xl opacity-50"
            priority
          />
        </div>
        <p className="text-gray-400 mt-4">Not playing anything right now, check back soon!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-[360px]">
      <a
        href={data.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex-1"
      >
        <Image
          src={data.albumImageUrl}
          alt={`${data.title} by ${data.artist}`}
          fill
          className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-xl" />
      </a>
      <div className="mt-4 space-y-1">
        <h4 className="text-lg font-semibold text-secondary truncate">{data.title}</h4>
        <p className="text-sm text-gray-400 truncate">{data.artist}</p>
      </div>
    </div>
  );
};

export default NowPlaying; 