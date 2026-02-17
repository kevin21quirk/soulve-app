-- Verify admin access in PRODUCTION database (btwuqhrkhbblszuipumg)
-- User ID: 324a9a82-122c-4b4f-b178-85bb5fa4330f

-- Step 1: Check if user exists and has admin role
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    ar.role as admin_role,
    ar.granted_at
FROM auth.users u
LEFT JOIN admin_roles ar ON u.id = ar.user_id
WHERE u.id = '324a9a82-122c-4b4f-b178-85bb5fa4330f';

-- Step 2: Test is_admin function
SELECT is_admin('324a9a82-122c-4b4f-b178-85bb5fa4330f'::uuid) as is_admin_result;

-- Step 3: If admin_role is NULL, grant it now
DELETE FROM admin_roles WHERE user_id = '324a9a82-122c-4b4f-b178-85bb5fa4330f';

INSERT INTO admin_roles (user_id, role, granted_at)
VALUES ('324a9a82-122c-4b4f-b178-85bb5fa4330f', 'admin', NOW());

-- Step 4: Final verification
SELECT 
    u.email,
    ar.role,
    is_admin(u.id) as is_admin_check
FROM auth.users u
LEFT JOIN admin_roles ar ON u.id = ar.user_id
WHERE u.id = '324a9a82-122c-4b4f-b178-85bb5fa4330f';
