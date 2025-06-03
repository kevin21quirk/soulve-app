
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  category: string;
  urgency: string;
  location?: string;
  tags: string[];
  media_urls: string[];
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}

export const useRealSocialFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_author_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform posts with author information
      const transformedPosts: SocialPost[] = (postsData || []).map(post => {
        // Handle profiles data correctly - it's an object, not an array
        const profile = post.profiles as any;
        const authorName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous'
          : 'Anonymous';
        const avatarUrl = profile?.avatar_url || '';

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          author_id: post.author_id,
          author_name: authorName,
          author_avatar: avatarUrl,
          category: post.category,
          urgency: post.urgency,
          location: post.location,
          tags: post.tags || [],
          media_urls: post.media_urls || [],
          created_at: post.created_at,
          updated_at: post.updated_at,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_liked: false,
          is_bookmarked: false
        };
      });

      setPosts(transformedPosts);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Failed to load posts",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  const refreshFeed = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      // Insert interaction record
      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'like'
        });

      if (error) throw error;

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_liked: !post.is_liked, likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1 }
          : post
      ));

      toast({
        title: "Post liked!",
        description: "Your reaction has been recorded."
      });
    } catch (error: any) {
      console.error('Error liking post:', error);
      toast({
        title: "Failed to like post",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const handleBookmark = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'bookmark'
        });

      if (error) throw error;

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_bookmarked: !post.is_bookmarked }
          : post
      ));

      toast({
        title: "Post bookmarked!",
        description: "You can find it in your saved posts."
      });
    } catch (error: any) {
      console.error('Error bookmarking post:', error);
      toast({
        title: "Failed to bookmark post",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const handleShare = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'share'
        });

      if (error) throw error;

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares_count: post.shares_count + 1 }
          : post
      ));

      toast({
        title: "Post shared!",
        description: "The post has been shared with your network."
      });
    } catch (error: any) {
      console.error('Error sharing post:', error);
      toast({
        title: "Failed to share post",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const handleAddComment = useCallback(async (postId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'comment',
          content: content.trim()
        });

      if (error) throw error;

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));

      toast({
        title: "Comment added!",
        description: "Your comment has been posted."
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Failed to add comment",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchPosts]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, fetchPosts]);

  return {
    posts,
    loading,
    refreshing,
    refreshFeed,
    handleLike,
    handleBookmark,
    handleShare,
    handleAddComment
  };
};
