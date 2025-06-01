
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SeasonalChallenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  pointMultiplier: number;
  targetCategories: string[];
  progress: number;
  maxProgress: number;
  reward: string;
  active: boolean;
}

export const useSeasonalChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<SeasonalChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, [user?.id]);

  const loadChallenges = async () => {
    try {
      // Get active challenges
      const { data: activeChallenges, error: challengesError } = await supabase
        .from('seasonal_challenges')
        .select('*')
        .eq('is_active', true);

      if (challengesError) throw challengesError;

      if (!user?.id) {
        // For non-logged-in users, show challenges with 0 progress
        const challengesData = (activeChallenges || []).map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description || '',
          startDate: challenge.start_date,
          endDate: challenge.end_date,
          pointMultiplier: challenge.point_multiplier || 1,
          targetCategories: challenge.target_categories || [],
          progress: 0,
          maxProgress: challenge.max_progress || 100,
          reward: challenge.reward_description || '',
          active: challenge.is_active
        }));
        setChallenges(challengesData);
        setLoading(false);
        return;
      }

      // Get user's progress for each challenge
      const { data: userProgress, error: progressError } = await supabase
        .from('user_challenge_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Combine challenges with user progress
      const challengesData = (activeChallenges || []).map(challenge => {
        const progress = userProgress?.find(up => up.challenge_id === challenge.id);
        
        return {
          id: challenge.id,
          title: challenge.title,
          description: challenge.description || '',
          startDate: challenge.start_date,
          endDate: challenge.end_date,
          pointMultiplier: challenge.point_multiplier || 1,
          targetCategories: challenge.target_categories || [],
          progress: progress?.progress || 0,
          maxProgress: challenge.max_progress || 100,
          reward: challenge.reward_description || '',
          active: challenge.is_active
        };
      });

      setChallenges(challengesData);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    challenges,
    loading,
    refetch: loadChallenges
  };
};
