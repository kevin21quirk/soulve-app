import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ProfileLocation {
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  locationSharingEnabled: boolean;
}

export const useProfileLocation = () => {
  const { user, api } = useAuth();
  const { toast } = useToast();
  const [profileLocation, setProfileLocation] = useState<ProfileLocation>({
    latitude: null,
    longitude: null,
    locationName: null,
    locationSharingEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile location on mount
  useEffect(() => {
    const fetchProfileLocation = async () => {
      if (!user?.id || !api) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get<{
          latitude?: number | null;
          longitude?: number | null;
          location?: string | null;
          location_sharing_enabled?: boolean | null;
        }>('/profiles/me');

        setProfileLocation({
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          locationName: data.location ?? null,
          locationSharingEnabled: data.location_sharing_enabled || false,
        });
      } catch (err) {
        console.error('Exception fetching profile location:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileLocation();
  }, [user?.id, api]);

  // Update profile location
  const updateProfileLocation = async (
    latitude: number,
    longitude: number,
    locationName: string,
    enableSharing: boolean = true
  ): Promise<boolean> => {
    if (!user?.id || !api) return false;

    setSaving(true);
    try {
      await api.patch('/profiles/me', {
        latitude,
        longitude,
        location: locationName,
        location_sharing_enabled: enableSharing,
        location_updated_at: new Date().toISOString(),
      });

      setProfileLocation({
        latitude,
        longitude,
        locationName,
        locationSharingEnabled: enableSharing,
      });

      toast({
        title: 'Location Saved',
        description: 'Your location has been updated.',
      });

      return true;
    } catch (err) {
      console.error('Exception updating profile location:', err);
      toast({
        title: 'Error',
        description: 'Failed to save location. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Clear profile location
  const clearProfileLocation = async (): Promise<boolean> => {
    if (!user?.id || !api) return false;

    setSaving(true);
    try {
      await api.patch('/profiles/me', {
        latitude: null,
        longitude: null,
        location: null,
        location_sharing_enabled: false,
      });

      setProfileLocation({
        latitude: null,
        longitude: null,
        locationName: null,
        locationSharingEnabled: false,
      });

      toast({
        title: 'Location Cleared',
        description: 'Your saved location has been removed.',
      });

      return true;
    } catch (err) {
      console.error('Exception clearing profile location:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    profileLocation,
    loading,
    saving,
    updateProfileLocation,
    clearProfileLocation,
    hasProfileLocation: profileLocation.latitude !== null && profileLocation.longitude !== null,
  };
};
