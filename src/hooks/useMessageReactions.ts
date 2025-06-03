
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export const useMessageReactions = () => {
  const { toast } = useToast();
  const [reactions, setReactions] = useState<Record<string, MessageReaction[]>>({});

  const addReaction = useCallback((messageId: string, emoji: string, userId: string, userName: string) => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || [];
      const existingReaction = messageReactions.find(r => r.userId === userId && r.emoji === emoji);
      
      if (existingReaction) {
        // Remove reaction if it already exists
        return {
          ...prev,
          [messageId]: messageReactions.filter(r => !(r.userId === userId && r.emoji === emoji))
        };
      } else {
        // Add new reaction
        const newReaction: MessageReaction = {
          emoji,
          userId,
          userName,
          timestamp: new Date().toISOString()
        };
        return {
          ...prev,
          [messageId]: [...messageReactions, newReaction]
        };
      }
    });
  }, []);

  const getReactions = useCallback((messageId: string) => {
    return reactions[messageId] || [];
  }, [reactions]);

  return {
    reactions,
    addReaction,
    getReactions
  };
};
