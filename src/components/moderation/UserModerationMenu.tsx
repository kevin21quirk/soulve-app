
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Flag, Shield, UserX } from 'lucide-react';
import ReportDialog from './ReportDialog';
import BlockDialog from './BlockDialog';

interface UserModerationMenuProps {
  userId: string;
  userName?: string;
  postId?: string;
  className?: string;
}

const UserModerationMenu = ({ 
  userId, 
  userName, 
  postId, 
  className = "" 
}: UserModerationMenuProps) => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${className}`}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => setShowReportDialog(true)}
            className="text-orange-600 focus:text-orange-700"
          >
            <Flag className="h-4 w-4 mr-2" />
            Report {postId ? 'Post' : 'User'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowBlockDialog(true)}
            className="text-red-600 focus:text-red-700"
          >
            <Shield className="h-4 w-4 mr-2" />
            Block User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog
        isOpen={showReportDialog}
        onOpenChange={setShowReportDialog}
        reportedUserId={postId ? undefined : userId}
        reportedPostId={postId}
        reportedUserName={userName}
      />

      <BlockDialog
        isOpen={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        userId={userId}
        userName={userName}
      />
    </>
  );
};

export default UserModerationMenu;
