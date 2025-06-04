
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReactionData {
  emoji: string;
  count: number;
  userReacted: boolean;
  users?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

interface ReactionDisplayProps {
  reactions: ReactionData[];
  onReactionClick: (emoji: string) => void;
  className?: string;
}

const ReactionDisplay = ({ reactions, onReactionClick, className = "" }: ReactionDisplayProps) => {
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);

  if (reactions.length === 0) return null;

  // Sort reactions by count (highest first) and limit to top 6 for display
  const sortedReactions = reactions
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);
  const hasMoreReactions = reactions.length > 6;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {sortedReactions.map(({ emoji, count, userReacted, users }) => (
        <Popover key={emoji}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReactionClick(emoji)}
              className={`h-7 px-2 text-xs hover:scale-105 transition-all ${
                userReacted 
                  ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                  : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
              onMouseEnter={() => setHoveredReaction(emoji)}
              onMouseLeave={() => setHoveredReaction(null)}
            >
              <span className="mr-1">{emoji}</span>
              <span className="font-medium">{count}</span>
            </Button>
          </PopoverTrigger>
          
          {users && users.length > 0 && (
            <PopoverContent className="w-64 p-3" side="top" align="center">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <span className="text-lg">{emoji}</span>
                  <span className="font-semibold text-sm">{count} {count === 1 ? 'reaction' : 'reactions'}</span>
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {users.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{user.name}</span>
                    </div>
                  ))}
                  
                  {users.length > 10 && (
                    <div className="text-xs text-gray-500 pt-1">
                      and {users.length - 10} more...
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          )}
        </Popover>
      ))}
      
      {hasMoreReactions && (
        <span className="text-xs text-gray-500 ml-2">
          +{totalReactions - sortedReactions.reduce((sum, r) => sum + r.count, 0)} more
        </span>
      )}
    </div>
  );
};

export default ReactionDisplay;
