
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Smile, ThumbsUp, Rocket, Lightbulb, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from 'date-fns';
import { useImpactTracking } from '@/hooks/useImpactTracking';

interface FeedPostCardProps {
  post: {
    id: string;
    author: string;
    authorAvatar: string;
    title: string;
    description: string;
    category: string;
    urgency?: string;
    location?: string;
    date: Date;
    likes: number;
    shares: number;
    responses: number;
    comments: {
      id: string;
      author: string;
      text: string;
      likes: number;
      reactions: { type: string; count: number }[];
    }[];
    tags?: string[];
  };
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction: (postId: string, commentId: string, reactionType: string) => void;
}

const FeedPostCard = ({ post, onLike, onShare, onRespond, onBookmark, onReaction, onAddComment, onLikeComment, onCommentReaction }: FeedPostCardProps) => {
  const { trackCommunityEngagement, trackHelpProvided } = useImpactTracking();
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();

  const handleLike = () => {
    onLike(post.id);
    trackCommunityEngagement('post_like', `Liked post: ${post.title}`);
  };

  const handleShare = () => {
    onShare(post.id);
    trackCommunityEngagement('post_share', `Shared post: ${post.title}`);
  };

  const handleRespond = () => {
    onRespond(post.id);
    if (post.category === 'help_needed') {
      trackHelpProvided(post.title, { postId: post.id, category: post.category });
    } else {
      trackCommunityEngagement('help_response', `Responded to: ${post.title}`);
    }
  };

  const handleAddComment = (comment: string) => {
    onAddComment(post.id, comment);
    trackCommunityEngagement('post_comment', `Commented on: ${post.title}`);
  };

  const handleSubmitComment = () => {
    if (commentText.trim() !== "") {
      handleAddComment(commentText);
      setCommentText("");
    }
  };

  const renderReactions = () => {
    const reactions = [
      { type: "thumbsUp", icon: <ThumbsUp className="h-4 w-4 mr-1" /> },
      { type: "rocket", icon: <Rocket className="h-4 w-4 mr-1" /> },
      { type: "lightbulb", icon: <Lightbulb className="h-4 w-4 mr-1" /> },
      { type: "checkCircle", icon: <CheckCircle className="h-4 w-4 mr-1" /> },
    ];

    return (
      <div className="flex items-center space-x-2">
        {reactions.map((reaction) => (
          <Button
            key={reaction.type}
            variant="ghost"
            size="icon"
            onClick={() => onReaction(post.id, reaction.type)}
          >
            {reaction.icon}
          </Button>
        ))}
      </div>
    );
  };

  // Get user display name safely
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    // Try to get first_name and last_name from user profile
    const firstName = (user as any)?.user_metadata?.first_name || (user as any)?.first_name || '';
    const lastName = (user as any)?.user_metadata?.last_name || (user as any)?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.email?.split('@')[0] || 'User';
  };

  const userDisplayName = getUserDisplayName();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.authorAvatar} alt={post.author} />
            <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-sm font-medium">{post.author}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {formatDistanceToNow(post.date, { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onBookmark(post.id)}>
              Bookmark
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-sm font-medium">{post.title}</div>
        <p className="text-sm text-muted-foreground">
          {post.description}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" onClick={handleLike}>
            <Heart className="h-4 w-4 mr-2" />
            <span>{post.likes} Likes</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            <span>{post.shares} Shares</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRespond}>
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>{post.responses} Respond</span>
          </Button>
        </div>
        {renderReactions()}
      </CardFooter>
      {post.comments && post.comments.length > 0 && (
        <CardContent className="py-2">
          <div className="text-sm font-medium">Comments:</div>
          {post.comments.map((comment) => (
            <div key={comment.id} className="mt-2 flex items-start">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://avatar.vercel.sh/${comment.author}.png`} alt={comment.author} />
                <AvatarFallback>{comment.author.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="ml-2 flex-1">
                <div className="text-xs font-semibold">{comment.author}</div>
                <div className="text-xs text-gray-700">{comment.text}</div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <Button variant="ghost" size="icon" onClick={() => onLikeComment(post.id, comment.id)}>
                    <Heart className="h-3 w-3 mr-1" />
                    <span>{comment.likes}</span>
                  </Button>
                  <div className="flex items-center space-x-1">
                    {comment.reactions.map((reaction) => (
                      <Button
                        key={reaction.type}
                        variant="ghost"
                        size="icon"
                        onClick={() => onCommentReaction(post.id, comment.id, reaction.type)}
                      >
                        {reaction.type === "thumbsUp" && <ThumbsUp className="h-3 w-3 mr-1" />}
                        {reaction.type === "rocket" && <Rocket className="h-3 w-3 mr-1" />}
                        <span>{reaction.count}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      )}
      <CardFooter className="flex items-center space-x-2 py-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={`https://avatar.vercel.sh/${userDisplayName}.png`} alt={userDisplayName} />
          <AvatarFallback>{userDisplayName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <Input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmitComment();
            }
          }}
          className="flex-1 text-xs"
        />
        <Button size="sm" onClick={handleSubmitComment} disabled={commentText.trim() === ""}>
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedPostCard;
