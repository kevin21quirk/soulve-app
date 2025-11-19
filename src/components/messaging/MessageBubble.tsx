import { UnifiedMessage } from "@/types/unified-messaging";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: UnifiedMessage;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

const MessageBubble = ({ message, showAvatar = true, showTimestamp = true }: MessageBubbleProps) => {
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return timestamp;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn(
      "flex gap-2 items-end",
      message.isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      {showAvatar ? (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.senderAvatar} />
          <AvatarFallback className="text-xs bg-muted">
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8 shrink-0" />
      )}

      {/* Message content */}
      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        message.isOwn ? "items-end" : "items-start"
      )}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2 break-words",
            message.isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Timestamp and status */}
        {showTimestamp && (
          <div className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground",
            message.isOwn && "flex-row-reverse"
          )}>
            <span>{formatTime(message.created_at)}</span>
            {message.isOwn && message.status && (
              <span className={cn(
                "flex items-center",
                message.status === 'read' && "text-primary"
              )}>
                {message.status === 'sending' && <Check className="h-3 w-3" />}
                {message.status === 'sent' && <CheckCheck className="h-3 w-3" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
