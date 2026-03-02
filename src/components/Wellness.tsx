import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

interface StravaActivity {
  name: string;
  type: string;
  distance: number;
  movingTime: number;
  startDate: string;
  kudos: number;
  averageSpeed: number;
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

const formatDistance = (meters: number) => {
  if (!meters) return '0.0 km';
  return `${(meters / 1000).toFixed(1)} km`;
};

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
  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds} /km`;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const Wellness = () => {
  const [data, setData] = useState<StravaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStrava = async () => {
      try {
        const response = await fetch('/api/strava');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching Strava data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrava();
  }, []);

  return (
    <section className="py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-12 text-left bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
      >
        Wellness
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="space-y-4 flex flex-col flex-1">
              <div className="flex items-start justify-between">
                <div>
                <h3 className="text-2xl font-bold text-secondary">Latest Activity</h3>
                <p className="text-gray-400">Fresh from Strava</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-secondary/80 bg-secondary/10 px-3 py-1 rounded-full">
                  Strava
                </span>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center flex-1 min-h-[220px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                </div>
              ) : data?.activity ? (
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-100">{data.activity.name}</p>
                      <p className="text-sm text-gray-400">
                        {data.activity.type} · {formatDate(data.activity.startDate)}
                      </p>
                    </div>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {data.activity.kudos} kudos
                    </span>
                  </div>
                  <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg border border-secondary/10 bg-primary/30 px-3 py-2">
                      <p className="text-gray-400">Distance</p>
                      <p className="text-gray-100 font-semibold">
                        {formatDistance(data.activity.distance)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-secondary/10 bg-primary/30 px-3 py-2">
                      <p className="text-gray-400">Time</p>
                      <p className="text-gray-100 font-semibold">
                        {formatDuration(data.activity.movingTime)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-secondary/10 bg-primary/30 px-3 py-2">
                      <p className="text-gray-400">Avg pace</p>
                      <p className="text-gray-100 font-semibold">
                        {formatPace(data.activity.averageSpeed)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 min-h-[220px] text-center">
                  <p className="text-gray-400">
                    No activity data yet. Check back after the next workout.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="space-y-4 flex flex-col flex-1">
              <div className="flex items-start justify-between">
                <div>
                <h3 className="text-2xl font-bold text-secondary">Running Volume</h3>
                <p className="text-gray-400">Last 4 weeks of training</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-secondary/80 bg-secondary/10 px-3 py-1 rounded-full">
                  Totals
                </span>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center flex-1 min-h-[220px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                </div>
              ) : data?.stats ? (
                <div className="rounded-xl border border-secondary/10 bg-primary/30 px-4 py-4 flex flex-col flex-1">
                  <p className="text-sm text-gray-400">Running</p>
                  <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-3">
                    <div>
                      <p className="text-gray-400">Distance</p>
                      <p className="text-gray-100 font-semibold">
                        {formatDistance(data.stats.recentRunDistance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Runs</p>
                      <p className="text-gray-100 font-semibold">
                        {data.stats.recentRunCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Time</p>
                      <p className="text-gray-100 font-semibold">
                        {formatDuration(data.stats.recentRunMovingTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 min-h-[220px] text-center">
                  <p className="text-gray-400">Stats will appear once Strava connects.</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Wellness;
