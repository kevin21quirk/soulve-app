import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UnifiedConversation } from "@/types/unified-messaging";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MoreVertical, Trash2 } from "lucide-react";
import { useDeleteConversation } from "@/hooks/useDeleteConversation";

interface ConversationItemProps {
  conversation: UnifiedConversation;
  isActive: boolean;
  onClick: () => void;
  userId: string;
}

const ConversationItem = ({ conversation, isActive, onClick, userId }: ConversationItemProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteConversation = useDeleteConversation();
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = () => {
    deleteConversation.mutate({
      userId,
      partnerId: conversation.partner_id,
    });
    setShowDeleteDialog(false);
  };

  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors group",
          "min-h-[56px] md:min-h-[48px]",
          isActive && "bg-accent"
        )}
      >
      <div className="relative">
        <Avatar className="h-12 w-12 md:h-10 md:w-10">
          <AvatarImage src={conversation.partner_avatar} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(conversation.partner_name)}
          </AvatarFallback>
        </Avatar>
        {conversation.is_online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">
            {conversation.partner_name}
          </h3>
          {conversation.last_message_time && (
            <span className="text-xs text-muted-foreground shrink-0">
              {formatTimestamp(conversation.last_message_time)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.last_message || 'No messages yet'}
          </p>
          {conversation.unread_count > 0 && (
            <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </button>

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all messages with {conversation.partner_name}. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};

export default ConversationItem;
