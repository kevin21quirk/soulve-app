-- Create security definer functions to prevent infinite recursion in RLS policies

-- Function to check if user is a campaign creator
CREATE OR REPLACE FUNCTION public.is_campaign_creator(campaign_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = campaign_uuid
      AND creator_id = user_uuid
  );
$$;

-- Function to check if user is a campaign participant
CREATE OR REPLACE FUNCTION public.is_campaign_participant(campaign_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_participants
    WHERE campaign_id = campaign_uuid
      AND user_id = user_uuid
  );
$$;

-- Function to check if user is an organization member
CREATE OR REPLACE FUNCTION public.is_org_member(org_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = org_uuid
      AND user_id = user_uuid
      AND is_active = true
  );
$$;

-- Function to check if user is an organization admin
CREATE OR REPLACE FUNCTION public.is_org_admin(org_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = org_uuid
      AND user_id = user_uuid
      AND role IN ('admin', 'owner', 'manager')
      AND is_active = true
  );
$$;

-- Function to check if user is an admin (general system admin)
CREATE OR REPLACE FUNCTION public.is_user_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = user_uuid
  );
$$;

-- Function to check if user is a conversation participant
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conversation_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE conversation_id = conversation_uuid
      AND user_id = user_uuid
  );
$$;

-- Function to check if user is a group member (without status column)
CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = group_uuid
      AND user_id = user_uuid
  );
$$;

-- Now drop and recreate the problematic RLS policies on campaigns table
DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_insert" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_update" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_delete" ON public.campaigns;

CREATE POLICY "campaigns_select" ON public.campaigns
FOR SELECT
USING (
  creator_id = auth.uid()
  OR is_campaign_participant(id, auth.uid())
);

CREATE POLICY "campaigns_insert" ON public.campaigns
FOR INSERT
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "campaigns_update" ON public.campaigns
FOR UPDATE
USING (
  creator_id = auth.uid()
  OR (is_campaign_participant(id, auth.uid()) AND EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaigns.id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  ))
)
WITH CHECK (
  creator_id = auth.uid()
  OR (is_campaign_participant(id, auth.uid()) AND EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaigns.id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  ))
);

CREATE POLICY "campaigns_delete" ON public.campaigns
FOR DELETE
USING (creator_id = auth.uid());

-- Fix campaign_participants policies
DROP POLICY IF EXISTS "campaign_participants_select" ON public.campaign_participants;
DROP POLICY IF EXISTS "campaign_participants_insert" ON public.campaign_participants;
DROP POLICY IF EXISTS "campaign_participants_update" ON public.campaign_participants;
DROP POLICY IF EXISTS "campaign_participants_delete" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_select_access" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_insert_own" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_update_own" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_update_creator" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_delete_creator_admin" ON public.campaign_participants;

CREATE POLICY "cp_select_access" ON public.campaign_participants
FOR SELECT
USING (
  auth.uid() = user_id
  OR is_campaign_creator(campaign_id, auth.uid())
  OR is_user_admin(auth.uid())
);

CREATE POLICY "cp_insert_own" ON public.campaign_participants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cp_update_own" ON public.campaign_participants
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cp_update_creator" ON public.campaign_participants
FOR UPDATE
USING (is_campaign_creator(campaign_id, auth.uid()) OR is_user_admin(auth.uid()))
WITH CHECK (is_campaign_creator(campaign_id, auth.uid()) OR is_user_admin(auth.uid()));

CREATE POLICY "cp_delete_creator_admin" ON public.campaign_participants
FOR DELETE
USING (is_campaign_creator(campaign_id, auth.uid()) OR is_user_admin(auth.uid()));

-- Fix campaign_donations policies
DROP POLICY IF EXISTS "campaign_donations_select" ON public.campaign_donations;
DROP POLICY IF EXISTS "campaign_donations_insert" ON public.campaign_donations;
DROP POLICY IF EXISTS "campaign_donations_update" ON public.campaign_donations;
DROP POLICY IF EXISTS "campaign_donations_delete" ON public.campaign_donations;

CREATE POLICY "campaign_donations_select" ON public.campaign_donations
FOR SELECT
USING (
  donor_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_donations.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
);

CREATE POLICY "campaign_donations_insert" ON public.campaign_donations
FOR INSERT
WITH CHECK (donor_id = auth.uid());

CREATE POLICY "campaign_donations_update" ON public.campaign_donations
FOR UPDATE
USING (
  donor_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_donations.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
)
WITH CHECK (
  donor_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_donations.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
);

CREATE POLICY "campaign_donations_delete" ON public.campaign_donations
FOR DELETE
USING (
  donor_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_donations.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
);

-- Fix campaign_interactions policies
DROP POLICY IF EXISTS "campaign_interactions_select" ON public.campaign_interactions;
DROP POLICY IF EXISTS "campaign_interactions_insert" ON public.campaign_interactions;
DROP POLICY IF EXISTS "campaign_interactions_update" ON public.campaign_interactions;
DROP POLICY IF EXISTS "campaign_interactions_delete" ON public.campaign_interactions;

CREATE POLICY "campaign_interactions_select" ON public.campaign_interactions
FOR SELECT
USING (
  user_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
  OR is_campaign_participant(campaign_id, auth.uid())
);

CREATE POLICY "campaign_interactions_insert" ON public.campaign_interactions
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "campaign_interactions_update" ON public.campaign_interactions
FOR UPDATE
USING (
  user_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
)
WITH CHECK (
  user_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
);

CREATE POLICY "campaign_interactions_delete" ON public.campaign_interactions
FOR DELETE
USING (
  user_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
);

