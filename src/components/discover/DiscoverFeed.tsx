
import { useState } from 'react';
import { useRealSocialFeed } from '@/hooks/useRealSocialFeed';
import { transformSocialPostToFeedPost } from '@/utils/socialPostTransformers';
import FeedContent from '@/components/dashboard/social-feed/FeedContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DiscoverFeed = () => {
  const [activeFilter, setActiveFilter] = useState('all');
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

  // Filter posts based on active filter
  const filteredPosts = transformedPosts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.category === activeFilter;
  });

  const filters = [
    { id: 'all', label: 'All Posts', count: transformedPosts.length },
    { id: 'help-needed', label: 'Help Needed', count: transformedPosts.filter(p => p.category === 'help-needed').length },
    { id: 'help-offered', label: 'Help Offered', count: transformedPosts.filter(p => p.category === 'help-offered').length },
    { id: 'announcement', label: 'Announcements', count: transformedPosts.filter(p => p.category === 'announcement').length },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Discover Posts</span>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshFeed}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <Badge
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label} ({filter.count})
              </Badge>
            ))}
          </div>

          <FeedContent
            posts={filteredPosts}
            isLoading={loading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={() => {}}
            onBookmark={handleBookmark}
            onReaction={() => {}}
            onAddComment={handleAddComment}
            onLikeComment={() => {}}
            emptyMessage={`No ${activeFilter === 'all' ? '' : activeFilter.replace('-', ' ')} posts found. Check back later!`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverFeed;
