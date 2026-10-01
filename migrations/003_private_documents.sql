-- Migration 003: Private document registry (ESG only) + organization_esg_data.supporting_documents
--
-- Phase 2A Batch 3: Vercel Blob private document migration.
--
-- 1. Creates public.private_documents — the authoritative Neon registry for
--    ESG private documents stored in Vercel Blob. This table is ESG-only by
--    design; other document types keep their existing dedicated metadata
--    tables (verification_documents, safe_space_verification_documents,
--    platform_feedback, esg_reports).
--
-- 2. Adds organization_esg_data.supporting_documents — fixes an existing bug
--    where ESGDataInputForm collected document URLs but the insert silently
--    discarded them (no column existed). New writes store private_documents.id
--    values; legacy URL strings remain temporarily supported by readers.
--
-- Idempotent: safe to run repeatedly (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- / DO blocks for constraints).

BEGIN;

-- ── private_documents ────────────────────────────────────────────────────
-- Authoritative registry for ESG private documents.
-- Parent relationships (enforced by CHECK):
--   esg_document              -> organization_esg_data.id
--   esg_supporting_document   -> stakeholder_data_contributions.id
CREATE TABLE IF NOT EXISTS public.private_documents (
    id               uuid                     DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id          uuid                     NOT NULL,          -- uploader: profiles.id (Neon UUID)
    clerk_user_id    text                     NOT NULL,          -- uploader Clerk ID (audit trail)
    organization_id  uuid                     NOT NULL,          -- resolved server-side, never client-trusted
    document_type    text                     NOT NULL,
    owner_table      text                     NOT NULL,
    owner_id         uuid                     NOT NULL,
    blob_url         text                     NOT NULL,
    blob_pathname    text                     NOT NULL,
    file_name        text                     NOT NULL,
    file_size        integer                  NOT NULL,
    mime_type        text                     NOT NULL,
    status           text                     DEFAULT 'active'::text NOT NULL,
    created_at       timestamp with time zone DEFAULT now() NOT NULL,
    updated_at       timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT private_documents_document_type_check
        CHECK (document_type = ANY (ARRAY['esg_document'::text, 'esg_supporting_document'::text])),
    CONSTRAINT private_documents_owner_table_check
        CHECK (owner_table = ANY (ARRAY['organization_esg_data'::text, 'stakeholder_data_contributions'::text])),
    CONSTRAINT private_documents_status_check
        CHECK (status = ANY (ARRAY['active'::text, 'deleted'::text]))
);

CREATE INDEX IF NOT EXISTS private_documents_owner_idx
    ON public.private_documents (owner_table, owner_id);

CREATE INDEX IF NOT EXISTS private_documents_org_idx
    ON public.private_documents (organization_id);

CREATE INDEX IF NOT EXISTS private_documents_user_idx
    ON public.private_documents (user_id);

-- Foreign keys for parent records — added conditionally so re-runs are safe.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'private_documents_user_id_fkey'
    ) THEN
        ALTER TABLE public.private_documents
            ADD CONSTRAINT private_documents_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES public.profiles(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'private_documents_organization_id_fkey'
    ) THEN
        ALTER TABLE public.private_documents
            ADD CONSTRAINT private_documents_organization_id_fkey
            FOREIGN KEY (organization_id) REFERENCES public.organizations(id);
    END IF;
END $$;

-- ── organization_esg_data.supporting_documents ───────────────────────────
-- Fixes existing silent-drop bug: ESGDataInputForm passed documentUrls into
-- useCreateESGData but the column did not exist, so uploads were discarded.
-- New writes store private_documents.id values (documentId strings).
ALTER TABLE public.organization_esg_data
    ADD COLUMN IF NOT EXISTS supporting_documents jsonb DEFAULT '[]'::jsonb;

COMMIT;
