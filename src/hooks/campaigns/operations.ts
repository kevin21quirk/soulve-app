
import { supabase } from '@/integrations/supabase/client';
import { Campaign } from './types';
import { validateCampaignData, prepareCampaignForDatabase } from './validation';

export class CampaignOperationsService {
  constructor(
    private userId: string | undefined,
    private showToast: (toast: any) => void
  ) {}

  async fetchCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Campaigns fetch error:', error);
      throw new Error(error.message);
    }

    return data || [];
  }

  async getUserCampaigns(): Promise<Campaign[]> {
    if (!this.userId) return [];

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('creator_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('User campaigns fetch error:', error);
      throw new Error(error.message);
    }

    return data || [];
  }

  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    if (!this.userId) {
      throw new Error('User must be authenticated to create campaigns');
    }

    validateCampaignData(campaignData);

    const campaignPayload = prepareCampaignForDatabase(campaignData, this.userId);

    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaignPayload)
      .select()
      .single();

    if (error) {
      console.error('Campaign creation error:', error);
      throw new Error(error.message);
    }

    this.showToast({
      title: "Campaign Created",
      description: "Your campaign has been created successfully"
    });

    return data;
  }

  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<Campaign> {
    if (!this.userId) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)
      .eq('creator_id', this.userId)
      .select()
      .single();

    if (error) {
      console.error('Campaign update error:', error);
      throw new Error(error.message);
    }

    this.showToast({
      title: "Campaign Updated",
      description: "Your campaign has been updated successfully"
    });

    return data;
  }

  async deleteCampaign(campaignId: string): Promise<void> {
    if (!this.userId) {
      throw new Error('User must be authenticated');
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('creator_id', this.userId);

    if (error) {
      console.error('Campaign deletion error:', error);
      throw new Error(error.message);
    }

    this.showToast({
      title: "Campaign Deleted",
      description: "Your campaign has been deleted successfully"
    });
  }
}
