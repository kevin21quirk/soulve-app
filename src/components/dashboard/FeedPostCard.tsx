
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
      return <HelpCircle className="h-4 w-4 text-teal-600" />;
    }
    if (post.tags?.includes('campaign')) {
      return <Target className="h-4 w-4 text-purple-600" />;
    }
    return null;
  };

  const getSourceBadge = () => {
    if (post.tags?.includes('help-center')) {
      return (
        <Badge variant="outline" className="text-xs border-teal-200 text-teal-700">
          <HelpCircle className="h-3 w-3 mr-1" />
          Help Center
        </Badge>
      );
    }
    if (post.tags?.includes('campaign')) {
      return (
        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
          <Target className="h-3 w-3 mr-1" />
          Campaign
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatar} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                {getSourceIcon()}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{post.timestamp}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge className={getCategoryColor(post.category)}>
            {post.category.replace('-', ' ')}
          </Badge>
          {getSourceBadge()}
          {post.urgency && post.urgency !== 'low' && (
            <Badge variant={post.urgency === 'urgent' ? 'destructive' : 'secondary'}>
              {post.urgency}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
          <p className="text-gray-700">{post.description}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.filter(tag => !['help-center', 'campaign'].includes(tag)).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
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
