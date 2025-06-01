
import { FeedPost } from "@/types/feed";
import { useReactions } from "@/hooks/useReactions";

interface PostEngagementStatsProps {
  post: FeedPost;
}

const PostEngagementStats = ({ post }: PostEngagementStatsProps) => {
  const { totalReactions } = useReactions(post.reactions);

  return (
    <div className="flex items-center justify-between py-2 border-t border-b border-gray-100">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span>{post.likes} likes</span>
        <span>{post.comments?.length || 0} comments</span>
        {totalReactions > 0 && (
          <span>{totalReactions} reactions</span>
        )}
      </div>
      <div className="text-sm text-gray-500">
        {post.shares > 0 && `${post.shares} shares`}
      </div>
    </div>
  );
};

export default PostEngagementStats;
