import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db';
import { requireAuth } from '../middleware/clerk';

const messages = new Hono();

// GET /api/messages/conversations  — list user's conversations
messages.get('/conversations', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const userId = profile[0].id;

  const rows = await sql`
    SELECT cv.*, 
      (SELECT content FROM public.messages m
       WHERE m.conversation_id = cv.id AND m.is_deleted = false
       ORDER BY m.created_at DESC LIMIT 1) AS last_message,
      (SELECT created_at FROM public.messages m
       WHERE m.conversation_id = cv.id AND m.is_deleted = false
       ORDER BY m.created_at DESC LIMIT 1) AS last_message_at
    FROM public.conversations cv
    JOIN public.conversation_participants cp ON cp.conversation_id = cv.id
    WHERE cp.user_id = ${userId}::uuid
    ORDER BY last_message_at DESC NULLS LAST
  `;
  return c.json(rows);
});

// GET /api/messages/conversations/:convId  — messages in a conversation
messages.get('/conversations/:convId', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const convId = c.req.param('convId');
  const limit  = Math.min(Number(c.req.query('limit') ?? 50), 100);
  const before = c.req.query('before'); // ISO timestamp for pagination

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const userId = profile[0].id;

  // Verify user is a participant
  const participant = await sql`
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = ${convId}::uuid AND user_id = ${userId}::uuid LIMIT 1
  `;
  if (!participant.length) return c.json({ error: 'Forbidden' }, 403);

  const rows = before
    ? await sql`
        SELECT m.*, pr.first_name, pr.last_name, pr.avatar_url
        FROM public.messages m
        JOIN public.profiles pr ON pr.id = m.sender_id
        WHERE m.conversation_id = ${convId}::uuid
          AND m.is_deleted = false
          AND m.created_at < ${before}::timestamptz
        ORDER BY m.created_at DESC
        LIMIT ${limit}
      `
    : await sql`
        SELECT m.*, pr.first_name, pr.last_name, pr.avatar_url
        FROM public.messages m
        JOIN public.profiles pr ON pr.id = m.sender_id
        WHERE m.conversation_id = ${convId}::uuid AND m.is_deleted = false
        ORDER BY m.created_at DESC
        LIMIT ${limit}
      `;

  return c.json(rows.reverse()); // Oldest first for display
});

const sendSchema = z.object({
  content:         z.string().min(1).max(10000),
  message_type:    z.string().default('text'),
  media_url:       z.string().url().optional().nullable(),
});

// POST /api/messages/conversations/:convId  — send a message
messages.post('/conversations/:convId', requireAuth, zValidator('json', sendSchema), async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const convId = c.req.param('convId');
  const body = c.req.valid('json');

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const userId = profile[0].id;

  // Verify participant
  const participant = await sql`
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = ${convId}::uuid AND user_id = ${userId}::uuid LIMIT 1
  `;
  if (!participant.length) return c.json({ error: 'Forbidden' }, 403);

  const msg = await sql`
    INSERT INTO public.messages
      (conversation_id, sender_id, content, message_type, media_url)
    VALUES
      (${convId}::uuid, ${userId}::uuid, ${body.content}, ${body.message_type}, ${body.media_url ?? null})
    RETURNING *
  `;

  // Update conversation's updated_at
  await sql`UPDATE public.conversations SET updated_at = now() WHERE id = ${convId}::uuid`;

  return c.json(msg[0], 201);
});

// POST /api/messages/conversations  — create a new direct conversation
messages.post('/conversations', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const { participant_id } = await c.req.json<{ participant_id: string }>();

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const userId = profile[0].id;

  // Check if DM conversation already exists
  const existing = await sql`
    SELECT cv.id FROM public.conversations cv
    JOIN public.conversation_participants cp1 ON cp1.conversation_id = cv.id AND cp1.user_id = ${userId}::uuid
    JOIN public.conversation_participants cp2 ON cp2.conversation_id = cv.id AND cp2.user_id = ${participant_id}::uuid
    WHERE cv.is_group = false
    LIMIT 1
  `;
  if (existing.length) return c.json(existing[0]);

  const conv = await sql`
    INSERT INTO public.conversations (is_group, created_by) VALUES (false, ${userId}::uuid) RETURNING *
  `;
  const convId = conv[0].id;
  await sql`
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES (${convId}::uuid, ${userId}::uuid), (${convId}::uuid, ${participant_id}::uuid)
  `;

  return c.json(conv[0], 201);
});

export default messages;
