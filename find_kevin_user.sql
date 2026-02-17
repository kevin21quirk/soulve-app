-- Find the correct user ID for kevin.s.quirk@gmail.com
-- The console shows b462c8e5-238b-4c38-95ab-17519e5e2cf9 but this doesn't exist in auth.users

-- Step 1: Find all users with kevin email
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email ILIKE '%kevin%quirk%';

-- Step 2: If found, grant admin access to the correct user ID
-- Replace USER_ID_HERE with the actual ID from Step 1 result

-- DELETE FROM admin_roles WHERE user_id = 'USER_ID_HERE';
-- INSERT INTO admin_roles (user_id, role, granted_at)
-- VALUES ('USER_ID_HERE', 'admin', NOW());

-- Step 3: Verify
-- SELECT 
--     u.email,
--     ar.role,
--     is_admin(u.id) as is_admin_check
-- FROM auth.users u
-- LEFT JOIN admin_roles ar ON u.id = ar.user_id
-- WHERE u.email = 'kevin.s.quirk@gmail.com';
