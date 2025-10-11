-- Phase 1: Fix conversation_participants policies
-- Drop ALL existing policies on conversation_participants
DROP POLICY IF EXISTS "Users can join conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update their participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_delete_if_participant" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_delete_own" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_insert" ON public.conversation_participants;
DROP POLICY IF EXISTS "conv_participants_select" ON public.conversation_participants;
DROP POLICY IF EXISTS "conversation_participants_delete" ON public.conversation_participants;
DROP POLICY IF EXISTS "conversation_participants_insert" ON public.conversation_participants;
DROP POLICY IF EXISTS "conversation_participants_select" ON public.conversation_participants;
DROP POLICY IF EXISTS "conversation_participants_update" ON public.conversation_participants;

-- Create 4 simple, non-recursive policies for conversation_participants
CREATE POLICY "Users can view their own conversation participation"
ON public.conversation_participants
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can add themselves to conversations"
ON public.conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participation"
ON public.conversation_participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove themselves from conversations"
ON public.conversation_participants
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Phase 2: Fix group_members policies
-- Drop ALL existing policies on group_members
DROP POLICY IF EXISTS "Users can view group members" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can manage members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join public groups" ON public.group_members;
DROP POLICY IF EXISTS "group_members_delete" ON public.group_members;
DROP POLICY IF EXISTS "group_members_insert" ON public.group_members;
DROP POLICY IF EXISTS "group_members_select" ON public.group_members;
DROP POLICY IF EXISTS "group_members_update" ON public.group_members;

-- Create 4 simple policies for group_members
CREATE POLICY "Users can view their own group membership"
ON public.group_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can add themselves to groups"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own membership"
ON public.group_members
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove themselves from groups"
ON public.group_members
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Phase 3: Drop the problematic security definer functions
-- These functions cause infinite recursion and are no longer needed
DROP FUNCTION IF EXISTS public.is_conversation_participant(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_group_member(uuid, uuid);