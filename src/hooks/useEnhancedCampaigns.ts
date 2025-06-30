
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Campaign, CampaignOperations } from './campaigns/types';
import { CampaignOperationsService } from './campaigns/operations';

export const useEnhancedCampaigns = (): CampaignOperations => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const operationsService = new CampaignOperationsService(user?.id, toast);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await operationsService.fetchCampaigns();
      setCampaigns(data);
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
  }, [toast, user?.id]);

  const getUserCampaigns = useCallback(async () => {
    try {
      return await operationsService.getUserCampaigns();
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
    try {
      const data = await operationsService.createCampaign(campaignData);
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
    try {
      const data = await operationsService.updateCampaign(campaignId, updates);
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
    try {
      await operationsService.deleteCampaign(campaignId);
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
