import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import webhooksRouter from './routes/webhooks';
import profilesRouter from './routes/profiles';
import postsRouter from './routes/posts';
import campaignsRouter from './routes/campaigns';
import organizationsRouter from './routes/organizations';
import messagesRouter from './routes/messages';
import notificationsRouter from './routes/notifications';
import uploadRouter from './routes/upload';

const app = new Hono().basePath('/api');

// ── Global middleware ─────────────────────────────────────────────────────
app.use('*', logger());
app.use('*', cors({
  origin: [
    'https://soulve-app.vercel.app',
    'http://localhost:8080',
    'http://localhost:3000',
  ],
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ── Routes ───────────────────────────────────────────────────────────────
app.route('/webhooks', webhooksRouter);
app.route('/profiles', profilesRouter);
app.route('/posts', postsRouter);
app.route('/campaigns', campaignsRouter);
app.route('/organizations', organizationsRouter);
app.route('/messages', messagesRouter);
app.route('/notifications', notificationsRouter);
app.route('/upload', uploadRouter);

// Health check
app.get('/health', (c) => c.json({ ok: true, ts: new Date().toISOString() }));

// 404 catch-all
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('API error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
