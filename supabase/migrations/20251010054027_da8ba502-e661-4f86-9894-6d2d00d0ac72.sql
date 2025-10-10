-- Fix organization_members recursive policies

-- Drop all existing policies on organization_members
DROP POLICY IF EXISTS "Organization members can view members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.organization_members;
DROP POLICY IF EXISTS "org_members_select_own" ON public.organization_members;
DROP POLICY IF EXISTS "org_members_select_admins" ON public.organization_members;
DROP POLICY IF EXISTS "org_members_insert" ON public.organization_members;
DROP POLICY IF EXISTS "org_members_update" ON public.organization_members;
DROP POLICY IF EXISTS "org_members_delete" ON public.organization_members;

-- Recreate organization_members policies using security definer functions
CREATE POLICY "org_members_select_own" ON public.organization_members
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "org_members_select_if_member" ON public.organization_members
FOR SELECT
USING (is_org_member(organization_id, auth.uid()));

CREATE POLICY "org_members_insert" ON public.organization_members
FOR INSERT
WITH CHECK (is_org_admin(organization_id, auth.uid()));

CREATE POLICY "org_members_update" ON public.organization_members
FOR UPDATE
USING (is_org_admin(organization_id, auth.uid()))
WITH CHECK (is_org_admin(organization_id, auth.uid()));

CREATE POLICY "org_members_delete" ON public.organization_members
FOR DELETE
USING (is_org_admin(organization_id, auth.uid()));

-- Fix conversation_participants recursive policies

-- Drop all existing policies on conversation_participants
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can remove themselves" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_select" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_insert" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_delete_own" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_delete_admin" ON public.conversation_participants;

-- Recreate conversation_participants policies using security definer functions
CREATE POLICY "conv_participants_select" ON public.conversation_participants
FOR SELECT
USING (
  user_id = auth.uid()
  OR is_conversation_participant(conversation_id, auth.uid())
);

CREATE POLICY "conv_participants_insert" ON public.conversation_participants
FOR INSERT
WITH CHECK (is_conversation_participant(conversation_id, auth.uid()));

CREATE POLICY "conv_participants_delete_own" ON public.conversation_participants
FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "conv_participants_delete_if_participant" ON public.conversation_participants
FOR DELETE
USING (is_conversation_participant(conversation_id, auth.uid()));