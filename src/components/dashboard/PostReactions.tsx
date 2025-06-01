
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Smile, Frown, Angry } from "lucide-react";
import { useState } from "react";
import { FeedPost } from "@/types/feed";
import { useReactions } from "@/hooks/useReactions";
import ReactionDisplay from "./ReactionDisplay";

interface PostReactionsProps {
  post: FeedPost;
  onReaction: (reactionType: string) => void;
}

const reactionTypes = [
  { type: 'like', emoji: '👍', icon: ThumbsUp, label: 'Like' },
  { type: 'love', emoji: '❤️', icon: Heart, label: 'Love' },
  { type: 'laugh', emoji: '😂', icon: Smile, label: 'Laugh' },
  { type: 'wow', emoji: '😮', icon: null, label: 'Wow' },
  { type: 'sad', emoji: '😢', icon: Frown, label: 'Sad' },
  { type: 'angry', emoji: '😠', icon: Angry, label: 'Angry' }
];

const PostReactions = ({ post, onReaction }: PostReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const { reactionCounts, totalReactions, hasUserReacted } = useReactions(post.reactions);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowReactions(!showReactions)}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
        className={`flex items-center space-x-1 ${
          hasUserReacted ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-red-600"
        }`}
      >
        <Heart className={`h-4 w-4 ${hasUserReacted ? "fill-current" : ""}`} />
        <span>{totalReactions || post.likes}</span>
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

      <ReactionDisplay reactionCounts={reactionCounts} className="mt-1" />
    </div>
  );
};

export default PostReactions;
