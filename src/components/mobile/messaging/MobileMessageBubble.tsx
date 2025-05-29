
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/messaging";
import MessageContent from "./MessageContent";
import MessageInfo from "./MessageInfo";
import MessageReactions from "./MessageReactions";

interface MobileMessageBubbleProps {
  message: Message;
}

const MobileMessageBubble = ({ message }: MobileMessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleReaction = (emoji: string) => {
    // Handle adding reaction
    setShowReactions(false);
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowReactions(true);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[85%] ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!message.isOwn && (
          <Avatar className="h-8 w-8 mr-2 mt-auto">
            <AvatarImage src="/placeholder.svg" alt={message.sender} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
              {message.sender.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="space-y-1 relative">
          <MessageContent 
            message={message}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          
          <MessageInfo message={message} />
          
          <MessageReactions 
            reactions={message.reactions}
            showReactions={showReactions}
            onReaction={handleReaction}
            isOwn={message.isOwn}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMessageBubble;
