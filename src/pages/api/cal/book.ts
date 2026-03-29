import type { NextApiRequest, NextApiResponse } from 'next';

const CAL_API_BASE = 'https://api.cal.com';
const API_VERSION = '2026-02-25';

const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing CAL_API_KEY' });
  }

  const { start, name, email, notes, timeZone } = req.body ?? {};
  if (!start || !name || !email || !timeZone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const username = getEnv('CAL_USERNAME', 'yashgandhi');
  const eventTypeSlug = getEnv('CAL_EVENT_SLUG', '20');

  try {
    const response = await fetch(`${CAL_API_BASE}/v2/bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'cal-api-version': API_VERSION,
      },
      body: JSON.stringify({
        start,
        attendee: {
          name,
          email,
          timeZone,
        },
        eventTypeSlug,
        username,
        metadata: notes ? { notes, source: 'website' } : { source: 'website' },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message ?? 'Failed to create booking',
        details: data,
      });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Cal.com booking error:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
}
