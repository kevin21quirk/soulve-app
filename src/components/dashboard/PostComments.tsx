import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Send, Reply, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { FeedPost, Comment } from "@/types/feed";
import { usePostComments } from "@/hooks/usePostComments";
import { useCommentInteractions } from "@/hooks/useCommentInteractions";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import UserTagging from "./tagging/UserTagging";
import TaggedText from "./tagging/TaggedText";
import { supabase } from "@/integrations/supabase/client";
import { useLanguageDetection } from "@/hooks/useLanguageDetection";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useUserLanguagePreference } from "@/hooks/useUserLanguagePreference";
import { TranslationButton } from "@/components/translation/TranslationButton";
import { TranslatedContent } from "@/components/translation/TranslatedContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCommentsProps {
  post: FeedPost;
  onAddComment: (postId: string, content: string) => void;
  isExpanded: boolean;
}

const CommentItem = ({ 
  comment, 
  postId, 
  level = 0,
  onDelete
}: { 
  comment: Comment; 
  postId: string; 
  level?: number;
  onDelete?: (commentId: string) => void;
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { likeComment, replyToComment, editComment, deleteComment } = useCommentInteractions();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyTaggedUserIds, setReplyTaggedUserIds] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  
  // Translation support
  const { preference } = useUserLanguagePreference();
  const { needsTranslation, detectedLanguage } = useLanguageDetection(
    comment.content,
    preference?.preferred_language || 'en',
    preference?.show_translation_button !== false
  );
  const { 
    isTranslated, 
    translatedText, 
    isLoading: isTranslating,
    translate,
    toggleTranslation 
  } = useContentTranslation(comment.id, 'comment');

  const handleTranslate = async () => {
    await translate(comment.content, preference?.preferred_language || 'en', detectedLanguage);
  };

  const handleLike = async () => {
    await likeComment(comment.id);
  };

  const handleReply = async () => {
    if (replyText.trim()) {
      const success = await replyToComment(postId, comment.id, replyText, replyTaggedUserIds);
      if (success) {
        setReplyText("");
        setReplyTaggedUserIds([]);
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
    if (onDelete) {
      onDelete(comment.id);
    } else {
      await deleteComment(comment.id);
    }
  };

  const handleUserTagClick = async (username: string) => {
    try {
      // Try to find user first
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .or(`first_name.ilike.%${username.split('_')[0]}%,last_name.ilike.%${username.split('_')[1] || username.split('_')[0]}%`)
        .single();
      
      if (userData?.id) {
        navigate(`/profile/${userData.id}`);
        return;
      }

      // Try to find organization
      const { data: orgData } = await supabase
        .from('organizations')
        .select('id')
        .ilike('name', `%${username.replace(/_/g, ' ')}%`)
        .single();
      
      if (orgData?.id) {
        navigate(`/organization/${orgData.id}`);
      }
    } catch (error) {
      console.error('Error finding entity:', error);
    }
  };

  const isOwnComment = user?.id === comment.authorId;
  const marginLeft = level > 0 ? `${level * 2.5}rem` : '0';

  return (
    <div style={{ marginLeft }} className="mb-3">
      <div className="flex space-x-3">
        <Avatar 
          className="h-8 w-8 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={() => comment.authorId && navigate(`/profile/${comment.authorId}`)}
        >
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
            {comment.author.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span 
                  className="font-medium text-sm text-gray-900 cursor-pointer hover:text-primary hover:underline transition-colors"
                  onClick={() => comment.authorId && navigate(`/profile/${comment.authorId}`)}
                >
                  {comment.author}
                </span>
                {comment.isOrganization && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                    Organization
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
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[60px] resize-none"
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
              <>
                {isTranslated ? (
                  <TranslatedContent
                    translatedText={translatedText}
                    originalLanguage={detectedLanguage}
                    onUserClick={handleUserTagClick}
                    className="text-sm text-gray-700"
                  />
                ) : (
                  <TaggedText 
                    text={comment.content} 
                    className="text-sm text-gray-700"
                    onUserClick={handleUserTagClick}
                  />
                )}
                
                {needsTranslation && preference?.show_translation_button !== false && (
                  <div className="mt-1">
                    <TranslationButton
                      isTranslated={isTranslated}
                      isLoading={isTranslating}
                      detectedLanguage={detectedLanguage}
                      onTranslate={handleTranslate}
                      onToggle={toggleTranslation}
                      className="text-xs"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {!comment.isDeleted && (
            <div className="flex items-center space-x-4 mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-6 px-2 text-xs ${
                  comment.isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                }`}
              >
                <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          )}
          
          {showReplyInput && (
            <div className="mt-2 flex space-x-2">
              <UserTagging
                placeholder="Write a reply... (Type @ to tag someone)"
                value={replyText}
                onChange={(value, users) => {
                  setReplyText(value);
                  setReplyTaggedUserIds(users.map(u => u.id));
                }}
                className="flex-1 min-h-[60px] resize-none text-sm"
              />
              <Button size="sm" onClick={handleReply} disabled={!replyText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Render nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  level={level + 1}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PostComments = ({ 
  post, 
  onAddComment,
  isExpanded 
}: PostCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [taggedUserIds, setTaggedUserIds] = useState<string[]>([]);
  const { comments, loading, addOptimisticComment, removeComment } = usePostComments(post.id);
  const { deleteComment } = useCommentInteractions();

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Add optimistic comment immediately
      const tempComment = addOptimisticComment(newComment.trim());
      
      // Clear input immediately
      setNewComment("");
      setTaggedUserIds([]);
      
      // Send to database in background
      onAddComment(post.id, tempComment?.content || newComment.trim());
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    // Remove from UI immediately
    removeComment(commentId);
    
    // Delete from database in background
    await deleteComment(commentId, removeComment);
  };

  if (!isExpanded && comments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Comments List - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="mt-4 pt-4 border-t border-gray-100">
          {loading ? (
            <div className="space-y-4 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-2 mb-4">
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  postId={post.id}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          ) : isExpanded ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No comments yet. Be the first to comment!
            </div>
          ) : null}
        </div>
      </div>

      {/* Add Comment - Fixed at bottom */}
      {isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-gray-200 pt-3 pb-4 px-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
              <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
                Y
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <UserTagging
                placeholder="Write a comment... (Type @ to tag someone)"
                value={newComment}
                onChange={(value, users) => {
                  setNewComment(value);
                  setTaggedUserIds(users.map(u => u.id));
                }}
                multiline
                rows={1}
                className="min-h-[40px] resize-none border-gray-200 focus:border-teal-500 focus:ring-teal-500 pr-10"
              />
              {newComment.trim() && (
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af] hover:to-[#18a5fe]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComments;
