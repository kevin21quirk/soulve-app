-- Manual profile creation for Mark Smith if it doesn't exist
-- Run this AFTER running debug_mark_smith.sql to see if profile exists

-- This will create a profile for Mark Smith if one doesn't exist
-- First, get Mark's user ID from auth.users
DO $$
DECLARE
  mark_user_id UUID;
  mark_email TEXT := 'mark.smith.iom@gmail.com';
BEGIN
  -- Get Mark's ID from auth.users
  SELECT id INTO mark_user_id
  FROM auth.users
  WHERE email = mark_email;

  -- Check if we found the user
  IF mark_user_id IS NULL THEN
    RAISE NOTICE 'User with email % not found in auth.users', mark_email;
  ELSE
    RAISE NOTICE 'Found user ID: %', mark_user_id;
    
    -- Check if profile already exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = mark_user_id) THEN
      RAISE NOTICE 'Profile already exists for user %', mark_user_id;
      
      -- Update the profile to ensure email is set
      UPDATE public.profiles
      SET email = mark_email,
          waitlist_status = COALESCE(waitlist_status, 'pending')
      WHERE id = mark_user_id;
      
      RAISE NOTICE 'Updated profile with email and waitlist_status';
    ELSE
      RAISE NOTICE 'Profile does NOT exist. Creating profile...';
      
      -- Create the profile
      INSERT INTO public.profiles (id, email, waitlist_status, created_at, updated_at)
      VALUES (
        mark_user_id,
        mark_email,
        'pending',
        NOW(),
        NOW()
      );
      
      RAISE NOTICE 'Created profile for user %', mark_user_id;
    END IF;
  END IF;
END $$;

-- Verify the profile was created/updated
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  p.waitlist_status,
  p.created_at,
  u.email as auth_email,
  u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'mark.smith.iom@gmail.com' OR u.email = 'mark.smith.iom@gmail.com';
