
-- Phase 1: Fix Critical Database Errors

-- 1. Fix the infinite recursion in campaign_participants RLS policy
DROP POLICY IF EXISTS "Campaign participants visible to campaign creator and participa" ON public.campaign_participants;

-- Create a proper RLS policy without infinite recursion
CREATE POLICY "cp_select_safe" ON public.campaign_participants
FOR SELECT USING (
  auth.uid() = user_id OR 
  is_campaign_creator(campaign_id, auth.uid()) OR 
  is_user_admin(auth.uid())
);

-- 2. Remove duplicate RLS policies on campaign_participants
DROP POLICY IF EXISTS "Users can join campaigns" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_insert_own" ON public.campaign_participants;

-- Keep only one INSERT policy
CREATE POLICY "cp_insert_participants" ON public.campaign_participants
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Remove duplicate profile policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Keep the comprehensive policy
-- (profiles_own_access already handles all operations)

-- 4. Remove redundant user_preferences policies
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;

-- Keep only the comprehensive policy
-- (Users can manage their own preferences already exists)

-- 5. Add missing performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_author_category ON posts(author_id, category) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_interactions_user_type ON post_interactions(user_id, interaction_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation ON messages(sender_id, recipient_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_connections_status_users ON connections(status, requester_id, addressee_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_recipient_unread ON notifications(recipient_id, is_read, created_at DESC);

-- 6. Remove unused functions that are causing warnings
DROP FUNCTION IF EXISTS public.calculate_user_similarity(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.generate_user_recommendations(uuid) CASCADE;

-- Replace with the enhanced versions that are actually being used
-- (The enhanced versions with _with_orgs suffix are the ones being used)

-- 7. Clean up unused tables from development iterations
DROP TABLE IF EXISTS campaign_social_metrics CASCADE;
DROP TABLE IF EXISTS campaign_engagement CASCADE;
DROP TABLE IF EXISTS campaign_analytics CASCADE;

-- These were created during development but aren't used in the current implementation

-- 8. Optimize the most expensive RLS policies
-- Update posts policy to be more efficient
DROP POLICY IF EXISTS "posts_public_view" ON public.posts;
CREATE POLICY "posts_efficient_view" ON public.posts
FOR SELECT USING (
  visibility = 'public' OR 
  auth.uid() = author_id OR
  (visibility = 'connections' AND EXISTS (
    SELECT 1 FROM connections 
    WHERE ((requester_id = auth.uid() AND addressee_id = author_id) OR 
           (addressee_id = auth.uid() AND requester_id = author_id)) 
    AND status = 'accepted'
  ))
);

-- 9. Update table statistics for better query planning
ANALYZE posts;
ANALYZE post_interactions;
ANALYZE messages;
ANALYZE connections;
ANALYZE profiles;
ANALYZE campaign_participants;
ANALYZE notifications;
