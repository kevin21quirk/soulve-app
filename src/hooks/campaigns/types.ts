
export interface Campaign {
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

export interface CampaignOperations {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  getUserCampaigns: () => Promise<Campaign[]>;
  createCampaign: (campaignData: Partial<Campaign>) => Promise<Campaign>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<Campaign>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  refreshCampaigns: () => Promise<void>;
}
