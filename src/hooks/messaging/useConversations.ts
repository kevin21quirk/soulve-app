
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Conversation } from './types';

export const useConversations = (userId: string | undefined) => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadConversations = useCallback(async (showLoading = true) => {
    if (!userId) return;

    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    if (showLoading) setLoading(true);
    setError(null);

    try {
      
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching conversations:', messagesError);
        throw new Error(`Failed to load conversations: ${messagesError.message}`);
      }

      const partnerIds = new Set<string>();
      (messages || []).forEach((message: any) => {
        const partnerId = message.sender_id === userId ? message.recipient_id : message.sender_id;
        partnerIds.add(partnerId);
      });

      if (partnerIds.size === 0) {
        setConversations([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', Array.from(partnerIds));

      if (profilesError) {
        console.warn('Error fetching profiles:', profilesError);
      }

      const profileMap = new Map();
      (profiles || []).forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Group by conversation partner and get latest message + unread count
      const conversationsMap = new Map();
      
      (messages || []).forEach((message: any) => {
        const partnerId = message.sender_id === userId ? message.recipient_id : message.sender_id;
        const partnerProfile = profileMap.get(partnerId);
        
        if (!conversationsMap.has(partnerId)) {
          const partnerName = partnerProfile 
            ? `${partnerProfile.first_name || ''} ${partnerProfile.last_name || ''}`.trim() || 'Anonymous'
            : 'Anonymous';

          // Count unread messages from this partner
          const unreadCount = (messages || []).filter((msg: any) => 
            msg.sender_id === partnerId && 
            msg.recipient_id === userId && 
            !msg.is_read
          ).length;

          conversationsMap.set(partnerId, {
            id: partnerId,
            user_id: partnerId,
            user_name: partnerName,
            avatar_url: partnerProfile?.avatar_url,
            last_message: {
              content: message.content,
              created_at: message.created_at
            },
            unread_count: unreadCount,
            partner_id: partnerId,
            partner_profile: partnerProfile,
            last_message_time: message.created_at,
            is_read: message.is_read || message.sender_id === userId,
          });
        }
      });

      const conversationsList = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
      
      setConversations(conversationsList);

    } catch (error: any) {
      console.error('Error loading conversations:', error);
      setError(error.message || 'Failed to load conversations');
      toast({
        title: "Failed to load conversations",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      loadingRef.current = false;
      if (showLoading) setLoading(false);
    }
  }, [userId, toast]);

  const updateConversationOnNewMessage = useCallback((senderId: string, message: string) => {
    setConversations(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(conv => conv.partner_id === senderId);
      
      if (existingIndex >= 0) {
        const conversation = { ...updated[existingIndex] };
        conversation.last_message = {
          content: message,
          created_at: new Date().toISOString()
        };
        conversation.last_message_time = new Date().toISOString();
        conversation.unread_count += 1;
        conversation.is_read = false;
        
        updated.splice(existingIndex, 1);
        updated.unshift(conversation);
      } else {
        loadConversations(false);
      }
      
      return updated;
    });
  }, [loadConversations]);

  const markConversationAsRead = useCallback((partnerId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.partner_id === partnerId 
        ? { ...conv, unread_count: 0, is_read: true }
        : conv
    ));
  }, []);

  return {
    conversations,
    loading,
    error,
    loadConversations,
    updateConversationOnNewMessage,
    markConversationAsRead
  };
};
