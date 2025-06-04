
import { FeedPost } from "@/types/feed";
import MobilePostCard from "./MobilePostCard";
import MobileScrollContainer from "./MobileScrollContainer";
import MobileOptimizedCard from "./MobileOptimizedCard";

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
  onLoadMore?: () => void;
  onRefresh?: () => Promise<void>;
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
  onCommentReaction,
  onLoadMore,
  onRefresh
}: MobileFeedContentProps) => {
  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4 px-4">
        {[1, 2, 3].map((i) => (
          <MobileOptimizedCard key={i} className="animate-pulse">
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </MobileOptimizedCard>
        ))}
      </div>
    );
  }

  return (
    <MobileScrollContainer
      className="px-4"
      onScrollEnd={onLoadMore}
      pullToRefresh={!!onRefresh}
      onRefresh={onRefresh}
    >
      <div className="space-y-4">
        {posts.map((post) => (
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
        
        {isLoading && posts.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
        
        {posts.length === 0 && !isLoading && (
          <MobileOptimizedCard>
            <div className="text-center py-8">
              <p className="text-gray-500">No posts yet. Be the first to share something!</p>
            </div>
          </MobileOptimizedCard>
        )}
      </div>
    </MobileScrollContainer>
  );
};

export default MobileFeedContent;
