
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { respondToConnectionRequest } from "@/services/connectionQueries";

export const useRespondToConnection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: respondToConnectionRequest,
    onSuccess: (_, { status }) => {
      // Invalidate all related queries for immediate updates
      queryClient.invalidateQueries({ queryKey: ['real-connections'] });
      queryClient.invalidateQueries({ queryKey: ['suggested-connections'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile'] });
      
      toast({
        title: status === 'accepted' ? "Connection accepted!" : "Connection declined",
        description: status === 'accepted' ? "You're now connected!" : "Connection request declined.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to respond to connection request.",
        variant: "destructive",
      });
    },
  });
};
