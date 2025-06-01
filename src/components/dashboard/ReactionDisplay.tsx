
import { Badge } from "@/components/ui/badge";

interface ReactionDisplayProps {
  reactionCounts: Record<string, number>;
  className?: string;
}

const reactionEmojis: Record<string, string> = {
  like: '👍',
  love: '❤️',
  support: '🤝',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠'
};

const ReactionDisplay = ({ reactionCounts, className = "" }: ReactionDisplayProps) => {
  const reactionEntries = Object.entries(reactionCounts).filter(([, count]) => count > 0);

  if (reactionEntries.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {reactionEntries.map(([type, count]) => (
        <div key={type} className="flex items-center space-x-1 text-xs text-gray-500">
          <span>{reactionEmojis[type] || '👍'}</span>
          <span>{count}</span>
        </div>
      ))}
    </div>
  );
};

export default ReactionDisplay;
