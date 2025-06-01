
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Conversation } from './types';
import { convertToMessage } from './utils';

export const useConversations = (userId: string | undefined) => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      console.log('Loading conversations for user:', userId);
      
      // Get all unique conversation partners
      const { data: messageData, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          created_at,
          is_read,
          message_type,
          file_url,
          file_name
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Fetched messages:', messageData);

      // Group by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      for (const dbMessage of messageData || []) {
        const partnerId = dbMessage.sender_id === userId ? dbMessage.recipient_id : dbMessage.sender_id;
        
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
        if (dbMessage.recipient_id === userId && !dbMessage.is_read) {
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
  }, [userId, toast]);

  return {
    conversations,
    loading,
    loadConversations
  };
};
