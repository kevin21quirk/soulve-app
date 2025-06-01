
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from './messaging/useConversations';
import { useMessages } from './messaging/useMessages';
import { useRealtimeSubscription } from './messaging/useRealtimeSubscription';

export const useRealTimeMessaging = () => {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const {
    conversations,
    loading,
    loadConversations
  } = useConversations(user?.id);

  const {
    messages,
    loadMessages,
    sendMessage,
    addRealtimeMessage
  } = useMessages(user?.id);

  useRealtimeSubscription({
    userId: user?.id,
    activeConversation,
    onNewMessage: addRealtimeMessage,
    onConversationUpdate: loadConversations
  });

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    loading,
    loadMessages,
    sendMessage,
    refreshConversations: loadConversations
  };
};
