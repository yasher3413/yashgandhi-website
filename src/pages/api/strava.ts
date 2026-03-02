import { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('Missing Strava environment variables:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRefreshToken: !!REFRESH_TOKEN,
  });
}

const TOKEN_ENDPOINT = 'https://www.strava.com/oauth/token';
const ATHLETE_ENDPOINT = 'https://www.strava.com/api/v3/athlete';
const ACTIVITIES_ENDPOINT = 'https://www.strava.com/api/v3/athlete/activities?per_page=1';

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID ?? '',
      client_secret: CLIENT_SECRET ?? '',
      refresh_token: REFRESH_TOKEN ?? '',
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get access token: ${error.message ?? 'Unknown error'}`);
  }

  return response.json();
};

const fetchWithToken = async (url: string, accessToken: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Strava API error: ${error.message ?? response.statusText}`);
  }

  return response.json();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return res.status(500).json({ error: 'Missing Strava environment variables' });
    }
    const { access_token } = await getAccessToken();

    const athlete = await fetchWithToken(ATHLETE_ENDPOINT, access_token);
    const [activity] = await fetchWithToken(ACTIVITIES_ENDPOINT, access_token);

    const statsEndpoint = `https://www.strava.com/api/v3/athletes/${athlete.id}/stats`;
    const stats = await fetchWithToken(statsEndpoint, access_token);

    return res.status(200).json({
      activity: activity
        ? {
            name: activity.name,
            type: activity.type,
            distance: activity.distance,
            movingTime: activity.moving_time,
            startDate: activity.start_date,
            kudos: activity.kudos_count,
            averageSpeed: activity.average_speed,
          }
        : null,
      stats: stats
        ? {
            recentRunDistance: stats.recent_run_totals?.distance ?? 0,
            recentRunCount: stats.recent_run_totals?.count ?? 0,
            recentRunMovingTime: stats.recent_run_totals?.moving_time ?? 0,
            recentRideDistance: stats.recent_ride_totals?.distance ?? 0,
            recentRideCount: stats.recent_ride_totals?.count ?? 0,
            recentRideMovingTime: stats.recent_ride_totals?.moving_time ?? 0,
            recentSwimDistance: stats.recent_swim_totals?.distance ?? 0,
            recentSwimCount: stats.recent_swim_totals?.count ?? 0,
            recentSwimMovingTime: stats.recent_swim_totals?.moving_time ?? 0,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching Strava data:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
