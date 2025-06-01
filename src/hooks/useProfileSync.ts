
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

export const useProfileSync = () => {
  const { user } = useAuth();

  const syncProfileToPreferences = useCallback(async (profileData: UserProfileData) => {
    if (!user) return;

    try {
      // Clear existing preferences
      await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user.id);

      const preferences: any[] = [];

      // Add skills as preferences
      profileData.skills.forEach(skill => {
        preferences.push({
          user_id: user.id,
          preference_type: 'skill',
          preference_value: skill.toLowerCase(),
          weight: 3.0
        });
      });

      // Add interests as preferences
      profileData.interests.forEach(interest => {
        preferences.push({
          user_id: user.id,
          preference_type: 'interest',
          preference_value: interest.toLowerCase(),
          weight: 2.0
        });
      });

      // Add location preference
      if (profileData.location && profileData.location !== 'Location not set') {
        preferences.push({
          user_id: user.id,
          preference_type: 'location_preference',
          preference_value: profileData.location.toLowerCase(),
          weight: 1.5
        });
      }

      if (preferences.length > 0) {
        await supabase
          .from('user_preferences')
          .insert(preferences);
      }

      console.log(`Synced ${preferences.length} preferences for recommendations`);
    } catch (error) {
      console.error('Error syncing profile to preferences:', error);
    }
  }, [user]);

  const calculateImpactMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Call the database function to calculate impact metrics
      await supabase.rpc('calculate_user_impact_metrics', {
        target_user_id: user.id
      });
    } catch (error) {
      console.error('Error calculating impact metrics:', error);
    }
  }, [user?.id]);

  return {
    syncProfileToPreferences,
    calculateImpactMetrics
  };
};
