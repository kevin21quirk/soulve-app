// Platform feedback API.
//
// POST /api/feedback        — create feedback row (parent for
//                             feedback-screenshots uploads) + award XP
// GET  /api/feedback/mine   — caller's own feedback
// GET  /api/feedback        — admin list (platform admin only)
// PATCH /api/feedback/:id   — admin update status/priority/notes

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db';
import { requireAuth } from '../middleware/clerk';
import { resolveCaller } from '../lib/authz';

const router = new Hono();

router.use('*', requireAuth);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const FEEDBACK_TYPES = ['bug', 'feature_request', 'ui_issue', 'performance', 'general'] as const;
const FEEDBACK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
const FEEDBACK_STATUSES = ['new', 'in_review', 'in_progress', 'resolved', 'wont_fix'] as const;

// ── POST /api/feedback ────────────────────────────────────────────────────
const createSchema = z.object({
  feedback_type: z.enum(FEEDBACK_TYPES),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  page_url: z.string().max(1000).optional().nullable(),
  page_section: z.string().max(200).optional().nullable(),
  browser_info: z.record(z.unknown()).optional(),
  priority: z.enum(FEEDBACK_PRIORITIES).optional(),
});

router.post('/', zValidator('json', createSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const body = c.req.valid('json');
  const rows = await sql`
    INSERT INTO public.platform_feedback
      (user_id, feedback_type, title, description, page_url, page_section,
       screenshot_url, browser_info, priority, status)
    VALUES
      (${caller.profileId}::uuid, ${body.feedback_type}, ${body.title},
       ${body.description}, ${body.page_url ?? null}, ${body.page_section ?? null},
       NULL, ${JSON.stringify(body.browser_info ?? {})}::jsonb,
       ${body.priority ?? 'medium'}, 'new')
    RETURNING *
  `;

  // Award XP for feedback (best-effort — mirrors existing behaviour).
  try {
    await sql`
      INSERT INTO public.impact_activities
        (user_id, activity_type, points_earned, description, metadata, verified)
      VALUES
        (${caller.profileId}::uuid, 'platform_engagement', 10,
         'Provided platform feedback',
         ${JSON.stringify({ source: 'feedback_system', timestamp: new Date().toISOString() })}::jsonb,
         true)
    `;
  } catch (err) {
    console.error('Error awarding feedback points:', err);
  }

  return c.json(rows[0], 201);
});

// ── GET /api/feedback/mine ────────────────────────────────────────────────
router.get('/mine', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const status = c.req.query('status');
  const rows = status
    ? await sql`
        SELECT * FROM public.platform_feedback
        WHERE user_id = ${caller.profileId}::uuid AND status = ${status}
        ORDER BY created_at DESC
      `
    : await sql`
        SELECT * FROM public.platform_feedback
        WHERE user_id = ${caller.profileId}::uuid
        ORDER BY created_at DESC
      `;
  return c.json(rows);
});

// ── GET /api/feedback ─────────────────────────────────────────────────────
router.get('/', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);
  if (!caller.isPlatformAdmin) return c.json({ error: 'Forbidden' }, 403);

  const status = c.req.query('status');
  const type = c.req.query('feedback_type');

  let rows;
  if (status && type) {
    rows = await sql`
      SELECT * FROM public.platform_feedback
      WHERE status = ${status} AND feedback_type = ${type}
      ORDER BY created_at DESC
    `;
  } else if (status) {
    rows = await sql`
      SELECT * FROM public.platform_feedback
      WHERE status = ${status}
      ORDER BY created_at DESC
    `;
  } else if (type) {
    rows = await sql`
      SELECT * FROM public.platform_feedback
      WHERE feedback_type = ${type}
      ORDER BY created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT * FROM public.platform_feedback
      ORDER BY created_at DESC
    `;
  }
  return c.json(rows);
});

// ── PATCH /api/feedback/:id ───────────────────────────────────────────────
const updateSchema = z.object({
  status: z.enum(FEEDBACK_STATUSES).optional(),
  priority: z.enum(FEEDBACK_PRIORITIES).optional(),
  admin_notes: z.string().max(5000).optional().nullable(),
});

router.patch('/:id', zValidator('json', updateSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);
  if (!caller.isPlatformAdmin) return c.json({ error: 'Forbidden' }, 403);

  const id = c.req.param('id');
  if (!UUID_RE.test(id)) return c.json({ error: 'Invalid id' }, 400);
  const body = c.req.valid('json');

  const rows = await sql`
    UPDATE public.platform_feedback
    SET status = COALESCE(${body.status ?? null}, status),
        priority = COALESCE(${body.priority ?? null}, priority),
        admin_notes = COALESCE(${body.admin_notes ?? null}, admin_notes),
        resolved_at = CASE
          WHEN ${body.status ?? null} = 'resolved' THEN now()
          WHEN ${body.status ?? null} IS NOT NULL THEN NULL
          ELSE resolved_at
        END,
        updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING *
  `;
  if (!rows.length) return c.json({ error: 'Feedback not found' }, 404);
  return c.json(rows[0]);
});

export default router;
