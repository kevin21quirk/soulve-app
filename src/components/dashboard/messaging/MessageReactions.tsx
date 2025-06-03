
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { useMessageReactions } from "@/hooks/useMessageReactions";
import { useAuth } from "@/contexts/AuthContext";

interface MessageReactionsProps {
  messageId: string;
  isOwn: boolean;
}

const MessageReactions = ({ messageId, isOwn }: MessageReactionsProps) => {
  const { user } = useAuth();
  const { addReaction, getReactions } = useMessageReactions();
  const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  
  const reactions = getReactions(messageId);
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, typeof reactions>);

  const handleReact = (emoji: string) => {
    if (user) {
      addReaction(messageId, emoji, user.id, user.user_metadata?.display_name || 'User');
    }
  };

  return (
    <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
        <Button
          key={emoji}
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => handleReact(emoji)}
        >
          <span className="mr-1">{emoji}</span>
          <span>{reactionList.length}</span>
        </Button>
      ))}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-6 gap-1">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleReact(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageReactions;
