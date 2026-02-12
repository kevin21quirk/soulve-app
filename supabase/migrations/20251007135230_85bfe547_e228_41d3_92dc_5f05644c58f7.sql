-- Fix infinite recursion in organization_members RLS policies
-- Create security definer functions to bypass RLS when checking organization membership

-- Function to check if user is an organization admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.check_org_admin(_org_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = _org_id
      AND user_id = _user_id
      AND role IN ('admin', 'owner')
      AND is_active = true
  );
$$;

-- Function to check if user is an organization member (bypasses RLS)
CREATE OR REPLACE FUNCTION public.check_org_member(_org_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = _org_id
      AND user_id = _user_id
      AND is_active = true
  );
$$;

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Organization admins can manage team members" ON public.organization_members;
DROP POLICY IF EXISTS "Public members are viewable by everyone" ON public.organization_members;
DROP POLICY IF EXISTS "Team members can view their organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Users and admins can update memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can join organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Users can update their own memberships" ON public.organization_members;

-- Create new non-recursive policies using security definer functions

-- SELECT: Users can view members in their organizations
CREATE POLICY "Users can view organization members"
ON public.organization_members
FOR SELECT
USING (
  is_public = true 
  OR user_id = auth.uid()
  OR public.check_org_member(organization_id, auth.uid())
);

-- INSERT: Users can join organizations (only set their own user_id)
CREATE POLICY "Users can join organizations"
ON public.organization_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own membership OR admins can update any membership
CREATE POLICY "Users and admins can update memberships"
ON public.organization_members
FOR UPDATE
USING (
  auth.uid() = user_id 
  OR public.check_org_admin(organization_id, auth.uid())
);

-- DELETE: Only admins can remove members
CREATE POLICY "Admins can remove members"
ON public.organization_members
FOR DELETE
USING (public.check_org_admin(organization_id, auth.uid()));

-- ALL: Admins have full access for convenience (covers edge cases)
CREATE POLICY "Organization admins have full access"
ON public.organization_members
FOR ALL
USING (public.check_org_admin(organization_id, auth.uid()));