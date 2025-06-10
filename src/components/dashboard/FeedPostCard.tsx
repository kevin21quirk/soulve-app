
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Clock } from "lucide-react";
import { FeedPost } from "@/types/feed";
import EnhancedPostReactions from "./EnhancedPostReactions";
import PostComments from "./PostComments";
import PostActions from "./PostActions";
import UserModerationMenu from "@/components/moderation/UserModerationMenu";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface FeedPostCardProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
  onPostDeleted?: () => void;
}

const FeedPostCard = ({ 
  post, 
  onLike, 
  onShare, 
  onRespond, 
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment,
  onCommentReaction,
  onPostDeleted
}: FeedPostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);

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

  const handleReactionCallback = (postId: string, reactionType: string) => {
    // Ensure the callback is properly passed through
    if (onReaction) {
      onReaction(postId, reactionType);
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
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
                {post.urgency && post.urgency !== 'medium' && (
                  <Badge className={`${getUrgencyColor(post.urgency)} text-xs px-2 py-0.5 flex-shrink-0`}>
                    {post.urgency}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{post.timestamp}</span>
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
          <div className="flex items-center space-x-1">
            {user?.id !== post.id && (
              <UserModerationMenu
                userId={post.id}
                userName={post.author}
                postId={post.id}
              />
            )}
            <PostActions
              postId={post.id}
              authorId={post.id}
              onPostDeleted={onPostDeleted}
              onReportPost={() => {/* Handle report post */}}
            />
          </div>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-gray-900 text-base mb-2 leading-tight">
              {post.title}
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed break-words">
              {post.description}
            </p>
          </div>

          {/* Media Display */}
          {post.media && post.media.length > 0 && (
            <div className="space-y-2">
              <div className={`grid gap-2 ${
                post.media.length === 1 ? 'grid-cols-1' :
                post.media.length === 2 ? 'grid-cols-2' :
                post.media.length === 3 ? 'grid-cols-2' :
                'grid-cols-2'
              }`}>
                {post.media.slice(0, 4).map((media, index) => (
                  <div 
                    key={media.id} 
                    className={`relative aspect-video rounded-lg overflow-hidden bg-gray-100 ${
                      post.media.length === 3 && index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={media.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    {index === 3 && post.media.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{post.media.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.filter(tag => !['help-center', 'campaign'].includes(tag)).slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Enhanced Reactions */}
          <EnhancedPostReactions 
            post={post}
            onLike={onLike}
            onShare={onShare}
            onRespond={() => setShowComments(!showComments)}
            onBookmark={onBookmark}
            onReaction={handleReactionCallback}
          />

          {/* Comments Section */}
          {(showComments || (post.comments && post.comments.length > 0)) && (
            <PostComments
              post={post}
              onAddComment={onAddComment}
              onLikeComment={onLikeComment}
              onCommentReaction={onCommentReaction}
              isExpanded={showComments}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedPostCard;