-- Fix campaign_invitations policies
DROP POLICY IF EXISTS "campaign_invitations_select" ON public.campaign_invitations;
DROP POLICY IF EXISTS "campaign_invitations_insert" ON public.campaign_invitations;
DROP POLICY IF EXISTS "campaign_invitations_update" ON public.campaign_invitations;
DROP POLICY IF EXISTS "campaign_invitations_delete" ON public.campaign_invitations;

CREATE POLICY "campaign_invitations_select" ON public.campaign_invitations
FOR SELECT
USING (
  inviter_id = auth.uid()
  OR invitee_id = auth.uid()
  OR LOWER(invitee_email) = LOWER(auth.jwt()->>'email')
  OR is_campaign_creator(campaign_id, auth.uid())
);

CREATE POLICY "campaign_invitations_insert" ON public.campaign_invitations
FOR INSERT
WITH CHECK (
  inviter_id = auth.uid()
  AND (
    is_campaign_creator(campaign_id, auth.uid())
    OR EXISTS (
      SELECT 1 FROM campaign_participants cp
      WHERE cp.campaign_id = campaign_invitations.campaign_id
        AND cp.user_id = auth.uid()
        AND cp.role IN ('admin', 'moderator')
    )
  )
);

CREATE POLICY "campaign_invitations_update" ON public.campaign_invitations
FOR UPDATE
USING (
  inviter_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
)
WITH CHECK (
  inviter_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
);

CREATE POLICY "campaign_invitations_delete" ON public.campaign_invitations
FOR DELETE
USING (
  inviter_id = auth.uid()
  OR invitee_id = auth.uid()
  OR LOWER(invitee_email) = LOWER(auth.jwt()->>'email')
  OR is_campaign_creator(campaign_id, auth.uid())
);

-- Fix campaign_updates policies
DROP POLICY IF EXISTS "campaign_updates_select" ON public.campaign_updates;
DROP POLICY IF EXISTS "campaign_updates_insert" ON public.campaign_updates;
DROP POLICY IF EXISTS "campaign_updates_update" ON public.campaign_updates;
DROP POLICY IF EXISTS "campaign_updates_delete" ON public.campaign_updates;

CREATE POLICY "campaign_updates_select" ON public.campaign_updates
FOR SELECT
USING (
  author_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
  OR is_campaign_participant(campaign_id, auth.uid())
);

CREATE POLICY "campaign_updates_insert" ON public.campaign_updates
FOR INSERT
WITH CHECK (
  author_id = auth.uid()
  AND (
    is_campaign_creator(campaign_id, auth.uid())
    OR is_campaign_participant(campaign_id, auth.uid())
  )
);

CREATE POLICY "campaign_updates_update" ON public.campaign_updates
FOR UPDATE
USING (
  author_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
)
WITH CHECK (
  author_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
);

CREATE POLICY "campaign_updates_delete" ON public.campaign_updates
FOR DELETE
USING (
  author_id = auth.uid()
  OR is_campaign_creator(campaign_id, auth.uid())
);

-- Fix campaign_promotions policies
DROP POLICY IF EXISTS "campaign_promotions_select" ON public.campaign_promotions;
DROP POLICY IF EXISTS "campaign_promotions_insert" ON public.campaign_promotions;
DROP POLICY IF EXISTS "campaign_promotions_update" ON public.campaign_promotions;
DROP POLICY IF EXISTS "campaign_promotions_delete" ON public.campaign_promotions;

CREATE POLICY "campaign_promotions_select" ON public.campaign_promotions
FOR SELECT
USING (
  is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_promotions.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
);

CREATE POLICY "campaign_promotions_insert" ON public.campaign_promotions
FOR INSERT
WITH CHECK (
  is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_promotions.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
);

CREATE POLICY "campaign_promotions_update" ON public.campaign_promotions
FOR UPDATE
USING (
  is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_promotions.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
)
WITH CHECK (
  is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_promotions.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
);

CREATE POLICY "campaign_promotions_delete" ON public.campaign_promotions
FOR DELETE
USING (
  is_campaign_creator(campaign_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM campaign_participants cp
    WHERE cp.campaign_id = campaign_promotions.campaign_id
      AND cp.user_id = auth.uid()
      AND cp.role IN ('admin', 'moderator')
  )
);

-- Fix campaign_analytics policies
DROP POLICY IF EXISTS "campaign_analytics_select" ON public.campaign_analytics;

CREATE POLICY "campaign_analytics_select" ON public.campaign_analytics
FOR SELECT
USING (
  is_campaign_creator(campaign_id, auth.uid())
  OR is_campaign_participant(campaign_id, auth.uid())
);

-- Fix campaign_detailed_analytics policies
DROP POLICY IF EXISTS "campaign_detailed_analytics_select" ON public.campaign_detailed_analytics;

CREATE POLICY "campaign_detailed_analytics_select" ON public.campaign_detailed_analytics
FOR SELECT
USING (is_campaign_creator(campaign_id, auth.uid()));

-- Fix campaign_geographic_impact policies
DROP POLICY IF EXISTS "campaign_geographic_impact_select" ON public.campaign_geographic_impact;

CREATE POLICY "campaign_geographic_impact_select" ON public.campaign_geographic_impact
FOR SELECT
USING (is_campaign_creator(campaign_id, auth.uid()));

-- Fix campaign_social_metrics policies
DROP POLICY IF EXISTS "campaign_social_metrics_select" ON public.campaign_social_metrics;

CREATE POLICY "campaign_social_metrics_select" ON public.campaign_social_metrics
FOR SELECT
USING (is_campaign_creator(campaign_id, auth.uid()));