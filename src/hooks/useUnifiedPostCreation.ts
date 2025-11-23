
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createUnifiedPost } from '@/services/unifiedPostService';
import { ContentModerationService } from '@/services/contentModerationService';
import { uploadMediaFiles } from '@/services/mediaUploadService';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from '@/contexts/AccountContext';
import { supabase } from '@/integrations/supabase/client';

export const useUnifiedPostCreation = (onPostCreated?: () => void) => {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { organizationId } = useAccount();

  const createPost = async (postData: any) => {
    setIsCreating(true);
    
    try {
      // Upload media files if any are selected
      let mediaUrls: string[] = [];
      if (postData.selectedMedia && postData.selectedMedia.length > 0) {
        console.log('Uploading media files:', postData.selectedMedia.length);
        const files = postData.selectedMedia.map((media: any) => media.file);
        const uploadResults = await uploadMediaFiles(files);
        mediaUrls = uploadResults.map(result => result.url);
        console.log('Media uploaded successfully:', mediaUrls);
      }

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

      // Create the post with uploaded media URLs and imported content
      const postId = await createUnifiedPost({
        title: postData.title,
        content: postData.description,
        category: postData.category,
        urgency: postData.urgency || 'medium',
        location: postData.location,
        tags: postData.tags || [],
        visibility: postData.visibility || 'public',
        media_urls: mediaUrls,
        importedContent: postData.importedContent,
        organizationId: organizationId || undefined,
        tagged_user_ids: postData.taggedUserIds || []
      });

      // Show success message
      toast({
        title: "Post Created!",
        description: "Your post has been published successfully."
      });

      // Get user ID for invalidations
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const userId = currentUser?.id;

      // Invalidate feed queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
      queryClient.invalidateQueries({ queryKey: ['social-feed-infinite'] });

      // Invalidate user-specific queries with correct keys
      if (userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['user-profile', userId],
          refetchType: 'active'
        });
        queryClient.invalidateQueries({ 
          queryKey: ['user-posts', userId],
          refetchType: 'active'
        });
      }

      // Call the callback
      onPostCreated?.();

      return postId;
    } catch (error: any) {
      console.error('Error creating post:', error);
      
      // Handle duplicate import error specifically
      if (error.message?.includes('duplicate key') && 
          (error.message?.includes('idx_posts_import_source_external_id') || 
           error.message?.includes('idx_posts_user_import_source_external_id'))) {
        toast({
          title: "Content Already Imported",
          description: "You've already imported this content. Each URL can only be imported once per user to prevent duplicates.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create post. Please try again.",
          variant: "destructive"
        });
      }
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
