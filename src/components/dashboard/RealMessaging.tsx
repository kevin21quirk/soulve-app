import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical, Phone, Video, Plus, Users } from "lucide-react";
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from "@/services/realMessagingService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import EnhancedLoadingState from "@/components/ui/EnhancedLoadingState";

export const RealMessaging = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  const { data: conversations = [], isLoading: conversationsLoading, refetch: refetchConversations } = useConversations();
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useMessages(selectedConversation || "");
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

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

  // Enable real-time updates for messages
  useEffect(() => {
    const messagesChannel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          refetchConversations();
          if (selectedConversation) {
            refetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [refetchConversations, refetchMessages, selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage.mutateAsync({
        recipientId: selectedConversation,
        content: newMessage.trim()
      });
      setNewMessage("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleConversationSelect = (partnerId: string) => {
    setSelectedConversation(partnerId);
    setShowNewConversation(false);
    
    // Mark messages as read
    const unreadMessages = messages
      .filter(msg => !msg.is_read && msg.recipient_id === user?.id)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markAsRead.mutate(unreadMessages);
    }
  };

  const handleStartNewConversation = (userId: string) => {
    setSelectedConversation(userId);
    setShowNewConversation(false);
  };

  const selectedConv = conversations.find(conv => conv.partner_id === selectedConversation);

  const filteredConversations = conversations.filter(conv => {
    const partnerName = conv.partner_profile 
      ? `${conv.partner_profile.first_name || ''} ${conv.partner_profile.last_name || ''}`.trim()
      : 'Anonymous';
    return partnerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = availableUsers.filter(user => {
    const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return userName.toLowerCase().includes(searchUsers.toLowerCase());
  });

  if (conversationsLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        <Card>
          <CardContent className="p-6">
            <EnhancedLoadingState message="Loading conversations..." />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button 
              onClick={() => setShowNewConversation(!showNewConversation)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={showNewConversation ? "Search people..." : "Search conversations..."}
              value={showNewConversation ? searchUsers : searchQuery}
              onChange={(e) => showNewConversation ? setSearchUsers(e.target.value) : setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[480px]">
            {showNewConversation ? (
              // New Conversation View
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Start New Conversation</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowNewConversation(false)}
                  >
                    Cancel
                  </Button>
                </div>
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
              </div>
            ) : (
              // Existing Conversations View
              <>
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No conversations yet.</p>
                    <p className="text-sm mt-1">Click "New" to start messaging!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => {
                      const partnerName = conversation.partner_profile 
                        ? `${conversation.partner_profile.first_name || ''} ${conversation.partner_profile.last_name || ''}`.trim() || 'Anonymous'
                        : 'Anonymous';

                      return (
                        <div
                          key={conversation.id}
                          onClick={() => handleConversationSelect(conversation.partner_id)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                            selectedConversation === conversation.partner_id
                              ? "bg-blue-50 border-l-blue-500"
                              : "border-l-transparent"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={conversation.partner_profile?.avatar_url || ''} alt={partnerName} />
                                <AvatarFallback>
                                  {partnerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.is_read === false && (
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 truncate">{partnerName}</h4>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(conversation.last_message_time), 'MMM d')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate mt-1">
                                {conversation.last_message}
                              </p>
                              {conversation.unread_count > 0 && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {conversation.unread_count} new
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Thread */}
      <div className="lg:col-span-2">
        {selectedConversation && selectedConv ? (
          <Card className="h-full flex flex-col">
            {/* Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.partner_profile?.avatar_url || ''} />
                    <AvatarFallback>
                      {(selectedConv.partner_profile?.first_name?.[0] || '') + (selectedConv.partner_profile?.last_name?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedConv.partner_profile 
                        ? `${selectedConv.partner_profile.first_name || ''} ${selectedConv.partner_profile.last_name || ''}`.trim() || 'Anonymous'
                        : 'Anonymous'
                      }
                    </h3>
                    <p className="text-sm text-gray-500">Active now</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-[400px] p-4">
                {messagesLoading ? (
                  <EnhancedLoadingState size="sm" message="Loading messages..." />
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === user?.id;
                      const senderName = message.sender_profile 
                        ? `${message.sender_profile.first_name || ''} ${message.sender_profile.last_name || ''}`.trim() || 'You'
                        : 'You';

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                            {!isOwn && (
                              <p className="text-xs text-gray-500 mb-1 px-3">{senderName}</p>
                            )}
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isOwn
                                  ? "bg-blue-600 text-white rounded-br-md"
                                  : "bg-gray-100 text-gray-900 rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                                {format(new Date(message.created_at), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={sendMessage.isPending}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={!newMessage.trim() || sendMessage.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        ) : selectedConversation && !selectedConv ? (
          // New conversation selected but no existing conversation data
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">New Conversation</h3>
                  <p className="text-sm text-gray-500">Send your first message</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Start your conversation by sending a message below!</p>
              </div>
            </CardContent>

            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your first message..."
                  className="flex-1"
                  disabled={sendMessage.isPending}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={!newMessage.trim() || sendMessage.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
