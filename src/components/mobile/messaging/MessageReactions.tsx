import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageReaction } from "@/types/messaging";

interface MessageReactionsProps {
  reactions?: MessageReaction[];
  showReactions: boolean;
  onReaction: (emoji: string) => void;
  isOwn: boolean;
}

const commonEmojis = ["❤️", "👍", "😂", "😮", "😢", "😡"];

const MessageReactions = ({ 
  reactions = [], 
  showReactions, 
  onReaction, 
  isOwn 
}: MessageReactionsProps) => {
  const [showAll, setShowAll] = useState(false);

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>);

  return (
    <div className={`relative ${isOwn ? 'text-right' : 'text-left'}`}>
      {/* Existing reactions */}
      {Object.keys(groupedReactions).length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
            <button
              key={emoji}
              className="bg-white border border-gray-200 rounded-full px-2 py-1 text-xs flex items-center space-x-1 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => onReaction(emoji)}
            >
              <span>{emoji}</span>
              <span className="text-gray-600">{reactionList.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick reaction picker */}
      {showReactions && (
        <div className={`absolute z-10 mt-1 ${isOwn ? 'right-0' : 'left-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
            <div className="flex space-x-2">
              {commonEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-10 w-10 p-0 hover:bg-gray-100 text-lg"
                  onClick={() => onReaction(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            
            {showAll && (
              <div className="grid grid-cols-6 gap-1 mt-2 pt-2 border-t border-gray-200">
                {["🔥", "💯", "🎉", "👏", "💪", "🙏", "😍", "🤔", "😊", "👌", "✨", "💫"].map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => onReaction(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs text-gray-500"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageReactions;
