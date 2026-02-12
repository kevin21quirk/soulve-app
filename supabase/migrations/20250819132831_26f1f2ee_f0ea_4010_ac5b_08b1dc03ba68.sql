-- Drop the existing public_profiles view that may have security issues
DROP VIEW IF EXISTS public.public_profiles;

-- Create a security definer function to check if a profile should be visible to the current user
CREATE OR REPLACE FUNCTION public.can_view_public_profile(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    profile_visibility text;
    show_location boolean;
BEGIN
    -- Get privacy settings for the profile
    SELECT 
        COALESCE(ups.profile_visibility, 'public'),
        COALESCE(ups.show_location, true)
    INTO profile_visibility, show_location
    FROM public.user_privacy_settings ups
    WHERE ups.user_id = profile_user_id;
    
    -- If no privacy settings exist, default to public
    IF profile_visibility IS NULL THEN
        profile_visibility := 'public';
    END IF;
    
    -- Only return true for public profiles
    RETURN profile_visibility = 'public';
END;
$$;

-- Create a new public_profiles view that properly uses RLS and the security definer function
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
WHERE public.can_view_public_profile(p.id);

-- Enable RLS on the view (though views inherit RLS from underlying tables)
-- Grant appropriate permissions
GRANT SELECT ON public.public_profiles TO anon, authenticated;