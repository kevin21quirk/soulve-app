
import { Campaign } from './types';

export const validateCampaignData = (campaignData: Partial<Campaign>): void => {
  if (!campaignData.title?.trim()) {
    throw new Error('Campaign title is required');
  }
};

export const prepareCampaignForDatabase = (campaignData: Partial<Campaign>, userId: string) => {
  return {
    title: campaignData.title!.trim(),
    description: campaignData.description || '',
    creator_id: userId,
    current_amount: 0,
    status: 'draft',
    goal_type: 'monetary',
    organization_type: 'individual',
    category: campaignData.category || 'general',
    goal_amount: campaignData.goal_amount,
    end_date: campaignData.end_date,
    featured_image: campaignData.featured_image
  };
};
