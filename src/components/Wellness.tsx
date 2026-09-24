import React, { useEffect, useMemo, useState } from 'react';
import Hole from './course/Hole';
import { specs } from '@/content';
import { routeSpec } from '@/lib/route';

interface StravaActivity {
  name: string;
  type: string;
  distance: number;
  movingTime: number;
  startDate: string;
  kudos: number;
  averageSpeed: number;
  polyline?: string | null;
}

interface StravaStats {
  recentRunDistance: number;
  recentRunCount: number;
  recentRunMovingTime: number;
  recentRideDistance: number;
  recentRideCount: number;
  recentRideMovingTime: number;
  recentSwimDistance: number;
  recentSwimCount: number;
  recentSwimMovingTime: number;
}

interface StravaResponse {
  activity: StravaActivity | null;
  stats: StravaStats | null;
}

const km = (meters: number) => (meters ? (meters / 1000).toFixed(1) : '0.0');

const formatDuration = (seconds: number) => {
  if (!seconds) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

const formatPace = (metersPerSecond: number) => {
  if (!metersPerSecond) return '—';
  const secondsPerKm = 1000 / metersPerSecond;
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const Figure = ({ value, unit, label }: { value: string; unit?: string; label: string }) => (
  <div className="border-t border-chalk/15 pt-3">
    <p className="text-sm text-moss">{label}</p>
    <p className="mt-1 font-display text-chalk text-[2.1rem] sm:text-6xl leading-none tabular whitespace-nowrap" style={{ fontWeight: 800 }}>
      {value}
      {unit && <span className="font-mono text-sm text-moss ml-1.5 align-baseline" style={{ fontWeight: 400 }}>{unit}</span>}
    </p>
  </div>
);

const Waiting = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-6 font-pencil text-2xl text-sand min-h-[6rem]">{children}</p>
);

const Wellness = () => {
  const [data, setData] = useState<StravaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStrava = async () => {
      try {
        const response = await fetch('/api/strava');
        setData(await response.json());
      } catch (error) {
        console.error('Error fetching Strava data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStrava();
  }, []);

  // Once Strava answers, the hole is redrawn from the route of the latest run.
  const route = useMemo(
    () => (data?.activity?.polyline ? routeSpec(data.activity.polyline, data.activity.distance) : null),
    [data]
  );

  return (
    <Hole
      id="wellness"
      n={7}
      name="Wellness"
      par={5}
      yards={route ? route.yards.toLocaleString('en-US') : '46,151'}
      note={route ? 'this hole is my last run' : "that's 42.2 km"}
      spec={route ?? specs.wellness} labels={['Latest', '4 weeks']} hideYards side="left">
      <div data-shot>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display uppercase text-chalk text-3xl sm:text-4xl" style={{ fontWeight: 800 }}>
            Latest Activity
          </h3>
          <span className="inline-flex items-center gap-2 text-sm text-moss">
            <span className="w-2 h-2 rounded-full bg-flag" aria-hidden="true" />
            Fresh from Strava
          </span>
        </div>
        {isLoading ? (
          <Waiting>pulling the latest from Strava…</Waiting>
        ) : data?.activity ? (
          <>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="text-2xl text-chalk font-medium">{data.activity.name}</p>
              <p className="text-sm text-moss tabular">
                {data.activity.type} · {formatDate(data.activity.startDate)} · {data.activity.kudos} kudos
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8">
              <Figure label="Distance" value={km(data.activity.distance)} unit="km" />
              <Figure label="Time" value={formatDuration(data.activity.movingTime)} />
              <Figure label="Avg pace" value={formatPace(data.activity.averageSpeed)} unit="/km" />
            </div>
          </>
        ) : (
          <Waiting>No activity data yet. Check back after the next workout.</Waiting>
        )}
      </div>

      <div data-shot className="mt-20">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display uppercase text-chalk text-3xl sm:text-4xl" style={{ fontWeight: 800 }}>
            Running Volume
          </h3>
          <span className="text-sm text-moss">Last 4 weeks of training</span>
        </div>
        {isLoading ? (
          <Waiting>adding up the kilometres…</Waiting>
        ) : data?.stats ? (
          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8">
            <Figure label="Distance" value={km(data.stats.recentRunDistance)} unit="km" />
            <Figure label="Runs" value={String(data.stats.recentRunCount)} />
            <Figure label="Time" value={formatDuration(data.stats.recentRunMovingTime)} />
          </div>
        ) : (
          <Waiting>Stats will appear once Strava connects.</Waiting>
        )}
      </div>
    </Hole>
  );
};

export default Wellness;
