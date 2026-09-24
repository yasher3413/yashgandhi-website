import type { NextApiRequest, NextApiResponse } from 'next';
import { newState, WHOOP_AUTH_URL, WHOOP_SCOPES } from '@/lib/whoop';
import { redirectUri } from '@/lib/whoopRedirect';

/** One-time setup: sends the site owner to WHOOP to approve access. Guarded by a private key. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = process.env.WHOOP_CONNECT_KEY;
  if (!key || req.query.key !== key) return res.status(404).end('Not found');
  if (!process.env.WHOOP_CLIENT_ID) return res.status(500).end('WHOOP_CLIENT_ID is not set');

  const url = new URL(WHOOP_AUTH_URL);
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.WHOOP_CLIENT_ID,
    redirect_uri: redirectUri(req),
    scope: WHOOP_SCOPES,
    state: await newState(),
  }).toString();
  res.redirect(302, url.toString());
}
