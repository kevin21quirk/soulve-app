import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProfileLocation {
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  locationSharingEnabled: boolean;
}

export const useProfileLocation = () => {
  const { user } = useAuth();
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
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('latitude, longitude, location, location_sharing_enabled')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile location:', error);
        } else if (data) {
          setProfileLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            locationName: data.location,
            locationSharingEnabled: data.location_sharing_enabled || false,
          });
        }
      } catch (err) {
        console.error('Exception fetching profile location:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileLocation();
  }, [user?.id]);

  // Update profile location
  const updateProfileLocation = async (
    latitude: number,
    longitude: number,
    locationName: string,
    enableSharing: boolean = true
  ): Promise<boolean> => {
    if (!user?.id) return false;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          latitude,
          longitude,
          location: locationName,
          location_sharing_enabled: enableSharing,
          location_updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile location:', error);
        toast({
          title: 'Error',
          description: 'Failed to save location. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

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
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Clear profile location
  const clearProfileLocation = async (): Promise<boolean> => {
    if (!user?.id) return false;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: null,
          longitude: null,
          location: null,
          location_sharing_enabled: false,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error clearing profile location:', error);
        return false;
      }

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
