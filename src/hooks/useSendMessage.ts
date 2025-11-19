import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sendMessage } from "@/services/messagingService";
import { UnifiedMessage } from "@/types/unified-messaging";
import { toast } from "sonner";

export const useSendMessage = (partnerId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !partnerId) throw new Error('Cannot send message');

      return sendMessage({
        sender_id: user.id,
        recipient_id: partnerId,
        content,
        message_type: 'text',
      });
    },
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages', partnerId] });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<UnifiedMessage[]>(['messages', partnerId]);

      // Optimistically update
      const tempMessage: UnifiedMessage = {
        id: `temp-${Date.now()}`,
        content,
        sender_id: '',
        recipient_id: partnerId!,
        created_at: new Date().toISOString(),
        is_read: false,
        message_type: 'text',
        isOwn: true,
        status: 'sending',
      };

      queryClient.setQueryData<UnifiedMessage[]>(
        ['messages', partnerId],
        (old = []) => [...old, tempMessage]
      );

      return { previousMessages };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', partnerId], context.previousMessages);
      }
      toast.error('Failed to send message');
    },
    onSuccess: () => {
      // Refetch to get the real message
      queryClient.invalidateQueries({ queryKey: ['messages', partnerId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
