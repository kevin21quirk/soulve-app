-- Add founding member support to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_founding_member boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS founding_member_granted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS founding_member_granted_by uuid REFERENCES auth.users(id);

-- Create subscription admin actions audit table
CREATE TABLE IF NOT EXISTS subscription_admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  target_user_id uuid NOT NULL REFERENCES auth.users(id),
  action_type text NOT NULL CHECK (action_type IN ('grant_founding_member', 'revoke_founding_member', 'assign_subscription', 'cancel_subscription', 'extend_subscription')),
  action_details jsonb DEFAULT '{}'::jsonb,
  reason text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on subscription_admin_actions
ALTER TABLE subscription_admin_actions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view subscription actions" ON subscription_admin_actions;
DROP POLICY IF EXISTS "System can create audit log" ON subscription_admin_actions;

-- Create policies
CREATE POLICY "Admins can view subscription actions"
ON subscription_admin_actions
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "System can create audit log"
ON subscription_admin_actions
FOR INSERT
WITH CHECK (true);

-- Drop and recreate check_campaign_limit with founding member support
DROP FUNCTION IF EXISTS check_campaign_limit(uuid, uuid) CASCADE;
CREATE FUNCTION check_campaign_limit(org_id uuid, user_id uuid)
RETURNS boolean AS $$
DECLARE
  is_founding boolean;
  user_sub record;
  current_count int;
BEGIN
  -- Check if user is founding member (bypass all limits)
  SELECT is_founding_member INTO is_founding
  FROM profiles
  WHERE id = user_id;
  
  IF is_founding THEN
    RETURN true;
  END IF;
  
  -- Get user's subscription
  SELECT us.*, sp.max_campaigns INTO user_sub
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_id 
  AND us.status = 'active'
  LIMIT 1;
  
  -- Get current campaign count
  SELECT COUNT(*) INTO current_count
  FROM campaigns
  WHERE creator_id = user_id AND is_active = true;
  
  -- If no subscription, apply free tier (3 campaigns)
  IF user_sub IS NULL THEN
    RETURN current_count < 3;
  END IF;
  
  -- Check against subscription limit
  RETURN current_count < user_sub.max_campaigns;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate check_team_member_limit with founding member support
DROP FUNCTION IF EXISTS check_team_member_limit(uuid) CASCADE;
CREATE FUNCTION check_team_member_limit(org_id uuid)
RETURNS boolean AS $$
DECLARE
  is_founding boolean;
  org_sub record;
  current_count int;
  creator_id uuid;
BEGIN
  -- Get organization creator
  SELECT created_by INTO creator_id
  FROM organizations
  WHERE id = org_id;
  
  -- Check if creator is founding member (bypass all limits)
  SELECT is_founding_member INTO is_founding
  FROM profiles
  WHERE id = creator_id;
  
  IF is_founding THEN
    RETURN true;
  END IF;
  
  -- Get organization's subscription via creator
  SELECT us.*, sp.max_team_members INTO org_sub
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = creator_id 
  AND us.status = 'active'
  LIMIT 1;
  
  -- Get current team member count
  SELECT COUNT(*) INTO current_count
  FROM organization_members
  WHERE organization_id = org_id AND is_active = true;
  
  -- If no subscription, apply free tier (5 members)
  IF org_sub IS NULL THEN
    RETURN current_count < 5;
  END IF;
  
  -- Check against subscription limit
  RETURN current_count < org_sub.max_team_members;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the policy that depends on check_team_member_limit
CREATE POLICY "Enforce team member limits on insert"
ON organization_members
FOR INSERT
WITH CHECK (check_team_member_limit(organization_id));

-- Drop and recreate has_white_label_access with founding member support
DROP FUNCTION IF EXISTS has_white_label_access(uuid) CASCADE;
CREATE FUNCTION has_white_label_access(user_id uuid)
RETURNS boolean AS $$
DECLARE
  is_founding boolean;
  has_access boolean;
