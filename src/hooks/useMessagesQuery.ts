import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMessages, subscribeToMessages, markAsRead } from "@/services/messagingService";
import { UnifiedMessage } from "@/types/unified-messaging";

export const useMessagesQuery = (partnerId: string | null) => {
  const queryClient = useQueryClient();

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const query = useQuery({
    queryKey: ['messages', partnerId],
    queryFn: async () => {
      const user = await getUser();
      if (!user || !partnerId) return [];
      return getMessages(partnerId, user.id);
    },
    enabled: !!partnerId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!partnerId) return;

    const setupSubscription = async () => {
      const user = await getUser();
      if (!user) return;

      const channel = subscribeToMessages(user.id, (newMessage) => {
        // Only add if it's from the current conversation partner
        if (newMessage.sender_id === partnerId) {
          queryClient.setQueryData<UnifiedMessage[]>(
            ['messages', partnerId],
            (old = []) => {
              return [...old, {
                ...newMessage,
                isOwn: false,
                status: 'sent',
              }];
            }
          );

          // Mark as read
          markAsRead([newMessage.id]);
          
          // Refetch conversations to update unread count
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [partnerId, queryClient]);

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (!query.data || !partnerId) return;

    const unreadMessages = query.data
      .filter(msg => !msg.isOwn && !msg.is_read)
      .map(msg => msg.id);

    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  }, [query.data, partnerId, queryClient]);

  return query;
};
