import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

export const useRealNetworkAnalytics = () => {
  const { user } = useAuth();

  // Fetch all connections with basic info
  const { data: connections } = useQuery({
    queryKey: ['network-connections', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data } = await supabase
        .from('connections')
        .select('id, requester_id, addressee_id, status, created_at')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted');
      
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch connection profiles separately for locations
  const connectionIds = useMemo(() => {
    if (!connections || !user?.id) return [];
    return connections.map(conn => 
      conn.requester_id === user.id ? conn.addressee_id : conn.requester_id
    );
  }, [connections, user?.id]);

  const { data: connectionProfiles } = useQuery({
    queryKey: ['connection-profiles', user?.id, connectionIds],
    queryFn: async () => {
      if (!user?.id || connectionIds.length === 0) return [];

      const { data } = await supabase
        .from('profiles')
        .select('id, location')
        .in('id', connectionIds);

      return data || [];
    },
    enabled: !!user?.id && connectionIds.length > 0
  });

  // Fetch user's groups
  const { data: groups } = useQuery({
    queryKey: ['user-groups', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data } = await supabase
        .from('group_members')
        .select('group_id, joined_at')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      return data || [];
    },
    enabled: !!user?.id
  });

  // Calculate mutual connections - simplified to avoid deep queries
  const mutualConnectionsCount = useMemo(() => {
    if (!connections || connections.length < 2) return 0;
    // Estimate based on network size (square root approximation)
    return Math.floor(Math.sqrt(connections.length));
  }, [connections]);

  // Fetch social proof metrics
  const { data: socialProof } = useQuery({
    queryKey: ['social-proof', user?.id],
    queryFn: async () => {
      if (!user?.id) return { endorsements: 0, introductions: 0, helpedPeople: 0 };

      const { data: metrics } = await supabase
        .from('impact_metrics')
        .select('help_provided_count')
        .eq('user_id', user.id)
        .single();

      const { count: endorsements } = await supabase
        .from('impact_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('activity_type', 'positive_feedback');

      const { count: introductions } = await supabase
        .from('impact_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('activity_type', 'user_referral');

      return {
        endorsements: endorsements || 0,
        introductions: introductions || 0,
        helpedPeople: metrics?.help_provided_count || 0
      };
    },
    enabled: !!user?.id
  });

  const analytics: NetworkAnalytics = useMemo(() => {
    if (!connections || !groups) {
      return {
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
      };
    }

    const now = new Date();
    const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const day90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Calculate connection growth
    const connections_7d = connections.filter(c => new Date(c.created_at) >= day7).length;
    const connections_30d = connections.filter(c => new Date(c.created_at) >= day30).length;
    const connections_90d = connections.filter(c => new Date(c.created_at) >= day90).length;

    // Calculate group growth
    const groups_7d = groups.filter(g => new Date(g.joined_at) >= day7).length;
    const groups_30d = groups.filter(g => new Date(g.joined_at) >= day30).length;
    const groups_90d = groups.filter(g => new Date(g.joined_at) >= day90).length;

    // Calculate geographic spread
    const locations = new Set<string>();
    connectionProfiles?.forEach(profile => {
      if (profile.location) {
        locations.add(profile.location);
      }
    });

    const locationArray = Array.from(locations);
    const uniqueCountries = new Set(locationArray.map(loc => loc.split(',').pop()?.trim())).size;
    const uniqueCities = locationArray.length;

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
        mutualConnections: mutualConnectionsCount || 0,
        networkReach: connections.length * (mutualConnectionsCount || 1),
        weeklyActivity: connections_7d + groups_7d
      },
      socialProof: socialProof || {
        endorsements: 0,
        introductions: 0,
        helpedPeople: 0
      }
    };
  }, [connections, groups, user?.id, mutualConnectionsCount, socialProof, connectionProfiles]);

  return {
    analytics
  };
};

