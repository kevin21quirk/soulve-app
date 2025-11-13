import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

const POSTS_PER_PAGE = 20;

/**
 * Fetch posts and campaigns with organization filtering
 */
const fetchSocialFeed = async (
  organizationId: string | null | undefined,
  page: number,
  userId?: string
): Promise<SocialPost[]> => {
  logger.debug('[socialFeedService] Fetching feed', { organizationId, page });

  // Build posts query with organization context filtering
  let postsQuery = supabase
    .from('posts')
    .select('*')
    .eq('is_active', true);

  // Filter by organization context
  if (organizationId) {
    postsQuery = postsQuery.eq('organization_id', organizationId);
  } else {
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
    campaignsQuery = campaignsQuery.or(`status.eq.active${userId ? `,and(status.eq.draft,creator_id.eq.${userId})` : ''}`);
  } else {
    campaignsQuery = campaignsQuery.or(`status.eq.active${userId ? `,and(status.eq.draft,creator_id.eq.${userId})` : ''}`);
  }

  campaignsQuery = campaignsQuery
    .order('created_at', { ascending: false })
    .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

  const [postsResult, campaignsResult] = await Promise.all([
    postsQuery,
    campaignsQuery
  ]);

  if (postsResult.error) {
    logger.error('[socialFeedService] Posts query error', postsResult.error);
    throw postsResult.error;
  }

  if (campaignsResult.error) {
    logger.error('[socialFeedService] Campaigns query error', campaignsResult.error);
    throw campaignsResult.error;
  }

  const postsData = postsResult.data || [];
  const campaignsData = campaignsResult.data || [];

  // Get unique author IDs and organization IDs
  const postAuthorIds = postsData.map(post => post.author_id);
  const campaignAuthorIds = campaignsData.map(campaign => campaign.creator_id);
  const authorIds = [...new Set([...postAuthorIds, ...campaignAuthorIds])];

  const postOrgIds = postsData.map(post => post.organization_id).filter(Boolean);
  const orgIds = [...new Set([...postOrgIds])] as string[];

  // Fetch profiles and organizations in parallel
  const [profilesData, orgsData] = await Promise.all([
    authorIds.length > 0
      ? supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', authorIds)
          .then(({ data, error }) => {
            if (error) logger.error('[socialFeedService] Profiles query error', error);
            return data || [];
          })
      : Promise.resolve([]),
    orgIds.length > 0
      ? supabase
          .from('organizations')
          .select('id, name, avatar_url')
          .in('id', orgIds)
          .then(({ data, error }) => {
            if (error) logger.error('[socialFeedService] Organizations query error', error);
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

    if (org) {
      authorName = org.name || 'Organization';
      avatarUrl = org.avatar_url || '';
    } else if (profile) {
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
  });

  // Transform campaigns
  const transformedCampaigns: SocialPost[] = campaignsData.map(campaign => {
    const profile = profilesMap.get(campaign.creator_id);
    let authorName = 'Anonymous';
    let avatarUrl = '';

    if (profile) {
      authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
      avatarUrl = profile.avatar_url || '';
    }

    return {
      id: campaign.id,
      title: campaign.title,
      content: campaign.description || '',
      author_id: campaign.creator_id,
      author_name: authorName,
      author_avatar: avatarUrl,
      category: 'campaign',
      urgency: 'normal',
      location: campaign.location,
      tags: campaign.tags || [],
      media_urls: [],
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      is_liked: false,
      is_bookmarked: false,
      status: campaign.status || 'active'
    };
  });

  const allPosts = [...transformedPosts, ...transformedCampaigns].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  logger.debug('[socialFeedService] Fetched posts', { count: allPosts.length });
  return allPosts;
};

/**
 * Hook for fetching social feed with React Query caching
 */
export const useSocialFeed = (organizationId?: string | null, userId?: string) => {
  return useQuery({
    queryKey: ['social-feed', organizationId],
    queryFn: () => fetchSocialFeed(organizationId, 0, userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for infinite scroll feed
 */
export const useInfiniteSocialFeed = (organizationId?: string | null, userId?: string) => {
  return useInfiniteQuery({
    queryKey: ['social-feed-infinite', organizationId],
    queryFn: ({ pageParam = 0 }) => fetchSocialFeed(organizationId, pageParam, userId),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
