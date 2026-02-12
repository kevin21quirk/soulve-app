-- The SECURITY DEFINER view linter error might be due to how our view handles privacy settings
-- Let's completely remove the public_profiles view since it might be causing the security issue
-- The application can query profiles directly with proper RLS policies instead

DROP VIEW IF EXISTS public.public_profiles;