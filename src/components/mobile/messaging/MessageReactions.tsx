import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MessageReactionsProps {
  reactions?: Array<{
    emoji: string;
    userId: string;
    userName: string;
  }>;
  showReactions: boolean;
  onReaction: (emoji: string) => void;
  isOwn: boolean;
}

const MessageReactions = ({ 
  reactions, 
  showReactions, 
  onReaction, 
  isOwn 
}: MessageReactionsProps) => {
  const reactionEmojis = ['❤️', '👍', '😂', '😮', '😢', '😡'];

  return (
    <>
      {/* Existing reactions */}
      {reactions && reactions.length > 0 && (
        <div className={`flex flex-wrap gap-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          {reactions.map((reaction, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
              {reaction.emoji} {reaction.userId === 'current-user' ? 'You' : reaction.userName}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Quick reactions (shown on long press) */}
      {showReactions && (
        <div className="absolute top-0 left-0 right-0 bg-white border rounded-lg shadow-lg p-2 z-10">
          <div className="flex space-x-2">
            {reactionEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => onReaction(emoji)}
                className="text-lg p-1"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageReactions;
