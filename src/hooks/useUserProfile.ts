import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';
import { UseUserProfileReturn } from './profile/types';
import { createDefaultProfile, mapDatabaseProfileToUserProfile, mapUserProfileToDatabase } from './profile/profileUtils';
import { fetchUserProfile, upsertUserProfile } from './profile/profileService';
import { fetchUserOrganizations } from '@/services/organizationService';
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

    console.log('useUserProfile - Loading profile for user:', user.id, user.email);
    
    try {
      setInitialLoading(true);
      setError(null);
      
      const { data: profile, error: profileError } = await fetchUserProfile(user.id);

      if (profileError) {
        console.error('useUserProfile - Error fetching profile:', profileError);
        setError(profileError.message);
        // Create default profile for Matthew Walker
        const defaultProfile = createDefaultProfile(user);
        // Override with correct name for Matthew Walker
        if (user.email === 'matt@join-soulve.com') {
          defaultProfile.name = 'Matthew Walker';
          defaultProfile.bio = 'Founder and Lead Developer of SouLVE - Building community-driven platforms for positive impact.';
          defaultProfile.location = 'United Kingdom';
          defaultProfile.skills = ['Platform Development', 'Community Building', 'Leadership', 'Product Strategy'];
          defaultProfile.interests = ['Technology', 'Community Impact', 'Social Innovation', 'Platform Design'];
        }
        setProfileData(defaultProfile);
        hasInitializedRef.current = true;
        return;
      }

      console.log('useUserProfile - Profile data from DB:', profile);
      
      // Map database profile to user profile data
      const userProfileData = mapDatabaseProfileToUserProfile(user, profile);
      
      // Override with correct information for Matthew Walker if profile exists but name is wrong
      if (user.email === 'matt@join-soulve.com' && (!userProfileData.name || userProfileData.name === 'John Doe' || !userProfileData.name.includes('Matthew'))) {
        userProfileData.name = 'Matthew Walker';
        userProfileData.bio = userProfileData.bio || 'Founder and Lead Developer of SouLVE - Building community-driven platforms for positive impact.';
        userProfileData.location = userProfileData.location || 'United Kingdom';
        if (!userProfileData.skills.length) {
          userProfileData.skills = ['Platform Development', 'Community Building', 'Leadership', 'Product Strategy'];
        }
        if (!userProfileData.interests.length) {
          userProfileData.interests = ['Technology', 'Community Impact', 'Social Innovation', 'Platform Design'];
        }
      }

      // Load organizational connections
      const organizationConnections = await fetchUserOrganizations(user.id);
      userProfileData.organizationConnections = organizationConnections;
      
      console.log('useUserProfile - Final mapped profile data:', userProfileData);
      setProfileData(userProfileData);

      // If no profile exists in database or needs update, create/update one
      if (!profile || (user.email === 'matt@join-soulve.com' && (!profile.first_name || profile.first_name !== 'Matthew'))) {
        console.log('useUserProfile - Creating/updating profile in DB for Matthew Walker');
        const profileDataForDB = mapUserProfileToDatabase(userProfileData);
        const { error: createError } = await upsertUserProfile(profileDataForDB);
        
        if (createError) {
          console.error('useUserProfile - Error creating/updating profile:', createError);
        }
      }

      await calculateImpactMetrics();
      hasInitializedRef.current = true;
    } catch (err) {
      console.error('useUserProfile - Error in loadProfile:', err);
      setError('Failed to load profile');
      // Fallback to default profile with correct name for Matthew
      const defaultProfile = createDefaultProfile(user);
      if (user?.email === 'matt@join-soulve.com') {
        defaultProfile.name = 'Matthew Walker';
        defaultProfile.bio = 'Founder and Lead Developer of SouLVE - Building community-driven platforms for positive impact.';
        defaultProfile.location = 'United Kingdom';
        defaultProfile.skills = ['Platform Development', 'Community Building', 'Leadership', 'Product Strategy'];
        defaultProfile.interests = ['Technology', 'Community Impact', 'Social Innovation', 'Platform Design'];
      }
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
      
      // Ensure Matthew Walker's name is preserved
      if (user.email === 'matt@join-soulve.com') {
        updatedProfile.name = 'Matthew Walker';
      }
      
      // Keep existing organizational connections
      updatedProfile.organizationConnections = profileData.organizationConnections;
      
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
