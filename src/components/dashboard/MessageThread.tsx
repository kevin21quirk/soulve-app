
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Users, 
  Reply, 
  Edit,
  Trash2,
  Forward,
  Pin,
  MessageSquare,
  Copy
} from "lucide-react";
import { Message, Conversation } from "@/types/messaging";
import MessageReactions from "./messaging/MessageReactions";
import ConversationParticipants from "./messaging/ConversationParticipants";
import EnhancedMessageInput from "./messaging/EnhancedMessageInput";

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
  replyingToMessage?: Message;
  editingMessage: string | null;
  setEditingMessage: (messageId: string | null) => void;
  isRecording: boolean;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onForwardMessage: (messageId: string, conversationIds: string[]) => void;
  onPinMessage: (messageId: string) => void;
  onCreateThread: (messageId: string) => void;
  onVoiceRecording: (start: boolean) => void;
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
  replyingToMessage,
  editingMessage,
  setEditingMessage,
  isRecording,
  onReactToMessage,
  onEditMessage,
  onDeleteMessage,
  onForwardMessage,
  onPinMessage,
  onCreateThread,
  onVoiceRecording
}: MessageThreadProps) => {
  if (!selectedConv) return null;

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

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
                  {selectedConv.isPinned && (
                    <Pin className="h-4 w-4 text-yellow-500" />
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
                  <Reply className="h-3 w-3 inline mr-1" />
                  Replying to: {messages.find(m => m.id === message.replyTo)?.content?.substring(0, 50)}...
                </div>
              )}
              
              <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}>
                <div className="max-w-xs lg:max-w-md space-y-1">
                  <div
                    className={`px-4 py-2 rounded-lg relative ${
                      message.isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.priority === "urgent" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                    
                    <p className="text-sm">{message.content}</p>
                    
                    {message.isForwarded && (
                      <div className="text-xs opacity-75 mt-1">
                        Forwarded from {message.forwardedFrom}
                      </div>
                    )}
                    
                    <div className={`flex items-center justify-between mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <p className="text-xs">
                        {message.timestamp}
                        {message.isEdited && " (edited)"}
                      </p>
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
                  
                  {/* Message actions */}
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    message.isOwn ? 'text-right' : 'text-left'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(message.id)}
                        className="h-6 text-xs"
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopyMessage(message.content)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCreateThread(message.id)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Start thread
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onForwardMessage(message.id, [])}>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onPinMessage(message.id)}>
                            <Pin className="h-4 w-4 mr-2" />
                            Pin message
                          </DropdownMenuItem>
                          {message.isOwn && (
                            <>
                              <DropdownMenuItem onClick={() => setEditingMessage(message.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onDeleteMessage(message.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

        <EnhancedMessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={onSendMessage}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          replyingToMessage={replyingToMessage}
          isRecording={isRecording}
          onVoiceRecording={onVoiceRecording}
        />
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
