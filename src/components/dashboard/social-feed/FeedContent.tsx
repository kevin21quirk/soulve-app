
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
          post={{
            ...post,
            urgency: post.urgency || 'medium',
            tags: post.tags || [],
            reactions: post.reactions ? post.reactions.map(r => typeof r === 'string' ? r : r.type || 'like') : []
          }}
          onLike={() => onLike(post.id)}
          onShare={() => onShare(post.id)}
          onRespond={() => onRespond(post.id)}
          onBookmark={() => onBookmark(post.id)}
          onReaction={(reactionType: string) => onReaction(post.id, reactionType)}
          onAddComment={(content: string) => onAddComment(post.id, content)}
          onLikeComment={(commentId: string) => onLikeComment(post.id, commentId)}
          onCommentReaction={(commentId: string, reactionType: string) => onCommentReaction?.(post.id, commentId, reactionType)}
        />
      ))}
    </div>
  );
};

export default FeedContent;
