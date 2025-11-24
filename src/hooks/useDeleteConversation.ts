import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "@/services/messagingService";
import { toast } from "sonner";

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, partnerId }: { userId: string; partnerId: string }) => 
      deleteConversation(userId, partnerId),
    
    // Optimistic update - instantly remove conversation from UI
    onMutate: async ({ userId, partnerId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['conversations'] });
      
      // Snapshot previous value for rollback
      const previousConversations = queryClient.getQueryData(['conversations']);
      
      // Optimistically remove conversation from cache
      queryClient.setQueryData(['conversations'], (old: any) => {
        if (!old) return old;
        return old.filter((conv: any) => conv.partner_id !== partnerId);
      });
      
      // Return snapshot for rollback
      return { previousConversations };
    },
    
    onSuccess: () => {
      // Keep invalidation as backup to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success("Conversation deleted");
    },
    
    // Rollback on failure
    onError: (error, variables, context: any) => {
      // Restore previous state if server request fails
      if (context?.previousConversations) {
        queryClient.setQueryData(['conversations'], context.previousConversations);
      }
      console.error('Delete conversation error:', error);
      toast.error("Failed to delete conversation");
    },
  });
};
