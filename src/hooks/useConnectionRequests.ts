
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ConnectionRequest {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
  requester: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    location?: string;
    bio?: string;
  } | null;
  addressee: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    location?: string;
    bio?: string;
  } | null;
  mutual_connections_count?: number;
}

export const useConnectionRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateMutualConnections = useCallback(async (userId: string, otherUserId: string) => {
    try {
      // Get connections for current user
      const { data: userConnections } = await supabase
        .from('connections')
        .select('requester_id, addressee_id')
        .or(`and(requester_id.eq.${userId},status.eq.accepted),and(addressee_id.eq.${userId},status.eq.accepted)`);

      // Get connections for other user
      const { data: otherConnections } = await supabase
        .from('connections')
        .select('requester_id, addressee_id')
        .or(`and(requester_id.eq.${otherUserId},status.eq.accepted),and(addressee_id.eq.${otherUserId},status.eq.accepted)`);

      if (!userConnections || !otherConnections) return 0;

      // Extract connected user IDs
      const userConnectedIds = new Set(
        userConnections.map(conn => 
          conn.requester_id === userId ? conn.addressee_id : conn.requester_id
        )
      );

      const otherConnectedIds = new Set(
        otherConnections.map(conn => 
          conn.requester_id === otherUserId ? conn.addressee_id : conn.requester_id
        )
      );

      // Find mutual connections (excluding themselves)
      const mutualConnections = [...userConnectedIds].filter(id => 
        otherConnectedIds.has(id) && id !== userId && id !== otherUserId
      );

      return mutualConnections.length;
    } catch (error) {
      console.error('Error calculating mutual connections:', error);
      return 0;
    }
  }, []);

  const fetchConnectionRequests = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: connections, error: connectionsError } = await supabase
        .from('connections')
        .select(`
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          updated_at,
          requester:profiles!connections_requester_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            location,
            bio
          ),
          addressee:profiles!connections_addressee_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            location,
            bio
          )
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (connectionsError) throw connectionsError;

      // Calculate mutual connections for each request
      const connectionsWithMutual = await Promise.all(
        (connections || []).map(async (conn) => {
          const otherUserId = conn.requester_id === user.id ? conn.addressee_id : conn.requester_id;
          const mutualCount = await calculateMutualConnections(user.id, otherUserId);
          return { ...conn, mutual_connections_count: mutualCount };
        })
      );

      // Separate by type
      const pending = connectionsWithMutual.filter(
        conn => conn.status === 'pending' && conn.addressee_id === user.id
      );
      const sent = connectionsWithMutual.filter(
        conn => conn.status === 'pending' && conn.requester_id === user.id
      );
      const accepted = connectionsWithMutual.filter(
        conn => conn.status === 'accepted'
      );

      setPendingRequests(pending);
      setSentRequests(sent);
      setAcceptedConnections(accepted);
    } catch (error: any) {
      console.error('Error fetching connection requests:', error);
      setError(error.message || 'Failed to fetch connection requests');
    } finally {
      setLoading(false);
    }
  }, [user, calculateMutualConnections]);

  const sendConnectionRequest = useCallback(async (addresseeId: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          addressee_id: addresseeId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          recipient_id: addresseeId,
          sender_id: user.id,
          type: 'connection_request',
          title: 'New Connection Request',
          message: 'Someone wants to connect with you',
          metadata: { connection_id: data.id }
        });

      toast({
        title: "Connection request sent!",
        description: "Your request has been sent successfully.",
      });

      await fetchConnectionRequests();
      return true;
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, fetchConnectionRequests]);

  const respondToConnectionRequest = useCallback(async (connectionId: string, response: 'accepted' | 'declined') => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: response })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;

      if (response === 'accepted') {
        // Create notification for the requester
        await supabase
          .from('notifications')
          .insert({
            recipient_id: data.requester_id,
            sender_id: user.id,
            type: 'connection_accepted',
            title: 'Connection Accepted',
            message: 'Your connection request was accepted',
            metadata: { connection_id: data.id }
          });

        toast({
          title: "Connection accepted!",
          description: "You're now connected!",
        });
      } else {
        toast({
          title: "Connection declined",
          description: "Connection request declined.",
        });
      }

      await fetchConnectionRequests();
      return true;
    } catch (error: any) {
      console.error('Error responding to connection request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to respond to connection request.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, fetchConnectionRequests]);

  // Set up real-time subscription for connection updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`connection-requests-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `or(requester_id.eq.${user.id},addressee_id.eq.${user.id})`
        },
        () => {
          fetchConnectionRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConnectionRequests]);

  // Initial fetch
  useEffect(() => {
    fetchConnectionRequests();
  }, [fetchConnectionRequests]);

  return {
    pendingRequests,
    sentRequests,
    acceptedConnections,
    loading,
    error,
    sendConnectionRequest,
    respondToConnectionRequest,
    refreshRequests: fetchConnectionRequests,
    mutualConnectionsCount: calculateMutualConnections
  };
};
