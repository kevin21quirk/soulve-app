
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin, Clock } from "lucide-react";
import { FeedPost } from "@/types/feed";

interface MobilePostCardProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
}

const MobilePostCard = ({ 
  post, 
  onLike, 
  onShare, 
  onRespond, 
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment,
  onCommentReaction 
}: MobilePostCardProps) => {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={post.avatar} alt={post.author} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
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
              <span>{post.timestamp.replace('hours', 'hrs')}</span>
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
        <Button variant="ghost" size="sm" className="p-1 h-6 w-6 flex-shrink-0 -mt-1">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
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
            {post.tags.filter(tag => !['help-center', 'campaign'].includes(tag)).slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      {(post.likes > 0 || post.responses > 0) && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              {post.likes > 0 && (
                <span className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart className="h-2.5 w-2.5 text-white fill-current" />
                  </div>
                  <span>{post.likes}</span>
                </span>
              )}
              {post.responses > 0 && <span>{post.responses} responses</span>}
            </div>
            {post.shares > 0 && <span>{post.shares} shares</span>}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-gray-100 px-3 py-2">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLike(post.id)}
            className={`flex items-center space-x-1 px-3 py-2.5 ${
              post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Like</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRespond(post.id)}
            className="flex items-center space-x-1 px-3 py-2.5 text-gray-600 hover:text-blue-500"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Respond</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShare(post.id)}
            className="flex items-center space-x-1 px-3 py-2.5 text-gray-600 hover:text-green-500"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Share</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onBookmark(post.id)}
            className={`flex items-center space-x-1 px-3 py-2.5 ${
              post.isBookmarked ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilePostCard;
