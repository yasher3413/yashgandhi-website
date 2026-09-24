import { db } from './redis';

// WHOOP OAuth. Refresh tokens rotate: every refresh returns a new one and kills
// the old, and if two refreshes race, the loser's token is dead. So the current
// refresh token lives in Redis (not env), and only one caller refreshes at a time.

export const WHOOP_AUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const TOKEN_URL = 'https://api.prod.whoop.com/oauth/oauth2/token';
const API = 'https://api.prod.whoop.com/developer/v2';

export const WHOOP_SCOPES = 'offline read:recovery read:cycles read:sleep read:workout';

const K = {
  refresh: 'whoop:refresh',
  access: 'whoop:access',
  lock: 'whoop:lock',
  state: (s: string) => `whoop:state:${s}`,
};

export class WhoopNotConnected extends Error {}

const creds = () => {
  const id = process.env.WHOOP_CLIENT_ID;
  const secret = process.env.WHOOP_CLIENT_SECRET;
  if (!id || !secret) throw new WhoopNotConnected('WHOOP client credentials are not set');
  return { id, secret };
};

type TokenResponse = { access_token: string; refresh_token?: string; expires_in: number };

const saveTokens = async (t: TokenResponse) => {
  if (t.refresh_token) await db().set(K.refresh, t.refresh_token);
  // keep a minute of slack so a token never expires mid-request
  await db().set(K.access, t.access_token, { ex: Math.max(60, t.expires_in - 60) });
};

const postToken = async (body: Record<string, string>): Promise<TokenResponse> => {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  });
  if (!res.ok) throw new Error(`WHOOP token request failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
};

/** The state for one connect attempt: 8 characters, as WHOOP requires, valid for 10 minutes. */
export const newState = async () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const state = Array.from(bytes, (b) => chars[b % chars.length]).join('');
  await db().set(K.state(state), 1, { ex: 600 });
  return state;
};

export const takeState = async (state: string) => (await db().getdel(K.state(state))) !== null;

export const exchangeCode = async (code: string, redirectUri: string) => {
  const { id, secret } = creds();
  const t = await postToken({ grant_type: 'authorization_code', code, client_id: id, client_secret: secret, redirect_uri: redirectUri });
  if (!t.refresh_token) throw new Error('WHOOP returned no refresh token; is the offline scope enabled?');
  await saveTokens(t);
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const accessToken = async (): Promise<string> => {
  const cached = await db().get<string>(K.access);
  if (cached) return cached;

  const got = await db().set(K.lock, 1, { nx: true, px: 15000 });
  if (!got) {
    // someone else is refreshing; wait for their token rather than racing them
    for (let i = 0; i < 30; i++) {
      await sleep(250);
      const t = await db().get<string>(K.access);
      if (t) return t;
    }
    throw new Error('Timed out waiting for a WHOOP token refresh');
  }

  try {
    const refresh = await db().get<string>(K.refresh);
    if (!refresh) throw new WhoopNotConnected('WHOOP is not connected yet');
    const { id, secret } = creds();
    const t = await postToken({ grant_type: 'refresh_token', refresh_token: refresh, client_id: id, client_secret: secret, scope: 'offline' });
    await saveTokens(t);
    return t.access_token;
  } finally {
    await db().del(K.lock);
  }
};

export const whoopGet = async <T>(path: string, params: Record<string, string | number> = {}): Promise<T> => {
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
  const url = `${API}${path}${qs ? `?${qs}` : ''}`;
  let token = await accessToken();
  let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) {
    // token revoked early: drop it and refresh once
    await db().del(K.access);
    token = await accessToken();
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  }
  if (!res.ok) throw new Error(`WHOOP ${path} failed: ${res.status}`);
  return res.json();
};
