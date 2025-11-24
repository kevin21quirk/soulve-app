import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hideConversation } from "@/services/messagingService";
import { toast } from "sonner";

export const useHideConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, partnerId }: { userId: string; partnerId: string }) => 
      hideConversation(userId, partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success("Conversation hidden");
    },
    onError: (error) => {
      console.error('Hide conversation error:', error);
      toast.error("Failed to hide conversation");
    },
  });
};
