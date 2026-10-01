-- Debug script to find Mark Smith's account
-- Run this in Supabase SQL Editor to see what's happening

-- Step 1: Check if Mark Smith exists in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'mark.smith.iom@gmail.com';

-- Step 2: Check if Mark Smith has a profile
SELECT 
  id,
  first_name,
  last_name,
  email,
  waitlist_status,
  created_at,
  user_type
FROM public.profiles
WHERE email = 'mark.smith.iom@gmail.com' OR id IN (
  SELECT id FROM auth.users WHERE email = 'mark.smith.iom@gmail.com'
);

-- Step 3: Count total profiles
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Step 4: Count total auth users
SELECT COUNT(*) as total_auth_users FROM auth.users;

-- Step 5: Find users in auth.users but NOT in profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Step 6: List all profiles (to see what's actually there)
SELECT 
  id,
  first_name,
  last_name,
  email,
  waitlist_status,
  created_at
FROM public.profiles
ORDER BY created_at DESC;
