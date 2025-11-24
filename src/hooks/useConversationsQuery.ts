import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getConversations } from "@/services/messagingService";

export const useConversationsQuery = () => {
  const queryClient = useQueryClient();
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      // Debounced refetch for received messages (batches rapid updates)
      const debouncedRefetch = () => {
        if (refetchTimeoutRef.current) {
          clearTimeout(refetchTimeoutRef.current);
        }
        
        refetchTimeoutRef.current = setTimeout(() => {
          console.log('[useConversationsQuery] Debounced refetch triggered');
          queryClient.refetchQueries({
            queryKey: ['conversations'],
            type: 'active'
          });
        }, 800); // 800ms delay allows batching multiple messages
      };

      // Immediate refetch for sent messages
      const immediateRefetch = () => {
        console.log('[useConversationsQuery] Immediate refetch triggered for sent message');
        queryClient.refetchQueries({
          queryKey: ['conversations'],
          type: 'active'
        });
      };

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
          (payload) => {
            console.log('[useConversationsQuery] Received message INSERT:', payload);
            debouncedRefetch(); // Use debounced refetch for received messages
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
          (payload) => {
            console.log('[useConversationsQuery] Sent message INSERT:', payload);
            immediateRefetch(); // Immediate refetch for own messages
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
          (payload) => {
            console.log('[useConversationsQuery] Message UPDATE:', payload);
            debouncedRefetch(); // Use debounced refetch for message updates
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
          (payload) => {
            console.log('[useConversationsQuery] Conversation participant UPDATE:', payload);
            immediateRefetch(); // Immediate refetch for deletions (critical UX)
          }
        )
        .subscribe();

      return () => {
        if (refetchTimeoutRef.current) {
          clearTimeout(refetchTimeoutRef.current);
        }
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup.then(fn => fn?.());
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, [queryClient]);

  return query;
};
