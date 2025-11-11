
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createInteraction } from '@/services/interactionRoutingService';
import { devLogger as logger } from '@/utils/logger';

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  organization_id?: string | null;
  organization_name?: string;
  organization_logo?: string;
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
  reactions: any[];
  status?: string;
  import_source?: string | null;
  external_id?: string | null;
  import_metadata?: {
    sourceAuthor?: string;
    sourceTitle?: string;
    thumbnailUrl?: string;
  } | null;
  imported_at?: string | null;
  // Campaign-specific fields
  goalAmount?: number;
  currentAmount?: number;
  endDate?: string | null;
  campaignCategory?: string;
  currency?: string;
  campaignStats?: {
    donorCount: number;
    recentDonations24h: number;
    recentDonors: any[];
    averageDonation: number;
    progressPercentage: number;
    daysRemaining: number | null;
    isOngoing: boolean;
  };
}

export const useRealSocialFeed = (organizationId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const POSTS_PER_PAGE = 20;

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    
    try {
      // Use optimized RPC function that fetches everything in one query
      const { data, error } = await supabase
        .rpc('get_feed_with_stats', {
          p_user_id: user.id,
          p_organization_id: organizationId || null,
          p_limit: POSTS_PER_PAGE,
          p_offset: page * POSTS_PER_PAGE
        });

      if (error) {
        logger.error('useRealSocialFeed - RPC error', error);
        throw error;
      }

      const feedData = data || [];

      // Transform the data to match SocialPost interface
      const transformedPosts: SocialPost[] = feedData.map((item: any) => {
        const isCampaign = item.status !== null;
        
        // Base post data
        const post: SocialPost = {
          id: isCampaign ? `campaign_${item.id}` : item.id,
          title: item.title,
          content: item.content,
          author_id: item.author_id,
          author_name: item.author_name,
          author_avatar: item.author_avatar || '',
          organization_id: item.organization_id,
          organization_name: item.organization_name,
          organization_logo: item.organization_logo,
          category: item.category,
          urgency: item.urgency,
          location: item.location,
          tags: item.tags || [],
          media_urls: item.media_urls || [],
          created_at: item.created_at,
          updated_at: item.updated_at,
          likes_count: Number(item.likes_count) || 0,
          comments_count: Number(item.comments_count) || 0,
          shares_count: Number(item.shares_count) || 0,
          is_liked: item.is_liked || false,
          is_bookmarked: item.is_bookmarked || false,
          reactions: item.reactions || [],
          import_source: item.import_source,
          external_id: item.external_id,
          import_metadata: item.import_metadata,
          imported_at: item.imported_at
        };

        // Add campaign-specific data if it's a campaign
        if (isCampaign) {
          post.status = item.status;
          post.goalAmount = item.goal_amount;
          post.currentAmount = item.current_amount;
          post.endDate = item.end_date;
          post.campaignCategory = item.campaign_category;
          post.currency = item.currency;
          post.campaignStats = {
            donorCount: Number(item.donor_count) || 0,
            recentDonations24h: Number(item.recent_donations_24h) || 0,
            recentDonors: item.recent_donors || [],
            averageDonation: Number(item.average_donation) || 0,
            progressPercentage: Number(item.progress_percentage) || 0,
            daysRemaining: item.days_remaining,
            isOngoing: item.end_date === null
          };
        }

        return post;
      });

      // Check if we have more posts to load
      setHasMore(transformedPosts.length === POSTS_PER_PAGE);
      
      // Append to existing posts if loading more, otherwise replace
      setPosts(prev => page === 0 ? transformedPosts : [...prev, ...transformedPosts]);
    } catch (error: any) {
      logger.error('useRealSocialFeed - Error fetching posts', error);
      toast({
        title: "Failed to load posts",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, toast, organizationId, page]);

  const refreshFeed = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!loading && !refreshing && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, refreshing, hasMore]);

  // Enhanced interaction handlers with better campaign ID handling
  const handleLike = useCallback(async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to interact with posts.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_liked: !post.is_liked, likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1 }
          : post
      ));

      // Use routing service to handle both posts and campaigns
      await createInteraction(postId, user.id, 'like', undefined, organizationId);

      toast({
        title: "Post liked!",
        description: "Your reaction has been recorded."
      });
    } catch (error: any) {
      logger.error('useRealSocialFeed - Error liking post', error);
      
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
  }, [user, toast, organizationId]);

  const handleBookmark = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_bookmarked: !post.is_bookmarked }
          : post
      ));

      // Use routing service to handle both posts and campaigns
      await createInteraction(postId, user.id, 'bookmark', undefined, organizationId);

      toast({
        title: "Post bookmarked!",
        description: "You can find it in your saved posts."
      });
    } catch (error: any) {
      logger.error('useRealSocialFeed - Error bookmarking post', error);
      
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
  }, [user, toast, organizationId]);

  const handleShare = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares_count: post.shares_count + 1 }
          : post
      ));

      // Use routing service to handle both posts and campaigns
      await createInteraction(postId, user.id, 'share', undefined, organizationId);

      toast({
        title: "Post shared!",
        description: "The post has been shared with your network."
      });
    } catch (error: any) {
      logger.error('useRealSocialFeed - Error sharing post', error);
      
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
  }, [user, toast, organizationId]);

  const handleAddComment = useCallback(async (postId: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment.",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) return;

    try {
      // Optimistically update the UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));

      // Use routing service to handle both posts and campaigns
      await createInteraction(postId, user.id, 'comment', content.trim(), organizationId);

      toast({
        title: "Comment added!",
        description: organizationId ? "Comment posted on behalf of the organization." : "Your comment has been posted."
      });
    } catch (error: any) {
      logger.error('useRealSocialFeed - Error adding comment', error);
      
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count - 1 }
          : post
      ));
      
      toast({
        title: "Failed to add comment",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  }, [user, toast, organizationId]);

  // Consolidated real-time subscription - single multiplexed channel
  useEffect(() => {
    if (!user) return;
    
    // Debounce refresh to prevent excessive refetches
    let refreshTimeout: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        setPage(0);
        fetchPosts();
      }, 500);
    };
    
    // Single channel for all feed updates
    const feedChannel = supabase
      .channel('social-feed-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, debouncedRefresh)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaigns'
      }, debouncedRefresh)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_interactions'
      }, debouncedRefresh)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaign_interactions'
      }, debouncedRefresh)
      .subscribe();

    return () => {
      clearTimeout(refreshTimeout);
      supabase.removeChannel(feedChannel);
    };
  }, [user, fetchPosts]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, fetchPosts]);

  // Fetch more when page changes
  useEffect(() => {
    if (user && page > 0) {
      fetchPosts();
    }
  }, [page, user, fetchPosts]);

  return {
    posts,
    loading,
    refreshing,
    refreshFeed,
    handleLike,
    handleBookmark,
    handleShare,
    handleAddComment,
    loadMore,
    hasMore
  };
};
