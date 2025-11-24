import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "@/services/messagingService";
import { toast } from "sonner";

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, partnerId }: { userId: string; partnerId: string }) => 
      deleteConversation(userId, partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success("Conversation deleted");
    },
    onError: (error) => {
      console.error('Delete conversation error:', error);
      toast.error("Failed to delete conversation");
    },
  });
};
