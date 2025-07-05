
import { supabase } from '@/integrations/supabase/client';

export interface Donor {
  id: string;
  organization_id: string;
  user_id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: Record<string, any>;
  donor_type: string;
  preferred_contact_method: string;
  communication_preferences: Record<string, any>;
  total_donated: number;
  donation_count: number;
  first_donation_date?: string;
  last_donation_date?: string;
  average_donation: number;
  donor_status: string;
  notes?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DonorEngagement {
  email_opens: number;
  email_clicks: number;
  event_attendance: number;
  last_engagement: string;
  engagement_score: number;
}

export class DonorManagementService {
  static async getDonors(organizationId: string): Promise<Donor[]> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('organization_id', organizationId)
      .order('total_donated', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createDonor(organizationId: string, donorData: Partial<Donor>) {
    const { data, error } = await supabase
      .from('donors')
      .insert({
        organization_id: organizationId,
        ...donorData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDonor(donorId: string, updates: Partial<Donor>) {
    const { data, error } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getDonorAnalytics(organizationId: string) {
    const { data: donors } = await supabase
      .from('donors')
      .select('*')
      .eq('organization_id', organizationId);

    if (!donors) return null;

    const totalDonors = donors.length;
    const activeDonors = donors.filter(d => d.donor_status === 'active').length;
    const totalRaised = donors.reduce((sum, d) => sum + d.total_donated, 0);
    const averageDonation = totalRaised / Math.max(1, donors.reduce((sum, d) => sum + d.donation_count, 0));
    
    const retentionRate = donors.filter(d => d.donation_count > 1).length / Math.max(1, totalDonors);
    
    return {
      totalDonors,
      activeDonors,
      totalRaised,
      averageDonation,
      retentionRate: retentionRate * 100,
      monthlyGrowth: 0 // Would need historical data
    };
  }

  static async searchDonors(organizationId: string, query: string): Promise<Donor[]> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('organization_id', organizationId)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('total_donated', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getDonorsBySegment(organizationId: string, segment: string): Promise<Donor[]> {
    let query = supabase
      .from('donors')
      .select('*')
      .eq('organization_id', organizationId);

    switch (segment) {
      case 'major':
        query = query.gte('total_donated', 1000);
        break;
      case 'recurring':
        query = query.gte('donation_count', 3);
        break;
      case 'lapsed':
        query = query.eq('donor_status', 'lapsed');
        break;
      case 'new':
        query = query.gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());
        break;
    }

    const { data, error } = await query.order('total_donated', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
