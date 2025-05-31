
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface DatabaseMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'voice';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageWithProfile extends DatabaseMessage {
  sender_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

// Hook to get conversations (unique users you've messaged with)
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get latest message with each user
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url),
          recipient_profile:profiles!messages_recipient_id_fkey(first_name, last_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.user.id},recipient_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation partner and get latest message
      const conversationsMap = new Map();
      
      (messages || []).forEach((message: any) => {
        const partnerId = message.sender_id === user.user.id ? message.recipient_id : message.sender_id;
        const partnerProfile = message.sender_id === user.user.id ? message.recipient_profile : message.sender_profile;
        
        if (!conversationsMap.has(partnerId)) {
          conversationsMap.set(partnerId, {
            id: partnerId,
            partner_id: partnerId,
            partner_profile: partnerProfile,
            last_message: message.content,
            last_message_time: message.created_at,
            is_read: message.is_read || message.sender_id === user.user.id,
            unread_count: 0,
          });
        }
      });

      return Array.from(conversationsMap.values());
    },
  });
};

// Hook to get messages with a specific user
export const useMessages = (partnerId: string) => {
  return useQuery({
    queryKey: ['messages', partnerId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user || !partnerId) return [];

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return messages || [];
    },
    enabled: !!partnerId,
  });
};

// Hook to send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ recipientId, content, messageType = 'text' }: { 
      recipientId: string; 
      content: string; 
      messageType?: 'text' | 'image' | 'file' | 'voice';
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.user.id,
          recipient_id: recipientId,
          content,
          message_type: messageType,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          sender_id: user.user.id,
          type: 'message',
          title: 'New Message',
          message: content.length > 50 ? content.substring(0, 50) + '...' : content,
          metadata: { message_id: data.id }
        });

      return data;
    },
    onSuccess: (_, { recipientId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', recipientId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    },
  });
};

// Hook to mark messages as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageIds: string[]) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', messageIds)
        .eq('recipient_id', user.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
