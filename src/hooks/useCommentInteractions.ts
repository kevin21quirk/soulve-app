import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from '@/contexts/AccountContext';
import { useToast } from '@/hooks/use-toast';

export const useCommentInteractions = () => {
  const { user } = useAuth();
  const { organizationId } = useAccount();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((commentId: string, action: string, loading: boolean) => {
    const key = `${commentId}_${action}`;
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const isLoading = useCallback((commentId: string, action: string) => {
    const key = `${commentId}_${action}`;
    return loadingStates[key] || false;
  }, [loadingStates]);

  const likeComment = useCallback(async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like comments",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(commentId, 'like')) return false;

    try {
      setLoading(commentId, 'like', true);

      const { data, error } = await supabase
        .rpc('toggle_comment_like', { target_comment_id: commentId });

      if (error) throw error;

      toast({
        title: data ? "Comment liked!" : "Like removed",
        description: data ? "Your reaction has been recorded" : "Your like has been removed"
      });

      return data;
    } catch (error: any) {
      console.error('Error liking comment:', error);
      toast({
        title: "Failed to like comment",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(commentId, 'like', false);
    }
  }, [user, toast, isLoading, setLoading]);

  const replyToComment = useCallback(async (
    postId: string, 
    parentCommentId: string, 
    content: string
  ) => {
    if (!user || !content.trim()) {
      toast({
        title: "Invalid reply",
        description: "Please enter a reply",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(parentCommentId, 'reply')) return false;

    try {
      setLoading(parentCommentId, 'reply', true);

      const actualPostId = postId.startsWith('campaign_') 
        ? postId.replace('campaign_', '') 
        : postId;

      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: actualPostId,
          user_id: user.id,
          interaction_type: 'comment',
          content: content.trim(),
          parent_comment_id: parentCommentId,
          ...(organizationId && { organization_id: organizationId })
        });

      if (error) throw error;

      toast({
        title: "Reply posted!",
        description: "Your reply has been added"
      });

      return true;
    } catch (error: any) {
      console.error('Error replying to comment:', error);
      toast({
        title: "Failed to post reply",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(parentCommentId, 'reply', false);
    }
  }, [user, organizationId, toast, isLoading, setLoading]);

  const editComment = useCallback(async (commentId: string, newContent: string) => {
    if (!user || !newContent.trim()) {
      toast({
        title: "Invalid content",
        description: "Please enter comment text",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(commentId, 'edit')) return false;

    try {
      setLoading(commentId, 'edit', true);

      const { error } = await supabase
        .from('post_interactions')
        .update({
          content: newContent.trim(),
          edited_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', user.id); // Ensure user owns the comment

      if (error) throw error;

      toast({
        title: "Comment updated!",
        description: "Your changes have been saved"
      });

      return true;
    } catch (error: any) {
      console.error('Error editing comment:', error);
      toast({
        title: "Failed to edit comment",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(commentId, 'edit', false);
    }
  }, [user, toast, isLoading, setLoading]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete comments",
        variant: "destructive"
      });
      return false;
    }

    if (isLoading(commentId, 'delete')) return false;

    try {
      setLoading(commentId, 'delete', true);

      // Soft delete - mark as deleted instead of removing
      const { error } = await supabase
        .from('post_interactions')
        .update({ 
          is_deleted: true,
          content: '[deleted]'
        })
        .eq('id', commentId)
        .eq('user_id', user.id); // Ensure user owns the comment

      if (error) throw error;

      toast({
        title: "Comment deleted",
        description: "Your comment has been removed"
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Failed to delete comment",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(commentId, 'delete', false);
    }
  }, [user, toast, isLoading, setLoading]);

  return {
    likeComment,
    replyToComment,
    editComment,
    deleteComment,
    isLoading
  };
};