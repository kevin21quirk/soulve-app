
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

  const loadProfile = useCallback(async () => {
    if (!user || hasInitializedRef.current) return;

    console.log('useUserProfile - Loading profile for user:', user.id);
    
    try {
      setInitialLoading(true);
      setError(null);
      
      const { data: profile, error: profileError } = await fetchUserProfile(user.id);

      if (profileError) {
        console.error('useUserProfile - Error fetching profile:', profileError);
        setError(profileError.message);
        // Still create default profile for display
        const defaultProfile = createDefaultProfile(user);
        setProfileData(defaultProfile);
        hasInitializedRef.current = true;
        return;
      }

      console.log('useUserProfile - Profile data from DB:', profile);
      
      // Always use database profile data if it exists, otherwise create default
      const userProfileData = mapDatabaseProfileToUserProfile(user, profile);
      console.log('useUserProfile - Mapped profile data:', userProfileData);
      setProfileData(userProfileData);

      // If no profile exists in database, create one
      if (!profile) {
        console.log('useUserProfile - No profile found, creating default profile in DB');
        const defaultProfile = createDefaultProfile(user);
        const profileDataForDB = mapUserProfileToDatabase(defaultProfile);
        const { error: createError } = await upsertUserProfile(profileDataForDB);
        
        if (createError) {
          console.error('useUserProfile - Error creating profile:', createError);
        }
      }

      await calculateImpactMetrics();
      hasInitializedRef.current = true;
    } catch (err) {
      console.error('useUserProfile - Error in loadProfile:', err);
      setError('Failed to load profile');
      // Fallback to default profile
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
      hasInitializedRef.current = false;
      setProfileData(null);
      setInitialLoading(true);
    }
  }, [user, loadProfile]);

  // Apply real-time updates
  useEffect(() => {
    const currentUserUpdates = profileUpdates[user?.id || ''];
    if (currentUserUpdates && profileData && user) {
      console.log('useUserProfile - Applying real-time updates:', currentUserUpdates);
      const updatedProfile = mapDatabaseProfileToUserProfile(user, currentUserUpdates);
      
      if (
        updatedProfile.name !== profileData.name ||
        updatedProfile.bio !== profileData.bio ||
        updatedProfile.location !== profileData.location ||
        JSON.stringify(updatedProfile.skills) !== JSON.stringify(profileData.skills) ||
        JSON.stringify(updatedProfile.interests) !== JSON.stringify(profileData.interests)
      ) {
        setProfileData(updatedProfile);
        clearUpdates();
      }
    }
  }, [profileUpdates, user, profileData, clearUpdates]);

  const updateProfile = useCallback(async (updatedData: UserProfileData) => {
    if (!user) return;

    console.log('useUserProfile - Updating profile:', updatedData);
    
    try {
      setUpdating(true);
      const profileData = mapUserProfileToDatabase(updatedData);
      const { error } = await upsertUserProfile(profileData);

      if (error) {
        console.error('useUserProfile - Error updating profile:', error);
        throw error;
      }

      setProfileData(updatedData);
      
      syncProfileToPreferences(updatedData).catch(console.error);
      calculateImpactMetrics().catch(console.error);
    } catch (err) {
      console.error('useUserProfile - Error in updateProfile:', err);
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
