import type { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCode, takeState } from '@/lib/whoop';
import { redirectUri } from '@/lib/whoopRedirect';

const page = (title: string, body: string) =>
  `<!doctype html><meta name="viewport" content="width=device-width"><title>${title}</title>` +
  `<body style="background:#14482f;color:#f3f6ef;font:18px/1.5 system-ui;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center">` +
  `<div><h1 style="margin:0 0 8px">${title}</h1><p style="color:#b7cdbd">${body}</p><p><a href="/#wellness" style="color:#e7d39a">Back to the course</a></p></div>`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state, error } = req.query;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (error) return res.status(400).send(page('WHOOP said no', String(error)));
  if (typeof code !== 'string' || typeof state !== 'string' || !(await takeState(state))) {
    return res.status(400).send(page('Link expired', 'Start again from the connect link.'));
  }
  try {
    await exchangeCode(code, redirectUri(req));
    return res.status(200).send(page('WHOOP connected', 'Hole 7 will show live recovery, sleep and strain.'));
  } catch (e) {
    console.error('WHOOP callback failed:', e);
    return res.status(500).send(page('Could not connect', 'The token exchange failed. Check the redirect URI and client secret.'));
  }
}
