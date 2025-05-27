
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message, Conversation } from "@/types/messaging";
import { mockConversations, mockMessages } from "@/data/mockMessaging";

export const useMessaging = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

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

  return {
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage,
    isTyping,
    conversations,
    messages,
    selectedConv,
    handleSendMessage,
  };
};
