-- Comprehensive fix for organization_members infinite recursion
-- Drop ALL existing policies to ensure clean slate

-- Drop all known policies (including duplicates and old versions)
DROP POLICY IF EXISTS "Users can view their own organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can join organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can update members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can remove members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view org member list if they are members" ON public.organization_members;
DROP POLICY IF EXISTS "Org admins can add members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can join via invitation" ON public.organization_members;
DROP POLICY IF EXISTS "Org admins can update members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can update own membership" ON public.organization_members;
DROP POLICY IF EXISTS "Org admins can remove members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can leave organizations" ON public.organization_members;
DROP POLICY IF EXISTS "organization_members_select" ON public.organization_members;
DROP POLICY IF EXISTS "organization_members_insert" ON public.organization_members;
DROP POLICY IF EXISTS "organization_members_update" ON public.organization_members;
DROP POLICY IF EXISTS "organization_members_delete" ON public.organization_members;
DROP POLICY IF EXISTS "check_org_admin" ON public.organization_members;
DROP POLICY IF EXISTS "check_org_member" ON public.organization_members;

-- Create NEW non-recursive policies using SECURITY DEFINER functions ONLY

-- SELECT: View own memberships
CREATE POLICY "Users can view their own memberships"
ON public.organization_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- SELECT: View other members if you're a member of the same org
CREATE POLICY "Users can view org member list if they are members"
ON public.organization_members
FOR SELECT
TO authenticated
USING (public.is_org_member(organization_id, auth.uid()));

-- INSERT: Org admins can add members
CREATE POLICY "Org admins can add members"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (public.is_org_admin(organization_id, auth.uid()));

-- INSERT: Users can join (for invitation acceptance)
CREATE POLICY "Users can join via invitation"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- UPDATE: Org admins can update any membership
CREATE POLICY "Org admins can update members"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (public.is_org_admin(organization_id, auth.uid()))
WITH CHECK (public.is_org_admin(organization_id, auth.uid()));

-- UPDATE: Users can update their own membership
CREATE POLICY "Users can update own membership"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE: Org admins can remove members
CREATE POLICY "Org admins can remove members"
ON public.organization_members
FOR DELETE
TO authenticated
USING (public.is_org_admin(organization_id, auth.uid()));

-- DELETE: Users can leave organizations
CREATE POLICY "Users can leave organizations"
ON public.organization_members
FOR DELETE
TO authenticated
USING (user_id = auth.uid());