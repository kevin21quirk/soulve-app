
import { supabase } from '@/integrations/supabase/client';

export interface VolunteerOpportunity {
  id: string;
  organization_id: string;
  created_by: string;
  title: string;
  description: string;
  requirements?: string;
  skills_needed: string[];
  time_commitment?: string;
  location?: string;
  is_remote: boolean;
  start_date?: string;
  end_date?: string;
  max_volunteers?: number;
  current_volunteers: number;
  status: string;
  application_deadline?: string;
  background_check_required: boolean;
  training_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface VolunteerApplication {
  id: string;
  opportunity_id: string;
  user_id: string;
  application_message?: string;
  availability?: string;
  relevant_experience?: string;
  emergency_contact?: Record<string, any>;
  background_check_status: string;
  training_status: string;
  status: string;
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  start_date?: string;
  end_date?: string;
  hours_logged: number;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export class VolunteerManagementService {
  static async getOpportunities(organizationId: string): Promise<VolunteerOpportunity[]> {
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createOpportunity(organizationId: string, opportunityData: Partial<VolunteerOpportunity>) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .insert({
        organization_id: organizationId,
        created_by: user.data.user.id,
        ...opportunityData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateOpportunity(opportunityId: string, updates: Partial<VolunteerOpportunity>) {
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .update(updates)
      .eq('id', opportunityId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getApplications(opportunityId: string): Promise<VolunteerApplication[]> {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .select(`
        *,
        profile:profiles(first_name, last_name, avatar_url)
      `)
      .eq('opportunity_id', opportunityId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async applyForOpportunity(opportunityId: string, applicationData: Partial<VolunteerApplication>) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('volunteer_applications')
      .insert({
        opportunity_id: opportunityId,
        user_id: user.data.user.id,
        ...applicationData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async reviewApplication(applicationId: string, status: string, reviewNotes?: string) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('volunteer_applications')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.data.user.id
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async logVolunteerHours(applicationId: string, hours: number) {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .update({
        hours_logged: hours
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getVolunteerAnalytics(organizationId: string) {
    const { data: opportunities } = await supabase
      .from('volunteer_opportunities')
      .select('*, volunteer_applications(*)')
      .eq('organization_id', organizationId);

    if (!opportunities) return null;

    const totalOpportunities = opportunities.length;
    const activeOpportunities = opportunities.filter(o => o.status === 'active').length;
    const totalApplications = opportunities.reduce((sum, o) => sum + (o.volunteer_applications?.length || 0), 0);
    const totalVolunteers = new Set(
      opportunities.flatMap(o => o.volunteer_applications?.map((a: any) => a.user_id) || [])
    ).size;

    return {
      totalOpportunities,
      activeOpportunities,
      totalApplications,
      totalVolunteers,
      applicationRate: totalApplications / Math.max(1, totalOpportunities),
      averageApplicationsPerOpportunity: totalApplications / Math.max(1, totalOpportunities)
    };
  }
}
