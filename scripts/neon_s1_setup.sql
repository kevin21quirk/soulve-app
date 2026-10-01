-- Neon schema for SouLVE
-- Supabase RLS/policies/auth.users/storage removed; clerk_user_id added to profiles
-- Neon project: patient-pine-72857484
--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Clerk auth compatibility: stub auth.uid() so existing functions compile
-- In production, all auth is handled by the Clerk-authenticated API layer.
CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$ SELECT NULL::uuid $$;
CREATE OR REPLACE FUNCTION auth.role() RETURNS text
  LANGUAGE sql STABLE
  AS $$ SELECT 'anon'::text $$;


--
-- PostgreSQL database dump
--


--
-- Name: feedback_priority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_priority AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


--
-- Name: feedback_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_status AS ENUM (
    'new',
    'in_review',
    'in_progress',
    'resolved',
    'wont_fix'
);


--
-- Name: feedback_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_type AS ENUM (
    'bug',
    'feature_request',
    'ui_issue',
    'performance',
    'general'
);


--
-- Name: safeguarding_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.safeguarding_role AS ENUM (
    'safeguarding_lead',
    'senior_reviewer',
    'crisis_manager'
);


--
-- Name: waitlist_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.waitlist_status AS ENUM (
    'pending',
    'approved',
    'denied'
);


