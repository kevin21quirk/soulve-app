
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface NearbyHelpRequest {
  id: string;
  title: string;
  content: string;
  urgency: string;
  location: string;
  distance: number;
  author_name: string;
  created_at: string;
}

export const useLocationTracking = () => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [nearbyRequests, setNearbyRequests] = useState<NearbyHelpRequest[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          resolve(locationData);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // 1 minute
        }
      );
    });
  }, []);

  const startLocationTracking = useCallback(async () => {
    if (!user) return;

    try {
      setLocationError(null);
      setIsTracking(true);
      
      const location = await getCurrentLocation();
      setCurrentLocation(location);

      // Store location in localStorage since we don't have location fields in profiles table
      localStorage.setItem('userLocation', JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        updated_at: new Date().toISOString()
      }));

    } catch (error: any) {
      console.error('Location error:', error);
      setLocationError(error.message);
    } finally {
      setIsTracking(false);
    }
  }, [user, getCurrentLocation]);

  const findNearbyHelpRequests = useCallback(async (radiusKm: number = 10) => {
    if (!currentLocation || !user) return;

    try {
      // Fetch posts with author profile information
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          urgency,
          location,
          created_at,
          author_id,
          profiles!posts_author_id_fkey(first_name, last_name)
        `)
        .eq('is_active', true)
        .eq('category', 'help_needed')
        .neq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform and add mock distance calculation
      const requests: NearbyHelpRequest[] = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        urgency: post.urgency,
        location: post.location || 'Location not specified',
        distance: Math.random() * radiusKm, // Mock distance
        author_name: post.profiles ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() : 'Anonymous',
        created_at: post.created_at
      }));

      // Sort by distance and filter within radius
      const nearbyFiltered = requests
        .filter(req => req.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      setNearbyRequests(nearbyFiltered);
    } catch (error) {
      console.error('Error finding nearby requests:', error);
    }
  }, [currentLocation, user]);

  const stopLocationTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  useEffect(() => {
    if (currentLocation) {
      findNearbyHelpRequests();
    }
  }, [currentLocation, findNearbyHelpRequests]);

  return {
    currentLocation,
    nearbyRequests,
    locationError,
    isTracking,
    startLocationTracking,
    stopLocationTracking,
    refreshNearbyRequests: () => findNearbyHelpRequests()
  };
};
