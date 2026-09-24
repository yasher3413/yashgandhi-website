import type { NextApiRequest } from 'next';

/** Must match a redirect URI registered in the WHOOP developer dashboard, exactly. */
export const redirectUri = (req: NextApiRequest) => {
  if (process.env.WHOOP_REDIRECT_URI) return process.env.WHOOP_REDIRECT_URI;
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;
  const proto = req.headers['x-forwarded-proto'] ?? (String(host).startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}/api/whoop/callback`;
};
