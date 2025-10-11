
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from '@/contexts/AccountContext';

export const usePostInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { organizationId } = useAccount();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((postId: string, action: string, loading: boolean) => {
    const key = `${postId}_${action}`;
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const isLoading = useCallback((postId: string, action: string) => {
    const key = `${postId}_${action}`;
    return loadingStates[key] || false;
  }, [loadingStates]);

  const handleLike = useCallback(async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(postId, 'like')) return false;

    try {
      setLoading(postId, 'like', true);

      // Extract actual post ID if it's a campaign
      const actualPostId = postId.startsWith('campaign_') ? postId.replace('campaign_', '') : postId;

      // Check if already liked (either by user or organization)
      let query = supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', actualPostId)
        .eq('interaction_type', 'like');
      
      // Check based on context
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.eq('user_id', user.id).is('organization_id', null);
      }
      
      const { data: existingLike, error: checkError } = await query.maybeSingle();

      if (checkError) {
        console.error('Error checking existing like:', checkError);
        throw checkError;
      }

      if (existingLike) {
        // Unlike - remove the like
        const { error: deleteError } = await supabase
          .from('post_interactions')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) throw deleteError;
        
        toast({
          title: "Post unliked",
          description: "Your like has been removed"
        });
        return false; // Now unliked
      } else {
        // Like - add new like
        const interactionData: any = {
          post_id: actualPostId,
          interaction_type: 'like'
        };
        
        if (organizationId) {
          interactionData.organization_id = organizationId;
        } else {
          interactionData.user_id = user.id;
        }

        const { error: insertError } = await supabase
          .from('post_interactions')
          .insert(interactionData);

        if (insertError) throw insertError;
        
        toast({
          title: "Post liked!",
          description: "Your reaction has been recorded"
        });
        return true; // Now liked
      }
    } catch (error: any) {
      console.error('Error handling like:', error);
      toast({
        title: "Failed to like post",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(postId, 'like', false);
    }
  }, [user, toast, isLoading, setLoading]);

  const handleBookmark = useCallback(async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark posts",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(postId, 'bookmark')) return false;

    try {
      setLoading(postId, 'bookmark', true);

      const actualPostId = postId.startsWith('campaign_') ? postId.replace('campaign_', '') : postId;

      // Check if already bookmarked (either by user or organization)
      let query = supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', actualPostId)
        .eq('interaction_type', 'bookmark');
      
      // Check based on context
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.eq('user_id', user.id).is('organization_id', null);
      }
      
      const { data: existingBookmark, error: checkError } = await query.maybeSingle();

      if (checkError) {
        console.error('Error checking existing bookmark:', checkError);
        throw checkError;
      }

      if (existingBookmark) {
        // Remove bookmark
        const { error: deleteError } = await supabase
          .from('post_interactions')
          .delete()
          .eq('id', existingBookmark.id);

        if (deleteError) throw deleteError;
        
        toast({
          title: "Bookmark removed",
          description: "Post removed from your saved items"
        });
        return false;
      } else {
        // Add bookmark
        const interactionData: any = {
          post_id: actualPostId,
          interaction_type: 'bookmark'
        };
        
        if (organizationId) {
          interactionData.organization_id = organizationId;
        } else {
          interactionData.user_id = user.id;
        }

        const { error: insertError } = await supabase
          .from('post_interactions')
          .insert(interactionData);

        if (insertError) throw insertError;
        
        toast({
          title: "Post bookmarked!",
          description: "You can find it in your saved posts"
        });
        return true;
      }
    } catch (error: any) {
      console.error('Error handling bookmark:', error);
      toast({
        title: "Failed to bookmark post",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(postId, 'bookmark', false);
    }
  }, [user, toast, isLoading, setLoading]);

  const handleAddComment = useCallback(async (postId: string, content: string) => {
    if (!user || !content.trim()) {
      toast({
        title: "Invalid comment",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(postId, 'comment')) return false;

    try {
      setLoading(postId, 'comment', true);

      const actualPostId = postId.startsWith('campaign_') ? postId.replace('campaign_', '') : postId;

      const interactionData: any = {
        post_id: actualPostId,
        interaction_type: 'comment',
        content: content.trim()
      };
      
      if (organizationId) {
        interactionData.organization_id = organizationId;
      } else {
        interactionData.user_id = user.id;
      }

      const { error } = await supabase
        .from('post_interactions')
        .insert(interactionData);

      if (error) throw error;

      toast({
        title: "Comment added!",
        description: "Your comment has been posted"
      });
      return true;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Failed to add comment",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(postId, 'comment', false);
    }
  }, [user, toast, isLoading, setLoading]);

  const handleShare = useCallback(async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share posts",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(postId, 'share')) return false;

    try {
      setLoading(postId, 'share', true);

      const actualPostId = postId.startsWith('campaign_') ? postId.replace('campaign_', '') : postId;

      const interactionData: any = {
        post_id: actualPostId,
        interaction_type: 'share'
      };
      
      if (organizationId) {
        interactionData.organization_id = organizationId;
      } else {
        interactionData.user_id = user.id;
      }

      const { error } = await supabase
        .from('post_interactions')
        .insert(interactionData);

      if (error) throw error;

      toast({
        title: "Post shared!",
        description: "The post has been shared with your network"
      });
      return true;
    } catch (error: any) {
      console.error('Error sharing post:', error);
      toast({
        title: "Failed to share post",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(postId, 'share', false);
    }
  }, [user, toast, isLoading, setLoading]);

  // Placeholder methods for interface compatibility
  const handleRespond = useCallback(async (postId: string) => {
    return true;
  }, []);

  const handleReaction = useCallback(async (postId: string, reactionType: string) => {
    return true;
  }, []);

  const handleLikeComment = useCallback(async (postId: string, commentId: string) => {
    return true;
  }, []);

  const handleCommentReaction = useCallback(async (postId: string, commentId: string, reactionType: string) => {
    return true;
  }, []);

  return {
    handleLike,
    handleBookmark,
    handleAddComment,
    handleShare,
    handleRespond,
    handleReaction,
    handleLikeComment,
    handleCommentReaction,
    isLoading
  };
};
