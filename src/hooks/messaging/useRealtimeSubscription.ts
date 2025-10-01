
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message, DatabaseMessage } from './types';
import { convertToMessage } from './utils';

interface UseRealtimeSubscriptionProps {
  userId: string | undefined;
  activeConversation: string | null;
  onNewMessage: (message: Message) => void;
  onConversationUpdate: () => void;
  onMessageRead: (messageId: string) => void;
}

export const useRealtimeSubscription = ({
  userId,
  activeConversation,
  onNewMessage,
  onConversationUpdate,
  onMessageRead
}: UseRealtimeSubscriptionProps) => {
  const { toast } = useToast();
  const channelRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!userId) return;

    const setupRealtimeSubscription = () => {
      // Clean up existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

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
            try {
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
              onNewMessage(newMessage);
              onConversationUpdate();

              // Show notification if not in active conversation
              if (activeConversation !== newMessage.sender_id) {
                toast({
                  title: "New message",
                  description: newMessage.content.length > 50 
                    ? newMessage.content.substring(0, 50) + '...'
                    : newMessage.content,
                });
              }
            } catch (error) {
              console.error('Error processing realtime message:', error);
              toast({
                title: "Message error",
                description: "Failed to process incoming message",
                variant: "destructive"
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${userId}`
          },
          (payload) => {
            // Handle read status updates
            if (payload.new.is_read && !payload.old.is_read) {
              onMessageRead(payload.new.id);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Clear any reconnection timeout
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Real-time channel error, attempting reconnection...');
            toast({
              title: "Connection issue",
              description: "Reconnecting to live updates...",
              variant: "destructive"
            });
            
            // Attempt reconnection after 3 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
              setupRealtimeSubscription();
            }, 3000);
          }
        });

      channelRef.current = channel;
    };

    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [userId, activeConversation, onNewMessage, onConversationUpdate, onMessageRead, toast]);
};
