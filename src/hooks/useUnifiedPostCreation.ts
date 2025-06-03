
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createUnifiedPost } from '@/services/unifiedPostService';

export interface UnifiedPostData {
  title?: string;
  content: string;
  category: string;
  urgency?: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
}

export const useUnifiedPostCreation = (onPostCreated?: () => void) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createPost = async (postData: UnifiedPostData) => {
    console.log('useUnifiedPostCreation - Creating post with data:', postData);
    
    setIsCreating(true);

    try {
      if (!postData.content?.trim()) {
        throw new Error('Post content is required');
      }

      if (!postData.category?.trim()) {
        throw new Error('Please select a category');
      }

      const postId = await createUnifiedPost(postData);
      console.log('useUnifiedPostCreation - Post created successfully with ID:', postId);

      toast({
        title: "Post created successfully! ✨",
        description: "Your post has been shared with the community.",
      });

      // Trigger the refresh callback
      if (onPostCreated) {
        console.log('useUnifiedPostCreation - Triggering onPostCreated callback');
        setTimeout(() => {
          onPostCreated();
        }, 100); // Small delay to ensure post is fully processed
      }

      return { id: postId, success: true };
    } catch (error: any) {
      console.error('useUnifiedPostCreation - Error creating post:', error);
      
      let errorMessage = 'Failed to create post';
      if (error.message.includes('category')) {
        errorMessage = 'Please select a valid category';
      } else if (error.message.includes('content')) {
        errorMessage = 'Please add content to your post';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Failed to create post",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPost,
    isCreating
  };
};
