import React from 'react';
import type { Wind } from '@/lib/round';

export const WindVane = ({ wind, className = '' }: { wind: Wind; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] text-moss tabular ${className}`}>
    <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${wind.deg}deg)` }}>
      <path d="M-6 0H5M1.5-3.5L5 0l-3.5 3.5" fill="none" stroke="#e7d39a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    WIND {wind.mph} MPH
  </span>
);

export const SoundToggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle} aria-pressed={on} className="inline-flex items-center gap-1.5 text-sm text-moss hover:text-chalk transition-colors">
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 6h2.5l3.5-3v10l-3.5-3H2.5z" fill="currentColor" fillOpacity="0.15" />
      {on ? <path d="M11 5.5a3.5 3.5 0 010 5M12.8 3.8a6 6 0 010 8.4" /> : <path d="M11 6l3.5 4M14.5 6L11 10" />}
    </svg>
    Sound {on ? 'on' : 'off'}
  </button>
);

/** A golf cart seen from above, nose pointing right. */
export const CartGlyph = ({ size = 56, shadow = true }: { size?: number; shadow?: boolean }) => (
  <svg width={size} height={size * 0.62} viewBox="-26 -16 52 32" aria-hidden="true" className="overflow-visible">
    {shadow && <rect x="-21" y="-10" width="46" height="26" rx="7" fill="#06170c" opacity="0.35" />}
    {[[-17, -15.5], [9, -15.5], [-17, 10.5], [9, 10.5]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="9" height="5" rx="1.5" fill="#1b1f1c" />
    ))}
    <rect x="-23" y="-12" width="46" height="24" rx="6" fill="#f3f6ef" />
    <rect x="16" y="-9" width="6" height="18" rx="3" fill="#dfe5dc" />
    <circle cx="21" cy="-8" r="1.6" fill="#e7d39a" />
    <circle cx="21" cy="8" r="1.6" fill="#e7d39a" />
    <rect x="-9" y="-10.5" width="23" height="21" rx="3.5" fill="#dde3da" stroke="#b9c2b6" strokeWidth="0.8" />
    <circle cx="-17" cy="-4" r="4.2" fill="#ef3b2c" />
    <circle cx="-17" cy="-4" r="2" fill="#b3261e" />
    <circle cx="-17" cy="5" r="4.2" fill="#12402a" />
    <circle cx="-17" cy="5" r="2" fill="#0c2e1e" />
  </svg>
);

export const CartPictogram = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h13M5 3v7M15 3v7M2 10h17l2-3h-3M6 13.5a1.5 1.5 0 100-.01M17 13.5a1.5 1.5 0 100-.01" />
  </svg>
);

export const ScrollPictogram = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 16 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="1.5" width="10" height="15" rx="5" />
    <path d="M8 5v3M5.5 17.5L8 19l2.5-1.5" />
  </svg>
);
