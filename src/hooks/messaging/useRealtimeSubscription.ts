
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message, DatabaseMessage } from './types';
import { convertToMessage } from './utils';

interface UseRealtimeSubscriptionProps {
  userId: string | undefined;
  activeConversation: string | null;
  onNewMessage: (message: Message) => void;
  onConversationUpdate: () => void;
}

export const useRealtimeSubscription = ({
  userId,
  activeConversation,
  onNewMessage,
  onConversationUpdate
}: UseRealtimeSubscriptionProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    console.log('Setting up real-time subscription for user:', userId);

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`
        },
        (payload) => {
          console.log('Received new message via realtime:', payload);
          
          // Ensure payload.new has all required DatabaseMessage properties
          const dbMessage: DatabaseMessage = {
            id: payload.new.id,
            content: payload.new.content,
            sender_id: payload.new.sender_id,
            recipient_id: payload.new.recipient_id,
            created_at: payload.new.created_at,
            is_read: payload.new.is_read,
            message_type: payload.new.message_type,
            file_url: payload.new.file_url || null,
            file_name: payload.new.file_name || null
          };
          
          const newMessage = convertToMessage(dbMessage);
          
          // Add to conversation messages
          onNewMessage(newMessage);

          // Update conversations list
          onConversationUpdate();

          // Show notification if not in active conversation
          if (activeConversation !== newMessage.sender_id) {
            toast({
              title: "New message",
              description: newMessage.content,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, activeConversation, onNewMessage, onConversationUpdate, toast]);
};
