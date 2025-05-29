
import { useState, useCallback } from "react";
import { FeedPost } from "@/types/feed";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import MobilePostCard from "./MobilePostCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Users, Zap } from "lucide-react";

interface MobileFeedContentProps {
  posts: FeedPost[];
  isLoading: boolean;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
}

const MobileFeedContent = ({
  posts,
  isLoading,
  onLike,
  onShare,
  onRespond,
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment,
  onCommentReaction
}: MobileFeedContentProps) => {
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 5));
  const [hasMore, setHasMore] = useState(posts.length > 5);

  const loadMorePosts = useCallback(() => {
    const currentLength = displayedPosts.length;
    const nextPosts = posts.slice(currentLength, currentLength + 5);
    
    if (nextPosts.length > 0) {
      setDisplayedPosts(prev => [...prev, ...nextPosts]);
      setHasMore(currentLength + nextPosts.length < posts.length);
    }
  }, [posts, displayedPosts.length]);

  const { isFetching } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMorePosts,
  });

  // Update displayed posts when posts change (from filtering)
  useState(() => {
    setDisplayedPosts(posts.slice(0, 5));
    setHasMore(posts.length > 5);
  });

  if (isLoading && displayedPosts.length === 0) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayedPosts.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">
            No posts match your current filters. Try adjusting your filters or check back later for new content.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Quick Actions</h4>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>View Trending Posts</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>See Urgent Requests</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Feed</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4">
      {displayedPosts.map((post) => (
        <MobilePostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onShare={onShare}
          onRespond={onRespond}
          onBookmark={onBookmark}
          onReaction={onReaction}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
          onCommentReaction={onCommentReaction}
        />
      ))}

      {isFetching && (
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading more posts...</span>
          </div>
        </div>
      )}

      {!hasMore && displayedPosts.length > 0 && (
        <div className="text-center py-6">
          <div className="text-gray-400 text-sm">
            🎉 You've seen all posts! Check back later for more.
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFeedContent;
