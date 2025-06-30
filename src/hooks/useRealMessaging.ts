
import { useState, useEffect, useCallback } from 'react';
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/services/realMessagingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useRealMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
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

  // Transform messages to include proper interface
  const transformedMessages = currentMessages.map(msg => ({
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
    if (!content.trim()) return;

    setSendingMessage(true);
    try {
      await sendMessageMutation.mutateAsync({
        recipientId: partnerId,
        content: content.trim()
      });

      // Refresh conversations and messages
      setTimeout(() => {
        refetchConversations();
        if (selectedPartnerId === partnerId) {
          refetchMessages();
        }
      }, 500);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  }, [sendMessageMutation, refetchConversations, refetchMessages, selectedPartnerId, toast]);

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
