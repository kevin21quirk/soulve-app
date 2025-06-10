
import { useState } from 'react';
import { useRealSocialFeed } from '@/hooks/useRealSocialFeed';
import { transformSocialPostToFeedPost } from '@/utils/socialPostTransformers';
import FeedContent from './FeedContent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const EnhancedFeedContainer = () => {
  const { 
    posts, 
    loading, 
    refreshing, 
    refreshFeed, 
    handleLike, 
    handleBookmark, 
    handleShare, 
    handleAddComment 
  } = useRealSocialFeed();

  // Transform SocialPost to FeedPost format
  const transformedPosts = posts.map(post => transformSocialPostToFeedPost(post));

  const handleRefresh = () => {
    refreshFeed();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time updates • {posts.length} posts
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <FeedContent
        posts={transformedPosts}
        isLoading={loading}
        onLike={handleLike}
        onShare={handleShare}
        onRespond={() => {}}
        onBookmark={handleBookmark}
        onReaction={() => {}}
        onAddComment={handleAddComment}
        onLikeComment={() => {}}
      />
    </div>
  );
};

export default EnhancedFeedContainer;
