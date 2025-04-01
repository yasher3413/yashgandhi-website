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

const getNowPlaying = async () => {
  try {
    const { access_token } = await getAccessToken();
    console.log('Got access token successfully');

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error getting now playing:', error);
      throw new Error(`Failed to get now playing: ${error.error_description}`);
    }

    return response;
  } catch (error) {
    console.error('Error in getNowPlaying:', error);
    throw error;
  }
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
    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
      console.log('No song currently playing or error status:', response.status);
      return res.status(200).json({ isPlaying: false });
    }

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
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 