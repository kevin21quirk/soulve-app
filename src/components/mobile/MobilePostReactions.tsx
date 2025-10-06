
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { FeedPost, Reaction } from "@/types/feed";

interface MobilePostReactionsProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
}

const reactionTypes = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'support', emoji: '🤝', label: 'Support' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
];

const MobilePostReactions = ({ 
  post, 
  onLike, 
  onShare, 
  onRespond,
  onReaction 
}: MobilePostReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);

  const totalReactions = post.reactions?.reduce((sum, r) => sum + r.count, 0) || 0;
  const userReaction = post.reactions?.find(r => r.hasReacted);

  const handleReaction = (reactionType: string) => {
    onReaction(post.id, reactionType);
    setShowReactions(false);
  };

  const handleLongPress = () => {
    setShowReactions(true);
  };

  // Mock users who reacted for demonstration
  const getReactionUsers = (reactionType: string) => {
    const reaction = post.reactions?.find(r => r.type === reactionType);
    if (!reaction || reaction.count === 0) return [];
    
    return Array.from({ length: Math.min(reaction.count, 3) }, (_, i) => ({
      id: `user-${reactionType}-${i}`,
      name: `User ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reactionType}-${i}`,
    }));
  };

  return (
    <div className="border-t border-gray-100">
      {/* Reaction Summary */}
      {totalReactions > 0 && (
        <Popover open={showReactionDetails} onOpenChange={setShowReactionDetails}>
          <PopoverTrigger asChild>
            <div className="px-4 py-2 border-b border-gray-50 cursor-pointer">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {post.reactions?.slice(0, 3).map((reaction) => (
                      <span key={reaction.type} className="text-sm bg-white rounded-full border border-gray-200 w-6 h-6 flex items-center justify-center">
                        {reactionTypes.find(r => r.type === reaction.type)?.emoji}
                      </span>
                    ))}
                  </div>
                  <span>
                    {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
                  </span>
                </div>
                {post.comments && post.comments.length > 0 && (
                  <span>{post.comments.length} comments</span>
                )}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-white shadow-lg border" side="top">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Who reacted</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {post.reactions?.filter(r => r.count > 0).map((reaction) => {
                  const reactionType = reactionTypes.find(r => r.type === reaction.type);
                  const users = getReactionUsers(reaction.type);
                  
                  return (
                    <div key={reaction.type} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{reactionType?.emoji}</span>
                        <span className="text-sm font-medium">{reaction.count}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-700">{user.name}</span>
                            {reaction.hasReacted && user.id === 'user-like-0' && (
                              <span className="text-xs text-blue-600">(You)</span>
                            )}
                          </div>
                        ))}
                        {reaction.count > 3 && (
                          <div className="text-xs text-gray-500 ml-7">
                            and {reaction.count - 3} others...
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

      {/* Action Buttons */}
      <div className="px-2 py-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Like/React Button */}
            <Popover open={showReactions} onOpenChange={setShowReactions}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onTouchStart={handleLongPress}
                  onClick={() => userReaction ? handleReaction(userReaction.type) : onLike(post.id)}
                  className={`p-2 rounded-full ${
                    userReaction || post.isLiked 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  {userReaction ? (
                    <span className="text-base">{reactionTypes.find(r => r.type === userReaction.type)?.emoji}</span>
                  ) : (
                    <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-2 bg-white shadow-lg border rounded-full"
                side="top"
                align="start"
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

            {/* Comment Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRespond(post.id)}
              className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Share Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onShare(post.id)}
              className="p-2 rounded-full text-gray-600 hover:text-green-500 hover:bg-green-50"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePostReactions;
