
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Message, 
  Conversation, 
  ConversationFilters, 
  MessageReaction, 
  MessageThread,
  TypingIndicator,
  MessageSearchResult,
  MessageAttachment
} from "@/types/messaging";
import { mockConversations, mockMessages } from "@/data/mockMessaging";

export const useAdvancedMessaging = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [filters, setFilters] = useState<ConversationFilters>({ type: "all" });
  const [showParticipants, setShowParticipants] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MessageSearchResult[]>([]);
  const [activeThreads, setActiveThreads] = useState<MessageThread[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Enhanced typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    if (newMessage.length > 0) {
      // Simulate typing indicator for current user
      typingTimer = setTimeout(() => {
        setTypingUsers(prev => prev.filter(user => user.userId !== "you"));
      }, 2000);
    }
    return () => clearTimeout(typingTimer);
  }, [newMessage]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
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
        replyTo: replyingTo || undefined,
        priority: "normal"
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      setReplyingTo(null);
      
      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
    }
  }, [newMessage, replyingTo, toast]);

  const handleReactToMessage = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReactions = msg.reactions || [];
        const existingReaction = existingReactions.find(r => r.userId === "you" && r.emoji === emoji);
        
        if (existingReaction) {
          return {
            ...msg,
            reactions: existingReactions.filter(r => !(r.userId === "you" && r.emoji === emoji))
          };
        } else {
          return {
            ...msg,
            reactions: [...existingReactions, { 
              emoji, 
              userId: "you", 
              userName: "You",
              timestamp: new Date().toISOString()
            }]
          };
        }
      }
      return msg;
    }));
  }, []);

  const handleEditMessage = useCallback((messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            content: newContent, 
            isEdited: true, 
            editedAt: new Date().toISOString() 
          }
        : msg
    ));
    setEditingMessage(null);
    
    toast({
      title: "Message updated",
      description: "Your message has been edited.",
    });
  }, [toast]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    toast({
      title: "Message deleted",
      description: "The message has been removed.",
    });
  }, [toast]);

  const handleForwardMessage = useCallback((messageId: string, conversationIds: string[]) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      conversationIds.forEach(convId => {
        const forwardedMessage: Message = {
          ...message,
          id: Date.now().toString() + Math.random(),
          isOwn: true,
          isForwarded: true,
          forwardedFrom: message.sender,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, forwardedMessage]);
      });
      
      toast({
        title: "Message forwarded",
        description: `Sent to ${conversationIds.length} conversation(s).`,
      });
    }
  }, [messages, toast]);

  const handlePinMessage = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      toast({
        title: "Message pinned",
        description: "Message has been pinned to this conversation.",
      });
    }
  }, [messages, toast]);

  const handleSearchMessages = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = messages
        .filter(msg => 
          msg.content.toLowerCase().includes(query.toLowerCase()) ||
          msg.sender.toLowerCase().includes(query.toLowerCase())
        )
        .map(msg => ({
          message: msg,
          conversation: conversations.find(c => c.id === selectedConversation)!,
          context: [],
          highlights: [query]
        }));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [messages, conversations, selectedConversation]);

  const handleTogglePin = useCallback((conversationId: string) => {
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
  }, [conversations, toast]);

  const handleToggleMute = useCallback((conversationId: string) => {
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
  }, [conversations, toast]);

  const handleArchiveConversation = useCallback((conversationId: string) => {
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
  }, [conversations, toast]);

  const handleCreateThread = useCallback((messageId: string) => {
    const parentMessage = messages.find(m => m.id === messageId);
    if (parentMessage) {
      const thread: MessageThread = {
        id: Date.now().toString(),
        parentMessageId: messageId,
        messages: [],
        participantCount: 1,
        lastActivity: new Date().toISOString(),
        isActive: true
      };
      setActiveThreads(prev => [...prev, thread]);
    }
  }, [messages]);

  const handleVoiceRecording = useCallback((start: boolean) => {
    setIsRecording(start);
    if (start) {
      toast({
        title: "Recording started",
        description: "Recording your voice message...",
      });
    }
  }, [toast]);

  const filteredConversations = conversations.filter(conv => {
    if (filters.type === "archived") return conv.isArchived;
    if (filters.type === "direct") return conv.type === "direct" && !conv.isArchived;
    if (filters.type === "group") return conv.type === "group" && !conv.isArchived;
    if (filters.type === "unread") return conv.unread > 0 && !conv.isArchived;
    if (filters.type === "pinned") return conv.isPinned && !conv.isArchived;
    return !conv.isArchived;
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
    conversations: filteredConversations,
    messages,
    selectedConv,
    filters,
    setFilters,
    showParticipants,
    setShowParticipants,
    replyingTo,
    setReplyingTo,
    searchQuery,
    searchResults,
    activeThreads,
    typingUsers,
    editingMessage,
    setEditingMessage,
    selectedMessages,
    setSelectedMessages,
    isRecording,
    handleSendMessage,
    handleReactToMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleForwardMessage,
    handlePinMessage,
    handleSearchMessages,
    handleTogglePin,
    handleToggleMute,
    handleArchiveConversation,
    handleCreateThread,
    handleVoiceRecording,
  };
};
