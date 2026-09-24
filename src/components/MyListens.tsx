import React from 'react';
import Hole from './course/Hole';
import NowPlaying from './NowPlaying';
import { specs } from '@/content';

const Embed = ({ title, note, src }: { title: string; note: string; src: string }) => (
  <div data-shot className="border-t border-chalk/15 pt-5">
    <h3 className="font-display uppercase text-chalk text-3xl" style={{ fontWeight: 800 }}>
      {title}
    </h3>
    <p className="mt-1 text-mist">{note}</p>
    <div className="mt-4 h-[152px] rounded-[12px] overflow-hidden bg-deep">
      <iframe
        src={src}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={title}
      />
    </div>
  </div>
);

const MyListens = () => (
  <Hole id="listens" n={8} name="My Listens" par={4} yards="390" spec={specs.listens} labels={['Now playing', 'Playlist', 'Podcast']} side="right">
    <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 sm:gap-10 items-start">
      <div data-shot className="max-w-[360px]">
        <h3 className="font-display uppercase text-chalk text-3xl mb-3" style={{ fontWeight: 800 }}>
          Now Playing
        </h3>
        <p className="text-mist mb-4">What I&apos;m listening to right now</p>
        <NowPlaying />
      </div>
      <div className="space-y-10">
        <Embed
          title="Current Playlist"
          note="My favorite EDM tracks"
          src="https://open.spotify.com/embed/playlist/77rK2UD8whsNGCJIWgZdyy?si=L8JUPaUyRjuHEnQInTpMnw&pi=hNgjYevpSCqKy&theme=0"
        />
        <Embed title="Favorite Podcast" note="Tools for everyday life" src="https://open.spotify.com/embed/show/79CkJF3UJTHFV8Dse3Oy0P?theme=0" />
      </div>
    </div>
  </Hole>
);

export default MyListens;
