import { useState, useEffect, useCallback, useMemo } from 'react';
import { useConversations, useMessages, useSendMessage } from '@/services/realMessagingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

  // Transform messages data - memoized to prevent unnecessary re-renders
  const messages = useMemo(() => {
    console.log('[useRealTimeMessaging] Transforming messages, count:', rawMessages.length);
    const transformed: Record<string, TransformedMessage[]> = {};
    
    if (activeConversation) {
      transformed[activeConversation] = rawMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        sender_id: msg.sender_id,
        is_own: msg.sender_id === user?.id,
        is_read: msg.is_read
      }));
    }
    
    return transformed;
  }, [rawMessages, activeConversation, user?.id]);

  const refreshConversations = useCallback(async () => {
    try {
      await refetchConversations();
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  }, [refetchConversations]);

  const sendMessage = useCallback(async (partnerId: string, content: string) => {
    if (!content.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        recipientId: partnerId,
        content: content.trim()
      });
      // Optimistic updates and real-time subscriptions handle cache updates
      // No manual refetch needed
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      throw error; // Re-throw for component handling
    }
  }, [sendMessageMutation, toast]);

  const isLoading = useCallback((partnerId?: string, action?: string) => {
    return sendMessageMutation.isPending;
  }, [sendMessageMutation.isPending]);

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
