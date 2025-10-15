import { supabase } from '@/integrations/supabase/client';

export interface ESGInitiative {
  id: string;
  organization_id: string;
  initiative_name: string;
  initiative_type: 'report' | 'audit' | 'certification' | 'assessment';
  framework_id?: string;
  reporting_period_start?: string;
  reporting_period_end?: string;
  due_date?: string;
  status: 'planning' | 'collecting' | 'reviewing' | 'completed' | 'archived';
  target_stakeholder_groups: string[];
  progress_percentage: number;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ESGInitiativeTemplate {
  id: string;
  name: string;
  framework_id?: string;
  category: string;
  description?: string;
  required_indicators: any[];
  suggested_stakeholder_types: string[];
  typical_duration_days: number;
  milestone_templates: any[];
  is_active: boolean;
}

export interface CreateInitiativeData {
  organization_id: string;
  initiative_name: string;
  initiative_type: 'report' | 'audit' | 'certification' | 'assessment';
  framework_id?: string;
  reporting_period_start?: string;
  reporting_period_end?: string;
  due_date?: string;
  target_stakeholder_groups?: string[];
  description?: string;
}

// Fetch all initiatives for an organization
export const getInitiatives = async (organizationId: string): Promise<ESGInitiative[]> => {
  const { data, error } = await supabase
    .from('esg_initiatives')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ESGInitiative[];
};

// Get single initiative with details
export const getInitiativeDetails = async (initiativeId: string) => {
  const { data: initiative, error: initiativeError } = await supabase
    .from('esg_initiatives')
    .select('*')
    .eq('id', initiativeId)
    .single();

  if (initiativeError) throw initiativeError;

  // Get related data requests
  const { data: dataRequests, error: requestsError } = await supabase
    .from('esg_data_requests')
    .select(`
      *,
      indicator:esg_indicators(*)
    `)
    .eq('initiative_id', initiativeId);

  if (requestsError) throw requestsError;

  // Calculate progress
  const totalRequests = dataRequests?.length || 0;
  const completedRequests = dataRequests?.filter(
    req => req.status === 'completed'
  ).length || 0;

  const progressPercentage = totalRequests > 0 
    ? Math.round((completedRequests / totalRequests) * 100) 
    : 0;

  return {
    ...initiative,
    dataRequests,
    totalRequests,
    completedRequests,
    progressPercentage
  };
};

// Create new initiative
export const createInitiative = async (data: CreateInitiativeData): Promise<ESGInitiative> => {
  const { data: user } = await supabase.auth.getUser();
  
  const { data: initiative, error } = await supabase
    .from('esg_initiatives')
    .insert({
      ...data,
      created_by: user.user?.id,
      status: 'planning',
      progress_percentage: 0
    })
    .select()
    .single();

  if (error) throw error;
  return initiative as ESGInitiative;
};

// Update initiative
export const updateInitiative = async (
  initiativeId: string,
  updates: Partial<ESGInitiative>
): Promise<ESGInitiative> => {
  const { data, error } = await supabase
    .from('esg_initiatives')
    .update(updates)
    .eq('id', initiativeId)
    .select()
    .single();

  if (error) throw error;
  return data as ESGInitiative;
};

// Delete initiative
export const deleteInitiative = async (initiativeId: string): Promise<void> => {
  const { error } = await supabase
    .from('esg_initiatives')
    .delete()
    .eq('id', initiativeId);

  if (error) throw error;
};

// Get initiative templates
export const getInitiativeTemplates = async (): Promise<ESGInitiativeTemplate[]> => {
  const { data, error } = await supabase
    .from('esg_initiative_templates')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return (data || []) as ESGInitiativeTemplate[];
};

// Calculate initiative progress based on data requests
export const calculateInitiativeProgress = async (initiativeId: string): Promise<number> => {
  const { data: dataRequests, error } = await supabase
    .from('esg_data_requests')
    .select('id, status')
    .eq('initiative_id', initiativeId);

  if (error) throw error;

  const total = dataRequests?.length || 0;
  if (total === 0) return 0;

  const completed = dataRequests?.filter(
    req => req.status === 'completed'
  ).length || 0;

  const progress = Math.round((completed / total) * 100);

  // Update initiative progress
  await supabase
    .from('esg_initiatives')
    .update({ progress_percentage: progress })
    .eq('id', initiativeId);

  return progress;
};

// Get initiative status (on track, at risk, overdue)
export const getInitiativeStatus = (initiative: ESGInitiative): 'on_track' | 'at_risk' | 'overdue' => {
  if (!initiative.due_date) return 'on_track';

  const dueDate = new Date(initiative.due_date);
  const now = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue < 7 && initiative.progress_percentage < 80) return 'at_risk';
  return 'on_track';
};
