import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
}

const STORAGE_KEY = 'spotify-last-track';

const getStoredTrack = (): SpotifyData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SpotifyData) : null;
  } catch {
    return null;
  }
};

const setStoredTrack = (track: SpotifyData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(track));
  } catch {
    // ignore
  }
};

const NowPlaying = () => {
  const [data, setData] = useState<SpotifyData | null>(() => {
    const stored = typeof window !== 'undefined' ? getStoredTrack() : null;
    return stored?.title ? { ...stored, isPlaying: false } : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify');
        const data = await response.json();
        if (data.title) {
          setStoredTrack({ ...data, isPlaying: data.isPlaying });
          setData(data);
        } else if (!data.isPlaying) {
          const stored = getStoredTrack();
          if (stored?.title) {
            setData({ ...stored, isPlaying: false });
          } else {
            setData(prev => (prev?.title ? { ...prev, isPlaying: false } : data));
          }
        } else {
          setData(data);
        }
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
        const stored = getStoredTrack();
        if (stored?.title) setData({ ...stored, isPlaying: false });
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

  // Not playing but we have last played track — show it
  if (!data?.isPlaying && data?.title) {
    return (
      <div className="flex flex-col flex-1 min-h-[360px]">
        <a
          href={data.songUrl ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex-1"
        >
          <Image
            src={data.albumImageUrl ?? '/spotify-placeholder.png'}
            alt={`${data.title} by ${data.artist}`}
            fill
            className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-xl" />
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-black/60 text-gray-300">
            Last played
          </span>
        </a>
        <div className="mt-4 space-y-1">
          <h4 className="text-lg font-semibold text-secondary truncate">{data.title}</h4>
          <p className="text-sm text-gray-400 truncate">{data.artist}</p>
        </div>
      </div>
    );
  }

  // No track data at all — show placeholder
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