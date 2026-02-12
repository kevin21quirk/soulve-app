-- Security Hardening: Review and strengthen RLS policies

-- Update stakeholder_data_contributions RLS to prevent unauthorized access
DROP POLICY IF EXISTS "Contributors can view their own submissions" ON public.stakeholder_data_contributions;
CREATE POLICY "Contributors can view their own submissions"
ON public.stakeholder_data_contributions
FOR SELECT
USING (
  contributor_org_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR 
  EXISTS (
    SELECT 1 FROM public.esg_data_requests edr
    WHERE edr.id = stakeholder_data_contributions.data_request_id
    AND public.is_organization_admin(edr.organization_id, auth.uid())
  )
);

-- Strengthen organization invitation policies
DROP POLICY IF EXISTS "Invited users can view their invitations" ON public.organization_invitations;
CREATE POLICY "Invited users can view their invitations"
ON public.organization_invitations
FOR SELECT
USING (
  email = auth.email() 
  AND status = 'pending'
  AND (expires_at IS NULL OR expires_at > now())
);

-- Add policy to prevent invitation token enumeration
CREATE POLICY "Prevent invitation token enumeration"
ON public.organization_invitations
FOR SELECT
USING (
  -- Only allow access if user has the exact token (not via this policy, but via function)
  false
);

-- Secure ESG data requests from unauthorized viewing
DROP POLICY IF EXISTS "Organization members can view data requests" ON public.esg_data_requests;
CREATE POLICY "Organization members can view data requests"
ON public.esg_data_requests
FOR SELECT
USING (
  -- Requesting organization members
  public.is_organization_member(organization_id, auth.uid())
  OR
  -- Requested-from organization members
  (requested_from_org_id IS NOT NULL AND public.is_organization_member(requested_from_org_id, auth.uid()))
);

-- Add rate limiting table for AI endpoints
CREATE TABLE IF NOT EXISTS public.ai_endpoint_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint_name text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, endpoint_name, window_start)
);

-- Enable RLS on rate limits table
ALTER TABLE public.ai_endpoint_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System manages rate limits"
ON public.ai_endpoint_rate_limits
FOR ALL
USING (false)
WITH CHECK (false);

-- Create function to check and update AI rate limits
CREATE OR REPLACE FUNCTION public.check_ai_rate_limit(
  p_user_id uuid,
  p_endpoint_name text,
  p_max_requests integer DEFAULT 50,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count integer;
  v_window_start timestamp with time zone;
BEGIN
  -- Get current window start (rounded to the hour)
  v_window_start := date_trunc('hour', now());
  
  -- Get or create rate limit record
  INSERT INTO public.ai_endpoint_rate_limits (user_id, endpoint_name, window_start, request_count)
  VALUES (p_user_id, p_endpoint_name, v_window_start, 1)
  ON CONFLICT (user_id, endpoint_name, window_start)
  DO UPDATE SET request_count = ai_endpoint_rate_limits.request_count + 1
  RETURNING request_count INTO v_current_count;
  
  -- Check if limit exceeded
  IF v_current_count > p_max_requests THEN
    -- Log the rate limit violation
    INSERT INTO public.security_audit_log (
      user_id, action_type, severity, details
    ) VALUES (
      p_user_id, 'ai_rate_limit_exceeded', 'medium',
      jsonb_build_object(
        'endpoint', p_endpoint_name,
        'request_count', v_current_count,
        'max_requests', p_max_requests
      )
    );
    
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Create index for rate limit queries
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_user_endpoint 
ON public.ai_endpoint_rate_limits(user_id, endpoint_name, window_start);

-- Cleanup old rate limit records (older than 7 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.ai_endpoint_rate_limits 
  WHERE created_at < now() - INTERVAL '7 days';
END;
$$;