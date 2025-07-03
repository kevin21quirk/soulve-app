
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Flag, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ContentModerationService } from '@/services/contentModerationService';
import EnhancedReportDialog from '@/components/moderation/EnhancedReportDialog';

interface PostActionsProps {
  postId: string;
  authorId: string;
  onPostDeleted?: () => void;
  onReportPost?: () => void;
}

const PostActions = ({ postId, authorId, onPostDeleted, onReportPost }: PostActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = user?.id === authorId;

  const handleDeletePost = async () => {
    if (!user || !isOwnPost) return;
    
    setIsDeleting(true);
    try {
      await ContentModerationService.deletePost(postId);
      toast({
        title: "Post deleted",
        description: "Your post has been removed successfully.",
      });
      onPostDeleted?.();
    } catch (error: any) {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwnPost ? (
            <>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Post'}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem 
              onClick={() => setShowReportDialog(true)}
              className="text-orange-600 focus:text-orange-700"
            >
              <Flag className="h-4 w-4 mr-2" />
              Report Post
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EnhancedReportDialog
        isOpen={showReportDialog}
        onOpenChange={setShowReportDialog}
        reportedPostId={postId}
        reportedUserId={authorId}
      />
    </>
  );
};

export default PostActions;
