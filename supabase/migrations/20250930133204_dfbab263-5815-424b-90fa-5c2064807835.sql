-- Fix infinite recursion in campaign_participants RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their campaign participations" ON campaign_participants;
DROP POLICY IF EXISTS "Users can join campaigns" ON campaign_participants;
DROP POLICY IF EXISTS "Users can leave campaigns" ON campaign_participants;
DROP POLICY IF EXISTS "Campaign creators can view participants" ON campaign_participants;

-- Create security definer function to check campaign participation safely
CREATE OR REPLACE FUNCTION public.is_campaign_participant(campaign_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campaign_participants 
    WHERE campaign_id = campaign_uuid 
      AND user_id = user_uuid
  );
$$;

-- Create new RLS policies using the security definer function
CREATE POLICY "Users can view their own participations"
ON campaign_participants
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Campaign creators can view all participants"
ON campaign_participants
FOR SELECT
USING (
  auth.uid() IN (
    SELECT creator_id FROM campaigns WHERE id = campaign_participants.campaign_id
  )
);

CREATE POLICY "Users can join campaigns"
ON campaign_participants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave campaigns"
ON campaign_participants
FOR DELETE
USING (auth.uid() = user_id);