-- Drop existing duplicate DELETE policies on campaigns
DROP POLICY IF EXISTS "Campaign owners can delete their campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Creators can delete their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

-- Create single comprehensive DELETE policy allowing both creators and admins
CREATE POLICY "Campaign owners and admins can delete campaigns"
ON public.campaigns FOR DELETE
USING (
  auth.uid() = creator_id 
  OR is_admin(auth.uid())
);

-- Ensure proper cascading is configured (should already exist, but verify)
-- Verify campaign_participants cascades properly
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'campaign_participants_campaign_id_fkey'
    AND table_name = 'campaign_participants'
  ) THEN
    ALTER TABLE campaign_participants
    ADD CONSTRAINT campaign_participants_campaign_id_fkey
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Verify campaign_donations cascades properly
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'campaign_donations_campaign_id_fkey'
    AND table_name = 'campaign_donations'
  ) THEN
    ALTER TABLE campaign_donations
    ADD CONSTRAINT campaign_donations_campaign_id_fkey
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE;
  END IF;
END $$;