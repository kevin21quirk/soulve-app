
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { sendConnectionRequest } from "@/services/connectionQueries";

export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: sendConnectionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-connections'] });
      queryClient.invalidateQueries({ queryKey: ['suggested-connections'] });
      toast({
        title: "Connection request sent!",
        description: "Your request has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
    },
  });
};
