import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getConversations } from "@/services/messagingService";

export const useConversationsQuery = () => {
  const queryClient = useQueryClient();

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const user = await getUser();
      if (!user) throw new Error('Not authenticated');
      return getConversations(user.id);
    },
    refetchOnMount: true,
    refetchInterval: 60000, // Backup polling (real-time handles most updates)
  });

  // Real-time subscription for instant conversation list updates
  useEffect(() => {
    const setupSubscription = async () => {
      const user = await getUser();
      if (!user) return;

      const channel = supabase
        .channel('conversations-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversation_participants',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [queryClient]);

  return query;
};
