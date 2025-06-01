
import { useState } from 'react';
import { useRealTimeMessaging } from '@/hooks/useRealTimeMessaging';
import { useAuth } from '@/contexts/AuthContext';
import ConversationsList from './ConversationsList';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import ChatEmptyState from './ChatEmptyState';

const RealTimeMessagingInterface = () => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    loading,
    loadMessages,
    sendMessage
  } = useRealTimeMessaging();
  
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleConversationSelect = async (partnerId: string) => {
    setActiveConversation(partnerId);
    await loadMessages(partnerId);
  };

  const handleSendMessage = async () => {
    if (!activeConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      await sendMessage(activeConversation, newMessage);
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeMessages = activeConversation ? messages[activeConversation] || [] : [];
  const activePartner = conversations.find(c => c.user_id === activeConversation);

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className={`${activeConversation ? 'hidden md:block' : 'block'}`}>
        <ConversationsList
          conversations={conversations}
          activeConversation={activeConversation}
          loading={loading}
          onConversationSelect={handleConversationSelect}
        />
      </div>

      {/* Chat Area */}
      <div className={`${activeConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
        {!activeConversation ? (
          <ChatEmptyState />
        ) : (
          <>
            <ChatHeader
              activePartner={activePartner}
              onBack={() => setActiveConversation(null)}
              showBackButton={true}
            />

            <MessagesList
              messages={activeMessages}
              userId={user?.id}
            />

            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
              sending={sending}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RealTimeMessagingInterface;
