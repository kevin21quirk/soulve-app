// Safe Space helper application + verification document API.
//
// Parent records for helper-verification-docs uploads:
//   safe_space_helper_applications (created by POST /) — the upload endpoint
//   validates the caller owns the application before accepting files.
//
// Admin review endpoints are platform-admin only (public.is_admin()).

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/clerk.js';
import { resolveCaller } from '../lib/authz.js';

const router = new Hono();

router.use('*', requireAuth);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── POST /api/helper-applications ─────────────────────────────────────────
router.post('/', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const rows = await sql`
    INSERT INTO public.safe_space_helper_applications (user_id, application_status)
    VALUES (${caller.profileId}::uuid, 'draft')
    RETURNING *
  `;
  return c.json(rows[0], 201);
});

// ── GET /api/helper-applications/me ───────────────────────────────────────
router.get('/me', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const rows = await sql`
    SELECT * FROM public.safe_space_helper_applications
    WHERE user_id = ${caller.profileId}::uuid
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return c.json(rows[0] ?? null);
});

// ── PATCH /api/helper-applications/:id ────────────────────────────────────
const updateSchema = z.object({
  personal_statement: z.string().max(2000).optional(),
  experience_description: z.string().max(2000).optional(),
  qualifications: z.array(z.unknown()).optional(),
  reference_contacts: z.array(z.unknown()).optional(),
  availability_commitment: z.string().max(500).optional(),
  preferred_specializations: z.array(z.string()).optional(),
  action: z.literal('submit').optional(),
});

router.patch('/:id', zValidator('json', updateSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const id = c.req.param('id');
  if (!UUID_RE.test(id)) return c.json({ error: 'Invalid id' }, 400);

  const existing = await sql`
    SELECT id, user_id, application_status
    FROM public.safe_space_helper_applications
    WHERE id = ${id}::uuid LIMIT 1
  `;
  if (!existing.length) return c.json({ error: 'Application not found' }, 404);
  if (String(existing[0].user_id) !== caller.profileId && !caller.isPlatformAdmin) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = c.req.valid('json');

  if (body.action === 'submit') {
    const rows = await sql`
      UPDATE public.safe_space_helper_applications
      SET application_status = 'submitted', submitted_at = now(), updated_at = now()
      WHERE id = ${id}::uuid
      RETURNING *
    `;
    return c.json(rows[0]);
  }

  const rows = await sql`
    UPDATE public.safe_space_helper_applications
    SET
      personal_statement       = COALESCE(${body.personal_statement ?? null}, personal_statement),
      experience_description   = COALESCE(${body.experience_description ?? null}, experience_description),
      qualifications           = COALESCE(${body.qualifications ? JSON.stringify(body.qualifications) : null}::jsonb, qualifications),
      reference_contacts       = COALESCE(${body.reference_contacts ? JSON.stringify(body.reference_contacts) : null}::jsonb, reference_contacts),
      availability_commitment  = COALESCE(${body.availability_commitment ?? null}, availability_commitment),
      preferred_specializations = COALESCE(${body.preferred_specializations ?? null}::text[], preferred_specializations),
      updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING *
  `;
  return c.json(rows[0]);
});

// ── GET /api/helper-applications/:id/documents ────────────────────────────
router.get('/:id/documents', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const id = c.req.param('id');
  if (!UUID_RE.test(id)) return c.json({ error: 'Invalid id' }, 400);

  const app = await sql`
    SELECT user_id FROM public.safe_space_helper_applications
    WHERE id = ${id}::uuid LIMIT 1
  `;
  if (!app.length) return c.json({ error: 'Application not found' }, 404);
  if (String(app[0].user_id) !== caller.profileId && !caller.isPlatformAdmin) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const docs = await sql`
    SELECT * FROM public.safe_space_verification_documents
    WHERE application_id = ${id}::uuid
    ORDER BY created_at DESC
  `;
  return c.json(docs);
});

// ── Admin: list verification documents by type ────────────────────────────
// GET /api/helper-applications/documents?type=dbs_certificate&status=pending
router.get('/documents', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);
  if (!caller.isPlatformAdmin) return c.json({ error: 'Forbidden' }, 403);

  const type = c.req.query('type');
  const status = c.req.query('status');

  const rows = type && status
    ? await sql`
        SELECT * FROM public.safe_space_verification_documents
        WHERE document_type = ${type} AND verification_status = ${status}
        ORDER BY created_at DESC
      `
    : type
      ? await sql`
          SELECT * FROM public.safe_space_verification_documents
          WHERE document_type = ${type}
          ORDER BY created_at DESC
        `
      : await sql`
          SELECT * FROM public.safe_space_verification_documents
          ORDER BY created_at DESC
          LIMIT 200
        `;
  return c.json(rows);
});

// ── Admin: verify / reject a verification document ────────────────────────
const reviewSchema = z.object({
  verification_status: z.enum(['verified', 'rejected']),
  rejection_reason: z.string().max(1000).optional(),
  dbs_certificate_number: z.string().max(50).optional(),
  dbs_issue_date: z.string().optional(),
  dbs_expiry_date: z.string().optional(),
  dbs_check_level: z.enum(['basic', 'standard', 'enhanced']).optional(),
});

router.patch('/documents/:id', zValidator('json', reviewSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);
  if (!caller.isPlatformAdmin) return c.json({ error: 'Forbidden' }, 403);

  const id = c.req.param('id');
  if (!UUID_RE.test(id)) return c.json({ error: 'Invalid id' }, 400);
  const body = c.req.valid('json');

  const rows = await sql`
    UPDATE public.safe_space_verification_documents
    SET
      verification_status     = ${body.verification_status},
      verified_by             = ${caller.profileId}::uuid,
      verified_at             = now(),
      rejection_reason        = ${body.rejection_reason ?? null},
      dbs_certificate_number  = COALESCE(${body.dbs_certificate_number ?? null}, dbs_certificate_number),
      dbs_issue_date          = COALESCE(${body.dbs_issue_date ?? null}::date, dbs_issue_date),
      dbs_expiry_date         = COALESCE(${body.dbs_expiry_date ?? null}::date, dbs_expiry_date),
      dbs_check_level         = COALESCE(${body.dbs_check_level ?? null}, dbs_check_level)
    WHERE id = ${id}::uuid
    RETURNING *
  `;
  if (!rows.length) return c.json({ error: 'Document not found' }, 404);
  const doc = rows[0];

  // Preserve existing HelperDBSReview side-effects.
  if (body.verification_status === 'verified' && doc.document_type === 'dbs_certificate') {
    await sql`
      UPDATE public.safe_space_helpers
      SET dbs_required = true
      WHERE user_id = ${doc.user_id}::uuid
    `;
  }
  await sql`
    INSERT INTO public.safe_space_audit_log
      (user_id, action_type, resource_type, resource_id, details)
    VALUES
      (${caller.profileId}::uuid,
       ${body.verification_status === 'verified' ? 'dbs_certificate_approved' : 'dbs_certificate_rejected'},
       'verification_document', ${id}::uuid,
       ${JSON.stringify({
         rejection_reason: body.rejection_reason ?? null,
         dbs_certificate_number: body.dbs_certificate_number ?? null,
         dbs_check_level: body.dbs_check_level ?? null,
         dbs_expiry_date: body.dbs_expiry_date ?? null,
       })}::jsonb)
  `;

  return c.json(doc);
});

export default router;
