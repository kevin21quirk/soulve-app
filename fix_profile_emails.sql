-- Fix missing email data in profiles table
-- This ensures all profiles have their email synced from auth.users

-- Step 1: Add email column if it doesn't exist (safe to run multiple times)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 2: Sync emails from auth.users to profiles for all users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- Step 3: Verify the sync worked
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email as profile_email,
  u.email as auth_email,
  p.waitlist_status,
  p.created_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 20;
