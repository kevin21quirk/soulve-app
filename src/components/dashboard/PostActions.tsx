
import { Button } from "@/components/ui/button";
import { Heart, Share, MessageSquare, Send, Users, Bookmark, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FeedPost } from "@/types/feed";
import PostReactions from "./PostReactions";
import PostComments from "./PostComments";
import { useState } from "react";

interface PostActionsProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
}

const PostActions = ({ 
  post, 
  onLike, 
  onShare, 
  onRespond, 
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment
}: PostActionsProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <PostReactions post={post} onReaction={onReaction} />
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="hover:scale-105 transition-transform"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShare(post.id)} 
            className={`hover:scale-105 transition-transform ${post.isShared ? 'text-green-600' : ''}`}
          >
            <Share className="h-4 w-4 mr-2" />
            {post.isShared ? 'Shared' : 'Share'}
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(post.id)}
            className={`hover:scale-105 transition-transform ${post.isBookmarked ? 'text-blue-600' : ''}`}
          >
            <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </Button>

          {/* Category-specific actions */}
          {post.category === "help-needed" && (
            <Button size="sm" onClick={() => onRespond(post.id)} className="hover:scale-105 transition-transform">
              <Send className="h-4 w-4 mr-2" />
              Offer Help
            </Button>
          )}
          {post.category === "help-offered" && (
            <Button size="sm" onClick={() => onRespond(post.id)} className="hover:scale-105 transition-transform">
              <Users className="h-4 w-4 mr-2" />
              Request Help
            </Button>
          )}

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem>Hide Post</DropdownMenuItem>
              <DropdownMenuItem>Report Post</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
              <DropdownMenuItem>Turn on notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
        <div className="flex items-center space-x-4">
          {post.reactions && post.reactions.length > 0 && (
            <span>{post.reactions.reduce((sum, r) => sum + r.count, 0)} reactions</span>
          )}
          <span>{post.comments?.length || 0} comments</span>
          <span>{post.shares} shares</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{post.responses} responses</span>
          {post.media && post.media.length > 0 && (
            <span>{post.media.length} media</span>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <PostComments 
          post={post}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
        />
      )}
    </div>
  );
};

export default PostActions;
