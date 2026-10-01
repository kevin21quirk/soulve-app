import app from '../src/api/app.js';

export const config = { runtime: 'nodejs' };

// Bridge Vercel's Node-style (req, res) invocation to the Hono app's
// fetch-style handler. hono/vercel's handle() assumes the runtime calls the
// handler with a Web Request; on this runtime it receives an IncomingMessage,
// so app.fetch never produces a written response and the request hangs.
export default async function handler(req: any, res: any) {
  if (typeof Request !== 'undefined' && req instanceof Request) {
    const response = await app.fetch(req);
    if (res && typeof res.setHeader === 'function') {
      await writeResponse(res, response);
      return;
    }
    return response;
  }

  const proto = req.headers['x-forwarded-proto'] ?? 'https';
  const host = req.headers.host ?? 'localhost';
  const url = `${proto}://${host}${req.url}`;

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers ?? {})) {
    if (typeof v === 'string') headers.set(k, v);
    else if (Array.isArray(v)) headers.set(k, v.join(', '));
  }

  let body: Buffer | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    if (chunks.length) body = Buffer.concat(chunks);
  }

  const request = new Request(url, {
    method: req.method,
    headers,
    body,
  });
  const response = await app.fetch(request);
  await writeResponse(res, response);
}

async function writeResponse(res: any, response: Response) {
  res.status(response.status);
  response.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === 'content-encoding' || k === 'transfer-encoding' || k === 'connection') return;
    res.setHeader(k, value);
  });
  res.send(Buffer.from(await response.arrayBuffer()));
}
