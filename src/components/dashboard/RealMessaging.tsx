import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MoreVertical, Phone, Video, Plus, Users } from "lucide-react";
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from "@/services/realMessagingService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import EnhancedLoadingState from "@/components/ui/EnhancedLoadingState";
import MessageInput from "@/components/messaging/MessageInput";
import MessagesList from "@/components/messaging/MessagesList";
import { useNavigate } from "react-router-dom";

export const RealMessaging = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleSendMessage = async (content: string, attachment?: any) => {
    if (!selectedConversation) return;

    try {
      await sendMessage.mutateAsync({
        recipientId: selectedConversation,
        content: content,
        attachment: attachment
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
    <div className="flex h-[calc(100vh-200px)] bg-background rounded-lg overflow-hidden border">
      {/* Conversations Sidebar */}
      <div className="w-[360px] border-r flex flex-col bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold">Chats</h2>
            <Button 
              onClick={() => setShowNewConversation(!showNewConversation)}
              size="sm"
              variant="ghost"
              className="rounded-full h-9 w-9 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={showNewConversation ? "Search people..." : "Search conversations..."}
              value={showNewConversation ? searchUsers : searchQuery}
              onChange={(e) => showNewConversation ? setSearchUsers(e.target.value) : setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-0 rounded-full"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
            {showNewConversation ? (
              // New Conversation View
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="font-semibold text-sm">New Message</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowNewConversation(false)}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 px-4">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredUsers.map((user) => {
                      const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous';
                      return (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar 
                              className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              <AvatarImage src={user.avatar_url || ''} alt={userName} />
                              <AvatarFallback>
                                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 cursor-pointer" onClick={() => handleStartNewConversation(user.id)}>
                              <h4 
                                className="font-medium hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/profile/${user.id}`);
                                }}
                              >
                                {userName}
                              </h4>
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
                  <div className="p-6 text-center text-muted-foreground">
                    <p>No conversations yet.</p>
                    <p className="text-sm mt-1">Click + to start messaging!</p>
                  </div>
                ) : (
                  <div>
                    {filteredConversations.map((conversation) => {
                      const partnerName = conversation.partner_profile 
                        ? `${conversation.partner_profile.first_name || ''} ${conversation.partner_profile.last_name || ''}`.trim() || 'Anonymous'
                        : 'Anonymous';

                      return (
                        <div
                          key={conversation.id}
                          onClick={() => handleConversationSelect(conversation.partner_id)}
                          className={`px-3 py-3 cursor-pointer transition-colors ${
                            selectedConversation === conversation.partner_id
                              ? "bg-muted"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar 
                                className="h-14 w-14 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/profile/${conversation.partner_id}`);
                                }}
                              >
                                <AvatarImage src={conversation.partner_profile?.avatar_url || ''} alt={partnerName} />
                                <AvatarFallback className="text-lg">
                                  {partnerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.is_read === false && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-card"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 
                                  className="font-semibold truncate hover:underline cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/profile/${conversation.partner_id}`);
                                  }}
                                >
                                  {partnerName}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(conversation.last_message_time), 'MMM d')}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className={`text-sm truncate ${
                                  conversation.unread_count > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {conversation.last_message}
                                </p>
                                {conversation.unread_count > 0 && (
                                  <div className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    {conversation.unread_count}
                                  </div>
                                )}
                              </div>
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
        </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col bg-card">
        {selectedConversation && selectedConv ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/profile/${selectedConv.partner_id}`)}
                >
                  <AvatarImage src={selectedConv.partner_profile?.avatar_url || ''} />
                  <AvatarFallback>
                    {(selectedConv.partner_profile?.first_name?.[0] || '') + (selectedConv.partner_profile?.last_name?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile/${selectedConv.partner_id}`)}
                  >
                    {selectedConv.partner_profile 
                      ? `${selectedConv.partner_profile.first_name || ''} ${selectedConv.partner_profile.last_name || ''}`.trim() || 'Anonymous'
                      : 'Anonymous'
                    }
                  </h3>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                  <Phone className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                  <Video className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                  <MoreVertical className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <MessagesList 
                messages={messages}
                userId={user?.id}
                loading={messagesLoading}
              />
            </div>

            {/* Message Input */}
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              sending={sendMessage.isPending}
              partnerId={selectedConversation}
            />
          </>
        ) : selectedConversation && !selectedConv ? (
          // New conversation selected but no existing conversation data
          <>
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">New Conversation</h3>
                  <p className="text-xs text-muted-foreground">Send your first message</p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Start your conversation by sending a message below!</p>
            </div>

            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              sending={sendMessage.isPending}
              partnerId={selectedConversation}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
