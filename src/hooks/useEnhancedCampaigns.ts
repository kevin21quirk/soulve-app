import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  creator_id: string;
  status: string;
  category: string;
  created_at: string;
  end_date?: string;
  featured_image?: string;
}

export const useEnhancedCampaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Campaigns fetch error:', fetchError);
        throw new Error(fetchError.message);
      }

      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      setError(error.message || 'Failed to load campaigns');
      toast({
        title: "Failed to load campaigns",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getUserCampaigns = useCallback(async () => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('User campaigns fetch error:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching user campaigns:', error);
      toast({
        title: "Failed to load your campaigns",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return [];
    }
  }, [user?.id, toast]);

  const createCampaign = useCallback(async (campaignData: Partial<Campaign>) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to create campaigns');
    }

    // Validate required fields
    if (!campaignData.title?.trim()) {
      throw new Error('Campaign title is required');
    }

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          title: campaignData.title.trim(),
          description: campaignData.description || '',
          creator_id: user.id,
          current_amount: 0,
          status: 'draft',
          goal_type: 'monetary',
          organization_type: 'individual',
          category: campaignData.category || 'general',
          goal_amount: campaignData.goal_amount,
          end_date: campaignData.end_date,
          featured_image: campaignData.featured_image
        })
        .select()
        .single();

      if (error) {
        console.error('Campaign creation error:', error);
        throw new Error(error.message);
      }

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully"
      });

      // Refresh campaigns list
      await fetchCampaigns();

      return data;
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Failed to create campaign",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      throw error;
    }
  }, [user?.id, toast, fetchCampaigns]);

  const updateCampaign = useCallback(async (campaignId: string, updates: Partial<Campaign>) => {
    if (!user?.id) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)
        .eq('creator_id', user.id) // Ensure user can only update their own campaigns
        .select()
        .single();

      if (error) {
        console.error('Campaign update error:', error);
        throw new Error(error.message);
      }

      toast({
        title: "Campaign Updated",
        description: "Your campaign has been updated successfully"
      });

      // Refresh campaigns list
      await fetchCampaigns();

      return data;
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Failed to update campaign",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      throw error;
    }
  }, [user?.id, toast, fetchCampaigns]);

  const deleteCampaign = useCallback(async (campaignId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated');
    }

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('creator_id', user.id); // Ensure user can only delete their own campaigns

      if (error) {
        console.error('Campaign deletion error:', error);
        throw new Error(error.message);
      }

      toast({
        title: "Campaign Deleted",
        description: "Your campaign has been deleted successfully"
      });

      // Refresh campaigns list
      await fetchCampaigns();
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Failed to delete campaign",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      throw error;
    }
  }, [user?.id, toast, fetchCampaigns]);

  // Fetch campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    getUserCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refreshCampaigns: fetchCampaigns
  };
};
