-- Check Mark Smith's onboarding and waitlist status
-- Run this to see why he's stuck on "Redirecting to dashboard..."

-- Step 1: Check Mark's profile and waitlist status
SELECT 
  id,
  first_name,
  last_name,
  email,
  waitlist_status,
  user_type,
  created_at
FROM public.profiles
WHERE email = 'mark.smith.iom@gmail.com';

-- Step 2: Check if Mark has completed the questionnaire (onboarding)
SELECT 
  user_id,
  user_type,
  motivation,
  created_at,
  response_data
FROM public.questionnaire_responses
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'mark.smith.iom@gmail.com'
);

-- Step 3: Check if Mark is an admin
SELECT public.is_admin(
  (SELECT id FROM public.profiles WHERE email = 'mark.smith.iom@gmail.com')
) as is_admin;
