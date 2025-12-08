import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface HelpRequest {
  id: string;
  title: string;
  content: string;
  location: string | null;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  response_count: number;
  category: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  content: string;
  location: string | null;
  commitment: string | null;
  participant_count: number;
  category: string;
  author_id: string;
  author_name: string;
  organization_name: string | null;
}

export interface TrendingCause {
  id: string;
  name: string;
  growth: string;
  supporters: number;
  category: string;
}

export interface CommunityStats {
  totalPeopleHelped: number;
  totalHoursVolunteered: number;
  totalMoneyRaised: number;
  activeCampaigns: number;
}

export interface UserImpactStats {
  helpProvided: number;
  hoursVolunteered: number;
  peopleHelped: number;
  trustScore: number;
  totalPoints: number;
}

// Fetch urgent help requests from posts table
export const useUrgentHelpRequests = () => {
  return useQuery({
    queryKey: ['help-center', 'urgent-requests'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          location,
          urgency,
          created_at,
          author_id,
          category
        `)
        .eq('is_active', true)
        .in('urgency', ['urgent', 'high'])
        .in('category', ['help-needed', 'help_needed'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (!posts || posts.length === 0) return [];

      // Fetch author profiles
      const authorIds = [...new Set(posts.map(p => p.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', authorIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Fetch response counts
      const postIds = posts.map(p => p.id);
      const { data: interactions } = await supabase
        .from('post_interactions')
        .select('post_id')
        .in('post_id', postIds)
        .eq('interaction_type', 'comment');

      const responseCounts = new Map<string, number>();
      interactions?.forEach(i => {
        responseCounts.set(i.post_id, (responseCounts.get(i.post_id) || 0) + 1);
      });

      return posts.map(post => {
        const profile = profilesMap.get(post.author_id);
        return {
          id: post.id,
          title: post.title || 'Untitled Request',
          content: post.content || '',
          location: post.location,
          urgency: post.urgency as 'low' | 'medium' | 'high' | 'urgent',
          created_at: post.created_at,
          author_id: post.author_id,
          author_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous',
          author_avatar: profile?.avatar_url || null,
          response_count: responseCounts.get(post.id) || 0,
          category: post.category || 'help-needed'
        } as HelpRequest;
      });
    },
    staleTime: 60000, // 1 minute
  });
};

// Fetch volunteer opportunities
export const useVolunteerOpportunities = () => {
  return useQuery({
    queryKey: ['help-center', 'volunteer-opportunities'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          location,
          category,
          author_id,
          organization_id
        `)
        .eq('is_active', true)
        .eq('category', 'volunteer')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (!posts || posts.length === 0) return [];

      // Fetch author profiles
      const authorIds = [...new Set(posts.map(p => p.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', authorIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Fetch organizations
      const orgIds = posts.map(p => p.organization_id).filter(Boolean) as string[];
      const { data: orgs } = orgIds.length > 0 ? await supabase
        .from('organizations')
        .select('id, name')
        .in('id', orgIds) : { data: [] };

      const orgsMap = new Map<string, { id: string; name: string }>();
      orgs?.forEach(o => orgsMap.set(o.id, o));

      return posts.map(post => {
        const profile = profilesMap.get(post.author_id);
        const org = post.organization_id ? orgsMap.get(post.organization_id) : null;
        
        return {
          id: post.id,
          title: post.title || 'Volunteer Opportunity',
          content: post.content || '',
          location: post.location,
          commitment: null,
          participant_count: 0,
          category: post.category || 'volunteer',
          author_id: post.author_id,
          author_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous',
          organization_name: org?.name || null
        } as VolunteerOpportunity;
      });
    },
    staleTime: 60000,
  });
};

// Fetch trending causes from campaigns
export const useTrendingCauses = () => {
  return useQuery({
    queryKey: ['help-center', 'trending-causes'],
    queryFn: async () => {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select(`
          id,
          title,
          category,
          total_views,
          current_amount,
          goal_amount
        `)
        .eq('status', 'active')
        .order('total_views', { ascending: false })
        .limit(6);

      if (error) throw error;
      if (!campaigns || campaigns.length === 0) return [];

      // Fetch participant counts
      const campaignIds = campaigns.map(c => c.id);
      const { data: participants } = await supabase
        .from('campaign_participants')
        .select('campaign_id')
        .in('campaign_id', campaignIds);

      const supporterCounts = new Map<string, number>();
      participants?.forEach(p => {
        supporterCounts.set(p.campaign_id, (supporterCounts.get(p.campaign_id) || 0) + 1);
      });

      return campaigns.map(campaign => {
        const supporters = supporterCounts.get(campaign.id) || 0;
        const progress = campaign.goal_amount ? Math.round((campaign.current_amount || 0) / campaign.goal_amount * 100) : 0;
        
        return {
          id: campaign.id,
          name: campaign.title,
          growth: `+${Math.min(progress, 100)}%`,
          supporters: supporters,
          category: campaign.category
        } as TrendingCause;
      });
    },
    staleTime: 120000, // 2 minutes
  });
};

// Fetch community-wide statistics
export const useCommunityStats = () => {
  return useQuery({
    queryKey: ['help-center', 'community-stats'],
    queryFn: async () => {
      // Aggregate from impact_metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('impact_metrics')
        .select('help_provided_count, volunteer_hours, donation_amount');

      if (metricsError) throw metricsError;

      // Count active campaigns
      const { count: campaignCount } = await supabase
        .from('campaigns')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      // Aggregate totals
      let totalPeopleHelped = 0;
      let totalHoursVolunteered = 0;
      let totalMoneyRaised = 0;

      metrics?.forEach(m => {
        totalPeopleHelped += m.help_provided_count || 0;
        totalHoursVolunteered += m.volunteer_hours || 0;
        totalMoneyRaised += m.donation_amount || 0;
      });

      return {
        totalPeopleHelped,
        totalHoursVolunteered: Math.round(totalHoursVolunteered),
        totalMoneyRaised: Math.round(totalMoneyRaised),
        activeCampaigns: campaignCount || 0
      } as CommunityStats;
    },
    staleTime: 300000, // 5 minutes
  });
};

// Fetch current user's impact stats
export const useUserImpactStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['help-center', 'user-impact', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('impact_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        helpProvided: data?.help_provided_count || 0,
        hoursVolunteered: data?.volunteer_hours || 0,
        peopleHelped: data?.help_provided_count || 0,
        trustScore: data?.trust_score || 0,
        totalPoints: data?.xp_points || 0
      } as UserImpactStats;
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });
};

// Fetch user's achievements
export const useUserAchievements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['help-center', 'user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('badge_award_log')
        .select(`
          id,
          awarded_at,
          badge_id,
          badges (
            name,
            description,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map(award => ({
        id: award.id,
        title: (award.badges as any)?.name || 'Achievement',
        description: (award.badges as any)?.description || '',
        icon: (award.badges as any)?.icon || 'Award',
        date: award.awarded_at
      })) || [];
    },
    enabled: !!user?.id,
    staleTime: 120000,
  });
};

// Get relative time string
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-GB');
};
