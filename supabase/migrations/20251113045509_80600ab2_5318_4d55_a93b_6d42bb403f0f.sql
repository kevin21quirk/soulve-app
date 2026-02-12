-- Remove overly permissive RLS policies on campaign_interactions table
-- These policies allow all authenticated/public users to view all interactions,
-- overriding the more restrictive policy that properly limits access

DROP POLICY IF EXISTS "Anyone can view campaign interactions" ON public.campaign_interactions;
DROP POLICY IF EXISTS "Users can view campaign interactions" ON public.campaign_interactions;

-- The correct restrictive policy "campaign_interactions_select" remains in place
-- It only allows users to see:
-- 1. Their own interactions
-- 2. Interactions on campaigns they created
-- 3. Interactions on campaigns they participate in