
import { useEffect } from 'react';
import { RecommendationService } from '@/services/recommendationService';
import { supabase } from '@/integrations/supabase/client';

export const useInteractionTracking = () => {
  const trackPostLike = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await RecommendationService.trackInteraction(user.id, 'like', undefined, postId);
    }
  };

  const trackPostShare = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await RecommendationService.trackInteraction(user.id, 'share', undefined, postId);
    }
  };

  const trackPostComment = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await RecommendationService.trackInteraction(user.id, 'comment', undefined, postId);
    }
  };

  const trackConnection = async (targetUserId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await RecommendationService.trackInteraction(user.id, 'connect', targetUserId);
    }
  };

  const trackPostView = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await RecommendationService.trackInteraction(user.id, 'view', undefined, postId);
    }
  };

  return {
    trackPostLike,
    trackPostShare,
    trackPostComment,
    trackConnection,
    trackPostView,
  };
};
