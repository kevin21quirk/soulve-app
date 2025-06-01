
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';
import { UseUserProfileReturn } from './profile/types';
import { createDefaultProfile, mapDatabaseProfileToUserProfile, mapUserProfileToDatabase } from './profile/profileUtils';
import { fetchUserProfile, upsertUserProfile } from './profile/profileService';
import { useRealTimeProfile } from './useRealTimeProfile';
import { useProfileSync } from './useProfileSync';

export const useUserProfile = (): UseUserProfileReturn => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profileUpdates } = useRealTimeProfile();
  const { syncProfileToPreferences, calculateImpactMetrics } = useProfileSync();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { data: profile, error: profileError } = await fetchUserProfile(user.id);

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError(profileError.message);
          return;
        }

        // If no profile exists, create a default one from user data
        if (!profile) {
          console.log('No profile found, creating default profile');
          const defaultProfile = createDefaultProfile(user);
          
          // Try to create the profile in the database
          const profileDataForDB = mapUserProfileToDatabase(defaultProfile);
          const { error: createError } = await upsertUserProfile(profileDataForDB);
          
          if (createError) {
            console.error('Error creating profile:', createError);
            // Still show the default profile even if DB save fails
          }
          
          setProfileData(defaultProfile);
        } else {
          // Create profile data object with real user data
          const userProfileData = mapDatabaseProfileToUserProfile(user, profile);
          setProfileData(userProfileData);
        }

        // Calculate impact metrics on profile load
        await calculateImpactMetrics();
      } catch (err) {
        console.error('Error in loadProfile:', err);
        // Fallback to default profile if everything fails
        const defaultProfile = createDefaultProfile(user);
        setProfileData(defaultProfile);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, calculateImpactMetrics]);

  // Apply real-time updates
  useEffect(() => {
    if (profileUpdates[user?.id || ''] && profileData) {
      const updatedProfile = mapDatabaseProfileToUserProfile(user, profileUpdates[user?.id || '']);
      setProfileData(updatedProfile);
    }
  }, [profileUpdates, user, profileData]);

  const updateProfile = async (updatedData: UserProfileData) => {
    if (!user) return;

    try {
      const profileData = mapUserProfileToDatabase(updatedData);
      const { error } = await upsertUserProfile(profileData);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setProfileData(updatedData);
      
      // Sync to preferences for recommendations
      await syncProfileToPreferences(updatedData);
      
      // Recalculate impact metrics
      await calculateImpactMetrics();
    } catch (err) {
      console.error('Error in updateProfile:', err);
      throw err;
    }
  };

  return {
    profileData,
    loading,
    error,
    updateProfile
  };
};
