
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/messaging";
import { useMobileGestures } from "@/hooks/useMobileGestures";
import MessageContent from "./MessageContent";
import MessageInfo from "./MessageInfo";
import MessageReactions from "./MessageReactions";

interface MobileMessageBubbleProps {
  message: Message;
  onReaction?: (emoji: string) => void;
  onReply?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
}

const MobileMessageBubble = ({ 
  message, 
  onReaction,
  onReply,
  onForward,
  onDelete
}: MobileMessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const { enableSwipeGestures } = useMobileGestures();

  const handleReaction = (emoji: string) => {
    onReaction?.(emoji);
    setShowReactions(false);
  };

  const handleLongPress = () => {
    setShowReactions(true);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  useEffect(() => {
    if (messageRef.current) {
      const cleanup = enableSwipeGestures(messageRef.current);
      return cleanup;
    }
  }, [enableSwipeGestures]);

  return (
    <div 
      ref={messageRef}
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group mb-4`}
    >
      <div className={`flex max-w-[85%] ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar for received messages */}
        {!message.isOwn && (
          <Avatar className="h-8 w-8 mr-2 mt-auto flex-shrink-0">
            <AvatarImage src="/placeholder.svg" alt={message.sender} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
              {message.sender.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        
        {/* Message content area */}
        <div className="space-y-1 relative">
          {/* Sender name for group messages */}
          {!message.isOwn && (
            <p className="text-xs text-gray-500 ml-4">{message.sender}</p>
          )}
          
          <MessageContent 
            message={message}
            onLongPress={handleLongPress}
          />
          
          <MessageInfo message={message} />
          
          <MessageReactions 
            reactions={message.reactions}
            showReactions={showReactions}
            onReact={handleReaction}
            isOwn={message.isOwn}
          />
        </div>
      </div>

      {/* Dismiss overlay for reactions */}
      {showReactions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowReactions(false)}
        />
      )}
    </div>
  );
};

export default MobileMessageBubble;
