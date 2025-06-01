import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import HelpCompletionDialog from '@/components/help-completion/HelpCompletionDialog';
import { useAuth } from '@/contexts/AuthContext';

interface PostActionsProps {
  post: any;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
}

const PostActions = ({ post, onLike, onShare, onRespond, onBookmark }: PostActionsProps) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  const isHelper = user?.id && user.id !== post.author_id;
  const showHelpCompletion = isHelper && post.category === 'help_needed' && post.is_active;

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(post.id)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          Like
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="text-gray-500 hover:text-gray-700"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Comment
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(post.id)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        {showHelpCompletion && (
          <HelpCompletionDialog
            postId={post.id}
            requesterId={post.author_id}
            postTitle={post.title}
          />
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBookmark(post.id)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PostActions;
