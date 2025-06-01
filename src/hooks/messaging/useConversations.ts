
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Conversation } from './types';

export const useConversations = (userId: string | undefined) => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      console.log('Loading conversations for user:', userId);
      
      // Get latest message with each user - simplified query
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      // Get unique partner IDs and fetch their profiles separately
      const partnerIds = new Set<string>();
      (messages || []).forEach((message: any) => {
        const partnerId = message.sender_id === userId ? message.recipient_id : message.sender_id;
        partnerIds.add(partnerId);
      });

      // Fetch profiles separately
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', Array.from(partnerIds));

      const profileMap = new Map();
      (profiles || []).forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Group by conversation partner and get latest message
      const conversationsMap = new Map();
      
      (messages || []).forEach((message: any) => {
        const partnerId = message.sender_id === userId ? message.recipient_id : message.sender_id;
        const partnerProfile = profileMap.get(partnerId);
        
        if (!conversationsMap.has(partnerId)) {
          const partnerName = partnerProfile 
            ? `${partnerProfile.first_name || ''} ${partnerProfile.last_name || ''}`.trim() || 'Anonymous'
            : 'Anonymous';

          conversationsMap.set(partnerId, {
            id: partnerId,
            user_id: partnerId,
            user_name: partnerName,
            avatar_url: partnerProfile?.avatar_url,
            last_message: {
              content: message.content,
              created_at: message.created_at
            },
            unread_count: 0,
            // Additional properties for compatibility
            partner_id: partnerId,
            partner_profile: partnerProfile,
            last_message_time: message.created_at,
            is_read: message.is_read || message.sender_id === userId,
          });
        }
      });

      const conversationsList = Array.from(conversationsMap.values());
      console.log('Loaded conversations:', conversationsList);
      setConversations(conversationsList);

    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Failed to load conversations",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  return {
    conversations,
    loading,
    loadConversations
  };
};
