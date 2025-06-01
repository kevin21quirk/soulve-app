
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
            id: post.id,
            authorAvatar: post.avatar, // Map avatar to authorAvatar
            title: post.title,
            description: post.description,
            category: post.category,
            date: new Date(post.timestamp), // Convert timestamp string to Date object
            location: post.location || 'Location not specified',
            responses: post.responses,
            likes: post.likes,
            shares: post.shares,
            urgency: post.urgency || 'medium',
            tags: post.tags || [],
            // Transform comments to match expected format
            comments: (post.comments || []).map(comment => ({
              id: comment.id,
              author: comment.author,
              content: comment.content || '', 
              timestamp: comment.timestamp || new Date().toISOString(),
              likes: comment.likes,
              isLiked: comment.isLiked || false,
              user_id: comment.user_id || '',
              created_at: comment.created_at || comment.timestamp || new Date().toISOString()
            }))
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
