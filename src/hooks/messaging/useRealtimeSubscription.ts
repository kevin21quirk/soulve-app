
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message } from './types';
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
          const newMessage = convertToMessage(payload.new);
          
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
