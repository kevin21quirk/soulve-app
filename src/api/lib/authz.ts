// Shared authorization helpers for private document access.
//
// Authorization model (server-side only — client-supplied IDs are never
// trusted without a Neon lookup):
//   - Caller resolution: Clerk user id -> profiles.id (Neon UUID)
//   - Platform admin:    existing public.is_admin(uuid) DB function
//                        (admin_roles.role IN ('admin','super_admin'))
//   - Org access:        organization_members row (is_active = true)
//                        READ:  role='admin' OR esg_role IS NOT NULL
//                        WRITE: role='admin' OR esg_role IN ('esg_admin','esg_contributor')
//                        DELETE report: role='admin' OR esg_role IN ('esg_admin','esg_approver')

import { sql } from '../db.js';

export interface Caller {
  clerkUserId: string;
  profileId: string; // Neon profiles.id
  email: string | null;
  isPlatformAdmin: boolean;
}

/** Resolve a Clerk user id to the Neon profile + platform admin flag. */
export async function resolveCaller(clerkUserId: string): Promise<Caller | null> {
  const profiles = await sql`
    SELECT id, email FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1
  `;
  if (!profiles.length) return null;
  const profileId = String(profiles[0].id);
  const adminRows = await sql`SELECT public.is_admin(${profileId}::uuid) AS ok`;
  return {
    clerkUserId,
    profileId,
    email: (profiles[0].email as string | null) ?? null,
    isPlatformAdmin: adminRows[0]?.ok === true,
  };
}

export interface OrgMembership {
  role: string;
  esgRole: string | null;
}

/** Active organization_members row for (org, user), or null. */
export async function getOrgMembership(
  orgId: string,
  profileId: string,
): Promise<OrgMembership | null> {
  const rows = await sql`
    SELECT role, esg_role AS "esgRole"
    FROM public.organization_members
    WHERE organization_id = ${orgId}::uuid
      AND user_id = ${profileId}::uuid
      AND is_active = true
    LIMIT 1
  `;
  return (rows[0] as OrgMembership | undefined) ?? null;
}

export const esgCanRead = (m: OrgMembership | null): boolean =>
  m !== null && (m.role === 'admin' || m.esgRole !== null);

export const esgCanWrite = (m: OrgMembership | null): boolean =>
  m !== null &&
  (m.role === 'admin' || m.esgRole === 'esg_admin' || m.esgRole === 'esg_contributor');

export const esgCanDeleteReport = (m: OrgMembership | null): boolean =>
  m !== null &&
  (m.role === 'admin' || m.esgRole === 'esg_admin' || m.esgRole === 'esg_approver');

// ── Private document resolution ─────────────────────────────────────────

export type DocType = 'helper-doc' | 'id-doc' | 'feedback' | 'esg-doc' | 'esg-report';

export const DOC_TYPES: ReadonlySet<string> = new Set([
  'helper-doc',
  'id-doc',
  'feedback',
  'esg-doc',
  'esg-report',
]);

export interface ResolvedDoc {
  id: string;
  /** profiles.id of the owning uploader/user, when the type has one. */
  ownerUserId: string | null;
  /** Owning organisation (ESG/report docs). */
  orgId: string | null;
  /** Stored reference: Blob URL or legacy Supabase path. */
  storedRef: string | null;
  /** doc's own status where relevant (helper docs, private_documents). */
  status: string | null;
  /** Parent record status where relevant (user_verifications.status). */
  parentStatus: string | null;
  /** For esg_supporting_document: the org that issued the data request. */
  requestingOrgId: string | null;
  /** esg_reports.created_by */
  createdBy: string | null;
  /** Which metadata column stores the ref (used for delete bookkeeping). */
  refField: string;
}

/**
 * Load a private document by type+id. `field` only applies to esg-report
 * ('pdf' | 'html', default 'pdf'). Returns null when not found.
 */
