import { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// Add validation for environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('Missing environment variables:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRefreshToken: !!REFRESH_TOKEN
  });
}

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
  try {
    console.log('Attempting to get access token...');
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN!,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error getting access token:', error);
      throw new Error(`Failed to get access token: ${error.error_description}`);
    }

    const data = await response.json();
    console.log('Successfully got access token');
    return data;
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
};

const getNowPlaying = async (accessToken: string) => {
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

const getRecentlyPlayed = async (accessToken: string) => {
  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) return null;
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
    console.log('Fetching now playing...');
    const { access_token } = await getAccessToken();
    const response = await getNowPlaying(access_token);

    if (response.status === 200) {
      const song = await response.json();
      console.log('Received song data:', song);

      const isPlaying = song.is_playing;
      const title = song.item.name;
      const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
      const albumImageUrl = song.item.album.images[0].url;
      const songUrl = song.item.external_urls.spotify;

      return res.status(200).json({
        isPlaying,
        title,
        artist,
        albumImageUrl,
        songUrl,
      });
    }

    // No song currently playing — fetch last played track
    console.log('No song currently playing, fetching recently played...');
    const recentlyPlayed = await getRecentlyPlayed(access_token);
    if (recentlyPlayed?.items?.length > 0) {
      const lastPlayed = recentlyPlayed.items[0];
      const track = lastPlayed.track;
      const title = track.name;
      const artist = track.artists.map((a: { name: string }) => a.name).join(', ');
      const albumImageUrl = track.album?.images?.[0]?.url ?? null;
      const songUrl = track.external_urls?.spotify ?? null;

      return res.status(200).json({
        isPlaying: false,
        title,
        artist,
        albumImageUrl,
        songUrl,
      });
    }

    return res.status(200).json({ isPlaying: false });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 