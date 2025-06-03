
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createUnifiedPost } from '@/services/unifiedPostService';

export interface CreatePostData {
  title?: string;
  content: string;
  category: string;
  urgency?: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
}

export const useCreatePost = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = async (postData: CreatePostData) => {
    console.log('useCreatePost - Starting with data:', postData);
    
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!postData.content?.trim()) {
        throw new Error('Post content is required');
      }

      if (!postData.category?.trim()) {
        throw new Error('Please select a category');
      }

      const postId = await createUnifiedPost(postData);

      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
      });

      return { id: postId, success: true };
    } catch (error: any) {
      console.error('useCreatePost - Error:', error);
      
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
      setIsSubmitting(false);
    }
  };

  return {
    createPost,
    isSubmitting
  };
};
