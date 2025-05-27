
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { QUERY_KEYS } from "@/services/dataService";
import { FeedPost } from "@/types/feed";
import { ConnectionRequest } from "@/types/connections";

export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const optimisticLikePost = (postId: string) => {
    queryClient.setQueryData<FeedPost[]>(QUERY_KEYS.FEED_POSTS, (oldData) => {
      if (!oldData) return oldData;
      
      return oldData.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      );
    });
  };

  const optimisticUpdateConnection = (id: string, status: ConnectionRequest['status']) => {
    queryClient.setQueryData<ConnectionRequest[]>(QUERY_KEYS.CONNECTIONS, (oldData) => {
      if (!oldData) return oldData;
      
      return oldData.map(conn => 
        conn.id === id ? { ...conn, status } : conn
      );
    });

    // Show appropriate toast
    const statusMessages = {
      connected: "Connection accepted!",
      declined: "Connection declined",
      sent: "Connection request sent!",
      pending: "Connection is pending"
    };

    toast({
      title: statusMessages[status],
      description: status === 'connected' 
        ? "You're now connected and can start helping each other."
        : "The connection status has been updated.",
    });
  };

  const rollbackOnError = (queryKey: any[], error: Error) => {
    console.error('Optimistic update failed:', error);
    queryClient.invalidateQueries({ queryKey });
    
    toast({
      title: "Update Failed",
      description: "Please try again. Your changes were not saved.",
      variant: "destructive",
    });
  };

  return {
    optimisticLikePost,
    optimisticUpdateConnection,
    rollbackOnError,
  };
};
