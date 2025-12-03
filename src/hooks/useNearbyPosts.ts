import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export interface NearbyPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  organization_id: string | null;
  category: string;
  urgency: string;
  location: string | null;
  latitude: number;
  longitude: number;
  tags: string[];
  media_urls: string[];
  created_at: string;
  updated_at: string;
  visibility: string;
  is_active: boolean;
  import_source: string | null;
  external_id: string | null;
  import_metadata: any;
  imported_at: string | null;
  distance_km: number;
}

export const RADIUS_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
];

export const useUserLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          setLoading(false);
          resolve(coords);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  return { location, loading, error, requestLocation, setLocation };
};

export const useNearbyPosts = (
  latitude: number | null,
  longitude: number | null,
  radiusKm: number = 50,
  limit: number = 20,
  offset: number = 0
) => {
  return useQuery({
    queryKey: ['nearby-posts', latitude, longitude, radiusKm, limit, offset],
    queryFn: async (): Promise<NearbyPost[]> => {
      if (latitude === null || longitude === null) {
        return [];
      }

      const { data, error } = await supabase.rpc('find_nearby_posts', {
        user_lat: latitude,
        user_lon: longitude,
        radius_km: radiusKm,
        limit_count: limit,
        offset_count: offset,
      });

      if (error) {
        console.error('Error fetching nearby posts:', error);
        throw error;
      }

      return (data || []) as NearbyPost[];
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  } else {
    return `${Math.round(distanceKm)} km`;
  }
};
