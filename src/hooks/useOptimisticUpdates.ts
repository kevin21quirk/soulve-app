
import { useState } from 'react';
import { PostWithProfile } from '@/services/realPostsService';

export const useOptimisticUpdates = () => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, any>>(new Map());

  const optimisticLike = (postId: string, liked: boolean) => {
    setOptimisticUpdates(prev => {
      const newUpdates = new Map(prev);
      newUpdates.set(postId, { liked, timestamp: Date.now() });
      return newUpdates;
    });
  };

  const optimisticComment = (postId: string, content: string, userProfile: any) => {
    setOptimisticUpdates(prev => {
      const newUpdates = new Map(prev);
      newUpdates.set(`${postId}_comment`, { 
        content, 
        userProfile, 
        timestamp: Date.now() 
      });
      return newUpdates;
    });
  };

  const optimisticDelete = (commentId: string) => {
    setOptimisticUpdates(prev => {
      const newUpdates = new Map(prev);
      newUpdates.set(`delete_${commentId}`, { deleted: true, timestamp: Date.now() });
      return newUpdates;
    });
  };

  const clearOptimisticUpdate = (key: string) => {
    setOptimisticUpdates(prev => {
      const newUpdates = new Map(prev);
      newUpdates.delete(key);
      return newUpdates;
    });
  };

  const revertOptimisticUpdate = () => {
    setOptimisticUpdates(new Map());
  };

  return {
    optimisticLike,
    optimisticComment,
    optimisticDelete,
    clearOptimisticUpdate,
    revertOptimisticUpdate,
    optimisticUpdates
  };
};
