
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from './messaging/useConversations';
import { useMessages } from './messaging/useMessages';
import { useRealtimeSubscription } from './messaging/useRealtimeSubscription';
import { Message } from './messaging/types';

export const useRealTimeMessaging = () => {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const {
    conversations,
    loading: conversationsLoading,
    error: conversationsError,
    loadConversations,
    updateConversationOnNewMessage,
    markConversationAsRead
  } = useConversations(user?.id);

  const {
    messages,
    loadingStates,
    errors: messageErrors,
    loadMessages,
    sendMessage,
    addRealtimeMessage,
    markMessageAsRead
  } = useMessages(user?.id);

  // Handle new real-time messages
  const handleNewMessage = useCallback((message: Message) => {
    console.log('Handling new real-time message:', message);
    addRealtimeMessage(message);
    updateConversationOnNewMessage(message.sender_id, message.content);
  }, [addRealtimeMessage, updateConversationOnNewMessage]);

  // Handle conversation updates
  const handleConversationUpdate = useCallback(() => {
    console.log('Updating conversations due to real-time event');
    loadConversations(false); // Don't show loading spinner for background updates
  }, [loadConversations]);

  // Handle message read status updates
  const handleMessageRead = useCallback((messageId: string) => {
    console.log('Message marked as read:', messageId);
    markMessageAsRead(messageId);
  }, [markMessageAsRead]);

  // Set up real-time subscriptions
  useRealtimeSubscription({
    userId: user?.id,
    activeConversation,
    onNewMessage: handleNewMessage,
    onConversationUpdate: handleConversationUpdate,
    onMessageRead: handleMessageRead
  });

  // Load conversations on mount
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);

  // Enhanced conversation selection with proper loading and read marking
  const handleConversationSelect = useCallback(async (partnerId: string) => {
    console.log('Selecting conversation:', partnerId);
    setActiveConversation(partnerId);
    
    try {
      await loadMessages(partnerId);
      markConversationAsRead(partnerId);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }, [loadMessages, markConversationAsRead]);

  // Enhanced message sending with error handling
  const handleSendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!recipientId || !content.trim()) {
      throw new Error('Recipient and message content are required');
    }

    try {
      const sentMessage = await sendMessage(recipientId, content);
      
      // Update conversation list to reflect the new message
      updateConversationOnNewMessage(recipientId, content);
      
      return sentMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [sendMessage, updateConversationOnNewMessage]);

  return {
    // State
    conversations,
    messages,
    activeConversation,
    
    // Loading states
    conversationsLoading,
    messageLoading: activeConversation ? loadingStates[activeConversation] || false : false,
    
    // Errors
    conversationsError,
    messageError: activeConversation ? messageErrors[activeConversation] : null,
    
    // Actions
    setActiveConversation: handleConversationSelect,
    loadMessages,
    sendMessage: handleSendMessage,
    refreshConversations: () => loadConversations(true),
    
    // Utilities
    isLoading: conversationsLoading || (activeConversation ? loadingStates[activeConversation] || false : false),
    hasError: conversationsError || (activeConversation ? messageErrors[activeConversation] : null)
  };
};
