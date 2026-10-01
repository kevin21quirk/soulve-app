// Private upload authorization + metadata commits.
//
// Sequence (driven by routes/upload.ts):
//   1. authorizePrivateUpload  — resolves the parent record in Neon and
//      checks the caller's rights BEFORE any Blob write.
//   2. put() to Vercel Blob (access: 'private')
//   3. commitPrivateUpload     — writes the Neon metadata row. On failure the
//      caller deletes the orphan blob; this module also restores previous DB
//      values for UPDATE-based parents where a second statement is involved.
//
// recordId is always a real parent record UUID — never an organization id.

import { sql } from '../db.js';
import { Caller, getOrgMembership, esgCanWrite } from './authz.js';

export class PrivateUploadError extends Error {
  constructor(
    public status: 400 | 403 | 404,
    message: string,
  ) {
    super(message);
  }
}

const ID_DOC_TYPES = new Set(['id_front', 'id_back', 'selfie']);
const HELPER_DOC_TYPES = new Set([
  'government_id',
  'selfie',
  'address_proof',
  'qualification_cert',
  'dbs_certificate',
]);

/** Everything commit() needs after authorize() succeeded. */
export interface PrivateParent {
  /** The parent record UUID (recordId). */
  id: string;
  /** Org resolved server-side from the parent (ESG types only). */
  organizationId?: string;
  /** Previous value of an UPDATE-target column (rollback safety). */
  previousRef?: string | null;
}

export async function authorizePrivateUpload(
  folder: string,
  caller: Caller,
  recordId: string | undefined,
  docType: string | undefined,
): Promise<PrivateParent> {
  if (!recordId) {
    throw new PrivateUploadError(400, `recordId is required for folder "${folder}"`);
  }

  switch (folder) {
    case 'feedback-screenshots': {
      const rows = await sql`
        SELECT id, user_id, screenshot_url FROM public.platform_feedback
        WHERE id = ${recordId}::uuid LIMIT 1
      `;
      if (!rows.length) throw new PrivateUploadError(404, 'Feedback record not found');
      if (String(rows[0].user_id) !== caller.profileId) {
        throw new PrivateUploadError(403, 'You do not own this feedback record');
      }
      return { id: recordId, previousRef: rows[0].screenshot_url as string | null };
    }

    case 'id-verifications': {
      if (!docType || !ID_DOC_TYPES.has(docType)) {
        throw new PrivateUploadError(400, `docType must be one of: ${[...ID_DOC_TYPES].join(', ')}`);
      }
      const rows = await sql`
        SELECT id, user_id, status FROM public.user_verifications
        WHERE id = ${recordId}::uuid LIMIT 1
      `;
      if (!rows.length) throw new PrivateUploadError(404, 'Verification record not found');
      const v = rows[0];
      if (String(v.user_id) !== caller.profileId) {
        throw new PrivateUploadError(403, 'You do not own this verification record');
      }
      if (v.status !== 'pending') {
        throw new PrivateUploadError(403, 'Documents can only be uploaded to a pending verification');
      }
      return { id: recordId };
    }

    case 'helper-verification-docs': {
      if (!docType || !HELPER_DOC_TYPES.has(docType)) {
        throw new PrivateUploadError(400, `docType must be one of: ${[...HELPER_DOC_TYPES].join(', ')}`);
      }
      const rows = await sql`
        SELECT id, user_id FROM public.safe_space_helper_applications
        WHERE id = ${recordId}::uuid LIMIT 1
      `;
      if (!rows.length) throw new PrivateUploadError(404, 'Helper application not found');
      if (String(rows[0].user_id) !== caller.profileId) {
        throw new PrivateUploadError(403, 'You do not own this application');
      }
      return { id: recordId };
    }

    case 'esg-documents': {
      const rows = await sql`
        SELECT id, organization_id FROM public.organization_esg_data
        WHERE id = ${recordId}::uuid LIMIT 1
      `;
      if (!rows.length) throw new PrivateUploadError(404, 'ESG data record not found');
      const orgId = rows[0].organization_id ? String(rows[0].organization_id) : null;
      if (!orgId) throw new PrivateUploadError(403, 'ESG record has no owning organisation');
      if (!caller.isPlatformAdmin && !esgCanWrite(await getOrgMembership(orgId, caller.profileId))) {
        throw new PrivateUploadError(403, 'Insufficient ESG permissions in this organisation');
      }
      return { id: recordId, organizationId: orgId };
    }

    case 'esg-supporting-documents': {
      const rows = await sql`
        SELECT id, contributor_org_id, contributor_user_id
        FROM public.stakeholder_data_contributions
        WHERE id = ${recordId}::uuid LIMIT 1
      `;
      if (!rows.length) throw new PrivateUploadError(404, 'Contribution record not found');
      const c0 = rows[0];
      let orgId = c0.contributor_org_id ? String(c0.contributor_org_id) : null;
      // Fall back to the caller's own active org when the contribution has none yet.
      if (!orgId) {
        const own = await sql`
          SELECT organization_id FROM public.organization_members
          WHERE user_id = ${caller.profileId}::uuid AND is_active = true LIMIT 1
        `;
        orgId = own.length ? String(own[0].organization_id) : null;
      }
      if (!orgId) throw new PrivateUploadError(403, 'Cannot resolve contributing organisation');
      const isContributor = String(c0.contributor_user_id ?? '') === caller.profileId;
      if (
        !caller.isPlatformAdmin &&
        !isContributor &&
        !esgCanWrite(await getOrgMembership(orgId, caller.profileId))
      ) {
        throw new PrivateUploadError(403, 'Insufficient ESG permissions in this organisation');
      }
      return { id: recordId, organizationId: orgId };
    }

    case 'esg-reports': {
      const fmt = docType === 'html' ? 'html' : 'pdf';
      const rows = await sql`
        SELECT id, organization_id, created_by, pdf_url, html_url
        FROM public.esg_reports WHERE id = ${recordId}::uuid LIMIT 1
      `;
      if (!rows.length) throw new PrivateUploadError(404, 'ESG report not found');
      const r = rows[0];
      const orgId = String(r.organization_id);
      const allowed =
        caller.isPlatformAdmin ||
        String(r.created_by ?? '') === caller.profileId ||
        esgCanWrite(await getOrgMembership(orgId, caller.profileId));
      if (!allowed) throw new PrivateUploadError(403, 'Insufficient ESG permissions in this organisation');
      return {
        id: recordId,
        organizationId: orgId,
        previousRef: (fmt === 'html' ? r.html_url : r.pdf_url) as string | null,
      };
    }

    default:
      throw new PrivateUploadError(400, `Unknown private folder "${folder}"`);
  }
}

