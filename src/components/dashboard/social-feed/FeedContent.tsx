
import React from "react";
import { PullToRefresh, MobileActionBar } from "@/components/ui/mobile";
import { useKeyboardNavigation } from "@/hooks/useAccessibility";
import { useDebounce, useLazyLoading } from "@/hooks/usePerformanceOptimization";
import PostSkeleton from "../PostSkeleton";
import FeedPostCard from "../FeedPostCard";
import { LoadingSpinner } from "@/components/ui/skeleton-variants";
import { Share, Heart, MessageSquare, Bookmark } from "lucide-react";
import { FeedPost } from "@/types/feed";

interface FeedContentProps {
  posts: FeedPost[];
  isLoading: boolean;
  searchQuery: string;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onRefresh: () => Promise<void>;
  isMobile: boolean;
}

/**
 * Main content area for the social feed
 * Handles post display, loading states, and interactions
 */
const FeedContent: React.FC<FeedContentProps> = ({
  posts,
  isLoading,
  searchQuery,
  onLike,
  onShare,
  onRespond,
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment,
  onRefresh,
  isMobile,
}) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { ref: loadMoreRef, isIntersecting } = useLazyLoading();
  const { activeIndex } = useKeyboardNavigation(posts, (index) => {
    const post = posts[index];
    // Announce to screen readers
  });

  const mobileActions = isMobile ? [
    {
      label: "Like",
      icon: Heart,
      onClick: () => {
        if (posts[0]) {
          onLike(posts[0].id);
        }
      },
    },
    {
      label: "Share",
      icon: Share,
      onClick: () => {
        if (posts[0]) {
          onShare(posts[0].id);
        }
      },
    },
    {
      label: "Bookmark",
      icon: Bookmark,
      onClick: () => {
        if (posts[0]) {
          onBookmark(posts[0].id);
        }
      },
    },
    {
      label: "Comment",
      icon: MessageSquare,
      onClick: () => {
        if (posts[0]) {
          onAddComment(posts[0].id, "Great post!");
        }
      },
    },
  ] : [];

  const renderEmptyState = () => (
    <div className="text-center py-12 animate-fade-in">
      {debouncedSearchQuery ? (
        <>
          <p className="text-gray-500 text-lg">No posts found matching "{debouncedSearchQuery}"</p>
          <p className="text-gray-400">Try adjusting your search terms or filter.</p>
        </>
      ) : (
        <>
          <p className="text-gray-500 text-lg">No posts found for this category.</p>
          <p className="text-gray-400">Try selecting a different filter above.</p>
        </>
      )}
    </div>
  );

  const content = (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => <PostSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && posts.map((post, index) => (
        <div
          key={post.id}
          className={`transition-all duration-200 ${
            activeIndex === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}
          tabIndex={0}
          role="article"
          aria-label={`Post by ${post.author}: ${post.title}`}
        >
          <FeedPostCard
            post={post}
            onLike={onLike}
            onShare={onShare}
            onRespond={onRespond}
            onBookmark={onBookmark}
            onReaction={onReaction}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
          />
        </div>
      ))}

      {!isLoading && posts.length > 0 && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isIntersecting && <LoadingSpinner />}
        </div>
      )}

      {!isLoading && posts.length === 0 && renderEmptyState()}
    </div>
  );

  return (
    <>
      {isMobile ? (
        <PullToRefresh onRefresh={onRefresh}>
          {content}
        </PullToRefresh>
      ) : (
        content
      )}
      
      <MobileActionBar actions={mobileActions} />
    </>
  );
};

export default FeedContent;
