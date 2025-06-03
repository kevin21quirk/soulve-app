
import { useState } from 'react';
import { useRealSocialFeed } from '@/hooks/useRealSocialFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import CreatePost from './CreatePost';
import SocialPostCard from './SocialPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { transformSocialPostToFeedPost } from '@/utils/socialPostTransformers';

const RealSocialFeed = () => {
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
  } = useRealSocialFeed();

  const handlePostCreated = () => {
    console.log('RealSocialFeed - Post created, refreshing feed and closing create post');
    setShowCreatePost(false);
    // Immediate refresh to show the new post
    refreshFeed();
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
      {/* Create Post Section */}
      <Card>
        <CardContent className="p-6">
          {showCreatePost ? (
            <CreatePost 
              onPostCreated={handlePostCreated}
            />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">U</span>
                </div>
                <span className="text-gray-600">What would you like to share?</span>
              </div>
              <Button onClick={() => setShowCreatePost(true)} className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
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

      {/* Posts Count */}
      {posts.length > 0 && (
        <div className="text-sm text-gray-500">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} in your feed
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
          {posts.map((post) => (
            <SocialPostCard
              key={post.id}
              post={transformSocialPostToFeedPost(post)}
              onLike={() => handleLike(post.id)}
              onShare={() => handleShare(post.id)}
              onBookmark={() => handleBookmark(post.id)}
              onComment={(content) => handleAddComment(post.id, content)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RealSocialFeed;
