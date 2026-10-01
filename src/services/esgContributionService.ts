import type { ApiClient } from '@/lib/apiClient';

// Contribution draft helpers — backed by POST /api/esg/contributions.
// The server resolves the esg_data_requests → stakeholder_data_contributions
// relationship; when a request row is not yet present in Neon the request id
// is preserved in draft_data.request_id and data_request_id stays NULL.

export interface ContributionDraft {
  request_id: string;
  indicator_id: string;
  value?: any;
  date_value?: Date;
  bool_value?: boolean;
  unit?: string;
  notes?: string;
  supporting_documents?: unknown[];
  draft_data?: any;
  contributor_user_id?: string;
}

export interface SubmitContributionData {
  data_request_id: string;
  contributor_user_id?: string;
  contributor_org_id?: string;
  value?: any;
  date_value?: Date;
  bool_value?: boolean;
  unit?: string;
  notes?: string;
  supporting_documents?: unknown[];
}

// Create or update the caller's draft for a request (server-side upsert).
// Returns the contribution row — its `id` is the parent for
// esg-supporting-documents uploads (requestId is NOT the parent id).
export const createDraft = async (
  api: ApiClient,
  requestId: string,
  draftData: ContributionDraft,
  contributorOrgId?: string,
) => {
  return api.post<any>('/esg/contributions', {
    dataRequestId: requestId,
    contributorOrgId,
    draftData,
  });
};

// Save draft — the server upserts by requestId + caller, so passing the
// request id here is correct (the previous Supabase version incorrectly
// used it as the contribution id, which always missed).
export const saveDraft = async (
  api: ApiClient,
  requestId: string,
  draftData: ContributionDraft,
) => createDraft(api, requestId, draftData);

// Caller-scoped draft lookup by request id.
export const getDraftByRequestId = async (api: ApiClient, requestId: string) => {
  return api.get<any | null>(`/esg/contributions/draft/${requestId}`);
};

// Submit a contribution — server-side mirrors the previous behaviour:
// updates the existing draft to submitted, or creates the
// organization_esg_data entry + contribution pair.
export const submitContribution = async (
  api: ApiClient,
  contributionData: SubmitContributionData,
) => {
  return api.post<any>('/esg/contributions', {
    dataRequestId: contributionData.data_request_id,
    contributorOrgId: contributionData.contributor_org_id,
    submit: {
      value: contributionData.value,
      unit: contributionData.unit ?? null,
      notes: contributionData.notes ?? null,
      supporting_documents: contributionData.supporting_documents ?? [],
    },
  });
};
