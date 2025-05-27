
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isActive: boolean;
}

const MessagingSystem = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "",
      lastMessage: "Thanks for offering to help with the move!",
      timestamp: "2m ago",
      unread: 2,
      isActive: true
    },
    {
      id: "2",
      name: "Mike Johnson",
      avatar: "",
      lastMessage: "When would be a good time for tutoring?",
      timestamp: "1h ago",
      unread: 0,
      isActive: false
    },
    {
      id: "3",
      name: "Community Gardens",
      avatar: "",
      lastMessage: "The garden project was amazing!",
      timestamp: "2h ago",
      unread: 1,
      isActive: false
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "Sarah Chen",
      content: "Hi! I saw your response to my moving request. Are you still available this Saturday?",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: "2",
      sender: "You",
      content: "Yes, I'm free on Saturday! What time works best for you?",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: "3",
      sender: "Sarah Chen",
      content: "Perfect! How about 9 AM? I'll provide breakfast and lunch for everyone helping.",
      timestamp: "10:37 AM",
      isOwn: false
    },
    {
      id: "4",
      sender: "You",
      content: "Sounds great! Should I bring any specific equipment?",
      timestamp: "10:40 AM",
      isOwn: true
    },
    {
      id: "5",
      sender: "Sarah Chen",
      content: "Thanks for offering to help with the move!",
      timestamp: "10:42 AM",
      isOwn: false
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
      setNewMessage("");
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
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
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
                      {conversation.lastMessage}
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
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={selectedConv.avatar} />
                  <AvatarFallback>
                    {selectedConv.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedConv.name}</CardTitle>
                  <CardDescription>
                    {selectedConv.isActive ? 'Active now' : `Last seen ${selectedConv.timestamp}`}
                  </CardDescription>
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
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="sm">
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

export default MessagingSystem;
