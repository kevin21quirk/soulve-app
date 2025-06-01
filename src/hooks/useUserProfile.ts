
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profileUpdates, clearUpdates } = useRealTimeProfile();
  const { syncProfileToPreferences, calculateImpactMetrics } = useProfileSync();
  const hasInitializedRef = useRef(false);

  // Memoize the profile loading function
  const loadProfile = useCallback(async () => {
    if (!user || hasInitializedRef.current) return;

    try {
      setInitialLoading(true);
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

      // Calculate impact metrics only on initial load
      await calculateImpactMetrics();
      hasInitializedRef.current = true;
    } catch (err) {
      console.error('Error in loadProfile:', err);
      // Fallback to default profile if everything fails
      const defaultProfile = createDefaultProfile(user);
      setProfileData(defaultProfile);
      hasInitializedRef.current = true;
    } finally {
      setInitialLoading(false);
    }
  }, [user, calculateImpactMetrics]);

  // Load profile only once when user changes
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      loadProfile();
    } else if (!user) {
      // Reset when user logs out
      hasInitializedRef.current = false;
      setProfileData(null);
      setInitialLoading(true);
    }
  }, [user, loadProfile]);

  // Apply real-time updates with shallow comparison
  useEffect(() => {
    const currentUserUpdates = profileUpdates[user?.id || ''];
    if (currentUserUpdates && profileData && user) {
      // Check if the update is actually different
      const updatedProfile = mapDatabaseProfileToUserProfile(user, currentUserUpdates);
      
      // Simple shallow comparison for key fields to prevent unnecessary updates
      if (
        updatedProfile.name !== profileData.name ||
        updatedProfile.bio !== profileData.bio ||
        updatedProfile.location !== profileData.location ||
        JSON.stringify(updatedProfile.skills) !== JSON.stringify(profileData.skills) ||
        JSON.stringify(updatedProfile.interests) !== JSON.stringify(profileData.interests)
      ) {
        setProfileData(updatedProfile);
        clearUpdates(); // Clear the update after applying it
      }
    }
  }, [profileUpdates, user, profileData, clearUpdates]);

  const updateProfile = useCallback(async (updatedData: UserProfileData) => {
    if (!user) return;

    try {
      setUpdating(true);
      const profileData = mapUserProfileToDatabase(updatedData);
      const { error } = await upsertUserProfile(profileData);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Optimistically update the profile data
      setProfileData(updatedData);
      
      // Sync to preferences for recommendations (don't await to prevent blocking)
      syncProfileToPreferences(updatedData).catch(console.error);
      
      // Recalculate impact metrics (don't await to prevent blocking)
      calculateImpactMetrics().catch(console.error);
    } catch (err) {
      console.error('Error in updateProfile:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [user, syncProfileToPreferences, calculateImpactMetrics]);

  return {
    profileData,
    loading: initialLoading,
    updating,
    error,
    updateProfile
  };
};
