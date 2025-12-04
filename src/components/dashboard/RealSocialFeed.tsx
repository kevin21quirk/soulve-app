
import { useState, useEffect, useMemo } from 'react';
import { useRealSocialFeed } from '@/hooks/useRealSocialFeed';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useNearbyPosts } from '@/hooks/useNearbyPosts';
import { usePersonalizedFeed } from '@/hooks/usePersonalizedFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Loader2, MapPin, Sparkles, List } from 'lucide-react';
import CreatePost from './CreatePost';
import SocialPostCard from './SocialPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { transformSocialPostToFeedPost } from '@/utils/socialPostTransformers';
import LocationFilter from '@/components/feed/LocationFilter';
import ForYouFeedToggle from '@/components/feed/ForYouFeedToggle';
import { SocialPost } from '@/services/socialFeedService';

interface RealSocialFeedProps {
  organizationId?: string | null;
}

const RealSocialFeed = ({ organizationId }: RealSocialFeedProps) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [locationFilter, setLocationFilter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedRadius, setSelectedRadius] = useState(25);
  const [isPersonalized, setIsPersonalized] = useState(false);

  const { 
    posts: regularPosts, 
    loading: regularLoading, 
    refreshing, 
    refreshFeed, 
    handleLike, 
    handleBookmark, 
    handleShare, 
    handleAddComment,
    loadMore,
    hasMore
  } = useRealSocialFeed(organizationId);

  // Personalized feed query (only active when toggle is on)
  const { data: personalizedPosts = [], isLoading: personalizedLoading } = usePersonalizedFeed({
    enabled: isPersonalized && !locationFilter,
    organizationId
  });

  // Nearby posts query (only active when location filter is enabled)
  const { data: nearbyPosts = [], isLoading: nearbyLoading, error: nearbyError } = useNearbyPosts(
    locationFilter?.latitude ?? null,
    locationFilter?.longitude ?? null,
    selectedRadius
  );

  // Determine which posts to show and loading state
  const isLocationActive = locationFilter !== null;
  const loading = isLocationActive 
    ? nearbyLoading 
    : isPersonalized 
      ? personalizedLoading 
      : regularLoading;
  
  // Transform nearby posts to SocialPost format for consistent rendering
  const transformedNearbyPosts: SocialPost[] = useMemo(() => {
    if (!isLocationActive || !nearbyPosts || !nearbyPosts.length) return [];
    
    try {
      return nearbyPosts.map(post => ({
        id: post.id,
        title: post.title || '',
        content: post.content || '',
        author_id: post.author_id,
        author_name: 'Loading...',
        author_avatar: '',
        organization_id: post.organization_id,
        category: post.category || 'general',
        urgency: post.urgency || 'normal',
        location: post.location,
        tags: post.tags || [],
        media_urls: post.media_urls || [],
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        is_liked: false,
        is_bookmarked: false,
        import_source: post.import_source,
        external_id: post.external_id,
        import_metadata: post.import_metadata,
        imported_at: post.imported_at,
        distance_km: post.distance_km
      }));
    } catch (err) {
      console.error('Error transforming nearby posts:', err);
      return [];
    }
  }, [nearbyPosts, isLocationActive]);

  // If nearby query failed, fall back to regular posts
  // Priority: location > personalized > regular
  const posts = useMemo(() => {
    if (isLocationActive && !nearbyError) {
      return transformedNearbyPosts;
    }
    if (isPersonalized && personalizedPosts.length > 0) {
      return personalizedPosts;
    }
    return regularPosts;
  }, [isLocationActive, nearbyError, transformedNearbyPosts, isPersonalized, personalizedPosts, regularPosts]);

  const handleLocationChange = (location: { latitude: number; longitude: number } | null, radius: number) => {
    setLocationFilter(location);
    setSelectedRadius(radius);
  };

  // Infinite scroll hook
  const { isFetching } = useInfiniteScroll({
    hasMore,
    isLoading: loading || refreshing,
    onLoadMore: loadMore,
    threshold: 400
  });

  // Listen for campaign creation events (real-time subscriptions handled by useRealSocialFeed)
  useEffect(() => {
    const handleCampaignCreated = () => {
      refreshFeed();
    };

    window.addEventListener('campaignCreated', handleCampaignCreated as EventListener);

    return () => {
      window.removeEventListener('campaignCreated', handleCampaignCreated as EventListener);
    };
  }, [refreshFeed]);

  const handlePostCreated = () => {
    setShowCreatePost(false);
    refreshFeed();
  };

  const handleReaction = (_postId: string, _reactionType: string) => {
    // Reaction handled by usePostReactions hook
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Section - Always rendered to listen for share events */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Feed Header with enhanced status info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Community Feed</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLocationActive 
              ? `Showing posts within ${selectedRadius} km of your location`
              : isPersonalized
                ? 'Showing posts matching your interests and skills'
                : 'Real-time updates enabled • Including campaigns and posts'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LocationFilter
            isActive={isLocationActive}
            onLocationChange={handleLocationChange}
            selectedRadius={selectedRadius}
          />
          <Button 
            variant="outline" 
            onClick={refreshFeed}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Personalized Feed Toggle */}
      {!isLocationActive && (
        <ForYouFeedToggle
          isPersonalized={isPersonalized}
          onToggle={setIsPersonalized}
        />
      )}

      {/* Enhanced Posts Count with breakdown */}
      {posts.length > 0 && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{posts.length} {posts.length === 1 ? 'item' : 'items'} in your feed</span>
          {isLocationActive && (
            <span className="flex items-center gap-1 text-primary">
              <MapPin className="h-3 w-3" />
              Location filter active
            </span>
          )}
          {!isLocationActive && posts.filter(p => p.id.startsWith('campaign_')).length > 0 && (
            <span>
              ({posts.filter(p => p.id.startsWith('campaign_')).length} campaigns, {posts.filter(p => !p.id.startsWith('campaign_')).length} posts)
            </span>
          )}
        </div>
      )}

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to share something with the community!
            </p>
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
            >
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post) => {
              const transformedPost = transformSocialPostToFeedPost(post);
              return (
                <SocialPostCard
                  key={post.id}
                  post={transformedPost}
                onLike={() => handleLike(post.id)}
                onShare={() => handleShare(post.id)}
                onBookmark={() => handleBookmark(post.id)}
                onComment={(content) => handleAddComment(post.id, content)}
                onReaction={handleReaction}
              />
              );
            })}
          </div>
          
          {/* Infinite scroll loading indicator */}
          {isFetching && hasMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              You've reached the end of your feed
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RealSocialFeed;