export interface UploadExtras {
  faceDetected?: boolean;
  faceQualityScore?: number | null;
}

export async function commitPrivateUpload(
  folder: string,
  caller: Caller,
  parent: PrivateParent,
  blobUrl: string,
  blobPathname: string,
  file: { name: string; size: number; type: string },
  docType: string | undefined,
  extras?: UploadExtras,
): Promise<string> {
  switch (folder) {
    case 'feedback-screenshots': {
      await sql`
        UPDATE public.platform_feedback
        SET screenshot_url = ${blobUrl}, updated_at = now()
        WHERE id = ${parent.id}::uuid
      `;
      return parent.id;
    }

    case 'id-verifications': {
      const rows = await sql`
        INSERT INTO public.verification_documents
          (verification_id, user_id, document_type, file_path, file_name,
           file_size, mime_type, face_detected, face_quality_score)
        VALUES
          (${parent.id}::uuid, ${caller.profileId}::uuid, ${docType},
           ${blobUrl}, ${file.name}, ${file.size}, ${file.type},
           ${extras?.faceDetected ?? false}, ${extras?.faceQualityScore ?? null})
        RETURNING id
      `;
      return String(rows[0].id);
    }

    case 'helper-verification-docs': {
      const rows = await sql`
        INSERT INTO public.safe_space_verification_documents
          (user_id, application_id, document_type, file_path, file_name, file_size, mime_type, verification_status)
        VALUES
          (${caller.profileId}::uuid, ${parent.id}::uuid, ${docType},
           ${blobUrl}, ${file.name}, ${file.size}, ${file.type}, 'pending')
        RETURNING id
      `;
      return String(rows[0].id);
    }

    case 'esg-documents': {
      const rows = await sql`
        INSERT INTO public.private_documents
          (user_id, clerk_user_id, organization_id, document_type,
           owner_table, owner_id, blob_url, blob_pathname, file_name, file_size, mime_type)
        VALUES
          (${caller.profileId}::uuid, ${caller.clerkUserId}, ${parent.organizationId}::uuid,
           'esg_document', 'organization_esg_data', ${parent.id}::uuid,
           ${blobUrl}, ${blobPathname}, ${file.name}, ${file.size}, ${file.type})
        RETURNING id
      `;
      const documentId = String(rows[0].id);
      try {
        await sql`
          UPDATE public.organization_esg_data
          SET supporting_documents = supporting_documents || to_jsonb(${documentId}::text),
              updated_at = now()
          WHERE id = ${parent.id}::uuid
        `;
      } catch (err) {
        // Restore consistency: remove the orphaned registry row before the
        // caller deletes the blob.
        await sql`DELETE FROM public.private_documents WHERE id = ${documentId}::uuid`;
        throw err;
      }
      return documentId;
    }

    case 'esg-supporting-documents': {
      const rows = await sql`
        INSERT INTO public.private_documents
          (user_id, clerk_user_id, organization_id, document_type,
           owner_table, owner_id, blob_url, blob_pathname, file_name, file_size, mime_type)
        VALUES
          (${caller.profileId}::uuid, ${caller.clerkUserId}, ${parent.organizationId}::uuid,
           'esg_supporting_document', 'stakeholder_data_contributions', ${parent.id}::uuid,
           ${blobUrl}, ${blobPathname}, ${file.name}, ${file.size}, ${file.type})
        RETURNING id
      `;
      const documentId = String(rows[0].id);
      try {
        // Contribution jsonb holds {documentId, fileName} objects; the
        // private_documents row remains the authoritative registry.
        await sql`
          UPDATE public.stakeholder_data_contributions
          SET supporting_documents = COALESCE(supporting_documents, '[]'::jsonb)
                  || jsonb_build_object('documentId', ${documentId}::text,
                                        'fileName', ${file.name}::text),
              updated_at = now()
          WHERE id = ${parent.id}::uuid
        `;
      } catch (err) {
        await sql`DELETE FROM public.private_documents WHERE id = ${documentId}::uuid`;
        throw err;
      }
      return documentId;
    }

    case 'esg-reports': {
      const fmt = docType === 'html' ? 'html' : 'pdf';
      if (fmt === 'html') {
        await sql`
          UPDATE public.esg_reports SET html_url = ${blobUrl}, updated_at = now()
          WHERE id = ${parent.id}::uuid
        `;
      } else {
        await sql`
          UPDATE public.esg_reports SET pdf_url = ${blobUrl}, updated_at = now()
          WHERE id = ${parent.id}::uuid
        `;
      }
      return parent.id;
    }

    default:
      throw new PrivateUploadError(400, `Unknown private folder "${folder}"`);
  }
}
