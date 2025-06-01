import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  BookmarkPlus,
  MoreHorizontal,
  Send,
  MapPin,
  Clock,
  Users,
  Zap,
  ThumbsUp,
  Smile,
  Copy,
  ExternalLink,
  Flag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { FeedPost, Comment } from "@/types/feed";

interface FeedPostCardProps {
  post: FeedPost;
  onLike: () => void;
  onShare: () => void;
  onRespond: () => void;
  onBookmark: () => void;
  onReaction: (reactionType: string) => void;
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
  onCommentReaction?: (commentId: string, reactionType: string) => void;
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
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const { toast } = useToast();

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard.",
    });
    setShowShareDialog(false);
  };

  const handleShareToSocial = (platform: string) => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const text = `Check out this post: ${post.title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      toast({
        title: "Shared!",
        description: `Post shared to ${platform}.`,
      });
    }
    setShowShareDialog(false);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark();
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Bookmarked!",
      description: isBookmarked 
        ? "Post removed from your bookmarks." 
        : "Post saved to your bookmarks.",
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    }
  };

  const handleReaction = (reactionType: string) => {
    onReaction(reactionType);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "help-needed": "bg-red-100 text-red-800",
      "help-offered": "bg-green-100 text-green-800",
      "success-story": "bg-blue-100 text-blue-800",
      "announcement": "bg-purple-100 text-purple-800",
      "question": "bg-yellow-100 text-yellow-800",
      "recommendation": "bg-indigo-100 text-indigo-800",
      "event": "bg-pink-100 text-pink-800",
      "lost-found": "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getUrgencyIcon = (urgency: string) => {
    if (urgency === "urgent" || urgency === "high") {
      return <Zap className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  // Convert reactions array to display format - FIXED
  const getReactionCounts = () => {
    if (!post.reactions) return {};
    
    return post.reactions.reduce((acc, reaction) => {
      if (typeof reaction === 'string') {
        // Handle string array format
        acc[reaction] = (acc[reaction] || 0) + 1;
      } else if (typeof reaction === 'object' && reaction.type) {
        // Handle Reaction object format
        acc[reaction.type] = reaction.count || 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const reactionCounts = getReactionCounts();

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatar} alt={post.author} />
              <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{post.author}</h4>
                {getUrgencyIcon(post.urgency)}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBookmark}>
                {isBookmarked ? <Bookmark className="h-4 w-4 mr-2" /> : <BookmarkPlus className="h-4 w-4 mr-2" />}
                {isBookmarked ? "Remove bookmark" : "Bookmark post"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Flag className="h-4 w-4 mr-2" />
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={getCategoryColor(post.category)}>
              {post.category.replace('-', ' ')}
            </Badge>
            {post.urgency !== "low" && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                {post.urgency}
              </Badge>
            )}
            <Badge variant="outline" className="text-gray-600">
              {post.visibility}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
          <p className="text-gray-600 leading-relaxed">{post.description}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between py-2 border-t border-b border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes} likes</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments?.length || 0} comments</span>
            </div>
            {Object.keys(reactionCounts).length > 0 && (
              <div className="flex items-center space-x-1">
                <span>{Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)} reactions</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {post.shares > 0 && `${post.shares} shares`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`flex items-center space-x-1 ${
                post.isLiked ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-red-600"
              }`}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
              <span>Like</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>

            {/* Reaction buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReaction('love')}
              className="flex items-center space-x-1 text-gray-600 hover:text-pink-600"
            >
              ❤️
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReaction('support')}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              🤝
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`${
              isBookmarked ? "text-blue-600 hover:text-blue-700" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Share Dialog */}
        {showShareDialog && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Share this post</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleShareToSocial('twitter')}>
                Share on Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShareToSocial('facebook')}>
                Share on Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShareToSocial('linkedin')}>
                Share on LinkedIn
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-1" />
                Copy Link
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            {/* Add Comment */}
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-1" />
                    Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                      <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-sm text-gray-900">{comment.author}</h5>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onLikeComment(comment.id)}
                          className={`text-xs ${
                            comment.isLiked ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                          {comment.likes > 0 && comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedPostCard;
