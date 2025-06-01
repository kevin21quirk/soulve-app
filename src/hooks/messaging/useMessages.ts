
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message } from './types';
import { convertToMessage } from './utils';

export const useMessages = (userId: string | undefined) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
  const [loadingStates, setLoadingStates] = useState<{ [conversationId: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [conversationId: string]: string | null }>({});
  const loadingRef = useRef<{ [conversationId: string]: boolean }>({});

  const setConversationLoading = (partnerId: string, loading: boolean) => {
    loadingRef.current[partnerId] = loading;
    setLoadingStates(prev => ({ ...prev, [partnerId]: loading }));
  };

  const setConversationError = (partnerId: string, error: string | null) => {
    setErrors(prev => ({ ...prev, [partnerId]: error }));
  };

  const loadMessages = useCallback(async (partnerId: string, forceReload = false) => {
    if (!userId) return;

    // Prevent duplicate loading requests
    if (loadingRef.current[partnerId] && !forceReload) {
      console.log('Already loading messages for:', partnerId);
      return;
    }

    // Return cached messages if available and not force reloading
    if (!forceReload && messages[partnerId]?.length > 0) {
      console.log('Using cached messages for:', partnerId);
      return;
    }

    setConversationLoading(partnerId, true);
    setConversationError(partnerId, null);

    try {
      console.log('Loading messages between:', userId, 'and', partnerId);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversation messages:', error);
        throw new Error(`Failed to load messages: ${error.message}`);
      }

      console.log('Loaded messages for conversation:', data?.length || 0);
      
      // Convert database messages to our Message interface
      const convertedMessages = (data || []).map(msg => convertToMessage(msg));
      
      setMessages(prev => ({
        ...prev,
        [partnerId]: convertedMessages
      }));

      // Mark messages as read if they're from the partner
      const unreadMessages = (data || [])
        .filter(msg => msg.sender_id === partnerId && msg.recipient_id === userId && !msg.is_read)
        .map(msg => msg.id);

      if (unreadMessages.length > 0) {
        console.log('Marking messages as read:', unreadMessages.length);
        const { error: updateError } = await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages);

        if (updateError) {
          console.error('Error marking messages as read:', updateError);
        }
      }

    } catch (error: any) {
      console.error('Error loading messages:', error);
      setConversationError(partnerId, error.message || 'Failed to load messages');
      toast({
        title: "Failed to load messages",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setConversationLoading(partnerId, false);
    }
  }, [userId, messages, toast]);

  const sendMessage = useCallback(async (recipientId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    if (!userId || !content.trim()) return;

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      sender_id: userId,
      recipient_id: recipientId,
      created_at: new Date().toISOString(),
      is_read: false,
      message_type: messageType
    };

    setMessages(prev => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), optimisticMessage]
    }));

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
        throw new Error(`Failed to send message: ${error.message}`);
      }

      console.log('Message sent successfully:', data);

      // Replace optimistic message with real one
      const convertedMessage = convertToMessage(data);
      setMessages(prev => ({
        ...prev,
        [recipientId]: prev[recipientId].map(msg => 
          msg.id === optimisticMessage.id ? convertedMessage : msg
        )
      }));

      return convertedMessage;
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Remove failed optimistic message
      setMessages(prev => ({
        ...prev,
        [recipientId]: prev[recipientId].filter(msg => msg.id !== optimisticMessage.id)
      }));

      toast({
        title: "Failed to send message",
        description: error.message || "Please check your connection and try again",
        variant: "destructive"
      });
      throw error;
    }
  }, [userId, toast]);

  const addRealtimeMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      const conversationId = newMessage.sender_id;
      const existingMessages = prev[conversationId] || [];
      
      // Check if message already exists (prevent duplicates)
      if (existingMessages.some(msg => msg.id === newMessage.id)) {
        return prev;
      }

      return {
        ...prev,
        [conversationId]: [...existingMessages, newMessage]
      };
    });
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(conversationId => {
        updated[conversationId] = updated[conversationId].map(msg =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        );
      });
      return updated;
    });
  }, []);

  return {
    messages,
    loadingStates,
    errors,
    loadMessages,
    sendMessage,
    addRealtimeMessage,
    markMessageAsRead
  };
};
