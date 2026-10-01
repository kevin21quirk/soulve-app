-- Import script for NEW Supabase project (btwuqhrkhbblszuipumg)
-- This will import users and profiles from the old project
-- Run this AFTER exporting data from old project

-- =====================================================
-- IMPORTANT: Read this before running
-- =====================================================
-- 1. First run export_old_data.sql in OLD project
-- 2. Save the results (especially auth.users and profiles)
-- 3. Modify this script with the actual data
-- 4. Run this script in NEW project
-- =====================================================

-- =====================================================
-- STEP 1: Create temporary table for old users
-- =====================================================

CREATE TEMP TABLE IF NOT EXISTS old_users_import (
  id UUID,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  raw_user_meta_data JSONB,
  raw_app_meta_data JSONB
);

-- =====================================================
-- STEP 2: Insert old user data here
-- =====================================================
-- Replace this with actual data from old project
-- Example:
-- INSERT INTO old_users_import VALUES
-- ('user-id-1', 'user1@example.com', '2024-01-01', '2024-01-01', '2024-01-01', '{}', '{}'),
-- ('user-id-2', 'user2@example.com', '2024-01-02', '2024-01-02', '2024-01-02', '{}', '{}');

-- =====================================================
-- STEP 3: Create temporary table for old profiles
-- =====================================================

CREATE TEMP TABLE IF NOT EXISTS old_profiles_import (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  skills TEXT[],
  interests TEXT[],
  user_type TEXT,
  waitlist_status TEXT,
  waitlist_approved_by UUID,
  approved_at TIMESTAMPTZ,
  is_founding_member BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- =====================================================
-- STEP 4: Insert old profile data here
-- =====================================================
-- Replace this with actual data from old project

-- =====================================================
-- STEP 5: Import profiles (NOT auth.users)
-- =====================================================
-- We import profiles first, then invite users to reset passwords
-- This is safer than trying to migrate encrypted passwords

INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  email,
  phone,
  location,
  bio,
  avatar_url,
  banner_url,
  skills,
  interests,
  user_type,
  waitlist_status,
  waitlist_approved_by,
  approved_at,
  is_founding_member,
  created_at,
  updated_at
)
SELECT 
  id,
  first_name,
  last_name,
  email,
  phone,
  location,
  bio,
  avatar_url,
  banner_url,
  skills,
  interests,
  user_type,
  COALESCE(waitlist_status, 'pending'),
  waitlist_approved_by,
  approved_at,
  COALESCE(is_founding_member, false),
  created_at,
  updated_at
FROM old_profiles_import
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  banner_url = EXCLUDED.banner_url,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  user_type = EXCLUDED.user_type,
  waitlist_status = EXCLUDED.waitlist_status,
  updated_at = EXCLUDED.updated_at;

-- =====================================================
-- STEP 6: Verify import
-- =====================================================

SELECT 
  'Imported profiles' as status,
  COUNT(*) as count
FROM public.profiles
WHERE id IN (SELECT id FROM old_profiles_import);

-- =====================================================
-- STEP 7: Generate password reset emails for users
-- =====================================================
-- After importing profiles, you need to invite users to create accounts
-- in the new system. You can do this via Supabase Dashboard:
-- 1. Go to Auth > Users
-- 2. Click "Invite user" for each email
-- 3. Or use the Supabase Management API to bulk invite

-- List emails that need to be invited:
SELECT 
  email,
  first_name,
  last_name,
  waitlist_status,
  'Send invite to this user' as action
FROM public.profiles
WHERE email IS NOT NULL
ORDER BY created_at;
