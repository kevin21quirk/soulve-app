
import { useState, useEffect } from 'react';
import { useRealSocialFeed } from '@/hooks/useRealSocialFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import CreatePost from './CreatePost';
import SocialPostCard from './SocialPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { transformSocialPostToFeedPost } from '@/utils/socialPostTransformers';
import { supabase } from '@/integrations/supabase/client';

interface RealSocialFeedProps {
  organizationId?: string | null;
}

const RealSocialFeed = ({ organizationId }: RealSocialFeedProps) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { 
    posts, 
    loading, 
    refreshing, 
    refreshFeed, 
    handleLike, 
    handleBookmark, 
    handleShare, 
    handleAddComment 
  } = useRealSocialFeed(organizationId);

  // Enhanced real-time updates for posts and campaigns
  useEffect(() => {
    const postsChannel = supabase
      .channel('posts-realtime-feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => refreshFeed()
      )
      .subscribe();

    const campaignsChannel = supabase
      .channel('campaigns-realtime-feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        () => refreshFeed()
      )
      .subscribe();

    const interactionsChannel = supabase
      .channel('interactions-realtime-feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_interactions'
        },
        () => refreshFeed()
      )
      .subscribe();

    const reactionsChannel = supabase
      .channel('reactions-realtime-feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions'
        },
        () => refreshFeed()
      )
      .subscribe();

    const handleCampaignCreated = () => {
      setTimeout(() => refreshFeed(), 1000);
    };

    window.addEventListener('campaignCreated', handleCampaignCreated as EventListener);

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(campaignsChannel);
      supabase.removeChannel(interactionsChannel);
      supabase.removeChannel(reactionsChannel);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time updates enabled • Including campaigns and posts
          </p>
        </div>
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

      {/* Enhanced Posts Count with breakdown */}
      {posts.length > 0 && (
        <div className="text-sm text-gray-500">
          {posts.length} {posts.length === 1 ? 'item' : 'items'} in your feed
          {posts.filter(p => p.id.startsWith('campaign_')).length > 0 && (
            <span className="ml-2">
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
        <div className="space-y-6">
          {posts.map((post) => {
            const transformedPost = transformSocialPostToFeedPost(post);
            if (import.meta.env.DEV) {
              console.log('📦 [RealSocialFeed] Rendering post:', {
                rawPostId: post.id,
                rawAuthorId: post.author_id,
                transformedPostId: transformedPost.id,
                transformedAuthorId: transformedPost.authorId
              });
            }
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
      )}
    </div>
  );
};

export default RealSocialFeed;
