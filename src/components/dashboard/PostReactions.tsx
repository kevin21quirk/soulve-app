
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Smile, Frown, Angry } from "lucide-react";
import { useState } from "react";
import { FeedPost, Reaction } from "@/types/feed";

interface PostReactionsProps {
  post: FeedPost;
  onReaction: (reactionType: string) => void;
}

const PostReactions = ({ post, onReaction }: PostReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const reactionTypes = [
    { type: 'like', emoji: '👍', icon: ThumbsUp, label: 'Like' },
    { type: 'love', emoji: '❤️', icon: Heart, label: 'Love' },
    { type: 'laugh', emoji: '😂', icon: Smile, label: 'Laugh' },
    { type: 'wow', emoji: '😮', icon: null, label: 'Wow' },
    { type: 'sad', emoji: '😢', icon: Frown, label: 'Sad' },
    { type: 'angry', emoji: '😠', icon: Angry, label: 'Angry' }
  ];

  const getReactionCounts = () => {
    if (!post.reactions) return {};
    
    return post.reactions.reduce((acc, reaction) => {
      if (typeof reaction === 'string') {
        // Handle string array format
        acc[reaction] = (acc[reaction] || 0) + 1;
      } else if (typeof reaction === 'object' && reaction.type) {
        // Handle Reaction object format
        acc[reaction.type] = reaction.count || 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const reactionCounts = getReactionCounts();
  const hasReacted = post.isLiked; // Simplified for now

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowReactions(!showReactions)}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
        className={`flex items-center space-x-1 ${
          hasReacted ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-red-600"
        }`}
      >
        <Heart className={`h-4 w-4 ${hasReacted ? "fill-current" : ""}`} />
        <span>
          {Object.keys(reactionCounts).length > 0 
            ? Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)
            : post.likes
          }
        </span>
      </Button>

      {showReactions && (
        <div 
          className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1 z-10"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {reactionTypes.map((reaction) => (
            <Button
              key={reaction.type}
              variant="ghost"
              size="sm"
              onClick={() => {
                onReaction(reaction.type);
                setShowReactions(false);
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title={reaction.label}
            >
              <span className="text-lg">{reaction.emoji}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Show reaction counts */}
      {Object.keys(reactionCounts).length > 0 && (
        <div className="flex items-center space-x-1 mt-1">
          {Object.entries(reactionCounts).map(([type, count]) => {
            const reaction = reactionTypes.find(r => r.type === type);
            return (
              <div key={type} className="flex items-center space-x-1 text-xs text-gray-500">
                <span>{reaction?.emoji}</span>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostReactions;
