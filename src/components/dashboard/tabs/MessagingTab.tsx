
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/services/realMessagingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, MessageCircle, Plus, Search, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationCounts } from '@/hooks/useNotificationCounts';

const MessagingTab = () => {
  const { user } = useAuth();
  const { refreshCounts } = useNotificationCounts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchUsers, setSearchUsers] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  const { data: conversations = [], isLoading: conversationsLoading, refetch: refetchConversations } = useConversations();
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useMessages(selectedConversation || "");
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  // Check for userId URL parameter and automatically open that conversation
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      console.log('Opening conversation with user from URL:', userIdParam);
      setSelectedConversation(userIdParam);
      // Remove userId from URL after opening conversation
      const timer = setTimeout(() => {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.delete('userId');
          return newParams;
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  // Fetch available users for new conversations
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || !showNewConversation) return;
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .neq('id', user.id)
        .limit(20);
      
      if (!error && profiles) {
        setAvailableUsers(profiles);
      }
    };

    fetchUsers();
  }, [user, showNewConversation]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConversation && messages.length > 0 && user?.id) {
      const unreadMessageIds = messages
        .filter((msg: any) => !msg.is_read && msg.recipient_id === user.id)
        .map((msg: any) => msg.id);

      if (unreadMessageIds.length > 0) {
        console.log('Marking messages as read:', unreadMessageIds);
        markAsRead.mutate(unreadMessageIds, {
          onSuccess: () => {
            console.log('Messages marked as read successfully');
            // Force refresh after a small delay to ensure DB update propagates
            setTimeout(() => {
              refreshCounts();
              refetchConversations();
            }, 500);
          }
        });
      }
    }
  }, [selectedConversation, messages, user?.id]);

  const handleConversationSelect = async (partnerId: string) => {
    setSelectedConversation(partnerId);
    setShowNewConversation(false);
  };

  const handleStartNewConversation = (userId: string) => {
    setSelectedConversation(userId);
    setShowNewConversation(false);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    try {
      await sendMessage.mutateAsync({
        recipientId: selectedConversation,
        content: newMessage.trim()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUsers = availableUsers.filter(user => {
    const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return userName.toLowerCase().includes(searchUsers.toLowerCase());
  });

  if (conversationsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading conversations...</div>
        </CardContent>
      </Card>
    );
  }

  if (selectedConversation) {
    const conversation = conversations.find(c => c.partner_id === selectedConversation);
    const conversationMessages = messages || [];

    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={conversation?.partner_profile?.avatar_url} />
              <AvatarFallback>
                {conversation?.partner_profile?.first_name?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">
              {conversation?.partner_profile 
                ? `${conversation.partner_profile.first_name || ''} ${conversation.partner_profile.last_name || ''}`.trim() || 'New Conversation'
                : 'New Conversation'
              }
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {conversationMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
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
        </CardContent>
        
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendMessage.isPending}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">Messages</h2>
        <Button 
          onClick={() => setShowNewConversation(!showNewConversation)}
          className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      {showNewConversation ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Start New Conversation</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNewConversation(false)}
              >
                Cancel
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search people..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous';
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleStartNewConversation(user.id)}
                      className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || ''} alt={userName} />
                          <AvatarFallback>
                            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900">{userName}</h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {conversations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600">
                  Start connecting with people to begin messaging.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.partner_id}
                      onClick={() => handleConversationSelect(conversation.partner_id)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.partner_profile?.avatar_url} />
                        <AvatarFallback>
                          {conversation.partner_profile?.first_name?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.partner_profile 
                              ? `${conversation.partner_profile.first_name || ''} ${conversation.partner_profile.last_name || ''}`.trim() || 'Anonymous'
                              : 'Anonymous'
                            }
                          </h3>
                          {conversation.last_message_time && (
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conversation.last_message_time), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        {conversation.last_message && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.last_message}
                          </p>
                        )}
                      </div>
                      
                      {conversation.unread_count > 0 && (
                        <Badge className="bg-blue-600 text-white">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MessagingTab;
