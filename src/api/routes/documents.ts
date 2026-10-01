// Private document access routes.
//
// GET    /api/documents/download?id=<uuid>&type=<type>[&field=pdf|html]
// DELETE /api/documents/:type/:id
//
// Flow (download):
//   1. Clerk auth -> resolve to Neon profile UUID
//   2. Load document + parent metadata from Neon (never trust client refs)
//   3. canReadPrivateDocument authorization
//   4. If stored ref is a validated Vercel Blob URL -> issueSignedToken +
//      presignUrl -> short-lived { presignedUrl }
//      If it is a legacy Supabase path -> { legacy: true, path } so the client
//      falls back to the existing Supabase signed-URL flow (Phase 2C migrates
//      the underlying files; until then legacy docs stay accessible).
//
// Presigned URLs are never logged. Download events for verification documents
// are recorded in the existing verification_document_audit table.

import { Hono } from 'hono';
import { issueSignedToken, presignUrl, del } from '@vercel/blob';
import { requireAuth } from '../middleware/clerk.js';
import { sql } from '../db.js';
import { parseBlobPathname } from '../lib/blobUrl.js';
import {
  resolveCaller,
  resolveDocument,
  canReadPrivateDocument,
  canDeletePrivateDocument,
  DOC_TYPES,
  DocType,
} from '../lib/authz.js';

const documents = new Hono();

// Lifetime of presigned download URLs handed to the browser.
const PRIVATE_DOCUMENT_URL_TTL_MS = 5 * 60 * 1000; // 5 minutes

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function requestMeta(c: { req: { header: (name: string) => string | undefined } }) {
  const fwd = c.req.header('x-forwarded-for');
  return {
    ip: fwd ? fwd.split(',')[0].trim() : null,
    userAgent: c.req.header('user-agent') ?? null,
  };
}

/** Record a view/download audit event for verification_documents-backed docs. */
async function auditDocumentAccess(
  documentId: string,
  accessedBy: string,
  action: 'view' | 'download',
  ip: string | null,
  userAgent: string | null,
) {
  try {
    await sql`
      INSERT INTO public.verification_document_audit
        (document_id, accessed_by, action_type, ip_address, user_agent)
      VALUES
        (${documentId}::uuid, ${accessedBy}::uuid, ${action},
         ${ip}::inet, ${userAgent})
    `;
  } catch (err) {
    // Audit failures must not block document access.
    console.error('verification_document_audit insert failed:', err);
  }
}

// ── GET /api/documents/download ───────────────────────────────────────────
documents.get('/download', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const id = c.req.query('id');
  const type = c.req.query('type') as DocType | undefined;
  const field = c.req.query('field'); // esg-report only: 'pdf' | 'html'

  if (!id || !UUID_RE.test(id)) return c.json({ error: 'Valid "id" is required' }, 400);
  if (!type || !DOC_TYPES.has(type)) return c.json({ error: 'Valid "type" is required' }, 400);

  const caller = await resolveCaller(clerkUserId);
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const doc = await resolveDocument(type, id, field);
  if (!doc) return c.json({ error: 'Document not found' }, 404);

  if (!(await canReadPrivateDocument(caller, type, doc))) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  if (!doc.storedRef) {
    return c.json({ error: 'Document has no stored file' }, 404);
  }

  const pathname = parseBlobPathname(doc.storedRef);

  // Legacy Supabase reference — client uses the existing signed-URL flow.
  if (!pathname) {
    return c.json({ legacy: true, path: doc.storedRef });
  }

  const validUntil = Date.now() + PRIVATE_DOCUMENT_URL_TTL_MS;
  const token = await issueSignedToken({
    pathname,
    operations: ['get'],
    validUntil,
  });
  const { presignedUrl } = await presignUrl(
    {
      clientSigningToken: token.clientSigningToken,
      delegationToken: token.delegationToken,
    },
    { operation: 'get', pathname, validUntil, access: 'private' },
  );

  const meta = requestMeta(c);
  if (type === 'id-doc') {
    // verification_document_audit.document_id FKs to verification_documents —
    // only id-doc rows can be recorded here.
    await auditDocumentAccess(doc.id, caller.profileId, 'view', meta.ip, meta.userAgent);
  }
  if (type === 'esg-report') {
    await sql`
      UPDATE public.esg_reports
      SET download_count = download_count + 1
      WHERE id = ${doc.id}::uuid
    `;
  }

  return c.json({ presignedUrl });
});

// ── DELETE /api/documents/:type/:id ───────────────────────────────────────
documents.delete('/:type/:id', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const type = c.req.param('type') as DocType;
  const id = c.req.param('id');

  if (!DOC_TYPES.has(type)) return c.json({ error: 'Valid "type" is required' }, 400);
  if (!UUID_RE.test(id)) return c.json({ error: 'Valid "id" is required' }, 400);

  const caller = await resolveCaller(clerkUserId);
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const doc = await resolveDocument(type, id);
  if (!doc) return c.json({ error: 'Document not found' }, 404);

  if (!(await canDeletePrivateDocument(caller, type, doc))) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  // Delete the blob only when the stored ref is a Vercel Blob URL. Legacy
  // Supabase files are left in place until Phase 2C migrates/cleans them.
  const pathname = parseBlobPathname(doc.storedRef);
  if (pathname) {
    await del(doc.storedRef as string);
  }

  switch (type) {
    case 'helper-doc':
      await sql`DELETE FROM public.safe_space_verification_documents WHERE id = ${id}::uuid`;
      break;
    case 'id-doc':
      await sql`DELETE FROM public.verification_documents WHERE id = ${id}::uuid`;
      break;
    case 'feedback':
      await sql`
        UPDATE public.platform_feedback
        SET screenshot_url = NULL, updated_at = now()
        WHERE id = ${id}::uuid
      `;
      break;
    case 'esg-doc':
      // Soft-delete — preserves the audit trail.
      await sql`
        UPDATE public.private_documents
        SET status = 'deleted', updated_at = now()
        WHERE id = ${id}::uuid
      `;
      break;
    case 'esg-report': {
      const col = doc.refField === 'html_url' ? 'html_url' : 'pdf_url';
      if (col === 'html_url') {
        await sql`
          UPDATE public.esg_reports SET html_url = NULL, updated_at = now()
          WHERE id = ${id}::uuid
        `;
      } else {
        await sql`
          UPDATE public.esg_reports SET pdf_url = NULL, updated_at = now()
          WHERE id = ${id}::uuid
        `;
      }
      break;
    }
  }

  return c.json({ deleted: true });
});

export default documents;
