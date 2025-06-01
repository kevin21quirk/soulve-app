import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Send } from "lucide-react";
import { FeedPost } from "@/types/feed";

interface PostCommentsProps {
  post: FeedPost;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
  isExpanded: boolean;
}

const PostComments = ({ 
  post, 
  onAddComment, 
  onLikeComment, 
  onCommentReaction,
  isExpanded 
}: PostCommentsProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment.trim());
      setNewComment("");
    }
  };

  if (!isExpanded && (!post.comments || post.comments.length === 0)) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Existing Comments */}
      {post.comments && post.comments.length > 0 && (
        <div className="space-y-3 mb-4">
          {post.comments.slice(0, isExpanded ? undefined : 2).map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
                  {comment.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLikeComment(post.id, comment.id)}
                    className={`h-6 px-2 text-xs ${
                      comment.isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                    }`}
                  >
                    <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {!isExpanded && post.comments.length > 2 && (
            <button className="text-sm text-gray-500 hover:text-gray-700">
              View {post.comments.length - 2} more comments
            </button>
          )}
        </div>
      )}

      {/* Add Comment */}
      {isExpanded && (
        <div className="flex space-x-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
              Y
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af] hover:to-[#18a5fe]"
              >
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComments;
