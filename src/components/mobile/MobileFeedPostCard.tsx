
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, Bookmark, MapPin, Clock, Plus } from "lucide-react";
import { FeedPost } from "@/types/feed";
import { usePostReactions } from "@/hooks/usePostReactions";
import ModernReactionPicker from "@/components/ui/modern-reaction-picker";
import ReactionDisplay from "@/components/ui/reaction-display";

interface MobileFeedPostCardProps {
  post: FeedPost;
  onLike: () => void;
  onShare: () => void;
  onRespond: () => void;
  onBookmark: () => void;
  onReaction: (reactionType: string) => void;
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
}

const MobileFeedPostCard = ({
  post,
  onLike,
  onShare,
  onRespond,
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment
}: MobileFeedPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { reactions, toggleReaction } = usePostReactions(post.id);

  const handleReactionSelect = (emoji: string) => {
    console.log('Mobile reaction selected:', emoji, 'for post:', post.id);
    toggleReaction(emoji);
    onReaction(emoji);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "help-needed": "bg-red-100 text-red-700 border-red-200",
      "help-offered": "bg-green-100 text-green-700 border-green-200",
      "success-story": "bg-blue-100 text-blue-700 border-blue-200",
      "announcement": "bg-purple-100 text-purple-700 border-purple-200",
      "question": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "recommendation": "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      "urgent": "bg-red-500 text-white",
      "high": "bg-orange-500 text-white", 
      "medium": "bg-yellow-500 text-white",
      "low": "bg-green-500 text-white",
    };
    return colors[urgency as keyof typeof colors] || "bg-gray-500 text-white";
  };

  // Quick reactions for mobile
  const quickReactions = ['👍', '❤️', '😂', '🔥'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={post.avatar} alt={post.author} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-sm">
              {post.author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {post.author}
              </h3>
              <Badge className={`${getCategoryColor(post.category)} text-xs px-2 py-0.5 border flex-shrink-0`}>
                {post.category.replace('-', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{post.timestamp}</span>
              {post.urgency && post.urgency !== 'medium' && (
                <>
                  <span>•</span>
                  <Badge className={`${getUrgencyColor(post.urgency)} text-xs px-1 py-0 h-4 flex-shrink-0`}>
                    {post.urgency}
                  </Badge>
                </>
              )}
              {post.location && (
                <>
                  <span>•</span>
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <h2 className="font-semibold text-gray-900 text-base mb-2 leading-tight">
          {post.title}
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed break-words">
          {post.description}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.filter(tag => !['help-center', 'campaign'].includes(tag)).slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Reactions Display */}
      {reactions.length > 0 && (
        <div className="px-4 pb-2">
          <ReactionDisplay
            reactions={reactions}
            onReactionClick={toggleReaction}
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Quick Reaction Buttons */}
            {quickReactions.map((emoji) => {
              const reaction = reactions.find(r => r.emoji === emoji);
              const hasReacted = reaction?.userReacted || false;
              const count = reaction?.count || 0;
              
              return (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReactionSelect(emoji)}
                  className={`w-8 h-8 p-0 hover:scale-110 transition-all ${
                    hasReacted ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'
                  }`}
                  title={`React with ${emoji} ${count > 0 ? `(${count})` : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-base leading-none">{emoji}</span>
                    {count > 0 && <span className="text-xs leading-none">{count}</span>}
                  </div>
                </Button>
              );
            })}
            
            {/* More Reactions */}
            <ModernReactionPicker onReactionSelect={handleReactionSelect}>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:scale-110 transition-all hover:bg-gray-100"
                title="More reactions"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </ModernReactionPicker>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="h-8 px-2 text-gray-600"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.responses}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onShare}
              className="h-8 px-2 text-gray-600"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.shares}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className={`h-8 w-8 p-0 ${
              post.isBookmarked ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Comments Section (if expanded) */}
      {showComments && post.comments && post.comments.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3">
            {post.comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback className="text-xs">
                    {comment.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-white rounded-lg p-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-xs">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {post.comments.length > 3 && (
              <button className="text-xs text-blue-600 font-medium">
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFeedPostCard;
