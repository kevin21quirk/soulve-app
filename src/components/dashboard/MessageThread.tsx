import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, Users, Reply, X } from "lucide-react";
import { Message, Conversation } from "@/types/messaging";
import MessageReactions from "./messaging/MessageReactions";
import ConversationParticipants from "./messaging/ConversationParticipants";

interface MessageThreadProps {
  selectedConv: Conversation | undefined;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
  replyingTo: string | null;
  setReplyingTo: (messageId: string | null) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

const MessageThread = ({ 
  selectedConv, 
  messages, 
  newMessage, 
  setNewMessage, 
  onSendMessage,
  showParticipants,
  setShowParticipants,
  replyingTo,
  setReplyingTo,
  onReactToMessage
}: MessageThreadProps) => {
  if (!selectedConv) return null;

  const replyingToMessage = replyingTo ? messages.find(m => m.id === replyingTo) : null;

  return (
    <div className="lg:col-span-2 flex">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={selectedConv.avatar} />
                  <AvatarFallback>
                    {selectedConv.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {selectedConv.isActive && selectedConv.type === "direct" && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{selectedConv.name}</span>
                  {selectedConv.type === "group" && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedConv.participants?.length || 0} members
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedConv.type === "direct" 
                    ? (selectedConv.isActive ? 'Active now' : `Last seen ${selectedConv.timestamp}`)
                    : selectedConv.description || `${selectedConv.participants?.length || 0} participants`
                  }
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.replyTo && (
                <div className="text-xs text-gray-500 mb-1 ml-2">
                  Replying to: {messages.find(m => m.id === message.replyTo)?.content?.substring(0, 50)}...
                </div>
              )}
              <div
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}
              >
                <div className="max-w-xs lg:max-w-md space-y-1">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-between mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <p className="text-xs">{message.timestamp}</p>
                      {message.isOwn && message.status && (
                        <span className="text-xs">
                          {message.status === 'sent' && '✓'}
                          {message.status === 'delivered' && '✓✓'}
                          {message.status === 'read' && '✓✓'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <MessageReactions
                    reactions={message.reactions}
                    onReact={(emoji) => onReactToMessage(message.id, emoji)}
                    isOwn={message.isOwn}
                  />
                  
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    message.isOwn ? 'text-right' : 'text-left'
                  }`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(message.id)}
                      className="h-6 text-xs"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {selectedConv.isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div className="border-t p-4">
          {replyingToMessage && (
            <div className="bg-gray-50 p-2 rounded mb-2 text-sm flex items-center justify-between">
              <div>
                <span className="text-gray-600">Replying to:</span>
                <span className="ml-2">{replyingToMessage.content.substring(0, 50)}...</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <form onSubmit={onSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" variant="gradient" size="sm" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      {showParticipants && (
        <div className="ml-4">
          <ConversationParticipants
            conversation={selectedConv}
            onClose={() => setShowParticipants(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MessageThread;
