import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

export const useGeolocation = () => {
  const { toast } = useToast();
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
    permissionGranted: false,
  });

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by your browser' 
      }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setState({
            latitude,
            longitude,
            accuracy,
            loading: false,
            error: null,
            permissionGranted: true,
          });
          resolve(true);
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: errorMessage,
            permissionGranted: false,
          }));
          
          toast({
            title: 'Location Error',
            description: errorMessage,
            variant: 'destructive',
          });
          
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    });
  };

  const updateUserLocation = async (enableSharing: boolean = true) => {
    if (!state.latitude || !state.longitude) {
      await requestLocation();
    }

    if (state.latitude && state.longitude) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            latitude: state.latitude,
            longitude: state.longitude,
            location_updated_at: new Date().toISOString(),
            location_sharing_enabled: enableSharing,
          })
          .eq('id', user.id);

        if (error) {
          toast({
            title: 'Update Failed',
            description: 'Failed to update your location in the system',
            variant: 'destructive',
          });
          return false;
        }

        toast({
          title: 'Location Updated',
          description: 'Your location has been updated successfully',
        });
        return true;
      }
    }
    
    return false;
  };

  const disableLocationSharing = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          location_sharing_enabled: false,
        })
        .eq('id', user.id);

      if (!error) {
        setState(prev => ({ ...prev, permissionGranted: false }));
        toast({
          title: 'Location Sharing Disabled',
          description: 'Your location will no longer be shared with other users',
        });
        return true;
      }
    }
    
    return false;
  };

  return {
    ...state,
    requestLocation,
    updateUserLocation,
    disableLocationSharing,
  };
};
