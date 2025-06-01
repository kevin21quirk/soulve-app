
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ConnectionStatus {
  status: 'none' | 'pending_sent' | 'pending_received' | 'connected';
  connectionId?: string;
}

export const useConnectionStatus = (targetUserId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'none' });
  const [loading, setLoading] = useState(false);

  const checkConnectionStatus = useCallback(async () => {
    if (!user || !targetUserId || user.id === targetUserId) return;

    try {
      const { data: connection, error } = await supabase
        .from('connections')
        .select('id, status, requester_id, addressee_id')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},addressee_id.eq.${user.id})`)
        .maybeSingle();

      if (error) {
        console.error('Error checking connection status:', error);
        return;
      }

      if (!connection) {
        setConnectionStatus({ status: 'none' });
      } else {
        const status = connection.status === 'accepted' ? 'connected' :
                      connection.requester_id === user.id ? 'pending_sent' : 'pending_received';
        setConnectionStatus({ 
          status: status as ConnectionStatus['status'], 
          connectionId: connection.id 
        });
      }
    } catch (error) {
      console.error('Error in checkConnectionStatus:', error);
    }
  }, [user, targetUserId]);

  const sendConnectionRequest = useCallback(async () => {
    if (!user || !targetUserId || loading) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          addressee_id: targetUserId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          recipient_id: targetUserId,
          sender_id: user.id,
          type: 'connection_request',
          title: 'New Connection Request',
          message: 'Someone wants to connect with you',
          metadata: { connection_id: data.id }
        });

      setConnectionStatus({ status: 'pending_sent', connectionId: data.id });
      toast({
        title: "Connection request sent!",
        description: "Your request has been sent successfully.",
      });
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, targetUserId, loading, toast]);

  const respondToConnection = useCallback(async (response: 'accepted' | 'declined') => {
    if (!connectionStatus.connectionId || loading) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: response })
        .eq('id', connectionStatus.connectionId)
        .select()
        .single();

      if (error) throw error;

      if (response === 'accepted') {
        setConnectionStatus({ status: 'connected', connectionId: data.id });
        
        // Create acceptance notification
        await supabase
          .from('notifications')
          .insert({
            recipient_id: data.requester_id,
            sender_id: user?.id,
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
        setConnectionStatus({ status: 'none' });
        toast({
          title: "Connection declined",
          description: "Connection request declined.",
        });
      }
    } catch (error: any) {
      console.error('Error responding to connection:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to respond to connection request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [connectionStatus.connectionId, loading, toast, user]);

  // Set up real-time subscription for connection changes
  useEffect(() => {
    if (!user || !targetUserId) return;

    const channel = supabase
      .channel(`connection-status-${user.id}-${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `or(and(requester_id.eq.${user.id},addressee_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},addressee_id.eq.${user.id}))`
        },
        () => {
          // Refresh connection status when changes occur
          checkConnectionStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, targetUserId, checkConnectionStatus]);

  // Initial status check
  useEffect(() => {
    checkConnectionStatus();
  }, [checkConnectionStatus]);

  return {
    connectionStatus: connectionStatus.status,
    connectionId: connectionStatus.connectionId,
    loading,
    sendConnectionRequest,
    respondToConnection,
    refreshStatus: checkConnectionStatus
  };
};
