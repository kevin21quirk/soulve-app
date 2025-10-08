
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createInteraction } from '@/services/interactionRoutingService';

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
  status?: string; // Add status field for campaigns
}

export const useRealSocialFeed = (organizationId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      // Fetch both posts and campaigns with enhanced filtering
      const [postsResult, campaignsResult] = await Promise.all([
        supabase
          .from('posts')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('campaigns')
          .select('*')
          .or(`status.eq.active${user ? `,and(status.eq.draft,creator_id.eq.${user.id})` : ''}`)
          .order('created_at', { ascending: false })
      ]);

      if (postsResult.error) {
        if (import.meta.env.DEV) {
          console.error('useRealSocialFeed - Posts query error:', postsResult.error);
        }
        throw postsResult.error;
      }

      if (campaignsResult.error) {
        if (import.meta.env.DEV) {
          console.error('useRealSocialFeed - Campaigns query error:', campaignsResult.error);
        }
        throw campaignsResult.error;
      }

      const postsData = postsResult.data || [];
      const campaignsData = campaignsResult.data || [];

      // Get unique author IDs from both posts and campaigns
      const postAuthorIds = postsData.map(post => post.author_id);
      const campaignAuthorIds = campaignsData.map(campaign => campaign.creator_id);
      const authorIds = [...new Set([...postAuthorIds, ...campaignAuthorIds])];

      // Fetch profiles for these authors
      let profilesData = [];
      if (authorIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', authorIds);

        if (profilesError) {
          if (import.meta.env.DEV) {
            console.error('useRealSocialFeed - Profiles query error:', profilesError);
          }
        } else {
          profilesData = profiles || [];
        }
      }

      // Create a profiles map for quick lookup
      const profilesMap = new Map();
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Transform posts
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
          media_urls: Array.isArray(post.media_urls) ? post.media_urls : [],
          created_at: post.created_at,
          updated_at: post.updated_at,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_liked: false,
          is_bookmarked: false
        };
      });

      // Transform campaigns to look like posts with enhanced status handling
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
          status: campaign.status
        };
      });

      // Combine and sort by creation date
      const allPosts = [...transformedPosts, ...transformedCampaigns].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setPosts(allPosts);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('useRealSocialFeed - Error fetching posts:', error);
      }
      toast({
        title: "Failed to load posts",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast, user]);

  const refreshFeed = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

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
      if (import.meta.env.DEV) {
        console.error('useRealSocialFeed - Error liking post:', error);
      }
      
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
      if (import.meta.env.DEV) {
        console.error('useRealSocialFeed - Error bookmarking post:', error);
      }
      
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
      if (import.meta.env.DEV) {
        console.error('useRealSocialFeed - Error sharing post:', error);
      }
      
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
      if (import.meta.env.DEV) {
        console.error('useRealSocialFeed - Error adding comment:', error);
      }
      
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

  // Enhanced real-time subscription with better campaign handling
  useEffect(() => {
    if (!user) return;
    
    const postsChannel = supabase
      .channel('posts-realtime-enhanced')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    const campaignsChannel = supabase
      .channel('campaigns-realtime-enhanced')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaigns'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    // Listen for interactions on both tables
    const postInteractionsChannel = supabase
      .channel('post-interactions-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_interactions'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    const campaignInteractionsChannel = supabase
      .channel('campaign-interactions-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaign_interactions'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(campaignsChannel);
      supabase.removeChannel(postInteractionsChannel);
      supabase.removeChannel(campaignInteractionsChannel);
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
