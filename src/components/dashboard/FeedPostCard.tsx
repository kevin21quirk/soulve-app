
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MapPin, 
  Clock,
  MoreHorizontal,
  Users,
  Target,
  HelpCircle
} from "lucide-react";
import { FeedPost } from "@/types/feed";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import PostReactions from "./PostReactions";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onCommentReaction
}: FeedPostCardProps) => {
  const isMobile = useIsMobile();

  const getCategoryColor = (category: string) => {
    const colors = {
      "help-needed": "bg-red-100 text-red-800",
      "help-offered": "bg-green-100 text-green-800", 
      "success-story": "bg-blue-100 text-blue-800",
      "announcement": "bg-purple-100 text-purple-800",
      "question": "bg-yellow-100 text-yellow-800",
      "recommendation": "bg-indigo-100 text-indigo-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getSourceIcon = () => {
    if (post.tags?.includes('help-center')) {
      return <HelpCircle className="h-3 w-3 text-soulve-teal flex-shrink-0" />;
    }
    if (post.tags?.includes('campaign')) {
      return <Target className="h-3 w-3 text-soulve-purple flex-shrink-0" />;
    }
    return null;
  };

  const getSourceBadge = () => {
    if (post.tags?.includes('help-center')) {
      return (
        <Badge variant="soulve-teal" className="text-xs">
          <HelpCircle className="h-3 w-3 mr-1" />
          Help Center
        </Badge>
      );
    }
    if (post.tags?.includes('campaign')) {
      return (
        <Badge variant="soulve-purple" className="text-xs">
          <Target className="h-3 w-3 mr-1" />
          Campaign
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${isMobile ? 'mx-0 rounded-lg shadow-sm' : ''}`}>
      <CardHeader className={`${isMobile ? 'p-3 pb-2' : 'pb-3'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} flex-shrink-0`}>
              <AvatarImage src={post.avatar} alt={post.author} />
              <AvatarFallback className={`${isMobile ? 'text-xs' : ''}`}>
                {post.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold text-gray-900 truncate ${isMobile ? 'text-sm' : ''}`}>
                  {post.author}
                </h3>
                {getSourceIcon()}
              </div>
              <div className={`flex items-center space-x-2 text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{post.timestamp}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className={`${isMobile ? 'h-6 w-6 p-0' : ''} flex-shrink-0`}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className={`flex items-center gap-2 flex-wrap ${isMobile ? 'mt-2' : 'mt-2'}`}>
          <Badge className={`${getCategoryColor(post.category)} ${isMobile ? 'text-xs' : ''}`}>
            {post.category.replace('-', ' ')}
          </Badge>
          {getSourceBadge()}
          {post.urgency && post.urgency !== 'low' && (
            <Badge variant={post.urgency === 'urgent' ? 'destructive' : 'secondary'} className={`${isMobile ? 'text-xs' : ''}`}>
              {post.urgency}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={`${isMobile ? 'p-3 pt-0' : ''}`}>
        <div className="space-y-3">
          <h2 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
            {post.title}
          </h2>
          <p className={`text-gray-700 ${isMobile ? 'text-sm' : ''} break-words`}>
            {post.description}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.filter(tag => !['help-center', 'campaign'].includes(tag)).map((tag, index) => (
                <Badge key={index} variant="outline" className={`${isMobile ? 'text-xs' : 'text-xs'} border-soulve-blue/30 text-soulve-blue hover:bg-soulve-blue/10`}>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <PostReactions post={post} onReaction={onReaction} />

          <PostActions
            post={post}
            onLike={onLike}
            onShare={onShare}
            onRespond={onRespond}
            onBookmark={onBookmark}
            onReaction={onReaction}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
            onCommentReaction={onCommentReaction}
          />

          <PostComments
            post={post}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
            onCommentReaction={onCommentReaction}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedPostCard;
