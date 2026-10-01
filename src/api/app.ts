import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import webhooksRouter from './routes/webhooks.js';
import profilesRouter from './routes/profiles.js';
import postsRouter from './routes/posts.js';
import campaignsRouter from './routes/campaigns.js';
import organizationsRouter from './routes/organizations.js';
import messagesRouter from './routes/messages.js';
import notificationsRouter from './routes/notifications.js';
import uploadRouter from './routes/upload.js';
import documentsRouter from './routes/documents.js';
import helperApplicationsRouter from './routes/helperApplications.js';
import verificationsRouter from './routes/verifications.js';
import feedbackRouter from './routes/feedback.js';
import esgRouter from './routes/esg.js';

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
app.route('/documents', documentsRouter);
app.route('/helper-applications', helperApplicationsRouter);
app.route('/verifications', verificationsRouter);
app.route('/feedback', feedbackRouter);
app.route('/esg', esgRouter);

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
