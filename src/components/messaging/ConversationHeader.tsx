import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { UnifiedConversation } from "@/types/unified-messaging";

interface ConversationHeaderProps {
  conversation: UnifiedConversation;
  onBack?: () => void;
  isMobile: boolean;
}

const ConversationHeader = ({ conversation, onBack, isMobile }: ConversationHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        {isMobile && onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.partner_avatar} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(conversation.partner_name)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold text-sm">{conversation.partner_name}</h2>
          {conversation.is_online && (
            <p className="text-xs text-muted-foreground">Active now</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;
