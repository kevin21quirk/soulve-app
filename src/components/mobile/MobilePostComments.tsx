import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Send, Reply, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { FeedPost, Comment } from "@/types/feed";
import { usePostComments } from "@/hooks/usePostComments";
import { useCommentInteractions } from "@/hooks/useCommentInteractions";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobilePostCommentsProps {
  post: FeedPost;
  onAddComment: (postId: string, content: string) => void;
  isExpanded: boolean;
}

const MobileCommentItem = ({ 
  comment, 
  postId, 
  level = 0 
}: { 
  comment: Comment; 
  postId: string; 
  level?: number;
}) => {
  const { user } = useAuth();
  const { likeComment, replyToComment, editComment, deleteComment } = useCommentInteractions();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [replyText, editText]);

  const handleLike = async () => {
    await likeComment(comment.id);
  };

  const handleReply = async () => {
    if (replyText.trim()) {
      const success = await replyToComment(postId, comment.id, replyText);
      if (success) {
        setReplyText("");
        setShowReplyInput(false);
      }
    }
  };

  const handleEdit = async () => {
    if (editText.trim() && editText !== comment.content) {
      const success = await editComment(comment.id, editText);
      if (success) {
        setIsEditing(false);
      }
    }
  };

  const handleDelete = async () => {
    await deleteComment(comment.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  const isOwnComment = user?.id === comment.authorId;
  const paddingLeft = level > 0 ? `${level * 1}rem` : '0';

  return (
    <div style={{ paddingLeft }} className="mb-3">
      <div className="flex space-x-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
            {comment.author.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-2xl px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                {comment.isOrganization && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                    Org
                  </span>
                )}
                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                {comment.editedAt && (
                  <span className="text-xs text-gray-400 italic">(edited)</span>
                )}
              </div>
              {isOwnComment && !comment.isDeleted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  ref={inputRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full min-h-[60px] p-2 text-sm border rounded-lg resize-none"
                />
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleEdit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 leading-snug">{comment.content}</p>
            )}
          </div>
          {!comment.isDeleted && (
            <div className="flex items-center space-x-4 mt-1 px-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-xs ${
                  comment.isLiked ? "text-red-500 font-semibold" : "text-gray-500"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${comment.isLiked ? "fill-current" : ""}`} />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </button>
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center space-x-1 text-xs text-gray-500"
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </div>
          )}

          {showReplyInput && (
            <div className="mt-2 flex items-end space-x-2 bg-gray-50 rounded-xl p-2">
              <textarea
                ref={inputRef}
                placeholder="Write a reply..."
                value={replyText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-sm border-0 focus:outline-none resize-none min-h-[36px] max-h-[120px]"
                rows={1}
              />
              <Button 
                size="sm" 
                onClick={handleReply} 
                disabled={!replyText.trim()}
                className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-8 w-8 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Render nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <MobileCommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MobilePostComments = ({ 
  post, 
  onAddComment,
  isExpanded 
}: MobilePostCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const { comments, loading } = usePostComments(post.id);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (!isExpanded && comments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mt-3 pt-3 border-t border-gray-100">
        {/* Comments List */}
        {loading ? (
          <div className="space-y-3 mb-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-1 mb-3">
            {comments.map((comment) => (
              <MobileCommentItem key={comment.id} comment={comment} postId={post.id} />
            ))}
          </div>
        ) : isExpanded ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </div>
        ) : null}
      </div>

      {/* Add Comment - Fixed at bottom */}
      {isExpanded && (
        <div className="sticky bottom-0 bg-background border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-end space-x-2 bg-gray-50 rounded-xl p-3 relative">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
                Y
              </AvatarFallback>
            </Avatar>
            <textarea
              ref={inputRef}
              placeholder="Write a comment..."
              value={newComment}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (newComment.trim()) {
                    handleSubmitComment();
                  }
                }
              }}
              className="flex-1 bg-transparent text-sm border-0 focus:outline-none resize-none min-h-[36px] max-h-[120px] pr-10"
              rows={1}
            />
            {newComment.trim() && (
              <Button
                size="sm"
                onClick={handleSubmitComment}
                className="absolute right-5 bottom-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-8 w-8 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePostComments;
