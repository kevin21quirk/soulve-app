
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Smile, 
  Paperclip, 
  Mic,
  Image as ImageIcon,
  Camera,
  MapPin
} from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import MobileMessageBubble from "./MobileMessageBubble";
import MobileMessageInput from "./MobileMessageInput";

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
  const { conversations, messages } = useMessaging();
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);
  const conversationMessages = messages.filter(m => m.id.startsWith(conversationId));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSend = () => {
    if (newMessage.trim()) {
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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-0 hover:bg-transparent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
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
              
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">
                  {conversation.name}
                  {conversation.type === "group" && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {conversation.participants?.length || 0}
                    </Badge>
                  )}
                </h2>
                <p className="text-xs text-gray-500">
                  {conversation.type === "direct" 
                    ? (conversation.isActive ? 'Active now' : `Last seen ${conversation.timestamp}`)
                    : `${conversation.participants?.length || 0} participants`
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={onCall}>
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onVideoCall}>
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.map((message) => (
          <MobileMessageBubble key={message.id} message={message} />
        ))}
        
        {conversation.isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
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
