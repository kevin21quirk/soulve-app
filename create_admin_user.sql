-- SQL Script to verify email and grant admin privileges to kevin.s.quirk@gmail.com
-- Run this in Supabase SQL Editor

-- Step 1: Verify the user's email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'kevin.s.quirk@gmail.com';

-- Step 2: Create or update profile
INSERT INTO profiles (id, email, user_type)
SELECT 
    id,
    email,
    'admin'
FROM auth.users
WHERE email = 'kevin.s.quirk@gmail.com'
ON CONFLICT (id) DO UPDATE
SET user_type = 'admin';

-- Step 3: Insert admin role into admin_roles table (this is what is_admin() checks)
-- First delete any existing admin role for this user
DELETE FROM admin_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'kevin.s.quirk@gmail.com');

-- Then insert the admin role
INSERT INTO admin_roles (user_id, role, granted_by, granted_at)
SELECT 
    id,
    'admin',
    id,  -- Self-granted for initial admin
    NOW()
FROM auth.users
WHERE email = 'kevin.s.quirk@gmail.com';

-- Step 4: Verify the changes
SELECT 
    u.email,
    u.email_confirmed_at,
    p.user_type,
    ar.role as admin_role,
    is_admin(u.id) as is_admin_check
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN admin_roles ar ON u.id = ar.user_id
WHERE u.email = 'kevin.s.quirk@gmail.com';
