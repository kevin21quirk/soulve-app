-- Fix security warnings by setting search_path on functions
DROP FUNCTION IF EXISTS calculate_distance(DECIMAL, DECIMAL, DECIMAL, DECIMAL);
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  r DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;

DROP FUNCTION IF EXISTS find_nearby_users(DECIMAL, DECIMAL, DECIMAL, INTEGER);
CREATE OR REPLACE FUNCTION find_nearby_users(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km DECIMAL DEFAULT 50,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  location TEXT,
  skills TEXT[],
  interests TEXT[],
  latitude DECIMAL,
  longitude DECIMAL,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.location,
    p.skills,
    p.interests,
    p.latitude,
    p.longitude,
    calculate_distance(user_lat, user_lon, p.latitude, p.longitude) as distance_km
  FROM profiles p
  WHERE 
    p.location_sharing_enabled = true
    AND p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND p.id != auth.uid()
    AND calculate_distance(user_lat, user_lon, p.latitude, p.longitude) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;