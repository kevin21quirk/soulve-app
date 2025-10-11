-- ============================================
-- CRITICAL SECURITY FIX: Add RLS policies to validate organization membership
-- This prevents malicious users from impersonating organizations they don't belong to
-- ============================================

-- Drop existing policies that don't validate organization membership
DROP POLICY IF EXISTS "Users can create their own interactions" ON post_interactions;
DROP POLICY IF EXISTS "Authenticated users can create campaign interactions" ON campaign_interactions;

-- ============================================
-- POST INTERACTIONS - Secure organization validation
-- ============================================

-- Allow users to create interactions in their own name
CREATE POLICY "Users can create personal interactions"
ON post_interactions FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) AND
  (organization_id IS NULL)
);

-- Allow users to create interactions on behalf of organizations they belong to
CREATE POLICY "Users can create org interactions if member"
ON post_interactions FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) AND
  (
    organization_id IS NULL OR
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = post_interactions.organization_id
      AND user_id = auth.uid()
      AND is_active = true
    )
  )
);

-- ============================================
-- CAMPAIGN INTERACTIONS - Secure organization validation
-- ============================================

-- Allow users to create interactions in their own name
CREATE POLICY "Users can create personal campaign interactions"
ON campaign_interactions FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) AND
  (organization_id IS NULL)
);

-- Allow users to create interactions on behalf of organizations they belong to
CREATE POLICY "Users can create org campaign interactions if member"
ON campaign_interactions FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) AND
  (
    organization_id IS NULL OR
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = campaign_interactions.organization_id
      AND user_id = auth.uid()
      AND is_active = true
    )
  )
);

-- ============================================
-- Add indexes for performance on organization membership checks
-- ============================================

CREATE INDEX IF NOT EXISTS idx_org_members_org_user 
ON organization_members(organization_id, user_id, is_active);

-- ============================================
-- Add comment to document security enhancement
-- ============================================

COMMENT ON POLICY "Users can create org interactions if member" ON post_interactions IS 
'Validates that users can only create interactions on behalf of organizations they are active members of. Prevents organization impersonation attacks.';

COMMENT ON POLICY "Users can create org campaign interactions if member" ON campaign_interactions IS 
'Validates that users can only create campaign interactions on behalf of organizations they are active members of. Prevents organization impersonation attacks.';