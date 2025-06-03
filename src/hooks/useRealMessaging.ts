
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RealConversation {
  id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online: boolean;
}

export interface RealMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
  created_at: string;
  is_read: boolean;
  is_own: boolean;
}

export const useRealMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<RealConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, RealMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      // Get all messages involving the current user
      const { data: allMessages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get all unique user IDs from messages
      const userIds = new Set<string>();
      allMessages?.forEach((message: any) => {
        userIds.add(message.sender_id);
        userIds.add(message.recipient_id);
      });

      // Fetch profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create a profile map
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Group by conversation partner
      const conversationsMap = new Map<string, RealConversation>();
      
      allMessages?.forEach((message: any) => {
        const isOwnMessage = message.sender_id === user.id;
        const partnerId = isOwnMessage ? message.recipient_id : message.sender_id;
        const partnerProfile = profileMap.get(partnerId);
        
        if (!conversationsMap.has(partnerId)) {
          const partnerName = partnerProfile?.first_name 
            ? `${partnerProfile.first_name} ${partnerProfile.last_name || ''}`.trim()
            : 'Unknown User';

          conversationsMap.set(partnerId, {
            id: partnerId,
            partner_id: partnerId,
            partner_name: partnerName,
            partner_avatar: partnerProfile?.avatar_url || '',
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: 0,
            is_online: false
          });
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error loading conversations",
        description: "Failed to load your conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!user) return;

    try {
      // Get messages between current user and partner
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender profiles for messages
      const senderIds = [...new Set(messagesData?.map(msg => msg.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      const processedMessages: RealMessage[] = messagesData?.map((msg: any) => {
        const senderProfile = profileMap.get(msg.sender_id);
        const senderName = senderProfile?.first_name
          ? `${senderProfile.first_name} ${senderProfile.last_name || ''}`.trim()
          : 'Unknown';

        return {
          id: msg.id,
          sender_id: msg.sender_id,
          sender_name: senderName,
          sender_avatar: senderProfile?.avatar_url || '',
          content: msg.content,
          message_type: msg.message_type as 'text' | 'image' | 'file',
          file_url: msg.file_url,
          file_name: msg.file_name,
          created_at: msg.created_at,
          is_read: msg.is_read,
          is_own: msg.sender_id === user.id
        };
      }) || [];

      setMessages(prev => ({
        ...prev,
        [partnerId]: processedMessages
      }));

      if (messagesData?.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('recipient_id', user.id)
          .eq('sender_id', partnerId);
      }

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error loading messages",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!user || !content.trim()) return;

    setSendingMessage(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
          message_type: 'text',
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage: RealMessage = {
        id: data.id,
        sender_id: data.sender_id,
        sender_name: 'You',
        sender_avatar: '',
        content: data.content,
        message_type: data.message_type as 'text' | 'image' | 'file',
        created_at: data.created_at,
        is_read: false,
        is_own: true
      };

      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), newMessage]
      }));

      await fetchConversations();

      await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          sender_id: user.id,
          type: 'message',
          title: 'New Message',
          message: content.length > 50 ? content.substring(0, 50) + '...' : content
        });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  }, [user, fetchConversations, toast]);

  useEffect(() => {
    if (!user) return;

    const messagesChannel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, (payload: any) => {
        fetchConversations();
        
        const senderId = payload.new.sender_id;
        if (messages[senderId]) {
          fetchMessages(senderId);
        }

        toast({
          title: "New message",
          description: "You received a new message."
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user, messages, fetchConversations, fetchMessages, toast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    sendingMessage,
    fetchConversations,
    fetchMessages,
    sendMessage
  };
};
