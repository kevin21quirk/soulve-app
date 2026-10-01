// Clerk Frontend API proxy — allows a production Clerk instance to work on
// a *.vercel.app domain where the clerk.<domain> CNAME cannot be created.
//
// vercel.json rewrites /__clerk/:path* → /api/clerk/:path*, and this function
// forwards to https://frontend-api.clerk.dev/:path* with the headers Clerk
// requires for proxied FAPI access:
//   Clerk-Proxy-Url   — full public proxy URL
//   Clerk-Secret-Key  — server-side secret (never sent to browsers)
//   X-Forwarded-For   — original client IP (Vercel already sets this correctly)
//
// Configure in Clerk Dashboard → Domains → Frontend API → proxy URL:
//   https://soulve-app.vercel.app/__clerk
// and set VITE_CLERK_PROXY_URL to the same value for the React client.

const FAPI_ORIGIN = 'https://frontend-api.clerk.dev';
const PROXY_URL = process.env.CLERK_PROXY_URL ?? 'https://soulve-app.vercel.app/__clerk';

const HOP_BY_HOP = new Set([
  'host', 'connection', 'keep-alive', 'transfer-encoding',
  'te', 'trailer', 'upgrade', 'content-length',
]);

function readBody(req: any): Promise<Buffer | undefined> {
  return new Promise((resolve, reject) => {
    if (req.method === 'GET' || req.method === 'HEAD') return resolve(undefined);
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(chunks.length ? Buffer.concat(chunks) : undefined));
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  const segments = req.query?.path;
  const path = Array.isArray(segments) ? segments.join('/') : (segments ?? '');
  const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.headers ?? {})) {
    const key = k.toLowerCase();
    if (HOP_BY_HOP.has(key)) continue;
    if (typeof v === 'string') headers[key] = v;
    else if (Array.isArray(v)) headers[key] = v.join(', ');
  }
  headers['clerk-proxy-url'] = PROXY_URL;
  headers['clerk-secret-key'] = process.env.CLERK_SECRET_KEY ?? '';
  // Vercel sets x-forwarded-for with the real client IP leftmost already.
  if (req.headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = String(req.headers['x-forwarded-for']);
  }

  const body = await readBody(req);
  const upstream = await fetch(`${FAPI_ORIGIN}/${path}${query}`, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  });

  res.status(upstream.status);
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === 'content-encoding' || k === 'transfer-encoding' || k === 'connection') return;
    res.setHeader(k, value);
  });
  const setCookie = (upstream.headers as any).getSetCookie?.() ?? [];
  if (setCookie.length) res.setHeader('set-cookie', setCookie);

  const buf = Buffer.from(await upstream.arrayBuffer());
  res.send(buf);
}
