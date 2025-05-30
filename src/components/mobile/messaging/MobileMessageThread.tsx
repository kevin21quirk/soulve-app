
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Info
} from "lucide-react";
import { useMessages, useSendMessage } from "@/services/messagingService";
import MobileMessageBubble from "./MobileMessageBubble";
import MobileMessageInput from "./MobileMessageInput";
import { mockConversations } from "@/data/mockMessaging";

interface MobileMessageThreadProps {
  conversationId: string;
  onBack: () => void;
  onSendMessage: (content: string, attachments?: any[]) => void;
  onCall: () => void;
  onVideoCall: () => void;
}

const MobileMessageThread = ({ 
  conversationId, 
  onBack, 
  onSendMessage,
  onCall,
  onVideoCall 
}: MobileMessageThreadProps) => {
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const sendMessageMutation = useSendMessage();
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = mockConversations.find(c => c.id === conversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate({ 
        conversationId, 
        content: newMessage 
      });
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                    {conversation.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {conversation.isActive && conversation.type === "direct" && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-gray-900 text-sm truncate">
                    {conversation.name}
                  </h2>
                  {conversation.type === "group" && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {conversation.participants?.length || 0}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {conversation.isTyping ? (
                    <span className="text-green-600">typing...</span>
                  ) : conversation.type === "direct" ? (
                    conversation.isActive ? 'Active now' : `Last seen ${conversation.timestamp}`
                  ) : (
                    `${conversation.participants?.length || 0} participants`
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={onCall} className="p-2 rounded-full">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onVideoCall} className="p-2 rounded-full">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 rounded-full">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MobileMessageBubble 
                key={message.id} 
                message={message} 
                onReaction={(emoji) => console.log('React with:', emoji)}
                onReply={() => console.log('Reply to:', message.id)}
                onForward={() => console.log('Forward:', message.id)}
                onDelete={() => console.log('Delete:', message.id)}
              />
            ))}
            
            {conversation.isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MobileMessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(!isRecording)}
      />
    </div>
  );
};

export default MobileMessageThread;
