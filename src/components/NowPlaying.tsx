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

const Bars = () => (
  <span className="inline-flex items-end gap-[2px] h-3" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-[3px] bg-flag rounded-[1px] motion-safe:animate-[eq_0.9s_ease-in-out_infinite]" style={{ height: '100%', animationDelay: `${i * 0.18}s`, transformOrigin: 'bottom' }} />
    ))}
  </span>
);

const NowPlaying = () => {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredTrack();
    if (stored?.title) setData({ ...stored, isPlaying: false });

    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify');
        const next = await response.json();
        if (next.title) {
          setStoredTrack({ ...next, isPlaying: next.isPlaying });
          setData(next);
        } else if (!next.isPlaying) {
          const last = getStoredTrack();
          if (last?.title) setData({ ...last, isPlaying: false });
          else setData((prev) => (prev?.title ? { ...prev, isPlaying: false } : next));
        } else {
          setData(next);
        }
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
        const last = getStoredTrack();
        if (last?.title) setData({ ...last, isPlaying: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const live = !!data?.isPlaying && !!data?.title;
  const hasTrack = !!data?.title;

  return (
    <div>
      <p className="text-sm text-moss flex items-center gap-2 h-5">
        {isLoading && !hasTrack ? (
          'Checking Spotify…'
        ) : live ? (
          <>
            <Bars /> <span className="text-flag">Now playing</span>
          </>
        ) : hasTrack ? (
          'Last played'
        ) : (
          'Not playing'
        )}
      </p>

      <a
        href={hasTrack ? data!.songUrl : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={`group mt-4 block relative aspect-square w-full rounded-[3px] overflow-hidden bg-deep shadow-[0_24px_40px_-18px_rgba(0,0,0,0.7)] ${live ? 'ring-2 ring-flag ring-offset-4 ring-offset-rough' : ''}`}
      >
        {hasTrack ? (
          <Image
            src={data!.albumImageUrl ?? '/spotify-placeholder.png'}
            alt={`${data!.title} by ${data!.artist}`}
            fill
            sizes="(min-width: 1024px) 360px, 90vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${live ? '' : 'saturate-[0.8]'}`}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-pencil text-2xl text-sand px-6 text-center">
              {isLoading ? 'warming up…' : 'Not playing anything right now, check back soon!'}
            </span>
          </div>
        )}
      </a>

      {hasTrack && (
        <div className="mt-4 min-w-0">
          <p className={`text-xl font-semibold truncate ${live ? 'text-chalk' : 'text-chalk/90'}`}>{data!.title}</p>
          <p className="text-mist truncate">{data!.artist}</p>
        </div>
      )}
    </div>
  );
};

export default NowPlaying;
