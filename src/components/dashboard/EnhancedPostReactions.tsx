
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Send, Users, Plus } from "lucide-react";
import { FeedPost } from "@/types/feed";
import ModernReactionPicker from "@/components/ui/modern-reaction-picker";
import ReactionDisplay from "@/components/ui/reaction-display";
import { usePostReactions } from "@/hooks/usePostReactions";

interface EnhancedPostReactionsProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: () => void;
  onReaction: (postId: string, reactionType: string) => void;
}

const EnhancedPostReactions = ({ 
  post, 
  onLike, 
  onShare, 
  onRespond,
  onReaction
}: EnhancedPostReactionsProps) => {
  const { reactions, toggleReaction } = usePostReactions(post.id);

  const handleReactionSelect = (emoji: string) => {
    // Only call toggleReaction - this handles the database update
    toggleReaction(emoji);
  };

  const handleReactionClick = (emoji: string) => {
    // Only call toggleReaction - this handles the database update
    toggleReaction(emoji);
  };

  // Quick reactions (most common ones)
  const quickReactions = ['👍', '❤️', '😂', '😮', '🔥'];

  return (
    <div className="space-y-3">
      {/* Reaction Display */}
      {reactions.length > 0 && (
        <ReactionDisplay
          reactions={reactions}
          onReactionClick={handleReactionClick}
          className="px-1"
        />
      )}

      {/* Main Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          {/* Legacy Like Button - keeping for backward compatibility */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onLike(post.id)}
            className={`hover:scale-105 transition-transform ${
              post.isLiked ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-red-600"
            }`}
          >
            <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
            <span>{post.likes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRespond}
            className="hover:scale-105 transition-transform text-gray-600 hover:text-blue-600"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>{post.responses}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShare(post.id)} 
            className={`hover:scale-105 transition-transform ${
              post.isShared ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Share2 className="h-4 w-4 mr-2" />
            <span>{post.shares}</span>
          </Button>

          {/* Quick Reaction Buttons */}
          <div className="flex items-center space-x-1 ml-2">
            {quickReactions.map((emoji) => {
              const reaction = reactions.find(r => r.emoji === emoji);
              const hasReacted = reaction?.userReacted || false;
              
              return (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReactionSelect(emoji)}
                  className={`w-8 h-8 p-0 hover:scale-110 transition-all ${
                    hasReacted ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'
                  }`}
                  title={`React with ${emoji}`}
                >
                  <span className="text-base">{emoji}</span>
                </Button>
              );
            })}
            
            {/* More Reactions Picker */}
            <ModernReactionPicker 
              onReactionSelect={handleReactionSelect}
              userReactedEmojis={reactions.filter(r => r.userReacted).map(r => r.emoji)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:scale-110 transition-all hover:bg-gray-100"
                title="More reactions"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </ModernReactionPicker>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Category-specific actions */}
          {post.category === "help-needed" && (
            <Button 
              size="sm" 
              onClick={onRespond} 
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af] hover:to-[#18a5fe] hover:scale-105 transition-all"
            >
              <Send className="h-4 w-4 mr-2" />
              Offer Help
            </Button>
          )}
          {post.category === "help-offered" && (
            <Button 
              size="sm" 
              onClick={onRespond} 
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af] hover:to-[#18a5fe] hover:scale-105 transition-all"
            >
              <Users className="h-4 w-4 mr-2" />
              Request Help
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPostReactions;
