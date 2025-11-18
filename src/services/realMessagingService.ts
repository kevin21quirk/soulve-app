
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

      // Get latest message with each user - simplified query
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.user.id},recipient_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get unique partner IDs and fetch their profiles separately
      const partnerIds = new Set<string>();
      (messages || []).forEach((message: any) => {
        const partnerId = message.sender_id === user.user.id ? message.recipient_id : message.sender_id;
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
        const partnerId = message.sender_id === user.user.id ? message.recipient_id : message.sender_id;
        const partnerProfile = profileMap.get(partnerId);
        
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

      // Get messages first
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender profiles for all messages
      const senderIds = [...new Set((messages || []).map(msg => msg.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map();
      (profiles || []).forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Add profile data to messages
      const messagesWithProfiles = (messages || []).map(message => ({
        ...message,
        sender_profile: profileMap.get(message.sender_id)
      }));

      return messagesWithProfiles;
    },
    enabled: !!partnerId,
  });
};

// Hook to send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      recipientId, 
      content, 
      messageType = 'text',
      attachment
    }: { 
      recipientId: string; 
      content: string; 
      messageType?: 'text' | 'image' | 'file' | 'voice';
      attachment?: {
        url: string;
        name: string;
        size: number;
        type: string;
      } | null;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.user.id,
          recipient_id: recipientId,
          content,
          message_type: attachment ? attachment.type : messageType,
          attachment_url: attachment?.url,
          attachment_name: attachment?.name,
          attachment_size: attachment?.size,
          attachment_type: attachment?.type,
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
    onMutate: async ({ recipientId, content, messageType = 'text', attachment }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages', recipientId] });
      await queryClient.cancelQueries({ queryKey: ['conversations'] });

      // Snapshot previous values
      const previousMessages = queryClient.getQueryData(['messages', recipientId]);
      const previousConversations = queryClient.getQueryData(['conversations']);

      // Create optimistic message
      const optimisticMessage = {
        id: `optimistic-${Date.now()}`,
        content: content.trim(),
        sender_id: user.user.id,
        recipient_id: recipientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_read: false,
        message_type: attachment ? attachment.type : messageType,
        file_url: attachment?.url,
        file_name: attachment?.name,
        file_size: attachment?.size,
        sender_profile: null
      };

      // Optimistically update messages cache
      queryClient.setQueryData(['messages', recipientId], (old: any[] = []) => [...old, optimisticMessage]);

      // Optimistically update conversations cache
      queryClient.setQueryData(['conversations'], (old: any[] = []) => {
        const conversationExists = old.some(conv => conv.partner_id === recipientId);
        
        if (conversationExists) {
          return old.map(conv => 
            conv.partner_id === recipientId 
              ? { ...conv, last_message: content.trim(), last_message_time: new Date().toISOString() }
              : conv
          );
        }
        
        return old;
      });

      return { previousMessages, previousConversations, optimisticMessage };
    },
    onError: (error: any, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', variables.recipientId], context.previousMessages);
      }
      if (context?.previousConversations) {
        queryClient.setQueryData(['conversations'], context.previousConversations);
      }

      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    },
    onSuccess: (data, { recipientId }, context) => {
      // Replace optimistic message with real message
      if (context?.optimisticMessage) {
        queryClient.setQueryData(['messages', recipientId], (old: any[] = []) => 
          old.map(msg => msg.id === context.optimisticMessage.id ? { ...data, sender_profile: null } : msg)
        );
      }
      
      // Refetch conversations to get accurate data
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'],
        refetchType: 'active'
      });
    },
    onSettled: (_, __, { recipientId }) => {
      // Ensure cache consistency
      queryClient.invalidateQueries({ 
        queryKey: ['messages', recipientId],
        refetchType: 'none'
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
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'],
        refetchType: 'none'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['messages'],
        refetchType: 'none'
      });
    },
  });
};
