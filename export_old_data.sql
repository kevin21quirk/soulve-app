-- Export script for OLD Supabase project (anuvztvypsihzlbkewci)
-- Run this in the OLD project SQL Editor to see what data exists
-- https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/sql/new

-- =====================================================
-- STEP 1: Check what data exists in old project
-- =====================================================

-- Count users
SELECT 'auth.users' as table_name, COUNT(*) as record_count FROM auth.users
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'questionnaire_responses', COUNT(*) FROM public.questionnaire_responses
UNION ALL
SELECT 'posts', COUNT(*) FROM public.posts
UNION ALL
SELECT 'post_interactions', COUNT(*) FROM public.post_interactions
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages
UNION ALL
SELECT 'organizations', COUNT(*) FROM public.organizations
UNION ALL
SELECT 'organization_members', COUNT(*) FROM public.organization_members
ORDER BY record_count DESC;

-- =====================================================
-- STEP 2: Export auth.users data
-- =====================================================

-- List all users with their metadata
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data,
  -- Don't export encrypted_password directly for security
  CASE WHEN encrypted_password IS NOT NULL THEN 'HAS_PASSWORD' ELSE 'NO_PASSWORD' END as password_status
FROM auth.users
ORDER BY created_at;

-- =====================================================
-- STEP 3: Export profiles data
-- =====================================================

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
  waitlist_status,
  waitlist_approved_by,
  approved_at,
  is_founding_member,
  created_at,
  updated_at
FROM public.profiles
ORDER BY created_at;

-- =====================================================
-- STEP 4: Export questionnaire_responses
-- =====================================================

SELECT 
  id,
  user_id,
  user_type,
  motivation,
  response_data,
  created_at,
  updated_at
FROM public.questionnaire_responses
ORDER BY created_at;

-- =====================================================
-- STEP 5: Check for orphaned data
-- =====================================================

-- Users without profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  'User has no profile' as issue
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Profiles without users
SELECT 
  p.id,
  p.email,
  p.created_at,
  'Profile has no user' as issue
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- =====================================================
-- STEP 6: Storage bucket contents
-- =====================================================

-- List all storage buckets
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
ORDER BY name;

-- Count files in each bucket
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_size_bytes,
  ROUND(SUM((metadata->>'size')::bigint) / 1024.0 / 1024.0, 2) as total_size_mb
FROM storage.objects
GROUP BY bucket_id
ORDER BY file_count DESC;