BEGIN
  -- Check if user is founding member (full access)
  SELECT is_founding_member INTO is_founding
  FROM profiles
  WHERE id = user_id;
  
  IF is_founding THEN
    RETURN true;
  END IF;
  
  -- Check subscription for white label access
  SELECT sp.white_label_enabled INTO has_access
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_id 
  AND us.status = 'active'
  LIMIT 1;
  
  RETURN COALESCE(has_access, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate get_esg_access_level with founding member support
DROP FUNCTION IF EXISTS get_esg_access_level(uuid) CASCADE;
CREATE FUNCTION get_esg_access_level(user_id uuid)
RETURNS text AS $$
DECLARE
  is_founding boolean;
  plan_name text;
BEGIN
  -- Check if user is founding member (full access)
  SELECT is_founding_member INTO is_founding
  FROM profiles
  WHERE id = user_id;
  
  IF is_founding THEN
    RETURN 'full';
  END IF;
  
  -- Get plan name from subscription
  SELECT sp.name INTO plan_name
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_id 
  AND us.status = 'active'
  LIMIT 1;
  
  -- Return access level based on plan
  CASE plan_name
    WHEN 'Enterprise' THEN RETURN 'full';
    WHEN 'Organisation' THEN RETURN 'advanced';
    WHEN 'Individual' THEN RETURN 'basic';
    ELSE RETURN 'none';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin function to grant founding member status
CREATE OR REPLACE FUNCTION admin_grant_founding_member(target_user_id uuid, admin_user_id uuid, reason_text text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only admins can grant founding member status';
  END IF;
  
  -- Update user profile
  UPDATE profiles
  SET 
    is_founding_member = true,
    founding_member_granted_at = now(),
    founding_member_granted_by = admin_user_id
  WHERE id = target_user_id;
  
  -- Log the action
  INSERT INTO subscription_admin_actions (admin_id, target_user_id, action_type, reason)
  VALUES (admin_user_id, target_user_id, 'grant_founding_member', reason_text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin function to revoke founding member status
CREATE OR REPLACE FUNCTION admin_revoke_founding_member(target_user_id uuid, admin_user_id uuid, reason_text text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only admins can revoke founding member status';
  END IF;
  
  -- Update user profile
  UPDATE profiles
  SET 
    is_founding_member = false,
    founding_member_granted_at = NULL,
    founding_member_granted_by = NULL
  WHERE id = target_user_id;
  
  -- Log the action
  INSERT INTO subscription_admin_actions (admin_id, target_user_id, action_type, reason)
  VALUES (admin_user_id, target_user_id, 'revoke_founding_member', reason_text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin function to manually assign subscription
CREATE OR REPLACE FUNCTION admin_assign_subscription(
  target_user_id uuid, 
  plan_uuid uuid, 
  billing_cycle_type text,
  admin_user_id uuid,
  reason_text text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  new_sub_id uuid;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only admins can assign subscriptions';
  END IF;
  
  -- Cancel any existing active subscription
  UPDATE user_subscriptions
  SET status = 'cancelled', cancel_at_period_end = true
  WHERE user_id = target_user_id AND status = 'active';
  
  -- Create new subscription
  INSERT INTO user_subscriptions (
    user_id,
    plan_id,
    status,
    billing_cycle,
    current_period_start,
    current_period_end,
    next_payment_date
  ) VALUES (
    target_user_id,
    plan_uuid,
    'active',
    billing_cycle_type,
    CURRENT_DATE,
    CASE 
      WHEN billing_cycle_type = 'monthly' THEN CURRENT_DATE + INTERVAL '1 month'
      ELSE CURRENT_DATE + INTERVAL '1 year'
    END,
    CASE 
      WHEN billing_cycle_type = 'monthly' THEN CURRENT_DATE + INTERVAL '1 month'
      ELSE CURRENT_DATE + INTERVAL '1 year'
    END
  ) RETURNING id INTO new_sub_id;
  
  -- Log the action
  INSERT INTO subscription_admin_actions (admin_id, target_user_id, action_type, action_details, reason)
  VALUES (
    admin_user_id, 
    target_user_id, 
    'assign_subscription',
    jsonb_build_object('subscription_id', new_sub_id, 'plan_id', plan_uuid, 'billing_cycle', billing_cycle_type),
    reason_text
  );
  
  RETURN new_sub_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;