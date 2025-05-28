
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';
import { UseUserProfileReturn } from './profile/types';
import { createDefaultProfile, mapDatabaseProfileToUserProfile, mapUserProfileToDatabase } from './profile/profileUtils';
import { fetchUserProfile, upsertUserProfile } from './profile/profileService';

export const useUserProfile = (): UseUserProfileReturn => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          
          // If the table doesn't exist, create a default profile from user data
          if (profileError.code === '42P01') {
            console.log('Profiles table does not exist, using user data for profile');
            const defaultProfile = createDefaultProfile(user);
            setProfileData(defaultProfile);
            setLoading(false);
            return;
          }
          
          setError(profileError.message);
          return;
        }

        // Create profile data object with real user data or defaults
        const userProfileData = mapDatabaseProfileToUserProfile(user, profile);
        setProfileData(userProfileData);
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
  }, [user]);

  const updateProfile = async (updatedData: UserProfileData) => {
    if (!user) return;

    try {
      const profileData = mapUserProfileToDatabase(updatedData);
      const { error } = await upsertUserProfile(profileData);

      if (error) {
        console.error('Error updating profile:', error);
        
        // If table doesn't exist, just update local state
        if (error.code === '42P01') {
          console.log('Profiles table does not exist, updating local state only');
          setProfileData(updatedData);
          return;
        }
        
        throw error;
      }

      setProfileData(updatedData);
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
