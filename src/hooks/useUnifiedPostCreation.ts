
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createUnifiedPost } from '@/services/unifiedPostService';
import { ContentModerationService } from '@/services/contentModerationService';
import { useToast } from '@/hooks/use-toast';

export const useUnifiedPostCreation = (onPostCreated?: () => void) => {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPost = async (postData: any) => {
    setIsCreating(true);
    
    try {
      // First, filter the content for moderation
      const filterResult = await ContentModerationService.filterContent(
        postData.description, 
        postData.title
      );

      // If content is blocked, show error and don't create post
      if (!filterResult.isAllowed) {
        toast({
          title: "Content Blocked",
          description: `Your post was blocked: ${filterResult.reasons.join(', ')}. Please review our community guidelines and try again.`,
          variant: "destructive"
        });
        return false;
      }

      // If content is flagged but allowed, show warning
      if (filterResult.autoAction === 'flag') {
        toast({
          title: "Content Flagged",
          description: "Your post has been flagged for review but will be published. Our moderation team will review it shortly.",
          variant: "default"
        });
      }

      // Create the post
      const postId = await createUnifiedPost({
        title: postData.title,
        content: postData.description,
        category: postData.category,
        urgency: postData.urgency || 'medium',
        location: postData.location,
        tags: postData.tags || [],
        visibility: postData.visibility || 'public',
        media_urls: postData.media_urls || []
      });

      // Show success message
      toast({
        title: "Post Created!",
        description: "Your post has been published successfully."
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });

      // Call the callback
      onPostCreated?.();

      return postId;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPost,
    isCreating
  };
};
