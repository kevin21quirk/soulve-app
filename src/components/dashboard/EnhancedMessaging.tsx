
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, MoreVertical, Phone, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isActive: boolean;
  isTyping?: boolean;
}

const EnhancedMessaging = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "",
      lastMessage: "Thanks for offering to help with the move!",
      timestamp: "2m ago",
      unread: 2,
      isActive: true,
      isTyping: false
    },
    {
      id: "2",
      name: "Mike Johnson",
      avatar: "",
      lastMessage: "When would be a good time for tutoring?",
      timestamp: "1h ago",
      unread: 0,
      isActive: false,
      isTyping: true
    },
    {
      id: "3",
      name: "Maria Santos",
      avatar: "",
      lastMessage: "The garden project was amazing!",
      timestamp: "2h ago",
      unread: 1,
      isActive: false,
      isTyping: false
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Sarah Chen",
      content: "Hi! I saw your response to my moving request. Are you still available this Saturday?",
      timestamp: "10:30 AM",
      isOwn: false,
      status: "read"
    },
    {
      id: "2",
      sender: "You",
      content: "Yes, I'm free on Saturday! What time works best for you?",
      timestamp: "10:35 AM",
      isOwn: true,
      status: "read"
    },
    {
      id: "3",
      sender: "Sarah Chen",
      content: "Perfect! How about 9 AM? I'll provide breakfast and lunch for everyone helping.",
      timestamp: "10:37 AM",
      isOwn: false,
      status: "read"
    },
    {
      id: "4",
      sender: "You",
      content: "Sounds great! Should I bring any specific equipment?",
      timestamp: "10:40 AM",
      isOwn: true,
      status: "delivered"
    },
    {
      id: "5",
      sender: "Sarah Chen",
      content: "Thanks for offering to help with the move!",
      timestamp: "10:42 AM",
      isOwn: false,
      status: "sent"
    }
  ]);

  // Simulate typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    if (newMessage.length > 0) {
      setIsTyping(true);
      typingTimer = setTimeout(() => setIsTyping(false), 1000);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(typingTimer);
  }, [newMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "You",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: "sent"
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </CardTitle>
          <CardDescription>Your conversations with community members</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.isTyping ? (
                        <span className="text-blue-600 italic">typing...</span>
                      ) : (
                        conversation.lastMessage
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {conversation.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Thread */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedConv && (
          <>
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
                    {selectedConv.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedConv.name}</CardTitle>
                    <CardDescription>
                      {selectedConv.isActive ? 'Active now' : `Last seen ${selectedConv.timestamp}`}
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
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default EnhancedMessaging;
