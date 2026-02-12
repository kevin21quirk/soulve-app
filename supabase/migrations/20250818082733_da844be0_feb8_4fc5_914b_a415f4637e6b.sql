-- Fix critical security vulnerability in profiles table RLS policies
-- Drop the vulnerable policy that allows anonymous access
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_own_access" ON public.profiles;

-- Create security definer function to check if a user can view a profile
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid, viewer_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    profile_visibility text;
    are_connected boolean := false;
BEGIN
    -- Profile owner can always view their own profile
    IF profile_user_id = viewer_id THEN
        RETURN true;
    END IF;
    
    -- Admins can view all profiles
    IF public.is_admin(viewer_id) THEN
        RETURN true;
    END IF;
    
    -- Anonymous users cannot view any profiles
    IF viewer_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Get privacy settings for the profile
    SELECT COALESCE(ups.profile_visibility, 'public') INTO profile_visibility
    FROM public.user_privacy_settings ups
    WHERE ups.user_id = profile_user_id;
    
    -- If no privacy settings exist, default to public
    IF profile_visibility IS NULL THEN
        profile_visibility := 'public';
    END IF;
    
    -- Handle private profiles
    IF profile_visibility = 'private' THEN
        RETURN false;
    END IF;
    
    -- Handle friends-only profiles - check if users are connected
    IF profile_visibility = 'friends' THEN
        SELECT EXISTS (
            SELECT 1 FROM public.connections
            WHERE ((requester_id = viewer_id AND addressee_id = profile_user_id) 
                   OR (requester_id = profile_user_id AND addressee_id = viewer_id))
            AND status = 'accepted'
        ) INTO are_connected;
        
        RETURN are_connected;
    END IF;
    
    -- Public profiles are viewable by authenticated users
    RETURN profile_visibility = 'public';
END;
$$;

-- Create function to filter profile data based on privacy settings
CREATE OR REPLACE FUNCTION public.get_filtered_profile_data(profile_user_id uuid, viewer_id uuid)
RETURNS TABLE(
    id uuid,
    first_name text,
    last_name text,
    location text,
    bio text,
    avatar_url text,
    banner_url text,
    banner_type text,
    skills text[],
    interests text[],
    website text,
    facebook text,
    twitter text,
    instagram text,
    linkedin text,
    phone text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    show_email boolean := false;
    show_phone boolean := false;
    show_location boolean := true;
    profile_record record;
BEGIN
    -- Check if viewer can see this profile at all
    IF NOT public.can_view_profile(profile_user_id, viewer_id) THEN
        RETURN;
    END IF;
    
    -- Get privacy settings
    SELECT ups.show_email, ups.show_phone, ups.show_location
    INTO show_email, show_phone, show_location
    FROM public.user_privacy_settings ups
    WHERE ups.user_id = profile_user_id;
    
    -- Get profile data
    SELECT p.* INTO profile_record
    FROM public.profiles p
    WHERE p.id = profile_user_id;
    
    -- Return filtered data
    RETURN QUERY SELECT
        profile_record.id,
        profile_record.first_name,
        profile_record.last_name,
        CASE WHEN show_location THEN profile_record.location ELSE NULL END,
        profile_record.bio,
        profile_record.avatar_url,
        profile_record.banner_url,
        profile_record.banner_type,
        profile_record.skills,
        profile_record.interests,
        profile_record.website,
        profile_record.facebook,
        profile_record.twitter,
        profile_record.instagram,
        profile_record.linkedin,
        CASE WHEN show_phone THEN profile_record.phone ELSE NULL END,
        profile_record.created_at,
        profile_record.updated_at;
END;
$$;

-- Create new secure RLS policies
CREATE POLICY "Users can view profiles based on privacy settings" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.can_view_profile(id, auth.uid()));

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create a view for easier querying of public profiles
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    CASE WHEN COALESCE(ups.show_location, true) THEN p.location ELSE NULL END as location,
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