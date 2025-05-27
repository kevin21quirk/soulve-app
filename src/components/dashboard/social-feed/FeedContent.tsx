
import { FeedPost } from "@/types/feed";
import FeedPostCard from "../FeedPostCard";
import PostSkeleton from "../PostSkeleton";

interface FeedContentProps {
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
  emptyMessage?: string;
}

const FeedContent = ({
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
  emptyMessage = "No posts found. Try adjusting your filters or check back later!"
}: FeedContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">🤝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts here yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <FeedPostCard
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
    </div>
  );
};

export default FeedContent;
