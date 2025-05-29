
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

export interface CampaignFormData {
  title: string;
  description: string;
  story: string;
  category: 'fundraising' | 'volunteer' | 'awareness' | 'community' | 'petition';
  organization_type: 'charity' | 'business' | 'social_group' | 'community_group' | 'individual';
  goal_type: 'monetary' | 'volunteers' | 'signatures' | 'participants';
  goal_amount?: number;
  currency?: string;
  end_date?: string;
  location?: string;
  urgency: 'low' | 'medium' | 'high';
  visibility: 'public' | 'private' | 'invite_only';
  allow_anonymous_donations: boolean;
  enable_comments: boolean;
  enable_updates: boolean;
  featured_image?: string;
  gallery_images?: string[];
  tags?: string[];
  social_links?: Record<string, string>;
  custom_fields?: Record<string, any>;
  promotion_budget?: number;
}

export const createCampaign = async (data: CampaignFormData) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  const campaignData: CampaignInsert = {
    creator_id: user.user.id,
    title: data.title,
    description: data.description,
    story: data.story,
    category: data.category,
    organization_type: data.organization_type,
    goal_type: data.goal_type,
    goal_amount: data.goal_amount,
    currency: data.currency || 'USD',
    end_date: data.end_date,
    location: data.location,
    urgency: data.urgency,
    visibility: data.visibility,
    allow_anonymous_donations: data.allow_anonymous_donations,
    enable_comments: data.enable_comments,
    enable_updates: data.enable_updates,
    featured_image: data.featured_image,
    gallery_images: data.gallery_images || [],
    tags: data.tags || [],
    social_links: data.social_links || {},
    custom_fields: data.custom_fields || {},
    promotion_budget: data.promotion_budget || 0
  };

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert(campaignData)
    .select()
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }

  return campaign;
};

export const updateCampaign = async (id: string, data: Partial<CampaignFormData>) => {
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }

  return campaign;
};

export const getCampaign = async (id: string) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }

  return data;
};

export const getUserCampaigns = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('creator_id', user.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user campaigns:', error);
    throw error;
  }

  return data;
};

export const getPublicCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('visibility', 'public')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public campaigns:', error);
    throw error;
  }

  return data;
};

export const joinCampaign = async (campaignId: string, participantType: 'supporter' | 'volunteer' | 'organizer' | 'donor', message?: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('campaign_participants')
    .insert({
      campaign_id: campaignId,
      user_id: user.user.id,
      participant_type: participantType,
      message: message
    })
    .select()
    .single();

  if (error) {
    console.error('Error joining campaign:', error);
    throw error;
  }

  return data;
};

export const sendCampaignInvitation = async (campaignId: string, email: string, invitationType: 'participant' | 'organizer' | 'supporter', message?: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('campaign_invitations')
    .insert({
      campaign_id: campaignId,
      inviter_id: user.user.id,
      invitee_email: email,
      invitation_type: invitationType,
      message: message
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }

  return data;
};
