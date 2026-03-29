import type { NextApiRequest, NextApiResponse } from 'next';

const CAL_API_BASE = 'https://api.cal.com';
const API_VERSION = '2024-09-04';

const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
};

const getDateString = (date: Date) => date.toISOString().slice(0, 10);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing CAL_API_KEY' });
  }

  const timeZone = typeof req.query.timeZone === 'string' ? req.query.timeZone : 'UTC';
  const username = getEnv('CAL_USERNAME', 'yashgandhi') ?? 'yashgandhi';
  const eventTypeSlug = getEnv('CAL_EVENT_SLUG', '20') ?? '20';

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 14);

  const url = new URL(`${CAL_API_BASE}/v2/slots`);
  url.searchParams.set('eventTypeSlug', eventTypeSlug);
  url.searchParams.set('username', username);
  url.searchParams.set('start', getDateString(startDate));
  url.searchParams.set('end', getDateString(endDate));
  url.searchParams.set('timeZone', timeZone);
  url.searchParams.set('format', 'range');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'cal-api-version': API_VERSION,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.message ?? 'Failed to fetch slots' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Cal.com slots error:', error);
    return res.status(500).json({ error: 'Failed to fetch slots' });
  }
}
