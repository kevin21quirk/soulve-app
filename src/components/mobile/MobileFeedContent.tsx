
import { FeedPost } from "@/types/feed";
import MobileFeedPostCard from "./MobileFeedPostCard";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onRefresh?: () => void;
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
  onRefresh
}: MobileFeedContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🤝</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600 mb-4 max-w-sm">
          Be the first to share something with the community!
        </p>
        {onRefresh && (
          <Button 
            onClick={onRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <MobileFeedPostCard
          key={post.id}
          post={post}
          onLike={() => onLike(post.id)}
          onShare={() => onShare(post.id)}
          onRespond={() => onRespond(post.id)}
          onBookmark={() => onBookmark(post.id)}
          onReaction={(reactionType: string) => onReaction(post.id, reactionType)}
          onAddComment={(content: string) => onAddComment(post.id, content)}
          onLikeComment={(commentId: string) => onLikeComment(post.id, commentId)}
        />
      ))}
    </div>
  );
};

export default MobileFeedContent;
