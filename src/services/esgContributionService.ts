import { supabase } from '@/integrations/supabase/client';

export interface ContributionDraft {
  request_id: string;
  indicator_id: string;
  value?: any;
  date_value?: Date;
  bool_value?: boolean;
  unit?: string;
  notes?: string;
  supporting_documents?: string[];
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
  supporting_documents?: string[];
}

// Save draft contribution
export const saveDraft = async (contributionId: string, draftData: ContributionDraft) => {
  const { data, error} = await supabase
    .from('stakeholder_data_contributions')
    .update({
      draft_data: draftData as any,
      last_saved_at: new Date().toISOString(),
      contribution_status: 'draft'
    })
    .eq('id', contributionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get draft by request ID
export const getDraftByRequestId = async (requestId: string, userId: string) => {
  const { data, error } = await supabase
    .from('stakeholder_data_contributions')
    .select('*')
    .eq('data_request_id', requestId)
    .eq('contributor_user_id', userId)
    .eq('contribution_status', 'draft')
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
  return data;
};

// Submit contribution
export const submitContribution = async (contributionData: SubmitContributionData) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Check if draft exists
  const existingDraft = await getDraftByRequestId(
    contributionData.data_request_id,
    user.user.id
  );

  if (existingDraft) {
    // Update existing draft to submitted status
    const { data, error } = await supabase
      .from('stakeholder_data_contributions')
      .update({
        ...contributionData,
        contributor_user_id: user.user.id,
        contribution_status: 'submitted',
        verification_status: 'pending',
        submitted_at: new Date().toISOString(),
        draft_data: null // Clear draft data on submission
      })
      .eq('id', existingDraft.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new contribution
    // First, get the ESG data entry
    const { data: dataRequest } = await supabase
      .from('esg_data_requests')
      .select('indicator_id, organization_id')
      .eq('id', contributionData.data_request_id)
      .single();

    if (!dataRequest) throw new Error('Data request not found');

    // Create ESG data entry
    const { data: esgData, error: esgError } = await supabase
      .from('organization_esg_data')
      .insert({
        organization_id: dataRequest.organization_id,
        indicator_id: dataRequest.indicator_id,
        reporting_period: new Date().toISOString().split('T')[0],
        value: typeof contributionData.value === 'number' ? contributionData.value : null,
        text_value: typeof contributionData.value === 'string' ? contributionData.value : null,
        unit: contributionData.unit,
        data_source: 'stakeholder_contribution',
        verification_status: 'unverified',
        notes: contributionData.notes,
        collected_by: user.user.id
      })
      .select()
      .single();

    if (esgError) throw esgError;

    // Create contribution record
    const { data, error } = await supabase
      .from('stakeholder_data_contributions')
      .insert({
        data_request_id: contributionData.data_request_id,
        esg_data_id: esgData.id,
        contributor_user_id: user.user.id,
        contributor_org_id: contributionData.contributor_org_id,
        contribution_status: 'submitted',
        verification_status: 'pending',
        submitted_at: new Date().toISOString(),
        supporting_documents: contributionData.supporting_documents || []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Create initial draft (for auto-save)
export const createDraft = async (requestId: string, draftData: ContributionDraft) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Check if draft already exists
  const existing = await getDraftByRequestId(requestId, user.user.id);
  if (existing) {
    return saveDraft(existing.id, draftData);
  }

  const { data, error } = await supabase
    .from('stakeholder_data_contributions')
    .insert({
      data_request_id: requestId,
      contributor_user_id: user.user.id,
      draft_data: draftData as any,
      contribution_status: 'draft',
      verification_status: 'pending',
      last_saved_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
