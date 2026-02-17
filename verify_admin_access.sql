-- SQL Script to verify admin access for kevin.s.quirk@gmail.com
-- Run this in Supabase SQL Editor

-- Step 1: Check user profile and admin status
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.user_type,
    p.first_name,
    p.last_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'kevin.s.quirk@gmail.com';

-- Step 2: Test the is_admin RPC function
SELECT is_admin(
    (SELECT id FROM auth.users WHERE email = 'kevin.s.quirk@gmail.com')
) as admin_check;

-- Step 3: If user_type is not 'admin', update it
UPDATE profiles 
SET user_type = 'admin'
WHERE email = 'kevin.s.quirk@gmail.com';

-- Step 4: Verify the update
SELECT 
    u.email,
    p.user_type,
    is_admin(u.id) as is_admin_result
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'kevin.s.quirk@gmail.com';
