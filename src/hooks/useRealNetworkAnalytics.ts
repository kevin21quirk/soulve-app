import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface NetworkAnalytics {
  growthTrends: {
    connections_7d: number;
    connections_30d: number;
    connections_90d: number;
    groups_7d: number;
    groups_30d: number;
    groups_90d: number;
  };
  geographicSpread: {
    locations: string[];
    countries: number;
    cities: number;
    topLocations: string[];
    diversity: number;
  };
  influence: {
    mutualConnections: number;
    networkReach: number;
    weeklyActivity: number;
  };
  socialProof: {
    endorsements: number;
    introductions: number;
    helpedPeople: number;
  };
}

interface ConnectionData {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
}

interface ProfileData {
  id: string;
  location: string | null;
}

interface GroupData {
  group_id: string;
  joined_at: string;
}

interface SocialProofData {
  endorsements: number;
  introductions: number;
  helpedPeople: number;
}

const calculateAnalytics = (
  connections: ConnectionData[],
  connectionProfiles: ProfileData[],
  groups: GroupData[],
  socialProof: SocialProofData,
  userId: string | undefined
): NetworkAnalytics => {
  const now = new Date();
  const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const day90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const connections_7d = connections.filter(c => new Date(c.created_at) >= day7).length;
  const connections_30d = connections.filter(c => new Date(c.created_at) >= day30).length;
  const connections_90d = connections.filter(c => new Date(c.created_at) >= day90).length;

  const groups_7d = groups.filter(g => new Date(g.joined_at) >= day7).length;
  const groups_30d = groups.filter(g => new Date(g.joined_at) >= day30).length;
  const groups_90d = groups.filter(g => new Date(g.joined_at) >= day90).length;

  const locations = new Set<string>();
  connectionProfiles.forEach(profile => {
    if (profile.location) {
      locations.add(profile.location);
    }
  });

  const locationArray = Array.from(locations);
  const uniqueCountries = new Set(locationArray.map(loc => loc.split(',').pop()?.trim())).size;
  const uniqueCities = locationArray.length;

  const mutualConnections = Math.floor(Math.sqrt(connections.length));

  return {
    growthTrends: {
      connections_7d,
      connections_30d,
      connections_90d,
      groups_7d,
      groups_30d,
      groups_90d
    },
    geographicSpread: {
      locations: locationArray,
      countries: uniqueCountries,
      cities: uniqueCities,
      topLocations: locationArray.slice(0, 5),
      diversity: Math.min((uniqueCities / Math.max(connections.length, 1)) * 100, 100)
    },
    influence: {
      mutualConnections,
      networkReach: connections.length * (mutualConnections || 1),
      weeklyActivity: connections_7d + groups_7d
    },
    socialProof
  };
};

const getDefaultAnalytics = (): NetworkAnalytics => ({
  growthTrends: {
    connections_7d: 0,
    connections_30d: 0,
    connections_90d: 0,
    groups_7d: 0,
    groups_30d: 0,
    groups_90d: 0
  },
  geographicSpread: {
    locations: [],
    countries: 0,
    cities: 0,
    topLocations: [],
    diversity: 0
  },
  influence: {
    mutualConnections: 0,
    networkReach: 0,
    weeklyActivity: 0
  },
  socialProof: {
    endorsements: 0,
    introductions: 0,
    helpedPeople: 0
  }
});

export const useRealNetworkAnalytics = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [connectionProfiles, setConnectionProfiles] = useState<ProfileData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProofData>({
    endorsements: 0,
    introductions: 0,
    helpedPeople: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    if (!userId) return;

    setIsLoading(true);
    // Fetch connections
    const connectionsResult: any = await supabase
      .from('connections')
      .select('id, requester_id, addressee_id, status, created_at')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    const connectionsData: ConnectionData[] = connectionsResult.data || [];
    setConnections(connectionsData);

    // Calculate connection IDs
    const connectionIds = connectionsData.map(conn => 
      conn.requester_id === userId ? conn.addressee_id : conn.requester_id
    );

    // Fetch connection profiles
    if (connectionIds.length > 0) {
      const profilesResult: any = await supabase
        .from('profiles')
        .select('id, location')
        .in('id', connectionIds);

      const profilesData: ProfileData[] = profilesResult.data || [];
      setConnectionProfiles(profilesData);
    }

    // Fetch groups
    // @ts-ignore - Bypass type depth limit
    const groupsResult: any = await supabase
      .from('group_members')
      .select('group_id, joined_at')
      .eq('user_id', userId)
      .eq('status', 'active');

    const groupsData: GroupData[] = groupsResult.data || [];
    setGroups(groupsData);

    // Fetch social proof
    const metricsResult: any = await supabase
      .from('impact_metrics')
      .select('help_provided_count')
      .eq('user_id', userId)
      .single();

    const endorsementsResult: any = await supabase
      .from('impact_activities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('activity_type', 'positive_feedback');

    const introductionsResult: any = await supabase
      .from('impact_activities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('activity_type', 'user_referral');

    setSocialProof({
      endorsements: endorsementsResult.count || 0,
      introductions: introductionsResult.count || 0,
      helpedPeople: metricsResult.data?.help_provided_count || 0
    });
    
    setIsLoading(false);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [userId]);

  // Real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    // Subscribe to connections where user is requester
    const connectionsRequesterChannel = supabase
      .channel('network-connections-requester')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `requester_id=eq.${userId}`
        },
        () => {
          console.log('Connection change detected (requester), refreshing network analytics');
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to connections where user is addressee
    const connectionsAddresseeChannel = supabase
      .channel('network-connections-addressee')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `addressee_id=eq.${userId}`
        },
        () => {
          console.log('Connection change detected (addressee), refreshing network analytics');
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to organization_members changes
    const orgMembersChannel = supabase
      .channel('network-org-members-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_members',
          filter: `user_id=eq.${userId}`
        },
        () => {
          console.log('Organization membership change detected');
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to impact_activities for social proof
    const activitiesChannel = supabase
      .channel('network-activities-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'impact_activities',
          filter: `user_id=eq.${userId}`
        },
        () => {
          console.log('Impact activity detected');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connectionsRequesterChannel);
      supabase.removeChannel(connectionsAddresseeChannel);
      supabase.removeChannel(orgMembersChannel);
      supabase.removeChannel(activitiesChannel);
    };
  }, [userId]);

  const analytics = useMemo(() => {
    if (!userId) return getDefaultAnalytics();
    return calculateAnalytics(connections, connectionProfiles, groups, socialProof, userId);
  }, [connections, connectionProfiles, groups, socialProof, userId]);

  return {
    analytics
  };
};
