import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SocialPost } from '@/services/socialFeedService';

interface PersonalizedFeedOptions {
  enabled?: boolean;
  organizationId?: string | null;
}

/**
 * Hook to fetch personalized feed based on user interests and skills
 */
export const usePersonalizedFeed = (options: PersonalizedFeedOptions = {}) => {
  const { user } = useAuth();
  const { enabled = true, organizationId } = options;

  return useQuery({
    queryKey: ['personalized-feed', user?.id, organizationId],
    queryFn: async (): Promise<SocialPost[]> => {
      if (!user?.id) return [];

      // Get user's interests and skills from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('interests, skills, location')
        .eq('id', user.id)
        .single();

      const interests = profile?.interests || [];
      const skills = profile?.skills || [];
      const userLocation = profile?.location;

      // Fetch posts with filtering
      let postsQuery = supabase
        .from('posts')
        .select('*')
        .eq('is_active', true);

      if (organizationId) {
        postsQuery = postsQuery.eq('organization_id', organizationId);
      }

      postsQuery = postsQuery
        .order('created_at', { ascending: false })
        .limit(50);

      const { data: posts, error } = await postsQuery;

      if (error) {
        console.error('[usePersonalizedFeed] Error fetching posts:', error);
        return [];
      }

      // Get author profiles
      const authorIds = [...new Set(posts?.map(p => p.author_id) || [])];
      const orgIds = [...new Set(posts?.map(p => p.organization_id).filter(Boolean) || [])] as string[];

      const [profilesData, orgsData] = await Promise.all([
        authorIds.length > 0
          ? supabase.from('profiles').select('id, first_name, last_name, avatar_url').in('id', authorIds)
          : Promise.resolve({ data: [] }),
        orgIds.length > 0
          ? supabase.from('organizations').select('id, name, avatar_url').in('id', orgIds)
          : Promise.resolve({ data: [] })
      ]);

      const profilesMap = new Map((profilesData.data || []).map(p => [p.id, p]));
      const orgsMap = new Map((orgsData.data || []).map(o => [o.id, o]));

      // Score and transform posts based on user preferences
      const scoredPosts = (posts || []).map(post => {
        let relevanceScore = 0;
        const matchedInterests: string[] = [];
        const matchedSkills: string[] = [];

        // Check tag matches with interests
        const postTags = (post.tags || []).map((t: string) => t.toLowerCase());
        const postCategory = post.category?.toLowerCase() || '';
        const postTitle = post.title?.toLowerCase() || '';
        const postContent = post.content?.toLowerCase() || '';

        interests.forEach(interest => {
          const lowerInterest = interest.toLowerCase();
          if (postTags.some(tag => tag.includes(lowerInterest) || lowerInterest.includes(tag))) {
            relevanceScore += 3;
            matchedInterests.push(interest);
          }
          if (postCategory.includes(lowerInterest)) {
            relevanceScore += 2;
            matchedInterests.push(interest);
          }
          if (postTitle.includes(lowerInterest) || postContent.includes(lowerInterest)) {
            relevanceScore += 1;
            matchedInterests.push(interest);
          }
        });

        // Check skill matches (for help-needed posts)
        if (post.category === 'help-needed') {
          skills.forEach(skill => {
            const lowerSkill = skill.toLowerCase();
            if (postTags.some(tag => tag.includes(lowerSkill) || lowerSkill.includes(tag))) {
              relevanceScore += 4; // Higher weight for skill matches
              matchedSkills.push(skill);
            }
            if (postTitle.includes(lowerSkill) || postContent.includes(lowerSkill)) {
              relevanceScore += 2;
              matchedSkills.push(skill);
            }
          });
        }

        // Location boost
        if (userLocation && post.location) {
          const postLocation = post.location.toLowerCase();
          if (postLocation.includes(userLocation.toLowerCase())) {
            relevanceScore += 2;
          }
        }

        // Get author info
        const profile = profilesMap.get(post.author_id);
        const org = post.organization_id ? orgsMap.get(post.organization_id) : null;

        let authorName = 'Anonymous';
        let avatarUrl = '';

        if (org) {
          authorName = org.name || 'Organisation';
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
          relevanceScore,
          matchedInterests: [...new Set(matchedInterests)],
          matchedSkills: [...new Set(matchedSkills)]
        } as SocialPost & { relevanceScore: number; matchedInterests: string[]; matchedSkills: string[] };
      });

      // Sort by relevance score first, then by date
      scoredPosts.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return scoredPosts;
    },
    enabled: enabled && !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get user's interests-based feed suggestions
 */
export const useFeedSuggestions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['feed-suggestions', user?.id],
    queryFn: async () => {
      if (!user?.id) return { interests: [], skills: [], hasPreferences: false };

      const { data: profile } = await supabase
        .from('profiles')
        .select('interests, skills')
        .eq('id', user.id)
        .single();

      return {
        interests: profile?.interests || [],
        skills: profile?.skills || [],
        hasPreferences: (profile?.interests?.length || 0) > 0 || (profile?.skills?.length || 0) > 0
      };
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000,
  });
};
