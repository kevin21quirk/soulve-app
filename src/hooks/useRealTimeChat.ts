
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  message_type: 'text' | 'location' | 'system';
  created_at: string;
  room_id: string;
}

export const useRealTimeChat = (roomId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          message_type,
          profiles!inner(first_name, last_name, avatar_url)
        `)
        .eq('recipient_id', roomId) // Using recipient_id as room_id for now
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      const chatMessages: ChatMessage[] = (data || []).map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        sender_name: `${msg.profiles.first_name || ''} ${msg.profiles.last_name || ''}`.trim(),
        sender_avatar: msg.profiles.avatar_url || undefined,
        content: msg.content,
        message_type: msg.message_type as any || 'text',
        created_at: msg.created_at,
        room_id: roomId
      }));

      setMessages(chatMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const sendMessage = useCallback(async (content: string, type: ChatMessage['message_type'] = 'text') => {
    if (!user || !roomId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: roomId, // Using as room_id
          content: content.trim(),
          message_type: type
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [user, roomId]);

  const joinRoom = useCallback(async () => {
    if (!user || !roomId) return;

    // Track user presence in the room
    const roomChannel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = roomChannel.presenceState();
        const users = Object.keys(newState);
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        await roomChannel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
        });
      });

    return () => {
      roomChannel.unsubscribe();
    };
  }, [user, roomId]);

  useEffect(() => {
    if (roomId) {
      fetchMessages();
      
      // Set up real-time message subscription
      const messageChannel = supabase
        .channel(`messages:${roomId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${roomId}`
        }, () => {
          fetchMessages();
        })
        .subscribe();

      // Join room for presence
      const cleanup = joinRoom();

      return () => {
        supabase.removeChannel(messageChannel);
        cleanup?.then(fn => fn?.());
      };
    }
  }, [roomId, fetchMessages, joinRoom]);

  return {
    messages,
    loading,
    onlineUsers,
    sendMessage,
    messageCount: messages.length
  };
};
