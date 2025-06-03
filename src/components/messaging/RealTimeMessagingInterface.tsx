
import { useState } from 'react';
import { useRealTimeMessaging } from '@/hooks/useRealTimeMessaging';
import { useUserPresence } from '@/hooks/useUserPresence';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ConversationsList from './ConversationsList';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import ChatEmptyState from './ChatEmptyState';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RealTimeMessagingInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getUserPresence, isUserOnline } = useUserPresence();
  const {
    conversations,
    messages,
    activeConversation,
    conversationsLoading,
    messageLoading,
    conversationsError,
    messageError,
    setActiveConversation,
    sendMessage,
    refreshConversations,
    isLoading,
    hasError
  } = useRealTimeMessaging();
  
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleConversationSelect = async (partnerId: string) => {
    try {
      await setActiveConversation(partnerId);
    } catch (error) {
      toast({
        title: "Failed to load conversation",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!activeConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      await sendMessage(activeConversation, newMessage);
      setNewMessage('');
    } catch (error) {
      // Error is already handled in the hook with toast
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

  // Error state for conversations
  if (conversationsError) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Failed to load conversations</h3>
            <p className="text-gray-600 mt-1">{conversationsError}</p>
          </div>
          <Button onClick={() => refreshConversations()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className={`${activeConversation ? 'hidden md:block' : 'block'}`}>
        <ConversationsList
          conversations={conversations.map(conv => ({
            ...conv,
            isOnline: isUserOnline(conv.user_id),
            presence: getUserPresence(conv.user_id)
          }))}
          activeConversation={activeConversation}
          loading={conversationsLoading}
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
              activePartner={activePartner ? {
                ...activePartner,
                isOnline: isUserOnline(activePartner.user_id),
                presence: getUserPresence(activePartner.user_id)
              } : undefined}
              onBack={() => setActiveConversation(null)}
              showBackButton={true}
            />

            {/* Message Error State */}
            {messageError && (
              <div className="bg-red-50 border-b border-red-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">{messageError}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setActiveConversation(activeConversation)}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            <MessagesList
              messages={activeMessages}
              userId={user?.id}
              loading={messageLoading}
            />

            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
              sending={sending}
              disabled={!!messageError}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RealTimeMessagingInterface;
