import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db';
import { requireAuth } from '../middleware/clerk';

const posts = new Hono();

const createSchema = z.object({
  content:          z.string().min(1).max(10000),
  category:         z.enum(['help-needed', 'help-offered', 'success-story', 'announcement', 'question', 'recommendation', 'event', 'lost-found']),
  visibility:       z.enum(['public', 'friends', 'private']).default('public'),
  urgency:          z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  media_urls:       z.array(z.string().url()).default([]),
  tags:             z.array(z.string()).default([]),
  location:         z.string().optional().nullable(),
  organization_id:  z.string().uuid().optional().nullable(),
});

// GET /api/posts  — public feed with pagination
posts.get('/', async (c) => {
  const limit  = Math.min(Number(c.req.query('limit') ?? 20), 50);
  const offset = Number(c.req.query('offset') ?? 0);
  const category = c.req.query('category');

  const rows = category
    ? await sql`
        SELECT p.*, pr.first_name, pr.last_name, pr.avatar_url
        FROM public.posts p
        JOIN public.profiles pr ON pr.id = p.user_id
        WHERE p.visibility = 'public' AND p.is_active = true AND p.category = ${category}
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    : await sql`
        SELECT p.*, pr.first_name, pr.last_name, pr.avatar_url
        FROM public.posts p
        JOIN public.profiles pr ON pr.id = p.user_id
        WHERE p.visibility = 'public' AND p.is_active = true
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

  return c.json(rows);
});

// GET /api/posts/:id
posts.get('/:id', async (c) => {
  const id = c.req.param('id');
  const rows = await sql`
    SELECT p.*, pr.first_name, pr.last_name, pr.avatar_url
    FROM public.posts p
    JOIN public.profiles pr ON pr.id = p.user_id
    WHERE p.id = ${id}::uuid AND p.is_active = true
    LIMIT 1
  `;
  if (!rows.length) return c.json({ error: 'Post not found' }, 404);
  return c.json(rows[0]);
});

// POST /api/posts  — create a post
posts.post('/', requireAuth, zValidator('json', createSchema), async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const body = c.req.valid('json');

  // Resolve profile ID from clerk_user_id
  const profile = await sql`
    SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1
  `;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const userId = profile[0].id;

  const rows = await sql`
    INSERT INTO public.posts
      (user_id, content, category, visibility, urgency, media_urls, tags, location, organization_id)
    VALUES
      (${userId}::uuid, ${body.content}, ${body.category}, ${body.visibility},
       ${body.urgency}, ${JSON.stringify(body.media_urls)}, ${JSON.stringify(body.tags)},
       ${body.location ?? null}, ${body.organization_id ?? null})
    RETURNING *
  `;
  return c.json(rows[0], 201);
});

// DELETE /api/posts/:id
posts.delete('/:id', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const id = c.req.param('id');

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Unauthorized' }, 403);

  const result = await sql`
    UPDATE public.posts
    SET is_active = false, updated_at = now()
    WHERE id = ${id}::uuid AND user_id = ${profile[0].id}::uuid
    RETURNING id
  `;
  if (!result.length) return c.json({ error: 'Post not found or unauthorized' }, 404);
  return c.json({ deleted: true });
});

export default posts;
