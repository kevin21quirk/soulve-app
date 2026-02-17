-- Check if the currently logged-in user has admin role
-- User ID from console: b462c8e5-238b-4c38-95ab-17519e5e2cf9

-- Step 1: Check user details and admin role
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.user_type,
    ar.role as admin_role,
    ar.granted_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN admin_roles ar ON u.id = ar.user_id
WHERE u.id = 'b462c8e5-238b-4c38-95ab-17519e5e2cf9';

-- Step 2: Test is_admin function for this user
SELECT is_admin('b462c8e5-238b-4c38-95ab-17519e5e2cf9'::uuid) as is_admin_result;

-- Step 3: If admin_role is NULL, grant admin access
DELETE FROM admin_roles 
WHERE user_id = 'b462c8e5-238b-4c38-95ab-17519e5e2cf9';

INSERT INTO admin_roles (user_id, role, granted_by, granted_at)
VALUES (
    'b462c8e5-238b-4c38-95ab-17519e5e2cf9',
    'admin',
    NULL,  -- Set to NULL to avoid foreign key constraint
    NOW()
);

-- Step 4: Verify the fix
SELECT 
    u.email,
    ar.role as admin_role,
    is_admin(u.id) as is_admin_check
FROM auth.users u
LEFT JOIN admin_roles ar ON u.id = ar.user_id
WHERE u.id = 'b462c8e5-238b-4c38-95ab-17519e5e2cf9';
