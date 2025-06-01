
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
}

interface Conversation {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  last_message?: Message;
  unread_count: number;
}

// Type helper to convert database message to our Message interface
const convertToMessage = (dbMessage: any): Message => ({
  id: dbMessage.id,
  content: dbMessage.content,
  sender_id: dbMessage.sender_id,
  recipient_id: dbMessage.recipient_id,
  created_at: dbMessage.created_at,
  is_read: dbMessage.is_read,
  message_type: (dbMessage.message_type as 'text' | 'image' | 'file') || 'text',
  file_url: dbMessage.file_url,
  file_name: dbMessage.file_name,
});

export const useRealTimeMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Loading conversations for user:', user.id);
      
      // Get all unique conversation partners
      const { data: messageData, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          recipient_id,
          content,
          created_at,
          is_read,
          message_type
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Fetched messages:', messageData);

      // Group by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      for (const dbMessage of messageData || []) {
        const partnerId = dbMessage.sender_id === user.id ? dbMessage.recipient_id : dbMessage.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          // Get partner profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', partnerId)
            .single();

          console.log('Fetched profile for partner:', partnerId, profile);

          conversationMap.set(partnerId, {
            user_id: partnerId,
            user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User' : 'Unknown User',
            avatar_url: profile?.avatar_url,
            last_message: convertToMessage(dbMessage),
            unread_count: 0
          });
        }

        // Update unread count
        if (dbMessage.recipient_id === user.id && !dbMessage.is_read) {
          const conv = conversationMap.get(partnerId)!;
          conv.unread_count++;
        }
      }

      const conversationList = Array.from(conversationMap.values());
      console.log('Final conversations:', conversationList);
      setConversations(conversationList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error loading conversations",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (partnerId: string) => {
    if (!user) return;

    try {
      console.log('Loading messages between:', user.id, 'and', partnerId);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversation messages:', error);
        throw error;
      }

      console.log('Loaded messages for conversation:', data);
      
      // Convert database messages to our Message interface
      const convertedMessages = (data || []).map(convertToMessage);
      
      setMessages(prev => ({
        ...prev,
        [partnerId]: convertedMessages
      }));

      // Mark messages as read
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', partnerId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (updateError) {
        console.error('Error marking messages as read:', updateError);
      }

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (recipientId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    if (!user || !content.trim()) return;

    try {
      console.log('Sending message from', user.id, 'to', recipientId, ':', content);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
          message_type: messageType,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting message:', error);
        throw error;
      }

      console.log('Message sent successfully:', data);

      // Convert and update local state immediately for optimistic UI
      const convertedMessage = convertToMessage(data);
      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), convertedMessage]
      }));

      return convertedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for user:', user.id);

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Received new message via realtime:', payload);
          const newMessage = convertToMessage(payload.new);
          
          // Add to conversation messages
          setMessages(prev => ({
            ...prev,
            [newMessage.sender_id]: [...(prev[newMessage.sender_id] || []), newMessage]
          }));

          // Update conversations list
          loadConversations();

          // Show notification if not in active conversation
          if (activeConversation !== newMessage.sender_id) {
            toast({
              title: "New message",
              description: newMessage.content,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, activeConversation, loadConversations, toast]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    loading,
    loadMessages,
    sendMessage,
    refreshConversations: loadConversations
  };
};
