
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { optimizedCache } from '@/services/optimizedCacheService';

interface OptimizedConnection {
  id: string;
  status: string;
  created_at: string;
  requester_id: string;
  addressee_id: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    location: string;
  };
}

export const useOptimizedConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<OptimizedConnection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<OptimizedConnection[]>([]);
  const [loading, setLoading] = useState(true);

  // Optimized fetch function with manual joins
  const fetchConnections = useCallback(async () => {
    if (!user) return;

    const cacheKey = `connections-${user.id}`;
    
    try {
      const data = await optimizedCache.getOrSet(
        cacheKey,
        async () => {
          // First, fetch connections
          const { data: connectionsData, error: connectionsError } = await supabase
            .from('connections')
            .select('id, status, created_at, requester_id, addressee_id')
            .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

          if (connectionsError) throw connectionsError;

          if (!connectionsData || connectionsData.length === 0) {
            return [];
          }

          // Get all unique user IDs from connections
          const userIds = new Set<string>();
          connectionsData.forEach(conn => {
            userIds.add(conn.requester_id);
            userIds.add(conn.addressee_id);
          });

          // Remove current user's ID
          userIds.delete(user.id);

          // Fetch profiles for all users in connections
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url, location')
            .in('id', Array.from(userIds));

          if (profilesError) {
            console.warn('Error fetching profiles:', profilesError);
          }

          // Create a map of profiles for quick lookup
          const profilesMap = new Map();
          if (profilesData) {
            profilesData.forEach(profile => {
              profilesMap.set(profile.id, profile);
            });
          }

          // Manually join the data
          return connectionsData.map(conn => {
            const otherUserId = conn.requester_id === user.id ? conn.addressee_id : conn.requester_id;
            const profile = profilesMap.get(otherUserId);
            
            return {
              ...conn,
              user: profile ? {
                id: profile.id,
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                avatar_url: profile.avatar_url || '',
                location: profile.location || ''
              } : undefined
            };
          });
        },
        3 * 60 * 1000 // 3 minutes cache
      );

      // Separate connections by status
      const accepted = data.filter(c => c.status === 'accepted');
      const pending = data.filter(c => 
        c.status === 'pending' && c.addressee_id === user.id
      );

      setConnections(accepted);
      setPendingRequests(pending);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  }, [user]);

  // Optimized connection management functions
  const acceptConnection = useCallback(async (connectionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

      if (error) throw error;

      // Invalidate cache and refresh
      optimizedCache.delete(`connections-${user.id}`);
      await fetchConnections();
    } catch (error) {
      console.error('Error accepting connection:', error);
    }
  }, [user, fetchConnections]);

  const rejectConnection = useCallback(async (connectionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId);

      if (error) throw error;

      // Invalidate cache and refresh
      optimizedCache.delete(`connections-${user.id}`);
      await fetchConnections();
    } catch (error) {
      console.error('Error rejecting connection:', error);
    }
  }, [user, fetchConnections]);

  // Initial load
  useEffect(() => {
    const loadConnections = async () => {
      setLoading(true);
      await fetchConnections();
      setLoading(false);
    };

    loadConnections();
  }, [fetchConnections]);

  // Real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('optimized-connections')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections'
        },
        () => {
          optimizedCache.delete(`connections-${user.id}`);
          fetchConnections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConnections]);

  return useMemo(() => ({
    connections,
    pendingRequests,
    loading,
    acceptConnection,
    rejectConnection,
    refetch: fetchConnections
  }), [connections, pendingRequests, loading, acceptConnection, rejectConnection, fetchConnections]);
};
