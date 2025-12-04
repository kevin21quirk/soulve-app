import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserType = 'individual' | 'charity' | 'business' | 'community_group' | 'religious_group' | 'other_organization';

export interface UserTypeData {
  userType: UserType;
  interests: string[];
  skills: string[];
  isOrganization: boolean;
}

export const useUserType = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-type', user?.id],
    queryFn: async (): Promise<UserTypeData> => {
      if (!user?.id) {
        return { userType: 'individual', interests: [], skills: [], isOrganization: false };
      }

      // First try to get from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, interests, skills')
        .eq('id', user.id)
        .single();

      if (profile?.user_type) {
        const userType = (profile.user_type as UserType) || 'individual';
        return {
          userType,
          interests: profile.interests || [],
          skills: profile.skills || [],
          isOrganization: ['charity', 'business', 'community_group', 'religious_group', 'other_organization'].includes(userType)
        };
      }

      // Fallback to questionnaire_responses
      const { data: questionnaire } = await supabase
        .from('questionnaire_responses')
        .select('user_type, response_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (questionnaire) {
        const userType = (questionnaire.user_type as UserType) || 'individual';
        const responseData = questionnaire.response_data as any || {};
        return {
          userType,
          interests: responseData.interests || [],
          skills: responseData.skills || [],
          isOrganization: ['charity', 'business', 'community_group', 'religious_group', 'other_organization'].includes(userType)
        };
      }

      return { userType: 'individual', interests: [], skills: [], isOrganization: false };
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Helper function to get user type label
export const getUserTypeLabel = (userType: UserType): string => {
  const labels: Record<UserType, string> = {
    individual: 'Individual',
    charity: 'Charity/Non-Profit',
    business: 'Business',
    community_group: 'Community Group',
    religious_group: 'Religious Group',
    other_organization: 'Organisation'
  };
  return labels[userType] || 'Individual';
};

// Helper function to get dashboard config per user type
export const getDashboardConfig = (userType: UserType) => {
  const configs: Record<UserType, {
    welcomeMessage: string;
    quickActions: Array<{ label: string; action: string; icon: string }>;
    featuredTabs: string[];
  }> = {
    individual: {
      welcomeMessage: "Ready to make a difference today?",
      quickActions: [
        { label: "Find Opportunities", action: "discover", icon: "Search" },
        { label: "Offer Help", action: "create-post", icon: "HandHeart" },
        { label: "Get Help", action: "create-help", icon: "HelpCircle" },
        { label: "Connect", action: "connect", icon: "Users" }
      ],
      featuredTabs: ['feed', 'discover', 'connect', 'campaigns']
    },
    charity: {
      welcomeMessage: "Manage your impact and connect with supporters",
      quickActions: [
        { label: "Post Opportunity", action: "create-opportunity", icon: "Plus" },
        { label: "Manage Volunteers", action: "charity-tools", icon: "Users" },
        { label: "Create Campaign", action: "campaigns", icon: "Target" },
        { label: "View Analytics", action: "analytics", icon: "BarChart" }
      ],
      featuredTabs: ['feed', 'charity-tools', 'campaigns', 'analytics']
    },
    business: {
      welcomeMessage: "Drive your CSR impact and engage with the community",
      quickActions: [
        { label: "CSR Dashboard", action: "csr", icon: "Building2" },
        { label: "Sponsor Campaign", action: "campaigns", icon: "Heart" },
        { label: "Employee Volunteering", action: "business-tools", icon: "Users" },
        { label: "Impact Report", action: "esg", icon: "FileText" }
      ],
      featuredTabs: ['feed', 'csr', 'business-tools', 'esg']
    },
    community_group: {
      welcomeMessage: "Coordinate your community initiatives",
      quickActions: [
        { label: "Create Event", action: "create-event", icon: "Calendar" },
        { label: "Post Update", action: "create-post", icon: "MessageSquare" },
        { label: "Manage Members", action: "group-tools", icon: "Users" },
        { label: "Find Partners", action: "discover", icon: "Handshake" }
      ],
      featuredTabs: ['feed', 'discover', 'campaigns', 'connect']
    },
    religious_group: {
      welcomeMessage: "Connect your congregation with community needs",
      quickActions: [
        { label: "Community Outreach", action: "discover", icon: "Heart" },
        { label: "Volunteer Opportunities", action: "feed", icon: "HandHeart" },
        { label: "Create Event", action: "create-event", icon: "Calendar" },
        { label: "Connect", action: "connect", icon: "Users" }
      ],
      featuredTabs: ['feed', 'discover', 'campaigns', 'connect']
    },
    other_organization: {
      welcomeMessage: "Manage your organisation's community presence",
      quickActions: [
        { label: "Post Update", action: "create-post", icon: "MessageSquare" },
        { label: "Find Partners", action: "discover", icon: "Handshake" },
        { label: "Create Campaign", action: "campaigns", icon: "Target" },
        { label: "View Analytics", action: "analytics", icon: "BarChart" }
      ],
      featuredTabs: ['feed', 'discover', 'campaigns', 'analytics']
    }
  };
  return configs[userType] || configs.individual;
};
