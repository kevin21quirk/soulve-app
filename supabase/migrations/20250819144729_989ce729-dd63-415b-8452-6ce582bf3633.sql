-- Security Fix 1: Database Function Hardening
-- Add search_path protection to all functions to prevent schema injection attacks

-- Update calculate_trust_score function
CREATE OR REPLACE FUNCTION public.calculate_trust_score(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  base_score INTEGER := 50;
  verification_bonus INTEGER := 0;
  total_score INTEGER;
BEGIN
  -- Calculate bonus points from approved verifications
  SELECT COALESCE(COUNT(*) * 10, 0) INTO verification_bonus
  FROM public.user_verifications 
  WHERE user_id = user_uuid AND status = 'approved';
  
  -- Calculate total score (cap at 100)
  total_score := LEAST(base_score + verification_bonus, 100);
  
  RETURN total_score;
END;
$function$;

-- Update cleanup_expired_safe_space_messages function
CREATE OR REPLACE FUNCTION public.cleanup_expired_safe_space_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.safe_space_messages 
  WHERE expires_at < now();
END;
$function$;

-- Update is_organization_admin function
CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
      AND user_id = user_id 
      AND role = 'admin'::text 
      AND is_active = true
  )
$function$;

-- Update update_campaign_amount function
CREATE OR REPLACE FUNCTION public.update_campaign_amount(campaign_uuid uuid, donation_amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Update the campaign's current amount
  UPDATE public.campaigns 
  SET current_amount = COALESCE(current_amount, 0) + donation_amount,
      updated_at = now()
  WHERE id = campaign_uuid;
  
  -- If no rows were affected, the campaign doesn't exist
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Campaign with ID % not found', campaign_uuid;
  END IF;
END;
$function$;

-- Security Fix 2: Restrict Public Table Access
-- Fix user_activities table to require authentication

-- Drop existing policies for user_activities
DROP POLICY IF EXISTS "Users can view public activities" ON public.user_activities;
DROP POLICY IF EXISTS "System functions can manage user activities" ON public.user_activities;

-- Create new secure policies for user_activities
CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.user_activities 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all activities" 
ON public.user_activities 
FOR ALL 
TO service_role
USING (true);

-- Restrict ESG frameworks and indicators to require authentication
DROP POLICY IF EXISTS "ESG frameworks are viewable by everyone" ON public.esg_frameworks;
DROP POLICY IF EXISTS "ESG indicators are viewable by everyone" ON public.esg_indicators;

CREATE POLICY "Authenticated users can view ESG frameworks" 
ON public.esg_frameworks 
FOR SELECT 
TO authenticated
USING (is_active = true);

CREATE POLICY "Authenticated users can view ESG indicators" 
ON public.esg_indicators 
FOR SELECT 
TO authenticated
USING (true);

-- Security Fix 3: Create audit logging system
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Security Fix 4: Enhanced rate limiting tables
CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  bucket_type TEXT NOT NULL,
  tokens INTEGER NOT NULL DEFAULT 0,
  max_tokens INTEGER NOT NULL,
  refill_rate INTEGER NOT NULL DEFAULT 1,
  last_refill TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, bucket_type)
);

-- Enable RLS on rate limiting
ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limit buckets
CREATE POLICY "Users can view their own rate limits" 
ON public.rate_limit_buckets 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Service role can manage rate limits
CREATE POLICY "Service role can manage rate limits" 
ON public.rate_limit_buckets 
FOR ALL 
TO service_role
USING (true);

-- Create function for server-side rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  target_user_id UUID,
  limit_type TEXT,
  max_requests INTEGER DEFAULT 10,
  window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_tokens INTEGER;
  time_since_refill INTERVAL;
  tokens_to_add INTEGER;
BEGIN
  -- Get or create rate limit bucket
  INSERT INTO public.rate_limit_buckets (user_id, bucket_type, tokens, max_tokens, refill_rate)
  VALUES (target_user_id, limit_type, max_requests, max_requests, 1)
  ON CONFLICT (user_id, bucket_type) 
  DO NOTHING;
  
  -- Get current state
  SELECT tokens, (now() - last_refill) INTO current_tokens, time_since_refill
  FROM public.rate_limit_buckets
  WHERE user_id = target_user_id AND bucket_type = limit_type;
  
  -- Calculate tokens to add based on time passed
  tokens_to_add := LEAST(
    max_requests - current_tokens,
    EXTRACT(EPOCH FROM time_since_refill)::INTEGER / window_seconds
  );
  
  -- Refill tokens
  UPDATE public.rate_limit_buckets
  SET 
    tokens = LEAST(max_tokens, tokens + tokens_to_add),
    last_refill = now()
  WHERE user_id = target_user_id AND bucket_type = limit_type;
  
  -- Check if request is allowed
  SELECT tokens INTO current_tokens
  FROM public.rate_limit_buckets
  WHERE user_id = target_user_id AND bucket_type = limit_type;
  
  IF current_tokens > 0 THEN
    -- Consume a token
    UPDATE public.rate_limit_buckets
    SET tokens = tokens - 1
    WHERE user_id = target_user_id AND bucket_type = limit_type;
    
    RETURN TRUE;
  ELSE
    -- Log rate limit violation
    INSERT INTO public.security_audit_log (
      user_id, action_type, severity, details
    ) VALUES (
      target_user_id, 'rate_limit_exceeded', 'medium',
      jsonb_build_object('limit_type', limit_type, 'max_requests', max_requests)
    );
    
    RETURN FALSE;
  END IF;
END;
$function$;