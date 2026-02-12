-- Add geolocation fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS location_sharing_enabled BOOLEAN DEFAULT false;

-- Add index for geolocation queries
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location_sharing_enabled = true;

-- Add comments
COMMENT ON COLUMN profiles.latitude IS 'User latitude coordinate for geolocation features';
COMMENT ON COLUMN profiles.longitude IS 'User longitude coordinate for geolocation features';
COMMENT ON COLUMN profiles.location_updated_at IS 'Last time user location was updated';
COMMENT ON COLUMN profiles.location_sharing_enabled IS 'Whether user has enabled location sharing';

-- Create function to calculate distance between two points (Haversine formula)
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to find nearby users
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
$$ LANGUAGE plpgsql SECURITY DEFINER;