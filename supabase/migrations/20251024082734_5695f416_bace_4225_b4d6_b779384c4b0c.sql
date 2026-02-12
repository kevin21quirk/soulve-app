-- Function to check team member limit
CREATE OR REPLACE FUNCTION public.check_team_member_limit(org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_member_count INTEGER;
  max_members INTEGER := 1; -- Default free tier limit
  org_subscription RECORD;
BEGIN
  -- Get current active member count
  SELECT COUNT(*) INTO current_member_count
  FROM public.organization_members
  WHERE organization_id = org_uuid
    AND is_active = true;
  
  -- Check if organization has an active subscription via any admin/owner
  SELECT us.*, sp.max_team_members INTO org_subscription
  FROM public.organization_members om
  JOIN public.user_subscriptions us ON om.user_id = us.user_id
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE om.organization_id = org_uuid
    AND om.role IN ('admin', 'owner')
    AND us.status = 'active'
  ORDER BY sp.max_team_members DESC
  LIMIT 1;
  
  -- If subscription exists, use its max_team_members limit
  IF FOUND THEN
    max_members := org_subscription.max_team_members;
  END IF;
  
  -- Return true if under limit
  RETURN current_member_count < max_members;
END;
$$;

-- RLS Policy to enforce team member limits on insert
CREATE POLICY "Enforce team member limits on insert"
ON public.organization_members
FOR INSERT
WITH CHECK (public.check_team_member_limit(organization_id));

-- Function to check white label access
CREATE OR REPLACE FUNCTION public.has_white_label_access(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  has_access BOOLEAN := false;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid
      AND us.status = 'active'
      AND sp.white_label_enabled = true
  ) INTO has_access;
  
  RETURN has_access;
END;
$$;

-- Function to check ESG access level
CREATE OR REPLACE FUNCTION public.get_esg_access_level(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  plan_name TEXT;
BEGIN
  SELECT sp.name INTO plan_name
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_uuid
    AND us.status = 'active'
  ORDER BY sp.price_monthly DESC
  LIMIT 1;
  
  -- Return access level based on plan
  CASE plan_name
    WHEN 'Enterprise' THEN RETURN 'full';
    WHEN 'Organisation' THEN RETURN 'advanced';
    WHEN 'Individual' THEN RETURN 'basic';
    ELSE RETURN 'none';
  END CASE;
END;
$$;