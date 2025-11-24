import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMessages, subscribeToMessages, markAsRead, markAsDelivered } from "@/services/messagingService";
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

  // Real-time subscription for new messages
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
                status: 'delivered' as const, // Mark as delivered immediately
              }];
            }
          );

          // Mark as delivered in database (sender will get notified via real-time)
          markAsDelivered([newMessage.id]);

          // If conversation is open and window has focus, also mark as read
          if (document.hasFocus()) {
            markAsRead([newMessage.id]);
          }
          
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

  // Real-time subscription for message status updates (delivered/read)
  useEffect(() => {
    if (!partnerId) return;

    const setupStatusSubscription = async () => {
      const user = await getUser();
      if (!user) return;

      const channel = supabase
        .channel('messages-status-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${user.id}`, // Listen to updates on MY sent messages
          },
          (payload) => {
            const updatedMessage = payload.new as any;
            
            // Only update if it's for the current conversation
            if (updatedMessage.recipient_id !== partnerId) return;
            
            // Update message status in cache
            queryClient.setQueryData<UnifiedMessage[]>(
              ['messages', partnerId],
              (old = []) => {
                return old.map(msg => 
                  msg.id === updatedMessage.id
                    ? {
                        ...msg,
                        is_read: updatedMessage.is_read,
                        delivered_at: updatedMessage.delivered_at,
                        read_at: updatedMessage.read_at,
                        status: (
                          updatedMessage.read_at ? 'read' : 
                          updatedMessage.delivered_at ? 'delivered' : 
                          'sent'
                        ) as 'read' | 'delivered' | 'sent'
                      }
                    : msg
                );
              }
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupStatusSubscription();
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
