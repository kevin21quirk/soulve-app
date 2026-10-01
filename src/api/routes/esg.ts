// ESG parent-record API.
//
// POST /api/esg/data-entries   — create organization_esg_data (parent for
//                                esg-documents uploads)
// POST /api/esg/contributions  — create/update a draft contribution or submit
//                                it (parent for esg-supporting-documents
//                                uploads)
//
// Contribution linkage: data_request_id FKs to esg_data_requests. Requests are
// currently created by a Supabase edge function, so a requestId may not exist
// in Neon — in that case the contribution is created with data_request_id=NULL
// and the request id is preserved in draft_data.request_id.

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/clerk.js';
import { resolveCaller, getOrgMembership, esgCanWrite } from '../lib/authz.js';

const router = new Hono();

router.use('*', requireAuth);

// ── POST /api/esg/data-entries ────────────────────────────────────────────
const entrySchema = z.object({
  organization_id: z.string().uuid(),
  indicator_id: z.string().uuid().optional().nullable(),
  reporting_period: z.string().min(4).max(10),
  value: z.number().optional().nullable(),
  text_value: z.string().max(10000).optional().nullable(),
  unit: z.string().max(50).optional().nullable(),
  data_source: z.string().max(100).optional().nullable(),
  verification_status: z.enum(['unverified', 'internal', 'third_party']).optional(),
  notes: z.string().max(5000).optional().nullable(),
});

router.post('/data-entries', zValidator('json', entrySchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const body = c.req.valid('json');

  // The org id comes from the client but is verified server-side: caller must
  // hold an ESG write role (or org admin) in that organisation.
  if (!caller.isPlatformAdmin && !esgCanWrite(await getOrgMembership(body.organization_id, caller.profileId))) {
    return c.json({ error: 'Insufficient ESG permissions in this organisation' }, 403);
  }

  const rows = await sql`
    INSERT INTO public.organization_esg_data
      (organization_id, indicator_id, reporting_period, value, text_value,
       unit, data_source, verification_status, notes, collected_by)
    VALUES
      (${body.organization_id}::uuid, ${body.indicator_id ?? null}::uuid,
       ${body.reporting_period}::date, ${body.value ?? null},
       ${body.text_value ?? null}, ${body.unit ?? null},
       ${body.data_source ?? 'manual_entry'},
       ${body.verification_status ?? 'unverified'},
       ${body.notes ?? null}, ${caller.profileId}::uuid)
    RETURNING *
  `;
  return c.json(rows[0], 201);
});

