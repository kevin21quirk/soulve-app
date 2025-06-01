
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message } from './types';
import { convertToMessage } from './utils';

export const useMessages = (userId: string | undefined) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});

  const loadMessages = useCallback(async (partnerId: string) => {
    if (!userId) return;

    try {
      console.log('Loading messages between:', userId, 'and', partnerId);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversation messages:', error);
        throw error;
      }

      console.log('Loaded messages for conversation:', data);
      
      // Convert database messages to our Message interface
      const convertedMessages = (data || []).map(convertToMessage);
      
      setMessages(prev => ({
        ...prev,
        [partnerId]: convertedMessages
      }));

      // Mark messages as read
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', partnerId)
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (updateError) {
        console.error('Error marking messages as read:', updateError);
      }

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [userId]);

  const sendMessage = useCallback(async (recipientId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    if (!userId || !content.trim()) return;

    try {
      console.log('Sending message from', userId, 'to', recipientId, ':', content);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          recipient_id: recipientId,
          content: content.trim(),
          message_type: messageType,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting message:', error);
        throw error;
      }

      console.log('Message sent successfully:', data);

      // Convert and update local state immediately for optimistic UI
      const convertedMessage = convertToMessage(data);
      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), convertedMessage]
      }));

      return convertedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [userId, toast]);

  const addRealtimeMessage = useCallback((newMessage: Message) => {
    setMessages(prev => ({
      ...prev,
      [newMessage.sender_id]: [...(prev[newMessage.sender_id] || []), newMessage]
    }));
  }, []);

  return {
    messages,
    loadMessages,
    sendMessage,
    addRealtimeMessage
  };
};
