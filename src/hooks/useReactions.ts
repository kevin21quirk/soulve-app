
import { useMemo } from 'react';
import { Reaction } from '@/types/feed';

export const useReactions = (reactions?: Reaction[]) => {
  const reactionCounts = useMemo(() => {
    if (!reactions) return {};
    
    return reactions.reduce((acc, reaction) => {
      if (typeof reaction === 'string') {
        acc[reaction] = (acc[reaction] || 0) + 1;
      } else if (typeof reaction === 'object' && reaction.type) {
        acc[reaction.type] = reaction.count || 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [reactions]);

  const totalReactions = useMemo(() => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  }, [reactionCounts]);

  const hasUserReacted = useMemo(() => {
    return reactions?.some(r => 
      typeof r === 'object' && r.hasReacted
    ) || false;
  }, [reactions]);

  return {
    reactionCounts,
    totalReactions,
    hasUserReacted
  };
};
