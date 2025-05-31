
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle } from "lucide-react";
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from "@/services/realMessagingService";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isToday, isYesterday } from "date-fns";

export const RealMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConversation || '');
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    await sendMessage.mutateAsync({
      recipientId: selectedConversation,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MM/dd');
    }
  };

  const getProfileName = (profile: any) => {
    if (!profile) return 'Unknown User';
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
  };

  const getInitials = (profile: any) => {
    if (!profile) return 'UN';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'AN';
  };

  if (conversationsLoading) {
    return (
      <div className="h-[600px] flex">
        <div className="w-1/3 border-r">
          <Skeleton className="h-full" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-background">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Messages</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.partner_id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation === conversation.partner_id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.partner_id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conversation.partner_profile?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {getInitials(conversation.partner_profile)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {getProfileName(conversation.partner_profile)}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(conversation.last_message_time)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message}
                      </p>
                    </div>
                    {!conversation.is_read && (
                      <Badge className="h-5 w-5 rounded-full p-0 text-xs" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start connecting with people to begin messaging!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages Header */}
            <div className="p-4 border-b bg-background">
              {conversations && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={conversations.find(c => c.partner_id === selectedConversation)?.partner_profile?.avatar_url} 
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(conversations.find(c => c.partner_id === selectedConversation)?.partner_profile)}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-medium">
                    {getProfileName(conversations.find(c => c.partner_id === selectedConversation)?.partner_profile)}
                  </h4>
                </div>
              )}
            </div>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-3/4" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages && messages.length > 0 ? (
                    messages.map((message: any) => {
                      const isOwn = message.sender_id !== selectedConversation;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={message.sender_profile?.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {getInitials(message.sender_profile)}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`p-3 rounded-lg ${
                                isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <span className={`text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {formatMessageTime(message.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim() || sendMessage.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
