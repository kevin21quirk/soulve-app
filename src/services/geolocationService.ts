import { supabase } from '@/integrations/supabase/client';

export interface NearbyUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  location: string | null;
  skills: string[] | null;
  interests: string[] | null;
  distance_km: number;
}

export const findNearbyUsers = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 50,
  limit: number = 20
): Promise<NearbyUser[]> => {
  const { data, error } = await supabase.rpc('find_nearby_users', {
    user_lat: latitude,
    user_lon: longitude,
    radius_km: radiusKm,
    limit_count: limit,
  });

  if (error) {
    console.error('Error finding nearby users:', error);
    return [];
  }

  return data || [];
};

export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
};

export const getUserLocation = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('latitude, longitude, location, location_sharing_enabled')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user location:', error);
    return null;
  }

  return data;
};
