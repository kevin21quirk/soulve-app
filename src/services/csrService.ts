import { supabase } from "@/integrations/supabase/client";

export interface CommunityNeed {
  id: string;
  title: string;
  content: string;
  category: string;
  urgency: string;
  location: string;
  tags: string[];
  created_at: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  estimated_cost?: number;
  beneficiaries?: number;
}

export interface CSROpportunity {
  id: string;
  organization_id: string;
  post_id: string;
  status: 'interested' | 'contacted' | 'committed' | 'completed' | 'declined';
  notes?: string;
  estimated_value?: number;
}

export interface CampaignSponsorship {
  id: string;
  campaign_id: string;
  organization_id: string;
  sponsorship_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  amount_pledged: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

// Fetch live community needs from posts table
export const fetchCommunityNeeds = async (filters?: {
  category?: string;
  urgency?: string;
  location?: string;
}): Promise<CommunityNeed[]> => {
  try {
    // Cast supabase to any to bypass type inference issues
    const db: any = supabase;
    const result = await db
      .from('posts')
      .select('*')
      .in('category', ['help-needed', 'emergency-relief'])
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20);

    if (result.error) throw result.error;

    const needs: CommunityNeed[] = (result.data || []).map((post: any) => ({
      id: post.id,
      title: post.title || 'Community Need',
      content: post.content,
      category: post.category,
      urgency: post.urgency || 'medium',
      location: post.location || 'Location not specified',
      tags: post.tags || [],
      created_at: post.created_at,
      author_id: post.author_id,
      author_name: 'Community Member',
      author_avatar: '',
    }));

    return needs;
  } catch (error) {
    console.error('Error fetching community needs:', error);
    return [];
  }
};

// Subscribe to real-time updates for community needs
export const subscribeToCommunityNeeds = (callback: () => void) => {
  const channel = supabase
    .channel('csr-community-needs')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: 'category=in.(help-needed,emergency-relief)',
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Create CSR opportunity (business expresses interest)
export const createCSROpportunity = async (
  organizationId: string,
  postId: string,
  notes?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('csr_opportunities')
    .insert({
      organization_id: organizationId,
      post_id: postId,
      status: 'interested',
      notes,
    })
    .select()
    .single();

  if (error) throw error;

  // Track lead
  await supabase.from('csr_lead_tracking').insert({
    organization_id: organizationId,
    post_id: postId,
    action_type: 'support',
    user_id: user.id,
  });

  return data;
};

// Fetch active campaigns for sponsorship
export const fetchSponsorableCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      id,
      title,
      description,
      goal_amount,
      current_amount,
      category,
      location,
      status,
      created_at,
      creator_id,
      profiles!campaigns_creator_id_fkey (
        first_name,
        last_name,
        avatar_url
      ),
      campaign_participants (count)
    `)
    .eq('status', 'active')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return data.map((campaign: any) => ({
    ...campaign,
    supporters_count: campaign.campaign_participants?.[0]?.count || 0,
    progress: campaign.goal_amount > 0 
      ? (campaign.current_amount / campaign.goal_amount) * 100 
      : 0,
  }));
};

// Create campaign sponsorship
export const createCampaignSponsorship = async (
  organizationId: string,
  campaignId: string,
  tier: 'bronze' | 'silver' | 'gold' | 'platinum',
  amount: number
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('campaign_sponsorships')
    .insert({
      organization_id: organizationId,
      campaign_id: campaignId,
      sponsorship_tier: tier,
      amount_pledged: amount,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // Track lead
  await supabase.from('csr_lead_tracking').insert({
    organization_id: organizationId,
    campaign_id: campaignId,
    action_type: 'sponsor',
    user_id: user.id,
  });

  return data;
};

// Fetch CSR analytics for organization
export const fetchCSRAnalytics = async (organizationId: string) => {
  // Get total CSR investment
  const { data: sponsorships } = await supabase
    .from('campaign_sponsorships')
    .select('amount_paid')
    .eq('organization_id', organizationId)
    .eq('status', 'active');

  const totalInvestment = sponsorships?.reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0;

  // Get active partnerships
  const { count: activePartnerships } = await supabase
    .from('campaign_sponsorships')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('status', 'active');

  // Get opportunities
  const { data: opportunities } = await supabase
    .from('csr_opportunities')
    .select('status')
    .eq('organization_id', organizationId);

  // Get impact from sponsored campaigns
  const { data: campaigns } = await supabase
    .from('campaign_sponsorships')
    .select(`
      campaigns!inner (
        current_amount,
        goal_amount,
        campaign_participants (count)
      )
    `)
    .eq('organization_id', organizationId);

  const livesImpacted = campaigns?.reduce((sum, c: any) => {
    return sum + (c.campaigns?.campaign_participants?.[0]?.count || 0);
  }, 0) || 0;

  return {
    totalInvestment,
    activePartnerships: activePartnerships || 0,
    livesImpacted,
    opportunities: {
      interested: opportunities?.filter(o => o.status === 'interested').length || 0,
      contacted: opportunities?.filter(o => o.status === 'contacted').length || 0,
      committed: opportunities?.filter(o => o.status === 'committed').length || 0,
      completed: opportunities?.filter(o => o.status === 'completed').length || 0,
    },
  };
};

// Track CSR lead (view action)
export const trackCSRLead = async (
  organizationId: string,
  actionType: 'view' | 'contact' | 'support' | 'sponsor',
  postId?: string,
  campaignId?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('csr_lead_tracking').insert({
    organization_id: organizationId,
    post_id: postId,
    campaign_id: campaignId,
    action_type: actionType,
    user_id: user.id,
  });
};