export async function resolveDocument(
  type: DocType,
  id: string,
  field?: string,
): Promise<ResolvedDoc | null> {
  switch (type) {
    case 'helper-doc': {
      const rows = await sql`
        SELECT id, user_id, file_path, verification_status
        FROM public.safe_space_verification_documents
        WHERE id = ${id}::uuid LIMIT 1
      `;
      if (!rows.length) return null;
      const r = rows[0];
      return {
        id: String(r.id), ownerUserId: String(r.user_id), orgId: null,
        storedRef: r.file_path as string, status: r.verification_status as string,
        parentStatus: null, requestingOrgId: null, createdBy: null,
        refField: 'file_path',
      };
    }
    case 'id-doc': {
      const rows = await sql`
        SELECT d.id, d.user_id, d.file_path, v.status AS parent_status
        FROM public.verification_documents d
        JOIN public.user_verifications v ON v.id = d.verification_id
        WHERE d.id = ${id}::uuid LIMIT 1
      `;
      if (!rows.length) return null;
      const r = rows[0];
      return {
        id: String(r.id), ownerUserId: String(r.user_id), orgId: null,
        storedRef: r.file_path as string, status: null,
        parentStatus: r.parent_status as string,
        requestingOrgId: null, createdBy: null, refField: 'file_path',
      };
    }
    case 'feedback': {
      const rows = await sql`
        SELECT id, user_id, screenshot_url
        FROM public.platform_feedback
        WHERE id = ${id}::uuid LIMIT 1
      `;
      if (!rows.length) return null;
      const r = rows[0];
      return {
        id: String(r.id), ownerUserId: String(r.user_id), orgId: null,
        storedRef: r.screenshot_url as string | null, status: null,
        parentStatus: null, requestingOrgId: null, createdBy: null,
        refField: 'screenshot_url',
      };
    }
    case 'esg-doc': {
      const rows = await sql`
        SELECT d.id, d.user_id, d.organization_id, d.blob_url, d.status,
               d.document_type, d.owner_table, d.owner_id,
               c.data_request_id,
               req.organization_id AS requesting_org_id
        FROM public.private_documents d
        LEFT JOIN public.stakeholder_data_contributions c
          ON d.owner_table = 'stakeholder_data_contributions' AND d.owner_id = c.id
        LEFT JOIN public.esg_data_requests req ON c.data_request_id = req.id
        WHERE d.id = ${id}::uuid LIMIT 1
      `;
      if (!rows.length) return null;
      const r = rows[0];
      return {
        id: String(r.id), ownerUserId: String(r.user_id),
        orgId: r.organization_id ? String(r.organization_id) : null,
        storedRef: r.blob_url as string, status: r.status as string,
        parentStatus: null,
        requestingOrgId: r.requesting_org_id ? String(r.requesting_org_id) : null,
        createdBy: null, refField: 'blob_url',
      };
    }
    case 'esg-report': {
      const refField = field === 'html' ? 'html_url' : 'pdf_url';
      const rows = await sql`
        SELECT id, organization_id, pdf_url, html_url, created_by
        FROM public.esg_reports
        WHERE id = ${id}::uuid LIMIT 1
      `;
      if (!rows.length) return null;
      const r = rows[0];
      return {
        id: String(r.id), ownerUserId: null,
        orgId: r.organization_id ? String(r.organization_id) : null,
        storedRef: (field === 'html' ? r.html_url : r.pdf_url) as string | null,
        status: null, parentStatus: null, requestingOrgId: null,
        createdBy: r.created_by ? String(r.created_by) : null,
        refField,
      };
    }
  }
}

/** READ authorization — caller may view/download the document. */
export async function canReadPrivateDocument(
  caller: Caller,
  type: DocType,
  doc: ResolvedDoc,
): Promise<boolean> {
  if (caller.isPlatformAdmin) return true;
  if (doc.status === 'deleted') return false;

  switch (type) {
    case 'helper-doc':
    case 'id-doc':
    case 'feedback':
      return doc.ownerUserId === caller.profileId;
    case 'esg-report': {
      if (doc.createdBy === caller.profileId) return true;
      if (!doc.orgId) return false;
      return esgCanRead(await getOrgMembership(doc.orgId, caller.profileId));
    }
    case 'esg-doc': {
      if (doc.ownerUserId === caller.profileId) return true;
      if (doc.orgId && esgCanRead(await getOrgMembership(doc.orgId, caller.profileId))) {
        return true;
      }
      // Contributing org's document may be reviewed by the requesting org's
      // ESG members (when the request row is resolvable in Neon).
      if (doc.requestingOrgId) {
        return esgCanRead(await getOrgMembership(doc.requestingOrgId, caller.profileId));
      }
      return false;
    }
  }
}

/** DELETE authorization — stricter than READ. */
export async function canDeletePrivateDocument(
  caller: Caller,
  type: DocType,
  doc: ResolvedDoc,
): Promise<boolean> {
  if (caller.isPlatformAdmin) return true;
  if (doc.status === 'deleted') return false;

  switch (type) {
    case 'helper-doc':
      return doc.ownerUserId === caller.profileId && doc.status === 'pending';
    case 'id-doc':
      return doc.ownerUserId === caller.profileId && doc.parentStatus === 'pending';
    case 'feedback':
      return doc.ownerUserId === caller.profileId;
    case 'esg-report': {
      if (doc.createdBy === caller.profileId) return true;
      if (!doc.orgId) return false;
      return esgCanDeleteReport(await getOrgMembership(doc.orgId, caller.profileId));
    }
    case 'esg-doc': {
      if (doc.ownerUserId === caller.profileId) return true;
      if (!doc.orgId) return false;
      return esgCanWrite(await getOrgMembership(doc.orgId, caller.profileId));
    }
  }
}
