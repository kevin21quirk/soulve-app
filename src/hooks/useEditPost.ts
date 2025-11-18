import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUnifiedPost } from '@/services/unifiedPostService';
import { useToast } from '@/hooks/use-toast';
import { SocialPost } from '@/services/socialFeedService';

interface UpdatePostData {
  postId: string;
  title?: string;
  content: string;
  category: string;
  urgency?: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
}

export const useEditPost = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdatePostData) => {
      const { postId, ...updateData } = data;
      return await updateUnifiedPost(postId, updateData);
    },
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['social-feed'] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['feedPosts'] });

      // Snapshot previous values
      const previousSocialFeed = queryClient.getQueryData(['social-feed']);
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousFeedPosts = queryClient.getQueryData(['feedPosts']);

      // Optimistically update social feed
      queryClient.setQueryData<SocialPost[]>(
        ['social-feed'],
        (old = []) => old.map(post => 
          post.id === variables.postId
            ? {
                ...post,
                title: variables.title || post.title,
                content: variables.content,
                category: variables.category,
                urgency: variables.urgency || post.urgency,
                location: variables.location || post.location,
                tags: variables.tags || post.tags,
                media_urls: variables.media_urls || post.media_urls,
                updated_at: new Date().toISOString()
              }
            : post
        )
      );

      // Return context for rollback
      return { previousSocialFeed, previousPosts, previousFeedPosts };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousSocialFeed) {
        queryClient.setQueryData(['social-feed'], context.previousSocialFeed);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousFeedPosts) {
        queryClient.setQueryData(['feedPosts'], context.previousFeedPosts);
      }

      toast({
        title: 'Failed to update post',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      toast({
        title: 'Post updated',
        description: 'Your post has been updated successfully.'
      });
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
    }
  });

  return {
    updatePost: mutation.mutate,
    isUpdating: mutation.isPending
  };
};
