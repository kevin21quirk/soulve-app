
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
}

export const useRealTimeMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      setConversationsLoading(true);
      setConversationsError(null);

      // Get messages where user is sender or recipient
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Get unique partner IDs
      const partnerIds = new Set<string>();
      messagesData?.forEach(message => {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        partnerIds.add(partnerId);
      });

      // Get profiles for partners
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', Array.from(partnerIds));

      if (profilesError) throw profilesError;

      // Create conversations map
      const conversationsMap = new Map<string, Conversation>();
      
      messagesData?.forEach(message => {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        const profile = profiles?.find(p => p.id === partnerId);
        
        if (!conversationsMap.has(partnerId) && profile) {
          conversationsMap.set(partnerId, {
            user_id: partnerId,
            user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
            avatar_url: profile.avatar_url || undefined,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: 0 // Will be calculated properly later
          });
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setConversationsError(error.message);
      setHasError(true);
    } finally {
      setConversationsLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!user || !partnerId) return;

    try {
      setMessageLoading(true);
      setMessageError(null);

      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [partnerId]: messagesData || []
      }));
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setMessageError(error.message);
      setHasError(true);
    } finally {
      setMessageLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          message_type: 'text',
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Update local messages
      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), data]
      }));

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          sender_id: user.id,
          type: 'message',
          title: 'New Message',
          message: content.length > 50 ? content.substring(0, 50) + '...' : content
        });

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const refreshConversations = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
      }, (payload) => {
        console.log('Real-time message update:', payload);
        
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as Message;
          const partnerId = newMessage.sender_id === user.id ? newMessage.recipient_id : newMessage.sender_id;
          
          setMessages(prev => ({
            ...prev,
            [partnerId]: [...(prev[partnerId] || []), newMessage]
          }));
          
          // Refresh conversations to update last message
          fetchConversations();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation, fetchMessages]);

  return {
    conversations,
    messages,
    activeConversation,
    conversationsLoading,
    messageLoading,
    conversationsError,
    messageError,
    setActiveConversation,
    sendMessage,
    refreshConversations,
    isLoading,
    hasError
  };
};
