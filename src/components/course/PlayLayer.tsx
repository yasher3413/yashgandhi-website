import React from 'react';
import { type HoleSpec } from './CourseArt';
import type { Golf } from '@/lib/useGolf';
import { partialFlight } from '@/lib/useFlight';

type Props = { spec: HoleSpec; g: Golf; children?: React.ReactNode };

/**
 * Everything drawn on top of a playable hole: flight lines, the pull-back
 * band, the aim reticle, pencil notes, the ball and its grab handle. Marks are
 * sized in screen pixels (via g.u) so they read the same on a phone.
 */
const PlayLayer = ({ spec, g, children }: Props) => {
  const { u, pos, lift } = g;
  const right = (p: [number, number]) => p[0] > spec.w - u(130);

  return (
    <g
      ref={(el) => {
        g.svgRef.current = el?.ownerSVGElement ?? null;
      }}
    >
      {g.segs.map((sg, i) => {
        // the shot still in the air is drawn only as far as the ball has got
        const live = g.inFlight && i === g.segs.length - 1;
        return (
          <path
            key={i}
            d={live ? partialFlight(g.flight) : `M${sg.from[0]},${sg.from[1]} Q${sg.via[0]},${sg.via[1]} ${sg.to[0]},${sg.to[1]}`}
            fill="none"
            stroke="#f3f6ef"
            strokeOpacity="0.75"
            strokeWidth={u(1.6)}
            strokeDasharray={`${u(2)} ${u(5)}`}
            strokeLinecap="round"
            pointerEvents="none"
          />
        );
      })}

      {children}

      {/* the band from the ball back to the finger, and where the shot is going */}
      {g.pull && (
        <g pointerEvents="none">
          <line x1={pos[0]} y1={pos[1]} x2={g.pull[0]} y2={g.pull[1]} stroke="#e7d39a" strokeWidth={u(2.5)} strokeLinecap="round" />
          <circle cx={g.pull[0]} cy={g.pull[1]} r={u(8)} fill="#0c2e1e" fillOpacity="0.4" stroke="#e7d39a" strokeWidth={u(1.6)} />
        </g>
      )}
      {g.projected && (
        <g pointerEvents="none">
          <line x1={pos[0]} y1={pos[1]} x2={g.projected.at[0]} y2={g.projected.at[1]} stroke="#f3f6ef" strokeOpacity="0.75" strokeWidth={u(1.3)} strokeDasharray={`${u(6)} ${u(5)}`} />
          <circle cx={g.projected.at[0]} cy={g.projected.at[1]} r={u(11)} fill="none" stroke="#f3f6ef" strokeWidth={u(1.3)} />
          <line x1={g.projected.at[0] - u(17)} y1={g.projected.at[1]} x2={g.projected.at[0] - u(7)} y2={g.projected.at[1]} stroke="#f3f6ef" strokeWidth={u(1.3)} />
          <line x1={g.projected.at[0] + u(7)} y1={g.projected.at[1]} x2={g.projected.at[0] + u(17)} y2={g.projected.at[1]} stroke="#f3f6ef" strokeWidth={u(1.3)} />
          <text
            x={g.projected.at[0] + (right(g.projected.at) ? -u(22) : u(22))}
            y={g.projected.at[1] - u(12)}
            textAnchor={right(g.projected.at) ? 'end' : 'start'}
            fontFamily="'Azeret Mono', monospace"
            fontSize={u(12)}
            fill="#f3f6ef"
            stroke="#0c2e1e"
            strokeWidth={u(3.5)}
            strokeLinejoin="round"
            paintOrder="stroke"
          >
            {g.readout}
          </text>
        </g>
      )}

      {g.note && (
        <text
          x={Math.min(g.note.at[0] + u(12), spec.w - u(150))}
          y={Math.max(g.note.at[1] + u(26), u(30))}
          fontFamily="'Nanum Pen Script', cursive"
          fontSize={u(24)}
          fill={g.note.good ? '#ef3b2c' : '#e7d39a'}
          stroke="#0c2e1e"
          strokeWidth={u(4)}
          strokeLinejoin="round"
          paintOrder="stroke"
          pointerEvents="none"
        >
          {g.note.text}
        </text>
      )}

      <ellipse cx={pos[0] + lift * u(20)} cy={pos[1] + lift * u(24)} rx={u(6)} ry={u(3.8)} fill="#06170c" opacity={0.45 - lift * 0.25} pointerEvents="none" />
      {!g.holed && (
        <>
          {g.focused && <circle cx={pos[0]} cy={pos[1]} r={u(16)} fill="none" stroke="#e7d39a" strokeWidth={u(2)} pointerEvents="none" />}
          {g.canPlay && !g.pull && (
            <circle className="ball-ping" cx={pos[0]} cy={pos[1]} r={u(12)} fill="none" stroke="#f3f6ef" strokeWidth={u(1.2)} pointerEvents="none" />
          )}
          <circle cx={pos[0]} cy={pos[1] - lift * u(26)} r={u(5.5) + lift * u(4)} fill="#fff" stroke="#0c2e1e" strokeOpacity="0.35" strokeWidth={u(0.8)} pointerEvents="none" />
        </>
      )}

      {/* the only touch target that swallows scrolling is the ball itself */}
      {g.canPlay && (
        <circle
          cx={pos[0]}
          cy={pos[1]}
          r={g.grabRadius}
          fill="transparent"
          role="button"
          tabIndex={0}
          aria-label={`Ball, stroke ${g.strokes + 1}. Drag it back and release to hit. With a keyboard, use the arrow keys to pull back and Enter to hit.`}
          className="outline-none"
          style={{ touchAction: 'none', cursor: g.pull ? 'grabbing' : 'grab' }}
          {...g.grab}
        />
      )}
    </g>
  );
};

export default PlayLayer;
