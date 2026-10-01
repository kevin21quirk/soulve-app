-- Fix missing profiles for all auth.users who don't have a profile yet
-- This will create profiles for Mark Smith and any other users missing profiles

-- Create profiles for all auth.users that don't have a corresponding profile
INSERT INTO public.profiles (id, email, waitlist_status, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  'pending' as waitlist_status,
  u.created_at,
  NOW() as updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Verify all users now have profiles
SELECT 
  u.email as auth_email,
  u.created_at as user_created,
  p.id as profile_id,
  p.email as profile_email,
  p.first_name,
  p.last_name,
  p.waitlist_status,
  CASE 
    WHEN p.id IS NULL THEN 'MISSING PROFILE'
    ELSE 'HAS PROFILE'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
