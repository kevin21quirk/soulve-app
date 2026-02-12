-- Enable RLS on campaign_interactions (if not already enabled)
ALTER TABLE campaign_interactions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view all campaign interactions
CREATE POLICY "Anyone can view campaign interactions"
ON campaign_interactions
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to create their own interactions
CREATE POLICY "Users can create campaign interactions"
ON campaign_interactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to update their own interactions
CREATE POLICY "Users can update own campaign interactions"
ON campaign_interactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own interactions
CREATE POLICY "Users can delete own campaign interactions"
ON campaign_interactions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);