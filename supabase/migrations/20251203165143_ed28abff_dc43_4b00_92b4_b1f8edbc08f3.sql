-- Fix search_path security for find_nearby_posts function
CREATE OR REPLACE FUNCTION find_nearby_posts(
  user_lat NUMERIC,
  user_lon NUMERIC,
  radius_km NUMERIC DEFAULT 50,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  author_id UUID,
  organization_id UUID,
  category TEXT,
  urgency TEXT,
  location TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  tags TEXT[],
  media_urls TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  visibility TEXT,
  is_active BOOLEAN,
  import_source TEXT,
  external_id TEXT,
  import_metadata JSONB,
  imported_at TIMESTAMPTZ,
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.author_id,
    p.organization_id,
    p.category,
    p.urgency,
    p.location,
    p.latitude,
    p.longitude,
    p.tags,
    p.media_urls,
    p.created_at,
    p.updated_at,
    p.visibility,
    p.is_active,
    p.import_source,
    p.external_id,
    p.import_metadata,
    p.imported_at,
    (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians(user_lon)) +
        sin(radians(user_lat)) * sin(radians(p.latitude))
      )
    )::NUMERIC AS distance_km
  FROM public.posts p
  WHERE p.is_active = true
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND p.visibility = 'public'
    AND (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians(user_lon)) +
        sin(radians(user_lat)) * sin(radians(p.latitude))
      )
    ) <= radius_km
  ORDER BY distance_km ASC, p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;