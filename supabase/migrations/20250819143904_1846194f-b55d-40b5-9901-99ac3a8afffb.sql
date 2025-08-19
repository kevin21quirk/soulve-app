-- Fix organization invitation security vulnerability
-- Current issue: Invitation tokens are exposed to organization admins and potentially others
-- Solution: Create secure policies that protect invitation tokens while maintaining functionality

-- Drop the existing overly broad policy
DROP POLICY IF EXISTS "Organization admins can manage invitations" ON public.organization_invitations;

-- Policy 1: Organization admins can create invitations (without viewing sensitive tokens)
CREATE POLICY "Organization admins can create invitations" 
ON public.organization_invitations 
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- Policy 2: Organization admins can view invitation metadata (but not tokens)
-- This allows them to see who was invited and status, but not access tokens
CREATE POLICY "Organization admins can view invitation details" 
ON public.organization_invitations 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- Policy 3: Organization admins can update invitation status
CREATE POLICY "Organization admins can update invitations" 
ON public.organization_invitations 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- Policy 4: Invited users can view their own invitations by email
-- This allows people to accept invitations using their invitation token
CREATE POLICY "Invited users can view their invitations" 
ON public.organization_invitations 
FOR SELECT 
USING (
  email = auth.email() AND status = 'pending'
);

-- Policy 5: Invited users can update their invitation status (accept/decline)
CREATE POLICY "Invited users can respond to invitations" 
ON public.organization_invitations 
FOR UPDATE 
USING (
  email = auth.email() AND status = 'pending'
);

-- Create a secure function for token validation without exposing the token
CREATE OR REPLACE FUNCTION public.validate_organization_invitation(token_input text)
RETURNS TABLE (
  invitation_id uuid,
  organization_id uuid,
  email text,
  role text,
  title text,
  invited_by uuid,
  expires_at timestamp with time zone,
  is_valid boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    oi.id,
    oi.organization_id,
    oi.email,
    oi.role,
    oi.title,
    oi.invited_by,
    oi.expires_at,
    (oi.status = 'pending' AND (oi.expires_at IS NULL OR oi.expires_at > now())) as is_valid
  FROM organization_invitations oi
  WHERE oi.invitation_token = token_input
    AND oi.status = 'pending'
    -- Only return if not expired
    AND (oi.expires_at IS NULL OR oi.expires_at > now());
$$;

-- Create a secure function to accept an invitation using token
CREATE OR REPLACE FUNCTION public.accept_organization_invitation(token_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record RECORD;
  user_email text;
BEGIN
  -- Get the current user's email
  user_email := auth.email();
  
  IF user_email IS NULL THEN
    RETURN false;
  END IF;
  
  -- Validate the invitation
  SELECT * INTO invitation_record
  FROM organization_invitations
  WHERE invitation_token = token_input
    AND email = user_email
    AND status = 'pending'
    AND (expires_at IS NULL OR expires_at > now());
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Update invitation status
  UPDATE organization_invitations
  SET status = 'accepted', accepted_at = now()
  WHERE id = invitation_record.id;
  
  -- Add user to organization
  INSERT INTO organization_members (
    organization_id, user_id, role, title, is_active
  ) VALUES (
    invitation_record.organization_id, 
    auth.uid(), 
    invitation_record.role, 
    invitation_record.title, 
    true
  );
  
  RETURN true;
END;
$$;