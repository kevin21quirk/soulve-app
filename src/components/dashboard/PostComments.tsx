
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, Heart } from "lucide-react";
import { Comment, FeedPost } from "@/types/feed";
import { useToast } from "@/hooks/use-toast";
import PostReactions from "./PostReactions";
import AutoCommentSuggestions from "./AutoCommentSuggestions";
import UserTagging from "./tagging/UserTagging";
import TaggedText from "./tagging/TaggedText";

interface TaggedUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface PostCommentsProps {
  post: FeedPost;
  onAddComment: (postId: string, content: string, taggedUsers?: TaggedUser[]) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onReaction?: (postId: string, reactionType: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
}

const PostComments = ({ 
  post, 
  onAddComment, 
  onLikeComment, 
  onReaction,
  onCommentReaction 
}: PostCommentsProps) => {
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentTaggedUsers, setCommentTaggedUsers] = useState<TaggedUser[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    onAddComment(post.id, newComment, commentTaggedUsers);
    setNewComment("");
    setCommentTaggedUsers([]);
    
    toast({
      title: "Comment added!",
      description: `Your comment has been posted${commentTaggedUsers.length > 0 ? ` and ${commentTaggedUsers.length} user(s) have been tagged` : ''}.`,
    });
  };

  const handleAutoCommentSelect = (comment: string) => {
    setNewComment(comment);
    setCommentTaggedUsers([]);
  };

  const handleCommentReaction = (commentId: string, reactionType: string) => {
    if (onCommentReaction) {
      onCommentReaction(post.id, commentId, reactionType);
    }
  };

  const handleCommentChange = (value: string, users: TaggedUser[]) => {
    setNewComment(value);
    setCommentTaggedUsers(users);
  };

  const handleUserClick = (username: string) => {
    toast({
      title: "User Profile",
      description: `Clicked on @${username}`,
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex space-x-3 ${isReply ? 'ml-8 mt-2' : 'mt-3'}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.avatar} />
        <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{comment.author}</span>
              <span className="text-xs text-gray-500">{comment.timestamp}</span>
            </div>
            <TaggedText 
              text={comment.content} 
              className="text-sm text-gray-700"
              onUserClick={handleUserClick}
            />
          </CardContent>
        </Card>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          {/* Enhanced Reactions for Comments */}
          {onCommentReaction && (
            <PostReactions 
              post={{
                ...comment,
                id: comment.id,
                reactions: comment.reactions || []
              } as any}
              onReaction={(_, reactionType) => handleCommentReaction(comment.id, reactionType)}
            />
          )}
          
          {/* Traditional Like Button (fallback) */}
          {!onCommentReaction && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 p-0 text-xs"
              onClick={() => onLikeComment(post.id, comment.id)}
            >
              <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {comment.likes > 0 && comment.likes}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 p-0 text-xs"
            onClick={() => setReplyingTo(comment.id)}
          >
            Reply
          </Button>
        </div>
        
        {/* Replies */}
        {comment.replies && comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowComments(!showComments)}
        className="text-gray-600 hover:text-gray-800"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {post.comments?.length || 0} Comments
      </Button>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          {/* Auto Comment Suggestions */}
          <AutoCommentSuggestions 
            onSelectComment={handleAutoCommentSelect}
            category={post.category}
          />

          {/* Add Comment */}
          <div className="flex space-x-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex space-x-2">
              <div className="flex-1">
                <UserTagging
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Write a comment... (Type @ to tag someone)"
                  className="flex-1"
                />
                {commentTaggedUsers.length > 0 && (
                  <div className="mt-1 text-xs text-blue-600">
                    Tagging: {commentTaggedUsers.map(u => `@${u.username}`).join(', ')}
                  </div>
                )}
              </div>
              <Button onClick={handleSubmitComment} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-2">
            {post.comments?.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComments;
