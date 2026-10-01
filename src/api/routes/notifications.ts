import { Hono } from 'hono';
import { sql } from '../db';
import { requireAuth } from '../middleware/clerk';

const notifications = new Hono();

// GET /api/notifications  — list user's notifications
notifications.get('/', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const limit  = Math.min(Number(c.req.query('limit') ?? 30), 100);
  const unreadOnly = c.req.query('unread') === 'true';

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const userId = profile[0].id;

  const rows = unreadOnly
    ? await sql`
        SELECT n.*, pr.first_name, pr.last_name, pr.avatar_url
        FROM public.notifications n
        LEFT JOIN public.profiles pr ON pr.id = n.actor_id
        WHERE n.recipient_id = ${userId}::uuid AND n.is_read = false
        ORDER BY n.created_at DESC
        LIMIT ${limit}
      `
    : await sql`
        SELECT n.*, pr.first_name, pr.last_name, pr.avatar_url
        FROM public.notifications n
        LEFT JOIN public.profiles pr ON pr.id = n.actor_id
        WHERE n.recipient_id = ${userId}::uuid
        ORDER BY n.created_at DESC
        LIMIT ${limit}
      `;

  return c.json(rows);
});

// GET /api/notifications/unread-count
notifications.get('/unread-count', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ count: 0 });
  const userId = profile[0].id;

  const result = await sql`
    SELECT COUNT(*) AS count FROM public.notifications
    WHERE recipient_id = ${userId}::uuid AND is_read = false
  `;
  return c.json({ count: Number(result[0]?.count ?? 0) });
});

// POST /api/notifications/:id/read  — mark one as read
notifications.post('/:id/read', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const notifId = c.req.param('id');

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Unauthorized' }, 403);
  const userId = profile[0].id;

  await sql`
    UPDATE public.notifications
    SET is_read = true, read_at = now()
    WHERE id = ${notifId}::uuid AND recipient_id = ${userId}::uuid
  `;
  return c.json({ ok: true });
});

// POST /api/notifications/read-all  — mark all as read
notifications.post('/read-all', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Unauthorized' }, 403);
  const userId = profile[0].id;

  await sql`
    UPDATE public.notifications
    SET is_read = true, read_at = now()
    WHERE recipient_id = ${userId}::uuid AND is_read = false
  `;
  return c.json({ ok: true });
});

export default notifications;
