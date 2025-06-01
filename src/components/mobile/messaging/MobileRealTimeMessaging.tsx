
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useRealTimeMessaging } from '@/hooks/useRealTimeMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const MobileRealTimeMessaging = () => {
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

  const activeMessages = activeConversation ? messages[activeConversation] || [] : [];
  const activePartner = conversations.find(c => c.user_id === activeConversation);

  if (activeConversation) {
    // Chat view
    return (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveConversation(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src={activePartner?.avatar_url} alt={activePartner?.user_name} />
            <AvatarFallback>
              {activePartner?.user_name.split(' ').map(n => n[0]).join('') || '?'}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-semibold">{activePartner?.user_name}</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.sender_id === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations list view
  return (
    <div className="h-screen bg-gray-50">
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Messages
        </h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No conversations yet</p>
            <p className="text-sm">Start connecting with people!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.user_id}
                onClick={() => handleConversationSelect(conversation.user_id)}
                className="bg-white p-4 rounded-lg border active:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar_url} alt={conversation.user_name} />
                    <AvatarFallback>
                      {conversation.user_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.user_name}</p>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileRealTimeMessaging;
