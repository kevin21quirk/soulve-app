
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { FeedPost, Reaction } from "@/types/feed";

interface PostReactionsProps {
  post: FeedPost;
  onReaction: (postId: string, reactionType: string) => void;
}

const reactionTypes = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' },
];

const PostReactions = ({ post, onReaction }: PostReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const totalReactions = post.reactions?.reduce((sum, r) => sum + r.count, 0) || 0;
  const userReaction = post.reactions?.find(r => r.hasReacted);

  const handleReaction = (reactionType: string) => {
    onReaction(post.id, reactionType);
    setShowReactions(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={showReactions} onOpenChange={setShowReactions}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={`transition-all duration-200 ${userReaction ? "text-blue-600" : "hover:scale-105"}`}
            onMouseEnter={() => setShowReactions(true)}
          >
            {userReaction ? (
              <>
                <span className="mr-2">{reactionTypes.find(r => r.type === userReaction.type)?.emoji}</span>
                <span>{reactionTypes.find(r => r.type === userReaction.type)?.label}</span>
              </>
            ) : (
              <>
                <span className="mr-2">👍</span>
                <span>React</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-2 bg-white shadow-lg border rounded-full"
          onMouseLeave={() => setShowReactions(false)}
        >
          <div className="flex space-x-1">
            {reactionTypes.map((reaction) => (
              <Button
                key={reaction.type}
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-full hover:scale-125 transition-transform"
                onClick={() => handleReaction(reaction.type)}
              >
                <span className="text-xl">{reaction.emoji}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Reaction Summary */}
      {totalReactions > 0 && (
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <div className="flex -space-x-1">
            {post.reactions?.slice(0, 3).map((reaction) => (
              <span key={reaction.type} className="text-sm">
                {reactionTypes.find(r => r.type === reaction.type)?.emoji}
              </span>
            ))}
          </div>
          <span>{totalReactions}</span>
        </div>
      )}
    </div>
  );
};

export default PostReactions;
