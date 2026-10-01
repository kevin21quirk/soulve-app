// ID verification API.
//
// POST   /api/verifications        — create user_verifications (parent record
//                                    for id-verifications uploads)
// GET    /api/verifications        — admin list (platform admin only); returns
//                                    verifications with documents + profile
// PATCH  /api/verifications/:id    — admin approve/reject
//
// Document file access is via /api/documents/download — file_path/blob URLs
// are never included in list responses.

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/clerk.js';
import { resolveCaller } from '../lib/authz.js';

const router = new Hono();

router.use('*', requireAuth);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── POST /api/verifications ───────────────────────────────────────────────
const createSchema = z.object({
  verification_type: z.literal('government_id'),
  verification_data: z.record(z.unknown()).optional(),
  face_match_score: z.number().min(0).max(1).optional().nullable(),
  liveness_check_passed: z.boolean().optional(),
  face_embedding: z.unknown().optional().nullable(),
});

router.post('/', zValidator('json', createSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const body = c.req.valid('json');
  const rows = await sql`
    INSERT INTO public.user_verifications
      (user_id, verification_type, verification_data,
       face_match_score, liveness_check_passed, face_embedding, status)
    VALUES
      (${caller.profileId}::uuid, ${body.verification_type},
       ${JSON.stringify(body.verification_data ?? {})}::jsonb,
       ${body.face_match_score ?? null},
       ${body.liveness_check_passed ?? false},
       ${body.face_embedding ? JSON.stringify(body.face_embedding) : null}::jsonb,
       'pending')
    RETURNING *
  `;
  return c.json(rows[0], 201);
});

// ── GET /api/verifications/me ─────────────────────────────────────────────
// Caller's own verifications + trust score + recent history.
router.get('/me', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const verifications = await sql`
    SELECT * FROM public.user_verifications
    WHERE user_id = ${caller.profileId}::uuid
    ORDER BY created_at DESC
  `;

  const scoreRows = await sql`
    SELECT public.calculate_trust_score(${caller.profileId}::uuid) AS score
  `;

  const trustHistory = await sql`
    SELECT * FROM public.trust_score_history
    WHERE user_id = ${caller.profileId}::uuid
    ORDER BY created_at DESC
    LIMIT 10
  `;

  return c.json({
    verifications,
    trustScore: (scoreRows[0]?.score as number | null) ?? 0,
    trustHistory,
  });
});

// ── POST /api/verifications/me ────────────────────────────────────────────
// Self-service verification request. 'email' auto-approves — Clerk has
// already verified the address.
const requestSchema = z.object({
  verification_type: z.enum([
    'email', 'phone', 'government_id', 'organization',
    'community_leader', 'expert', 'background_check',
  ]),
  verification_data: z.record(z.unknown()).optional(),
});

router.post('/me', zValidator('json', requestSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const body = c.req.valid('json');

  if (body.verification_type === 'email') {
    const profiles = await sql`
      SELECT email FROM public.profiles WHERE id = ${caller.profileId}::uuid LIMIT 1
    `;
    const rows = await sql`
      INSERT INTO public.user_verifications
        (user_id, verification_type, status, verified_at, verification_data)
      VALUES
        (${caller.profileId}::uuid, 'email', 'approved', now(),
         ${JSON.stringify({ email: profiles[0]?.email ?? null, auto_verified: true })}::jsonb)
      RETURNING *
    `;
    return c.json(rows[0], 201);
  }

  const rows = await sql`
    INSERT INTO public.user_verifications
      (user_id, verification_type, verification_data, status)
    VALUES
      (${caller.profileId}::uuid, ${body.verification_type},
       ${JSON.stringify(body.verification_data ?? {})}::jsonb, 'pending')
    RETURNING *
  `;
  return c.json(rows[0], 201);
});

// ── GET /api/verifications ────────────────────────────────────────────────
router.get('/', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);
  if (!caller.isPlatformAdmin) return c.json({ error: 'Forbidden' }, 403);

  const verificationType = c.req.query('verification_type') ?? 'government_id';
  const status = c.req.query('status');

  const verifications = status
    ? await sql`
        SELECT * FROM public.user_verifications
        WHERE verification_type = ${verificationType} AND status = ${status}
        ORDER BY created_at DESC
      `
    : await sql`
        SELECT * FROM public.user_verifications
        WHERE verification_type = ${verificationType}
        ORDER BY created_at DESC
      `;

  // Documents without file_path — downloads go through
  // /api/documents/download which resolves the stored ref server-side.
  const result = await Promise.all(
    verifications.map(async (v) => {
      const docs = await sql`
        SELECT id, document_type, file_name, file_size, mime_type, uploaded_at,
               face_detected, face_quality_score
        FROM public.verification_documents
        WHERE verification_id = ${v.id}::uuid
        ORDER BY uploaded_at ASC
      `;
      const profiles = await sql`
        SELECT first_name, last_name, email FROM public.profiles
        WHERE id = ${v.user_id}::uuid LIMIT 1
      `;
      const p = profiles[0];
      return {
        ...v,
        user_email: (p?.email as string) ?? 'No email',
        user_name:
          `${(p?.first_name as string) ?? ''} ${(p?.last_name as string) ?? ''}`.trim() ||
          'Unknown User',
        documents: docs,
      };
    }),
  );

  return c.json(result);
});

// ── PATCH /api/verifications/:id ──────────────────────────────────────────
const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  notes: z.string().max(2000).optional(),
});

router.patch('/:id', zValidator('json', reviewSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);
  if (!caller.isPlatformAdmin) return c.json({ error: 'Forbidden' }, 403);

  const id = c.req.param('id');
  if (!UUID_RE.test(id)) return c.json({ error: 'Invalid id' }, 400);
  const body = c.req.valid('json');

  const rows = await sql`
    UPDATE public.user_verifications
    SET status = ${body.status},
        notes = ${body.notes ?? null},
        verified_at = now(),
        verified_by = ${caller.profileId}::uuid,
        updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING *
  `;
  if (!rows.length) return c.json({ error: 'Verification not found' }, 404);
  return c.json(rows[0]);
});

export default router;
