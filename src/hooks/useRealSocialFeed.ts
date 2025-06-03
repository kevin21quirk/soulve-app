
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FeedPost, Comment } from '@/types/feed';

export interface DatabasePost {
  id: string;
  title: string;
  content: string;
  category: string;
  urgency: string;
  location?: string;
  tags: string[];
  media_urls: string[];
  visibility: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  author_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  interactions?: {
    like_count: number;
    comment_count: number;
    share_count: number;
    user_liked: boolean;
    user_bookmarked: boolean;
  };
  comments?: Comment[];
}

export const useRealSocialFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const transformDatabasePost = useCallback((dbPost: DatabasePost): FeedPost => {
    const authorName = dbPost.author_profile?.first_name && dbPost.author_profile?.last_name 
      ? `${dbPost.author_profile.first_name} ${dbPost.author_profile.last_name}`.trim()
      : dbPost.author_profile?.first_name || 'Anonymous';

    return {
      id: dbPost.id,
      author: authorName,
      avatar: dbPost.author_profile?.avatar_url || '',
      title: dbPost.title,
      description: dbPost.content,
      category: dbPost.category as any,
      timestamp: formatTimestamp(dbPost.created_at),
      location: dbPost.location || '',
      responses: dbPost.interactions?.comment_count || 0,
      likes: dbPost.interactions?.like_count || 0,
      shares: dbPost.interactions?.share_count || 0,
      isLiked: dbPost.interactions?.user_liked || false,
      isBookmarked: dbPost.interactions?.user_bookmarked || false,
      isShared: false,
      urgency: dbPost.urgency as any,
      tags: dbPost.tags || [],
      visibility: dbPost.visibility as any,
      media: dbPost.media_urls?.map((url, index) => ({
        id: `${dbPost.id}-media-${index}`,
        type: url.includes('.mp4') || url.includes('.mov') ? 'video' : 'image',
        url,
        filename: `media-${index}`
      })) || [],
      comments: dbPost.comments || [],
      reactions: []
    };
  }, []);

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const fetchPosts = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      // Fetch posts with author profiles and interaction counts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          author_profile:profiles!posts_author_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      if (!postsData) {
        setPosts([]);
        return;
      }

      // Get interaction counts for each post
      const postIds = postsData.map(post => post.id);
      
      const { data: interactions } = await supabase
        .from('post_interactions')
        .select('post_id, interaction_type, user_id')
        .in('post_id', postIds);

      // Get comments for posts
      const { data: comments } = await supabase
        .from('post_interactions')
        .select(`
          post_id,
          content,
          user_id,
          created_at,
          profiles!post_interactions_user_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('interaction_type', 'comment')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });

      // Process posts with interactions
      const processedPosts = postsData.map(post => {
        const postInteractions = interactions?.filter(i => i.post_id === post.id) || [];
        const postComments = comments?.filter(c => c.post_id === post.id) || [];
        
        const likeCount = postInteractions.filter(i => i.interaction_type === 'like').length;
        const shareCount = postInteractions.filter(i => i.interaction_type === 'share').length;
        const userLiked = user ? postInteractions.some(i => i.interaction_type === 'like' && i.user_id === user.id) : false;
        const userBookmarked = user ? postInteractions.some(i => i.interaction_type === 'bookmark' && i.user_id === user.id) : false;

        const processedComments: Comment[] = postComments.map((comment: any) => {
          const commentAuthor = comment.profiles?.first_name 
            ? `${comment.profiles.first_name} ${comment.profiles.last_name || ''}`.trim()
            : 'Anonymous';
          
          return {
            id: `${comment.post_id}-${comment.user_id}-${comment.created_at}`,
            author: commentAuthor,
            avatar: comment.profiles?.avatar_url || '',
            content: comment.content || '',
            timestamp: formatTimestamp(comment.created_at),
            likes: 0,
            isLiked: false
          };
        });

        return {
          ...post,
          interactions: {
            like_count: likeCount,
            comment_count: processedComments.length,
            share_count: shareCount,
            user_liked: userLiked,
            user_bookmarked: userBookmarked
          },
          comments: processedComments
        };
      });

      const feedPosts = processedPosts.map(transformDatabasePost);
      setPosts(feedPosts);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error loading posts",
        description: "Failed to load posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, transformDatabasePost, toast]);

  const handleLike = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.isLiked) {
        // Unlike
        await supabase
          .from('post_interactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('interaction_type', 'like');
      } else {
        // Like
        await supabase
          .from('post_interactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            interaction_type: 'like'
          });
      }

      // Update local state immediately
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1
            }
          : p
      ));

    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, posts, toast]);

  const handleBookmark = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.isBookmarked) {
        await supabase
          .from('post_interactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('interaction_type', 'bookmark');
      } else {
        await supabase
          .from('post_interactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            interaction_type: 'bookmark'
          });
      }

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isBookmarked: !p.isBookmarked }
          : p
      ));

    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, [user, posts]);

  const handleShare = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'share'
        });

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, shares: p.shares + 1, isShared: true }
          : p
      ));

      toast({
        title: "Post shared!",
        description: "The post has been shared successfully."
      });

    } catch (error) {
      console.error('Error sharing post:', error);
    }
  }, [user, toast]);

  const handleAddComment = useCallback(async (postId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'comment',
          content: content.trim()
        });

      // Refresh posts to get updated comments
      await fetchPosts(false);
      
      toast({
        title: "Comment added!",
        description: "Your comment has been posted."
      });

    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, fetchPosts, toast]);

  const refreshFeed = useCallback(() => {
    setRefreshing(true);
    fetchPosts(false);
  }, [fetchPosts]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to new posts
    const postsChannel = supabase
      .channel('posts-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchPosts(false);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchPosts(false);
      })
      .subscribe();

    // Subscribe to interactions
    const interactionsChannel = supabase
      .channel('interactions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_interactions'
      }, () => {
        fetchPosts(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(interactionsChannel);
    };
  }, [user, fetchPosts]);

  // Initial load
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
    handleAddComment,
    fetchPosts
  };
};
