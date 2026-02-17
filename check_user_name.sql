-- Check if user has first_name and last_name set
SELECT 
    id,
    email,
    first_name,
    last_name,
    user_type
FROM profiles
WHERE id = '324a9a82-122c-4b4f-b178-85bb5fa4330f';

-- If first_name and last_name are NULL, you can set them:
-- UPDATE profiles
-- SET first_name = 'Kevin',
--     last_name = 'Quirk'
-- WHERE id = '324a9a82-122c-4b4f-b178-85bb5fa4330f';
