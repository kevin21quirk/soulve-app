
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface DatabaseConnection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
}

// Hook to get user's connections
export const useRealConnections = () => {
  return useQuery({
    queryKey: ['real-connections'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: connections, error } = await supabase
        .from('connections')
        .select(`
          *,
          requester:profiles!connections_requester_id_fkey(id, first_name, last_name, avatar_url, location, bio, skills),
          addressee:profiles!connections_addressee_id_fkey(id, first_name, last_name, avatar_url, location, bio, skills)
        `)
        .or(`requester_id.eq.${user.user.id},addressee_id.eq.${user.user.id}`);

      if (error) throw error;
      return connections || [];
    },
  });
};

// Hook to send connection request
export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (addresseeId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.user.id,
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
          sender_id: user.user.id,
          type: 'connection_request',
          title: 'New Connection Request',
          message: 'Someone wants to connect with you',
          metadata: { connection_id: data.id }
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-connections'] });
      toast({
        title: "Connection request sent!",
        description: "Your request has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
    },
  });
};

// Hook to respond to connection request
export const useRespondToConnection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ connectionId, status }: { connectionId: string; status: 'accepted' | 'declined' }) => {
      const { data, error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;

      if (status === 'accepted') {
        // Create notification for the requester
        await supabase
          .from('notifications')
          .insert({
            recipient_id: data.requester_id,
            sender_id: data.addressee_id,
            type: 'connection_accepted',
            title: 'Connection Accepted',
            message: 'Your connection request was accepted',
            metadata: { connection_id: data.id }
          });

        // Create activity for both users
        await Promise.all([
          supabase.from('user_activities').insert({
            user_id: data.requester_id,
            activity_type: 'connection_accepted',
            title: 'Connection Accepted',
            description: 'You are now connected with a new person',
            metadata: { connection_id: data.id }
          }),
          supabase.from('user_activities').insert({
            user_id: data.addressee_id,
            activity_type: 'connection_accepted',
            title: 'Connection Accepted',
            description: 'You accepted a connection request',
            metadata: { connection_id: data.id }
          })
        ]);
      }

      return data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['real-connections'] });
      toast({
        title: status === 'accepted' ? "Connection accepted!" : "Connection declined",
        description: status === 'accepted' ? "You're now connected!" : "Connection request declined.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to respond to connection request.",
        variant: "destructive",
      });
    },
  });
};

// Hook to get suggested connections (users not yet connected)
export const useSuggestedConnections = () => {
  return useQuery({
    queryKey: ['suggested-connections'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get all user IDs that the current user is already connected to or has pending requests with
      const { data: existingConnections } = await supabase
        .from('connections')
        .select('requester_id, addressee_id')
        .or(`requester_id.eq.${user.user.id},addressee_id.eq.${user.user.id}`);

      const connectedUserIds = new Set([
        user.user.id, // Exclude self
        ...(existingConnections || []).flatMap(conn => [conn.requester_id, conn.addressee_id])
      ]);

      // Get profiles not in the connected users list
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, location, bio, skills, interests')
        .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)
        .limit(10);

      if (error) throw error;
      return profiles || [];
    },
  });
};
