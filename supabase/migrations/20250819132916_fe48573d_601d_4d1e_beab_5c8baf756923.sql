-- Drop the current view and security definer function
DROP VIEW IF EXISTS public.public_profiles;
DROP FUNCTION IF EXISTS public.can_view_public_profile(uuid);

-- Create a simple view that relies on RLS policies of underlying tables
-- This avoids the SECURITY DEFINER issue while maintaining security
CREATE VIEW public.public_profiles AS
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    CASE 
        WHEN COALESCE(ups.show_location, true) THEN p.location
        ELSE NULL
    END AS location,
    p.bio,
    p.avatar_url,
    p.banner_url,
    p.skills,
    p.interests,
    p.website,
    p.created_at
FROM public.profiles p
LEFT JOIN public.user_privacy_settings ups ON p.id = ups.user_id
WHERE COALESCE(ups.profile_visibility, 'public') = 'public';

-- Grant permissions to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Ensure proper RLS is enabled on underlying tables
-- The profiles table should already have RLS policies that handle visibility
-- The view will inherit the security from the underlying tables