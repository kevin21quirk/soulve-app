-- Grant admin access to kevin.s.quirk@gmail.com
-- Correct User ID: 324a9a82-122c-4b4f-b178-85bb5fa4330f

-- Step 1: Remove any existing admin role
DELETE FROM admin_roles 
WHERE user_id = '324a9a82-122c-4b4f-b178-85bb5fa4330f';

-- Step 2: Grant admin role
INSERT INTO admin_roles (user_id, role, granted_at)
VALUES ('324a9a82-122c-4b4f-b178-85bb5fa4330f', 'admin', NOW());

-- Step 3: Verify admin access
SELECT 
    u.email,
    ar.role as admin_role,
    is_admin(u.id) as is_admin_check
FROM auth.users u
LEFT JOIN admin_roles ar ON u.id = ar.user_id
WHERE u.id = '324a9a82-122c-4b4f-b178-85bb5fa4330f';
