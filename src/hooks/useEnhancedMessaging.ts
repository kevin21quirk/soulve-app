
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message, Conversation, ConversationFilters, MessageReaction } from "@/types/messaging";
import { mockConversations, mockMessages } from "@/data/mockMessaging";

export const useEnhancedMessaging = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [filters, setFilters] = useState<ConversationFilters>({ type: "all" });
  const [showParticipants, setShowParticipants] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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
        status: "sent",
        type: "text",
        replyTo: replyingTo || undefined
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      setReplyingTo(null);
      
      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
    }
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReactions = msg.reactions || [];
        const existingReaction = existingReactions.find(r => r.userId === "you" && r.emoji === emoji);
        
        if (existingReaction) {
          // Remove reaction
          return {
            ...msg,
            reactions: existingReactions.filter(r => !(r.userId === "you" && r.emoji === emoji))
          };
        } else {
          // Add reaction with timestamp
          const newReaction: MessageReaction = { 
            emoji, 
            userId: "you", 
            userName: "You",
            timestamp: new Date().toISOString()
          };
          return {
            ...msg,
            reactions: [...existingReactions, newReaction]
          };
        }
      }
      return msg;
    }));
  };

  const handleTogglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isPinned: !conv.isPinned }
        : conv
    ));
    
    const conversation = conversations.find(c => c.id === conversationId);
    toast({
      title: conversation?.isPinned ? "Conversation unpinned" : "Conversation pinned",
      description: conversation?.isPinned ? "Moved to regular conversations" : "Moved to top of your conversation list",
    });
  };

  const handleToggleMute = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isMuted: !conv.isMuted }
        : conv
    ));
    
    const conversation = conversations.find(c => c.id === conversationId);
    toast({
      title: conversation?.isMuted ? "Conversation unmuted" : "Conversation muted",
      description: conversation?.isMuted ? "You'll receive notifications again" : "You won't receive notifications",
    });
  };

  const handleArchiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isArchived: !conv.isArchived }
        : conv
    ));
    
    const conversation = conversations.find(c => c.id === conversationId);
    toast({
      title: conversation?.isArchived ? "Conversation unarchived" : "Conversation archived",
      description: conversation?.isArchived ? "Moved back to main conversations" : "Moved to archived conversations",
    });
  };

  const filteredConversations = conversations.filter(conv => {
    if (filters.type === "archived") return conv.isArchived;
    if (filters.type === "direct") return conv.type === "direct" && !conv.isArchived;
    if (filters.type === "group") return conv.type === "group" && !conv.isArchived;
    if (filters.type === "unread") return conv.unread > 0 && !conv.isArchived;
    return !conv.isArchived; // "all" - exclude archived by default
  }).filter(conv => {
    if (filters.searchQuery) {
      return conv.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
             conv.lastMessage.toLowerCase().includes(filters.searchQuery.toLowerCase());
    }
    return true;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return {
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage,
    isTyping,
    conversations: filteredConversations,
    messages,
    selectedConv,
    filters,
    setFilters,
    showParticipants,
    setShowParticipants,
    replyingTo,
    setReplyingTo,
    handleSendMessage,
    handleReactToMessage,
    handleTogglePin,
    handleToggleMute,
    handleArchiveConversation,
  };
};
