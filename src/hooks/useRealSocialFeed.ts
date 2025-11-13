
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
  status?: string;
  import_source?: string | null;
  external_id?: string | null;
  import_metadata?: {
    sourceAuthor?: string;
    sourceTitle?: string;
    thumbnailUrl?: string;
  } | null;
  imported_at?: string | null;
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
    try {
      // Build posts query with organization context filtering
      let postsQuery = supabase
        .from('posts')
        .select('*')
        .eq('is_active', true);

      // Filter by organization context
      if (organizationId) {
        // When viewing organization profile, only show posts by that organization
        postsQuery = postsQuery.eq('organization_id', organizationId);
      } else {
        // When viewing personal feed, show personal posts (no organization_id) and posts from followed orgs
        postsQuery = postsQuery.is('organization_id', null);
      }

      // Add pagination
      postsQuery = postsQuery
        .order('created_at', { ascending: false })
        .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

      // Build campaigns query with organization context filtering
      let campaignsQuery = supabase
        .from('campaigns')
        .select('*');

      if (organizationId) {
        // For organization context, show campaigns created by org members
        campaignsQuery = campaignsQuery.or(`status.eq.active${user ? `,and(status.eq.draft,creator_id.eq.${user.id})` : ''}`);
      } else {
        campaignsQuery = campaignsQuery.or(`status.eq.active${user ? `,and(status.eq.draft,creator_id.eq.${user.id})` : ''}`);
      }

      // Add pagination to campaigns
      campaignsQuery = campaignsQuery
        .order('created_at', { ascending: false })
        .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

      const [postsResult, campaignsResult] = await Promise.all([
        postsQuery,
        campaignsQuery
      ]);

      if (postsResult.error) {
        logger.error('useRealSocialFeed - Posts query error', postsResult.error);
        throw postsResult.error;
      }

      if (campaignsResult.error) {
        logger.error('useRealSocialFeed - Campaigns query error', campaignsResult.error);
        throw campaignsResult.error;
      }

      const postsData = postsResult.data || [];
      const campaignsData = campaignsResult.data || [];

      // Get unique author IDs and organization IDs
      const postAuthorIds = postsData.map(post => post.author_id);
      const campaignAuthorIds = campaignsData.map(campaign => campaign.creator_id);
      const authorIds = [...new Set([...postAuthorIds, ...campaignAuthorIds])];
      
      const orgIds = [...new Set(postsData.map(post => post.organization_id).filter(Boolean))];

      // Fetch profiles and organizations in parallel
      const [profilesData, orgsData] = await Promise.all([
        authorIds.length > 0
          ? supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .in('id', authorIds)
              .then(({ data, error }) => {
                if (error) {
                  logger.error('useRealSocialFeed - Profiles query error', error);
                }
                return data || [];
              })
          : Promise.resolve([]),
        orgIds.length > 0
          ? supabase
              .from('organizations')
              .select('id, name, avatar_url')
              .in('id', orgIds)
              .then(({ data, error }) => {
                if (error) {
                  logger.error('useRealSocialFeed - Organizations query error', error);
                }
                return data || [];
              })
          : Promise.resolve([])
      ]);

      // Create maps for quick lookup
      const profilesMap = new Map();
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      const orgsMap = new Map();
      orgsData.forEach(org => {
        orgsMap.set(org.id, org);
      });

      // Transform posts
      const transformedPosts: SocialPost[] = postsData.map(post => {
        const profile = profilesMap.get(post.author_id);
        const org = post.organization_id ? orgsMap.get(post.organization_id) : null;
        
        let authorName = 'Anonymous';
        let avatarUrl = '';

        // If post is by organization, use org details; otherwise use profile
        if (org) {
          authorName = org.name || 'Organization';
          avatarUrl = org.avatar_url || '';
        } else if (profile) {
          authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
          avatarUrl = profile.avatar_url || '';
        }

        const transformed = {
          id: post.id,
          title: post.title,
          content: post.content,
          author_id: post.author_id,
          author_name: authorName,
          author_avatar: avatarUrl,
          organization_id: post.organization_id || null,
          organization_name: org?.name,
          organization_logo: org?.avatar_url,
          category: post.category,
          urgency: post.urgency,
          location: post.location,
          tags: post.tags || [],
          media_urls: Array.isArray(post.media_urls) ? post.media_urls : [],
          created_at: post.created_at,
          updated_at: post.updated_at,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_liked: false,
          is_bookmarked: false,
          import_source: post.import_source || null,
          external_id: post.external_id || null,
          import_metadata: post.import_metadata ? (post.import_metadata as any) : null,
          imported_at: post.imported_at || null
        };

        // Log imported content posts in dev mode
        if (transformed.import_source) {
          logger.debug('Post with imported content', {
            id: transformed.id,
            import_source: transformed.import_source,
            external_id: transformed.external_id,
            has_metadata: !!transformed.import_metadata
          });
        }

        return transformed;
      });

      // Transform campaigns to look like posts with enhanced status handling and campaign data
      const transformedCampaigns: SocialPost[] = campaignsData.map(campaign => {
        const profile = profilesMap.get(campaign.creator_id);
        let authorName = 'Anonymous';
        let avatarUrl = '';

        if (profile) {
          authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
          avatarUrl = profile.avatar_url || '';
        }

        // Handle gallery_images properly
        let mediaUrls: string[] = [];
        if (campaign.gallery_images) {
          if (Array.isArray(campaign.gallery_images)) {
            mediaUrls = campaign.gallery_images
              .map((item: any) => typeof item === 'string' ? item : String(item))
              .filter((url: string) => typeof url === 'string' && url.length > 0);
          } else if (typeof campaign.gallery_images === 'string') {
            try {
              const parsed = JSON.parse(campaign.gallery_images);
              if (Array.isArray(parsed)) {
                mediaUrls = parsed
                  .map((item: any) => typeof item === 'string' ? item : String(item))
                  .filter((url: string) => typeof url === 'string' && url.length > 0);
              }
            } catch {
              mediaUrls = [];
            }
          }
        }

        // Create campaign content with status indicator for drafts
        let content = `${campaign.description}\n\nGoal: $${campaign.goal_amount || 0}\nCurrent: $${campaign.current_amount || 0}`;
        if (campaign.status === 'draft' && user && campaign.creator_id === user.id) {
          content = `[DRAFT] ${content}\n\n⚠️ This campaign is still in draft mode. It's only visible to you.`;
        }

        return {
          id: `campaign_${campaign.id}`,
          title: campaign.status === 'draft' && user && campaign.creator_id === user.id 
            ? `[DRAFT] ${campaign.title}` 
            : campaign.title,
          content,
          author_id: campaign.creator_id,
          author_name: authorName,
          author_avatar: avatarUrl,
          category: 'fundraising',
          urgency: campaign.urgency || 'medium',
          location: campaign.location,
          tags: campaign.tags || [],
          media_urls: mediaUrls,
          created_at: campaign.created_at,
          updated_at: campaign.updated_at,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_liked: false,
          is_bookmarked: false,
          status: campaign.status,
          // Campaign-specific data for enhanced display
          campaignId: campaign.id,
          goalAmount: campaign.goal_amount,
          currentAmount: campaign.current_amount,
          endDate: campaign.end_date,
          campaignCategory: campaign.category,
          currency: campaign.currency || 'USD',
        } as any;
      });

      // Combine and sort by creation date
      const allPosts = [...transformedPosts, ...transformedCampaigns].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Check if we have more posts to load
      setHasMore(allPosts.length === POSTS_PER_PAGE * 2);
      
      // Append to existing posts if loading more, otherwise replace
      setPosts(prev => page === 0 ? allPosts : [...prev, ...allPosts]);
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
  }, [toast, user, organizationId]);

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
