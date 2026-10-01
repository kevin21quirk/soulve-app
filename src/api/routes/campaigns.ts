import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/clerk.js';

const campaigns = new Hono();

const createSchema = z.object({
  title:           z.string().min(1).max(500),
  description:     z.string().min(1),
  category:        z.string().optional().nullable(),
  goal_amount:     z.number().positive().optional().nullable(),
  end_date:        z.string().datetime().optional().nullable(),
  image_url:       z.string().url().optional().nullable(),
  location:        z.string().optional().nullable(),
  organization_id: z.string().uuid().optional().nullable(),
  is_fundraising:  z.boolean().default(false),
});

// GET /api/campaigns
campaigns.get('/', async (c) => {
  const limit  = Math.min(Number(c.req.query('limit') ?? 20), 50);
  const offset = Number(c.req.query('offset') ?? 0);
  const status = c.req.query('status') ?? 'active';

  const rows = await sql`
    SELECT c.*, pr.first_name, pr.last_name, pr.avatar_url
    FROM public.campaigns c
    JOIN public.profiles pr ON pr.id = c.creator_id
    WHERE c.status = ${status}
    ORDER BY c.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return c.json(rows);
});

// GET /api/campaigns/:id
campaigns.get('/:id', async (c) => {
  const id = c.req.param('id');
  const rows = await sql`
    SELECT c.*, pr.first_name, pr.last_name, pr.avatar_url
    FROM public.campaigns c
    JOIN public.profiles pr ON pr.id = c.creator_id
    WHERE c.id = ${id}::uuid
    LIMIT 1
  `;
  if (!rows.length) return c.json({ error: 'Campaign not found' }, 404);
  return c.json(rows[0]);
});

// POST /api/campaigns
campaigns.post('/', requireAuth, zValidator('json', createSchema), async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const body = c.req.valid('json');

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const creatorId = profile[0].id;

  const rows = await sql`
    INSERT INTO public.campaigns
      (creator_id, title, description, category, goal_amount, end_date,
       image_url, location, organization_id, is_fundraising, status)
    VALUES
      (${creatorId}::uuid, ${body.title}, ${body.description}, ${body.category ?? null},
       ${body.goal_amount ?? null}, ${body.end_date ?? null}, ${body.image_url ?? null},
       ${body.location ?? null}, ${body.organization_id ?? null}, ${body.is_fundraising}, 'active')
    RETURNING *
  `;
  return c.json(rows[0], 201);
});

// PATCH /api/campaigns/:id/status  — update status (creator only)
campaigns.patch('/:id/status', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const id = c.req.param('id');
  const { status } = await c.req.json<{ status: string }>();

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Unauthorized' }, 403);

  const result = await sql`
    UPDATE public.campaigns SET status = ${status}, updated_at = now()
    WHERE id = ${id}::uuid AND creator_id = ${profile[0].id}::uuid
    RETURNING id, status
  `;
  if (!result.length) return c.json({ error: 'Not found or unauthorized' }, 404);
  return c.json(result[0]);
});

export default campaigns;