// ── GET /api/esg/contributions/draft/:requestId ───────────────────────────
// Caller-scoped draft lookup (replaces getDraftByRequestId).
router.get('/contributions/draft/:requestId', async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const requestId = c.req.param('requestId');
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) return c.json({ error: 'Invalid request id' }, 400);

  const rows = await sql`
    SELECT * FROM public.stakeholder_data_contributions
    WHERE contributor_user_id = ${caller.profileId}::uuid
      AND contribution_status = 'draft'
      AND (data_request_id = ${requestId}::uuid
           OR draft_data->>'request_id' = ${requestId})
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return c.json(rows[0] ?? null);
});

// ── POST /api/esg/contributions ───────────────────────────────────────────
// Two modes:
//   draft  (default): { dataRequestId?, contributorOrgId?, draftData }
//   submit:           { dataRequestId?, contributorOrgId?, submit: {...} }
// Both upsert the caller's draft contribution for the request and return it.

const contributionSchema = z.object({
  dataRequestId: z.string().uuid().optional().nullable(),
  contributorOrgId: z.string().uuid().optional().nullable(),
  draftData: z.record(z.unknown()).optional(),
  submit: z
    .object({
      value: z.unknown().optional(),
      unit: z.string().max(50).optional().nullable(),
      notes: z.string().max(5000).optional().nullable(),
      // Accepts documentId strings and {documentId, fileName} objects;
      // legacy URL strings remain valid for backward compatibility.
      supporting_documents: z.array(z.unknown()).optional(),
    })
    .optional(),
});

router.post('/contributions', zValidator('json', contributionSchema), async (c) => {
  const caller = await resolveCaller(c.get('clerkUserId'));
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const body = c.req.valid('json');

  // Resolve the data request when it exists in Neon. Requests created by the
  // Supabase edge function may not be present — degrade gracefully.
  let requestRow: { id: string; organization_id: string; requested_from_org_id: string | null; indicator_id: string | null } | null = null;
  if (body.dataRequestId) {
    const rows = await sql`
      SELECT id, organization_id, requested_from_org_id, indicator_id
      FROM public.esg_data_requests
      WHERE id = ${body.dataRequestId}::uuid LIMIT 1
    `;
    if (rows.length) requestRow = rows[0] as typeof requestRow;
  }

  // Contributing org: the org the request was sent to, else caller-supplied
  // org validated by membership, else caller's first active membership.
  let contributorOrgId =
    (requestRow?.requested_from_org_id as string | null) ?? body.contributorOrgId ?? null;

  const membership = contributorOrgId
    ? await getOrgMembership(contributorOrgId, caller.profileId)
    : null;

  if (!membership) {
    // Fall back to the caller's first active organisation.
    const own = await sql`
      SELECT organization_id FROM public.organization_members
      WHERE user_id = ${caller.profileId}::uuid AND is_active = true LIMIT 1
    `;
    if (own.length) contributorOrgId = String(own[0].organization_id);
  }

  if (!contributorOrgId) {
    return c.json({ error: 'Cannot resolve contributing organisation' }, 403);
  }

  const dataRequestId = requestRow ? requestRow.id : null;
  const draftData = {
    ...(body.draftData ?? {}),
    // Preserve the request linkage when the FK cannot be set.
    ...(body.dataRequestId && !requestRow ? { request_id: body.dataRequestId } : {}),
  };

  // Find an existing draft for (request, caller) — either by FK or by the
  // legacy request_id carried in draft_data.
  const existing = body.dataRequestId
    ? await sql`
        SELECT * FROM public.stakeholder_data_contributions
        WHERE contributor_user_id = ${caller.profileId}::uuid
          AND contribution_status = 'draft'
          AND (data_request_id = ${body.dataRequestId}::uuid
               OR draft_data->>'request_id' = ${body.dataRequestId})
        ORDER BY created_at DESC
        LIMIT 1
      `
    : await sql`
        SELECT * FROM public.stakeholder_data_contributions
        WHERE contributor_user_id = ${caller.profileId}::uuid
          AND contribution_status = 'draft'
          AND contributor_org_id = ${contributorOrgId}::uuid
        ORDER BY created_at DESC
        LIMIT 1
      `;

  if (body.submit) {
    // supporting_documents is server-managed: uploads append
    // {documentId, fileName} objects at commit time. Only legacy string
    // entries (e.g. an evidence URL) are merged from the submit payload —
    // never overwrite the array.
    const legacyUrls = (body.submit.supporting_documents ?? []).filter(
      (d) => typeof d === 'string',
    );
    const submitDraftJson = JSON.stringify(draftData);
    const legacyJson = JSON.stringify(legacyUrls);
    const mergeDocs = legacyUrls.length > 0;
    const valueNum = typeof body.submit.value === 'number' ? body.submit.value : null;
    const valueText = typeof body.submit.value === 'string' ? body.submit.value : null;

    if (existing.length) {
      const rows = await sql`
        UPDATE public.stakeholder_data_contributions
        SET contribution_status = 'submitted',
            verification_status = 'pending',
            submitted_at = now(),
            supporting_documents = CASE WHEN ${mergeDocs}
              THEN COALESCE(supporting_documents, '[]'::jsonb) || ${legacyJson}::jsonb
              ELSE supporting_documents END,
            contributor_org_id = ${contributorOrgId}::uuid,
            data_request_id = COALESCE(${dataRequestId}::uuid, data_request_id),
            draft_data = '{}'::jsonb
        WHERE id = ${existing[0].id}::uuid
        RETURNING *
      `;
      if (requestRow) {
        await sql`
          UPDATE public.esg_data_requests SET status = 'submitted', updated_at = now()
          WHERE id = ${requestRow.id}::uuid
        `;
      }
      return c.json(rows[0]);
    }

    // Mirror the existing submitContribution() behaviour: create an
    // organization_esg_data entry (against the requesting org when known,
    // else the contributor org), then the contribution referencing it.
    const esg = await sql`
      INSERT INTO public.organization_esg_data
        (organization_id, indicator_id, reporting_period, value, text_value,
         unit, data_source, verification_status, notes, collected_by)
      VALUES
        (${(requestRow?.organization_id as string | null) ?? contributorOrgId}::uuid,
         ${(requestRow?.indicator_id as string | null) ?? null}::uuid,
         ${new Date().toISOString().split('T')[0]}::date,
         ${valueNum}, ${valueText}, ${body.submit.unit ?? null},
         'stakeholder_contribution', 'unverified',
         ${body.submit.notes ?? null}, ${caller.profileId}::uuid)
      RETURNING id
    `;

    const rows = await sql`
      INSERT INTO public.stakeholder_data_contributions
        (data_request_id, esg_data_id, contributor_org_id, contributor_user_id,
         contribution_status, verification_status, submitted_at,
         supporting_documents, draft_data)
      VALUES
        (${dataRequestId}::uuid, ${esg[0].id}::uuid, ${contributorOrgId}::uuid,
         ${caller.profileId}::uuid, 'submitted', 'pending', now(),
         ${legacyJson}::jsonb, ${submitDraftJson}::jsonb)
      RETURNING *
    `;

    // Mirror SubmitDataDialog: mark the request as submitted when it exists.
    if (requestRow) {
      await sql`
        UPDATE public.esg_data_requests SET status = 'submitted', updated_at = now()
        WHERE id = ${requestRow.id}::uuid
      `;
    }
    return c.json(rows[0], 201);
  }

  // Draft mode — upsert.
  const draftJson = JSON.stringify(draftData);
  if (existing.length) {
    const rows = await sql`
      UPDATE public.stakeholder_data_contributions
      SET draft_data = ${draftJson}::jsonb,
          last_saved_at = now(),
          contributor_org_id = COALESCE(contributor_org_id, ${contributorOrgId}::uuid)
      WHERE id = ${existing[0].id}::uuid
      RETURNING *
    `;
    return c.json(rows[0]);
  }

  const rows = await sql`
    INSERT INTO public.stakeholder_data_contributions
      (data_request_id, contributor_org_id, contributor_user_id,
       contribution_status, verification_status, draft_data, last_saved_at)
    VALUES
      (${dataRequestId}::uuid, ${contributorOrgId}::uuid, ${caller.profileId}::uuid,
       'draft', 'pending', ${draftJson}::jsonb, now())
    RETURNING *
  `;
  return c.json(rows[0], 201);
});

export default router;
