-- Fix critical security vulnerability: Implement proper RLS policies for profiles table
-- This addresses the issue where personal information could be stolen by hackers

-- First, let's see the current state and then implement secure policies

-- Drop any existing overly permissive policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create secure RLS policies that respect privacy settings
CREATE POLICY "Users can view their own profile"
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can view profiles based on privacy settings"
ON public.profiles 
FOR SELECT 
USING (
  -- Use the security definer function to check if profile can be viewed
  public.can_view_profile(profiles.id, auth.uid())
);

-- Policy for users to update their own profiles
CREATE POLICY "Users can update their own profile"
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Ensure we have proper defaults for privacy settings when profiles are created
-- Update the handle_new_user function to create default privacy settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Insert default privacy settings (public by default, but secure)
  INSERT INTO public.user_privacy_settings (
    user_id,
    profile_visibility,
    allow_direct_messages,
    show_online_status,
    show_location,
    show_email,
    show_phone,
    allow_tagging,
    show_activity_feed
  ) VALUES (
    NEW.id,
    'public',     -- Default to public for better user experience
    'everyone',   -- Allow messages from everyone by default
    true,         -- Show online status
    true,         -- Show location
    false,        -- Hide email by default for privacy
    false,        -- Hide phone by default for privacy
    true,         -- Allow tagging
    true          -- Show activity feed
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();