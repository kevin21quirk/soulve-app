
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { FeedPost, Reaction } from "@/types/feed";

interface PostReactionsProps {
  post: FeedPost;
  onReaction: (postId: string, reactionType: string) => void;
}

const reactionTypes = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'support', emoji: '🤝', label: 'Support' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' },
];

const PostReactions = ({ post, onReaction }: PostReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);

  const totalReactions = post.reactions?.reduce((sum, r) => sum + r.count, 0) || 0;
  const userReaction = post.reactions?.find(r => r.hasReacted);

  const handleReaction = (reactionType: string) => {
    onReaction(post.id, reactionType);
    setShowReactions(false);
  };

  // Mock users who reacted for demonstration
  const getReactionUsers = (reactionType: string) => {
    const reaction = post.reactions?.find(r => r.type === reactionType);
    if (!reaction || reaction.count === 0) return [];
    
    // Generate mock users based on reaction count
    return Array.from({ length: Math.min(reaction.count, 5) }, (_, i) => ({
      id: `user-${reactionType}-${i}`,
      name: `User ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reactionType}-${i}`,
    }));
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
                title={reaction.label}
              >
                <span className="text-xl">{reaction.emoji}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Reaction Summary with clickable details */}
      {totalReactions > 0 && (
        <Popover open={showReactionDetails} onOpenChange={setShowReactionDetails}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <div className="flex -space-x-1">
                {post.reactions?.slice(0, 3).map((reaction) => (
                  <span key={reaction.type} className="text-sm">
                    {reactionTypes.find(r => r.type === reaction.type)?.emoji}
                  </span>
                ))}
              </div>
              <span>{totalReactions}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white shadow-lg border">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Reactions</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {post.reactions?.filter(r => r.count > 0).map((reaction) => {
                  const reactionType = reactionTypes.find(r => r.type === reaction.type);
                  const users = getReactionUsers(reaction.type);
                  
                  return (
                    <div key={reaction.type} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{reactionType?.emoji}</span>
                        <span className="font-medium text-sm">{reactionType?.label}</span>
                        <span className="text-xs text-gray-500">({reaction.count})</span>
                      </div>
                      <div className="ml-8 space-y-1">
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700">{user.name}</span>
                            {reaction.hasReacted && user.id === 'user-like-0' && (
                              <span className="text-xs text-blue-600">(You)</span>
                            )}
                          </div>
                        ))}
                        {reaction.count > 5 && (
                          <div className="text-xs text-gray-500 ml-8">
                            and {reaction.count - 5} others...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default PostReactions;