--
-- Name: accept_organization_invitation(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.accept_organization_invitation(token_input text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: admin_assign_subscription(uuid, uuid, text, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.admin_assign_subscription(target_user_id uuid, plan_uuid uuid, billing_cycle_type text, admin_user_id uuid, reason_text text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: admin_grant_founding_member(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.admin_grant_founding_member(target_user_id uuid, admin_user_id uuid, reason_text text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: admin_revoke_founding_member(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.admin_revoke_founding_member(target_user_id uuid, admin_user_id uuid, reason_text text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: apply_point_decay(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.apply_point_decay() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  user_record RECORD;
  days_inactive INTEGER;
  decay_percentage NUMERIC := 5.0;
  points_before INTEGER;
  points_after INTEGER;
  campaign_points INTEGER := 0;
BEGIN
  -- Loop through users who haven't been active in 30+ days
  FOR user_record IN 
    SELECT DISTINCT user_id, last_activity_date
    FROM public.impact_metrics
    WHERE last_activity_date < (now() - INTERVAL '30 days')
      AND last_activity_date IS NOT NULL
  LOOP
    -- Calculate days since last activity
    days_inactive := EXTRACT(DAY FROM (now() - user_record.last_activity_date));
    
    -- Get current points from non-campaign activities only
    SELECT COALESCE(SUM(points_earned), 0) INTO points_before
    FROM public.impact_activities
    WHERE user_id = user_record.user_id 
      AND verified = true
      AND activity_type NOT IN ('donation', 'recurring_donation', 'fundraiser_created', 'fundraiser_raised', 'matching_donation');
    
    -- Get campaign-related points that should NOT decay
    SELECT COALESCE(SUM(points_earned), 0) INTO campaign_points
    FROM public.impact_activities
    WHERE user_id = user_record.user_id 
      AND verified = true
      AND activity_type IN ('donation', 'recurring_donation', 'fundraiser_created', 'fundraiser_raised', 'matching_donation');
    
    -- Apply decay only to non-campaign points (5% for every 30 days of inactivity)
    decay_percentage := LEAST(50.0, (days_inactive / 30.0) * 5.0); -- Cap at 50% total decay
    points_after := GREATEST(0, ROUND(points_before * (1 - decay_percentage / 100.0)));
    
    -- Only apply if there's actual decay to apply and user has non-campaign points
    IF points_after < points_before AND points_before > 0 THEN
      -- Log the decay
      INSERT INTO public.point_decay_log (
        user_id, points_before, points_after, decay_percentage,
        reason, last_activity_date
      ) VALUES (
        user_record.user_id, points_before, points_after, decay_percentage,
        'inactivity_decay_non_campaign', user_record.last_activity_date
      );
      
      -- Update decay count in metrics
      UPDATE public.impact_metrics
      SET decay_applied_count = COALESCE(decay_applied_count, 0) + 1
      WHERE user_id = user_record.user_id;
      
      -- Recalculate trust score (campaign points + decayed non-campaign points)
      PERFORM public.calculate_enhanced_trust_score(user_record.user_id);
    END IF;
  END LOOP;
END;
$$;


--
-- Name: approve_waitlist_user(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.approve_waitlist_user(target_user_id uuid, approving_admin_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Check if approving user is admin
  IF NOT public.is_admin(approving_admin_id) THEN
    RAISE EXCEPTION 'Only admins can approve users';
  END IF;
  
  -- Update user status
  UPDATE public.profiles 
  SET 
    waitlist_status = 'approved',
    waitlist_approved_by = approving_admin_id,
    approved_at = now()
  WHERE id = target_user_id;
END;
$$;


--
-- Name: archive_old_reports(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.archive_old_reports() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE esg_reports 
  SET archived_at = now()
  WHERE created_at < (now() - INTERVAL '7 years')
  AND archived_at IS NULL;
END;
$$;


--
-- Name: auto_generate_esg_report(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_generate_esg_report() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only trigger when progress reaches 100% and status changes to 'completed'
  IF NEW.progress_percentage >= 100 AND OLD.progress_percentage < 100 THEN
    -- Update initiative status to completed
    NEW.status := 'completed';
    
    -- Insert a report generation task
    INSERT INTO public.esg_reports (
      organization_id,
      initiative_id,
      report_name,
      report_type,
      reporting_period_start,
      reporting_period_end,
      status,
      created_by
    ) VALUES (
      NEW.organization_id,
      NEW.id,
      NEW.initiative_name || ' - Completion Report',
      'sustainability',
      NEW.reporting_period_start,
      NEW.reporting_period_end,
      'draft',
      NEW.created_by
    );
    
    -- Create notification for organization admins
    INSERT INTO public.notifications (
      recipient_id,
      type,
      title,
      message,
      priority,
      metadata
    )
    SELECT 
      om.user_id,
      'esg_report_ready',
      'ESG Report Ready for Review',
      'Initiative "' || NEW.initiative_name || '" has been completed and a draft report has been generated.',
      'high',
      jsonb_build_object(
        'initiative_id', NEW.id,
        'report_generated', true
      )
    FROM public.organization_members om
    WHERE om.organization_id = NEW.organization_id
      AND om.role IN ('admin', 'owner', 'manager')
      AND om.is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: award_impact_points(uuid, text, integer, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.award_impact_points(target_user_id uuid, activity_type text, points integer, description text, metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  activity_id UUID;
BEGIN
  -- Insert impact activity
  INSERT INTO public.impact_activities (
    user_id, activity_type, points_earned, description, metadata
  ) VALUES (
    target_user_id, activity_type, points, description, metadata
  ) RETURNING id INTO activity_id;
  
  -- Recalculate user metrics
  PERFORM public.calculate_user_impact_metrics(target_user_id);
  
  RETURN activity_id;
END;
$$;


--
-- Name: award_user_points(uuid, text, integer, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.award_user_points(target_user_id uuid, activity_type text, points integer, description text, metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  activity_id UUID;
  total_points INTEGER;
BEGIN
  -- Insert the activity
  INSERT INTO public.impact_activities (user_id, activity_type, points_earned, description, metadata, verified)
  VALUES (target_user_id, activity_type, points, description, metadata, true)
  RETURNING id INTO activity_id;
  
  -- Get updated total points
  SELECT public.get_user_total_points(target_user_id) INTO total_points;
  
  -- Check for new achievements (simplified logic)
  IF activity_type = 'help_completed' AND NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = target_user_id AND achievement_id = 'first_helper'
  ) THEN
    INSERT INTO public.user_achievements (user_id, achievement_id, progress, max_progress)
    VALUES (target_user_id, 'first_helper', 1, 1);
  END IF;
  
  RETURN activity_id;
END;
$$;


--
-- Name: bulk_delete_notifications(uuid[], integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bulk_delete_notifications(notification_ids uuid[], older_than_days integer DEFAULT NULL::integer) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  IF older_than_days IS NOT NULL THEN
    -- Delete notifications older than specified days
    DELETE FROM public.notifications
    WHERE recipient_id = auth.uid()
      AND created_at < (now() - (older_than_days || ' days')::INTERVAL)
      AND is_read = true;
  ELSE
    -- Delete specific notifications
    DELETE FROM public.notifications
    WHERE id = ANY(notification_ids)
      AND recipient_id = auth.uid();
  END IF;

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$;


--
-- Name: bulk_mark_notifications_read(uuid[], boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bulk_mark_notifications_read(notification_ids uuid[] DEFAULT NULL::uuid[], mark_all boolean DEFAULT false) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  IF mark_all THEN
    -- Mark all unread notifications as read for the user
    UPDATE public.notifications
    SET 
      is_read = true,
      read_at = now(),
      delivery_status = 'read'
    WHERE recipient_id = auth.uid()
      AND is_read = false;
  ELSE
    -- Mark specific notifications as read
    UPDATE public.notifications
    SET 
      is_read = true,
      read_at = now(),
      delivery_status = 'read'
    WHERE id = ANY(notification_ids)
      AND recipient_id = auth.uid()
      AND is_read = false;
  END IF;

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$;


--
-- Name: calculate_campaign_performance_score(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_campaign_performance_score(campaign_uuid uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  goal_progress NUMERIC := 0;
  engagement_score NUMERIC := 0;
  social_score NUMERIC := 0;
  geographic_reach NUMERIC := 0;
  final_score INTEGER := 0;
BEGIN
  -- Calculate goal progress (40% weight)
  SELECT COALESCE((current_amount / NULLIF(goal_amount, 0)) * 40, 0) INTO goal_progress
  FROM public.campaigns WHERE id = campaign_uuid;
  
  -- Calculate engagement score (25% weight)
  SELECT COALESCE(
    (COUNT(DISTINCT user_id)::NUMERIC / GREATEST(
      (SELECT total_views FROM public.campaign_analytics 
       WHERE campaign_id = campaign_uuid 
       ORDER BY created_at DESC LIMIT 1), 1
    )) * 25, 0
  ) INTO engagement_score
  FROM public.campaign_engagement 
  WHERE campaign_id = campaign_uuid;
  
  -- Calculate social reach score (20% weight)
  SELECT COALESCE(
    (SUM(value)::NUMERIC / 100) * 20, 0
  ) INTO social_score
  FROM public.campaign_social_metrics 
  WHERE campaign_id = campaign_uuid;
  
  -- Calculate geographic reach (15% weight)
  SELECT COALESCE(
    (COUNT(DISTINCT country_code)::NUMERIC / 10) * 15, 0
  ) INTO geographic_reach
  FROM public.campaign_geographic_impact 
  WHERE campaign_id = campaign_uuid;
  
  -- Calculate final score (cap at 100)
  final_score := LEAST(
    (goal_progress + engagement_score + social_score + geographic_reach)::INTEGER, 
    100
  );
  
  RETURN final_score;
END;
$$;


--
-- Name: calculate_distance(numeric, numeric, numeric, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric) RETURNS numeric
    LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  r DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN r * c;
END;
$$;


--
-- Name: calculate_enhanced_trust_score(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_enhanced_trust_score(user_uuid uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  campaign_points INTEGER := 0;
  non_campaign_points INTEGER := 0;
  decay_applied_count INTEGER := 0;
  total_lifetime_points INTEGER := 0;
  avg_rating NUMERIC := 0;
  red_flags_count INTEGER := 0;
  trust_score NUMERIC := 0;  -- Changed from 50 to 0 - trust is earned
BEGIN
  -- Get campaign points (never decay) - ONLY COUNT ACTIVE POINTS
  SELECT COALESCE(SUM(points_earned), 0) INTO campaign_points
  FROM public.impact_activities
  WHERE user_id = user_uuid 
    AND verified = true
    AND points_state = 'active'
    AND activity_type IN ('donation', 'recurring_donation', 'fundraiser_created', 'fundraiser_raised', 'matching_donation');
  
  -- Get non-campaign points (subject to decay) - ONLY COUNT ACTIVE POINTS
  SELECT COALESCE(SUM(points_earned), 0) INTO non_campaign_points
  FROM public.impact_activities
  WHERE user_id = user_uuid 
    AND verified = true
    AND points_state = 'active'
    AND activity_type NOT IN ('donation', 'recurring_donation', 'fundraiser_created', 'fundraiser_raised', 'matching_donation');
  
  -- Get decay count
  SELECT COALESCE(im.decay_applied_count, 0) INTO decay_applied_count
  FROM public.impact_metrics im
  WHERE im.user_id = user_uuid;
  
  -- Apply decay to non-campaign points based on decay count
  IF decay_applied_count > 0 THEN
    SELECT COALESCE(decay_percentage, 0) INTO decay_applied_count
    FROM public.point_decay_log
    WHERE user_id = user_uuid
    ORDER BY applied_at DESC
    LIMIT 1;
    
    non_campaign_points := GREATEST(0, ROUND(non_campaign_points * (1 - decay_applied_count / 100.0)));
  END IF;
  
  -- Total lifetime points = campaign points (no decay) + non-campaign points (with decay)
  total_lifetime_points := campaign_points + non_campaign_points;
  
  -- Get average rating
  SELECT COALESCE(im.average_rating, 0) INTO avg_rating
  FROM public.impact_metrics im
  WHERE im.user_id = user_uuid;
  
  -- Get active red flags count
  SELECT COALESCE(COUNT(*), 0) INTO red_flags_count
  FROM public.red_flags
  WHERE user_id = user_uuid AND status = 'active';
  
  -- Trust Score = (Lifetime Points ?? 0.6) + (Average Rating ?? 10 ?? 0.3) - (Red Flags ?? 10 ?? 0.1)
  -- Starting from 0, not 50
  trust_score := (total_lifetime_points * 0.6) + (avg_rating * 10 * 0.3) - (red_flags_count * 10 * 0.1);
  
  -- Ensure score is between 0 and 100
  trust_score := GREATEST(0, LEAST(trust_score, 100));
  
  -- Update the impact_metrics table
  UPDATE public.impact_metrics 
  SET 
    trust_score = trust_score::INTEGER,
    impact_score = total_lifetime_points,
    average_rating = avg_rating,
    red_flag_count = red_flags_count,
    calculated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN trust_score::INTEGER;
END;
$$;


--
-- Name: calculate_esg_score(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_esg_score(org_id uuid, assessment_year integer) RETURNS numeric
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  environmental_score NUMERIC := 0;
  social_score NUMERIC := 0;
  governance_score NUMERIC := 0;
  total_score NUMERIC := 0;
  indicator_count INTEGER := 0;
BEGIN
  -- Calculate weighted average scores by category
  SELECT 
    COALESCE(AVG(CASE WHEN ei.category = 'environmental' THEN ma.business_impact * ma.stakeholder_importance END), 0),
    COALESCE(AVG(CASE WHEN ei.category = 'social' THEN ma.business_impact * ma.stakeholder_importance END), 0),
    COALESCE(AVG(CASE WHEN ei.category = 'governance' THEN ma.business_impact * ma.stakeholder_importance END), 0),
    COUNT(*)
  INTO environmental_score, social_score, governance_score, indicator_count
  FROM public.materiality_assessments ma
  JOIN public.esg_indicators ei ON ma.indicator_id = ei.id
  WHERE ma.organization_id = org_id AND ma.assessment_year = assessment_year;
  
  -- Calculate overall ESG score (weighted average: E=40%, S=35%, G=25%)
  IF indicator_count > 0 THEN
    total_score := (environmental_score * 0.4) + (social_score * 0.35) + (governance_score * 0.25);
  END IF;
  
  RETURN ROUND(total_score, 2);
END;
$$;


--
-- Name: calculate_organization_trust_score(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_organization_trust_score(org_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  verification_score INTEGER := 0;
  transparency_score INTEGER := 0;
  engagement_score INTEGER := 0;
  esg_score INTEGER := 0;
  review_score INTEGER := 0;
  total_score INTEGER := 0;
BEGIN
  -- Verification Score (30 points max)
  SELECT COALESCE(COUNT(*) * 5, 0) INTO verification_score
  FROM public.organization_verifications
  WHERE organization_id = org_id AND status = 'approved'
  LIMIT 6;
  
  -- Transparency Score (25 points max) - based on ESG data
  SELECT COALESCE(COUNT(*) * 5, 0) INTO transparency_score
  FROM public.organization_esg_data
  WHERE organization_id = org_id
  LIMIT 5;
  
  -- Engagement Score (20 points max) - followers and activities
  SELECT COALESCE(
    LEAST(20, (COUNT(*) / 10))
  , 0) INTO engagement_score
  FROM public.organization_followers
  WHERE organization_id = org_id;
  
  -- ESG Score (15 points max)
  SELECT COALESCE(
    LEAST(15, ROUND((AVG(business_impact) + AVG(stakeholder_importance)) / 2))
  , 0) INTO esg_score
  FROM public.materiality_assessments
  WHERE organization_id = org_id;
  
  -- Review Score (10 points max)
  SELECT COALESCE(
    LEAST(10, ROUND(AVG(rating) * 2))
  , 0) INTO review_score
  FROM public.organization_reviews
  WHERE organization_id = org_id;
  
  total_score := 50 + verification_score + transparency_score + engagement_score + esg_score + review_score;
  total_score := LEAST(100, GREATEST(0, total_score));
  
  -- Insert calculated score
  INSERT INTO public.organization_trust_scores (
    organization_id, overall_score, verification_score, transparency_score,
    engagement_score, esg_score, review_score
  ) VALUES (
    org_id, total_score, verification_score, transparency_score,
    engagement_score, esg_score, review_score
  );
  
  RETURN total_score;
END;
$$;


--
-- Name: calculate_response_time(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_response_time() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  post_created_at TIMESTAMP WITH TIME ZONE;
  response_time_hours NUMERIC;
BEGIN
  -- Get when the post was created
  SELECT created_at INTO post_created_at
  FROM public.posts
  WHERE id = NEW.post_id;
  
  IF post_created_at IS NOT NULL AND NEW.interaction_type = 'interest_shown' THEN
    -- Calculate hours between post creation and first response
    response_time_hours := EXTRACT(EPOCH FROM (NEW.created_at - post_created_at)) / 3600;
    
    -- Update user's average response time
    UPDATE public.impact_metrics
    SET response_time_hours = COALESCE(
          (response_time_hours * 0.3 + response_time_hours * 0.7), 
          response_time_hours
        ),
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: calculate_total_market_value(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_total_market_value(target_user_id uuid) RETURNS numeric
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  total_value NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(market_value_gbp), 0) INTO total_value
  FROM public.impact_activities
  WHERE user_id = target_user_id 
    AND verified = true
    AND market_value_gbp > 0;
  
  RETURN total_value;
END;
$$;


--
-- Name: calculate_trust_score(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_trust_score(user_uuid uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  base_score INTEGER := 0;  -- Changed from 50 to 0 - trust is earned
  verification_score INTEGER := 0;
  v_record RECORD;
BEGIN
  -- Calculate verification score
  FOR v_record IN 
    SELECT verification_type, status 
    FROM public.user_verifications 
    WHERE user_id = user_uuid AND status = 'approved'
  LOOP
    CASE v_record.verification_type
      WHEN 'email' THEN verification_score := verification_score + 5;
      WHEN 'phone' THEN verification_score := verification_score + 5;
      WHEN 'government_id' THEN verification_score := verification_score + 25;
      WHEN 'organization' THEN verification_score := verification_score + 20;
      WHEN 'background_check' THEN verification_score := verification_score + 15;
      WHEN 'community_leader' THEN verification_score := verification_score + 12;
      WHEN 'expert' THEN verification_score := verification_score + 10;
      WHEN 'address' THEN verification_score := verification_score + 8;
      ELSE verification_score := verification_score + 3;
    END CASE;
  END LOOP;
  
  -- Return capped score (0-100)
  RETURN LEAST(base_score + verification_score, 100);
END;
$$;


--
-- Name: calculate_user_impact_metrics(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_user_impact_metrics(target_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  help_provided INTEGER := 0;
  help_received INTEGER := 0;
  volunteer_hours INTEGER := 0;
  donation_amount NUMERIC := 0;
  connections_count INTEGER := 0;
  avg_response_time NUMERIC := 0;
  calculated_impact_score INTEGER := 0;
  calculated_trust_score INTEGER := 0;
BEGIN
  -- Count help provided (posts marked as completed)
  SELECT COUNT(*) INTO help_provided
  FROM public.posts p
  JOIN public.post_interactions pi ON p.id = pi.post_id
  WHERE p.author_id = target_user_id 
    AND p.category = 'help_needed'
    AND pi.interaction_type = 'help_completed';
  
  -- Count help received
  SELECT COUNT(*) INTO help_received
  FROM public.post_interactions pi
  JOIN public.posts p ON pi.post_id = p.id
  WHERE pi.user_id = target_user_id 
    AND pi.interaction_type = 'help_completed';
  
  -- Sum volunteer hours from user_activities
  SELECT COALESCE(SUM((metadata->>'hours')::INTEGER), 0) INTO volunteer_hours
  FROM public.user_activities
  WHERE user_id = target_user_id 
    AND activity_type = 'volunteer'
    AND metadata->>'hours' IS NOT NULL;
  
  -- Sum donation amounts from user_activities
  SELECT COALESCE(SUM((metadata->>'amount')::NUMERIC), 0) INTO donation_amount
  FROM public.user_activities
  WHERE user_id = target_user_id 
    AND activity_type = 'donation'
    AND metadata->>'amount' IS NOT NULL;
  
  -- Count connections
  SELECT COUNT(*) INTO connections_count
  FROM public.connections
  WHERE (requester_id = target_user_id OR addressee_id = target_user_id)
    AND status = 'accepted';
  
  -- Calculate impact score using weighted algorithm
  calculated_impact_score := (help_provided * 15) + 
                            (volunteer_hours * 3) + 
                            (donation_amount * 0.1)::INTEGER + 
                            (connections_count * 2) + 
                            GREATEST(0, (help_received * -1));
  
  -- Get trust score from existing function or default calculation
  SELECT COALESCE(public.calculate_trust_score(target_user_id), 50) INTO calculated_trust_score;
  
  -- Upsert metrics
  INSERT INTO public.impact_metrics (
    user_id, impact_score, trust_score, help_provided_count, 
    help_received_count, volunteer_hours, donation_amount, 
    connections_count, response_time_hours
  ) VALUES (
    target_user_id, calculated_impact_score, calculated_trust_score,
    help_provided, help_received, volunteer_hours, donation_amount,
    connections_count, avg_response_time
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    impact_score = EXCLUDED.impact_score,
    trust_score = EXCLUDED.trust_score,
    help_provided_count = EXCLUDED.help_provided_count,
    help_received_count = EXCLUDED.help_received_count,
    volunteer_hours = EXCLUDED.volunteer_hours,
    donation_amount = EXCLUDED.donation_amount,
    connections_count = EXCLUDED.connections_count,
    response_time_hours = EXCLUDED.response_time_hours,
    calculated_at = now();
END;
$$;


--
-- Name: calculate_user_similarity(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_user_similarity(user1_id uuid, user2_id uuid) RETURNS numeric
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  common_interests INTEGER := 0;
  total_interests INTEGER := 0;
  similarity_score NUMERIC := 0;
BEGIN
  -- Count common interests/skills
  SELECT COUNT(*)
  INTO common_interests
  FROM public.user_preferences up1
  JOIN public.user_preferences up2 ON up1.preference_value = up2.preference_value 
    AND up1.preference_type = up2.preference_type
  WHERE up1.user_id = user1_id AND up2.user_id = user2_id;
  
  -- Count total unique interests between users
  SELECT COUNT(DISTINCT preference_value)
  INTO total_interests
  FROM public.user_preferences
  WHERE user_id IN (user1_id, user2_id);
  
  -- Calculate similarity (0-1 scale)
  IF total_interests > 0 THEN
    similarity_score := (common_interests::NUMERIC / total_interests::NUMERIC) * 100;
  END IF;
  
  RETURN COALESCE(similarity_score, 0);
END;
$$;


--
-- Name: calculate_user_similarity_with_orgs(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_user_similarity_with_orgs(user1_id uuid, user2_id uuid) RETURNS numeric
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  common_interests INTEGER := 0;
  total_interests INTEGER := 0;
  common_orgs INTEGER := 0;
  similarity_score NUMERIC := 0;
  org_bonus NUMERIC := 0;
BEGIN
  -- Count common interests/skills (existing logic)
  SELECT COUNT(*)
  INTO common_interests
  FROM public.user_preferences up1
  JOIN public.user_preferences up2 ON up1.preference_value = up2.preference_value 
    AND up1.preference_type = up2.preference_type
  WHERE up1.user_id = user1_id AND up2.user_id = user2_id;
  
  -- Count total unique interests between users
  SELECT COUNT(DISTINCT preference_value)
  INTO total_interests
  FROM public.user_preferences
  WHERE user_id IN (user1_id, user2_id);
  
  -- Count common organizations
  SELECT COUNT(*)
  INTO common_orgs
  FROM public.organization_members om1
  JOIN public.organization_members om2 ON om1.organization_id = om2.organization_id
  WHERE om1.user_id = user1_id 
    AND om2.user_id = user2_id 
    AND om1.is_active = true 
    AND om2.is_active = true;
  
  -- Calculate base similarity (0-1 scale)
  IF total_interests > 0 THEN
    similarity_score := (common_interests::NUMERIC / total_interests::NUMERIC) * 70;
  END IF;
  
  -- Add organizational connection bonus (up to 30 points)
  IF common_orgs > 0 THEN
    org_bonus := LEAST(30, common_orgs * 15);
    similarity_score := similarity_score + org_bonus;
  END IF;
  
  RETURN COALESCE(similarity_score, 0);
END;
$$;


--
-- Name: can_access_dashboard(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_access_dashboard(user_uuid uuid) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid 
    AND (waitlist_status = 'approved' OR public.is_admin(user_uuid))
  );
$$;


--
-- Name: can_access_donor_details(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_access_donor_details(org_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'fundraiser') 
      AND is_active = true
  );
$$;


--
-- Name: can_access_message(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_access_message(message_sender_id uuid, message_recipient_id uuid) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  current_user_id uuid;
  sender_profile_exists boolean;
  recipient_profile_exists boolean;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  -- Return false if no authenticated user
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Additional verification: Check that user profiles exist to prevent spoofing
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = message_sender_id) INTO sender_profile_exists;
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = message_recipient_id) INTO recipient_profile_exists;
  
  -- Only allow access if profiles exist and user is either sender or recipient
  RETURN sender_profile_exists 
    AND recipient_profile_exists 
    AND (current_user_id = message_sender_id OR current_user_id = message_recipient_id);
END;
$$;


--
-- Name: can_award_badge(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_award_badge(p_badge_id uuid, p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_badge RECORD;
  v_user_award_count integer;
  v_last_award_time timestamp with time zone;
  v_result jsonb;
BEGIN
  -- Get badge configuration
  SELECT * INTO v_badge FROM public.badges WHERE id = p_badge_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge not found');
  END IF;
  
  -- Check if badge is active
  IF NOT v_badge.is_active THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge is not active');
  END IF;
  
  -- Check availability window
  IF v_badge.availability_window_start IS NOT NULL AND now() < v_badge.availability_window_start THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge not yet available');
  END IF;
  
  IF v_badge.availability_window_end IS NOT NULL AND now() > v_badge.availability_window_end THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge availability window has ended');
  END IF;
  
  -- Check max awards limit
  IF v_badge.max_awards IS NOT NULL AND v_badge.current_award_count >= v_badge.max_awards THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Maximum badge awards reached');
  END IF;
  
  -- Check per-user limit
  SELECT COUNT(*) INTO v_user_award_count
  FROM public.badge_award_log
  WHERE badge_id = p_badge_id 
    AND user_id = p_user_id
    AND verification_status IN ('verified', 'auto_verified')
    AND revoked_at IS NULL;
  
  IF v_user_award_count >= COALESCE(v_badge.max_per_user, 1) THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'User already has this badge');
  END IF;
  
  -- Check cooldown
  IF v_badge.cooldown_hours IS NOT NULL THEN
    SELECT MAX(awarded_at) INTO v_last_award_time
    FROM public.badge_award_log
    WHERE badge_id = p_badge_id 
      AND user_id = p_user_id
      AND verification_status IN ('verified', 'auto_verified');
    
    IF v_last_award_time IS NOT NULL AND 
       v_last_award_time + (v_badge.cooldown_hours || ' hours')::interval > now() THEN
      RETURN jsonb_build_object(
        'can_award', false, 
        'reason', 'Cooldown period not expired',
        'retry_after', v_last_award_time + (v_badge.cooldown_hours || ' hours')::interval
      );
    END IF;
  END IF;
  
  RETURN jsonb_build_object('can_award', true);
END;
$$;


--
-- Name: can_view_profile(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_view_profile(profile_user_id uuid, viewer_id uuid) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    profile_visibility text;
    are_connected boolean := false;
BEGIN
    -- Profile owner can always view their own profile
    IF profile_user_id = viewer_id THEN
        RETURN true;
    END IF;
    
    -- Admins can view all profiles
    IF public.is_admin(viewer_id) THEN
        RETURN true;
    END IF;
    
    -- Anonymous users cannot view any profiles
    IF viewer_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Get privacy settings for the profile
    SELECT COALESCE(ups.profile_visibility, 'public') INTO profile_visibility
    FROM public.user_privacy_settings ups
    WHERE ups.user_id = profile_user_id;
    
    -- If no privacy settings exist, default to public
    IF profile_visibility IS NULL THEN
        profile_visibility := 'public';
    END IF;
    
    -- Handle private profiles
    IF profile_visibility = 'private' THEN
        RETURN false;
    END IF;
    
    -- Handle friends-only profiles - check if users are connected
    IF profile_visibility = 'friends' THEN
        SELECT EXISTS (
            SELECT 1 FROM public.connections
            WHERE ((requester_id = viewer_id AND addressee_id = profile_user_id) 
                   OR (requester_id = profile_user_id AND addressee_id = viewer_id))
            AND status = 'accepted'
        ) INTO are_connected;
        
        RETURN are_connected;
    END IF;
    
    -- Public profiles are viewable by authenticated users
    RETURN profile_visibility = 'public';
END;
$$;


--
-- Name: check_ai_rate_limit(uuid, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_ai_rate_limit(p_user_id uuid, p_endpoint_name text, p_max_requests integer DEFAULT 50, p_window_minutes integer DEFAULT 60) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: check_campaign_limit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_campaign_limit() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: check_campaign_limit(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_campaign_limit(org_id uuid, user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: check_expired_dbs_certificates(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_expired_dbs_certificates() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Mark helpers with expired DBS as unavailable
  UPDATE public.safe_space_helpers
  SET 
    verification_status = 'expired',
    dbs_check_status = 'expired',
    is_available = false,
    last_verification_check = now()
  WHERE user_id IN (
    SELECT user_id 
    FROM public.safe_space_verification_documents
    WHERE document_type = 'dbs_certificate'
    AND verification_status = 'verified'
    AND dbs_expiry_date < CURRENT_DATE
  );
  
  -- Create alerts for expired DBS
  INSERT INTO public.safeguarding_alerts (
    alert_type,
    severity,
    related_user_id,
    description,
    metadata
  )
  SELECT 
    'dbs_expired',
    'high',
    user_id,
    'DBS certificate has expired',
    jsonb_build_object(
      'expiry_date', dbs_expiry_date,
      'document_id', id
    )
  FROM public.safe_space_verification_documents
  WHERE document_type = 'dbs_certificate'
  AND verification_status = 'verified'
  AND dbs_expiry_date < CURRENT_DATE;
END;
$$;


--
-- Name: check_helper_trust_score(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_helper_trust_score() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- If trust score drops below 70, mark helper as needs re-verification
  IF NEW.trust_score < 70 AND OLD.trust_score >= 70 THEN
    UPDATE public.safe_space_helpers
    SET 
      verification_status = 'needs_reverification',
      is_available = false,
      last_verification_check = now()
    WHERE user_id = NEW.user_id;
    
    -- Create alert for safeguarding team
    INSERT INTO public.safeguarding_alerts (
      alert_type,
      severity,
      related_user_id,
      description,
      metadata
    ) VALUES (
      'helper_trust_drop',
      'medium',
      NEW.user_id,
      'Helper trust score dropped below 70',
      jsonb_build_object(
        'old_score', OLD.trust_score,
        'new_score', NEW.trust_score,
        'user_id', NEW.user_id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: check_org_admin(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_org_admin(_org_id uuid, _user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: check_org_member(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_org_member(_org_id uuid, _user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = _org_id
      AND user_id = _user_id
      AND is_active = true
  );
$$;


--
-- Name: check_rate_limit(uuid, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_rate_limit(target_user_id uuid, limit_type text, max_requests integer DEFAULT 10, window_seconds integer DEFAULT 60) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
$$;


--
-- Name: check_team_member_limit(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_team_member_limit(org_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: cleanup_expired_safe_space_messages(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_safe_space_messages() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  DELETE FROM public.safe_space_messages 
  WHERE expires_at < now();
END;
$$;


--
-- Name: cleanup_old_message_logs(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_old_message_logs() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  DELETE FROM public.message_access_log 
  WHERE created_at < (now() - INTERVAL '90 days');
END;
$$;


--
-- Name: cleanup_old_rate_limits(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_old_rate_limits() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  DELETE FROM public.ai_endpoint_rate_limits 
  WHERE created_at < now() - INTERVAL '7 days';
END;
$$;


--
-- Name: confirm_volunteer_work(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.confirm_volunteer_work(activity_id uuid, confirm_status text, rejection_note text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  volunteer_user_id UUID;
  org_id UUID;
  p_id UUID;
  can_confirm BOOLEAN := FALSE;
BEGIN
  -- Get activity details
  SELECT user_id, organization_id, post_id INTO volunteer_user_id, org_id, p_id
  FROM public.impact_activities
  WHERE id = activity_id;
  
  -- Check if current user can confirm
  IF org_id IS NOT NULL THEN
    -- Check if user is org admin
    SELECT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = org_id 
        AND user_id = auth.uid()
        AND is_active = true
        AND role IN ('admin', 'owner', 'manager')
    ) INTO can_confirm;
  ELSIF p_id IS NOT NULL THEN
    -- Check if user is post author
    SELECT EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = p_id AND author_id = auth.uid()
    ) INTO can_confirm;
  END IF;
  
  IF NOT can_confirm THEN
    RAISE EXCEPTION 'You do not have permission to confirm this volunteer work';
  END IF;
  
  -- Update the activity
  UPDATE public.impact_activities
  SET 
    confirmation_status = confirm_status,
    confirmed_by = auth.uid(),
    confirmed_at = now(),
    rejection_reason = rejection_note,
    verified = CASE WHEN confirm_status = 'confirmed' THEN TRUE ELSE FALSE END
  WHERE id = activity_id;
  
  -- If confirmed, award points
  IF confirm_status = 'confirmed' THEN
    -- Recalculate user metrics
    PERFORM public.calculate_user_impact_metrics(volunteer_user_id);
    
    -- Update trust score
    PERFORM public.calculate_enhanced_trust_score(volunteer_user_id);
  END IF;
END;
$$;


--
-- Name: create_default_goals_for_user(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_default_goals_for_user(target_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Check if user already has goals
  IF EXISTS (SELECT 1 FROM public.impact_goals WHERE user_id = target_user_id) THEN
    RETURN;
  END IF;
  
  -- Create default goals
  INSERT INTO public.impact_goals (user_id, title, description, target_value, current_value, deadline, category, is_active)
  VALUES
    (target_user_id, 'Help 5 People This Month', 'Complete help requests from community members', 5, 0, (now() + interval '30 days')::date, 'helping', true),
    (target_user_id, 'Volunteer 10 Hours', 'Contribute volunteer time to community projects', 10, 0, (now() + interval '60 days')::date, 'volunteer', true),
    (target_user_id, 'Make 10 Connections', 'Build your community network', 10, 0, (now() + interval '30 days')::date, 'networking', true);
END;
$$;


--
-- Name: create_relive_story_on_completion(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_relive_story_on_completion() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only create relive story for approved help completions
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Create or update the relive story
    INSERT INTO public.relive_stories (
      post_id, title, category, start_date, completed_date, 
      cover_image, preview_text, emotions
    )
    SELECT 
      p.id, 
      p.title,
      p.category,
      p.created_at,
      now(),
      CASE WHEN array_length(p.media_urls, 1) > 0 THEN p.media_urls[1] ELSE NULL END,
      'A journey of community support and collaboration',
      ARRAY['????', '????', '???']
    FROM public.posts p 
    WHERE p.id = NEW.post_id
    ON CONFLICT (post_id) 
    DO UPDATE SET
      completed_date = now(),
      updated_at = now();
    
    -- Add participants to the story
    INSERT INTO public.story_participants (post_id, user_id, role, participation_type)
    VALUES 
      (NEW.post_id, NEW.helper_id, 'helper', 'helped'),
      (NEW.post_id, NEW.requester_id, 'beneficiary', 'received_help')
    ON CONFLICT (post_id, user_id) DO NOTHING;
    
    -- Add the post creator if different from requester
    INSERT INTO public.story_participants (post_id, user_id, role, participation_type)
    SELECT NEW.post_id, p.author_id, 'creator', 'created'
    FROM public.posts p 
    WHERE p.id = NEW.post_id AND p.author_id != NEW.requester_id
    ON CONFLICT (post_id, user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: decrypt_message(bytea); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrypt_message(encrypted_data bytea) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  encryption_key := COALESCE(current_setting('app.encryption_key', true), 'default_key_change_in_production');
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
END;
$$;


--
-- Name: detect_fraud_patterns(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.detect_fraud_patterns(target_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  daily_points INTEGER := 0;
  weekly_same_actions INTEGER := 0;
  monthly_same_actions INTEGER := 0;
  risk_score NUMERIC := 0;
BEGIN
  -- Check for point burst (>300 points in 24 hours)
  SELECT COALESCE(SUM(points_earned), 0) INTO daily_points
  FROM public.impact_activities
  WHERE user_id = target_user_id 
    AND created_at >= (now() - INTERVAL '24 hours')
    AND verified = true;
  
  IF daily_points > 300 THEN
    INSERT INTO public.fraud_detection_log (
      user_id, detection_type, threshold_value, actual_value,
      time_window, risk_score, auto_flagged
    ) VALUES (
      target_user_id, 'point_burst', 300, daily_points,
      '24_hours', 8.0, true
    );
    
    -- Create red flag for manual review
    INSERT INTO public.red_flags (
      user_id, flag_type, severity, description
    ) VALUES (
      target_user_id, 'point_burst', 'high',
      'User earned ' || daily_points || ' points in 24 hours (threshold: 300)'
    );
  END IF;
  
  -- Check for pattern farming (>10 same actions in a month)
  SELECT COUNT(*) INTO monthly_same_actions
  FROM public.impact_activities
  WHERE user_id = target_user_id
    AND activity_type = (
      SELECT activity_type 
      FROM public.impact_activities 
      WHERE user_id = target_user_id 
        AND created_at >= (now() - INTERVAL '30 days')
      GROUP BY activity_type 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    )
    AND created_at >= (now() - INTERVAL '30 days');
  
  IF monthly_same_actions > 10 THEN
    INSERT INTO public.fraud_detection_log (
      user_id, detection_type, threshold_value, actual_value,
      time_window, risk_score, auto_flagged
    ) VALUES (
      target_user_id, 'pattern_farming', 10, monthly_same_actions,
      '30_days', 6.0, true
    );
  END IF;
END;
$$;


--
-- Name: encrypt_message(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.encrypt_message(message_text text) RETURNS bytea
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  encryption_key := COALESCE(current_setting('app.encryption_key', true), 'default_key_change_in_production');
  RETURN pgp_sym_encrypt(message_text, encryption_key);
END;
$$;


--
-- Name: expire_typing_indicator(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.expire_typing_indicator() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Clear typing indicator after 3 seconds of inactivity
  IF NEW.typing_started_at IS NOT NULL AND NEW.typing_started_at < NOW() - INTERVAL '3 seconds' THEN
    NEW.typing_to_user_id := NULL;
    NEW.typing_started_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: find_nearby_posts(numeric, numeric, numeric, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.find_nearby_posts(user_lat numeric, user_lon numeric, radius_km numeric DEFAULT 50, limit_count integer DEFAULT 20, offset_count integer DEFAULT 0) RETURNS TABLE(id uuid, title text, content text, author_id uuid, organization_id uuid, category text, urgency text, location text, latitude numeric, longitude numeric, tags text[], media_urls text[], created_at timestamp with time zone, updated_at timestamp with time zone, visibility text, is_active boolean, import_source text, external_id text, import_metadata jsonb, imported_at timestamp with time zone, distance_km numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.author_id,
    p.organization_id,
    p.category,
    p.urgency,
    p.location,
    p.latitude,
    p.longitude,
    p.tags,
    p.media_urls,
    p.created_at,
    p.updated_at,
    p.visibility,
    p.is_active,
    p.import_source,
    p.external_id,
    p.import_metadata,
    p.imported_at,
    (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians(user_lon)) +
        sin(radians(user_lat)) * sin(radians(p.latitude))
      )
    )::NUMERIC AS distance_km
  FROM public.posts p
  WHERE p.is_active = true
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND p.visibility = 'public'
    AND (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians(user_lon)) +
        sin(radians(user_lat)) * sin(radians(p.latitude))
      )
    ) <= radius_km
  ORDER BY distance_km ASC, p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;


--
-- Name: find_nearby_users(numeric, numeric, numeric, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.find_nearby_users(user_lat numeric, user_lon numeric, radius_km numeric DEFAULT 50, limit_count integer DEFAULT 20) RETURNS TABLE(id uuid, first_name text, last_name text, avatar_url text, location text, skills text[], interests text[], latitude numeric, longitude numeric, distance_km numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.location,
    p.skills,
    p.interests,
    p.latitude,
    p.longitude,
    calculate_distance(user_lat, user_lon, p.latitude, p.longitude) as distance_km
  FROM profiles p
  WHERE 
    p.location_sharing_enabled = true
    AND p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND p.id != auth.uid()
    AND calculate_distance(user_lat, user_lon, p.latitude, p.longitude) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$;


--
-- Name: generate_user_recommendations(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_user_recommendations(target_user_id uuid) RETURNS TABLE(recommendation_type text, target_id uuid, confidence_score numeric, reasoning text, metadata jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
BEGIN
  -- Clear expired recommendations
  DELETE FROM public.recommendation_cache 
  WHERE user_id = target_user_id AND expires_at < now();
  
  -- Generate connection recommendations based on similar interests
  RETURN QUERY
  SELECT 
    'connection'::TEXT,
    p.id,
    public.calculate_user_similarity(target_user_id, p.id),
    'Based on shared interests and location'::TEXT,
    jsonb_build_object(
      'user', p.first_name || ' ' || p.last_name,
      'location', p.location,
      'avatar', p.avatar_url,
      'mutualConnections', 0,
      'skills', ARRAY(
        SELECT preference_value 
        FROM public.user_preferences 
        WHERE user_id = p.id AND preference_type = 'skill' 
        LIMIT 3
      )
    )
  FROM public.profiles p
  WHERE p.id != target_user_id
    AND p.id NOT IN (
      -- Exclude already connected users
      SELECT CASE 
        WHEN requester_id = target_user_id THEN addressee_id
        ELSE requester_id
      END
      FROM public.connections 
      WHERE (requester_id = target_user_id OR addressee_id = target_user_id)
        AND status = 'accepted'
    )
    AND public.calculate_user_similarity(target_user_id, p.id) > 30
  ORDER BY public.calculate_user_similarity(target_user_id, p.id) DESC
  LIMIT 3;
  
  -- Generate help opportunity recommendations
  RETURN QUERY
  SELECT 
    'help_opportunity'::TEXT,
    posts.id,
    CASE 
      WHEN posts.urgency = 'urgent' THEN 95
      WHEN posts.urgency = 'high' THEN 85
      ELSE 75
    END::NUMERIC,
    'Matches your skills and location'::TEXT,
    jsonb_build_object(
      'location', posts.location,
      'timeCommitment', '30 min daily',
      'compensation', '$20 per task',
      'urgency', posts.urgency
    )
  FROM public.posts
  WHERE posts.category IN ('help_needed', 'volunteer')
    AND posts.is_active = true
    AND posts.author_id != target_user_id
    AND EXISTS (
      -- Check if user has relevant skills
      SELECT 1 FROM public.user_preferences up
      WHERE up.user_id = target_user_id 
        AND up.preference_type = 'skill'
        AND posts.tags && ARRAY[up.preference_value]
    )
  ORDER BY 
    CASE posts.urgency WHEN 'urgent' THEN 3 WHEN 'high' THEN 2 ELSE 1 END DESC,
    posts.created_at DESC
  LIMIT 2;
END;
$_$;


--
-- Name: generate_user_recommendations_with_orgs(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_user_recommendations_with_orgs(target_user_id uuid) RETURNS TABLE(recommendation_type text, target_id uuid, confidence_score numeric, reasoning text, metadata jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Clear expired recommendations
  DELETE FROM public.recommendation_cache 
  WHERE user_id = target_user_id AND expires_at < now();
  
  -- Generate connection recommendations based on organizational connections
  RETURN QUERY
  SELECT 
    'connection'::TEXT,
    p.id,
    GREATEST(80.0, public.calculate_user_similarity_with_orgs(target_user_id, p.id)),
    'Works at the same organization or shares similar causes'::TEXT,
    jsonb_build_object(
      'user', p.first_name || ' ' || p.last_name,
      'location', p.location,
      'avatar', p.avatar_url,
      'organizations', ARRAY(
        SELECT o.name 
        FROM public.organizations o
        JOIN public.organization_members om ON o.id = om.organization_id
        WHERE om.user_id = p.id AND om.is_active = true AND om.is_public = true
        LIMIT 2
      ),
      'commonOrgs', ARRAY(
        SELECT DISTINCT o.name
        FROM public.organizations o
        JOIN public.organization_members om1 ON o.id = om1.organization_id
        JOIN public.organization_members om2 ON o.id = om2.organization_id
        WHERE om1.user_id = target_user_id 
          AND om2.user_id = p.id
          AND om1.is_active = true 
          AND om2.is_active = true
      )
    )
  FROM public.profiles p
  WHERE p.id != target_user_id
    AND p.id NOT IN (
      SELECT CASE 
        WHEN requester_id = target_user_id THEN addressee_id
        ELSE requester_id
      END
      FROM public.connections 
      WHERE (requester_id = target_user_id OR addressee_id = target_user_id)
        AND status = 'accepted'
    )
    AND EXISTS (
      -- Users who share organizations
      SELECT 1 FROM public.organization_members om1
      JOIN public.organization_members om2 ON om1.organization_id = om2.organization_id
      WHERE om1.user_id = target_user_id 
        AND om2.user_id = p.id
        AND om1.is_active = true 
        AND om2.is_active = true
    )
  ORDER BY public.calculate_user_similarity_with_orgs(target_user_id, p.id) DESC
  LIMIT 3;
  
  -- Generate help opportunity recommendations (existing logic enhanced)
  RETURN QUERY
  SELECT 
    'help_opportunity'::TEXT,
    posts.id,
    CASE 
      WHEN posts.urgency = 'urgent' THEN 95
      WHEN posts.urgency = 'high' THEN 85
      ELSE 75
    END::NUMERIC,
    'Matches your skills and organizational interests'::TEXT,
    jsonb_build_object(
      'location', posts.location,
      'timeCommitment', '30 min daily',
      'urgency', posts.urgency,
      'organization', (
        SELECT o.name 
        FROM public.organizations o
        JOIN public.organization_members om ON o.id = om.organization_id
        WHERE om.user_id = posts.author_id AND om.is_active = true
        LIMIT 1
      )
    )
  FROM public.posts
  WHERE posts.category IN ('help_needed', 'volunteer')
    AND posts.is_active = true
    AND posts.author_id != target_user_id
    AND EXISTS (
      SELECT 1 FROM public.user_preferences up
      WHERE up.user_id = target_user_id 
        AND up.preference_type = 'skill'
        AND posts.tags && ARRAY[up.preference_value]
    )
  ORDER BY 
    CASE posts.urgency WHEN 'urgent' THEN 3 WHEN 'high' THEN 2 ELSE 1 END DESC,
    posts.created_at DESC
  LIMIT 2;
END;
$$;


--
-- Name: get_conversations_optimized(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_conversations_optimized(p_user_id uuid) RETURNS TABLE(partner_id uuid, partner_name text, partner_avatar text, last_message text, last_message_time timestamp with time zone, unread_count bigint, conversation_id uuid, deleted_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  WITH user_conversations AS (
    -- Get all conversations for this user with deletion timestamps
    SELECT 
      cp.conversation_id,
      cp.deleted_at
    FROM conversation_participants cp
    WHERE cp.user_id = p_user_id
  ),
  all_messages AS (
    -- Get all messages where user is sender or recipient
    SELECT 
      m.id,
      m.sender_id,
      m.recipient_id,
      m.content,
      m.created_at,
      m.is_read,
      CASE 
        WHEN m.sender_id = p_user_id THEN m.recipient_id 
        ELSE m.sender_id 
      END as partner,
      -- Get conversation_id for deletion filtering
      (SELECT c.id 
       FROM conversations c
       JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = p_user_id
       JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = CASE 
         WHEN m.sender_id = p_user_id THEN m.recipient_id 
         ELSE m.sender_id 
       END
       LIMIT 1
      ) as conv_id
    FROM messages m
    WHERE m.sender_id = p_user_id OR m.recipient_id = p_user_id
  ),
  filtered_messages AS (
    -- Filter out messages before deletion threshold
    SELECT 
      am.*,
      uc.deleted_at as deletion_threshold
    FROM all_messages am
    LEFT JOIN user_conversations uc ON uc.conversation_id = am.conv_id
    WHERE uc.deleted_at IS NULL 
       OR am.created_at > uc.deleted_at
  ),
  latest_per_partner AS (
    -- Get the most recent message per partner
    SELECT DISTINCT ON (fm.partner)
      fm.partner,
      fm.content,
      fm.created_at,
      fm.conv_id,
      fm.deletion_threshold
    FROM filtered_messages fm
    ORDER BY fm.partner, fm.created_at DESC
  ),
  unread_counts AS (
    -- Count unread messages per partner (only after deletion)
    SELECT 
      fm.partner,
      COUNT(*) as unread
    FROM filtered_messages fm
    WHERE fm.sender_id = fm.partner
      AND fm.recipient_id = p_user_id
      AND fm.is_read = false
    GROUP BY fm.partner
  )
  SELECT 
    lpp.partner as partner_id,
    CONCAT(p.first_name, ' ', p.last_name) as partner_name,
    p.avatar_url as partner_avatar,
    lpp.content as last_message,
    lpp.created_at as last_message_time,
    COALESCE(uc.unread, 0) as unread_count,
    lpp.conv_id as conversation_id,
    lpp.deletion_threshold as deleted_at
  FROM latest_per_partner lpp
  LEFT JOIN profiles p ON p.id = lpp.partner
  LEFT JOIN unread_counts uc ON uc.partner = lpp.partner
  ORDER BY lpp.created_at DESC;
END;
$$;


--
-- Name: get_donor_statistics(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_donor_statistics(org_id uuid) RETURNS TABLE(id uuid, organization_id uuid, donor_type text, total_donated numeric, donation_count integer, first_donation_date timestamp with time zone, last_donation_date timestamp with time zone, average_donation numeric, donor_status text, tags text[], created_at timestamp with time zone, updated_at timestamp with time zone, first_initial text, last_initial text, masked_email text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  -- Check if user has access to this organization
  SELECT 
    d.id,
    d.organization_id,
    d.donor_type,
    d.total_donated,
    d.donation_count,
    d.first_donation_date,
    d.last_donation_date,
    d.average_donation,
    d.donor_status,
    d.tags,
    d.created_at,
    d.updated_at,
    -- Only show first letter of first name and last name for privacy
    CASE 
      WHEN d.first_name IS NOT NULL THEN LEFT(d.first_name, 1) || '.'
      ELSE NULL 
    END as first_initial,
    CASE 
      WHEN d.last_name IS NOT NULL THEN LEFT(d.last_name, 1) || '.'
      ELSE NULL 
    END as last_initial,
    -- Show masked email (first 2 chars + *** + domain)
    CASE 
      WHEN d.email IS NOT NULL THEN 
        LEFT(d.email, 2) || '***@' || SPLIT_PART(d.email, '@', 2)
      ELSE NULL 
    END as masked_email
  FROM public.donors d
  WHERE d.organization_id = org_id
    AND EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = org_id 
        AND om.user_id = auth.uid() 
        AND om.is_active = true
    );
$$;


--
-- Name: get_esg_access_level(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_esg_access_level(user_id uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: get_esg_compliance_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_esg_compliance_status(org_id uuid) RETURNS TABLE(framework_name text, compliance_percentage numeric, missing_indicators integer, last_update date)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ef.name,
    ROUND((COUNT(oed.id)::NUMERIC / COUNT(ei.id)::NUMERIC) * 100, 1) as compliance_percentage,
    (COUNT(ei.id) - COUNT(oed.id))::INTEGER as missing_indicators,
    MAX(oed.reporting_period) as last_update
  FROM public.esg_frameworks ef
  JOIN public.esg_indicators ei ON ef.id = ei.framework_id
  LEFT JOIN public.organization_esg_data oed ON ei.id = oed.indicator_id 
    AND oed.organization_id = org_id
    AND oed.reporting_period >= (CURRENT_DATE - INTERVAL '1 year')
  WHERE ef.is_active = true
  GROUP BY ef.id, ef.name
  ORDER BY compliance_percentage DESC;
END;
$$;


--
-- Name: get_feed_with_stats(uuid, uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_feed_with_stats(p_user_id uuid, p_organization_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0) RETURNS TABLE(id uuid, title text, content text, author_id uuid, author_name text, author_avatar text, organization_id uuid, organization_name text, organization_logo text, category text, urgency text, location text, tags text[], media_urls text[], created_at timestamp with time zone, updated_at timestamp with time zone, is_active boolean, import_source text, external_id text, import_metadata jsonb, imported_at timestamp with time zone, likes_count bigint, comments_count bigint, shares_count bigint, is_liked boolean, is_bookmarked boolean, reactions jsonb, status text, goal_amount numeric, current_amount numeric, end_date timestamp with time zone, campaign_category text, currency text, donor_count bigint, recent_donations_24h bigint, recent_donors jsonb, average_donation numeric, progress_percentage numeric, days_remaining integer)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  WITH posts_with_profiles AS (
    SELECT 
      p.id,
      p.title,
      p.content,
      p.author_id,
      COALESCE(
        CASE WHEN p.organization_id IS NOT NULL THEN o.name ELSE (prof.first_name || ' ' || prof.last_name) END,
        'Anonymous'
      ) as author_name,
      COALESCE(
        CASE WHEN p.organization_id IS NOT NULL THEN o.avatar_url ELSE prof.avatar_url END,
        ''
      ) as author_avatar,
      p.organization_id,
      o.name as organization_name,
      o.avatar_url as organization_logo,
      p.category,
      p.urgency,
      p.location,
      p.tags,
      p.media_urls,
      p.created_at,
      p.updated_at,
      p.is_active,
      p.import_source,
      p.external_id,
      p.import_metadata,
      p.imported_at,
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'like'), 0) as likes_count,
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'comment'), 0) as comments_count,
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'share'), 0) as shares_count,
      EXISTS(SELECT 1 FROM post_interactions WHERE post_id = p.id AND user_id = p_user_id AND interaction_type = 'like') as is_liked,
      EXISTS(SELECT 1 FROM post_interactions WHERE post_id = p.id AND user_id = p_user_id AND interaction_type = 'bookmark') as is_bookmarked,
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'emoji', pr.reaction_type,
            'count', reaction_counts.count,
            'userReacted', EXISTS(SELECT 1 FROM post_reactions pr2 WHERE pr2.post_id = p.id AND pr2.user_id = p_user_id AND pr2.reaction_type = pr.reaction_type)
          )
        )
        FROM (
          SELECT reaction_type, COUNT(*) as count
          FROM post_reactions
          WHERE post_id = p.id
          GROUP BY reaction_type
        ) reaction_counts
        JOIN post_reactions pr ON pr.post_id = p.id AND pr.reaction_type = reaction_counts.reaction_type
        GROUP BY pr.reaction_type, reaction_counts.count
      ), '[]'::jsonb) as reactions,
      NULL::TEXT as status,
      NULL::NUMERIC as goal_amount,
      NULL::NUMERIC as current_amount,
      NULL::TIMESTAMPTZ as end_date,
      NULL::TEXT as campaign_category,
      NULL::TEXT as currency,
      NULL::BIGINT as donor_count,
      NULL::BIGINT as recent_donations_24h,
      NULL::JSONB as recent_donors,
      NULL::NUMERIC as average_donation,
      NULL::NUMERIC as progress_percentage,
      NULL::INT as days_remaining
    FROM posts p
    LEFT JOIN profiles prof ON prof.id = p.author_id
    LEFT JOIN organizations o ON o.id = p.organization_id
    WHERE p.is_active = true
      AND (p_organization_id IS NULL AND p.organization_id IS NULL OR p.organization_id = p_organization_id)
  ),
  campaigns_with_stats AS (
    SELECT 
      c.id,
      c.title,
      c.description as content,
      c.creator_id as author_id,
      (prof.first_name || ' ' || prof.last_name) as author_name,
      prof.avatar_url as author_avatar,
      NULL::UUID as organization_id,
      NULL::TEXT as organization_name,
      NULL::TEXT as organization_logo,
      'fundraising'::TEXT as category,
      COALESCE(c.urgency, 'medium') as urgency,
      c.location,
      c.tags,
      COALESCE(
        CASE 
          WHEN c.gallery_images IS NOT NULL AND jsonb_typeof(c.gallery_images) = 'array' 
          THEN ARRAY(SELECT jsonb_array_elements_text(c.gallery_images))
          ELSE ARRAY[]::TEXT[]
        END,
        ARRAY[]::TEXT[]
      ) as media_urls,
      c.created_at,
      c.updated_at,
      true as is_active,
      NULL::TEXT as import_source,
      NULL::TEXT as external_id,
      NULL::JSONB as import_metadata,
      NULL::TIMESTAMPTZ as imported_at,
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'like'), 0) as likes_count,
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'comment'), 0) as comments_count,
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'share'), 0) as shares_count,
      EXISTS(SELECT 1 FROM campaign_interactions WHERE campaign_id = c.id AND user_id = p_user_id AND interaction_type = 'like') as is_liked,
      EXISTS(SELECT 1 FROM campaign_interactions WHERE campaign_id = c.id AND user_id = p_user_id AND interaction_type = 'bookmark') as is_bookmarked,
      '[]'::jsonb as reactions,  -- Return empty reactions array instead of querying non-existent table
      c.status,
      c.goal_amount,
      c.current_amount,
      c.end_date,
      c.category as campaign_category,
      COALESCE(c.currency, 'USD') as currency,
      COALESCE((SELECT COUNT(*) FROM campaign_donations WHERE campaign_id = c.id AND payment_status = 'completed'), 0) as donor_count,
      COALESCE((SELECT COUNT(*) FROM campaign_donations WHERE campaign_id = c.id AND payment_status = 'completed' AND created_at > NOW() - INTERVAL '24 hours'), 0) as recent_donations_24h,
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', COALESCE(cd.donor_id::TEXT, 'anonymous'),
            'avatar', donor_prof.avatar_url,
            'name', CASE WHEN cd.is_anonymous THEN NULL ELSE (donor_prof.first_name || ' ' || donor_prof.last_name) END,
            'isAnonymous', cd.is_anonymous,
            'amount', cd.amount,
            'createdAt', cd.created_at
          )
        )
        FROM (
          SELECT * FROM campaign_donations 
          WHERE campaign_id = c.id AND payment_status = 'completed'
          ORDER BY created_at DESC
          LIMIT 5
        ) cd
        LEFT JOIN profiles donor_prof ON donor_prof.id = cd.donor_id
      ), '[]'::jsonb) as recent_donors,
      COALESCE((
        SELECT AVG(amount) 
        FROM campaign_donations 
        WHERE campaign_id = c.id AND payment_status = 'completed'
      ), 0) as average_donation,
      CASE WHEN c.goal_amount > 0 THEN LEAST((c.current_amount / c.goal_amount) * 100, 100) ELSE 0 END as progress_percentage,
      CASE WHEN c.end_date IS NOT NULL THEN GREATEST(EXTRACT(DAY FROM (c.end_date - NOW())), 0)::INT ELSE NULL END as days_remaining
    FROM campaigns c
    LEFT JOIN profiles prof ON prof.id = c.creator_id
    WHERE (c.status = 'active' OR (c.status = 'draft' AND c.creator_id = p_user_id))
  )
  SELECT * FROM (
    SELECT * FROM posts_with_profiles
    UNION ALL
    SELECT * FROM campaigns_with_stats
  ) combined
  ORDER BY created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


--
-- Name: get_notification_analytics(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_notification_analytics(p_user_id uuid, p_days_back integer DEFAULT 30) RETURNS TABLE(total_notifications bigint, delivered_count bigint, opened_count bigint, clicked_count bigint, open_rate numeric, click_rate numeric)
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT
    COUNT(DISTINCT ndl.notification_id) as total_notifications,
    COUNT(DISTINCT CASE WHEN ndl.delivered_at IS NOT NULL THEN ndl.id END) as delivered_count,
    COUNT(DISTINCT CASE WHEN ndl.opened_at IS NOT NULL THEN ndl.id END) as opened_count,
    COUNT(DISTINCT CASE WHEN ndl.clicked_at IS NOT NULL THEN ndl.id END) as clicked_count,
    ROUND(
      COUNT(DISTINCT CASE WHEN ndl.opened_at IS NOT NULL THEN ndl.id END)::numeric / 
      NULLIF(COUNT(DISTINCT CASE WHEN ndl.delivered_at IS NOT NULL THEN ndl.id END), 0) * 100,
      2
    ) as open_rate,
    ROUND(
      COUNT(DISTINCT CASE WHEN ndl.clicked_at IS NOT NULL THEN ndl.id END)::numeric / 
      NULLIF(COUNT(DISTINCT CASE WHEN ndl.opened_at IS NOT NULL THEN ndl.id END), 0) * 100,
      2
    ) as click_rate
  FROM public.notification_delivery_log ndl
  WHERE ndl.user_id = p_user_id
    AND ndl.created_at >= NOW() - INTERVAL '1 day' * p_days_back;
$$;


--
-- Name: get_or_create_conversation(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_or_create_conversation(user1_id uuid, user2_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  conversation_uuid UUID;
BEGIN
  -- Try to find existing conversation
  SELECT cp1.conversation_id INTO conversation_uuid
  FROM public.conversation_participants cp1
  JOIN public.conversation_participants cp2 
    ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = user1_id 
    AND cp2.user_id = user2_id
  LIMIT 1;
  
  -- If no conversation exists, create one
  IF conversation_uuid IS NULL THEN
    INSERT INTO public.conversations DEFAULT VALUES
    RETURNING id INTO conversation_uuid;
    
    -- Add both participants
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES (conversation_uuid, user1_id), (conversation_uuid, user2_id);
  END IF;
  
  RETURN conversation_uuid;
END;
$$;


--
-- Name: get_post_comments(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_post_comments(target_post_id uuid) RETURNS TABLE(id uuid, post_id uuid, user_id uuid, organization_id uuid, parent_comment_id uuid, content text, created_at timestamp with time zone, edited_at timestamp with time zone, is_deleted boolean, author_name text, author_avatar text, is_organization boolean, likes_count bigint, user_has_liked boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.id,
    pi.post_id,
    pi.user_id,
    pi.organization_id,
    pi.parent_comment_id,
    pi.content,
    pi.created_at,
    pi.edited_at,
    pi.is_deleted,
    COALESCE(
      o.name,
      COALESCE(p.first_name || ' ' || p.last_name, 'Anonymous')
    ) as author_name,
    COALESCE(o.avatar_url, p.avatar_url) as author_avatar,
    (pi.organization_id IS NOT NULL) as is_organization,
    COALESCE(COUNT(DISTINCT cl.id), 0) as likes_count,
    EXISTS(
      SELECT 1 FROM comment_likes cl2 
      WHERE cl2.comment_id = pi.id 
      AND cl2.user_id = auth.uid()
    ) as user_has_liked
  FROM post_interactions pi
  LEFT JOIN profiles p ON p.id = pi.user_id
  LEFT JOIN organizations o ON o.id = pi.organization_id
  LEFT JOIN comment_likes cl ON cl.comment_id = pi.id
  WHERE pi.post_id = target_post_id
    AND pi.interaction_type = 'comment'
    AND pi.is_deleted = false
  GROUP BY pi.id, pi.post_id, pi.user_id, pi.organization_id, pi.parent_comment_id, 
           pi.content, pi.created_at, pi.edited_at, pi.is_deleted, 
           p.first_name, p.last_name, p.avatar_url,
           o.name, o.avatar_url
  ORDER BY pi.created_at ASC;
END;
$$;


--
-- Name: get_post_reaction_counts(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_post_reaction_counts(target_post_id uuid) RETURNS TABLE(reaction_type text, count bigint, user_reacted boolean)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    pr.reaction_type,
    COUNT(*) as count,
    bool_or(pr.user_id = auth.uid()) as user_reacted
  FROM public.post_reactions pr
  WHERE pr.post_id = target_post_id
  GROUP BY pr.reaction_type
  ORDER BY count DESC;
$$;


--
-- Name: get_user_conversations(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_conversations(target_user_id uuid) RETURNS TABLE(conversation_id uuid, other_user_id uuid, other_user_name text, other_user_avatar text, last_message text, last_message_time timestamp with time zone, unread_count bigint)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN m.sender_id = target_user_id THEN m.recipient_id
      ELSE m.sender_id
    END as other_user_id,
    p.first_name || ' ' || COALESCE(p.last_name, '') as other_user_name,
    p.avatar_url as other_user_avatar,
    m.content as last_message,
    m.created_at as last_message_time,
    (
      SELECT COUNT(*)::BIGINT
      FROM public.messages m2
      WHERE ((m2.sender_id = other_user_id AND m2.recipient_id = target_user_id) OR
             (m2.sender_id = target_user_id AND m2.recipient_id = other_user_id))
        AND m2.recipient_id = target_user_id
        AND m2.is_read = false
    ) as unread_count
  FROM public.conversations c
  JOIN public.conversation_participants cp ON c.id = cp.conversation_id
  LEFT JOIN LATERAL (
    SELECT *
    FROM public.messages msg
    WHERE (msg.sender_id = target_user_id OR msg.recipient_id = target_user_id)
    ORDER BY msg.created_at DESC
    LIMIT 1
  ) m ON true
  LEFT JOIN public.profiles p ON p.id = CASE 
    WHEN m.sender_id = target_user_id THEN m.recipient_id
    ELSE m.sender_id
  END
  WHERE cp.user_id = target_user_id
  ORDER BY m.created_at DESC NULLS LAST;
END;
$$;


--
-- Name: get_user_organizations(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_organizations(target_user_id uuid) RETURNS TABLE(organization_id uuid, organization_name text, role text, title text, is_current boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    om.role,
    om.title,
    (om.end_date IS NULL OR om.end_date > CURRENT_DATE) as is_current
  FROM public.organizations o
  JOIN public.organization_members om ON o.id = om.organization_id
  WHERE om.user_id = target_user_id 
    AND om.is_active = true
    AND om.is_public = true
  ORDER BY om.created_at DESC;
END;
$$;


--
-- Name: get_user_total_points(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_total_points(target_user_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  total_points INTEGER := 0;
BEGIN
  SELECT COALESCE(SUM(points_earned), 0) INTO total_points
  FROM public.impact_activities
  WHERE user_id = target_user_id AND verified = true;
  
  RETURN total_points;
END;
$$;


--
-- Name: get_volunteer_work_recipient(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_volunteer_work_recipient(activity_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  recipient_id UUID;
  org_id UUID;
  p_id UUID;
BEGIN
  -- Get the organization_id or post_id from the activity
  SELECT organization_id, post_id INTO org_id, p_id
  FROM public.impact_activities
  WHERE id = activity_id;
  
  -- If it's an organization, get any active admin
  IF org_id IS NOT NULL THEN
    SELECT user_id INTO recipient_id
    FROM public.organization_members
    WHERE organization_id = org_id 
      AND is_active = true 
      AND role IN ('admin', 'owner')
    LIMIT 1;
  -- If it's a post, get the author
  ELSIF p_id IS NOT NULL THEN
    SELECT author_id INTO recipient_id
    FROM public.posts
    WHERE id = p_id;
  END IF;
  
  RETURN recipient_id;
END;
$$;


--
-- Name: group_similar_notifications(uuid, text, interval); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.group_similar_notifications(p_user_id uuid, p_type text, p_time_window interval DEFAULT '01:00:00'::interval) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_group_key text;
BEGIN
  -- Generate a group key based on type and time window
  v_group_key := p_type || '_' || DATE_TRUNC('hour', NOW())::text;
  RETURN v_group_key;
END;
$$;


--
-- Name: handle_enhanced_help_approval(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_enhanced_help_approval() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  effort_points INTEGER := 25; -- Base points
  final_points INTEGER;
  domain_type TEXT := 'community_building';
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    
    -- Determine effort level and points based on feedback rating and post category
    IF NEW.feedback_rating >= 5 THEN
      effort_points := 50; -- Excellent help
    ELSIF NEW.feedback_rating >= 4 THEN
      effort_points := 35; -- Good help
    ELSIF NEW.feedback_rating >= 3 THEN
      effort_points := 25; -- Average help
    ELSE
      effort_points := 10; -- Below average help
    END IF;
    
    -- Award points to the helper with enhanced tracking
    PERFORM public.award_user_points(
      NEW.helper_id,
      'help_completed',
      effort_points,
      'Help approved: ' || (SELECT title FROM public.posts WHERE id = NEW.post_id),
      jsonb_build_object(
        'post_id', NEW.post_id,
        'rating', NEW.feedback_rating,
        'completion_request_id', NEW.id,
        'effort_level', CASE 
          WHEN NEW.feedback_rating >= 5 THEN 5
          WHEN NEW.feedback_rating >= 4 THEN 4
          WHEN NEW.feedback_rating >= 3 THEN 3
          ELSE 2
        END
      )
    );
    
    -- Update trust domain score
    INSERT INTO public.trust_domains (user_id, domain, domain_score, actions_count, average_rating)
    VALUES (NEW.helper_id, domain_type, NEW.feedback_rating * 20, 1, NEW.feedback_rating)
    ON CONFLICT (user_id, domain)
    DO UPDATE SET
      actions_count = trust_domains.actions_count + 1,
      average_rating = (trust_domains.average_rating * trust_domains.actions_count + NEW.feedback_rating) / (trust_domains.actions_count + 1),
      domain_score = LEAST(100, trust_domains.domain_score + 2),
      last_activity = now(),
      updated_at = now();
    
    -- Update user's last activity
    UPDATE public.impact_metrics
    SET last_activity_date = now()
    WHERE user_id = NEW.helper_id;
    
    -- Run fraud detection
    PERFORM public.detect_fraud_patterns(NEW.helper_id);
    
    -- Recalculate enhanced trust score
    PERFORM public.calculate_enhanced_trust_score(NEW.helper_id);
    
    -- Mark the post as completed
    UPDATE public.posts 
    SET is_active = false 
    WHERE id = NEW.post_id;
    
    -- Update completion request with review timestamp
    NEW.reviewed_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: handle_help_approval(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_help_approval() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Award points to the helper
    PERFORM public.award_user_points(
      NEW.helper_id,
      'help_completed',
      25, -- Base points for help completion
      'Help approved: ' || (SELECT title FROM public.posts WHERE id = NEW.post_id),
      jsonb_build_object(
        'post_id', NEW.post_id,
        'rating', NEW.feedback_rating,
        'completion_request_id', NEW.id
      )
    );
    
    -- Mark the post as completed
    UPDATE public.posts 
    SET is_active = false 
    WHERE id = NEW.post_id;
    
    -- Update completion request with review timestamp
    NEW.reviewed_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: handle_help_completion(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_help_completion() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.interaction_type = 'help_completed' THEN
    -- Award points to both helper and person who received help
    PERFORM public.award_impact_points(
      NEW.user_id, 
      'help_provided', 
      15, 
      'Helped someone with: ' || (SELECT title FROM public.posts WHERE id = NEW.post_id),
      jsonb_build_object('post_id', NEW.post_id)
    );
    
    -- Update metrics for post author (person who received help)
    PERFORM public.calculate_user_impact_metrics(
      (SELECT author_id FROM public.posts WHERE id = NEW.post_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: handle_language_prefs_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_language_prefs_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Initialize impact metrics for gamification
  INSERT INTO public.impact_metrics (
    user_id,
    impact_score,
    trust_score,
    help_provided_count,
    help_received_count,
    volunteer_hours,
    donation_amount,
    connections_count,
    response_time_hours,
    average_rating,
    red_flag_count
  ) VALUES (
    NEW.id,
    0,    -- impact_score
    50,   -- trust_score (starting value)
    0,    -- help_provided_count
    0,    -- help_received_count
    0,    -- volunteer_hours
    0,    -- donation_amount
    0,    -- connections_count
    0,    -- response_time_hours
    0,    -- average_rating
    0     -- red_flag_count
  );
  
  -- Initialize default trust domain
  INSERT INTO public.trust_domains (
    user_id,
    domain,
    domain_score,
    actions_count,
    average_rating
  ) VALUES (
    NEW.id,
    'community_building',
    0,
    0,
    0
  );
  
  -- Insert default privacy settings
  INSERT INTO public.user_privacy_settings (
    user_id,
    profile_visibility,
    allow_direct_messages,
    show_online_status,
    show_location,
    show_email,
    show_phone,
    allow_tagging,
    show_activity_feed
  ) VALUES (
    NEW.id,
    'public',
    'everyone',
    true,
    true,
    false,
    false,
    true,
    true
  );
  
  RETURN NEW;
END;
$$;


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: has_safeguarding_role(uuid, public.safeguarding_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_safeguarding_role(_user_id uuid, _role public.safeguarding_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.safeguarding_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  );
$$;


--
-- Name: has_white_label_access(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_white_label_access(user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: increment_badge_award_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_badge_award_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only increment if verification status is verified or auto_verified
  IF NEW.verification_status IN ('verified', 'auto_verified') AND 
     (OLD.verification_status IS NULL OR OLD.verification_status NOT IN ('verified', 'auto_verified')) THEN
    
    UPDATE public.badges
    SET current_award_count = COALESCE(current_award_count, 0) + 1
    WHERE id = NEW.badge_id;
    
    -- Also update user_badges table if exists
    INSERT INTO public.user_badges (user_id, badge_id, earned_at, progress)
    VALUES (NEW.user_id, NEW.badge_id, NEW.awarded_at, 100)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: increment_report_download(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_report_download() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE esg_reports
  SET download_count = download_count + 1
  WHERE id = NEW.report_id;
  RETURN NEW;
END;
$$;


--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin(user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT public.is_admin_raw(user_uuid);
$$;


--
-- Name: is_admin_raw(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin_raw(user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'super_admin')
  );
$$;


--
-- Name: is_campaign_creator(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_campaign_creator(campaign_uuid uuid, user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = campaign_uuid
      AND creator_id = user_uuid
  );
$$;


--
-- Name: is_campaign_participant(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_campaign_participant(campaign_uuid uuid, user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_participants
    WHERE campaign_id = campaign_uuid
      AND user_id = user_uuid
  );
$$;


--
-- Name: is_group_admin(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_group_admin(p_user_id uuid, p_group_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM groups
    WHERE id = p_group_id AND admin_id = p_user_id
  )
$$;


--
-- Name: is_group_member(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_group_member(p_user_id uuid, p_group_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members
    WHERE user_id = p_user_id AND group_id = p_group_id
  )
$$;


--
-- Name: is_group_public(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_group_public(p_group_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM groups
    WHERE id = p_group_id AND is_private = false
  )
$$;


--
-- Name: is_org_admin(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_org_admin(org_uuid uuid, user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = org_uuid
      AND user_id = user_uuid
      AND role IN ('admin', 'owner', 'manager')
      AND is_active = true
  );
$$;


--
-- Name: is_org_member(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_org_member(org_uuid uuid, user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = org_uuid
      AND user_id = user_uuid
      AND is_active = true
  );
$$;


--
-- Name: is_organization_admin(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_organization_admin(org_id uuid, user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
      AND user_id = user_id 
      AND role = 'admin'::text 
      AND is_active = true
  )
$$;


--
-- Name: is_organization_member(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_organization_member(org_id uuid, user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id 
      AND user_id = user_uuid 
      AND is_active = true
  );
$$;


--
-- Name: is_safeguarding_staff(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_safeguarding_staff(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.safeguarding_roles
    WHERE user_id = _user_id
      AND is_active = true
  );
$$;


--
-- Name: is_user_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_user_admin(user_uuid uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = user_uuid
  );
$$;


--
-- Name: log_esg_data_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_esg_data_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Log access to sensitive ESG data for security monitoring
  INSERT INTO public.security_audit_log (
    user_id, 
    action_type, 
    severity, 
    details
  ) VALUES (
    auth.uid(),
    'esg_data_access',
    'info',
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'organization_id', COALESCE(NEW.organization_id, OLD.organization_id),
      'operation', TG_OP,
      'timestamp', now()
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;


--
-- Name: log_message_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_message_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Log message access for security monitoring
  INSERT INTO public.message_access_log (
    user_id, 
    message_id, 
    access_type,
    ip_address
  ) VALUES (
    auth.uid(),
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    inet_client_addr()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;


--
-- Name: log_verification_action(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_verification_action() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Log the verification action
  INSERT INTO public.esg_verification_audit_log (
    contribution_id,
    action_type,
    performed_by,
    notes,
    previous_status,
    new_status
  ) VALUES (
    NEW.id,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'submitted'
      WHEN OLD.verification_status = 'pending' AND NEW.verification_status = 'approved' THEN 'approved'
      WHEN OLD.verification_status = 'pending' AND NEW.verification_status = 'rejected' THEN 'rejected'
      WHEN OLD.verification_status = 'pending' AND NEW.verification_status = 'needs_revision' THEN 'revision_requested'
      WHEN OLD.verification_status = 'needs_revision' AND NEW.verification_status = 'pending' THEN 'resubmitted'
      ELSE 'submitted'
    END,
    COALESCE(NEW.verified_by, auth.uid()),
    NEW.verification_notes,
    OLD.verification_status,
    NEW.verification_status
  );
  
  RETURN NEW;
END;
$$;


--
-- Name: match_safe_space_helper(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.match_safe_space_helper(p_requester_id uuid, p_issue_category text, p_urgency_level text DEFAULT 'medium'::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_helper_id uuid;
  v_session_id uuid;
  v_queue_position int;
BEGIN
  SELECT user_id INTO v_helper_id
  FROM public.safe_space_helpers
  WHERE is_available = true
    AND verification_status = 'verified'
    AND current_sessions < max_concurrent_sessions
    AND user_id != p_requester_id
    AND (p_issue_category = ANY(specializations) OR 'general' = ANY(specializations))
  ORDER BY 
    CASE WHEN p_issue_category = ANY(specializations) THEN 0 ELSE 1 END,
    trust_score DESC NULLS LAST,
    current_sessions ASC,
    last_active DESC NULLS LAST
  LIMIT 1;

  IF v_helper_id IS NOT NULL THEN
    INSERT INTO public.safe_space_sessions (requester_id, helper_id, issue_category, urgency_level, status)
    VALUES (p_requester_id, v_helper_id, p_issue_category, p_urgency_level, 'active')
    RETURNING id INTO v_session_id;

    UPDATE public.safe_space_helpers
    SET current_sessions = current_sessions + 1, last_active = now()
    WHERE user_id = v_helper_id;

    INSERT INTO public.notifications (recipient_id, type, title, message, priority)
    VALUES (v_helper_id, 'safe_space_session', 'New Support Session', 'Someone needs your help.', 
      CASE WHEN p_urgency_level = 'high' THEN 'urgent' ELSE 'high' END);

    RETURN v_session_id;
  ELSE
    SELECT COALESCE(MAX(position_in_queue), 0) + 1 INTO v_queue_position
    FROM public.safe_space_queue WHERE matched_at IS NULL;

    INSERT INTO public.safe_space_queue (requester_id, issue_category, urgency_level, position_in_queue)
    VALUES (p_requester_id, p_issue_category, p_urgency_level, v_queue_position);

    RETURN NULL;
  END IF;
END;
$$;


--
-- Name: notify_badge_award(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_badge_award() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_badge RECORD;
BEGIN
  -- Only notify on verified badges
  IF NEW.verification_status IN ('verified', 'auto_verified') AND
     (OLD.verification_status IS NULL OR OLD.verification_status NOT IN ('verified', 'auto_verified')) THEN
    
    SELECT * INTO v_badge FROM public.badges WHERE id = NEW.badge_id;
    
    INSERT INTO public.notifications (
      recipient_id,
      type,
      title,
      message,
      priority,
      metadata
    ) VALUES (
      NEW.user_id,
      'badge_awarded',
      'New Badge Earned! ???????',
      'Congratulations! You''ve earned the "' || v_badge.name || '" badge',
      CASE 
        WHEN v_badge.rarity = 'legendary' THEN 'high'
        WHEN v_badge.limited_edition THEN 'high'
        ELSE 'normal'
      END,
      jsonb_build_object(
        'badge_id', NEW.badge_id,
        'badge_name', v_badge.name,
        'badge_icon', v_badge.icon,
        'rarity', v_badge.rarity,
        'limited_edition', v_badge.limited_edition,
        'award_log_id', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: notify_contribution_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_contribution_status() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  contributor_user UUID;
  indicator_name_var TEXT;
BEGIN
  -- Get contributor and indicator info
  SELECT 
    sdc.contributor_user_id,
    ei.name
  INTO contributor_user, indicator_name_var
  FROM public.stakeholder_data_contributions sdc
  JOIN public.esg_data_requests edr ON sdc.data_request_id = edr.id
  JOIN public.esg_indicators ei ON edr.indicator_id = ei.id
  WHERE sdc.id = NEW.id;

  -- Notify contributor on verification status change
  IF NEW.verification_status != OLD.verification_status AND NEW.verification_status IN ('verified', 'rejected') THEN
    INSERT INTO public.notifications (recipient_id, type, title, message, priority, metadata)
    VALUES (
      contributor_user,
      'esg_verification',
      CASE 
        WHEN NEW.verification_status = 'verified' THEN 'Data Contribution Approved'
        ELSE 'Data Contribution Needs Revision'
      END,
      CASE 
        WHEN NEW.verification_status = 'verified' THEN 'Your submission for "' || indicator_name_var || '" has been approved'
        ELSE 'Your submission for "' || indicator_name_var || '" needs revision: ' || COALESCE(NEW.verification_notes, 'Please review')
      END,
      CASE WHEN NEW.verification_status = 'verified' THEN 'normal' ELSE 'high' END,
      jsonb_build_object(
        'contribution_id', NEW.id,
        'verification_status', NEW.verification_status,
        'indicator_name', indicator_name_var
      )
    );
  END IF;

  RETURN NEW;
END;
$$;


--
-- Name: notify_esg_milestone(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_esg_milestone() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  milestone_percentage INTEGER;
  org_admins UUID[];
BEGIN
  -- Check if progress crossed a milestone (25%, 50%, 75%, 100%)
  IF NEW.progress_percentage >= 25 AND OLD.progress_percentage < 25 THEN
    milestone_percentage := 25;
  ELSIF NEW.progress_percentage >= 50 AND OLD.progress_percentage < 50 THEN
    milestone_percentage := 50;
  ELSIF NEW.progress_percentage >= 75 AND OLD.progress_percentage < 75 THEN
    milestone_percentage := 75;
  ELSIF NEW.progress_percentage >= 100 AND OLD.progress_percentage < 100 THEN
    milestone_percentage := 100;
  ELSE
    RETURN NEW;
  END IF;

  -- Get organization admins
  SELECT ARRAY_AGG(user_id) INTO org_admins
  FROM public.organization_members
  WHERE organization_id = NEW.organization_id
    AND role IN ('admin', 'owner', 'manager')
    AND is_active = true;

  -- Create notifications for each admin
  IF org_admins IS NOT NULL THEN
    INSERT INTO public.notifications (recipient_id, type, title, message, priority, metadata)
    SELECT 
      unnest(org_admins),
      'esg_milestone',
      'ESG Initiative Milestone Reached',
      'Initiative "' || NEW.initiative_name || '" has reached ' || milestone_percentage || '% completion',
      CASE WHEN milestone_percentage = 100 THEN 'high' ELSE 'normal' END,
      jsonb_build_object(
        'initiative_id', NEW.id,
        'milestone', milestone_percentage,
        'initiative_name', NEW.initiative_name
      );
  END IF;

  -- Auto-generate report at 100%
  IF milestone_percentage = 100 AND NEW.status = 'collecting' THEN
    UPDATE public.esg_initiatives
    SET status = 'reviewing'
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;


--
-- Name: notify_feedback_status_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_feedback_status_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_priority TEXT := 'normal';
BEGIN
  -- Only create notification if status or admin_notes changed
  IF (OLD.status IS DISTINCT FROM NEW.status) OR (OLD.admin_notes IS DISTINCT FROM NEW.admin_notes) THEN
    
    -- Determine notification content based on new status
    CASE NEW.status
      WHEN 'in_review' THEN
        notification_title := 'Feedback Acknowledged';
        notification_message := 'We''re looking into your feedback: "' || NEW.title || '"';
        notification_priority := 'normal';
      
      WHEN 'in_progress' THEN
        notification_title := 'Work Started';
        notification_message := 'We''ve started working on your feedback: "' || NEW.title || '"';
        notification_priority := 'high';
      
      WHEN 'resolved' THEN
        notification_title := 'Issue Resolved! ????';
        notification_message := 'Great news! We''ve addressed your feedback: "' || NEW.title || '"' || 
          CASE WHEN NEW.admin_notes IS NOT NULL THEN '. ' || NEW.admin_notes ELSE '' END;
        notification_priority := 'high';
      
      WHEN 'wont_fix' THEN
        notification_title := 'Feedback Response';
        notification_message := 'Thanks for your feedback: "' || NEW.title || '"' || 
          CASE WHEN NEW.admin_notes IS NOT NULL THEN '. ' || NEW.admin_notes ELSE '. We appreciate you taking the time to share this.' END;
        notification_priority := 'normal';
      
      ELSE
        -- Don't create notification for 'new' status or unknown statuses
        RETURN NEW;
    END CASE;
    
    -- Insert notification
    INSERT INTO public.notifications (
      recipient_id,
      type,
      title,
      message,
      priority,
      action_url,
      action_type,
      metadata
    ) VALUES (
      NEW.user_id,
      'feedback_status_update',
      notification_title,
      notification_message,
      notification_priority,
      '/admin/feedback',
      'view',
      jsonb_build_object(
        'feedback_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'feedback_type', NEW.feedback_type
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: notify_new_demo_request(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_demo_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Create notification for all admins
  INSERT INTO public.notifications (
    recipient_id,
    type,
    title,
    message,
    priority,
    action_url,
    action_type,
    metadata
  )
  SELECT 
    ar.user_id,
    'demo_request',
    'New Demo Request',
    NEW.full_name || ' from ' || COALESCE(NEW.company_name, 'an organization') || ' has requested a demo',
    CASE WHEN NEW.priority = 'urgent' THEN 'high' ELSE 'normal' END,
    '/admin/demo-requests',
    'view',
    jsonb_build_object(
      'demo_request_id', NEW.id,
      'email', NEW.email,
      'company', NEW.company_name
    )
  FROM admin_roles ar
  WHERE ar.role = 'admin';
  
  -- Log the creation
  INSERT INTO public.demo_request_activity_log (
    demo_request_id,
    actor_id,
    action_type,
    new_value,
    notes
  ) VALUES (
    NEW.id,
    NULL,
    'created',
    jsonb_build_object(
      'full_name', NEW.full_name,
      'email', NEW.email,
      'company_name', NEW.company_name,
      'status', NEW.status,
      'priority', NEW.priority
    ),
    'Demo request submitted from ' || NEW.source
  );
  
  RETURN NEW;
END;
$$;


--
-- Name: notify_volunteer_work_logged(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_volunteer_work_logged() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  recipient_uuid UUID;
  volunteer_name TEXT;
  skill_name TEXT;
BEGIN
  -- Only process if this is volunteer work with pending confirmation
  IF NEW.activity_type = 'volunteer_work' AND NEW.confirmation_status = 'pending' THEN
    -- Get the recipient (either org admin or post author)
    recipient_uuid := public.get_volunteer_work_recipient(NEW.id);
    
    IF recipient_uuid IS NOT NULL THEN
      -- Get volunteer name
      SELECT COALESCE(first_name || ' ' || last_name, 'A volunteer')
      INTO volunteer_name
      FROM profiles
      WHERE id = NEW.user_id;
      
      -- Get skill name from metadata
      skill_name := COALESCE((NEW.metadata->>'skill_name')::TEXT, 'professional skill');
      
      -- Create notification in volunteer_work_notifications table
      INSERT INTO volunteer_work_notifications (
        activity_id,
        recipient_id,
        volunteer_id,
        notification_type,
        metadata
      ) VALUES (
        NEW.id,
        recipient_uuid,
        NEW.user_id,
        'confirmation_request',
        jsonb_build_object(
          'hours', NEW.hours_contributed,
          'market_value', NEW.market_value_gbp,
          'points', NEW.points_earned,
          'skill_name', skill_name
        )
      );
      
      -- Create notification in main notifications table
      INSERT INTO notifications (
        recipient_id,
        type,
        title,
        message,
        priority,
        action_url,
        metadata
      ) VALUES (
        recipient_uuid,
        'volunteer_confirmation',
        'Volunteer Work Needs Confirmation',
        volunteer_name || ' has logged ' || NEW.hours_contributed || ' hours of ' || skill_name || ' volunteer work worth ??' || NEW.market_value_gbp || '. Please review and confirm.',
        'high',
        '/dashboard?tab=volunteer-confirmations',
        jsonb_build_object(
          'activity_id', NEW.id,
          'volunteer_id', NEW.user_id,
          'hours', NEW.hours_contributed,
          'points', NEW.points_earned
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: notify_volunteer_work_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_volunteer_work_status() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  confirmer_name TEXT;
  skill_name TEXT;
BEGIN
  -- Only notify on status changes
  IF NEW.confirmation_status != OLD.confirmation_status AND NEW.confirmation_status IN ('confirmed', 'rejected') THEN
    -- Get confirmer name
    IF NEW.confirmed_by IS NOT NULL THEN
      SELECT COALESCE(first_name || ' ' || last_name, 'Someone')
      INTO confirmer_name
      FROM profiles
      WHERE id = NEW.confirmed_by;
    ELSE
      confirmer_name := 'The recipient';
    END IF;
    
    -- Get skill name from metadata
    skill_name := COALESCE((NEW.metadata->>'skill_name')::TEXT, 'volunteer work');
    
    -- Create notification in volunteer_work_notifications table
    INSERT INTO volunteer_work_notifications (
      activity_id,
      recipient_id,
      volunteer_id,
      notification_type,
      metadata
    ) VALUES (
      NEW.id,
      NEW.user_id,
      NEW.confirmed_by,
      NEW.confirmation_status,
      jsonb_build_object(
        'hours', NEW.hours_contributed,
        'rejection_reason', NEW.rejection_reason,
        'points', NEW.points_earned
      )
    );
    
    -- Create notification in main notifications table
    IF NEW.confirmation_status = 'confirmed' THEN
      INSERT INTO notifications (
        recipient_id,
        type,
        title,
        message,
        priority,
        action_url,
        metadata
      ) VALUES (
        NEW.user_id,
        'volunteer_confirmed',
        'Volunteer Work Confirmed! ???',
        confirmer_name || ' confirmed your ' || NEW.hours_contributed || ' hours of ' || skill_name || '. You earned ' || NEW.points_earned || ' points!',
        'normal',
        '/dashboard?tab=points',
        jsonb_build_object(
          'activity_id', NEW.id,
          'confirmed_by', NEW.confirmed_by,
          'hours', NEW.hours_contributed,
          'points', NEW.points_earned
        )
      );
    ELSE
      INSERT INTO notifications (
        recipient_id,
        type,
        title,
        message,
        priority,
        action_url,
        metadata
      ) VALUES (
        NEW.user_id,
        'volunteer_rejected',
        'Volunteer Work Not Confirmed',
        confirmer_name || ' could not confirm your ' || NEW.hours_contributed || ' hours of ' || skill_name || '. ' || COALESCE('Reason: ' || NEW.rejection_reason, 'No reason provided.'),
        'normal',
        '/dashboard?tab=volunteer-confirmations',
        jsonb_build_object(
          'activity_id', NEW.id,
          'confirmed_by', NEW.confirmed_by,
          'rejection_reason', NEW.rejection_reason
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: on_helper_availability_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.on_helper_availability_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.is_available = true AND (OLD.is_available = false OR OLD.is_available IS NULL) THEN
    PERFORM public.process_safe_space_queue();
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: p2p_messages_broadcast_trigger(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.p2p_messages_broadcast_trigger() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public'
    AS $$
DECLARE
  a uuid;
  b uuid;
  topic text;
BEGIN
  a := COALESCE(NEW.sender_id, OLD.sender_id);
  b := COALESCE(NEW.recipient_id, OLD.recipient_id);
  IF a IS NULL OR b IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  IF a::text < b::text THEN
    topic := 'p2p:' || a::text || ':' || b::text;
  ELSE
    topic := 'p2p:' || b::text || ':' || a::text;
  END IF;
  PERFORM realtime.broadcast_changes(
    topic,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: prevent_duplicate_connections(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_duplicate_connections() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Prevent self-connections
  IF NEW.requester_id = NEW.addressee_id THEN
    RAISE EXCEPTION 'Cannot connect with yourself';
  END IF;
  
  -- Check for existing connection in either direction
  IF EXISTS (
    SELECT 1 FROM public.connections
    WHERE (requester_id = NEW.requester_id AND addressee_id = NEW.addressee_id)
       OR (requester_id = NEW.addressee_id AND addressee_id = NEW.requester_id)
  ) THEN
    RAISE EXCEPTION 'Connection already exists';
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: process_safe_space_queue(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_safe_space_queue() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_queue_entry RECORD;
  v_helper_id uuid;
  v_session_id uuid;
BEGIN
  FOR v_queue_entry IN 
    SELECT * FROM public.safe_space_queue 
    WHERE matched_at IS NULL 
    ORDER BY CASE urgency_level WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, position_in_queue ASC
  LOOP
    SELECT user_id INTO v_helper_id
    FROM public.safe_space_helpers
    WHERE is_available = true AND verification_status = 'verified'
      AND current_sessions < max_concurrent_sessions AND user_id != v_queue_entry.requester_id
      AND (v_queue_entry.issue_category = ANY(specializations) OR 'general' = ANY(specializations))
    ORDER BY CASE WHEN v_queue_entry.issue_category = ANY(specializations) THEN 0 ELSE 1 END,
      trust_score DESC NULLS LAST, current_sessions ASC
    LIMIT 1;

    IF v_helper_id IS NOT NULL THEN
      INSERT INTO public.safe_space_sessions (requester_id, helper_id, issue_category, urgency_level, status)
      VALUES (v_queue_entry.requester_id, v_helper_id, v_queue_entry.issue_category, v_queue_entry.urgency_level, 'active')
      RETURNING id INTO v_session_id;

      UPDATE public.safe_space_helpers SET current_sessions = current_sessions + 1, last_active = now()
      WHERE user_id = v_helper_id;

      UPDATE public.safe_space_queue SET matched_at = now(), matched_helper_id = v_helper_id
      WHERE id = v_queue_entry.id;

      INSERT INTO public.notifications (recipient_id, type, title, message, priority) VALUES 
        (v_helper_id, 'safe_space_session', 'New Support Session', 'Someone from the queue needs your help.', 'high'),
        (v_queue_entry.requester_id, 'safe_space_match', 'Helper Found!', 'You''ve been matched with a helper.', 'high');
    END IF;
  END LOOP;
END;
$$;


--
-- Name: process_scheduled_notifications(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_scheduled_notifications() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Insert due notifications into notifications table
  INSERT INTO public.notifications (
    recipient_id,
    sender_id,
    type,
    title,
    message,
    priority,
    action_url,
    action_type,
    metadata,
    delivery_status
  )
  SELECT
    sn.recipient_id,
    sn.sender_id,
    sn.type,
    sn.title,
    sn.message,
    sn.priority,
    sn.action_url,
    sn.action_type,
    sn.metadata,
    'pending'
  FROM public.scheduled_notifications sn
  WHERE sn.status = 'pending'
    AND sn.scheduled_for <= now();

  -- Mark scheduled notifications as sent
  UPDATE public.scheduled_notifications
  SET 
    status = 'sent',
    sent_at = now(),
    updated_at = now()
  WHERE status = 'pending'
    AND scheduled_for <= now();
END;
$$;


--
-- Name: recalculate_trust_score_on_verification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.recalculate_trust_score_on_verification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only recalculate when status changes to approved
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    PERFORM public.calculate_enhanced_trust_score(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: render_notification_template(uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.render_notification_template(template_id_input uuid, variables jsonb DEFAULT '{}'::jsonb) RETURNS TABLE(title text, message text, type text, priority text, action_type text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  template_record RECORD;
  rendered_title TEXT;
  rendered_message TEXT;
  var_key TEXT;
  var_value TEXT;
BEGIN
  -- Get template
  SELECT * INTO template_record
  FROM public.notification_templates
  WHERE id = template_id_input AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found or inactive';
  END IF;

  -- Start with template content
  rendered_title := template_record.title_template;
  rendered_message := template_record.message_template;

  -- Replace variables in title and message
  FOR var_key, var_value IN SELECT * FROM jsonb_each_text(variables)
  LOOP
    rendered_title := replace(rendered_title, '{{' || var_key || '}}', var_value);
    rendered_message := replace(rendered_message, '{{' || var_key || '}}', var_value);
  END LOOP;

  RETURN QUERY SELECT
    rendered_title,
    rendered_message,
    template_record.type,
    template_record.default_priority,
    template_record.default_action_type;
END;
$$;


--
-- Name: sync_approved_helper_application(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_approved_helper_application() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.application_status = 'approved' AND (OLD.application_status IS NULL OR OLD.application_status != 'approved') THEN
    INSERT INTO public.safe_space_helpers (
      user_id,
      specializations,
      verification_status,
      is_available,
      max_concurrent_sessions,
      languages,
      trust_score,
      id_verification_status,
      dbs_check_status
    )
    VALUES (
      NEW.user_id,
      COALESCE(NEW.preferred_specializations, ARRAY['general']),
      'verified',
      false,
      2,
      ARRAY['en'],
      50.0,
      'pending',
      'pending'
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      specializations = COALESCE(NEW.preferred_specializations, ARRAY['general']),
      verification_status = 'verified',
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: sync_helper_verification_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_helper_verification_status() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Update safe_space_helpers with latest trust score and verification statuses
  UPDATE public.safe_space_helpers sh
  SET 
    trust_score = (
      SELECT COALESCE(trust_score, 50)
      FROM public.impact_metrics
      WHERE user_id = sh.user_id
    ),
    id_verification_status = CASE
      WHEN EXISTS (
        SELECT 1 FROM public.user_verifications
        WHERE user_id = sh.user_id
        AND verification_type = 'government_id'
        AND status = 'approved'
      ) THEN 'verified'
      ELSE 'pending'
    END,
    dbs_check_status = CASE
      WHEN EXISTS (
        SELECT 1 FROM public.safe_space_verification_documents
        WHERE user_id = sh.user_id
        AND document_type = 'dbs_certificate'
        AND verification_status = 'verified'
        AND (dbs_expiry_date IS NULL OR dbs_expiry_date > CURRENT_DATE)
      ) THEN 'verified'
      ELSE 'pending'
    END,
    last_verification_check = now()
  WHERE sh.user_id = NEW.user_id;

  RETURN NEW;
END;
$$;


--
-- Name: sync_profile_email(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_profile_email() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Get email from auth.users and update profile
  UPDATE public.profiles
  SET email = (SELECT email FROM auth.users WHERE id = NEW.id)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;


--
-- Name: sync_questionnaire_to_profile(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_questionnaire_to_profile() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  interests_array text[];
  skills_array text[];
  user_location text;
  interest text;
  skill text;
BEGIN
  -- Extract interests and skills from response_data
  interests_array := COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(NEW.response_data->'interests')),
    ARRAY[]::text[]
  );
  
  skills_array := COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(NEW.response_data->'skills')),
    ARRAY[]::text[]
  );
  
  -- Extract location from personalInfo if available
  user_location := NEW.response_data->'personalInfo'->>'location';
  
  -- Update profile with user_type, interests, and skills
  UPDATE public.profiles
  SET 
    user_type = NEW.user_type,
    interests = interests_array,
    skills = skills_array,
    location = COALESCE(user_location, location),
    updated_at = now()
  WHERE id = NEW.user_id;
  
  -- Clear existing preferences for this user
  DELETE FROM public.user_preferences WHERE user_id = NEW.user_id;
  
  -- Insert interests as preferences with weight 2.0
  FOREACH interest IN ARRAY interests_array
  LOOP
    INSERT INTO public.user_preferences (user_id, preference_type, preference_value, weight)
    VALUES (NEW.user_id, 'interest', lower(interest), 2.0)
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Insert skills as preferences with weight 3.0
  FOREACH skill IN ARRAY skills_array
  LOOP
    INSERT INTO public.user_preferences (user_id, preference_type, preference_value, weight)
    VALUES (NEW.user_id, 'skill', lower(skill), 3.0)
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Insert location as preference with weight 1.5
  IF user_location IS NOT NULL AND user_location != '' THEN
    INSERT INTO public.user_preferences (user_id, preference_type, preference_value, weight)
    VALUES (NEW.user_id, 'location_preference', lower(user_location), 1.5)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: toggle_comment_like(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.toggle_comment_like(target_comment_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  existing_like_id uuid;
BEGIN
  -- Check if user already liked this comment
  SELECT id INTO existing_like_id
  FROM comment_likes
  WHERE comment_id = target_comment_id 
    AND user_id = auth.uid();
  
  IF existing_like_id IS NOT NULL THEN
    -- Unlike - remove the like
    DELETE FROM comment_likes WHERE id = existing_like_id;
    RETURN false;
  ELSE
    -- Like - add new like
    INSERT INTO comment_likes (comment_id, user_id)
    VALUES (target_comment_id, auth.uid());
    RETURN true;
  END IF;
END;
$$;


--
-- Name: toggle_post_reaction(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.toggle_post_reaction(target_post_id uuid, target_reaction_type text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  existing_reaction_id UUID;
  existing_reaction_type TEXT;
  result BOOLEAN := false;
BEGIN
  -- Check if user already has ANY reaction on this post
  SELECT id, reaction_type INTO existing_reaction_id, existing_reaction_type
  FROM public.post_reactions
  WHERE post_id = target_post_id 
    AND user_id = auth.uid();
  
  IF existing_reaction_id IS NOT NULL THEN
    -- If user clicked the same reaction, remove it (toggle off)
    IF existing_reaction_type = target_reaction_type THEN
      DELETE FROM public.post_reactions WHERE id = existing_reaction_id;
      result := false;
    ELSE
      -- If user clicked a different reaction, update it (swap reaction)
      UPDATE public.post_reactions 
      SET reaction_type = target_reaction_type, updated_at = NOW()
      WHERE id = existing_reaction_id;
      result := true;
    END IF;
  ELSE
    -- No existing reaction, add new one
    INSERT INTO public.post_reactions (post_id, user_id, reaction_type)
    VALUES (target_post_id, auth.uid(), target_reaction_type);
    result := true;
  END IF;
  
  RETURN result;
END;
$$;


--
-- Name: update_campaign_amount(uuid, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_campaign_amount(campaign_uuid uuid, donation_amount numeric) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
$$;


--
-- Name: update_esg_initiatives_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_esg_initiatives_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_goal_progress(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_goal_progress() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Update goals based on activity type
  FOR goal_record IN 
    SELECT id, target_value, current_value, category
    FROM public.impact_goals
    WHERE user_id = NEW.user_id 
      AND is_active = true
  LOOP
    -- Update helping goals
    IF goal_record.category = 'helping' AND NEW.activity_type IN ('help_provided', 'help_completed') THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(current_value + 1, target_value),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update volunteer goals  
    ELSIF goal_record.category = 'volunteer' AND NEW.activity_type = 'volunteer' THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(
            current_value + COALESCE((NEW.metadata->>'hours')::INTEGER, 1), 
            target_value
          ),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update donation goals
    ELSIF goal_record.category = 'donation' AND NEW.activity_type IN ('donation', 'recurring_donation') THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(
            current_value + COALESCE((NEW.metadata->>'amount')::NUMERIC, 0), 
            target_value
          ),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update networking goals
    ELSIF goal_record.category = 'networking' AND NEW.activity_type = 'connection' THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(current_value + 1, target_value),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update engagement goals
    ELSIF goal_record.category = 'engagement' AND NEW.activity_type = 'engagement' THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(current_value + 1, target_value),
          updated_at = now()
      WHERE id = goal_record.id;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_helper_session_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_helper_session_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.status = 'ended' AND OLD.status != 'ended' AND NEW.helper_id IS NOT NULL THEN
    UPDATE public.safe_space_helpers 
    SET current_sessions = GREATEST(0, current_sessions - 1)
    WHERE user_id = NEW.helper_id;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_market_value_metrics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_market_value_metrics() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.impact_metrics
  SET total_market_value_contributed = public.calculate_total_market_value(NEW.user_id),
      calculated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_organization_impact_metrics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_organization_impact_metrics() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.organization_impact_metrics (organization_id)
  VALUES (NEW.organization_id)
  ON CONFLICT (organization_id) DO UPDATE
  SET last_calculated = now(),
      updated_at = now();
  
  RETURN NEW;
END;
$$;


--
-- Name: update_privacy_settings_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_privacy_settings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_profile_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_profile_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_safe_space_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_safe_space_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_subscription_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_subscription_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: validate_organization_invitation(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_organization_invitation(token_input text) RETURNS TABLE(invitation_id uuid, organization_id uuid, email text, role text, title text, invited_by uuid, expires_at timestamp with time zone, is_valid boolean)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_action_log; Type: TABLE; Schema: public; Owner: -
--