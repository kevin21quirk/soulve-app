-- Create function to check if user can create more campaigns based on their subscription
CREATE OR REPLACE FUNCTION public.check_campaign_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_campaign_count INTEGER;
  user_max_campaigns INTEGER := 3; -- Default free tier limit
  user_subscription RECORD;
BEGIN
  -- Get current user's campaign count
  SELECT COUNT(*) INTO user_campaign_count
  FROM public.campaigns
  WHERE creator_id = auth.uid()
    AND status != 'deleted';
  
  -- Check if user has an active subscription
  SELECT us.*, sp.max_campaigns INTO user_subscription
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = auth.uid()
    AND us.status = 'active'
  ORDER BY us.created_at DESC
  LIMIT 1;
  
  -- If subscription exists, use its max_campaigns limit
  IF FOUND THEN
    user_max_campaigns := user_subscription.max_campaigns;
  END IF;
  
  -- Return true if under limit
  RETURN user_campaign_count < user_max_campaigns;
END;
$$;

-- Add RLS policy to enforce campaign creation limits
DROP POLICY IF EXISTS "campaigns_insert_with_limit" ON public.campaigns;

CREATE POLICY "campaigns_insert_with_limit" ON public.campaigns
FOR INSERT
WITH CHECK (
  auth.uid() = creator_id 
  AND public.check_campaign_limit()
);

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_campaign_limit() TO authenticated;