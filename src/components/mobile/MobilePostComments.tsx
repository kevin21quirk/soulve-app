import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Send, MoreHorizontal } from "lucide-react";
import { FeedPost, Comment } from "@/types/feed";

interface MobilePostCommentsProps {
  post: FeedPost;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
  isExpanded?: boolean;
}

const MobilePostComments = ({ 
  post, 
  onAddComment, 
  onLikeComment, 
  onCommentReaction,
  isExpanded = false 
}: MobilePostCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(isExpanded);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const comments = post.comments || [];
  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment.trim());
      setNewComment("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (comments.length === 0 && !isExpanded) {
    return null;
  }

  return (
    <div className="border-t border-gray-100">
      {/* Existing Comments */}
      {displayedComments.length > 0 && (
        <div className="px-4 py-3 space-y-3">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
                  {comment.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl px-3 py-2">
                  <div className="font-semibold text-sm text-gray-900">{comment.author}</div>
                  <div className="text-sm text-gray-700 mt-1 break-words">{comment.content}</div>
                </div>
                
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>{comment.timestamp}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onLikeComment(post.id, comment.id)}
                    className={`h-auto p-0 text-xs ${
                      comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                    {comment.likes > 0 ? comment.likes : 'Like'}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-gray-500">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Show More Comments Button */}
          {comments.length > 2 && !showAllComments && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAllComments(true)}
              className="text-gray-500 text-xs p-0 h-auto"
            >
              View {comments.length - 2} more comments
            </Button>
          )}
        </div>
      )}

      {/* Add Comment Input */}
      <div className="px-4 py-3 border-t border-gray-50">
        <div className="flex items-end space-x-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
              U
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newComment}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Add a comment..."
              className="w-full bg-gray-50 rounded-2xl px-3 py-2 text-sm resize-none min-h-[36px] max-h-24 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
              rows={1}
            />
          </div>
          
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            size="sm"
            className={`p-2 rounded-full transition-colors ${
              newComment.trim() 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilePostComments;
