-- Phase 1: Fix Critical RLS Policy Infinite Recursion Bug
-- The issue: groups_select policy queries group_members, and group_members SELECT policy queries groups
-- This creates infinite recursion when either table is queried

-- Step 1: Create a security definer function to check group membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_group_member(p_user_id uuid, p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members
    WHERE user_id = p_user_id AND group_id = p_group_id
  )
$$;

-- Step 2: Create a security definer function to check if group is public
CREATE OR REPLACE FUNCTION public.is_group_public(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM groups
    WHERE id = p_group_id AND is_private = false
  )
$$;

-- Step 3: Create a security definer function to check if user is group admin
CREATE OR REPLACE FUNCTION public.is_group_admin(p_user_id uuid, p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM groups
    WHERE id = p_group_id AND admin_id = p_user_id
  )
$$;

-- Step 4: Drop the problematic policies
DROP POLICY IF EXISTS "groups_select" ON public.groups;
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.groups;
DROP POLICY IF EXISTS "Members can view private groups" ON public.groups;
DROP POLICY IF EXISTS "group_members_select" ON public.group_members;
DROP POLICY IF EXISTS "Members can view group members" ON public.group_members;

-- Step 5: Create new non-recursive policies for groups table
-- Public groups are visible to everyone, private groups only to admin
CREATE POLICY "groups_select_policy" ON public.groups
FOR SELECT USING (
  is_private = false 
  OR admin_id = auth.uid()
  OR public.is_group_member(auth.uid(), id)
);

-- Step 6: Create new non-recursive policies for group_members table
-- Users can see members of groups they belong to, or public groups
CREATE POLICY "group_members_select_policy" ON public.group_members
FOR SELECT USING (
  user_id = auth.uid()
  OR public.is_group_public(group_id)
  OR public.is_group_admin(auth.uid(), group_id)
);