-- Fix potential conflict with reaction policies
-- The aggregated policy might interfere with the secure access policy

-- Drop the aggregated policy that could cause conflicts
DROP POLICY IF EXISTS "Public can view aggregated reaction data for posts" ON public.post_reactions;

-- The secure policy "Users can view relevant post reactions" is sufficient and secure
-- It allows:
-- 1. Users to see their own reactions
-- 2. Post authors to see reactions on their posts
-- 3. No unauthorized access to other users' behavioral data

-- For displaying reaction counts on posts, the application should use 
-- the existing function get_post_reaction_counts() which properly aggregates
-- the data without exposing individual user information