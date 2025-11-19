import { useState, useEffect, useCallback, useRef } from 'react';
import { useConversations, useMessages, useSendMessage } from '@/services/realMessagingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TransformedConversation {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

interface TransformedMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  is_own: boolean;
  is_read: boolean;
}

export const useRealTimeMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<Record<string, TransformedMessage[]>>({});
  
  // Fetch conversations
  const { 
    data: rawConversations = [], 
    isLoading: conversationsLoading, 
    error: conversationsError,
    refetch: refetchConversations 
  } = useConversations();
  
  // Fetch messages for active conversation
  const { 
    data: rawMessages = [], 
    isLoading: messageLoading, 
    error: messageError,
    refetch: refetchMessages 
  } = useMessages(activeConversation || '');
  
  const sendMessageMutation = useSendMessage();

  // Transform conversations data
  const conversations: TransformedConversation[] = rawConversations.map(conv => ({
    user_id: conv.partner_id,
    user_name: conv.partner_profile ? 
      `${conv.partner_profile.first_name || ''} ${conv.partner_profile.last_name || ''}`.trim() || 'Unknown User' : 
      'Unknown User',
    avatar_url: conv.partner_profile?.avatar_url,
    last_message: conv.last_message,
    last_message_time: conv.last_message_time,
    unread_count: conv.unread_count || 0
  }));

  // Transform messages data and merge with optimistic messages
  const transformedRealMessages = rawMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    created_at: msg.created_at,
    sender_id: msg.sender_id,
    is_own: msg.sender_id === user?.id,
    is_read: msg.is_read
  }));

  const messages: Record<string, TransformedMessage[]> = {
    [activeConversation || '']: [
      ...transformedRealMessages,
      ...(optimisticMessages[activeConversation || ''] || [])
    ]
  };

  const refreshConversations = useCallback(async () => {
    try {
      await refetchConversations();
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  }, [refetchConversations]);

  const sendMessage = useCallback(async (partnerId: string, content: string) => {
    if (!content.trim() || !user?.id) return;

    const trimmedContent = content.trim();
    const tempId = `temp-${Date.now()}`;
    
    // Create optimistic message
    const optimisticMessage: TransformedMessage = {
      id: tempId,
      content: trimmedContent,
      created_at: new Date().toISOString(),
      sender_id: user.id,
      is_own: true,
      is_read: false
    };

    // Add optimistic message immediately
    setOptimisticMessages(prev => ({
      ...prev,
      [partnerId]: [...(prev[partnerId] || []), optimisticMessage]
    }));

    // Send to database in background
    sendMessageMutation.mutateAsync({
      recipientId: partnerId,
      content: trimmedContent
    }).then(() => {
      // Remove optimistic message and refresh to get real one
      setOptimisticMessages(prev => ({
        ...prev,
        [partnerId]: (prev[partnerId] || []).filter(msg => msg.id !== tempId)
      }));
      refetchMessages();
      refreshConversations();
    }).catch((error: any) => {
      console.error('Error sending message:', error);
      
      // Remove optimistic message on error
      setOptimisticMessages(prev => ({
        ...prev,
        [partnerId]: (prev[partnerId] || []).filter(msg => msg.id !== tempId)
      }));
      
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    });
  }, [sendMessageMutation, refreshConversations, refetchMessages, toast, user?.id]);

  const isLoading = useCallback((partnerId?: string, action?: string) => {
    return sendMessageMutation.isPending;
  }, [sendMessageMutation.isPending]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          // Refresh conversations and messages when new message arrives
          refetchConversations();
          if (activeConversation) {
            refetchMessages();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}`
        },
        () => {
          // Refresh conversations when user sends a message
          refetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, activeConversation, refetchConversations, refetchMessages]);

  const hasError = conversationsError || messageError;

  return {
    conversations,
    messages,
    activeConversation,
    conversationsLoading,
    messageLoading,
    conversationsError: conversationsError?.message,
    messageError: messageError?.message,
    setActiveConversation,
    sendMessage,
    refreshConversations,
    isLoading,
    hasError: !!hasError
  };
};
