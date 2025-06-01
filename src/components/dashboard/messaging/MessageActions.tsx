
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Reply, 
  Edit,
  Trash2,
  Forward,
  Pin,
  MessageSquare,
  Copy
} from "lucide-react";

interface MessageActionsProps {
  messageId: string;
  messageContent: string;
  isOwn: boolean;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onForward: (messageId: string, conversationIds: string[]) => void;
  onPin: (messageId: string) => void;
  onCreateThread: (messageId: string) => void;
}

const MessageActions = ({
  messageId,
  messageContent,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onPin,
  onCreateThread
}: MessageActionsProps) => {
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onReply(messageId)}
        className="h-6 text-xs"
      >
        <Reply className="h-3 w-3 mr-1" />
        Reply
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleCopyMessage(messageContent)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCreateThread(messageId)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Start thread
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onForward(messageId, [])}>
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPin(messageId)}>
            <Pin className="h-4 w-4 mr-2" />
            Pin message
          </DropdownMenuItem>
          {isOwn && (
            <>
              <DropdownMenuItem onClick={() => onEdit(messageId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(messageId)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MessageActions;
