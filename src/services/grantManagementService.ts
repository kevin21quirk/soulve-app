
import { supabase } from '@/integrations/supabase/client';

export interface Grant {
  id: string;
  organization_id: string;
  funder_name: string;
  grant_title: string;
  amount_requested?: number;
  amount_awarded?: number;
  application_deadline?: string;
  decision_date?: string;
  project_start_date?: string;
  project_end_date?: string;
  status: string;
  application_status: string;
  grant_type?: string;
  focus_area?: string;
  eligibility_requirements?: string;
  application_requirements?: string;
  notes?: string;
  documents: any[];
  reporting_requirements?: string;
  created_at: string;
  updated_at: string;
}

export class GrantManagementService {
  static async getGrants(organizationId: string): Promise<Grant[]> {
    const { data, error } = await supabase
      .from('grants')
      .select('*')
      .eq('organization_id', organizationId)
      .order('application_deadline', { ascending: true, nullsLast: true });

    if (error) throw error;
    return data || [];
  }

  static async createGrant(organizationId: string, grantData: Partial<Grant>) {
    const { data, error } = await supabase
      .from('grants')
      .insert({
        organization_id: organizationId,
        ...grantData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateGrant(grantId: string, updates: Partial<Grant>) {
    const { data, error } = await supabase
      .from('grants')
      .update(updates)
      .eq('id', grantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getGrantsByStatus(organizationId: string, status: string): Promise<Grant[]> {
    const { data, error } = await supabase
      .from('grants')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', status)
      .order('application_deadline', { ascending: true, nullsLast: true });

    if (error) throw error;
    return data || [];
  }

  static async getUpcomingDeadlines(organizationId: string): Promise<Grant[]> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data, error } = await supabase
      .from('grants')
      .select('*')
      .eq('organization_id', organizationId)
      .lte('application_deadline', thirtyDaysFromNow.toISOString())
      .gte('application_deadline', new Date().toISOString())
      .order('application_deadline', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getGrantAnalytics(organizationId: string) {
    const { data: grants } = await supabase
      .from('grants')
      .select('*')
      .eq('organization_id', organizationId);

    if (!grants) return null;

    const totalGrants = grants.length;
    const appliedGrants = grants.filter(g => g.application_status === 'submitted').length;
    const awardedGrants = grants.filter(g => g.status === 'awarded').length;
    const totalRequested = grants.reduce((sum, g) => sum + (g.amount_requested || 0), 0);
    const totalAwarded = grants.reduce((sum, g) => sum + (g.amount_awarded || 0), 0);

    return {
      totalGrants,
      appliedGrants,
      awardedGrants,
      totalRequested,
      totalAwarded,
      successRate: awardedGrants / Math.max(1, appliedGrants) * 100,
      averageAward: totalAwarded / Math.max(1, awardedGrants)
    };
  }
}
