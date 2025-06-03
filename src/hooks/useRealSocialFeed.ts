
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
      console.log('useRealSocialFeed - Fetching posts...');
      
      // First get the posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('useRealSocialFeed - Posts query error:', postsError);
        throw postsError;
      }

      console.log('useRealSocialFeed - Raw posts data:', postsData);

      if (!postsData || postsData.length === 0) {
        console.log('useRealSocialFeed - No posts found');
        setPosts([]);
        return;
      }

      // Get unique author IDs
      const authorIds = [...new Set(postsData.map(post => post.author_id))];
      console.log('useRealSocialFeed - Author IDs:', authorIds);

      // Fetch profiles for these authors
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', authorIds);

      if (profilesError) {
        console.error('useRealSocialFeed - Profiles query error:', profilesError);
        // Continue without profiles if needed
      }

      console.log('useRealSocialFeed - Profiles data:', profilesData);

      // Create a profiles map for quick lookup
      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Transform posts with author information
      const transformedPosts: SocialPost[] = postsData.map(post => {
        const profile = profilesMap.get(post.author_id);
        let authorName = 'Anonymous';
        let avatarUrl = '';

        if (profile) {
          authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
          avatarUrl = profile.avatar_url || '';
        }

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

      console.log('useRealSocialFeed - Transformed posts:', transformedPosts);
      setPosts(transformedPosts);
    } catch (error: any) {
      console.error('useRealSocialFeed - Error fetching posts:', error);
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
    console.log('useRealSocialFeed - Manual refresh triggered');
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      console.log('useRealSocialFeed - Liking post:', postId);
      
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_liked: !post.is_liked, likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1 }
          : post
      ));

      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'like'
        });

      if (error) throw error;

      toast({
        title: "Post liked!",
        description: "Your reaction has been recorded."
      });
    } catch (error: any) {
      console.error('useRealSocialFeed - Error liking post:', error);
      
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_liked: !post.is_liked, likes_count: post.is_liked ? post.likes_count + 1 : post.likes_count - 1 }
          : post
      ));
      
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
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_bookmarked: !post.is_bookmarked }
          : post
      ));

      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'bookmark'
        });

      if (error) throw error;

      toast({
        title: "Post bookmarked!",
        description: "You can find it in your saved posts."
      });
    } catch (error: any) {
      console.error('useRealSocialFeed - Error bookmarking post:', error);
      
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_bookmarked: !post.is_bookmarked }
          : post
      ));
      
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
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares_count: post.shares_count + 1 }
          : post
      ));

      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'share'
        });

      if (error) throw error;

      toast({
        title: "Post shared!",
        description: "The post has been shared with your network."
      });
    } catch (error: any) {
      console.error('useRealSocialFeed - Error sharing post:', error);
      
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares_count: post.shares_count - 1 }
          : post
      ));
      
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
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));

      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'comment',
          content: content.trim()
        });

      if (error) throw error;

      toast({
        title: "Comment added!",
        description: "Your comment has been posted."
      });
    } catch (error: any) {
      console.error('useRealSocialFeed - Error adding comment:', error);
      
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count - 1 }
          : post
      ));
      
      toast({
        title: "Failed to add comment",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Set up real-time subscription for posts
  useEffect(() => {
    if (!user) return;

    console.log('useRealSocialFeed - Setting up real-time subscription');
    
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, (payload) => {
        console.log('useRealSocialFeed - Real-time update received:', payload);
        // Refresh the feed when any post changes
        fetchPosts();
      })
      .subscribe();

    return () => {
      console.log('useRealSocialFeed - Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, fetchPosts]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      console.log('useRealSocialFeed - Initial fetch for user:', user.id);
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
