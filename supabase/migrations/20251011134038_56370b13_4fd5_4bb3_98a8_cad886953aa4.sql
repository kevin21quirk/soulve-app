-- Fix infinite recursion in organization_members RLS policies
-- The issue: RLS policies were directly querying organization_members within their own checks
-- The solution: Use existing SECURITY DEFINER helper functions that bypass RLS

-- Drop all existing policies on organization_members
DROP POLICY IF EXISTS "Users can view their own organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can join organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can update members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can remove members" ON public.organization_members;

-- Create new policies using SECURITY DEFINER functions to avoid recursion

-- SELECT: Users can view their own memberships and memberships in orgs they belong to
CREATE POLICY "Users can view their own memberships"
ON public.organization_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

CREATE POLICY "Users can view org member list if they are members"
ON public.organization_members
FOR SELECT
TO authenticated
USING (
  public.is_org_member(organization_id, auth.uid())
);

-- INSERT: Users can be added by org admins or join via invitation
CREATE POLICY "Org admins can add members"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_org_admin(organization_id, auth.uid())
);

-- Allow self-join (for invitation acceptance)
CREATE POLICY "Users can join via invitation"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- UPDATE: Org admins can update memberships
CREATE POLICY "Org admins can update members"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (
  public.is_org_admin(organization_id, auth.uid())
)
WITH CHECK (
  public.is_org_admin(organization_id, auth.uid())
);

-- Users can update their own membership (e.g., title, preferences)
CREATE POLICY "Users can update own membership"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);

-- DELETE: Org admins can remove members, users can leave
CREATE POLICY "Org admins can remove members"
ON public.organization_members
FOR DELETE
TO authenticated
USING (
  public.is_org_admin(organization_id, auth.uid())
);

CREATE POLICY "Users can leave organizations"
ON public.organization_members
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);