
import { useState, useEffect, useCallback } from 'react';
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/services/realMessagingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useRealMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);
  
  // Fetch conversations with error handling
  const { 
    data: conversations = [], 
    isLoading: conversationsLoading, 
    error: conversationsError,
    refetch: refetchConversations 
  } = useConversations();
  
  // Fetch messages for selected partner with error handling
  const { 
    data: currentMessages = [], 
    isLoading: messagesLoading, 
    error: messagesError,
    refetch: refetchMessages 
  } = useMessages(selectedPartnerId || '');
  
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  // Transform conversations to include proper interface
  const transformedConversations = conversations.map(conv => ({
    id: conv.partner_id,
    partner_id: conv.partner_id,
    partner_name: conv.partner_profile ? 
      `${conv.partner_profile.first_name || ''} ${conv.partner_profile.last_name || ''}`.trim() || 'Unknown User' : 
      'Unknown User',
    partner_avatar: conv.partner_profile?.avatar_url || '',
    last_message: conv.last_message || '',
    last_message_time: conv.last_message_time || new Date().toISOString(),
    unread_count: conv.unread_count || 0,
    is_read: conv.is_read || false
  }));

  // Transform messages to include proper interface and merge with optimistic
  const transformedRealMessages = currentMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    created_at: msg.created_at,
    sender_id: msg.sender_id,
    recipient_id: msg.recipient_id,
    is_own: msg.sender_id === user?.id,
    sender_name: msg.sender_profile ? 
      `${msg.sender_profile.first_name || ''} ${msg.sender_profile.last_name || ''}`.trim() || 'Unknown User' : 
      'Unknown User',
    message_type: msg.message_type || 'text',
    file_url: msg.file_url,
    file_name: msg.file_name,
    is_read: msg.is_read
  }));

  const transformedMessages = [...transformedRealMessages, ...optimisticMessages];

  const fetchMessages = useCallback(async (partnerId: string) => {
    try {
      setSelectedPartnerId(partnerId);
      
      // Mark messages as read when viewing conversation
      const unreadMessages = transformedMessages
        .filter(msg => !msg.is_read && !msg.is_own)
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        await markAsReadMutation.mutateAsync(unreadMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load messages",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [transformedMessages, markAsReadMutation, toast]);

  const sendMessage = useCallback(async (partnerId: string, content: string) => {
    if (!content.trim() || !user?.id) return;

    const trimmedContent = content.trim();
    const tempId = `temp-${Date.now()}`;
    
    // Create optimistic message
    const optimisticMessage = {
      id: tempId,
      content: trimmedContent,
      created_at: new Date().toISOString(),
      sender_id: user.id,
      recipient_id: partnerId,
      is_own: true,
      sender_name: 'You',
      message_type: 'text' as const,
      is_read: false
    };

    // Add optimistic message immediately
    setOptimisticMessages(prev => [...prev, optimisticMessage]);

    // Send to database in background
    sendMessageMutation.mutateAsync({
      recipientId: partnerId,
      content: trimmedContent
    }).then(() => {
      // Remove optimistic message and refresh to get real one
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== tempId));
      refetchMessages();
      refetchConversations();
    }).catch((error: any) => {
      console.error('Error sending message:', error);
      
      // Remove optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    });
  }, [sendMessageMutation, refetchConversations, refetchMessages, toast, user?.id]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('messages-mobile-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          refetchConversations();
          if (selectedPartnerId) {
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
          refetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, selectedPartnerId, refetchConversations, refetchMessages]);

  return {
    conversations: transformedConversations,
    messages: transformedMessages,
    loading: conversationsLoading || messagesLoading,
    sendingMessage,
    conversationsError: conversationsError?.message,
    messagesError: messagesError?.message,
    selectedPartnerId,
    fetchMessages,
    sendMessage,
    refreshConversations: refetchConversations,
    refreshMessages: refetchMessages
  };
};
