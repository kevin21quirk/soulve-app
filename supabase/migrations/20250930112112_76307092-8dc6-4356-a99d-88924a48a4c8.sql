-- Fix infinite recursion in organization_members RLS policies
-- Create security definer function to check organization membership
CREATE OR REPLACE FUNCTION public.is_organization_member(org_id uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id 
      AND user_id = user_uuid 
      AND is_active = true
  );
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Organization members are viewable by everyone" ON public.organization_members;
DROP POLICY IF EXISTS "Users can update their own memberships" ON public.organization_members;

-- Create new policies using security definer function
CREATE POLICY "Public members are viewable by everyone"
ON public.organization_members
FOR SELECT
USING (
  is_public = true 
  OR auth.uid() = user_id 
  OR public.is_organization_member(organization_id, auth.uid())
);

CREATE POLICY "Users and admins can update memberships"
ON public.organization_members
FOR UPDATE
USING (
  auth.uid() = user_id 
  OR public.is_organization_admin(organization_id, auth.uid())
);