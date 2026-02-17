--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


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

CREATE TABLE public.admin_action_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    action_type text NOT NULL,
    target_user_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    granted_by uuid,
    granted_at timestamp with time zone DEFAULT now()
);


--
-- Name: advertising_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.advertising_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organisation_id uuid,
    payment_id uuid,
    ad_type text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    content jsonb DEFAULT '{}'::jsonb,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_endpoint_rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_endpoint_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    endpoint_name text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: badge_award_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badge_award_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    badge_id uuid NOT NULL,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL,
    awarded_by uuid,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    evidence_submitted jsonb DEFAULT '{}'::jsonb,
    contribution_details jsonb DEFAULT '{}'::jsonb,
    campaign_id uuid,
    activity_ids uuid[],
    revoked_at timestamp with time zone,
    revoked_by uuid,
    revocation_reason text,
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT badge_award_log_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'auto_verified'::text])))
);


--
-- Name: TABLE badge_award_log; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.badge_award_log IS 'Audit trail for all badge awards, includes verification status and anti-gaming measures';


--
-- Name: badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    color text NOT NULL,
    requirement_type text NOT NULL,
    requirement_value integer NOT NULL,
    rarity text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    campaign_id uuid,
    event_identifier text,
    availability_window_start timestamp with time zone,
    availability_window_end timestamp with time zone,
    limited_edition boolean DEFAULT false,
    max_awards integer,
    current_award_count integer DEFAULT 0,
    verification_required boolean DEFAULT false,
    evidence_requirements jsonb DEFAULT '{}'::jsonb,
    cooldown_hours integer,
    max_per_user integer DEFAULT 1,
    badge_category text DEFAULT 'achievement'::text,
    CONSTRAINT badges_badge_category_check CHECK ((badge_category = ANY (ARRAY['achievement'::text, 'campaign'::text, 'event'::text, 'milestone'::text, 'recognition'::text]))),
    CONSTRAINT badges_rarity_check CHECK ((rarity = ANY (ARRAY['common'::text, 'rare'::text, 'epic'::text, 'legendary'::text])))
);


--
-- Name: COLUMN badges.event_identifier; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.badges.event_identifier IS 'Unique identifier for historical events (e.g., "grenfell_2017", "7_7_2005")';


--
-- Name: COLUMN badges.limited_edition; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.badges.limited_edition IS 'Marks badges as permanently exclusive and highly valuable';


--
-- Name: COLUMN badges.verification_required; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.badges.verification_required IS 'If true, requires admin approval before badge is awarded';


--
-- Name: COLUMN badges.evidence_requirements; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.badges.evidence_requirements IS 'JSON specification of what evidence/proof is required to earn this badge';


--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    author_id uuid,
    category_id uuid,
    featured_image text,
    tags text[],
    meta_description text,
    meta_keywords text[],
    read_time integer,
    published_at timestamp with time zone,
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: business_partnerships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_partnerships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    partner_name text NOT NULL,
    partnership_type text DEFAULT 'strategic'::text NOT NULL,
    description text,
    status text DEFAULT 'active'::text NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    value numeric,
    contact_person text,
    contact_email text,
    objectives text[] DEFAULT '{}'::text[],
    deliverables text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: business_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    category text DEFAULT 'product'::text NOT NULL,
    price_range text,
    target_audience text,
    launch_date timestamp with time zone,
    status text DEFAULT 'active'::text NOT NULL,
    features text[] DEFAULT '{}'::text[],
    images text[] DEFAULT '{}'::text[],
    social_impact_statement text,
    website_url text,
    contact_email text,
    contact_phone text,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE business_products; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.business_products IS 'Business products are private - only viewable by authenticated organization members';


--
-- Name: campaign_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    total_views integer DEFAULT 0,
    unique_views integer DEFAULT 0,
    total_donations integer DEFAULT 0,
    donation_amount numeric DEFAULT 0,
    social_shares integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    conversion_rate numeric DEFAULT 0,
    bounce_rate numeric DEFAULT 0,
    avg_time_on_page integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: campaign_detailed_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_detailed_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    date date NOT NULL,
    views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    shares integer DEFAULT 0,
    donations_count integer DEFAULT 0,
    donations_amount numeric DEFAULT 0,
    new_donors integer DEFAULT 0,
    returning_donors integer DEFAULT 0,
    conversion_rate numeric DEFAULT 0,
    average_donation numeric DEFAULT 0,
    traffic_sources jsonb DEFAULT '{}'::jsonb,
    demographics jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: campaign_donations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_donations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    donor_id uuid,
    amount numeric NOT NULL,
    currency text DEFAULT 'USD'::text,
    donation_type text DEFAULT 'one_time'::text,
    source text,
    referrer_url text,
    device_type text,
    location_country text,
    location_city text,
    payment_processor text DEFAULT 'worldpay'::text,
    payment_status text DEFAULT 'pending'::text,
    is_anonymous boolean DEFAULT false,
    donor_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_donations_donation_type_check CHECK ((donation_type = ANY (ARRAY['one_time'::text, 'recurring'::text, 'anonymous'::text]))),
    CONSTRAINT campaign_donations_payment_status_check CHECK ((payment_status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])))
);


--
-- Name: campaign_engagement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_engagement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid,
    action_type text NOT NULL,
    session_id text,
    ip_address inet,
    user_agent text,
    referrer_url text,
    time_spent integer,
    device_type text,
    location_country text,
    location_city text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_engagement_action_type_check CHECK ((action_type = ANY (ARRAY['view'::text, 'share'::text, 'like'::text, 'comment'::text, 'bookmark'::text, 'report'::text])))
);


--
-- Name: campaign_geographic_impact; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_geographic_impact (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    country_code text NOT NULL,
    country_name text NOT NULL,
    city text,
    region text,
    total_donations numeric DEFAULT 0,
    donor_count integer DEFAULT 0,
    total_views integer DEFAULT 0,
    total_shares integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: campaign_interactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid NOT NULL,
    interaction_type text NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_id uuid,
    is_deleted boolean DEFAULT false,
    organization_id uuid
);


--
-- Name: COLUMN campaign_interactions.organization_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.campaign_interactions.organization_id IS 'Organization ID if the interaction was made on behalf of an organization';


--
-- Name: campaign_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    inviter_id uuid NOT NULL,
    invitee_email text NOT NULL,
    invitee_id uuid,
    invitation_type text NOT NULL,
    message text,
    status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    responded_at timestamp with time zone,
    CONSTRAINT campaign_invitations_invitation_type_check CHECK ((invitation_type = ANY (ARRAY['participant'::text, 'organizer'::text, 'supporter'::text]))),
    CONSTRAINT campaign_invitations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'expired'::text])))
);


--
-- Name: campaign_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid,
    participant_type text NOT NULL,
    role text DEFAULT 'member'::text,
    contribution_amount numeric(10,2),
    contribution_type text,
    message text,
    is_anonymous boolean DEFAULT false,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_participants_contribution_type_check CHECK ((contribution_type = ANY (ARRAY['monetary'::text, 'time'::text, 'skill'::text, 'resource'::text]))),
    CONSTRAINT campaign_participants_participant_type_check CHECK ((participant_type = ANY (ARRAY['supporter'::text, 'volunteer'::text, 'organizer'::text, 'donor'::text]))),
    CONSTRAINT campaign_participants_role_check CHECK ((role = ANY (ARRAY['member'::text, 'moderator'::text, 'admin'::text])))
);


--
-- Name: campaign_predictions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_predictions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    prediction_type text NOT NULL,
    predicted_value numeric,
    confidence_score numeric,
    prediction_date date DEFAULT CURRENT_DATE NOT NULL,
    actual_value numeric,
    model_version text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_predictions_confidence_score_check CHECK (((confidence_score >= (0)::numeric) AND (confidence_score <= (1)::numeric))),
    CONSTRAINT campaign_predictions_prediction_type_check CHECK ((prediction_type = ANY (ARRAY['goal_completion'::text, 'daily_donations'::text, 'viral_potential'::text, 'optimal_timing'::text])))
);


--
-- Name: campaign_promotions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_promotions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    promotion_type text NOT NULL,
    budget_spent numeric(10,2) DEFAULT 0,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    conversions integer DEFAULT 0,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_promotions_promotion_type_check CHECK ((promotion_type = ANY (ARRAY['featured'::text, 'boosted'::text, 'sponsored'::text])))
);


--
-- Name: campaign_social_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_social_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    platform text NOT NULL,
    metric_type text NOT NULL,
    value integer DEFAULT 0,
    date date DEFAULT CURRENT_DATE NOT NULL,
    external_post_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_social_metrics_metric_type_check CHECK ((metric_type = ANY (ARRAY['share'::text, 'like'::text, 'comment'::text, 'mention'::text, 'reach'::text, 'impression'::text]))),
    CONSTRAINT campaign_social_metrics_platform_check CHECK ((platform = ANY (ARRAY['facebook'::text, 'twitter'::text, 'instagram'::text, 'linkedin'::text, 'whatsapp'::text, 'email'::text])))
);


--
-- Name: campaign_sponsorships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_sponsorships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    sponsorship_tier text NOT NULL,
    amount_pledged numeric DEFAULT 0 NOT NULL,
    amount_paid numeric DEFAULT 0 NOT NULL,
    benefits text[] DEFAULT '{}'::text[],
    visibility_type text[] DEFAULT '{}'::text[],
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    activated_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_sponsorships_sponsorship_tier_check CHECK ((sponsorship_tier = ANY (ARRAY['bronze'::text, 'silver'::text, 'gold'::text, 'platinum'::text]))),
    CONSTRAINT campaign_sponsorships_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: campaign_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    author_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    update_type text NOT NULL,
    media_attachments jsonb DEFAULT '[]'::jsonb,
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_updates_update_type_check CHECK ((update_type = ANY (ARRAY['general'::text, 'milestone'::text, 'thank_you'::text, 'urgent'::text])))
);


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    creator_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    story text,
    category text NOT NULL,
    organization_type text NOT NULL,
    goal_type text NOT NULL,
    goal_amount numeric(12,2),
    current_amount numeric(12,2) DEFAULT 0,
    currency text DEFAULT 'USD'::text,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone,
    location text,
    urgency text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    featured_image text,
    gallery_images jsonb DEFAULT '[]'::jsonb,
    tags text[] DEFAULT ARRAY[]::text[],
    visibility text DEFAULT 'public'::text NOT NULL,
    allow_anonymous_donations boolean DEFAULT true,
    enable_comments boolean DEFAULT true,
    enable_updates boolean DEFAULT true,
    social_links jsonb DEFAULT '{}'::jsonb,
    custom_fields jsonb DEFAULT '{}'::jsonb,
    promotion_budget numeric(10,2) DEFAULT 0,
    total_views integer DEFAULT 0,
    total_shares integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    organizer text,
    exclusive_badge_id uuid,
    badge_criteria jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT campaigns_category_check CHECK ((category = ANY (ARRAY['fundraising'::text, 'volunteer'::text, 'awareness'::text, 'community'::text, 'petition'::text]))),
    CONSTRAINT campaigns_goal_type_check CHECK ((goal_type = ANY (ARRAY['monetary'::text, 'volunteers'::text, 'signatures'::text, 'participants'::text]))),
    CONSTRAINT campaigns_organization_type_check CHECK ((organization_type = ANY (ARRAY['charity'::text, 'business'::text, 'social_group'::text, 'community_group'::text, 'individual'::text]))),
    CONSTRAINT campaigns_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'paused'::text, 'completed'::text, 'cancelled'::text]))),
    CONSTRAINT campaigns_urgency_check CHECK ((urgency = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT campaigns_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'private'::text, 'invite_only'::text])))
);


--
-- Name: carbon_footprint_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carbon_footprint_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    scope_type integer NOT NULL,
    emission_source text NOT NULL,
    activity_data numeric NOT NULL,
    activity_unit text NOT NULL,
    emission_factor numeric NOT NULL,
    co2_equivalent numeric NOT NULL,
    reporting_period date NOT NULL,
    verification_status text DEFAULT 'unverified'::text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: comment_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: connections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_id uuid NOT NULL,
    addressee_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT connections_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'blocked'::text])))
);

ALTER TABLE ONLY public.connections REPLICA IDENTITY FULL;


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    contact_type text DEFAULT 'general'::text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_appeals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_appeals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid NOT NULL,
    user_id uuid NOT NULL,
    appeal_reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reported_by uuid NOT NULL,
    content_id uuid NOT NULL,
    content_type text NOT NULL,
    content_owner_id uuid,
    reason text NOT NULL,
    details text,
    status text DEFAULT 'pending'::text NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    resolution_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT content_reports_content_type_check CHECK ((content_type = ANY (ARRAY['post'::text, 'comment'::text, 'message'::text, 'profile'::text]))),
    CONSTRAINT content_reports_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'reviewing'::text, 'resolved'::text, 'dismissed'::text])))
);


--
-- Name: content_translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_translations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id text NOT NULL,
    content_type text NOT NULL,
    original_language text NOT NULL,
    target_language text NOT NULL,
    original_text text NOT NULL,
    translated_text text NOT NULL,
    translator text DEFAULT 'gemini-2.5-flash'::text,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + '30 days'::interval),
    CONSTRAINT content_translations_content_type_check CHECK ((content_type = ANY (ARRAY['post'::text, 'comment'::text])))
);


--
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    last_read_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


--
-- Name: COLUMN conversation_participants.deleted_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.conversation_participants.deleted_at IS 'Timestamp when this user hid the conversation. NULL means conversation is visible. When a new message arrives, this is set back to NULL to unhide the conversation.';


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_message_at timestamp with time zone DEFAULT now()
);


--
-- Name: corporate_partnerships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.corporate_partnerships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    company_name text NOT NULL,
    contact_person text,
    contact_email text,
    contact_phone text,
    partnership_type text,
    status text DEFAULT 'prospect'::text,
    partnership_value numeric,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    renewal_date timestamp with time zone,
    benefits_offered text,
    requirements text,
    notes text,
    documents jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: csr_initiatives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.csr_initiatives (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text DEFAULT 'community'::text NOT NULL,
    status text DEFAULT 'planning'::text NOT NULL,
    budget_allocated numeric,
    budget_spent numeric DEFAULT 0,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    target_beneficiaries integer,
    actual_beneficiaries integer DEFAULT 0,
    impact_metrics jsonb DEFAULT '{}'::jsonb,
    sdg_goals text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE csr_initiatives; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.csr_initiatives IS 'CSR initiatives are private - only viewable by authenticated organization members';


--
-- Name: csr_lead_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.csr_lead_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    post_id uuid,
    campaign_id uuid,
    action_type text NOT NULL,
    user_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT csr_lead_tracking_action_type_check CHECK ((action_type = ANY (ARRAY['view'::text, 'contact'::text, 'support'::text, 'sponsor'::text])))
);


--
-- Name: csr_opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.csr_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    post_id uuid NOT NULL,
    status text DEFAULT 'interested'::text NOT NULL,
    notes text,
    estimated_value numeric,
    actual_value numeric,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT csr_opportunities_status_check CHECK ((status = ANY (ARRAY['interested'::text, 'contacted'::text, 'committed'::text, 'completed'::text, 'declined'::text])))
);


--
-- Name: demo_request_activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_request_activity_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    demo_request_id uuid NOT NULL,
    actor_id uuid,
    action_type text NOT NULL,
    old_value jsonb,
    new_value jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT demo_request_activity_log_action_type_check CHECK ((action_type = ANY (ARRAY['created'::text, 'status_changed'::text, 'assigned'::text, 'unassigned'::text, 'rescheduled'::text, 'notes_added'::text, 'contacted'::text])))
);


--
-- Name: demo_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    company_name text,
    job_title text,
    phone_number text,
    organization_size text,
    preferred_date timestamp with time zone,
    preferred_time text,
    interest_areas text[] DEFAULT '{}'::text[],
    message text,
    status text DEFAULT 'pending'::text NOT NULL,
    priority text DEFAULT 'normal'::text,
    assigned_to uuid,
    scheduled_meeting_time timestamp with time zone,
    meeting_link text,
    meeting_duration_minutes integer DEFAULT 30,
    admin_notes text,
    follow_up_notes text,
    last_contacted_at timestamp with time zone,
    source text DEFAULT 'landing_page'::text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT demo_requests_organization_size_check CHECK ((organization_size = ANY (ARRAY['1-10'::text, '11-50'::text, '51-200'::text, '201-1000'::text, '1000+'::text]))),
    CONSTRAINT demo_requests_preferred_time_check CHECK ((preferred_time = ANY (ARRAY['morning'::text, 'afternoon'::text, 'evening'::text, 'flexible'::text]))),
    CONSTRAINT demo_requests_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT demo_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'scheduled'::text, 'completed'::text, 'cancelled'::text, 'no_show'::text]))),
    CONSTRAINT valid_email CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))
);


--
-- Name: donors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.donors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    address jsonb,
    donor_type text DEFAULT 'individual'::text,
    preferred_contact_method text DEFAULT 'email'::text,
    communication_preferences jsonb DEFAULT '{}'::jsonb,
    total_donated numeric DEFAULT 0,
    donation_count integer DEFAULT 0,
    first_donation_date timestamp with time zone,
    last_donation_date timestamp with time zone,
    average_donation numeric DEFAULT 0,
    donor_status text DEFAULT 'active'::text,
    notes text,
    tags text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: employee_engagement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_engagement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    hours_contributed integer DEFAULT 0 NOT NULL,
    impact_points integer DEFAULT 0 NOT NULL,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: esg_announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_announcements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    announcement_type text,
    target_audience jsonb DEFAULT '["all"]'::jsonb,
    published_at timestamp with time zone DEFAULT now(),
    created_by uuid NOT NULL,
    view_count integer DEFAULT 0,
    engagement_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT esg_announcements_announcement_type_check CHECK ((announcement_type = ANY (ARRAY['update'::text, 'achievement'::text, 'target'::text, 'event'::text, 'data_request'::text])))
);


--
-- Name: esg_benchmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_benchmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    industry_sector text NOT NULL,
    indicator_id uuid NOT NULL,
    benchmark_type text NOT NULL,
    value numeric NOT NULL,
    unit text,
    data_source text,
    reporting_year integer NOT NULL,
    geographical_scope text,
    sample_size integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_benchmarks_benchmark_type_check CHECK ((benchmark_type = ANY (ARRAY['industry_average'::text, 'top_quartile'::text, 'best_practice'::text, 'regulatory_minimum'::text])))
);


--
-- Name: esg_compliance_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_compliance_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    framework_id uuid,
    report_type text NOT NULL,
    reporting_period_start date NOT NULL,
    reporting_period_end date NOT NULL,
    status text DEFAULT 'draft'::text,
    generated_data jsonb DEFAULT '{}'::jsonb,
    report_url text,
    generated_by uuid,
    approved_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: esg_data_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_data_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    indicator_id uuid NOT NULL,
    reporting_period date NOT NULL,
    value numeric,
    text_value text,
    unit text,
    data_source text DEFAULT 'manual_entry'::text,
    verification_status text DEFAULT 'unverified'::text,
    supporting_documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_data_entries_verification_status_check CHECK ((verification_status = ANY (ARRAY['unverified'::text, 'internal'::text, 'third_party'::text])))
);


--
-- Name: esg_data_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_data_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    requested_from_org_id uuid,
    requested_from_email text,
    indicator_id uuid,
    framework_id uuid,
    reporting_period date NOT NULL,
    due_date timestamp with time zone,
    priority text DEFAULT 'medium'::text,
    status text DEFAULT 'pending'::text,
    request_message text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    initiative_id uuid,
    CONSTRAINT esg_data_requests_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT esg_data_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'submitted'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: esg_frameworks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_frameworks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    version text,
    description text,
    official_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: esg_goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    indicator_id uuid,
    goal_name text NOT NULL,
    description text,
    target_value numeric,
    target_unit text,
    baseline_value numeric,
    baseline_year integer,
    target_year integer NOT NULL,
    current_value numeric DEFAULT 0,
    progress_percentage numeric DEFAULT 0,
    status text DEFAULT 'active'::text,
    priority_level text DEFAULT 'medium'::text,
    category text NOT NULL,
    milestones jsonb DEFAULT '[]'::jsonb,
    responsible_team text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_goals_category_check CHECK ((category = ANY (ARRAY['environmental'::text, 'social'::text, 'governance'::text]))),
    CONSTRAINT esg_goals_priority_level_check CHECK ((priority_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT esg_goals_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'paused'::text, 'cancelled'::text])))
);


--
-- Name: esg_indicators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_indicators (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    framework_id uuid,
    indicator_code text NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    subcategory text,
    unit_of_measurement text,
    calculation_method text,
    is_quantitative boolean DEFAULT true,
    reporting_frequency text DEFAULT 'annual'::text,
    materiality_level text DEFAULT 'medium'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: esg_initiative_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_initiative_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    framework_id uuid,
    category text NOT NULL,
    description text,
    required_indicators jsonb DEFAULT '[]'::jsonb,
    suggested_stakeholder_types jsonb DEFAULT '[]'::jsonb,
    typical_duration_days integer DEFAULT 90,
    milestone_templates jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: esg_initiatives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_initiatives (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    initiative_name text NOT NULL,
    initiative_type text DEFAULT 'report'::text NOT NULL,
    framework_id uuid,
    reporting_period_start date,
    reporting_period_end date,
    due_date timestamp with time zone,
    status text DEFAULT 'planning'::text NOT NULL,
    target_stakeholder_groups jsonb DEFAULT '[]'::jsonb,
    progress_percentage integer DEFAULT 0,
    description text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_initiatives_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);


--
-- Name: esg_recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    recommendation_type text NOT NULL,
    priority_score numeric DEFAULT 50,
    title text NOT NULL,
    description text NOT NULL,
    recommended_actions jsonb DEFAULT '[]'::jsonb,
    potential_impact text,
    implementation_effort text DEFAULT 'medium'::text,
    estimated_cost_range text,
    related_indicators jsonb DEFAULT '[]'::jsonb,
    data_sources jsonb DEFAULT '[]'::jsonb,
    confidence_score numeric DEFAULT 0.7,
    status text DEFAULT 'new'::text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    implementation_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_recommendations_implementation_effort_check CHECK ((implementation_effort = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT esg_recommendations_recommendation_type_check CHECK ((recommendation_type = ANY (ARRAY['improvement'::text, 'risk_mitigation'::text, 'best_practice'::text, 'compliance'::text, 'efficiency'::text]))),
    CONSTRAINT esg_recommendations_status_check CHECK ((status = ANY (ARRAY['new'::text, 'reviewed'::text, 'accepted'::text, 'rejected'::text, 'implemented'::text])))
);


--
-- Name: esg_report_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_report_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid,
    version_number integer NOT NULL,
    snapshot_data jsonb,
    pdf_url text,
    html_url text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


--
-- Name: esg_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    report_name text NOT NULL,
    report_type text NOT NULL,
    framework_version text,
    reporting_period_start date NOT NULL,
    reporting_period_end date NOT NULL,
    status text DEFAULT 'draft'::text,
    template_data jsonb DEFAULT '{}'::jsonb,
    generated_content text,
    cover_image text,
    executive_summary text,
    created_by uuid,
    approved_by uuid,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    initiative_id uuid,
    report_version integer DEFAULT 1,
    is_final boolean DEFAULT false,
    previous_version_id uuid,
    pdf_url text,
    html_url text,
    file_size_bytes integer,
    report_format text DEFAULT 'html'::text,
    download_count integer DEFAULT 0,
    archived_at timestamp with time zone,
    CONSTRAINT esg_reports_report_type_check CHECK ((report_type = ANY (ARRAY['gri'::text, 'sasb'::text, 'tcfd'::text, 'ungc'::text, 'integrated'::text, 'custom'::text]))),
    CONSTRAINT esg_reports_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'in_review'::text, 'approved'::text, 'published'::text])))
);


--
-- Name: esg_risks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_risks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    risk_name text NOT NULL,
    risk_category text NOT NULL,
    risk_type text NOT NULL,
    description text NOT NULL,
    probability_score numeric DEFAULT 3,
    impact_score numeric DEFAULT 3,
    risk_score numeric GENERATED ALWAYS AS ((probability_score * impact_score)) STORED,
    risk_level text GENERATED ALWAYS AS (
CASE
    WHEN ((probability_score * impact_score) <= (6)::numeric) THEN 'low'::text
    WHEN ((probability_score * impact_score) <= (15)::numeric) THEN 'medium'::text
    WHEN ((probability_score * impact_score) <= (20)::numeric) THEN 'high'::text
    ELSE 'critical'::text
END) STORED,
    mitigation_strategies jsonb DEFAULT '[]'::jsonb,
    residual_risk_score numeric,
    owner_department text,
    review_frequency text DEFAULT 'quarterly'::text,
    last_reviewed date,
    next_review_date date,
    status text DEFAULT 'active'::text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_risks_impact_score_check CHECK (((impact_score >= (1)::numeric) AND (impact_score <= (5)::numeric))),
    CONSTRAINT esg_risks_probability_score_check CHECK (((probability_score >= (1)::numeric) AND (probability_score <= (5)::numeric))),
    CONSTRAINT esg_risks_risk_category_check CHECK ((risk_category = ANY (ARRAY['environmental'::text, 'social'::text, 'governance'::text]))),
    CONSTRAINT esg_risks_risk_type_check CHECK ((risk_type = ANY (ARRAY['physical'::text, 'transition'::text, 'regulatory'::text, 'reputational'::text, 'operational'::text]))),
    CONSTRAINT esg_risks_status_check CHECK ((status = ANY (ARRAY['active'::text, 'mitigated'::text, 'transferred'::text, 'accepted'::text])))
);


--
-- Name: esg_targets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_targets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    indicator_id uuid,
    target_name text NOT NULL,
    baseline_value numeric,
    target_value numeric,
    baseline_year integer,
    target_year integer,
    progress_percentage numeric DEFAULT 0,
    status text DEFAULT 'active'::text,
    description text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: esg_verification_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esg_verification_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contribution_id uuid,
    action_type text NOT NULL,
    performed_by uuid NOT NULL,
    notes text,
    previous_status text,
    new_status text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT esg_verification_audit_log_action_type_check CHECK ((action_type = ANY (ARRAY['submitted'::text, 'approved'::text, 'rejected'::text, 'revision_requested'::text, 'resubmitted'::text])))
);


--
-- Name: evidence_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_id uuid,
    evidence_type text NOT NULL,
    file_url text,
    metadata jsonb DEFAULT '{}'::jsonb,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT evidence_submissions_evidence_type_check CHECK ((evidence_type = ANY (ARRAY['photo'::text, 'video'::text, 'document'::text, 'geolocation'::text, 'timestamp'::text, 'witness_confirmation'::text]))),
    CONSTRAINT evidence_submissions_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'requires_review'::text])))
);


--
-- Name: fraud_detection_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fraud_detection_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    detection_type text NOT NULL,
    threshold_value numeric NOT NULL,
    actual_value numeric NOT NULL,
    time_window text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    risk_score numeric DEFAULT 0 NOT NULL,
    auto_flagged boolean DEFAULT false,
    reviewed boolean DEFAULT false,
    reviewer_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fraud_detection_log_detection_type_check CHECK ((detection_type = ANY (ARRAY['point_burst'::text, 'pattern_farming'::text, 'rapid_actions'::text, 'suspicious_timing'::text, 'location_anomaly'::text])))
);


--
-- Name: grants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    funder_name text NOT NULL,
    grant_title text NOT NULL,
    amount_requested numeric,
    amount_awarded numeric,
    application_deadline timestamp with time zone,
    decision_date timestamp with time zone,
    project_start_date timestamp with time zone,
    project_end_date timestamp with time zone,
    status text DEFAULT 'researching'::text,
    application_status text DEFAULT 'not_submitted'::text,
    grant_type text,
    focus_area text,
    eligibility_requirements text,
    application_requirements text,
    notes text,
    documents jsonb DEFAULT '[]'::jsonb,
    reporting_requirements text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: group_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT group_members_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'moderator'::text, 'member'::text])))
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    cover_image text,
    category text NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    location text,
    tags text[] DEFAULT ARRAY[]::text[],
    admin_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: help_completion_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.help_completion_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    helper_id uuid NOT NULL,
    requester_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    helper_message text,
    feedback_rating integer,
    feedback_message text,
    completion_evidence jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    CONSTRAINT help_completion_requests_feedback_rating_check CHECK (((feedback_rating >= 1) AND (feedback_rating <= 5))),
    CONSTRAINT help_completion_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: impact_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.impact_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    points_earned integer DEFAULT 0 NOT NULL,
    description text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    effort_level integer DEFAULT 1,
    requires_evidence boolean DEFAULT false,
    evidence_submitted boolean DEFAULT false,
    risk_score numeric DEFAULT 0,
    auto_verified boolean DEFAULT true,
    skill_category_id uuid,
    hours_contributed numeric DEFAULT 0,
    market_rate_used numeric DEFAULT 0,
    market_value_gbp numeric DEFAULT 0,
    points_conversion_rate numeric DEFAULT 0.5,
    organization_id uuid,
    post_id uuid,
    confirmed_by uuid,
    confirmation_status text DEFAULT 'pending'::text,
    confirmed_at timestamp with time zone,
    rejection_reason text,
    confirmation_requested_at timestamp with time zone DEFAULT now(),
    points_state text DEFAULT 'active'::text,
    trust_score_at_award integer DEFAULT 0,
    CONSTRAINT check_volunteer_recipient CHECK (((activity_type <> 'volunteer_work'::text) OR (((organization_id IS NOT NULL) AND (post_id IS NULL)) OR ((organization_id IS NULL) AND (post_id IS NOT NULL))))),
    CONSTRAINT impact_activities_confirmation_status_check CHECK ((confirmation_status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'rejected'::text]))),
    CONSTRAINT impact_activities_effort_level_check CHECK (((effort_level >= 1) AND (effort_level <= 5))),
    CONSTRAINT impact_activities_points_state_check CHECK ((points_state = ANY (ARRAY['active'::text, 'pending'::text, 'escrow'::text, 'reversed'::text])))
);

ALTER TABLE ONLY public.impact_activities REPLICA IDENTITY FULL;


--
-- Name: COLUMN impact_activities.evidence_submitted; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.evidence_submitted IS 'Whether evidence has been submitted for verification';


--
-- Name: COLUMN impact_activities.skill_category_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.skill_category_id IS 'Reference to the professional skill used for volunteer work';


--
-- Name: COLUMN impact_activities.hours_contributed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.hours_contributed IS 'Number of hours contributed for this activity';


--
-- Name: COLUMN impact_activities.market_rate_used; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.market_rate_used IS 'Market rate per hour (in GBP) used for point calculation';


--
-- Name: COLUMN impact_activities.market_value_gbp; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.market_value_gbp IS 'Total market value calculated (hours ?? rate)';


--
-- Name: COLUMN impact_activities.points_conversion_rate; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.points_conversion_rate IS 'Conversion rate from market value to points (default 0.5)';


--
-- Name: COLUMN impact_activities.organization_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.organization_id IS 'Organization for which volunteer work was done';


--
-- Name: COLUMN impact_activities.post_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.post_id IS 'Help post/request for which volunteer work was done';


--
-- Name: COLUMN impact_activities.confirmed_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.confirmed_by IS 'User who confirmed the volunteer work (org admin or post author)';


--
-- Name: COLUMN impact_activities.confirmation_status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.confirmation_status IS 'Status of confirmation: pending, confirmed, rejected';


--
-- Name: COLUMN impact_activities.confirmed_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.confirmed_at IS 'When the volunteer work was confirmed';


--
-- Name: COLUMN impact_activities.rejection_reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.impact_activities.rejection_reason IS 'Reason for rejection (if applicable)';


--
-- Name: impact_goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.impact_goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    target_value integer NOT NULL,
    current_value integer DEFAULT 0,
    deadline date,
    category text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: impact_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.impact_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    impact_score integer DEFAULT 0 NOT NULL,
    trust_score integer DEFAULT 50 NOT NULL,
    help_provided_count integer DEFAULT 0,
    help_received_count integer DEFAULT 0,
    volunteer_hours integer DEFAULT 0,
    donation_amount numeric DEFAULT 0,
    connections_count integer DEFAULT 0,
    response_time_hours numeric DEFAULT 0,
    calculated_at timestamp with time zone DEFAULT now() NOT NULL,
    average_rating numeric DEFAULT 0,
    red_flag_count integer DEFAULT 0,
    last_activity_date timestamp with time zone DEFAULT now(),
    xp_points integer DEFAULT 0,
    decay_applied_count integer DEFAULT 0,
    total_market_value_contributed numeric DEFAULT 0
);

ALTER TABLE ONLY public.impact_metrics REPLICA IDENTITY FULL;


--
-- Name: language_detection_cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.language_detection_cache (
    content_hash text NOT NULL,
    detected_language text NOT NULL,
    confidence double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: materiality_assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materiality_assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    assessment_year integer NOT NULL,
    stakeholder_importance numeric NOT NULL,
    business_impact numeric NOT NULL,
    indicator_id uuid,
    priority_level text,
    stakeholder_feedback text,
    action_plan text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: message_access_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_access_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    message_id uuid NOT NULL,
    access_type text NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text'::text NOT NULL,
    file_url text,
    file_name text,
    file_size integer,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    attachment_type text,
    attachment_url text,
    attachment_name text,
    attachment_size integer,
    delivered_at timestamp with time zone,
    read_at timestamp with time zone,
    CONSTRAINT messages_message_type_check CHECK ((message_type = ANY (ARRAY['text'::text, 'image'::text, 'file'::text, 'voice'::text])))
);

ALTER TABLE ONLY public.messages REPLICA IDENTITY FULL;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true,
    unsubscribed_at timestamp with time zone
);


--
-- Name: newsletter_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    first_name text,
    interests text[],
    frequency text DEFAULT 'monthly'::text NOT NULL,
    gdpr_consent boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    unsubscribed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notification_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    notification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    event_type text NOT NULL,
    event_metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_analytics_event_type_check CHECK ((event_type = ANY (ARRAY['viewed'::text, 'clicked'::text, 'dismissed'::text, 'action_taken'::text])))
);


--
-- Name: notification_delivery_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_delivery_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    notification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    delivery_method text NOT NULL,
    delivered_at timestamp with time zone DEFAULT now(),
    opened_at timestamp with time zone,
    clicked_at timestamp with time zone,
    action_taken text,
    device_info jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_delivery_log_delivery_method_check CHECK ((delivery_method = ANY (ARRAY['in_app'::text, 'push'::text, 'email'::text])))
);


--
-- Name: notification_filters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_filters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    filter_config jsonb NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: notification_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    type text NOT NULL,
    title_template text NOT NULL,
    message_template text NOT NULL,
    default_priority text DEFAULT 'normal'::text,
    default_action_type text,
    metadata_schema jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_templates_default_priority_check CHECK ((default_priority = ANY (ARRAY['urgent'::text, 'high'::text, 'normal'::text, 'low'::text])))
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipient_id uuid NOT NULL,
    sender_id uuid,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    priority text DEFAULT 'normal'::text,
    action_url text,
    action_type text,
    grouped_with uuid,
    delivery_status text DEFAULT 'pending'::text,
    group_key text,
    read_at timestamp with time zone,
    CONSTRAINT notifications_delivery_status_check CHECK ((delivery_status = ANY (ARRAY['pending'::text, 'delivered'::text, 'read'::text, 'failed'::text]))),
    CONSTRAINT notifications_priority_check CHECK ((priority = ANY (ARRAY['urgent'::text, 'high'::text, 'normal'::text, 'low'::text]))),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['connection_request'::text, 'connection_accepted'::text, 'message'::text, 'post_interaction'::text, 'group_invitation'::text, 'campaign_update'::text, 'demo_request'::text, 'esg_milestone'::text, 'esg_verification'::text, 'esg_report_ready'::text, 'help_completion_request'::text, 'help_approved'::text, 'help_rejected'::text, 'feedback_status_update'::text])))
);

ALTER TABLE ONLY public.notifications REPLICA IDENTITY FULL;


--
-- Name: organization_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    impact_value numeric,
    beneficiaries_count integer DEFAULT 0,
    location text,
    related_campaign_id uuid,
    media_urls jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone DEFAULT now()
);


--
-- Name: organization_esg_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_esg_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    indicator_id uuid,
    reporting_period date NOT NULL,
    value numeric,
    text_value text,
    unit text,
    data_source text,
    verification_status text DEFAULT 'unverified'::text,
    notes text,
    collected_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: organization_followers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_followers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    follower_id uuid NOT NULL,
    followed_at timestamp with time zone DEFAULT now(),
    notifications_enabled boolean DEFAULT true
);


--
-- Name: organization_impact_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_impact_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    total_funds_raised numeric DEFAULT 0,
    total_people_helped integer DEFAULT 0,
    total_volunteer_hours integer DEFAULT 0,
    active_campaigns integer DEFAULT 0,
    completed_projects integer DEFAULT 0,
    carbon_offset_kg numeric DEFAULT 0,
    geographic_reach_countries integer DEFAULT 0,
    partner_organizations integer DEFAULT 0,
    last_calculated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: organization_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    title text,
    invited_by uuid NOT NULL,
    invitation_token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'::text) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    created_at timestamp with time zone DEFAULT now(),
    accepted_at timestamp with time zone,
    invitation_type text DEFAULT 'general'::text,
    esg_context jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT organization_invitations_invitation_type_check CHECK ((invitation_type = ANY (ARRAY['general'::text, 'esg_contributor'::text, 'esg_viewer'::text])))
);


--
-- Name: organization_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    title text,
    department text,
    start_date date,
    end_date date,
    is_public boolean DEFAULT true,
    is_active boolean DEFAULT true,
    verified_by uuid,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    esg_role text,
    CONSTRAINT organization_members_esg_role_check CHECK ((esg_role = ANY (ARRAY['esg_admin'::text, 'esg_contributor'::text, 'esg_viewer'::text, 'esg_approver'::text]))),
    CONSTRAINT organization_members_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'staff'::text, 'volunteer'::text, 'board_member'::text, 'supporter'::text, 'member'::text])))
);


--
-- Name: organization_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    preference_type text NOT NULL,
    preference_value text NOT NULL,
    weight numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organization_preferences_preference_type_check CHECK ((preference_type = ANY (ARRAY['cause_area'::text, 'skill_need'::text, 'volunteer_type'::text, 'geographic_focus'::text])))
);


--
-- Name: organization_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    reviewer_id uuid NOT NULL,
    rating integer NOT NULL,
    review_text text,
    reviewer_type text DEFAULT 'supporter'::text,
    is_verified boolean DEFAULT false,
    is_anonymous boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT organization_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT organization_reviews_reviewer_type_check CHECK ((reviewer_type = ANY (ARRAY['donor'::text, 'volunteer'::text, 'partner'::text, 'supporter'::text])))
);


--
-- Name: organization_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    branding jsonb DEFAULT '{}'::jsonb,
    communication_templates jsonb DEFAULT '{}'::jsonb,
    donation_settings jsonb DEFAULT '{}'::jsonb,
    volunteer_settings jsonb DEFAULT '{}'::jsonb,
    analytics_preferences jsonb DEFAULT '{}'::jsonb,
    notification_preferences jsonb DEFAULT '{}'::jsonb,
    integration_settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: organization_team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    title text,
    permissions jsonb DEFAULT '{}'::jsonb,
    invited_by uuid,
    invited_at timestamp with time zone,
    joined_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: organization_trust_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_trust_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    overall_score integer DEFAULT 50 NOT NULL,
    verification_score integer DEFAULT 0,
    transparency_score integer DEFAULT 0,
    engagement_score integer DEFAULT 0,
    esg_score integer DEFAULT 0,
    review_score integer DEFAULT 0,
    calculated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT organization_trust_scores_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100)))
);


--
-- Name: organization_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_verifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    verification_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    verified_at timestamp with time zone,
    verified_by uuid,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT organization_verifications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    organization_type text NOT NULL,
    description text,
    mission text,
    vision text,
    website text,
    location text,
    avatar_url text,
    banner_url text,
    established_year integer,
    registration_number text,
    contact_email text,
    contact_phone text,
    social_links jsonb DEFAULT '{}'::jsonb,
    tags text[] DEFAULT ARRAY[]::text[],
    is_verified boolean DEFAULT false,
    verification_status text DEFAULT 'pending'::text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organizations_organization_type_check CHECK ((organization_type = ANY (ARRAY['individual'::text, 'business'::text, 'charity'::text, 'community-group'::text, 'religious-group'::text, 'social-group'::text]))),
    CONSTRAINT organizations_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])))
);


--
-- Name: partnership_enquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partnership_enquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organisation_name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL,
    phone text,
    partnership_type text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payment_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_references (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference_code text NOT NULL,
    payment_id uuid,
    expected_amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'GBP'::text NOT NULL,
    expires_at timestamp with time zone,
    used_at timestamp with time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: platform_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    feedback_type public.feedback_type NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    page_url text,
    page_section text,
    screenshot_url text,
    browser_info jsonb DEFAULT '{}'::jsonb,
    priority public.feedback_priority DEFAULT 'medium'::public.feedback_priority,
    status public.feedback_status DEFAULT 'new'::public.feedback_status,
    admin_notes text,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: platform_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    organisation_id uuid,
    payment_type text NOT NULL,
    payment_method text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'GBP'::text NOT NULL,
    yapily_payment_id text,
    yapily_consent_id text,
    yapily_institution_id text,
    payment_reference text,
    bank_transfer_details jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    payment_date timestamp with time zone,
    reconciled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: point_decay_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.point_decay_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    points_before integer DEFAULT 0 NOT NULL,
    points_after integer DEFAULT 0 NOT NULL,
    decay_percentage numeric DEFAULT 5.0 NOT NULL,
    reason text DEFAULT 'inactivity_decay'::text NOT NULL,
    last_activity_date timestamp with time zone,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: point_redemptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.point_redemptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    reward_id text NOT NULL,
    points_cost integer NOT NULL,
    status text DEFAULT 'pending'::text,
    redeemed_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: points_configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.points_configuration (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    config_key text NOT NULL,
    config_value jsonb NOT NULL,
    description text,
    category text NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: post_interactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    interaction_type text NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_comment_id uuid,
    edited_at timestamp with time zone,
    is_deleted boolean DEFAULT false,
    organization_id uuid,
    CONSTRAINT post_interactions_interaction_type_check CHECK ((interaction_type = ANY (ARRAY['like'::text, 'love'::text, 'support'::text, 'laugh'::text, 'angry'::text, 'sad'::text, 'wow'::text, 'comment'::text, 'share'::text, 'bookmark'::text])))
);


--
-- Name: COLUMN post_interactions.organization_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.post_interactions.organization_id IS 'Organization ID if the interaction was made on behalf of an organization';


--
-- Name: post_reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_reactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reaction_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    author_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    location text,
    urgency text DEFAULT 'medium'::text NOT NULL,
    media_urls text[] DEFAULT ARRAY[]::text[],
    tags text[] DEFAULT ARRAY[]::text[],
    visibility text DEFAULT 'public'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    link_preview_url text,
    link_preview_data jsonb,
    import_source text,
    external_id text,
    import_metadata jsonb,
    imported_at timestamp with time zone,
    organization_id uuid,
    latitude numeric,
    longitude numeric,
    CONSTRAINT posts_category_check CHECK ((category = ANY (ARRAY['help-needed'::text, 'help-offered'::text, 'success-story'::text, 'announcement'::text, 'question'::text, 'recommendation'::text, 'event'::text, 'lost-found'::text]))),
    CONSTRAINT posts_urgency_check CHECK ((urgency = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT posts_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'friends'::text, 'private'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    first_name text,
    last_name text,
    phone text,
    location text,
    bio text,
    avatar_url text,
    banner_url text,
    skills text[],
    interests text[],
    website text,
    facebook text,
    twitter text,
    instagram text,
    linkedin text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    banner_type text,
    waitlist_status public.waitlist_status DEFAULT 'pending'::public.waitlist_status,
    waitlist_approved_by uuid,
    approved_at timestamp with time zone,
    waitlist_notes text,
    admin_notes text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    location_updated_at timestamp with time zone,
    location_sharing_enabled boolean DEFAULT false,
    is_founding_member boolean DEFAULT false,
    founding_member_granted_at timestamp with time zone,
    founding_member_granted_by uuid,
    user_type text DEFAULT 'individual'::text,
    email text
);

ALTER TABLE ONLY public.profiles REPLICA IDENTITY FULL;


--
-- Name: COLUMN profiles.latitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.latitude IS 'User latitude coordinate for geolocation features';


--
-- Name: COLUMN profiles.longitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.longitude IS 'User longitude coordinate for geolocation features';


--
-- Name: COLUMN profiles.location_updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.location_updated_at IS 'Last time user location was updated';


--
-- Name: COLUMN profiles.location_sharing_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.location_sharing_enabled IS 'Whether user has enabled location sharing';


--
-- Name: questionnaire_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questionnaire_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    user_type text NOT NULL,
    response_data jsonb NOT NULL,
    motivation text,
    agree_to_terms boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: rate_limit_buckets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limit_buckets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    bucket_type text NOT NULL,
    tokens integer DEFAULT 0 NOT NULL,
    max_tokens integer NOT NULL,
    refill_rate integer DEFAULT 1 NOT NULL,
    last_refill timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: recommendation_cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recommendation_cache (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    recommendation_type text NOT NULL,
    target_id uuid NOT NULL,
    confidence_score numeric NOT NULL,
    reasoning text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '24:00:00'::interval)
);


--
-- Name: red_flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.red_flags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    flag_type text NOT NULL,
    severity text DEFAULT 'medium'::text NOT NULL,
    description text NOT NULL,
    evidence jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'active'::text NOT NULL,
    flagged_by uuid,
    resolved_by uuid,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT red_flags_flag_type_check CHECK ((flag_type = ANY (ARRAY['dispute'::text, 'reversal'::text, 'suspicious_activity'::text, 'pattern_farming'::text, 'point_burst'::text, 'fake_evidence'::text]))),
    CONSTRAINT red_flags_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT red_flags_status_check CHECK ((status = ANY (ARRAY['active'::text, 'resolved'::text, 'dismissed'::text])))
);


--
-- Name: relive_stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.relive_stories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    cover_image text,
    start_date timestamp with time zone NOT NULL,
    completed_date timestamp with time zone,
    total_impact jsonb DEFAULT '{"peopleHelped": 0, "pointsEarned": 0, "emotionalImpact": "", "hoursContributed": 0}'::jsonb,
    preview_text text,
    emotions text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reporter_id uuid NOT NULL,
    reported_user_id uuid,
    reported_post_id uuid,
    report_type text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    CONSTRAINT check_reported_target CHECK ((((reported_user_id IS NOT NULL) AND (reported_post_id IS NULL)) OR ((reported_user_id IS NULL) AND (reported_post_id IS NOT NULL)))),
    CONSTRAINT reports_report_type_check CHECK ((report_type = ANY (ARRAY['spam'::text, 'harassment'::text, 'inappropriate_content'::text, 'fake_account'::text, 'other'::text]))),
    CONSTRAINT reports_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text, 'dismissed'::text])))
);


--
-- Name: safe_space_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    action_type text NOT NULL,
    resource_type text NOT NULL,
    resource_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: safe_space_emergency_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_emergency_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid,
    message_id uuid,
    alert_type text NOT NULL,
    severity text NOT NULL,
    risk_score integer,
    detected_keywords text[],
    ai_analysis jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text,
    assigned_to uuid,
    acknowledged_at timestamp with time zone,
    resolved_at timestamp with time zone,
    resolution_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT safe_space_emergency_alerts_risk_score_check CHECK (((risk_score >= 0) AND (risk_score <= 100))),
    CONSTRAINT safe_space_emergency_alerts_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT safe_space_emergency_alerts_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'acknowledged'::text, 'reviewing'::text, 'resolved'::text, 'escalated'::text])))
);


--
-- Name: safe_space_flagged_keywords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_flagged_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    keyword text NOT NULL,
    category text NOT NULL,
    severity text NOT NULL,
    requires_immediate_escalation boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT safe_space_flagged_keywords_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);


--
-- Name: safe_space_helper_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_helper_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    application_status text DEFAULT 'draft'::text NOT NULL,
    personal_statement text,
    experience_description text,
    qualifications jsonb DEFAULT '[]'::jsonb,
    reference_contacts jsonb DEFAULT '[]'::jsonb,
    availability_commitment text,
    preferred_specializations text[] DEFAULT ARRAY[]::text[],
    reviewed_by uuid,
    reviewer_notes text,
    rejection_reason text,
    submitted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT safe_space_helper_applications_application_status_check CHECK ((application_status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: safe_space_helper_training_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_helper_training_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    module_id uuid NOT NULL,
    status text DEFAULT 'not_started'::text NOT NULL,
    score integer,
    attempts integer DEFAULT 0 NOT NULL,
    time_spent_minutes integer DEFAULT 0,
    answers jsonb DEFAULT '{}'::jsonb,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_attempt_at timestamp with time zone,
    can_retry_at timestamp with time zone,
    CONSTRAINT safe_space_helper_training_progress_score_check CHECK (((score >= 0) AND (score <= 100))),
    CONSTRAINT safe_space_helper_training_progress_status_check CHECK ((status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text, 'failed'::text])))
);


--
-- Name: COLUMN safe_space_helper_training_progress.last_attempt_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.safe_space_helper_training_progress.last_attempt_at IS 'Timestamp of most recent attempt';


--
-- Name: COLUMN safe_space_helper_training_progress.can_retry_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.safe_space_helper_training_progress.can_retry_at IS 'Timestamp when user can retry after failure (if retry_delay_days is set)';


--
-- Name: safe_space_helpers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_helpers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    specializations text[] DEFAULT '{}'::text[] NOT NULL,
    is_available boolean DEFAULT false NOT NULL,
    max_concurrent_sessions integer DEFAULT 1 NOT NULL,
    current_sessions integer DEFAULT 0 NOT NULL,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    professional_credentials jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_active timestamp with time zone DEFAULT now(),
    emergency_contact_name text,
    emergency_contact_phone text,
    emergency_contact_relationship text,
    dbs_required boolean DEFAULT false,
    trust_score integer DEFAULT 0,
    id_verification_status text DEFAULT 'pending'::text,
    last_verification_check timestamp with time zone DEFAULT now()
);


--
-- Name: safe_space_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid,
    sender_role text NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '24:00:00'::interval) NOT NULL,
    encrypted_content bytea,
    is_encrypted boolean DEFAULT false
);


--
-- Name: safe_space_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_id uuid,
    issue_category text NOT NULL,
    urgency_level text DEFAULT 'medium'::text NOT NULL,
    preferred_helper_type text,
    additional_info text,
    position_in_queue integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    estimated_wait_minutes integer
);


--
-- Name: safe_space_reference_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_reference_checks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    reference_name text NOT NULL,
    reference_email text NOT NULL,
    reference_phone text,
    relationship text NOT NULL,
    verification_token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'::text) NOT NULL,
    questionnaire_responses jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    submitted_at timestamp with time zone,
    expires_at timestamp with time zone DEFAULT (now() + '14 days'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT safe_space_reference_checks_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'expired'::text])))
);


--
-- Name: safe_space_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_id uuid,
    helper_id uuid,
    session_token text NOT NULL,
    issue_category text NOT NULL,
    urgency_level text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'waiting'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    duration_minutes integer,
    feedback_rating integer,
    metadata jsonb DEFAULT '{}'::jsonb,
    session_paused boolean DEFAULT false,
    paused_reason text,
    paused_at timestamp with time zone,
    paused_by uuid
);


--
-- Name: safe_space_training_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_training_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    content_type text NOT NULL,
    content_url text,
    content_html text,
    quiz_questions jsonb DEFAULT '[]'::jsonb,
    duration_minutes integer NOT NULL,
    passing_score integer DEFAULT 80,
    order_sequence integer NOT NULL,
    is_required boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    category text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    max_attempts integer,
    retry_delay_days integer,
    question_count integer DEFAULT 0 NOT NULL,
    difficulty_level text DEFAULT 'medium'::text NOT NULL,
    CONSTRAINT safe_space_training_modules_content_type_check CHECK ((content_type = ANY (ARRAY['video'::text, 'reading'::text, 'quiz'::text, 'interactive'::text])))
);


--
-- Name: COLUMN safe_space_training_modules.quiz_questions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.safe_space_training_modules.quiz_questions IS 'Array of quiz questions with id, question, options, correct_answer, difficulty, explanation, and optional scenario fields';


--
-- Name: COLUMN safe_space_training_modules.max_attempts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.safe_space_training_modules.max_attempts IS 'Maximum number of attempts allowed (NULL = unlimited)';


--
-- Name: COLUMN safe_space_training_modules.retry_delay_days; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.safe_space_training_modules.retry_delay_days IS 'Days user must wait between failed attempts';


--
-- Name: COLUMN safe_space_training_modules.difficulty_level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.safe_space_training_modules.difficulty_level IS 'Overall difficulty: easy, medium, hard, very_hard';


--
-- Name: safe_space_verification_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safe_space_verification_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    application_id uuid,
    document_type text NOT NULL,
    file_path text NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    rejection_reason text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    dbs_certificate_number text,
    dbs_issue_date date,
    dbs_expiry_date date,
    dbs_check_level text,
    CONSTRAINT safe_space_verification_documents_dbs_check_level_check CHECK ((dbs_check_level = ANY (ARRAY['basic'::text, 'standard'::text, 'enhanced'::text]))),
    CONSTRAINT safe_space_verification_documents_document_type_check CHECK ((document_type = ANY (ARRAY['government_id'::text, 'selfie'::text, 'address_proof'::text, 'qualification_cert'::text, 'dbs_certificate'::text]))),
    CONSTRAINT safe_space_verification_documents_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])))
);


--
-- Name: safeguarding_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safeguarding_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.safeguarding_role NOT NULL,
    assigned_by uuid,
    assigned_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: scheduled_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scheduled_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid,
    recipient_id uuid NOT NULL,
    sender_id uuid,
    scheduled_for timestamp with time zone NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    priority text DEFAULT 'normal'::text,
    action_url text,
    action_type text,
    metadata jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text,
    sent_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT scheduled_notifications_priority_check CHECK ((priority = ANY (ARRAY['urgent'::text, 'high'::text, 'normal'::text, 'low'::text]))),
    CONSTRAINT scheduled_notifications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text, 'cancelled'::text])))
);


--
-- Name: seasonal_challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seasonal_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    point_multiplier numeric DEFAULT 1,
    target_categories text[] DEFAULT '{}'::text[],
    max_progress integer DEFAULT 100,
    reward_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: security_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action_type text NOT NULL,
    resource_type text,
    resource_id uuid,
    ip_address inet,
    user_agent text,
    severity text DEFAULT 'info'::text,
    details jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT security_audit_log_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);


--
-- Name: skill_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    market_rate_gbp numeric NOT NULL,
    requires_verification boolean DEFAULT false,
    evidence_required boolean DEFAULT false,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: stakeholder_data_contributions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stakeholder_data_contributions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    data_request_id uuid,
    esg_data_id uuid,
    contributor_org_id uuid,
    contributor_user_id uuid,
    contribution_status text DEFAULT 'draft'::text,
    submitted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    review_notes text,
    created_at timestamp with time zone DEFAULT now(),
    verification_status text DEFAULT 'pending'::text,
    verified_by uuid,
    verified_at timestamp with time zone,
    verification_notes text,
    revision_requested_notes text,
    supporting_documents jsonb DEFAULT '[]'::jsonb,
    draft_data jsonb DEFAULT '{}'::jsonb,
    last_saved_at timestamp with time zone DEFAULT now(),
    CONSTRAINT stakeholder_data_contributions_contribution_status_check CHECK ((contribution_status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text]))),
    CONSTRAINT stakeholder_data_contributions_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'needs_revision'::text])))
);


--
-- Name: stakeholder_engagement_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stakeholder_engagement_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    stakeholder_type text NOT NULL,
    metric_name text NOT NULL,
    metric_value numeric,
    metric_unit text,
    measurement_date date NOT NULL,
    engagement_method text,
    response_rate numeric,
    satisfaction_score numeric,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: stakeholder_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stakeholder_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    group_name text NOT NULL,
    stakeholder_type text NOT NULL,
    description text,
    engagement_methods jsonb DEFAULT '[]'::jsonb,
    contact_frequency text DEFAULT 'quarterly'::text,
    key_interests jsonb DEFAULT '[]'::jsonb,
    influence_level text DEFAULT 'medium'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT stakeholder_groups_influence_level_check CHECK ((influence_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT stakeholder_groups_stakeholder_type_check CHECK ((stakeholder_type = ANY (ARRAY['employees'::text, 'investors'::text, 'customers'::text, 'suppliers'::text, 'community'::text, 'regulators'::text, 'ngos'::text])))
);


--
-- Name: story_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.story_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    participation_type text NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT story_participants_participation_type_check CHECK ((participation_type = ANY (ARRAY['created'::text, 'helped'::text, 'received_help'::text, 'supported'::text]))),
    CONSTRAINT story_participants_role_check CHECK ((role = ANY (ARRAY['creator'::text, 'helper'::text, 'beneficiary'::text, 'supporter'::text])))
);


--
-- Name: story_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.story_updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    author_id uuid NOT NULL,
    update_type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    media_url text,
    media_type text,
    emotions text[] DEFAULT '{}'::text[],
    stats jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT story_updates_media_type_check CHECK ((media_type = ANY (ARRAY['image'::text, 'video'::text]))),
    CONSTRAINT story_updates_update_type_check CHECK ((update_type = ANY (ARRAY['progress'::text, 'completion'::text, 'impact'::text, 'reflection'::text])))
);


--
-- Name: subscription_admin_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_admin_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    target_user_id uuid NOT NULL,
    action_type text NOT NULL,
    action_details jsonb DEFAULT '{}'::jsonb,
    reason text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT subscription_admin_actions_action_type_check CHECK ((action_type = ANY (ARRAY['grant_founding_member'::text, 'revoke_founding_member'::text, 'assign_subscription'::text, 'cancel_subscription'::text, 'extend_subscription'::text])))
);


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    price_monthly numeric(10,2),
    price_annual numeric(10,2),
    features jsonb DEFAULT '[]'::jsonb,
    max_campaigns integer,
    max_team_members integer,
    white_label_enabled boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: support_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.support_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    action_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT support_actions_action_type_check CHECK ((action_type = ANY (ARRAY['volunteer'::text, 'donate_intent'::text, 'message'::text, 'share'::text]))),
    CONSTRAINT support_actions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: trust_domains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trust_domains (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    domain text NOT NULL,
    domain_score integer DEFAULT 50 NOT NULL,
    actions_count integer DEFAULT 0 NOT NULL,
    average_rating numeric DEFAULT 0,
    last_activity timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trust_domains_domain_check CHECK ((domain = ANY (ARRAY['elderly_support'::text, 'event_organization'::text, 'emergency_response'::text, 'fundraising'::text, 'community_building'::text, 'education'::text, 'environmental'::text])))
);


--
-- Name: trust_score_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trust_score_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    previous_score integer,
    new_score integer NOT NULL,
    change_reason text NOT NULL,
    verification_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tutorial_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tutorial_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    show_tutorials boolean DEFAULT true,
    dismissed_tutorials text[] DEFAULT ARRAY[]::text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: typing_indicators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.typing_indicators (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    conversation_partner_id uuid NOT NULL,
    is_typing boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.typing_indicators REPLICA IDENTITY FULL;


--
-- Name: url_previews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.url_previews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    url text NOT NULL,
    title text,
    description text,
    image_url text,
    site_name text,
    favicon text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval)
);


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    achievement_id text NOT NULL,
    unlocked_at timestamp with time zone DEFAULT now() NOT NULL,
    progress integer DEFAULT 0,
    max_progress integer DEFAULT 1,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    visibility text DEFAULT 'public'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_activities_activity_type_check CHECK ((activity_type = ANY (ARRAY['connection_request'::text, 'connection_accepted'::text, 'group_joined'::text, 'campaign_joined'::text, 'post_created'::text, 'help_offered'::text, 'help_received'::text]))),
    CONSTRAINT user_activities_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'connections'::text, 'private'::text])))
);


--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    badge_id uuid NOT NULL,
    earned_at timestamp with time zone DEFAULT now(),
    progress integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: user_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_blocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blocker_id uuid NOT NULL,
    blocked_id uuid NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_challenge_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_challenge_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    progress integer DEFAULT 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_interaction_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_interaction_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    target_user_id uuid,
    target_post_id uuid,
    interaction_type text NOT NULL,
    score_value numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_language_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_language_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    preferred_language text DEFAULT 'en'::text NOT NULL,
    auto_translate boolean DEFAULT false,
    show_translation_button boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    preference_type text NOT NULL,
    preference_value text NOT NULL,
    weight numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.user_preferences REPLICA IDENTITY FULL;


--
-- Name: user_presence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_presence (
    user_id uuid NOT NULL,
    is_online boolean DEFAULT false,
    last_seen timestamp with time zone DEFAULT now(),
    typing_to_user_id uuid,
    typing_started_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.user_presence REPLICA IDENTITY FULL;


--
-- Name: user_privacy_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_privacy_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    profile_visibility text DEFAULT 'public'::text NOT NULL,
    allow_direct_messages text DEFAULT 'everyone'::text NOT NULL,
    show_online_status boolean DEFAULT true NOT NULL,
    show_location boolean DEFAULT true NOT NULL,
    show_email boolean DEFAULT false NOT NULL,
    show_phone boolean DEFAULT false NOT NULL,
    allow_tagging boolean DEFAULT true NOT NULL,
    show_activity_feed boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_privacy_settings_allow_direct_messages_check CHECK ((allow_direct_messages = ANY (ARRAY['everyone'::text, 'friends'::text, 'verified'::text, 'none'::text]))),
    CONSTRAINT user_privacy_settings_profile_visibility_check CHECK ((profile_visibility = ANY (ARRAY['public'::text, 'friends'::text, 'private'::text])))
);


--
-- Name: user_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    organisation_id uuid,
    plan_id uuid,
    yapily_consent_id text,
    status text DEFAULT 'pending_payment'::text NOT NULL,
    billing_cycle text DEFAULT 'monthly'::text NOT NULL,
    current_period_start date,
    current_period_end date,
    next_payment_date date,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_tutorial_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_tutorial_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tutorial_type text NOT NULL,
    user_type text NOT NULL,
    steps_completed jsonb DEFAULT '[]'::jsonb,
    total_steps integer NOT NULL,
    current_step integer DEFAULT 1,
    is_completed boolean DEFAULT false,
    dismissed boolean DEFAULT false,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    last_step_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_verifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    verification_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    verification_data jsonb,
    verified_at timestamp with time zone,
    expires_at timestamp with time zone,
    verified_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    face_match_score numeric(3,2),
    liveness_check_passed boolean DEFAULT false,
    face_embedding jsonb
);

ALTER TABLE ONLY public.user_verifications REPLICA IDENTITY FULL;


--
-- Name: COLUMN user_verifications.face_match_score; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_verifications.face_match_score IS 'Facial recognition similarity score between ID photo and selfie (0.00-1.00)';


--
-- Name: COLUMN user_verifications.liveness_check_passed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_verifications.liveness_check_passed IS 'Whether the user passed liveness detection checks';


--
-- Name: COLUMN user_verifications.face_embedding; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_verifications.face_embedding IS 'Encrypted facial feature embeddings for comparison';


--
-- Name: verification_document_audit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_document_audit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    document_id uuid NOT NULL,
    accessed_by uuid NOT NULL,
    action_type text NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT verification_document_audit_action_type_check CHECK ((action_type = ANY (ARRAY['view'::text, 'download'::text, 'approve'::text, 'reject'::text])))
);


--
-- Name: verification_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    verification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    document_type text NOT NULL,
    file_path text NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    face_detected boolean DEFAULT false,
    face_quality_score numeric(3,2),
    CONSTRAINT verification_documents_document_type_check CHECK ((document_type = ANY (ARRAY['id_front'::text, 'id_back'::text, 'selfie'::text])))
);


--
-- Name: volunteer_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volunteer_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    opportunity_id uuid NOT NULL,
    user_id uuid NOT NULL,
    application_message text,
    availability text,
    relevant_experience text,
    emergency_contact jsonb,
    background_check_status text DEFAULT 'not_required'::text,
    training_status text DEFAULT 'not_required'::text,
    status text DEFAULT 'pending'::text,
    applied_at timestamp with time zone DEFAULT now(),
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    hours_logged integer DEFAULT 0
);


--
-- Name: volunteer_interests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volunteer_interests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    volunteer_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT volunteer_interests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'completed'::text])))
);


--
-- Name: volunteer_opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volunteer_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    created_by uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    requirements text,
    skills_needed text[] DEFAULT '{}'::text[],
    time_commitment text,
    location text,
    is_remote boolean DEFAULT false,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    max_volunteers integer,
    current_volunteers integer DEFAULT 0,
    status text DEFAULT 'active'::text,
    application_deadline timestamp with time zone,
    background_check_required boolean DEFAULT false,
    training_required boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: volunteer_work_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volunteer_work_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    activity_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    volunteer_id uuid NOT NULL,
    notification_type text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT volunteer_work_notifications_notification_type_check CHECK ((notification_type = ANY (ARRAY['confirmation_requested'::text, 'confirmed'::text, 'rejected'::text])))
);


--
-- Name: TABLE volunteer_work_notifications; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.volunteer_work_notifications IS 'Real-time notifications for volunteer work confirmations';


--
-- Name: white_label_purchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.white_label_purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organisation_id uuid,
    payment_id uuid,
    configuration jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    licence_start_date date,
    licence_end_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_action_log admin_action_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_action_log
    ADD CONSTRAINT admin_action_log_pkey PRIMARY KEY (id);


--
-- Name: admin_roles admin_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);


--
-- Name: admin_roles admin_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: advertising_bookings advertising_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.advertising_bookings
    ADD CONSTRAINT advertising_bookings_pkey PRIMARY KEY (id);


--
-- Name: ai_endpoint_rate_limits ai_endpoint_rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_endpoint_rate_limits
    ADD CONSTRAINT ai_endpoint_rate_limits_pkey PRIMARY KEY (id);


--
-- Name: ai_endpoint_rate_limits ai_endpoint_rate_limits_user_id_endpoint_name_window_start_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_endpoint_rate_limits
    ADD CONSTRAINT ai_endpoint_rate_limits_user_id_endpoint_name_window_start_key UNIQUE (user_id, endpoint_name, window_start);


--
-- Name: badge_award_log badge_award_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_pkey PRIMARY KEY (id);


--
-- Name: badge_award_log badge_award_log_user_id_badge_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_user_id_badge_id_key UNIQUE (user_id, badge_id);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_name_key UNIQUE (name);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_slug_key UNIQUE (slug);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: business_partnerships business_partnerships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_partnerships
    ADD CONSTRAINT business_partnerships_pkey PRIMARY KEY (id);


--
-- Name: business_products business_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_products
    ADD CONSTRAINT business_products_pkey PRIMARY KEY (id);


--
-- Name: campaign_analytics campaign_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_analytics
    ADD CONSTRAINT campaign_analytics_pkey PRIMARY KEY (id);


--
-- Name: campaign_detailed_analytics campaign_detailed_analytics_campaign_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_detailed_analytics
    ADD CONSTRAINT campaign_detailed_analytics_campaign_id_date_key UNIQUE (campaign_id, date);


--
-- Name: campaign_detailed_analytics campaign_detailed_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_detailed_analytics
    ADD CONSTRAINT campaign_detailed_analytics_pkey PRIMARY KEY (id);


--
-- Name: campaign_donations campaign_donations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_donations
    ADD CONSTRAINT campaign_donations_pkey PRIMARY KEY (id);


--
-- Name: campaign_engagement campaign_engagement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_engagement
    ADD CONSTRAINT campaign_engagement_pkey PRIMARY KEY (id);


--
-- Name: campaign_geographic_impact campaign_geographic_impact_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_geographic_impact
    ADD CONSTRAINT campaign_geographic_impact_pkey PRIMARY KEY (id);


--
-- Name: campaign_interactions campaign_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_pkey PRIMARY KEY (id);


--
-- Name: campaign_invitations campaign_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_pkey PRIMARY KEY (id);


--
-- Name: campaign_participants campaign_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_participants
    ADD CONSTRAINT campaign_participants_pkey PRIMARY KEY (id);


--
-- Name: campaign_predictions campaign_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_predictions
    ADD CONSTRAINT campaign_predictions_pkey PRIMARY KEY (id);


--
-- Name: campaign_promotions campaign_promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_promotions
    ADD CONSTRAINT campaign_promotions_pkey PRIMARY KEY (id);


--
-- Name: campaign_social_metrics campaign_social_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_social_metrics
    ADD CONSTRAINT campaign_social_metrics_pkey PRIMARY KEY (id);


--
-- Name: campaign_sponsorships campaign_sponsorships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_sponsorships
    ADD CONSTRAINT campaign_sponsorships_pkey PRIMARY KEY (id);


--
-- Name: campaign_updates campaign_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT campaign_updates_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: carbon_footprint_data carbon_footprint_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carbon_footprint_data
    ADD CONSTRAINT carbon_footprint_data_pkey PRIMARY KEY (id);


--
-- Name: comment_likes comment_likes_comment_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_comment_id_user_id_key UNIQUE (comment_id, user_id);


--
-- Name: comment_likes comment_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_pkey PRIMARY KEY (id);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: connections connections_requester_id_addressee_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_requester_id_addressee_id_key UNIQUE (requester_id, addressee_id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: content_appeals content_appeals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_appeals
    ADD CONSTRAINT content_appeals_pkey PRIMARY KEY (id);


--
-- Name: content_reports content_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_pkey PRIMARY KEY (id);


--
-- Name: content_translations content_translations_content_id_content_type_target_languag_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_translations
    ADD CONSTRAINT content_translations_content_id_content_type_target_languag_key UNIQUE (content_id, content_type, target_language);


--
-- Name: content_translations content_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_translations
    ADD CONSTRAINT content_translations_pkey PRIMARY KEY (id);


--
-- Name: conversation_participants conversation_participants_conversation_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_user_id_key UNIQUE (conversation_id, user_id);


--
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: corporate_partnerships corporate_partnerships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.corporate_partnerships
    ADD CONSTRAINT corporate_partnerships_pkey PRIMARY KEY (id);


--
-- Name: csr_initiatives csr_initiatives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_initiatives
    ADD CONSTRAINT csr_initiatives_pkey PRIMARY KEY (id);


--
-- Name: csr_lead_tracking csr_lead_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_pkey PRIMARY KEY (id);


--
-- Name: csr_opportunities csr_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_opportunities
    ADD CONSTRAINT csr_opportunities_pkey PRIMARY KEY (id);


--
-- Name: demo_request_activity_log demo_request_activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_request_activity_log
    ADD CONSTRAINT demo_request_activity_log_pkey PRIMARY KEY (id);


--
-- Name: demo_requests demo_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id);


--
-- Name: donors donors_organization_id_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donors
    ADD CONSTRAINT donors_organization_id_email_key UNIQUE (organization_id, email);


--
-- Name: donors donors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donors
    ADD CONSTRAINT donors_pkey PRIMARY KEY (id);


--
-- Name: employee_engagement employee_engagement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_engagement
    ADD CONSTRAINT employee_engagement_pkey PRIMARY KEY (id);


--
-- Name: esg_announcements esg_announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_announcements
    ADD CONSTRAINT esg_announcements_pkey PRIMARY KEY (id);


--
-- Name: esg_benchmarks esg_benchmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_benchmarks
    ADD CONSTRAINT esg_benchmarks_pkey PRIMARY KEY (id);


--
-- Name: esg_compliance_reports esg_compliance_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_pkey PRIMARY KEY (id);


--
-- Name: esg_data_entries esg_data_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_data_entries
    ADD CONSTRAINT esg_data_entries_pkey PRIMARY KEY (id);


--
-- Name: esg_data_requests esg_data_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_pkey PRIMARY KEY (id);


--
-- Name: esg_frameworks esg_frameworks_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_frameworks
    ADD CONSTRAINT esg_frameworks_code_key UNIQUE (code);


--
-- Name: esg_frameworks esg_frameworks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_frameworks
    ADD CONSTRAINT esg_frameworks_pkey PRIMARY KEY (id);


--
-- Name: esg_goals esg_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_goals
    ADD CONSTRAINT esg_goals_pkey PRIMARY KEY (id);


--
-- Name: esg_indicators esg_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_indicators
    ADD CONSTRAINT esg_indicators_pkey PRIMARY KEY (id);


--
-- Name: esg_initiative_templates esg_initiative_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_initiative_templates
    ADD CONSTRAINT esg_initiative_templates_pkey PRIMARY KEY (id);


--
-- Name: esg_initiatives esg_initiatives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_pkey PRIMARY KEY (id);


--
-- Name: esg_recommendations esg_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_recommendations
    ADD CONSTRAINT esg_recommendations_pkey PRIMARY KEY (id);


--
-- Name: esg_report_versions esg_report_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_report_versions
    ADD CONSTRAINT esg_report_versions_pkey PRIMARY KEY (id);


--
-- Name: esg_reports esg_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_reports
    ADD CONSTRAINT esg_reports_pkey PRIMARY KEY (id);


--
-- Name: esg_risks esg_risks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_risks
    ADD CONSTRAINT esg_risks_pkey PRIMARY KEY (id);


--
-- Name: esg_targets esg_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_pkey PRIMARY KEY (id);


--
-- Name: esg_verification_audit_log esg_verification_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_verification_audit_log
    ADD CONSTRAINT esg_verification_audit_log_pkey PRIMARY KEY (id);


--
-- Name: evidence_submissions evidence_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_pkey PRIMARY KEY (id);


--
-- Name: fraud_detection_log fraud_detection_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fraud_detection_log
    ADD CONSTRAINT fraud_detection_log_pkey PRIMARY KEY (id);


--
-- Name: grants grants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants
    ADD CONSTRAINT grants_pkey PRIMARY KEY (id);


--
-- Name: group_members group_members_group_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_group_id_user_id_key UNIQUE (group_id, user_id);


--
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: help_completion_requests help_completion_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.help_completion_requests
    ADD CONSTRAINT help_completion_requests_pkey PRIMARY KEY (id);


--
-- Name: impact_activities impact_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_pkey PRIMARY KEY (id);


--
-- Name: impact_goals impact_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_goals
    ADD CONSTRAINT impact_goals_pkey PRIMARY KEY (id);


--
-- Name: impact_metrics impact_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_metrics
    ADD CONSTRAINT impact_metrics_pkey PRIMARY KEY (id);


--
-- Name: impact_metrics impact_metrics_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_metrics
    ADD CONSTRAINT impact_metrics_user_id_key UNIQUE (user_id);


--
-- Name: language_detection_cache language_detection_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.language_detection_cache
    ADD CONSTRAINT language_detection_cache_pkey PRIMARY KEY (content_hash);


--
-- Name: materiality_assessments materiality_assessments_organization_id_assessment_year_ind_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_organization_id_assessment_year_ind_key UNIQUE (organization_id, assessment_year, indicator_id);


--
-- Name: materiality_assessments materiality_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_pkey PRIMARY KEY (id);


--
-- Name: message_access_log message_access_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_access_log
    ADD CONSTRAINT message_access_log_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_email_key UNIQUE (email);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: notification_analytics notification_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_analytics
    ADD CONSTRAINT notification_analytics_pkey PRIMARY KEY (id);


--
-- Name: notification_delivery_log notification_delivery_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_delivery_log
    ADD CONSTRAINT notification_delivery_log_pkey PRIMARY KEY (id);


--
-- Name: notification_filters notification_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_filters
    ADD CONSTRAINT notification_filters_pkey PRIMARY KEY (id);


--
-- Name: notification_templates notification_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: organization_activities organization_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_activities
    ADD CONSTRAINT organization_activities_pkey PRIMARY KEY (id);


--
-- Name: organization_esg_data organization_esg_data_organization_id_indicator_id_reportin_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_organization_id_indicator_id_reportin_key UNIQUE (organization_id, indicator_id, reporting_period);


--
-- Name: organization_esg_data organization_esg_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_pkey PRIMARY KEY (id);


--
-- Name: organization_followers organization_followers_organization_id_follower_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_organization_id_follower_id_key UNIQUE (organization_id, follower_id);


--
-- Name: organization_followers organization_followers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_pkey PRIMARY KEY (id);


--
-- Name: organization_impact_metrics organization_impact_metrics_organization_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_impact_metrics
    ADD CONSTRAINT organization_impact_metrics_organization_id_key UNIQUE (organization_id);


--
-- Name: organization_impact_metrics organization_impact_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_impact_metrics
    ADD CONSTRAINT organization_impact_metrics_pkey PRIMARY KEY (id);


--
-- Name: organization_invitations organization_invitations_organization_id_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invitations
    ADD CONSTRAINT organization_invitations_organization_id_email_key UNIQUE (organization_id, email);


--
-- Name: organization_invitations organization_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invitations
    ADD CONSTRAINT organization_invitations_pkey PRIMARY KEY (id);


--
-- Name: organization_members organization_members_organization_id_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_user_id_role_key UNIQUE (organization_id, user_id, role);


--
-- Name: organization_members organization_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_pkey PRIMARY KEY (id);


--
-- Name: organization_preferences organization_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_preferences
    ADD CONSTRAINT organization_preferences_pkey PRIMARY KEY (id);


--
-- Name: organization_reviews organization_reviews_organization_id_reviewer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_organization_id_reviewer_id_key UNIQUE (organization_id, reviewer_id);


--
-- Name: organization_reviews organization_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_pkey PRIMARY KEY (id);


--
-- Name: organization_settings organization_settings_organization_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_organization_id_key UNIQUE (organization_id);


--
-- Name: organization_settings organization_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_pkey PRIMARY KEY (id);


--
-- Name: organization_team_members organization_team_members_organization_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_team_members
    ADD CONSTRAINT organization_team_members_organization_id_user_id_key UNIQUE (organization_id, user_id);


--
-- Name: organization_team_members organization_team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_team_members
    ADD CONSTRAINT organization_team_members_pkey PRIMARY KEY (id);


--
-- Name: organization_trust_scores organization_trust_scores_organization_id_calculated_at_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_trust_scores
    ADD CONSTRAINT organization_trust_scores_organization_id_calculated_at_key UNIQUE (organization_id, calculated_at);


--
-- Name: organization_trust_scores organization_trust_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_trust_scores
    ADD CONSTRAINT organization_trust_scores_pkey PRIMARY KEY (id);


--
-- Name: organization_verifications organization_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_verifications
    ADD CONSTRAINT organization_verifications_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: partnership_enquiries partnership_enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partnership_enquiries
    ADD CONSTRAINT partnership_enquiries_pkey PRIMARY KEY (id);


--
-- Name: payment_references payment_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_references
    ADD CONSTRAINT payment_references_pkey PRIMARY KEY (id);


--
-- Name: payment_references payment_references_reference_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_references
    ADD CONSTRAINT payment_references_reference_code_key UNIQUE (reference_code);


--
-- Name: platform_feedback platform_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_feedback
    ADD CONSTRAINT platform_feedback_pkey PRIMARY KEY (id);


--
-- Name: platform_payments platform_payments_payment_reference_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_payment_reference_key UNIQUE (payment_reference);


--
-- Name: platform_payments platform_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_pkey PRIMARY KEY (id);


--
-- Name: point_decay_log point_decay_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_decay_log
    ADD CONSTRAINT point_decay_log_pkey PRIMARY KEY (id);


--
-- Name: point_redemptions point_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_redemptions
    ADD CONSTRAINT point_redemptions_pkey PRIMARY KEY (id);


--
-- Name: points_configuration points_configuration_config_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points_configuration
    ADD CONSTRAINT points_configuration_config_key_key UNIQUE (config_key);


--
-- Name: points_configuration points_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points_configuration
    ADD CONSTRAINT points_configuration_pkey PRIMARY KEY (id);


--
-- Name: post_interactions post_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_pkey PRIMARY KEY (id);


--
-- Name: post_reactions post_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_reactions
    ADD CONSTRAINT post_reactions_pkey PRIMARY KEY (id);


--
-- Name: post_reactions post_reactions_post_id_user_id_reaction_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_reactions
    ADD CONSTRAINT post_reactions_post_id_user_id_reaction_type_key UNIQUE (post_id, user_id, reaction_type);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: questionnaire_responses questionnaire_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questionnaire_responses
    ADD CONSTRAINT questionnaire_responses_pkey PRIMARY KEY (id);


--
-- Name: questionnaire_responses questionnaire_responses_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questionnaire_responses
    ADD CONSTRAINT questionnaire_responses_user_id_unique UNIQUE (user_id);


--
-- Name: rate_limit_buckets rate_limit_buckets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limit_buckets
    ADD CONSTRAINT rate_limit_buckets_pkey PRIMARY KEY (id);


--
-- Name: rate_limit_buckets rate_limit_buckets_user_id_bucket_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limit_buckets
    ADD CONSTRAINT rate_limit_buckets_user_id_bucket_type_key UNIQUE (user_id, bucket_type);


--
-- Name: recommendation_cache recommendation_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendation_cache
    ADD CONSTRAINT recommendation_cache_pkey PRIMARY KEY (id);


--
-- Name: recommendation_cache recommendation_cache_user_id_recommendation_type_target_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendation_cache
    ADD CONSTRAINT recommendation_cache_user_id_recommendation_type_target_id_key UNIQUE (user_id, recommendation_type, target_id);


--
-- Name: red_flags red_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_pkey PRIMARY KEY (id);


--
-- Name: relive_stories relive_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.relive_stories
    ADD CONSTRAINT relive_stories_pkey PRIMARY KEY (id);


--
-- Name: relive_stories relive_stories_post_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.relive_stories
    ADD CONSTRAINT relive_stories_post_id_key UNIQUE (post_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: safe_space_audit_log safe_space_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_audit_log
    ADD CONSTRAINT safe_space_audit_log_pkey PRIMARY KEY (id);


--
-- Name: safe_space_emergency_alerts safe_space_emergency_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_pkey PRIMARY KEY (id);


--
-- Name: safe_space_flagged_keywords safe_space_flagged_keywords_keyword_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_flagged_keywords
    ADD CONSTRAINT safe_space_flagged_keywords_keyword_key UNIQUE (keyword);


--
-- Name: safe_space_flagged_keywords safe_space_flagged_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_flagged_keywords
    ADD CONSTRAINT safe_space_flagged_keywords_pkey PRIMARY KEY (id);


--
-- Name: safe_space_helper_applications safe_space_helper_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helper_applications
    ADD CONSTRAINT safe_space_helper_applications_pkey PRIMARY KEY (id);


--
-- Name: safe_space_helper_training_progress safe_space_helper_training_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_pkey PRIMARY KEY (id);


--
-- Name: safe_space_helper_training_progress safe_space_helper_training_progress_user_id_module_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_user_id_module_id_key UNIQUE (user_id, module_id);


--
-- Name: safe_space_helpers safe_space_helpers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helpers
    ADD CONSTRAINT safe_space_helpers_pkey PRIMARY KEY (id);


--
-- Name: safe_space_messages safe_space_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_messages
    ADD CONSTRAINT safe_space_messages_pkey PRIMARY KEY (id);


--
-- Name: safe_space_queue safe_space_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_queue
    ADD CONSTRAINT safe_space_queue_pkey PRIMARY KEY (id);


--
-- Name: safe_space_reference_checks safe_space_reference_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_reference_checks
    ADD CONSTRAINT safe_space_reference_checks_pkey PRIMARY KEY (id);


--
-- Name: safe_space_reference_checks safe_space_reference_checks_verification_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_reference_checks
    ADD CONSTRAINT safe_space_reference_checks_verification_token_key UNIQUE (verification_token);


--
-- Name: safe_space_sessions safe_space_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_pkey PRIMARY KEY (id);


--
-- Name: safe_space_sessions safe_space_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_session_token_key UNIQUE (session_token);


--
-- Name: safe_space_training_modules safe_space_training_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_training_modules
    ADD CONSTRAINT safe_space_training_modules_pkey PRIMARY KEY (id);


--
-- Name: safe_space_verification_documents safe_space_verification_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_pkey PRIMARY KEY (id);


--
-- Name: safeguarding_roles safeguarding_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_pkey PRIMARY KEY (id);


--
-- Name: safeguarding_roles safeguarding_roles_unique_lead_per_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_unique_lead_per_user UNIQUE (user_id, role);


--
-- Name: safeguarding_roles safeguarding_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: scheduled_notifications scheduled_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_notifications
    ADD CONSTRAINT scheduled_notifications_pkey PRIMARY KEY (id);


--
-- Name: seasonal_challenges seasonal_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seasonal_challenges
    ADD CONSTRAINT seasonal_challenges_pkey PRIMARY KEY (id);


--
-- Name: security_audit_log security_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_audit_log
    ADD CONSTRAINT security_audit_log_pkey PRIMARY KEY (id);


--
-- Name: skill_categories skill_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_categories
    ADD CONSTRAINT skill_categories_pkey PRIMARY KEY (id);


--
-- Name: stakeholder_data_contributions stakeholder_data_contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_pkey PRIMARY KEY (id);


--
-- Name: stakeholder_engagement_metrics stakeholder_engagement_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_engagement_metrics
    ADD CONSTRAINT stakeholder_engagement_metrics_pkey PRIMARY KEY (id);


--
-- Name: stakeholder_groups stakeholder_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_groups
    ADD CONSTRAINT stakeholder_groups_pkey PRIMARY KEY (id);


--
-- Name: story_participants story_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_pkey PRIMARY KEY (id);


--
-- Name: story_participants story_participants_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_post_id_user_id_key UNIQUE (post_id, user_id);


--
-- Name: story_updates story_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_updates
    ADD CONSTRAINT story_updates_pkey PRIMARY KEY (id);


--
-- Name: subscription_admin_actions subscription_admin_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_admin_actions
    ADD CONSTRAINT subscription_admin_actions_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: support_actions support_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_actions
    ADD CONSTRAINT support_actions_pkey PRIMARY KEY (id);


--
-- Name: trust_domains trust_domains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trust_domains
    ADD CONSTRAINT trust_domains_pkey PRIMARY KEY (id);


--
-- Name: trust_domains trust_domains_user_id_domain_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trust_domains
    ADD CONSTRAINT trust_domains_user_id_domain_key UNIQUE (user_id, domain);


--
-- Name: trust_score_history trust_score_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trust_score_history
    ADD CONSTRAINT trust_score_history_pkey PRIMARY KEY (id);


--
-- Name: tutorial_preferences tutorial_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorial_preferences
    ADD CONSTRAINT tutorial_preferences_pkey PRIMARY KEY (id);


--
-- Name: tutorial_preferences tutorial_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorial_preferences
    ADD CONSTRAINT tutorial_preferences_user_id_key UNIQUE (user_id);


--
-- Name: typing_indicators typing_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.typing_indicators
    ADD CONSTRAINT typing_indicators_pkey PRIMARY KEY (id);


--
-- Name: typing_indicators typing_indicators_user_id_conversation_partner_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.typing_indicators
    ADD CONSTRAINT typing_indicators_user_id_conversation_partner_id_key UNIQUE (user_id, conversation_partner_id);


--
-- Name: url_previews url_previews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.url_previews
    ADD CONSTRAINT url_previews_pkey PRIMARY KEY (id);


--
-- Name: url_previews url_previews_url_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.url_previews
    ADD CONSTRAINT url_previews_url_key UNIQUE (url);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_user_id_badge_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_badge_id_key UNIQUE (user_id, badge_id);


--
-- Name: user_blocks user_blocks_blocker_id_blocked_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocker_id_blocked_id_key UNIQUE (blocker_id, blocked_id);


--
-- Name: user_blocks user_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_pkey PRIMARY KEY (id);


--
-- Name: user_challenge_progress user_challenge_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT user_challenge_progress_pkey PRIMARY KEY (id);


--
-- Name: user_challenge_progress user_challenge_progress_user_id_challenge_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT user_challenge_progress_user_id_challenge_id_key UNIQUE (user_id, challenge_id);


--
-- Name: user_interaction_scores user_interaction_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_pkey PRIMARY KEY (id);


--
-- Name: user_interaction_scores user_interaction_scores_user_id_target_user_id_target_post__key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_user_id_target_user_id_target_post__key UNIQUE (user_id, target_user_id, target_post_id, interaction_type);


--
-- Name: user_language_preferences user_language_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_preferences
    ADD CONSTRAINT user_language_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_language_preferences user_language_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_preferences
    ADD CONSTRAINT user_language_preferences_user_id_key UNIQUE (user_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_user_id_preference_type_preference_value_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_preference_type_preference_value_key UNIQUE (user_id, preference_type, preference_value);


--
-- Name: user_presence user_presence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_pkey PRIMARY KEY (user_id);


--
-- Name: user_privacy_settings user_privacy_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_pkey PRIMARY KEY (id);


--
-- Name: user_privacy_settings user_privacy_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_user_id_key UNIQUE (user_id);


--
-- Name: user_subscriptions user_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: user_tutorial_progress user_tutorial_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tutorial_progress
    ADD CONSTRAINT user_tutorial_progress_pkey PRIMARY KEY (id);


--
-- Name: user_verifications user_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_pkey PRIMARY KEY (id);


--
-- Name: verification_document_audit verification_document_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_document_audit
    ADD CONSTRAINT verification_document_audit_pkey PRIMARY KEY (id);


--
-- Name: verification_documents verification_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_pkey PRIMARY KEY (id);


--
-- Name: volunteer_applications volunteer_applications_opportunity_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_applications
    ADD CONSTRAINT volunteer_applications_opportunity_id_user_id_key UNIQUE (opportunity_id, user_id);


--
-- Name: volunteer_applications volunteer_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_applications
    ADD CONSTRAINT volunteer_applications_pkey PRIMARY KEY (id);


--
-- Name: volunteer_interests volunteer_interests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_pkey PRIMARY KEY (id);


--
-- Name: volunteer_interests volunteer_interests_post_id_volunteer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_post_id_volunteer_id_key UNIQUE (post_id, volunteer_id);


--
-- Name: volunteer_opportunities volunteer_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_opportunities
    ADD CONSTRAINT volunteer_opportunities_pkey PRIMARY KEY (id);


--
-- Name: volunteer_work_notifications volunteer_work_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_pkey PRIMARY KEY (id);


--
-- Name: white_label_purchases white_label_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.white_label_purchases
    ADD CONSTRAINT white_label_purchases_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_action_log_admin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_action_log_admin_id ON public.admin_action_log USING btree (admin_id);


--
-- Name: idx_admin_action_log_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_action_log_created_at ON public.admin_action_log USING btree (created_at DESC);


--
-- Name: idx_admin_action_log_target_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_action_log_target_user_id ON public.admin_action_log USING btree (target_user_id);


--
-- Name: idx_admin_roles_granted_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_roles_granted_by ON public.admin_roles USING btree (granted_by);


--
-- Name: idx_admin_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_roles_user_id ON public.admin_roles USING btree (user_id);


--
-- Name: idx_ai_endpoint_rate_limits_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_endpoint_rate_limits_user_id ON public.ai_endpoint_rate_limits USING btree (user_id);


--
-- Name: idx_ai_rate_limits_user_endpoint; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_rate_limits_user_endpoint ON public.ai_endpoint_rate_limits USING btree (user_id, endpoint_name, window_start);


--
-- Name: idx_badge_award_log_badge; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_badge_award_log_badge ON public.badge_award_log USING btree (badge_id);


--
-- Name: idx_badge_award_log_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_badge_award_log_campaign ON public.badge_award_log USING btree (campaign_id) WHERE (campaign_id IS NOT NULL);


--
-- Name: idx_badge_award_log_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_badge_award_log_status ON public.badge_award_log USING btree (verification_status);


--
-- Name: idx_badge_award_log_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_badge_award_log_user ON public.badge_award_log USING btree (user_id);


--
-- Name: idx_badges_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_badges_campaign ON public.badges USING btree (campaign_id) WHERE (campaign_id IS NOT NULL);


--
-- Name: idx_badges_event_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_badges_event_identifier ON public.badges USING btree (event_identifier) WHERE (event_identifier IS NOT NULL);


--
-- Name: idx_blog_posts_author; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_author ON public.blog_posts USING btree (author_id);


--
-- Name: idx_blog_posts_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category_id);


--
-- Name: idx_blog_posts_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_published ON public.blog_posts USING btree (published_at) WHERE (is_published = true);


--
-- Name: idx_blog_posts_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug);


--
-- Name: idx_business_partnerships_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_partnerships_org_id ON public.business_partnerships USING btree (organization_id);


--
-- Name: idx_business_products_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_products_org_id ON public.business_products USING btree (organization_id);


--
-- Name: idx_camp_part_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_camp_part_user ON public.campaign_participants USING btree (user_id);


--
-- Name: idx_campaign_analytics_campaign_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_analytics_campaign_date ON public.campaign_analytics USING btree (campaign_id, date);


--
-- Name: idx_campaign_analytics_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics USING btree (campaign_id);


--
-- Name: idx_campaign_analytics_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_analytics_date ON public.campaign_analytics USING btree (date);


--
-- Name: idx_campaign_donations_campaign_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_donations_campaign_created ON public.campaign_donations USING btree (campaign_id, created_at);


--
-- Name: idx_campaign_donations_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_donations_campaign_id ON public.campaign_donations USING btree (campaign_id);


--
-- Name: idx_campaign_donations_donor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_donations_donor_id ON public.campaign_donations USING btree (donor_id);


--
-- Name: idx_campaign_engagement_campaign_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_engagement_campaign_action ON public.campaign_engagement USING btree (campaign_id, action_type, created_at);


--
-- Name: idx_campaign_engagement_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_engagement_campaign_id ON public.campaign_engagement USING btree (campaign_id);


--
-- Name: idx_campaign_engagement_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_engagement_user_id ON public.campaign_engagement USING btree (user_id);


--
-- Name: idx_campaign_geographic_country; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_geographic_country ON public.campaign_geographic_impact USING btree (campaign_id, country_code);


--
-- Name: idx_campaign_geographic_impact_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_geographic_impact_campaign_id ON public.campaign_geographic_impact USING btree (campaign_id);


--
-- Name: idx_campaign_interactions_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_interactions_campaign_id ON public.campaign_interactions USING btree (campaign_id);


--
-- Name: idx_campaign_interactions_campaign_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_interactions_campaign_type ON public.campaign_interactions USING btree (campaign_id, interaction_type) WHERE (is_deleted = false);


--
-- Name: idx_campaign_interactions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_interactions_created_at ON public.campaign_interactions USING btree (created_at DESC);


--
-- Name: idx_campaign_interactions_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_interactions_organization_id ON public.campaign_interactions USING btree (organization_id);


--
-- Name: idx_campaign_interactions_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_interactions_parent_id ON public.campaign_interactions USING btree (parent_id);


--
-- Name: idx_campaign_interactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_interactions_user_id ON public.campaign_interactions USING btree (user_id);


--
-- Name: idx_campaign_invitations_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_invitations_campaign_id ON public.campaign_invitations USING btree (campaign_id);


--
-- Name: idx_campaign_invitations_invitee_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_invitations_invitee_email ON public.campaign_invitations USING btree (invitee_email);


--
-- Name: idx_campaign_invitations_invitee_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_invitations_invitee_id ON public.campaign_invitations USING btree (invitee_id);


--
-- Name: idx_campaign_invitations_inviter_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_invitations_inviter_id ON public.campaign_invitations USING btree (inviter_id);


--
-- Name: idx_campaign_participants_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_participants_campaign_id ON public.campaign_participants USING btree (campaign_id);


--
-- Name: idx_campaign_participants_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_participants_user ON public.campaign_participants USING btree (user_id, campaign_id);


--
-- Name: idx_campaign_participants_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_participants_user_id ON public.campaign_participants USING btree (user_id);


--
-- Name: idx_campaign_predictions_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_predictions_campaign_id ON public.campaign_predictions USING btree (campaign_id);


--
-- Name: idx_campaign_promotions_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_promotions_campaign_id ON public.campaign_promotions USING btree (campaign_id);


--
-- Name: idx_campaign_social_metrics_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_social_metrics_campaign_id ON public.campaign_social_metrics USING btree (campaign_id);


--
-- Name: idx_campaign_social_platform_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_social_platform_date ON public.campaign_social_metrics USING btree (campaign_id, platform, date);


--
-- Name: idx_campaign_sponsorships_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_sponsorships_campaign ON public.campaign_sponsorships USING btree (campaign_id);


--
-- Name: idx_campaign_sponsorships_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_sponsorships_org ON public.campaign_sponsorships USING btree (organization_id);


--
-- Name: idx_campaign_sponsorships_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_sponsorships_status ON public.campaign_sponsorships USING btree (status);


--
-- Name: idx_campaign_updates_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_updates_author_id ON public.campaign_updates USING btree (author_id);


--
-- Name: idx_campaign_updates_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_updates_campaign_id ON public.campaign_updates USING btree (campaign_id);


--
-- Name: idx_campaigns_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaigns_category ON public.campaigns USING btree (category);


--
-- Name: idx_campaigns_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaigns_creator_id ON public.campaigns USING btree (creator_id);


--
-- Name: idx_campaigns_creator_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaigns_creator_status ON public.campaigns USING btree (creator_id, status);


--
-- Name: idx_campaigns_end_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaigns_end_date ON public.campaigns USING btree (end_date);


--
-- Name: idx_campaigns_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaigns_status ON public.campaigns USING btree (status);


--
-- Name: idx_campaigns_status_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaigns_status_date ON public.campaigns USING btree (status, created_at DESC);


--
-- Name: idx_carbon_footprint_data_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_carbon_footprint_data_created_by ON public.carbon_footprint_data USING btree (created_by);


--
-- Name: idx_carbon_footprint_data_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_carbon_footprint_data_organization_id ON public.carbon_footprint_data USING btree (organization_id);


--
-- Name: idx_comment_likes_comment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comment_likes_comment ON public.comment_likes USING btree (comment_id, created_at);


--
-- Name: idx_comment_likes_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes USING btree (comment_id);


--
-- Name: idx_comment_likes_user_comment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comment_likes_user_comment ON public.comment_likes USING btree (user_id, comment_id);


--
-- Name: idx_comment_likes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comment_likes_user_id ON public.comment_likes USING btree (user_id);


--
-- Name: idx_conn_addr; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conn_addr ON public.connections USING btree (addressee_id);


--
-- Name: idx_conn_req; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conn_req ON public.connections USING btree (requester_id);


--
-- Name: idx_connections_addressee_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_connections_addressee_id ON public.connections USING btree (addressee_id);


--
-- Name: idx_connections_addressee_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_connections_addressee_status ON public.connections USING btree (addressee_id, status);


--
-- Name: idx_connections_both_users; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_connections_both_users ON public.connections USING btree (requester_id, addressee_id);


--
-- Name: idx_connections_requester_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_connections_requester_id ON public.connections USING btree (requester_id);


--
-- Name: idx_connections_requester_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_connections_requester_status ON public.connections USING btree (requester_id, status);


--
-- Name: idx_connections_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_connections_status ON public.connections USING btree (status);


--
-- Name: idx_connections_users; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_connections_users ON public.connections USING btree (requester_id, addressee_id, status);


--
-- Name: idx_contact_submissions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions USING btree (created_at DESC);


--
-- Name: idx_contact_submissions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_submissions_status ON public.contact_submissions USING btree (status);


--
-- Name: idx_content_appeals_report_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_appeals_report_id ON public.content_appeals USING btree (report_id);


--
-- Name: idx_content_appeals_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_appeals_reviewed_by ON public.content_appeals USING btree (reviewed_by);


--
-- Name: idx_content_appeals_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_appeals_user_id ON public.content_appeals USING btree (user_id);


--
-- Name: idx_content_reports_content; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_reports_content ON public.content_reports USING btree (content_id, content_type);


--
-- Name: idx_content_reports_content_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_reports_content_id ON public.content_reports USING btree (content_id);


--
-- Name: idx_content_reports_content_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_reports_content_owner_id ON public.content_reports USING btree (content_owner_id);


--
-- Name: idx_content_reports_reported_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_reports_reported_by ON public.content_reports USING btree (reported_by);


--
-- Name: idx_content_reports_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_reports_reviewed_by ON public.content_reports USING btree (reviewed_by);


--
-- Name: idx_content_reports_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_reports_status ON public.content_reports USING btree (status);


--
-- Name: idx_content_translations_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_translations_expires ON public.content_translations USING btree (expires_at);


--
-- Name: idx_content_translations_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_translations_lookup ON public.content_translations USING btree (content_id, content_type, target_language);


--
-- Name: idx_contributions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contributions_status ON public.stakeholder_data_contributions USING btree (contribution_status, verification_status);


--
-- Name: idx_contributions_verification_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contributions_verification_status ON public.stakeholder_data_contributions USING btree (verification_status);


--
-- Name: idx_conversation_participants_conv_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_participants_conv_user ON public.conversation_participants USING btree (conversation_id, user_id);


--
-- Name: idx_conversation_participants_conversation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_participants_conversation_id ON public.conversation_participants USING btree (conversation_id);


--
-- Name: idx_conversation_participants_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_participants_deleted ON public.conversation_participants USING btree (user_id, deleted_at);


--
-- Name: idx_conversation_participants_user_conv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_participants_user_conv ON public.conversation_participants USING btree (user_id, conversation_id);


--
-- Name: idx_conversation_participants_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants USING btree (user_id);


--
-- Name: idx_csr_initiatives_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_csr_initiatives_org_id ON public.csr_initiatives USING btree (organization_id);


--
-- Name: idx_csr_lead_tracking_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_csr_lead_tracking_action ON public.csr_lead_tracking USING btree (action_type);


--
-- Name: idx_csr_lead_tracking_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_csr_lead_tracking_created ON public.csr_lead_tracking USING btree (created_at);


--
-- Name: idx_csr_lead_tracking_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_csr_lead_tracking_org ON public.csr_lead_tracking USING btree (organization_id);


--
-- Name: idx_csr_opportunities_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_csr_opportunities_org ON public.csr_opportunities USING btree (organization_id);


--
-- Name: idx_csr_opportunities_post; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_csr_opportunities_post ON public.csr_opportunities USING btree (post_id);


--
-- Name: idx_csr_opportunities_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_csr_opportunities_status ON public.csr_opportunities USING btree (status);


--
-- Name: idx_data_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_data_requests_status ON public.esg_data_requests USING btree (status, due_date);


--
-- Name: idx_demo_activity_log_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_activity_log_created_at ON public.demo_request_activity_log USING btree (created_at DESC);


--
-- Name: idx_demo_activity_log_request_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_activity_log_request_id ON public.demo_request_activity_log USING btree (demo_request_id);


--
-- Name: idx_demo_requests_assigned_to; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_assigned_to ON public.demo_requests USING btree (assigned_to);


--
-- Name: idx_demo_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_created_at ON public.demo_requests USING btree (created_at DESC);


--
-- Name: idx_demo_requests_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_email ON public.demo_requests USING btree (email);


--
-- Name: idx_demo_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_status ON public.demo_requests USING btree (status);


--
-- Name: idx_donors_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_donors_org_id ON public.donors USING btree (organization_id);


--
-- Name: idx_donors_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_donors_user_id ON public.donors USING btree (user_id);


--
-- Name: idx_employee_engagement_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employee_engagement_org_id ON public.employee_engagement USING btree (organization_id);


--
-- Name: idx_esg_announcements_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_announcements_org ON public.esg_announcements USING btree (organization_id);


--
-- Name: idx_esg_benchmarks_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_benchmarks_indicator_id ON public.esg_benchmarks USING btree (indicator_id);


--
-- Name: idx_esg_compliance_reports_approved_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_compliance_reports_approved_by ON public.esg_compliance_reports USING btree (approved_by);


--
-- Name: idx_esg_compliance_reports_framework_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_compliance_reports_framework_id ON public.esg_compliance_reports USING btree (framework_id);


--
-- Name: idx_esg_compliance_reports_generated_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_compliance_reports_generated_by ON public.esg_compliance_reports USING btree (generated_by);


--
-- Name: idx_esg_compliance_reports_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_compliance_reports_org_id ON public.esg_compliance_reports USING btree (organization_id);


--
-- Name: idx_esg_data_entries_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_entries_indicator_id ON public.esg_data_entries USING btree (indicator_id);


--
-- Name: idx_esg_data_entries_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_entries_org_id ON public.esg_data_entries USING btree (organization_id);


--
-- Name: idx_esg_data_requests_framework_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_requests_framework_id ON public.esg_data_requests USING btree (framework_id);


--
-- Name: idx_esg_data_requests_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_requests_indicator_id ON public.esg_data_requests USING btree (indicator_id);


--
-- Name: idx_esg_data_requests_initiative_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_requests_initiative_id ON public.esg_data_requests USING btree (initiative_id);


--
-- Name: idx_esg_data_requests_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_requests_org_id ON public.esg_data_requests USING btree (organization_id);


--
-- Name: idx_esg_data_requests_requested_from_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_requests_requested_from_org_id ON public.esg_data_requests USING btree (requested_from_org_id);


--
-- Name: idx_esg_data_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_data_requests_status ON public.esg_data_requests USING btree (status);


--
-- Name: idx_esg_goals_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_goals_indicator_id ON public.esg_goals USING btree (indicator_id);


--
-- Name: idx_esg_goals_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_goals_org_id ON public.esg_goals USING btree (organization_id);


--
-- Name: idx_esg_indicators_framework_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_indicators_framework_id ON public.esg_indicators USING btree (framework_id);


--
-- Name: idx_esg_initiatives_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_initiatives_org_id ON public.esg_initiatives USING btree (organization_id);


--
-- Name: idx_esg_initiatives_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_initiatives_status ON public.esg_initiatives USING btree (status);


--
-- Name: idx_esg_recommendations_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_recommendations_org_id ON public.esg_recommendations USING btree (organization_id);


--
-- Name: idx_esg_reports_initiative_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_reports_initiative_id ON public.esg_reports USING btree (initiative_id);


--
-- Name: idx_esg_reports_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_reports_org_id ON public.esg_reports USING btree (organization_id);


--
-- Name: idx_esg_risks_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_risks_org_id ON public.esg_risks USING btree (organization_id);


--
-- Name: idx_esg_targets_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_targets_created_by ON public.esg_targets USING btree (created_by);


--
-- Name: idx_esg_targets_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_targets_indicator_id ON public.esg_targets USING btree (indicator_id);


--
-- Name: idx_esg_targets_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_targets_org_id ON public.esg_targets USING btree (organization_id);


--
-- Name: idx_esg_verification_audit_log_contribution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_verification_audit_log_contribution_id ON public.esg_verification_audit_log USING btree (contribution_id);


--
-- Name: idx_esg_verification_audit_log_performed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_esg_verification_audit_log_performed_by ON public.esg_verification_audit_log USING btree (performed_by);


--
-- Name: idx_evidence_submissions_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evidence_submissions_activity_id ON public.evidence_submissions USING btree (activity_id);


--
-- Name: idx_evidence_submissions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evidence_submissions_user_id ON public.evidence_submissions USING btree (user_id);


--
-- Name: idx_evidence_submissions_verified_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evidence_submissions_verified_by ON public.evidence_submissions USING btree (verified_by);


--
-- Name: idx_feedback_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_created_at ON public.platform_feedback USING btree (created_at DESC);


--
-- Name: idx_feedback_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_status ON public.platform_feedback USING btree (status);


--
-- Name: idx_feedback_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_type ON public.platform_feedback USING btree (feedback_type);


--
-- Name: idx_fraud_detection_log_reviewer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fraud_detection_log_reviewer_id ON public.fraud_detection_log USING btree (reviewer_id);


--
-- Name: idx_fraud_detection_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fraud_detection_log_user_id ON public.fraud_detection_log USING btree (user_id);


--
-- Name: idx_group_members_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_members_group_id ON public.group_members USING btree (group_id);


--
-- Name: idx_group_members_group_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_members_group_user ON public.group_members USING btree (group_id, user_id);


--
-- Name: idx_group_members_user_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_members_user_group ON public.group_members USING btree (user_id, group_id);


--
-- Name: idx_group_members_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_members_user_id ON public.group_members USING btree (user_id);


--
-- Name: idx_groups_admin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_admin_id ON public.groups USING btree (admin_id);


--
-- Name: idx_groups_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_category ON public.groups USING btree (category);


--
-- Name: idx_help_completion_requests_helper_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_help_completion_requests_helper_id ON public.help_completion_requests USING btree (helper_id);


--
-- Name: idx_help_completion_requests_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_help_completion_requests_post_id ON public.help_completion_requests USING btree (post_id);


--
-- Name: idx_help_completion_requests_requester_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_help_completion_requests_requester_id ON public.help_completion_requests USING btree (requester_id);


--
-- Name: idx_help_completion_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_help_completion_requests_status ON public.help_completion_requests USING btree (status);


--
-- Name: idx_helper_applications_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_helper_applications_status ON public.safe_space_helper_applications USING btree (application_status);


--
-- Name: idx_helper_applications_submitted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_helper_applications_submitted ON public.safe_space_helper_applications USING btree (submitted_at DESC) WHERE (submitted_at IS NOT NULL);


--
-- Name: idx_impact_act_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_act_user ON public.impact_activities USING btree (user_id);


--
-- Name: idx_impact_activities_confirmation_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_confirmation_status ON public.impact_activities USING btree (user_id, confirmation_status);


--
-- Name: idx_impact_activities_confirmed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_confirmed_by ON public.impact_activities USING btree (confirmed_by);


--
-- Name: idx_impact_activities_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_created_at ON public.impact_activities USING btree (created_at);


--
-- Name: idx_impact_activities_market_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_market_value ON public.impact_activities USING btree (user_id, market_value_gbp) WHERE (market_value_gbp > (0)::numeric);


--
-- Name: idx_impact_activities_organization_confirmation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_organization_confirmation ON public.impact_activities USING btree (organization_id, confirmation_status) WHERE (organization_id IS NOT NULL);


--
-- Name: idx_impact_activities_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_organization_id ON public.impact_activities USING btree (organization_id);


--
-- Name: idx_impact_activities_post_confirmation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_post_confirmation ON public.impact_activities USING btree (post_id, confirmation_status) WHERE (post_id IS NOT NULL);


--
-- Name: idx_impact_activities_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_post_id ON public.impact_activities USING btree (post_id);


--
-- Name: idx_impact_activities_skill_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_skill_category ON public.impact_activities USING btree (skill_category_id);


--
-- Name: idx_impact_activities_type_verified; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_type_verified ON public.impact_activities USING btree (activity_type, verified);


--
-- Name: idx_impact_activities_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_user_created ON public.impact_activities USING btree (user_id, created_at DESC);


--
-- Name: idx_impact_activities_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_activities_user_id ON public.impact_activities USING btree (user_id);


--
-- Name: idx_impact_goals_user_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_goals_user_active ON public.impact_goals USING btree (user_id, is_active) WHERE (is_active = true);


--
-- Name: idx_impact_goals_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_goals_user_id ON public.impact_goals USING btree (user_id);


--
-- Name: idx_impact_met_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_met_user ON public.impact_metrics USING btree (user_id);


--
-- Name: idx_impact_metrics_impact_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_metrics_impact_score ON public.impact_metrics USING btree (impact_score DESC);


--
-- Name: idx_impact_metrics_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_impact_metrics_user_id ON public.impact_metrics USING btree (user_id);


--
-- Name: idx_initiatives_progress; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_initiatives_progress ON public.esg_initiatives USING btree (organization_id, progress_percentage);


--
-- Name: idx_language_detection_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_language_detection_created ON public.language_detection_cache USING btree (created_at);


--
-- Name: idx_materiality_assessments_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materiality_assessments_created_by ON public.materiality_assessments USING btree (created_by);


--
-- Name: idx_materiality_assessments_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materiality_assessments_indicator_id ON public.materiality_assessments USING btree (indicator_id);


--
-- Name: idx_materiality_assessments_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materiality_assessments_org_id ON public.materiality_assessments USING btree (organization_id);


--
-- Name: idx_message_access_log_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_access_log_message_id ON public.message_access_log USING btree (message_id);


--
-- Name: idx_message_access_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_access_log_user_id ON public.message_access_log USING btree (user_id);


--
-- Name: idx_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at DESC);


--
-- Name: idx_messages_delivered_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_delivered_at ON public.messages USING btree (delivered_at);


--
-- Name: idx_messages_read_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_read_at ON public.messages USING btree (read_at);


--
-- Name: idx_messages_recipient_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_recipient_id ON public.messages USING btree (recipient_id);


--
-- Name: idx_messages_recipient_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_recipient_id_created_at ON public.messages USING btree (recipient_id, created_at);


--
-- Name: idx_messages_recipient_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_recipient_sender ON public.messages USING btree (recipient_id, sender_id);


--
-- Name: idx_messages_recipient_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_recipient_unread ON public.messages USING btree (recipient_id, is_read, created_at DESC);


--
-- Name: idx_messages_sender_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);


--
-- Name: idx_messages_sender_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender_id_created_at ON public.messages USING btree (sender_id, created_at);


--
-- Name: idx_messages_sender_recipient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender_recipient ON public.messages USING btree (sender_id, recipient_id, created_at DESC);


--
-- Name: idx_messages_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_unread ON public.messages USING btree (recipient_id, is_read) WHERE (is_read = false);


--
-- Name: idx_newsletter_subscriptions_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_newsletter_subscriptions_email ON public.newsletter_subscriptions USING btree (email);


--
-- Name: idx_newsletter_subscriptions_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_newsletter_subscriptions_is_active ON public.newsletter_subscriptions USING btree (is_active);


--
-- Name: idx_notif_recip; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notif_recip ON public.notifications USING btree (recipient_id);


--
-- Name: idx_notification_analytics_notification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_analytics_notification_id ON public.notification_analytics USING btree (notification_id);


--
-- Name: idx_notification_analytics_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_analytics_user_id ON public.notification_analytics USING btree (user_id);


--
-- Name: idx_notification_delivery_log_notification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_delivery_log_notification_id ON public.notification_delivery_log USING btree (notification_id);


--
-- Name: idx_notification_delivery_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_delivery_log_user_id ON public.notification_delivery_log USING btree (user_id);


--
-- Name: idx_notification_filters_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_filters_user_id ON public.notification_filters USING btree (user_id);


--
-- Name: idx_notification_templates_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_templates_created_by ON public.notification_templates USING btree (created_by);


--
-- Name: idx_notification_templates_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_templates_type ON public.notification_templates USING btree (type) WHERE (is_active = true);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at DESC);


--
-- Name: idx_notifications_delivery_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_delivery_status ON public.notifications USING btree (delivery_status);


--
-- Name: idx_notifications_group_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_group_key ON public.notifications USING btree (group_key);


--
-- Name: idx_notifications_grouped_with; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_grouped_with ON public.notifications USING btree (grouped_with);


--
-- Name: idx_notifications_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_priority ON public.notifications USING btree (priority);


--
-- Name: idx_notifications_recipient_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_recipient_created ON public.notifications USING btree (recipient_id, created_at DESC);


--
-- Name: idx_notifications_recipient_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_recipient_id ON public.notifications USING btree (recipient_id);


--
-- Name: idx_notifications_recipient_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_recipient_id_created_at ON public.notifications USING btree (recipient_id, created_at);


--
-- Name: idx_notifications_recipient_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_recipient_read ON public.notifications USING btree (recipient_id, is_read, created_at DESC);


--
-- Name: idx_notifications_recipient_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_recipient_unread ON public.notifications USING btree (recipient_id, is_read, created_at DESC) WHERE (is_read = false);


--
-- Name: idx_notifications_sender_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_sender_id ON public.notifications USING btree (sender_id);


--
-- Name: idx_notifications_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_unread ON public.notifications USING btree (recipient_id, is_read);


--
-- Name: idx_org_activities_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_activities_org ON public.organization_activities USING btree (organization_id);


--
-- Name: idx_org_activities_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_activities_published ON public.organization_activities USING btree (published_at DESC);


--
-- Name: idx_org_followers_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_followers_org ON public.organization_followers USING btree (organization_id);


--
-- Name: idx_org_followers_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_followers_user ON public.organization_followers USING btree (follower_id);


--
-- Name: idx_org_impact_metrics_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_impact_metrics_org ON public.organization_impact_metrics USING btree (organization_id);


--
-- Name: idx_org_members_org_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_members_org_user ON public.organization_members USING btree (organization_id, user_id, is_active);


--
-- Name: idx_org_reviews_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_reviews_org ON public.organization_reviews USING btree (organization_id);


--
-- Name: idx_org_reviews_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_reviews_rating ON public.organization_reviews USING btree (rating);


--
-- Name: idx_org_trust_scores_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_trust_scores_org ON public.organization_trust_scores USING btree (organization_id);


--
-- Name: idx_org_verifications_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_verifications_org ON public.organization_verifications USING btree (organization_id);


--
-- Name: idx_organization_esg_data_collected_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_esg_data_collected_by ON public.organization_esg_data USING btree (collected_by);


--
-- Name: idx_organization_esg_data_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_esg_data_indicator_id ON public.organization_esg_data USING btree (indicator_id);


--
-- Name: idx_organization_esg_data_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_esg_data_org_id ON public.organization_esg_data USING btree (organization_id);


--
-- Name: idx_organization_members_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_members_organization_id ON public.organization_members USING btree (organization_id);


--
-- Name: idx_organization_members_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_members_user_id ON public.organization_members USING btree (user_id);


--
-- Name: idx_organization_members_verified_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_members_verified_by ON public.organization_members USING btree (verified_by);


--
-- Name: idx_organization_preferences_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_preferences_organization_id ON public.organization_preferences USING btree (organization_id);


--
-- Name: idx_organization_reviews_reviewer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_reviews_reviewer_id ON public.organization_reviews USING btree (reviewer_id);


--
-- Name: idx_organization_settings_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_settings_org_id ON public.organization_settings USING btree (organization_id);


--
-- Name: idx_organization_verifications_verified_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_verifications_verified_by ON public.organization_verifications USING btree (verified_by);


--
-- Name: idx_organizations_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organizations_created_by ON public.organizations USING btree (created_by);


--
-- Name: idx_partnership_enquiries_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partnership_enquiries_created_at ON public.partnership_enquiries USING btree (created_at DESC);


--
-- Name: idx_partnership_enquiries_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partnership_enquiries_status ON public.partnership_enquiries USING btree (status);


--
-- Name: idx_platform_feedback_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_platform_feedback_user_id ON public.platform_feedback USING btree (user_id);


--
-- Name: idx_point_decay_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_point_decay_log_user_id ON public.point_decay_log USING btree (user_id);


--
-- Name: idx_points_configuration_updated_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_points_configuration_updated_by ON public.points_configuration USING btree (updated_by);


--
-- Name: idx_post_interactions_comment_tags; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_comment_tags ON public.post_interactions USING btree (parent_comment_id, interaction_type) WHERE ((interaction_type = 'user_tag'::text) AND (parent_comment_id IS NOT NULL));


--
-- Name: idx_post_interactions_comments; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_comments ON public.post_interactions USING btree (post_id, created_at) WHERE ((interaction_type = 'comment'::text) AND (is_deleted = false));


--
-- Name: idx_post_interactions_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_organization_id ON public.post_interactions USING btree (organization_id);


--
-- Name: idx_post_interactions_parent_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_parent_comment_id ON public.post_interactions USING btree (parent_comment_id);


--
-- Name: idx_post_interactions_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_post_id ON public.post_interactions USING btree (post_id);


--
-- Name: idx_post_interactions_post_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_post_id_created_at ON public.post_interactions USING btree (post_id, created_at);


--
-- Name: idx_post_interactions_post_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_post_type ON public.post_interactions USING btree (post_id, interaction_type) WHERE (is_deleted = false);


--
-- Name: idx_post_interactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_user_id ON public.post_interactions USING btree (user_id);


--
-- Name: idx_post_interactions_user_post; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_user_post ON public.post_interactions USING btree (user_id, post_id);


--
-- Name: idx_post_interactions_user_tags; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_interactions_user_tags ON public.post_interactions USING btree (user_id, interaction_type, post_id) WHERE (interaction_type = 'user_tag'::text);


--
-- Name: idx_post_reactions_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_reactions_post_id ON public.post_reactions USING btree (post_id);


--
-- Name: idx_post_reactions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_reactions_type ON public.post_reactions USING btree (reaction_type);


--
-- Name: idx_post_reactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_reactions_user_id ON public.post_reactions USING btree (user_id);


--
-- Name: idx_post_reactions_user_post; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_reactions_user_post ON public.post_reactions USING btree (user_id, post_id);


--
-- Name: idx_posts_author_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_author_active ON public.posts USING btree (author_id, is_active, created_at DESC);


--
-- Name: idx_posts_author_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_author_created ON public.posts USING btree (author_id, created_at DESC) WHERE (is_active = true);


--
-- Name: idx_posts_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_author_id ON public.posts USING btree (author_id);


--
-- Name: idx_posts_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_category ON public.posts USING btree (category);


--
-- Name: idx_posts_category_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_category_created ON public.posts USING btree (category, created_at DESC) WHERE (is_active = true);


--
-- Name: idx_posts_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_created_at ON public.posts USING btree (created_at DESC);


--
-- Name: idx_posts_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_location ON public.posts USING btree (latitude, longitude) WHERE ((latitude IS NOT NULL) AND (longitude IS NOT NULL));


--
-- Name: idx_posts_org_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_org_active ON public.posts USING btree (organization_id, is_active, created_at DESC);


--
-- Name: idx_posts_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_organization_id ON public.posts USING btree (organization_id);


--
-- Name: idx_posts_user_import_source_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_posts_user_import_source_external_id ON public.posts USING btree (author_id, import_source, external_id) WHERE ((import_source IS NOT NULL) AND (external_id IS NOT NULL));


--
-- Name: INDEX idx_posts_user_import_source_external_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON INDEX public.idx_posts_user_import_source_external_id IS 'Prevents the same user from importing the same content twice, but allows different users to import the same content';


--
-- Name: idx_profiles_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_id ON public.profiles USING btree (id);


--
-- Name: idx_profiles_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_location ON public.profiles USING btree (location) WHERE (location IS NOT NULL);


--
-- Name: idx_profiles_name_search; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_name_search ON public.profiles USING btree (first_name, last_name) WHERE ((first_name IS NOT NULL) OR (last_name IS NOT NULL));


--
-- Name: idx_profiles_waitlist_approved_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_waitlist_approved_by ON public.profiles USING btree (waitlist_approved_by);


--
-- Name: idx_questionnaire_responses_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questionnaire_responses_user_id ON public.questionnaire_responses USING btree (user_id);


--
-- Name: idx_rate_limit_buckets_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rate_limit_buckets_user_id ON public.rate_limit_buckets USING btree (user_id);


--
-- Name: idx_recommendation_cache_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recommendation_cache_user_id ON public.recommendation_cache USING btree (user_id);


--
-- Name: idx_red_flags_flagged_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_red_flags_flagged_by ON public.red_flags USING btree (flagged_by);


--
-- Name: idx_red_flags_resolved_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_red_flags_resolved_by ON public.red_flags USING btree (resolved_by);


--
-- Name: idx_red_flags_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_red_flags_user_id ON public.red_flags USING btree (user_id);


--
-- Name: idx_relive_stories_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_relive_stories_post_id ON public.relive_stories USING btree (post_id);


--
-- Name: idx_reports_reported_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_reported_post_id ON public.reports USING btree (reported_post_id);


--
-- Name: idx_reports_reported_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_reported_user_id ON public.reports USING btree (reported_user_id);


--
-- Name: idx_reports_reporter_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_reporter_id ON public.reports USING btree (reporter_id);


--
-- Name: idx_reports_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_reviewed_by ON public.reports USING btree (reviewed_by);


--
-- Name: idx_safe_space_audit_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_audit_log_user_id ON public.safe_space_audit_log USING btree (user_id);


--
-- Name: idx_safe_space_emergency_alerts_assigned_to; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_emergency_alerts_assigned_to ON public.safe_space_emergency_alerts USING btree (assigned_to);


--
-- Name: idx_safe_space_emergency_alerts_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_emergency_alerts_message_id ON public.safe_space_emergency_alerts USING btree (message_id);


--
-- Name: idx_safe_space_emergency_alerts_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_emergency_alerts_session_id ON public.safe_space_emergency_alerts USING btree (session_id);


--
-- Name: idx_safe_space_flagged_keywords_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_flagged_keywords_created_by ON public.safe_space_flagged_keywords USING btree (created_by);


--
-- Name: idx_safe_space_helper_applications_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_helper_applications_reviewed_by ON public.safe_space_helper_applications USING btree (reviewed_by);


--
-- Name: idx_safe_space_helper_applications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_helper_applications_user_id ON public.safe_space_helper_applications USING btree (user_id);


--
-- Name: idx_safe_space_helper_training_progress_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_helper_training_progress_module_id ON public.safe_space_helper_training_progress USING btree (module_id);


--
-- Name: idx_safe_space_helper_training_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_helper_training_progress_user_id ON public.safe_space_helper_training_progress USING btree (user_id);


--
-- Name: idx_safe_space_helpers_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_helpers_user_id ON public.safe_space_helpers USING btree (user_id);


--
-- Name: idx_safe_space_messages_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_messages_session_id ON public.safe_space_messages USING btree (session_id);


--
-- Name: idx_safe_space_queue_requester_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_queue_requester_id ON public.safe_space_queue USING btree (requester_id);


--
-- Name: idx_safe_space_reference_checks_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_reference_checks_application_id ON public.safe_space_reference_checks USING btree (application_id);


--
-- Name: idx_safe_space_sessions_helper_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_sessions_helper_id ON public.safe_space_sessions USING btree (helper_id);


--
-- Name: idx_safe_space_sessions_paused_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_sessions_paused_by ON public.safe_space_sessions USING btree (paused_by);


--
-- Name: idx_safe_space_sessions_requester_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_sessions_requester_id ON public.safe_space_sessions USING btree (requester_id);


--
-- Name: idx_safe_space_verification_documents_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_verification_documents_application_id ON public.safe_space_verification_documents USING btree (application_id);


--
-- Name: idx_safe_space_verification_documents_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_verification_documents_user_id ON public.safe_space_verification_documents USING btree (user_id);


--
-- Name: idx_safe_space_verification_documents_verified_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safe_space_verification_documents_verified_by ON public.safe_space_verification_documents USING btree (verified_by);


--
-- Name: idx_safeguarding_roles_assigned_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safeguarding_roles_assigned_by ON public.safeguarding_roles USING btree (assigned_by);


--
-- Name: idx_safeguarding_roles_user_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safeguarding_roles_user_role ON public.safeguarding_roles USING btree (user_id, role);


--
-- Name: idx_scheduled_notifications_recipient_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scheduled_notifications_recipient_id ON public.scheduled_notifications USING btree (recipient_id);


--
-- Name: idx_scheduled_notifications_scheduled_for; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scheduled_notifications_scheduled_for ON public.scheduled_notifications USING btree (scheduled_for) WHERE (status = 'pending'::text);


--
-- Name: idx_scheduled_notifications_sender_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scheduled_notifications_sender_id ON public.scheduled_notifications USING btree (sender_id);


--
-- Name: idx_scheduled_notifications_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scheduled_notifications_template_id ON public.scheduled_notifications USING btree (template_id);


--
-- Name: idx_stakeholder_data_contributions_contributor_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stakeholder_data_contributions_contributor_org_id ON public.stakeholder_data_contributions USING btree (contributor_org_id);


--
-- Name: idx_stakeholder_data_contributions_data_request_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stakeholder_data_contributions_data_request_id ON public.stakeholder_data_contributions USING btree (data_request_id);


--
-- Name: idx_stakeholder_data_contributions_esg_data_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stakeholder_data_contributions_esg_data_id ON public.stakeholder_data_contributions USING btree (esg_data_id);


--
-- Name: idx_stakeholder_data_contributions_verified_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stakeholder_data_contributions_verified_by ON public.stakeholder_data_contributions USING btree (verified_by);


--
-- Name: idx_stakeholder_engagement_metrics_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stakeholder_engagement_metrics_org_id ON public.stakeholder_engagement_metrics USING btree (organization_id);


--
-- Name: idx_stakeholder_groups_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stakeholder_groups_org_id ON public.stakeholder_groups USING btree (organization_id);


--
-- Name: idx_stakeholder_metrics_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stakeholder_metrics_created_by ON public.stakeholder_engagement_metrics USING btree (created_by);


--
-- Name: idx_story_participants_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_story_participants_post_id ON public.story_participants USING btree (post_id);


--
-- Name: idx_story_participants_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_story_participants_user_id ON public.story_participants USING btree (user_id);


--
-- Name: idx_story_updates_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_story_updates_author_id ON public.story_updates USING btree (author_id);


--
-- Name: idx_story_updates_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_story_updates_post_id ON public.story_updates USING btree (post_id);


--
-- Name: idx_support_actions_action_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_support_actions_action_type ON public.support_actions USING btree (action_type);


--
-- Name: idx_support_actions_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_support_actions_post_id ON public.support_actions USING btree (post_id);


--
-- Name: idx_support_actions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_support_actions_user_id ON public.support_actions USING btree (user_id);


--
-- Name: idx_trust_domains_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trust_domains_user_id ON public.trust_domains USING btree (user_id);


--
-- Name: idx_trust_score_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trust_score_history_user_id ON public.trust_score_history USING btree (user_id);


--
-- Name: idx_trust_score_history_verification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trust_score_history_verification_id ON public.trust_score_history USING btree (verification_id);


--
-- Name: idx_tutorial_preferences_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tutorial_preferences_user_id ON public.tutorial_preferences USING btree (user_id);


--
-- Name: idx_typing_indicators_user_partner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_typing_indicators_user_partner ON public.typing_indicators USING btree (user_id, conversation_partner_id);


--
-- Name: idx_unique_active_helper_application; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_active_helper_application ON public.safe_space_helper_applications USING btree (user_id) WHERE (application_status <> ALL (ARRAY['rejected'::text, 'withdrawn'::text]));


--
-- Name: idx_url_previews_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_url_previews_expires_at ON public.url_previews USING btree (expires_at);


--
-- Name: idx_url_previews_url; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_url_previews_url ON public.url_previews USING btree (url);


--
-- Name: idx_user_ach_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_ach_user ON public.user_achievements USING btree (user_id);


--
-- Name: idx_user_achievements_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements USING btree (user_id);


--
-- Name: idx_user_act_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_act_user ON public.user_activities USING btree (user_id);


--
-- Name: idx_user_activities_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activities_created_at ON public.user_activities USING btree (created_at DESC);


--
-- Name: idx_user_activities_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activities_user_id ON public.user_activities USING btree (user_id);


--
-- Name: idx_user_activities_user_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activities_user_id_created_at ON public.user_activities USING btree (user_id, created_at);


--
-- Name: idx_user_badge_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_badge_user ON public.user_badges USING btree (user_id);


--
-- Name: idx_user_badges_badge_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_badges_badge_id ON public.user_badges USING btree (badge_id);


--
-- Name: idx_user_blocks_blocked_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_blocks_blocked_id ON public.user_blocks USING btree (blocked_id);


--
-- Name: idx_user_blocks_blocker_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_blocks_blocker_id ON public.user_blocks USING btree (blocker_id);


--
-- Name: idx_user_challenge_progress_challenge_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_challenge_progress_challenge_id ON public.user_challenge_progress USING btree (challenge_id);


--
-- Name: idx_user_interaction_scores_target_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_interaction_scores_target_post_id ON public.user_interaction_scores USING btree (target_post_id);


--
-- Name: idx_user_interaction_scores_target_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_interaction_scores_target_user_id ON public.user_interaction_scores USING btree (target_user_id);


--
-- Name: idx_user_pref_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_pref_user ON public.user_preferences USING btree (user_id);


--
-- Name: idx_user_preferences_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences USING btree (user_id);


--
-- Name: idx_user_priv_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_priv_user ON public.user_privacy_settings USING btree (user_id);


--
-- Name: idx_user_privacy_settings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_privacy_settings_user_id ON public.user_privacy_settings USING btree (user_id);


--
-- Name: idx_user_tutorial_progress_tutorial_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_tutorial_progress_tutorial_type ON public.user_tutorial_progress USING btree (tutorial_type);


--
-- Name: idx_user_tutorial_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_tutorial_progress_user_id ON public.user_tutorial_progress USING btree (user_id);


--
-- Name: idx_user_verifications_face_match_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_verifications_face_match_score ON public.user_verifications USING btree (face_match_score) WHERE (face_match_score IS NOT NULL);


--
-- Name: idx_user_verifications_status_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_verifications_status_created ON public.user_verifications USING btree (status, created_at DESC);


--
-- Name: idx_user_verifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_verifications_user_id ON public.user_verifications USING btree (user_id);


--
-- Name: idx_user_verifications_user_id_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_verifications_user_id_status ON public.user_verifications USING btree (user_id, status);


--
-- Name: idx_user_verifications_verified_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_verifications_verified_by ON public.user_verifications USING btree (verified_by);


--
-- Name: idx_verification_document_audit_accessed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_document_audit_accessed_by ON public.verification_document_audit USING btree (accessed_by);


--
-- Name: idx_verification_document_audit_document_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_document_audit_document_id ON public.verification_document_audit USING btree (document_id);


--
-- Name: idx_verification_documents_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_documents_user_id ON public.verification_documents USING btree (user_id);


--
-- Name: idx_verification_documents_verification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_documents_verification_id ON public.verification_documents USING btree (verification_id);


--
-- Name: idx_volunteer_applications_opportunity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_applications_opportunity_id ON public.volunteer_applications USING btree (opportunity_id);


--
-- Name: idx_volunteer_applications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_applications_user_id ON public.volunteer_applications USING btree (user_id);


--
-- Name: idx_volunteer_interests_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_interests_post_id ON public.volunteer_interests USING btree (post_id);


--
-- Name: idx_volunteer_interests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_interests_status ON public.volunteer_interests USING btree (status);


--
-- Name: idx_volunteer_interests_volunteer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_interests_volunteer_id ON public.volunteer_interests USING btree (volunteer_id);


--
-- Name: idx_volunteer_notifications_recipient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_notifications_recipient ON public.volunteer_work_notifications USING btree (recipient_id, is_read, created_at DESC);


--
-- Name: idx_volunteer_opportunities_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_opportunities_created_by ON public.volunteer_opportunities USING btree (created_by);


--
-- Name: idx_volunteer_opportunities_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_opportunities_org_id ON public.volunteer_opportunities USING btree (organization_id);


--
-- Name: idx_volunteer_work_notifications_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_work_notifications_activity_id ON public.volunteer_work_notifications USING btree (activity_id);


--
-- Name: idx_volunteer_work_notifications_volunteer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_volunteer_work_notifications_volunteer_id ON public.volunteer_work_notifications USING btree (volunteer_id);


--
-- Name: post_interactions_unique_non_comment; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX post_interactions_unique_non_comment ON public.post_interactions USING btree (post_id, user_id, interaction_type) WHERE (interaction_type = ANY (ARRAY['like'::text, 'bookmark'::text, 'share'::text]));


--
-- Name: stakeholder_data_contributions contribution_status_notification_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER contribution_status_notification_trigger AFTER UPDATE OF verification_status ON public.stakeholder_data_contributions FOR EACH ROW EXECUTE FUNCTION public.notify_contribution_status();


--
-- Name: help_completion_requests create_relive_story_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER create_relive_story_trigger AFTER UPDATE ON public.help_completion_requests FOR EACH ROW EXECUTE FUNCTION public.create_relive_story_on_completion();


--
-- Name: organization_esg_data esg_data_audit_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER esg_data_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.organization_esg_data FOR EACH ROW EXECUTE FUNCTION public.log_esg_data_access();


--
-- Name: esg_initiatives esg_initiative_milestone_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER esg_initiative_milestone_trigger AFTER UPDATE OF progress_percentage ON public.esg_initiatives FOR EACH ROW EXECUTE FUNCTION public.notify_esg_milestone();


--
-- Name: platform_feedback feedback_status_notification_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER feedback_status_notification_trigger AFTER UPDATE ON public.platform_feedback FOR EACH ROW EXECUTE FUNCTION public.notify_feedback_status_change();


--
-- Name: profiles handle_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: content_appeals handle_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.content_appeals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: help_completion_requests help_approval_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER help_approval_trigger BEFORE UPDATE ON public.help_completion_requests FOR EACH ROW EXECUTE FUNCTION public.handle_enhanced_help_approval();


--
-- Name: badge_award_log increment_badge_award_count_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER increment_badge_award_count_trigger AFTER INSERT OR UPDATE ON public.badge_award_log FOR EACH ROW EXECUTE FUNCTION public.increment_badge_award_count();


--
-- Name: stakeholder_data_contributions log_verification_action_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER log_verification_action_trigger AFTER INSERT OR UPDATE OF verification_status ON public.stakeholder_data_contributions FOR EACH ROW EXECUTE FUNCTION public.log_verification_action();


--
-- Name: materiality_assessments materiality_audit_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER materiality_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.materiality_assessments FOR EACH ROW EXECUTE FUNCTION public.log_esg_data_access();


--
-- Name: messages message_access_audit_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER message_access_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.log_message_access();


--
-- Name: messages messages_broadcast_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER messages_broadcast_trigger AFTER INSERT OR DELETE OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.p2p_messages_broadcast_trigger();


--
-- Name: badge_award_log notify_badge_award_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER notify_badge_award_trigger AFTER INSERT OR UPDATE ON public.badge_award_log FOR EACH ROW EXECUTE FUNCTION public.notify_badge_award();


--
-- Name: demo_requests on_demo_request_created; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_demo_request_created AFTER INSERT ON public.demo_requests FOR EACH ROW EXECUTE FUNCTION public.notify_new_demo_request();


--
-- Name: help_completion_requests on_help_approval; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_help_approval BEFORE UPDATE ON public.help_completion_requests FOR EACH ROW EXECUTE FUNCTION public.handle_help_approval();


--
-- Name: post_interactions on_help_completion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_help_completion AFTER INSERT ON public.post_interactions FOR EACH ROW EXECUTE FUNCTION public.handle_help_completion();


--
-- Name: safe_space_helper_applications on_helper_application_approved; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_helper_application_approved AFTER UPDATE ON public.safe_space_helper_applications FOR EACH ROW EXECUTE FUNCTION public.sync_approved_helper_application();


--
-- Name: user_language_preferences on_language_prefs_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_language_prefs_updated BEFORE UPDATE ON public.user_language_preferences FOR EACH ROW EXECUTE FUNCTION public.handle_language_prefs_updated_at();


--
-- Name: messages p2p_messages_broadcast_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER p2p_messages_broadcast_trigger AFTER INSERT OR DELETE OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.p2p_messages_broadcast_trigger();


--
-- Name: connections prevent_duplicate_connections_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER prevent_duplicate_connections_trigger BEFORE INSERT ON public.connections FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_connections();


--
-- Name: safe_space_helpers process_queue_on_availability; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER process_queue_on_availability AFTER UPDATE ON public.safe_space_helpers FOR EACH ROW EXECUTE FUNCTION public.on_helper_availability_change();


--
-- Name: profiles profile_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER profile_updated_at_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_profile_updated_at();


--
-- Name: user_verifications recalculate_trust_score_insert_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER recalculate_trust_score_insert_trigger AFTER INSERT ON public.user_verifications FOR EACH ROW WHEN ((new.status = 'approved'::text)) EXECUTE FUNCTION public.recalculate_trust_score_on_verification();


--
-- Name: user_verifications recalculate_trust_score_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER recalculate_trust_score_trigger AFTER UPDATE ON public.user_verifications FOR EACH ROW EXECUTE FUNCTION public.recalculate_trust_score_on_verification();


--
-- Name: safe_space_sessions safe_space_session_ended; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER safe_space_session_ended AFTER UPDATE ON public.safe_space_sessions FOR EACH ROW EXECUTE FUNCTION public.update_helper_session_count();


--
-- Name: user_verifications sync_helper_verification_on_verification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_helper_verification_on_verification AFTER INSERT OR UPDATE ON public.user_verifications FOR EACH ROW EXECUTE FUNCTION public.sync_helper_verification_status();


--
-- Name: profiles sync_profile_email_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_profile_email_trigger AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.sync_profile_email();


--
-- Name: questionnaire_responses sync_questionnaire_to_profile_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_questionnaire_to_profile_trigger AFTER INSERT ON public.questionnaire_responses FOR EACH ROW EXECUTE FUNCTION public.sync_questionnaire_to_profile();


--
-- Name: post_interactions track_response_time; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER track_response_time AFTER INSERT ON public.post_interactions FOR EACH ROW WHEN ((new.interaction_type = 'interest_shown'::text)) EXECUTE FUNCTION public.calculate_response_time();


--
-- Name: esg_initiatives trigger_auto_generate_esg_report; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_generate_esg_report BEFORE UPDATE ON public.esg_initiatives FOR EACH ROW EXECUTE FUNCTION public.auto_generate_esg_report();


--
-- Name: user_presence trigger_expire_typing; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_expire_typing BEFORE UPDATE ON public.user_presence FOR EACH ROW EXECUTE FUNCTION public.expire_typing_indicator();


--
-- Name: impact_activities trigger_notify_volunteer_status; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_volunteer_status AFTER UPDATE ON public.impact_activities FOR EACH ROW WHEN ((old.confirmation_status IS DISTINCT FROM new.confirmation_status)) EXECUTE FUNCTION public.notify_volunteer_work_status();


--
-- Name: impact_activities trigger_notify_volunteer_work; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_volunteer_work AFTER INSERT ON public.impact_activities FOR EACH ROW EXECUTE FUNCTION public.notify_volunteer_work_logged();


--
-- Name: safe_space_helper_applications trigger_sync_approved_helper; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_sync_approved_helper AFTER UPDATE ON public.safe_space_helper_applications FOR EACH ROW EXECUTE FUNCTION public.sync_approved_helper_application();


--
-- Name: impact_activities trigger_update_market_value_metrics; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_market_value_metrics AFTER INSERT OR UPDATE ON public.impact_activities FOR EACH ROW WHEN ((new.market_value_gbp > (0)::numeric)) EXECUTE FUNCTION public.update_market_value_metrics();


--
-- Name: impact_metrics trust_score_check; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trust_score_check AFTER UPDATE OF trust_score ON public.impact_metrics FOR EACH ROW EXECUTE FUNCTION public.check_helper_trust_score();


--
-- Name: badges update_badges_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON public.badges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_posts update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: business_partnerships update_business_partnerships_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_business_partnerships_updated_at BEFORE UPDATE ON public.business_partnerships FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: business_products update_business_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_business_products_updated_at BEFORE UPDATE ON public.business_products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: campaign_analytics update_campaign_analytics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaign_analytics_updated_at BEFORE UPDATE ON public.campaign_analytics FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: campaign_donations update_campaign_donations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaign_donations_updated_at BEFORE UPDATE ON public.campaign_donations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: campaign_geographic_impact update_campaign_geographic_impact_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaign_geographic_impact_updated_at BEFORE UPDATE ON public.campaign_geographic_impact FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: campaign_interactions update_campaign_interactions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaign_interactions_updated_at BEFORE UPDATE ON public.campaign_interactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: campaign_sponsorships update_campaign_sponsorships_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaign_sponsorships_updated_at BEFORE UPDATE ON public.campaign_sponsorships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: campaigns update_campaigns_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: connections update_connections_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_reports update_content_reports_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_content_reports_updated_at BEFORE UPDATE ON public.content_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: corporate_partnerships update_corporate_partnerships_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_corporate_partnerships_updated_at BEFORE UPDATE ON public.corporate_partnerships FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: csr_initiatives update_csr_initiatives_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_csr_initiatives_updated_at BEFORE UPDATE ON public.csr_initiatives FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: csr_opportunities update_csr_opportunities_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_csr_opportunities_updated_at BEFORE UPDATE ON public.csr_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: demo_requests update_demo_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_demo_requests_updated_at BEFORE UPDATE ON public.demo_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: donors update_donors_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: safe_space_emergency_alerts update_emergency_alerts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_emergency_alerts_updated_at BEFORE UPDATE ON public.safe_space_emergency_alerts FOR EACH ROW EXECUTE FUNCTION public.update_safe_space_updated_at();


--
-- Name: employee_engagement update_employee_engagement_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_employee_engagement_updated_at BEFORE UPDATE ON public.employee_engagement FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: esg_benchmarks update_esg_benchmarks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_benchmarks_updated_at BEFORE UPDATE ON public.esg_benchmarks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: esg_data_entries update_esg_data_entries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_data_entries_updated_at BEFORE UPDATE ON public.esg_data_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: esg_goals update_esg_goals_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_goals_updated_at BEFORE UPDATE ON public.esg_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: esg_initiative_templates update_esg_initiative_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_initiative_templates_updated_at BEFORE UPDATE ON public.esg_initiative_templates FOR EACH ROW EXECUTE FUNCTION public.update_esg_initiatives_updated_at();


--
-- Name: esg_initiatives update_esg_initiatives_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_initiatives_updated_at BEFORE UPDATE ON public.esg_initiatives FOR EACH ROW EXECUTE FUNCTION public.update_esg_initiatives_updated_at();


--
-- Name: esg_recommendations update_esg_recommendations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_recommendations_updated_at BEFORE UPDATE ON public.esg_recommendations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: esg_reports update_esg_reports_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_reports_updated_at BEFORE UPDATE ON public.esg_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: esg_risks update_esg_risks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_esg_risks_updated_at BEFORE UPDATE ON public.esg_risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: evidence_submissions update_evidence_submissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_evidence_submissions_updated_at BEFORE UPDATE ON public.evidence_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: platform_feedback update_feedback_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.platform_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: safe_space_flagged_keywords update_flagged_keywords_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_flagged_keywords_updated_at BEFORE UPDATE ON public.safe_space_flagged_keywords FOR EACH ROW EXECUTE FUNCTION public.update_safe_space_updated_at();


--
-- Name: impact_activities update_goals_on_activity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_goals_on_activity AFTER INSERT ON public.impact_activities FOR EACH ROW EXECUTE FUNCTION public.update_goal_progress();


--
-- Name: grants update_grants_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON public.grants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: groups update_groups_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: messages update_messages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: organization_activities update_org_metrics_on_activity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_org_metrics_on_activity AFTER INSERT OR UPDATE ON public.organization_activities FOR EACH ROW EXECUTE FUNCTION public.update_organization_impact_metrics();


--
-- Name: organization_reviews update_org_metrics_on_review; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_org_metrics_on_review AFTER INSERT OR UPDATE ON public.organization_reviews FOR EACH ROW EXECUTE FUNCTION public.update_organization_impact_metrics();


--
-- Name: organization_members update_organization_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: organization_preferences update_organization_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_organization_preferences_updated_at BEFORE UPDATE ON public.organization_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: organization_settings update_organization_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_organization_settings_updated_at BEFORE UPDATE ON public.organization_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: organization_team_members update_organization_team_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_organization_team_members_updated_at BEFORE UPDATE ON public.organization_team_members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: organizations update_organizations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: points_configuration update_points_config_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_points_config_updated_at BEFORE UPDATE ON public.points_configuration FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: post_reactions update_post_reactions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_post_reactions_updated_at BEFORE UPDATE ON public.post_reactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: posts update_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_privacy_settings update_privacy_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_privacy_settings_updated_at BEFORE UPDATE ON public.user_privacy_settings FOR EACH ROW EXECUTE FUNCTION public.update_privacy_settings_updated_at();


--
-- Name: questionnaire_responses update_questionnaire_responses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_questionnaire_responses_updated_at BEFORE UPDATE ON public.questionnaire_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: recommendation_cache update_recommendation_cache_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_recommendation_cache_updated_at BEFORE UPDATE ON public.recommendation_cache FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: red_flags update_red_flags_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_red_flags_updated_at BEFORE UPDATE ON public.red_flags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: relive_stories update_relive_stories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_relive_stories_updated_at BEFORE UPDATE ON public.relive_stories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: safe_space_helper_applications update_safe_space_helper_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_safe_space_helper_applications_updated_at BEFORE UPDATE ON public.safe_space_helper_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: safe_space_helper_training_progress update_safe_space_helper_training_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_safe_space_helper_training_progress_updated_at BEFORE UPDATE ON public.safe_space_helper_training_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: safe_space_training_modules update_safe_space_training_modules_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_safe_space_training_modules_updated_at BEFORE UPDATE ON public.safe_space_training_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: safeguarding_roles update_safeguarding_roles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_safeguarding_roles_updated_at BEFORE UPDATE ON public.safeguarding_roles FOR EACH ROW EXECUTE FUNCTION public.update_safe_space_updated_at();


--
-- Name: stakeholder_groups update_stakeholder_groups_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_stakeholder_groups_updated_at BEFORE UPDATE ON public.stakeholder_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: story_updates update_story_updates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_story_updates_updated_at BEFORE UPDATE ON public.story_updates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: subscription_plans update_subscription_plans_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.update_subscription_updated_at();


--
-- Name: trust_domains update_trust_domains_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_trust_domains_updated_at BEFORE UPDATE ON public.trust_domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_preferences update_user_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: user_subscriptions update_user_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_subscription_updated_at();


--
-- Name: user_verifications update_user_verifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_verifications_updated_at BEFORE UPDATE ON public.user_verifications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: volunteer_interests update_volunteer_interests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_volunteer_interests_updated_at BEFORE UPDATE ON public.volunteer_interests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: volunteer_opportunities update_volunteer_opportunities_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_volunteer_opportunities_updated_at BEFORE UPDATE ON public.volunteer_opportunities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: admin_action_log admin_action_log_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_action_log
    ADD CONSTRAINT admin_action_log_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: admin_action_log admin_action_log_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_action_log
    ADD CONSTRAINT admin_action_log_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: admin_roles admin_roles_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: admin_roles admin_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: advertising_bookings advertising_bookings_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.advertising_bookings
    ADD CONSTRAINT advertising_bookings_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: advertising_bookings advertising_bookings_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.advertising_bookings
    ADD CONSTRAINT advertising_bookings_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.platform_payments(id);


--
-- Name: ai_endpoint_rate_limits ai_endpoint_rate_limits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_endpoint_rate_limits
    ADD CONSTRAINT ai_endpoint_rate_limits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: badge_award_log badge_award_log_awarded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_awarded_by_fkey FOREIGN KEY (awarded_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: badge_award_log badge_award_log_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;


--
-- Name: badge_award_log badge_award_log_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL;


--
-- Name: badge_award_log badge_award_log_revoked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_revoked_by_fkey FOREIGN KEY (revoked_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: badge_award_log badge_award_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: badges badges_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL;


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: blog_posts blog_posts_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_categories(id);


--
-- Name: business_partnerships business_partnerships_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_partnerships
    ADD CONSTRAINT business_partnerships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: business_products business_products_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_products
    ADD CONSTRAINT business_products_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: campaign_analytics campaign_analytics_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_analytics
    ADD CONSTRAINT campaign_analytics_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_donations campaign_donations_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_donations
    ADD CONSTRAINT campaign_donations_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_donations campaign_donations_donor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_donations
    ADD CONSTRAINT campaign_donations_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaign_engagement campaign_engagement_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_engagement
    ADD CONSTRAINT campaign_engagement_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_engagement campaign_engagement_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_engagement
    ADD CONSTRAINT campaign_engagement_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaign_geographic_impact campaign_geographic_impact_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_geographic_impact
    ADD CONSTRAINT campaign_geographic_impact_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_interactions campaign_interactions_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_interactions campaign_interactions_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: campaign_interactions campaign_interactions_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.campaign_interactions(id) ON DELETE CASCADE;


--
-- Name: campaign_interactions campaign_interactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaign_invitations campaign_invitations_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_invitations campaign_invitations_invitee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_invitee_id_fkey FOREIGN KEY (invitee_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaign_invitations campaign_invitations_inviter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaign_participants campaign_participants_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_participants
    ADD CONSTRAINT campaign_participants_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_participants campaign_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_participants
    ADD CONSTRAINT campaign_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaign_predictions campaign_predictions_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_predictions
    ADD CONSTRAINT campaign_predictions_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_promotions campaign_promotions_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_promotions
    ADD CONSTRAINT campaign_promotions_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_social_metrics campaign_social_metrics_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_social_metrics
    ADD CONSTRAINT campaign_social_metrics_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_sponsorships campaign_sponsorships_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_sponsorships
    ADD CONSTRAINT campaign_sponsorships_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_sponsorships campaign_sponsorships_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_sponsorships
    ADD CONSTRAINT campaign_sponsorships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: campaign_updates campaign_updates_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT campaign_updates_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaign_updates campaign_updates_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT campaign_updates_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaigns campaigns_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: campaigns campaigns_exclusive_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_exclusive_badge_id_fkey FOREIGN KEY (exclusive_badge_id) REFERENCES public.badges(id) ON DELETE SET NULL;


--
-- Name: carbon_footprint_data carbon_footprint_data_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carbon_footprint_data
    ADD CONSTRAINT carbon_footprint_data_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: carbon_footprint_data carbon_footprint_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carbon_footprint_data
    ADD CONSTRAINT carbon_footprint_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: comment_likes comment_likes_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.post_interactions(id) ON DELETE CASCADE;


--
-- Name: comment_likes comment_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: connections connections_addressee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: connections connections_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: content_appeals content_appeals_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_appeals
    ADD CONSTRAINT content_appeals_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id);


--
-- Name: content_reports content_reports_content_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_content_owner_id_fkey FOREIGN KEY (content_owner_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: content_reports content_reports_reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: content_reports content_reports_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: conversation_participants conversation_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: csr_initiatives csr_initiatives_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_initiatives
    ADD CONSTRAINT csr_initiatives_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: csr_lead_tracking csr_lead_tracking_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: csr_lead_tracking csr_lead_tracking_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: csr_lead_tracking csr_lead_tracking_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: csr_lead_tracking csr_lead_tracking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: csr_opportunities csr_opportunities_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_opportunities
    ADD CONSTRAINT csr_opportunities_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: csr_opportunities csr_opportunities_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csr_opportunities
    ADD CONSTRAINT csr_opportunities_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: demo_request_activity_log demo_request_activity_log_demo_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_request_activity_log
    ADD CONSTRAINT demo_request_activity_log_demo_request_id_fkey FOREIGN KEY (demo_request_id) REFERENCES public.demo_requests(id) ON DELETE CASCADE;


--
-- Name: employee_engagement employee_engagement_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_engagement
    ADD CONSTRAINT employee_engagement_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: esg_announcements esg_announcements_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_announcements
    ADD CONSTRAINT esg_announcements_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: esg_compliance_reports esg_compliance_reports_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id);


--
-- Name: esg_compliance_reports esg_compliance_reports_framework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);


--
-- Name: esg_compliance_reports esg_compliance_reports_generated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.profiles(id);


--
-- Name: esg_compliance_reports esg_compliance_reports_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: esg_data_requests esg_data_requests_framework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);


--
-- Name: esg_data_requests esg_data_requests_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);


--
-- Name: esg_data_requests esg_data_requests_initiative_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.esg_initiatives(id) ON DELETE SET NULL;


--
-- Name: esg_data_requests esg_data_requests_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: esg_data_requests esg_data_requests_requested_from_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_requested_from_org_id_fkey FOREIGN KEY (requested_from_org_id) REFERENCES public.organizations(id);


--
-- Name: esg_indicators esg_indicators_framework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_indicators
    ADD CONSTRAINT esg_indicators_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);


--
-- Name: esg_initiative_templates esg_initiative_templates_framework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_initiative_templates
    ADD CONSTRAINT esg_initiative_templates_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);


--
-- Name: esg_initiatives esg_initiatives_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: esg_initiatives esg_initiatives_framework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);


--
-- Name: esg_initiatives esg_initiatives_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: esg_report_versions esg_report_versions_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_report_versions
    ADD CONSTRAINT esg_report_versions_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.esg_reports(id) ON DELETE CASCADE;


--
-- Name: esg_reports esg_reports_initiative_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_reports
    ADD CONSTRAINT esg_reports_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.esg_initiatives(id) ON DELETE SET NULL;


--
-- Name: esg_reports esg_reports_previous_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_reports
    ADD CONSTRAINT esg_reports_previous_version_id_fkey FOREIGN KEY (previous_version_id) REFERENCES public.esg_reports(id);


--
-- Name: esg_targets esg_targets_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: esg_targets esg_targets_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);


--
-- Name: esg_targets esg_targets_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: esg_verification_audit_log esg_verification_audit_log_contribution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_verification_audit_log
    ADD CONSTRAINT esg_verification_audit_log_contribution_id_fkey FOREIGN KEY (contribution_id) REFERENCES public.stakeholder_data_contributions(id) ON DELETE CASCADE;


--
-- Name: esg_verification_audit_log esg_verification_audit_log_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esg_verification_audit_log
    ADD CONSTRAINT esg_verification_audit_log_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES auth.users(id);


--
-- Name: evidence_submissions evidence_submissions_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.impact_activities(id) ON DELETE CASCADE;


--
-- Name: evidence_submissions evidence_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: evidence_submissions evidence_submissions_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES auth.users(id);


--
-- Name: fraud_detection_log fraud_detection_log_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fraud_detection_log
    ADD CONSTRAINT fraud_detection_log_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES auth.users(id);


--
-- Name: fraud_detection_log fraud_detection_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fraud_detection_log
    ADD CONSTRAINT fraud_detection_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: group_members group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: group_members group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: groups groups_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: help_completion_requests help_completion_requests_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.help_completion_requests
    ADD CONSTRAINT help_completion_requests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: impact_activities impact_activities_confirmed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES auth.users(id);


--
-- Name: impact_activities impact_activities_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: impact_activities impact_activities_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: impact_activities impact_activities_skill_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_skill_category_id_fkey FOREIGN KEY (skill_category_id) REFERENCES public.skill_categories(id);


--
-- Name: materiality_assessments materiality_assessments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: materiality_assessments materiality_assessments_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);


--
-- Name: materiality_assessments materiality_assessments_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: messages messages_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: notification_analytics notification_analytics_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_analytics
    ADD CONSTRAINT notification_analytics_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;


--
-- Name: notification_delivery_log notification_delivery_log_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_delivery_log
    ADD CONSTRAINT notification_delivery_log_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_grouped_with_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_grouped_with_fkey FOREIGN KEY (grouped_with) REFERENCES public.notifications(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: organization_activities organization_activities_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_activities
    ADD CONSTRAINT organization_activities_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_esg_data organization_esg_data_collected_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_collected_by_fkey FOREIGN KEY (collected_by) REFERENCES public.profiles(id);


--
-- Name: organization_esg_data organization_esg_data_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);


--
-- Name: organization_esg_data organization_esg_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: organization_followers organization_followers_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: organization_followers organization_followers_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_impact_metrics organization_impact_metrics_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_impact_metrics
    ADD CONSTRAINT organization_impact_metrics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES auth.users(id);


--
-- Name: organization_preferences organization_preferences_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_preferences
    ADD CONSTRAINT organization_preferences_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_reviews organization_reviews_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_reviews organization_reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: organization_trust_scores organization_trust_scores_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_trust_scores
    ADD CONSTRAINT organization_trust_scores_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_verifications organization_verifications_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_verifications
    ADD CONSTRAINT organization_verifications_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_verifications organization_verifications_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_verifications
    ADD CONSTRAINT organization_verifications_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES auth.users(id);


--
-- Name: organizations organizations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: payment_references payment_references_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_references
    ADD CONSTRAINT payment_references_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.platform_payments(id) ON DELETE CASCADE;


--
-- Name: platform_feedback platform_feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_feedback
    ADD CONSTRAINT platform_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: platform_payments platform_payments_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: platform_payments platform_payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: point_decay_log point_decay_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_decay_log
    ADD CONSTRAINT point_decay_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: points_configuration points_configuration_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points_configuration
    ADD CONSTRAINT points_configuration_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: post_interactions post_interactions_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: post_interactions post_interactions_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.post_interactions(id) ON DELETE CASCADE;


--
-- Name: post_interactions post_interactions_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_interactions post_interactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: post_reactions post_reactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_reactions
    ADD CONSTRAINT post_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_founding_member_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_founding_member_granted_by_fkey FOREIGN KEY (founding_member_granted_by) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_waitlist_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_waitlist_approved_by_fkey FOREIGN KEY (waitlist_approved_by) REFERENCES auth.users(id);


--
-- Name: questionnaire_responses questionnaire_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questionnaire_responses
    ADD CONSTRAINT questionnaire_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: recommendation_cache recommendation_cache_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendation_cache
    ADD CONSTRAINT recommendation_cache_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: red_flags red_flags_flagged_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_flagged_by_fkey FOREIGN KEY (flagged_by) REFERENCES auth.users(id);


--
-- Name: red_flags red_flags_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id);


--
-- Name: red_flags red_flags_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: relive_stories relive_stories_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.relive_stories
    ADD CONSTRAINT relive_stories_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: reports reports_reported_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reported_post_id_fkey FOREIGN KEY (reported_post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: reports reports_reported_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reported_user_id_fkey FOREIGN KEY (reported_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: reports reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: reports reports_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: safe_space_audit_log safe_space_audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_audit_log
    ADD CONSTRAINT safe_space_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: safe_space_emergency_alerts safe_space_emergency_alerts_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id);


--
-- Name: safe_space_emergency_alerts safe_space_emergency_alerts_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.safe_space_messages(id) ON DELETE SET NULL;


--
-- Name: safe_space_emergency_alerts safe_space_emergency_alerts_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.safe_space_sessions(id) ON DELETE CASCADE;


--
-- Name: safe_space_flagged_keywords safe_space_flagged_keywords_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_flagged_keywords
    ADD CONSTRAINT safe_space_flagged_keywords_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: safe_space_helper_applications safe_space_helper_applications_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helper_applications
    ADD CONSTRAINT safe_space_helper_applications_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: safe_space_helper_applications safe_space_helper_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helper_applications
    ADD CONSTRAINT safe_space_helper_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: safe_space_helper_training_progress safe_space_helper_training_progress_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.safe_space_training_modules(id) ON DELETE CASCADE;


--
-- Name: safe_space_helper_training_progress safe_space_helper_training_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: safe_space_helpers safe_space_helpers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_helpers
    ADD CONSTRAINT safe_space_helpers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: safe_space_messages safe_space_messages_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_messages
    ADD CONSTRAINT safe_space_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.safe_space_sessions(id) ON DELETE CASCADE;


--
-- Name: safe_space_queue safe_space_queue_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_queue
    ADD CONSTRAINT safe_space_queue_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: safe_space_reference_checks safe_space_reference_checks_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_reference_checks
    ADD CONSTRAINT safe_space_reference_checks_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.safe_space_helper_applications(id) ON DELETE CASCADE;


--
-- Name: safe_space_sessions safe_space_sessions_helper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: safe_space_sessions safe_space_sessions_paused_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_paused_by_fkey FOREIGN KEY (paused_by) REFERENCES auth.users(id);


--
-- Name: safe_space_sessions safe_space_sessions_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: safe_space_verification_documents safe_space_verification_documents_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.safe_space_helper_applications(id) ON DELETE CASCADE;


--
-- Name: safe_space_verification_documents safe_space_verification_documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: safe_space_verification_documents safe_space_verification_documents_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES auth.users(id);


--
-- Name: safeguarding_roles safeguarding_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES auth.users(id);


--
-- Name: safeguarding_roles safeguarding_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: scheduled_notifications scheduled_notifications_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_notifications
    ADD CONSTRAINT scheduled_notifications_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.notification_templates(id) ON DELETE SET NULL;


--
-- Name: security_audit_log security_audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_audit_log
    ADD CONSTRAINT security_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: stakeholder_data_contributions stakeholder_data_contributions_contributor_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_contributor_org_id_fkey FOREIGN KEY (contributor_org_id) REFERENCES public.organizations(id);


--
-- Name: stakeholder_data_contributions stakeholder_data_contributions_data_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_data_request_id_fkey FOREIGN KEY (data_request_id) REFERENCES public.esg_data_requests(id) ON DELETE CASCADE;


--
-- Name: stakeholder_data_contributions stakeholder_data_contributions_esg_data_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_esg_data_id_fkey FOREIGN KEY (esg_data_id) REFERENCES public.organization_esg_data(id);


--
-- Name: stakeholder_data_contributions stakeholder_data_contributions_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES auth.users(id);


--
-- Name: stakeholder_engagement_metrics stakeholder_engagement_metrics_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_engagement_metrics
    ADD CONSTRAINT stakeholder_engagement_metrics_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: stakeholder_engagement_metrics stakeholder_engagement_metrics_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stakeholder_engagement_metrics
    ADD CONSTRAINT stakeholder_engagement_metrics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: story_participants story_participants_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: story_participants story_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: story_updates story_updates_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_updates
    ADD CONSTRAINT story_updates_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: story_updates story_updates_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_updates
    ADD CONSTRAINT story_updates_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: subscription_admin_actions subscription_admin_actions_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_admin_actions
    ADD CONSTRAINT subscription_admin_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id);


--
-- Name: subscription_admin_actions subscription_admin_actions_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_admin_actions
    ADD CONSTRAINT subscription_admin_actions_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES auth.users(id);


--
-- Name: support_actions support_actions_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_actions
    ADD CONSTRAINT support_actions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: support_actions support_actions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_actions
    ADD CONSTRAINT support_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: trust_domains trust_domains_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trust_domains
    ADD CONSTRAINT trust_domains_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: trust_score_history trust_score_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trust_score_history
    ADD CONSTRAINT trust_score_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: trust_score_history trust_score_history_verification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trust_score_history
    ADD CONSTRAINT trust_score_history_verification_id_fkey FOREIGN KEY (verification_id) REFERENCES public.user_verifications(id);


--
-- Name: tutorial_preferences tutorial_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorial_preferences
    ADD CONSTRAINT tutorial_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_activities user_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_blocks user_blocks_blocked_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocked_id_fkey FOREIGN KEY (blocked_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_blocks user_blocks_blocker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocker_id_fkey FOREIGN KEY (blocker_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_challenge_progress user_challenge_progress_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT user_challenge_progress_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.seasonal_challenges(id);


--
-- Name: user_interaction_scores user_interaction_scores_target_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_target_post_id_fkey FOREIGN KEY (target_post_id) REFERENCES public.posts(id);


--
-- Name: user_interaction_scores user_interaction_scores_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES auth.users(id);


--
-- Name: user_interaction_scores user_interaction_scores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: user_language_preferences user_language_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_preferences
    ADD CONSTRAINT user_language_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_presence user_presence_typing_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_typing_to_user_id_fkey FOREIGN KEY (typing_to_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: user_presence user_presence_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_privacy_settings user_privacy_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_subscriptions user_subscriptions_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: user_subscriptions user_subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: user_subscriptions user_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_tutorial_progress user_tutorial_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tutorial_progress
    ADD CONSTRAINT user_tutorial_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_verifications user_verifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_verifications user_verifications_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES auth.users(id);


--
-- Name: verification_document_audit verification_document_audit_accessed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_document_audit
    ADD CONSTRAINT verification_document_audit_accessed_by_fkey FOREIGN KEY (accessed_by) REFERENCES auth.users(id);


--
-- Name: verification_document_audit verification_document_audit_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_document_audit
    ADD CONSTRAINT verification_document_audit_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.verification_documents(id) ON DELETE CASCADE;


--
-- Name: verification_documents verification_documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: verification_documents verification_documents_verification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_verification_id_fkey FOREIGN KEY (verification_id) REFERENCES public.user_verifications(id) ON DELETE CASCADE;


--
-- Name: volunteer_interests volunteer_interests_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: volunteer_interests volunteer_interests_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: volunteer_work_notifications volunteer_work_notifications_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.impact_activities(id) ON DELETE CASCADE;


--
-- Name: volunteer_work_notifications volunteer_work_notifications_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users(id);


--
-- Name: volunteer_work_notifications volunteer_work_notifications_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES auth.users(id);


--
-- Name: white_label_purchases white_label_purchases_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.white_label_purchases
    ADD CONSTRAINT white_label_purchases_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: white_label_purchases white_label_purchases_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.white_label_purchases
    ADD CONSTRAINT white_label_purchases_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.platform_payments(id);


--
-- Name: demo_requests Admins can delete demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete demo requests" ON public.demo_requests FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: badge_award_log Admins can manage all badge awards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all badge awards" ON public.badge_award_log USING (public.is_admin(auth.uid()));


--
-- Name: blog_posts Admins can manage all blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts USING (public.is_admin(auth.uid()));


--
-- Name: badges Admins can manage badges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage badges" ON public.badges USING (public.is_admin(auth.uid()));


--
-- Name: blog_categories Admins can manage blog categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage blog categories" ON public.blog_categories TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE (admin_roles.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE (admin_roles.user_id = auth.uid()))));


--
-- Name: blog_posts Admins can manage blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE (admin_roles.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE (admin_roles.user_id = auth.uid()))));


--
-- Name: points_configuration Admins can manage points config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage points config" ON public.points_configuration USING (public.is_admin(auth.uid()));


--
-- Name: newsletter_subscribers Admins can manage subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage subscriptions" ON public.newsletter_subscribers USING (public.is_admin(auth.uid()));


--
-- Name: esg_initiative_templates Admins can manage templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage templates" ON public.esg_initiative_templates USING (public.is_admin(auth.uid()));


--
-- Name: notification_templates Admins can manage templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage templates" ON public.notification_templates USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: safe_space_training_modules Admins can manage training modules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage training modules" ON public.safe_space_training_modules USING (public.is_admin(auth.uid()));


--
-- Name: user_badges Admins can manage user badges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage user badges" ON public.user_badges USING (public.is_admin(auth.uid()));


--
-- Name: organization_members Admins can remove members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can remove members" ON public.organization_members FOR DELETE USING (public.check_org_admin(organization_id, auth.uid()));


--
-- Name: platform_feedback Admins can update all feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all feedback" ON public.platform_feedback FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: safe_space_helper_training_progress Admins can update all training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all training progress" ON public.safe_space_helper_training_progress FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: user_verifications Admins can update all verifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all verifications" ON public.user_verifications FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: profiles Admins can update any profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: content_appeals Admins can update appeals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update appeals" ON public.content_appeals FOR UPDATE USING (public.is_admin(auth.uid()));


--
-- Name: demo_requests Admins can update demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update demo requests" ON public.demo_requests FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: safe_space_verification_documents Admins can update document verification status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update document verification status" ON public.safe_space_verification_documents FOR UPDATE USING (public.is_admin(auth.uid()));


--
-- Name: content_reports Admins can update reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update reports" ON public.content_reports FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: groups Admins can update their groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update their groups" ON public.groups FOR UPDATE USING ((auth.uid() = admin_id));


--
-- Name: demo_request_activity_log Admins can view activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view activity logs" ON public.demo_request_activity_log FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: content_appeals Admins can view all appeals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all appeals" ON public.content_appeals FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: demo_requests Admins can view all demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all demo requests" ON public.demo_requests FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: evidence_submissions Admins can view all evidence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all evidence" ON public.evidence_submissions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (('admin'::text = ANY (profiles.skills)) OR ('moderator'::text = ANY (profiles.skills)))))));


--
-- Name: platform_feedback Admins can view all feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all feedback" ON public.platform_feedback FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: newsletter_subscriptions Admins can view all newsletter subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all newsletter subscriptions" ON public.newsletter_subscriptions FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: red_flags Admins can view all red flags; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all red flags" ON public.red_flags FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (('admin'::text = ANY (profiles.skills)) OR ('moderator'::text = ANY (profiles.skills)))))));


--
-- Name: safe_space_reference_checks Admins can view all reference checks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all reference checks" ON public.safe_space_reference_checks FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: content_reports Admins can view all reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all reports" ON public.content_reports FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: safe_space_helper_training_progress Admins can view all training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all training progress" ON public.safe_space_helper_training_progress FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: safe_space_verification_documents Admins can view all verification documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all verification documents" ON public.safe_space_verification_documents FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: verification_documents Admins can view all verification documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all verification documents" ON public.verification_documents FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: user_verifications Admins can view all verifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all verifications" ON public.user_verifications FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: admin_action_log Admins can view audit log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view audit log" ON public.admin_action_log FOR SELECT TO authenticated USING (public.is_admin(( SELECT auth.uid() AS uid)));


--
-- Name: security_audit_log Admins can view audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view audit logs" ON public.security_audit_log FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: verification_document_audit Admins can view audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view audit logs" ON public.verification_document_audit FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: contact_submissions Admins can view contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: fraud_detection_log Admins can view fraud detection log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view fraud detection log" ON public.fraud_detection_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (('admin'::text = ANY (profiles.skills)) OR ('moderator'::text = ANY (profiles.skills)))))));


--
-- Name: impact_metrics Admins can view impact metrics for moderation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view impact metrics for moderation" ON public.impact_metrics FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: message_access_log Admins can view message access logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view message access logs" ON public.message_access_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: partnership_enquiries Admins can view partnership enquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view partnership enquiries" ON public.partnership_enquiries FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: subscription_admin_actions Admins can view subscription actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view subscription actions" ON public.subscription_admin_actions FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: user_activities Admins can view user activities for moderation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view user activities for moderation" ON public.user_activities FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admin_roles
  WHERE ((admin_roles.user_id = auth.uid()) AND (admin_roles.role = 'admin'::text)))));


--
-- Name: blog_categories Anyone can read blog categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read blog categories" ON public.blog_categories FOR SELECT USING (true);


--
-- Name: blog_posts Anyone can read published blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts FOR SELECT USING ((is_published = true));


--
-- Name: contact_submissions Anyone can submit contact forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);


--
-- Name: partnership_enquiries Anyone can submit partnership enquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit partnership enquiries" ON public.partnership_enquiries FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_subscribers Anyone can subscribe to newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_subscriptions Anyone can subscribe to newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);


--
-- Name: badges Anyone can view active badges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active badges" ON public.badges FOR SELECT USING ((is_active = true));


--
-- Name: seasonal_challenges Anyone can view active challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active challenges" ON public.seasonal_challenges FOR SELECT USING ((is_active = true));


--
-- Name: esg_initiative_templates Anyone can view active templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active templates" ON public.esg_initiative_templates FOR SELECT USING ((is_active = true));


--
-- Name: notification_templates Anyone can view active templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active templates" ON public.notification_templates FOR SELECT USING ((is_active = true));


--
-- Name: safe_space_training_modules Anyone can view active training modules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active training modules" ON public.safe_space_training_modules FOR SELECT USING ((is_active = true));


--
-- Name: organization_verifications Anyone can view approved verifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view approved verifications" ON public.organization_verifications FOR SELECT USING ((status = 'approved'::text));


--
-- Name: blog_categories Anyone can view blog categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view blog categories" ON public.blog_categories FOR SELECT USING (true);


--
-- Name: organization_impact_metrics Anyone can view impact metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view impact metrics" ON public.organization_impact_metrics FOR SELECT USING (true);


--
-- Name: points_configuration Anyone can view points config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view points config" ON public.points_configuration FOR SELECT USING (true);


--
-- Name: organization_activities Anyone can view published activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published activities" ON public.organization_activities FOR SELECT USING ((published_at IS NOT NULL));


--
-- Name: blog_posts Anyone can view published blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (((is_published = true) OR (auth.uid() = author_id) OR public.is_admin(auth.uid())));


--
-- Name: organization_reviews Anyone can view reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view reviews" ON public.organization_reviews FOR SELECT USING (true);


--
-- Name: skill_categories Anyone can view skill categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view skill categories" ON public.skill_categories FOR SELECT USING (true);


--
-- Name: subscription_plans Anyone can view subscription plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (true);


--
-- Name: organization_trust_scores Anyone can view trust scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view trust scores" ON public.organization_trust_scores FOR SELECT USING (true);


--
-- Name: safe_space_helpers Anyone can view verified helpers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view verified helpers" ON public.safe_space_helpers FOR SELECT USING (((verification_status = 'verified'::text) OR (user_id = auth.uid()) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: esg_indicators Authenticated users can view ESG indicators; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view ESG indicators" ON public.esg_indicators FOR SELECT USING ((( SELECT auth.uid() AS uid) IS NOT NULL));


--
-- Name: esg_frameworks Authenticated users can view active ESG frameworks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view active ESG frameworks" ON public.esg_frameworks FOR SELECT USING (((( SELECT auth.uid() AS uid) IS NOT NULL) AND (is_active = true)));


--
-- Name: story_updates Authors can update their own story updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authors can update their own story updates" ON public.story_updates FOR UPDATE USING ((author_id = auth.uid()));


--
-- Name: campaign_promotions Campaign creators can create promotions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can create promotions" ON public.campaign_promotions FOR INSERT WITH CHECK ((campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE (campaigns.creator_id = auth.uid()))));


--
-- Name: campaign_invitations Campaign creators can send invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can send invitations" ON public.campaign_invitations FOR INSERT WITH CHECK (((auth.uid() = inviter_id) AND (auth.uid() IN ( SELECT campaigns.creator_id
   FROM public.campaigns
  WHERE (campaigns.id = campaign_invitations.campaign_id)))));


--
-- Name: campaign_analytics Campaign creators can view analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can view analytics" ON public.campaign_analytics FOR SELECT USING ((campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE (campaigns.creator_id = auth.uid()))));


--
-- Name: campaign_donations Campaign creators can view donations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can view donations" ON public.campaign_donations FOR SELECT USING ((campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE (campaigns.creator_id = auth.uid()))));


--
-- Name: campaign_engagement Campaign creators can view engagement; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can view engagement" ON public.campaign_engagement FOR SELECT USING ((campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE (campaigns.creator_id = auth.uid()))));


--
-- Name: campaign_predictions Campaign creators can view predictions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can view predictions" ON public.campaign_predictions FOR SELECT USING ((campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE (campaigns.creator_id = auth.uid()))));


--
-- Name: campaign_sponsorships Campaign creators can view sponsorships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can view sponsorships" ON public.campaign_sponsorships FOR SELECT USING ((campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE (campaigns.creator_id = auth.uid()))));


--
-- Name: campaign_promotions Campaign creators can view their promotions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign creators can view their promotions" ON public.campaign_promotions FOR SELECT USING ((campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE (campaigns.creator_id = auth.uid()))));


--
-- Name: campaign_updates Campaign organizers can create updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign organizers can create updates" ON public.campaign_updates FOR INSERT WITH CHECK (((auth.uid() = author_id) AND (auth.uid() IN ( SELECT campaigns.creator_id
   FROM public.campaigns
  WHERE (campaigns.id = campaign_updates.campaign_id)
UNION
 SELECT campaign_participants.user_id
   FROM public.campaign_participants
  WHERE ((campaign_participants.campaign_id = campaign_updates.campaign_id) AND (campaign_participants.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaigns Campaign owners and admins can delete campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Campaign owners and admins can delete campaigns" ON public.campaigns FOR DELETE USING (((auth.uid() = creator_id) OR public.is_admin(auth.uid())));


--
-- Name: stakeholder_data_contributions Contributors can create contributions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Contributors can create contributions" ON public.stakeholder_data_contributions FOR INSERT TO authenticated WITH CHECK (((contributor_user_id = auth.uid()) OR (contributor_org_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true))))));


--
-- Name: stakeholder_data_contributions Contributors can update their contributions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Contributors can update their contributions" ON public.stakeholder_data_contributions FOR UPDATE TO authenticated USING (((contributor_user_id = auth.uid()) OR (contributor_org_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true))))));


--
-- Name: stakeholder_data_contributions Contributors can view their contributions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Contributors can view their contributions" ON public.stakeholder_data_contributions FOR SELECT TO authenticated USING (((contributor_user_id = auth.uid()) OR (contributor_org_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))) OR (data_request_id IN ( SELECT esg_data_requests.id
   FROM public.esg_data_requests
  WHERE (esg_data_requests.organization_id IN ( SELECT organization_members.organization_id
           FROM public.organization_members
          WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true))))))));


--
-- Name: stakeholder_data_contributions Contributors can view their own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Contributors can view their own submissions" ON public.stakeholder_data_contributions FOR SELECT USING (((contributor_org_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.is_active = true)))) OR (EXISTS ( SELECT 1
   FROM public.esg_data_requests edr
  WHERE ((edr.id = stakeholder_data_contributions.data_request_id) AND public.is_organization_admin(edr.organization_id, ( SELECT auth.uid() AS uid)))))));


--
-- Name: esg_benchmarks ESG benchmarks are viewable by organization members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "ESG benchmarks are viewable by organization members" ON public.esg_benchmarks FOR SELECT USING (true);


--
-- Name: organization_members Enforce team member limits on insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enforce team member limits on insert" ON public.organization_members FOR INSERT WITH CHECK (public.check_team_member_limit(organization_id));


--
-- Name: volunteer_opportunities Everyone can view active volunteer opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view active volunteer opportunities" ON public.volunteer_opportunities FOR SELECT USING ((status = 'active'::text));


--
-- Name: donors Fundraising staff can manage donors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Fundraising staff can manage donors" ON public.donors USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'fundraiser'::text])) AND (organization_members.is_active = true)))));


--
-- Name: donors Fundraising staff can view donor data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Fundraising staff can view donor data" ON public.donors FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'fundraiser'::text])) AND (organization_members.is_active = true)))));


--
-- Name: groups Group admins can delete their groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Group admins can delete their groups" ON public.groups FOR DELETE USING ((auth.uid() = admin_id));


--
-- Name: groups Group admins can update their groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Group admins can update their groups" ON public.groups FOR UPDATE USING ((auth.uid() = admin_id));


--
-- Name: safe_space_verification_documents Helpers and safeguarding can view documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Helpers and safeguarding can view documents" ON public.safe_space_verification_documents FOR SELECT USING (((user_id = auth.uid()) OR public.is_admin(auth.uid()) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: help_completion_requests Helpers can create completion requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Helpers can create completion requests" ON public.help_completion_requests FOR INSERT WITH CHECK ((auth.uid() = helper_id));


--
-- Name: safe_space_helpers Helpers can manage their availability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Helpers can manage their availability" ON public.safe_space_helpers USING ((auth.uid() = user_id));


--
-- Name: safe_space_sessions Helpers can update sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Helpers can update sessions" ON public.safe_space_sessions FOR UPDATE USING (((auth.uid() = helper_id) OR (auth.uid() = requester_id)));


--
-- Name: safe_space_helpers Helpers can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Helpers can update their own profile" ON public.safe_space_helpers FOR UPDATE USING (((user_id = auth.uid()) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: safe_space_verification_documents Helpers can upload their documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Helpers can upload their documents" ON public.safe_space_verification_documents FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: help_completion_requests Helpers can view their completion requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Helpers can view their completion requests" ON public.help_completion_requests FOR SELECT USING ((auth.uid() = helper_id));


--
-- Name: organization_invitations Invited users can respond to invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Invited users can respond to invitations" ON public.organization_invitations FOR UPDATE USING (((email = ( SELECT auth.email() AS email)) AND (status = 'pending'::text)));


--
-- Name: organization_invitations Invited users can view their invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Invited users can view their invitations" ON public.organization_invitations FOR SELECT USING (((email = ( SELECT auth.email() AS email)) AND (status = 'pending'::text) AND ((expires_at IS NULL) OR (expires_at > now()))));


--
-- Name: blog_categories Only admins can manage categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can manage categories" ON public.blog_categories USING (public.is_admin(auth.uid()));


--
-- Name: organization_members Org admins can add members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org admins can add members" ON public.organization_members FOR INSERT TO authenticated WITH CHECK (public.is_org_admin(organization_id, auth.uid()));


--
-- Name: organization_impact_metrics Org admins can manage impact metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org admins can manage impact metrics" ON public.organization_impact_metrics USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_verifications Org admins can manage verifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org admins can manage verifications" ON public.organization_verifications USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_members Org admins can remove members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org admins can remove members" ON public.organization_members FOR DELETE TO authenticated USING (public.is_org_admin(organization_id, auth.uid()));


--
-- Name: organization_members Org admins can update members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org admins can update members" ON public.organization_members FOR UPDATE TO authenticated USING (public.is_org_admin(organization_id, auth.uid())) WITH CHECK (public.is_org_admin(organization_id, auth.uid()));


--
-- Name: white_label_purchases Org admins can view white label purchases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org admins can view white label purchases" ON public.white_label_purchases FOR SELECT USING ((organisation_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_activities Org members can manage activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org members can manage activities" ON public.organization_activities USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: advertising_bookings Org members can view advertising bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org members can view advertising bookings" ON public.advertising_bookings FOR SELECT USING ((organisation_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_data_requests Organization admins can create data requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can create data requests" ON public.esg_data_requests FOR INSERT TO authenticated WITH CHECK ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_invitations Organization admins can create invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can create invitations" ON public.organization_invitations FOR INSERT WITH CHECK ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_esg_data Organization admins can manage ESG data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage ESG data" ON public.organization_esg_data USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_recommendations Organization admins can manage ESG recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage ESG recommendations" ON public.esg_recommendations USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_reports Organization admins can manage ESG reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage ESG reports" ON public.esg_reports USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_risks Organization admins can manage ESG risks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage ESG risks" ON public.esg_risks USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_targets Organization admins can manage ESG targets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage ESG targets" ON public.esg_targets USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_announcements Organization admins can manage announcements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage announcements" ON public.esg_announcements TO authenticated USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: carbon_footprint_data Organization admins can manage carbon data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage carbon data" ON public.carbon_footprint_data USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_compliance_reports Organization admins can manage compliance reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage compliance reports" ON public.esg_compliance_reports USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_initiatives Organization admins can manage initiatives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage initiatives" ON public.esg_initiatives USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text])) AND (organization_members.is_active = true)))));


--
-- Name: materiality_assessments Organization admins can manage materiality assessments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage materiality assessments" ON public.materiality_assessments USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: business_partnerships Organization admins can manage partnerships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage partnerships" ON public.business_partnerships USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_preferences Organization admins can manage preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage preferences" ON public.organization_preferences USING ((EXISTS ( SELECT 1
   FROM public.organization_members
  WHERE ((organization_members.organization_id = organization_preferences.organization_id) AND (organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'staff'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_settings Organization admins can manage settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage settings" ON public.organization_settings USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: campaign_sponsorships Organization admins can manage sponsorships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage sponsorships" ON public.campaign_sponsorships USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text])) AND (organization_members.is_active = true)))));


--
-- Name: stakeholder_groups Organization admins can manage stakeholder groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage stakeholder groups" ON public.stakeholder_groups USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: stakeholder_engagement_metrics Organization admins can manage stakeholder metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage stakeholder metrics" ON public.stakeholder_engagement_metrics USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_team_members Organization admins can manage team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can manage team members" ON public.organization_team_members USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_data_requests Organization admins can update data requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can update data requests" ON public.esg_data_requests FOR UPDATE TO authenticated USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_invitations Organization admins can update invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can update invitations" ON public.organization_invitations FOR UPDATE USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: organization_invitations Organization admins can view invitation details; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can view invitation details" ON public.organization_invitations FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_verification_audit_log Organization admins can view verification logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins can view verification logs" ON public.esg_verification_audit_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.stakeholder_data_contributions sdc
     JOIN public.esg_data_requests edr ON ((sdc.data_request_id = edr.id)))
  WHERE ((sdc.id = esg_verification_audit_log.contribution_id) AND public.is_organization_admin(edr.organization_id, ( SELECT auth.uid() AS uid))))));


--
-- Name: organization_members Organization admins have full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization admins have full access" ON public.organization_members USING (public.check_org_admin(organization_id, auth.uid()));


--
-- Name: organizations Organization creators can update their organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization creators can update their organizations" ON public.organizations FOR UPDATE USING (((( SELECT auth.uid() AS uid) = created_by) OR (EXISTS ( SELECT 1
   FROM public.organization_members
  WHERE ((organization_members.organization_id = organizations.id) AND (organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.role = 'admin'::text) AND (organization_members.is_active = true))))));


--
-- Name: csr_initiatives Organization members can manage CSR initiatives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage CSR initiatives" ON public.csr_initiatives USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text, 'staff'::text])) AND (organization_members.is_active = true)))));


--
-- Name: esg_data_entries Organization members can manage ESG data entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage ESG data entries" ON public.esg_data_entries USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_goals Organization members can manage ESG goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage ESG goals" ON public.esg_goals USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: grants Organization members can manage grants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage grants" ON public.grants USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: corporate_partnerships Organization members can manage partnerships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage partnerships" ON public.corporate_partnerships USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: business_products Organization members can manage products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage products" ON public.business_products USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text, 'staff'::text])) AND (organization_members.is_active = true)))));


--
-- Name: employee_engagement Organization members can manage their engagement; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage their engagement" ON public.employee_engagement USING (((employee_id = auth.uid()) OR (organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text])) AND (organization_members.is_active = true))))));


--
-- Name: volunteer_opportunities Organization members can manage volunteer opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can manage volunteer opportunities" ON public.volunteer_opportunities USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: csr_initiatives Organization members can view CSR initiatives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view CSR initiatives" ON public.csr_initiatives FOR SELECT TO authenticated USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: organization_esg_data Organization members can view ESG data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view ESG data" ON public.organization_esg_data FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_recommendations Organization members can view ESG recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view ESG recommendations" ON public.esg_recommendations FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_reports Organization members can view ESG reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view ESG reports" ON public.esg_reports FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_risks Organization members can view ESG risks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view ESG risks" ON public.esg_risks FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_targets Organization members can view ESG targets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view ESG targets" ON public.esg_targets FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_announcements Organization members can view announcements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view announcements" ON public.esg_announcements FOR SELECT TO authenticated USING (((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))) OR (target_audience @> '["all"]'::jsonb)));


--
-- Name: volunteer_applications Organization members can view applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view applications" ON public.volunteer_applications FOR SELECT USING ((opportunity_id IN ( SELECT volunteer_opportunities.id
   FROM public.volunteer_opportunities
  WHERE (volunteer_opportunities.organization_id IN ( SELECT organization_members.organization_id
           FROM public.organization_members
          WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))))));


--
-- Name: business_products Organization members can view business products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view business products" ON public.business_products FOR SELECT TO authenticated USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: carbon_footprint_data Organization members can view carbon data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view carbon data" ON public.carbon_footprint_data FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_compliance_reports Organization members can view compliance reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view compliance reports" ON public.esg_compliance_reports FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_data_requests Organization members can view data requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view data requests" ON public.esg_data_requests FOR SELECT USING ((public.is_organization_member(organization_id, ( SELECT auth.uid() AS uid)) OR ((requested_from_org_id IS NOT NULL) AND public.is_organization_member(requested_from_org_id, ( SELECT auth.uid() AS uid)))));


--
-- Name: employee_engagement Organization members can view engagement; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view engagement" ON public.employee_engagement FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_initiatives Organization members can view initiatives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view initiatives" ON public.esg_initiatives FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: materiality_assessments Organization members can view materiality assessments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view materiality assessments" ON public.materiality_assessments FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: organizations Organization members can view organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view organizations" ON public.organizations FOR SELECT TO authenticated USING (((id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = ( SELECT auth.uid() AS uid)) AND (organization_members.is_active = true)))) OR (created_by = ( SELECT auth.uid() AS uid))));


--
-- Name: business_partnerships Organization members can view partnerships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view partnerships" ON public.business_partnerships FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: organization_preferences Organization members can view preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view preferences" ON public.organization_preferences FOR SELECT TO authenticated USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: esg_report_versions Organization members can view report versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view report versions" ON public.esg_report_versions FOR SELECT USING ((report_id IN ( SELECT er.id
   FROM (public.esg_reports er
     JOIN public.organization_members om ON ((er.organization_id = om.organization_id)))
  WHERE ((om.user_id = auth.uid()) AND (om.is_active = true)))));


--
-- Name: stakeholder_groups Organization members can view stakeholder groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view stakeholder groups" ON public.stakeholder_groups FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: stakeholder_engagement_metrics Organization members can view stakeholder metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can view stakeholder metrics" ON public.stakeholder_engagement_metrics FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: csr_opportunities Organizations can manage their opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizations can manage their opportunities" ON public.csr_opportunities USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: csr_lead_tracking Organizations can view their lead tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizations can view their lead tracking" ON public.csr_lead_tracking FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: campaign_sponsorships Organizations can view their sponsorships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizations can view their sponsorships" ON public.campaign_sponsorships FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: safe_space_messages Participants can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Participants can send messages" ON public.safe_space_messages FOR INSERT WITH CHECK ((session_id IN ( SELECT safe_space_sessions.id
   FROM public.safe_space_sessions
  WHERE ((safe_space_sessions.requester_id = auth.uid()) OR (safe_space_sessions.helper_id = auth.uid())))));


--
-- Name: safe_space_messages Participants can view messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Participants can view messages" ON public.safe_space_messages FOR SELECT USING (((session_id IN ( SELECT safe_space_sessions.id
   FROM public.safe_space_sessions
  WHERE ((safe_space_sessions.requester_id = auth.uid()) OR (safe_space_sessions.helper_id = auth.uid())))) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: story_updates Post authors can create story updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Post authors can create story updates" ON public.story_updates FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = story_updates.post_id) AND (p.author_id = auth.uid())))));


--
-- Name: help_completion_requests Post authors can manage completion requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Post authors can manage completion requests" ON public.help_completion_requests USING ((auth.uid() = requester_id));


--
-- Name: volunteer_interests Post authors can update volunteer interests status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Post authors can update volunteer interests status" ON public.volunteer_interests FOR UPDATE USING ((auth.uid() IN ( SELECT posts.author_id
   FROM public.posts
  WHERE (posts.id = volunteer_interests.post_id))));


--
-- Name: csr_opportunities Post authors can view opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Post authors can view opportunities" ON public.csr_opportunities FOR SELECT USING ((post_id IN ( SELECT posts.id
   FROM public.posts
  WHERE (posts.author_id = auth.uid()))));


--
-- Name: support_actions Post authors can view support actions on their posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Post authors can view support actions on their posts" ON public.support_actions FOR SELECT USING ((auth.uid() IN ( SELECT posts.author_id
   FROM public.posts
  WHERE (posts.id = support_actions.post_id))));


--
-- Name: volunteer_interests Post authors can view volunteer interests on their posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Post authors can view volunteer interests on their posts" ON public.volunteer_interests FOR SELECT USING ((auth.uid() IN ( SELECT posts.author_id
   FROM public.posts
  WHERE (posts.id = volunteer_interests.post_id))));


--
-- Name: organization_invitations Prevent invitation token enumeration; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Prevent invitation token enumeration" ON public.organization_invitations FOR SELECT USING (false);


--
-- Name: campaign_updates Public campaign updates are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public campaign updates are viewable by everyone" ON public.campaign_updates FOR SELECT USING (((is_public = true) AND (campaign_id IN ( SELECT campaigns.id
   FROM public.campaigns
  WHERE ((campaigns.visibility = 'public'::text) AND (campaigns.status = 'active'::text))))));


--
-- Name: campaigns Public campaigns are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (((visibility = 'public'::text) AND (status = 'active'::text)));


--
-- Name: demo_requests Public can insert demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can insert demo requests" ON public.demo_requests FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: safe_space_reference_checks Public can update reference check by token; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can update reference check by token" ON public.safe_space_reference_checks FOR UPDATE USING (((status = 'pending'::text) AND (expires_at > now())));


--
-- Name: safe_space_reference_checks Public can view reference check by token; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view reference check by token" ON public.safe_space_reference_checks FOR SELECT USING (true);


--
-- Name: safe_space_helpers Public can view verified helpers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view verified helpers" ON public.safe_space_helpers FOR SELECT USING ((verification_status = 'verified'::text));


--
-- Name: impact_activities Recipients can confirm volunteer work; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Recipients can confirm volunteer work" ON public.impact_activities FOR UPDATE USING (((confirmation_status = 'pending'::text) AND (((organization_id IS NOT NULL) AND (organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text])))))) OR ((post_id IS NOT NULL) AND (post_id IN ( SELECT posts.id
   FROM public.posts
  WHERE (posts.author_id = auth.uid()))))))) WITH CHECK ((confirmation_status = ANY (ARRAY['confirmed'::text, 'rejected'::text])));


--
-- Name: impact_activities Recipients can view volunteer work awaiting confirmation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Recipients can view volunteer work awaiting confirmation" ON public.impact_activities FOR SELECT USING (((confirmation_status = 'pending'::text) AND (((organization_id IS NOT NULL) AND (organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text, 'manager'::text])))))) OR ((post_id IS NOT NULL) AND (post_id IN ( SELECT posts.id
   FROM public.posts
  WHERE (posts.author_id = auth.uid())))))));


--
-- Name: safeguarding_roles Safeguarding leads can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding leads can manage roles" ON public.safeguarding_roles USING ((EXISTS ( SELECT 1
   FROM public.safeguarding_roles sr
  WHERE ((sr.user_id = auth.uid()) AND (sr.role = 'safeguarding_lead'::public.safeguarding_role) AND (sr.is_active = true)))));


--
-- Name: safeguarding_roles Safeguarding leads can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding leads can view all roles" ON public.safeguarding_roles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.safeguarding_roles sr
  WHERE ((sr.user_id = auth.uid()) AND (sr.role = 'safeguarding_lead'::public.safeguarding_role) AND (sr.is_active = true)))));


--
-- Name: safe_space_flagged_keywords Safeguarding staff can manage keywords; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding staff can manage keywords" ON public.safe_space_flagged_keywords USING (public.is_safeguarding_staff(auth.uid()));


--
-- Name: safe_space_emergency_alerts Safeguarding staff can update alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding staff can update alerts" ON public.safe_space_emergency_alerts FOR UPDATE USING (public.is_safeguarding_staff(auth.uid()));


--
-- Name: safe_space_helper_applications Safeguarding staff can update applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding staff can update applications" ON public.safe_space_helper_applications FOR UPDATE USING ((public.is_admin(auth.uid()) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: safe_space_verification_documents Safeguarding staff can update documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding staff can update documents" ON public.safe_space_verification_documents FOR UPDATE USING ((public.is_admin(auth.uid()) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: safe_space_emergency_alerts Safeguarding staff can view alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding staff can view alerts" ON public.safe_space_emergency_alerts FOR SELECT USING (public.is_safeguarding_staff(auth.uid()));


--
-- Name: safe_space_helper_applications Safeguarding staff can view all applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding staff can view all applications" ON public.safe_space_helper_applications FOR SELECT USING (((user_id = auth.uid()) OR public.is_admin(auth.uid()) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: safe_space_audit_log Safeguarding staff can view audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Safeguarding staff can view audit logs" ON public.safe_space_audit_log FOR SELECT USING (public.is_safeguarding_staff(auth.uid()));


--
-- Name: security_audit_log Service role can insert audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert audit logs" ON public.security_audit_log FOR INSERT TO service_role WITH CHECK (true);


--
-- Name: user_activities Service role can manage all activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage all activities" ON public.user_activities TO service_role USING (true);


--
-- Name: rate_limit_buckets Service role can manage rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage rate limits" ON public.rate_limit_buckets TO service_role USING (true);


--
-- Name: safe_space_messages Session participants can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Session participants can send messages" ON public.safe_space_messages FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.safe_space_sessions s
  WHERE ((s.id = safe_space_messages.session_id) AND ((s.requester_id = auth.uid()) OR (s.helper_id = auth.uid()))))));


--
-- Name: safe_space_messages Session participants can view messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Session participants can view messages" ON public.safe_space_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.safe_space_sessions s
  WHERE ((s.id = safe_space_messages.session_id) AND ((s.requester_id = auth.uid()) OR (s.helper_id = auth.uid()))))));


--
-- Name: user_badges System can award badges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can award badges" ON public.user_badges FOR INSERT WITH CHECK (true);


--
-- Name: safe_space_emergency_alerts System can create alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create alerts" ON public.safe_space_emergency_alerts FOR INSERT WITH CHECK (true);


--
-- Name: subscription_admin_actions System can create audit log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create audit log" ON public.subscription_admin_actions FOR INSERT WITH CHECK (true);


--
-- Name: badge_award_log System can create badge awards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create badge awards" ON public.badge_award_log FOR INSERT WITH CHECK (true);


--
-- Name: point_decay_log System can create decay log entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create decay log entries" ON public.point_decay_log FOR INSERT WITH CHECK (true);


--
-- Name: fraud_detection_log System can create fraud detection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create fraud detection entries" ON public.fraud_detection_log FOR INSERT WITH CHECK (true);


--
-- Name: volunteer_work_notifications System can create notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create notifications" ON public.volunteer_work_notifications FOR INSERT WITH CHECK (true);


--
-- Name: red_flags System can create red flags; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create red flags" ON public.red_flags FOR INSERT WITH CHECK (true);


--
-- Name: user_achievements System can insert achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);


--
-- Name: demo_request_activity_log System can insert activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert activity logs" ON public.demo_request_activity_log FOR INSERT WITH CHECK (true);


--
-- Name: campaign_analytics System can insert analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert analytics" ON public.campaign_analytics FOR INSERT WITH CHECK (true);


--
-- Name: admin_action_log System can insert audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert audit logs" ON public.admin_action_log FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = admin_id));


--
-- Name: safe_space_audit_log System can insert audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert audit logs" ON public.safe_space_audit_log FOR INSERT WITH CHECK (true);


--
-- Name: verification_document_audit System can insert audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert audit logs" ON public.verification_document_audit FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: notification_delivery_log System can insert delivery logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert delivery logs" ON public.notification_delivery_log FOR INSERT WITH CHECK (true);


--
-- Name: language_detection_cache System can insert detection cache; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert detection cache" ON public.language_detection_cache FOR INSERT WITH CHECK (true);


--
-- Name: campaign_donations System can insert donations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert donations" ON public.campaign_donations FOR INSERT WITH CHECK (true);


--
-- Name: campaign_engagement System can insert engagement; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert engagement" ON public.campaign_engagement FOR INSERT WITH CHECK (true);


--
-- Name: campaign_geographic_impact System can insert geographic data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert geographic data" ON public.campaign_geographic_impact FOR INSERT WITH CHECK (true);


--
-- Name: csr_lead_tracking System can insert lead tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert lead tracking" ON public.csr_lead_tracking FOR INSERT WITH CHECK (true);


--
-- Name: campaign_predictions System can insert predictions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert predictions" ON public.campaign_predictions FOR INSERT WITH CHECK (true);


--
-- Name: campaign_social_metrics System can insert social metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert social metrics" ON public.campaign_social_metrics FOR INSERT WITH CHECK (true);


--
-- Name: content_translations System can insert translations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert translations" ON public.content_translations FOR INSERT WITH CHECK (true);


--
-- Name: esg_verification_audit_log System can insert verification audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert verification audit logs" ON public.esg_verification_audit_log FOR INSERT WITH CHECK (true);


--
-- Name: message_access_log System can log message access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can log message access" ON public.message_access_log FOR INSERT WITH CHECK (true);


--
-- Name: url_previews System can manage URL previews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage URL previews" ON public.url_previews TO authenticated USING (true) WITH CHECK (true);


--
-- Name: recommendation_cache System can manage recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage recommendations" ON public.recommendation_cache USING (true);


--
-- Name: relive_stories System can manage relive stories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage relive stories" ON public.relive_stories USING (true) WITH CHECK (true);


--
-- Name: story_participants System can manage story participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage story participants" ON public.story_participants USING (true) WITH CHECK (true);


--
-- Name: organization_trust_scores System can manage trust scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage trust scores" ON public.organization_trust_scores USING (false) WITH CHECK (false);


--
-- Name: safe_space_flagged_keywords System can read keywords; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can read keywords" ON public.safe_space_flagged_keywords FOR SELECT USING (true);


--
-- Name: impact_metrics System functions can manage impact metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System functions can manage impact metrics" ON public.impact_metrics USING (((current_setting('role'::text) = 'service_role'::text) OR (auth.role() = 'service_role'::text)));


--
-- Name: ai_endpoint_rate_limits System manages rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System manages rate limits" ON public.ai_endpoint_rate_limits USING (false) WITH CHECK (false);


--
-- Name: organization_team_members Team members can view their organization members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Team members can view their organization members" ON public.organization_team_members FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))));


--
-- Name: organization_members Users and admins can update memberships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users and admins can update memberships" ON public.organization_members FOR UPDATE USING (((auth.uid() = user_id) OR public.check_org_admin(organization_id, auth.uid())));


--
-- Name: comment_likes Users can add their own comment likes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can add their own comment likes" ON public.comment_likes FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: conversation_participants Users can add themselves to conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can add themselves to conversations" ON public.conversation_participants FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: group_members Users can add themselves to groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can add themselves to groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: volunteer_applications Users can create applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create applications" ON public.volunteer_applications FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_blocks Users can create blocks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create blocks" ON public.user_blocks FOR INSERT WITH CHECK ((auth.uid() = blocker_id));


--
-- Name: campaign_interactions Users can create campaign interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create campaign interactions" ON public.campaign_interactions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: campaigns Users can create campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create campaigns" ON public.campaigns FOR INSERT WITH CHECK ((auth.uid() = creator_id));


--
-- Name: groups Users can create groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create groups" ON public.groups FOR INSERT WITH CHECK ((auth.uid() = admin_id));


--
-- Name: post_interactions Users can create interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create interactions" ON public.post_interactions FOR INSERT TO authenticated WITH CHECK (((auth.uid() = user_id) OR ((organization_id IS NOT NULL) AND public.is_org_member(organization_id, auth.uid()))));


--
-- Name: campaign_interactions Users can create org campaign interactions if member; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create org campaign interactions if member" ON public.campaign_interactions FOR INSERT WITH CHECK (((auth.uid() = user_id) AND ((organization_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.organization_members
  WHERE ((organization_members.organization_id = campaign_interactions.organization_id) AND (organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))))));


--
-- Name: POLICY "Users can create org campaign interactions if member" ON campaign_interactions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Users can create org campaign interactions if member" ON public.campaign_interactions IS 'Validates that users can only create campaign interactions on behalf of organizations they are active members of. Prevents organization impersonation attacks.';


--
-- Name: post_interactions Users can create org interactions if member; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create org interactions if member" ON public.post_interactions FOR INSERT WITH CHECK (((auth.uid() = user_id) AND ((organization_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.organization_members
  WHERE ((organization_members.organization_id = post_interactions.organization_id) AND (organization_members.user_id = auth.uid()) AND (organization_members.is_active = true)))))));


--
-- Name: POLICY "Users can create org interactions if member" ON post_interactions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Users can create org interactions if member" ON public.post_interactions IS 'Validates that users can only create interactions on behalf of organizations they are active members of. Prevents organization impersonation attacks.';


--
-- Name: organizations Users can create organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create organizations" ON public.organizations FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = created_by));


--
-- Name: campaign_interactions Users can create personal campaign interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create personal campaign interactions" ON public.campaign_interactions FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (organization_id IS NULL)));


--
-- Name: post_interactions Users can create personal interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create personal interactions" ON public.post_interactions FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (organization_id IS NULL)));


--
-- Name: posts Users can create posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (((auth.uid() = author_id) OR ((organization_id IS NOT NULL) AND public.is_org_admin(organization_id, auth.uid()))));


--
-- Name: point_redemptions Users can create redemptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create redemptions" ON public.point_redemptions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: safe_space_reference_checks Users can create reference checks for their application; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create reference checks for their application" ON public.safe_space_reference_checks FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.safe_space_helper_applications
  WHERE ((safe_space_helper_applications.id = safe_space_reference_checks.application_id) AND (safe_space_helper_applications.user_id = auth.uid())))));


--
-- Name: reports Users can create reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK ((auth.uid() = reporter_id));


--
-- Name: organization_reviews Users can create reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create reviews" ON public.organization_reviews FOR INSERT WITH CHECK ((auth.uid() = reviewer_id));


--
-- Name: scheduled_notifications Users can create scheduled notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create scheduled notifications" ON public.scheduled_notifications FOR INSERT WITH CHECK ((auth.uid() = sender_id));


--
-- Name: safe_space_sessions Users can create sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create sessions" ON public.safe_space_sessions FOR INSERT WITH CHECK ((auth.uid() = requester_id));


--
-- Name: support_actions Users can create support actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create support actions" ON public.support_actions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_activities Users can create their activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their activities" ON public.user_activities FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_activities Users can create their own activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own activities" ON public.user_activities FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: content_appeals Users can create their own appeals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own appeals" ON public.content_appeals FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: safe_space_helper_applications Users can create their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own applications" ON public.safe_space_helper_applications FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: impact_activities Users can create their own impact activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own impact activities" ON public.impact_activities FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: impact_goals Users can create their own impact goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own impact goals" ON public.impact_goals FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_interaction_scores Users can create their own interaction scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own interaction scores" ON public.user_interaction_scores FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: platform_payments Users can create their own payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own payments" ON public.platform_payments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: post_reactions Users can create their own post reactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own post reactions" ON public.post_reactions FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: questionnaire_responses Users can create their own questionnaire responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own questionnaire responses" ON public.questionnaire_responses FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: safe_space_helper_training_progress Users can create their own training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own training progress" ON public.safe_space_helper_training_progress FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_verifications Users can create their own verifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own verifications" ON public.user_verifications FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: volunteer_interests Users can create volunteer interests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create volunteer interests" ON public.volunteer_interests FOR INSERT WITH CHECK ((auth.uid() = volunteer_id));


--
-- Name: campaign_interactions Users can delete own campaign interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own campaign interactions" ON public.campaign_interactions FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: organization_reviews Users can delete own reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own reviews" ON public.organization_reviews FOR DELETE USING ((auth.uid() = reviewer_id));


--
-- Name: tutorial_preferences Users can delete own tutorial preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own tutorial preferences" ON public.tutorial_preferences FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_tutorial_progress Users can delete own tutorial progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own tutorial progress" ON public.user_tutorial_progress FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_blocks Users can delete their own blocks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own blocks" ON public.user_blocks FOR DELETE USING ((auth.uid() = blocker_id));


--
-- Name: campaign_interactions Users can delete their own campaign interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own campaign interactions" ON public.campaign_interactions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: impact_goals Users can delete their own impact goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own impact goals" ON public.impact_goals FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: post_interactions Users can delete their own interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own interactions" ON public.post_interactions FOR DELETE TO authenticated USING (((auth.uid() = user_id) OR ((organization_id IS NOT NULL) AND public.is_org_admin(organization_id, auth.uid()))));


--
-- Name: post_reactions Users can delete their own post reactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own post reactions" ON public.post_reactions FOR DELETE USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: posts Users can delete their own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE TO authenticated USING (((auth.uid() = author_id) OR ((organization_id IS NOT NULL) AND public.is_org_admin(organization_id, auth.uid()))));


--
-- Name: safe_space_verification_documents Users can delete their own unverified documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own unverified documents" ON public.safe_space_verification_documents FOR DELETE USING (((auth.uid() = user_id) AND (verification_status = 'pending'::text)));


--
-- Name: scheduled_notifications Users can delete their scheduled notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their scheduled notifications" ON public.scheduled_notifications FOR DELETE USING ((auth.uid() = sender_id));


--
-- Name: organization_followers Users can follow organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can follow organizations" ON public.organization_followers FOR INSERT WITH CHECK ((auth.uid() = follower_id));


--
-- Name: user_presence Users can insert own presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own presence" ON public.user_presence FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: tutorial_preferences Users can insert own tutorial preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own tutorial preferences" ON public.tutorial_preferences FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_tutorial_progress Users can insert own tutorial progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own tutorial progress" ON public.user_tutorial_progress FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: impact_activities Users can insert their own activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own activities" ON public.impact_activities FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: notification_analytics Users can insert their own analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own analytics" ON public.notification_analytics FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: platform_feedback Users can insert their own feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own feedback" ON public.platform_feedback FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: impact_metrics Users can insert their own impact metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own impact metrics" ON public.impact_metrics FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_language_preferences Users can insert their own language preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own language preferences" ON public.user_language_preferences FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_subscriptions Users can insert their own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: trust_domains Users can insert their own trust domains; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own trust domains" ON public.trust_domains FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: verification_documents Users can insert their own verification documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own verification documents" ON public.verification_documents FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: group_members Users can join groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: organization_members Users can join via invitation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can join via invitation" ON public.organization_members FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: group_members Users can leave groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: group_members Users can leave groups they joined; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can leave groups they joined" ON public.group_members FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: organization_members Users can leave organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can leave organizations" ON public.organization_members FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: user_preferences Users can manage own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own preferences" ON public.user_preferences USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: evidence_submissions Users can manage their own evidence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own evidence" ON public.evidence_submissions USING ((auth.uid() = user_id));


--
-- Name: notification_filters Users can manage their own filters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own filters" ON public.notification_filters USING ((auth.uid() = user_id));


--
-- Name: safe_space_queue Users can manage their queue position; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their queue position" ON public.safe_space_queue USING ((auth.uid() = requester_id));


--
-- Name: typing_indicators Users can manage their typing status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their typing status" ON public.typing_indicators USING (((auth.uid() = user_id) OR (auth.uid() = conversation_partner_id)));


--
-- Name: url_previews Users can read URL previews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read URL previews" ON public.url_previews FOR SELECT TO authenticated USING (true);


--
-- Name: user_presence Users can read presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read presence" ON public.user_presence FOR SELECT USING (true);


--
-- Name: comment_likes Users can remove their own comment likes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can remove their own comment likes" ON public.comment_likes FOR DELETE USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: conversation_participants Users can remove themselves from conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can remove themselves from conversations" ON public.conversation_participants FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: group_members Users can remove themselves from groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can remove themselves from groups" ON public.group_members FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: content_reports Users can submit reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can submit reports" ON public.content_reports FOR INSERT TO authenticated WITH CHECK ((auth.uid() = reported_by));


--
-- Name: organization_followers Users can unfollow organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can unfollow organizations" ON public.organization_followers FOR DELETE USING ((auth.uid() = follower_id));


--
-- Name: campaign_interactions Users can update own campaign interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own campaign interactions" ON public.campaign_interactions FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: organization_members Users can update own membership; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own membership" ON public.organization_members FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_presence Users can update own presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own presence" ON public.user_presence FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: organization_reviews Users can update own reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own reviews" ON public.organization_reviews FOR UPDATE USING ((auth.uid() = reviewer_id));


--
-- Name: tutorial_preferences Users can update own tutorial preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own tutorial preferences" ON public.tutorial_preferences FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_tutorial_progress Users can update own tutorial progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own tutorial progress" ON public.user_tutorial_progress FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: organization_followers Users can update their follow settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their follow settings" ON public.organization_followers FOR UPDATE USING ((auth.uid() = follower_id));


--
-- Name: campaign_interactions Users can update their own campaign interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own campaign interactions" ON public.campaign_interactions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: campaigns Users can update their own campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own campaigns" ON public.campaigns FOR UPDATE USING ((auth.uid() = creator_id));


--
-- Name: safe_space_helper_applications Users can update their own draft applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own draft applications" ON public.safe_space_helper_applications FOR UPDATE USING (((auth.uid() = user_id) AND (application_status = ANY (ARRAY['draft'::text, 'submitted'::text]))));


--
-- Name: impact_goals Users can update their own impact goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own impact goals" ON public.impact_goals FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: impact_metrics Users can update their own impact metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own impact metrics" ON public.impact_metrics FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: post_interactions Users can update their own interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own interactions" ON public.post_interactions FOR UPDATE TO authenticated USING (((auth.uid() = user_id) OR ((organization_id IS NOT NULL) AND public.is_org_admin(organization_id, auth.uid())))) WITH CHECK (((auth.uid() = user_id) OR ((organization_id IS NOT NULL) AND public.is_org_admin(organization_id, auth.uid()))));


--
-- Name: user_language_preferences Users can update their own language preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own language preferences" ON public.user_language_preferences FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: group_members Users can update their own membership; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own membership" ON public.group_members FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: volunteer_work_notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own notifications" ON public.volunteer_work_notifications FOR UPDATE USING ((auth.uid() = recipient_id)) WITH CHECK ((auth.uid() = recipient_id));


--
-- Name: conversation_participants Users can update their own participation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own participation" ON public.conversation_participants FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: post_reactions Users can update their own post reactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own post reactions" ON public.post_reactions FOR UPDATE USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: posts Users can update their own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE TO authenticated USING (((auth.uid() = author_id) OR ((organization_id IS NOT NULL) AND public.is_org_admin(organization_id, auth.uid())))) WITH CHECK (((auth.uid() = author_id) OR ((organization_id IS NOT NULL) AND public.is_org_admin(organization_id, auth.uid()))));


--
-- Name: user_privacy_settings Users can update their own privacy settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own privacy settings" ON public.user_privacy_settings USING ((auth.uid() = user_id));


--
-- Name: user_challenge_progress Users can update their own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own progress" ON public.user_challenge_progress USING ((auth.uid() = user_id));


--
-- Name: questionnaire_responses Users can update their own questionnaire responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own questionnaire responses" ON public.questionnaire_responses FOR UPDATE USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_subscriptions Users can update their own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions FOR UPDATE USING (((auth.uid() = user_id) OR (organisation_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = ANY (ARRAY['admin'::text, 'owner'::text])) AND (organization_members.is_active = true))))));


--
-- Name: safe_space_helper_training_progress Users can update their own training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own training progress" ON public.safe_space_helper_training_progress FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: trust_domains Users can update their own trust domains; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own trust domains" ON public.trust_domains FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_verifications Users can update their own verifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own verifications" ON public.user_verifications FOR UPDATE USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: volunteer_interests Users can update their own volunteer interests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own volunteer interests" ON public.volunteer_interests FOR UPDATE USING ((auth.uid() = volunteer_id));


--
-- Name: scheduled_notifications Users can update their scheduled notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their scheduled notifications" ON public.scheduled_notifications FOR UPDATE USING (((auth.uid() = sender_id) OR (auth.uid() = recipient_id)));


--
-- Name: safe_space_verification_documents Users can upload their own documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can upload their own documents" ON public.safe_space_verification_documents FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: comment_likes Users can view comment likes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view comment likes" ON public.comment_likes FOR SELECT USING (true);


--
-- Name: organization_followers Users can view followers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view followers" ON public.organization_followers FOR SELECT USING (true);


--
-- Name: group_members Users can view group memberships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view group memberships" ON public.group_members FOR SELECT USING (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM public.groups
  WHERE ((groups.id = group_members.group_id) AND (NOT groups.is_private))))));


--
-- Name: campaign_invitations Users can view invitations sent to them; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view invitations sent to them" ON public.campaign_invitations FOR SELECT USING (((auth.uid() = inviter_id) OR (auth.uid() = invitee_id) OR (auth.email() = invitee_email)));


--
-- Name: language_detection_cache Users can view language detection cache; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view language detection cache" ON public.language_detection_cache FOR SELECT USING (true);


--
-- Name: impact_metrics Users can view only their own impact metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view only their own impact metrics" ON public.impact_metrics FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: organization_members Users can view org member list if they are members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view org member list if they are members" ON public.organization_members FOR SELECT TO authenticated USING (public.is_org_member(organization_id, auth.uid()));


--
-- Name: organization_members Users can view organization members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view organization members" ON public.organization_members FOR SELECT USING (((is_public = true) OR (user_id = auth.uid()) OR public.check_org_member(organization_id, auth.uid())));


--
-- Name: safe_space_helper_training_progress Users can view own training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own training progress" ON public.safe_space_helper_training_progress FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: tutorial_preferences Users can view own tutorial preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own tutorial preferences" ON public.tutorial_preferences FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_tutorial_progress Users can view own tutorial progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own tutorial progress" ON public.user_tutorial_progress FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: story_participants Users can view participants for stories they're involved with; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view participants for stories they're involved with" ON public.story_participants FOR SELECT USING (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.story_participants sp2
  WHERE ((sp2.post_id = story_participants.post_id) AND (sp2.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = story_participants.post_id) AND (p.visibility = 'public'::text))))));


--
-- Name: groups Users can view public groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view public groups" ON public.groups FOR SELECT USING (((is_private = false) OR (auth.uid() = admin_id)));


--
-- Name: post_reactions Users can view relevant post reactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view relevant post reactions" ON public.post_reactions FOR SELECT USING (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) IN ( SELECT posts.author_id
   FROM public.posts
  WHERE (posts.id = post_reactions.post_id)))));


--
-- Name: relive_stories Users can view relive stories they're involved with; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view relive stories they're involved with" ON public.relive_stories FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.story_participants sp
  WHERE ((sp.post_id = relive_stories.post_id) AND (sp.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = relive_stories.post_id) AND (p.visibility = 'public'::text))))));


--
-- Name: story_updates Users can view story updates for posts they're involved with; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view story updates for posts they're involved with" ON public.story_updates FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.story_participants sp
  WHERE ((sp.post_id = story_updates.post_id) AND (sp.user_id = auth.uid())))) OR (author_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = story_updates.post_id) AND (p.visibility = 'public'::text))))));


--
-- Name: conversations Users can view their conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.conversation_participants cp
  WHERE ((cp.conversation_id = conversations.id) AND (cp.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: notification_analytics Users can view their own analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own analytics" ON public.notification_analytics FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: content_appeals Users can view their own appeals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own appeals" ON public.content_appeals FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: safe_space_helper_applications Users can view their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own applications" ON public.safe_space_helper_applications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: volunteer_applications Users can view their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own applications" ON public.volunteer_applications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: badge_award_log Users can view their own badge awards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own badge awards" ON public.badge_award_log FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_blocks Users can view their own blocks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own blocks" ON public.user_blocks FOR SELECT USING ((auth.uid() = blocker_id));


--
-- Name: campaigns Users can view their own campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own campaigns" ON public.campaigns FOR SELECT USING ((auth.uid() = creator_id));


--
-- Name: conversation_participants Users can view their own conversation participation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own conversation participation" ON public.conversation_participants FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: point_decay_log Users can view their own decay log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own decay log" ON public.point_decay_log FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notification_delivery_log Users can view their own delivery logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own delivery logs" ON public.notification_delivery_log FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: safe_space_verification_documents Users can view their own documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own documents" ON public.safe_space_verification_documents FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: platform_feedback Users can view their own feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own feedback" ON public.platform_feedback FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: group_members Users can view their own group membership; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own group membership" ON public.group_members FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: impact_activities Users can view their own impact activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own impact activities" ON public.impact_activities FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: impact_goals Users can view their own impact goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own impact goals" ON public.impact_goals FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_interaction_scores Users can view their own interaction scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own interaction scores" ON public.user_interaction_scores FOR SELECT USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_language_preferences Users can view their own language preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own language preferences" ON public.user_language_preferences FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: organization_members Users can view their own memberships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own memberships" ON public.organization_members FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: volunteer_work_notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.volunteer_work_notifications FOR SELECT USING (((auth.uid() = recipient_id) OR (auth.uid() = volunteer_id)));


--
-- Name: platform_payments Users can view their own payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own payments" ON public.platform_payments FOR SELECT USING (((auth.uid() = user_id) OR (organisation_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true))))));


--
-- Name: user_preferences Users can view their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_privacy_settings Users can view their own privacy settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own privacy settings" ON public.user_privacy_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_challenge_progress Users can view their own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own progress" ON public.user_challenge_progress FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: questionnaire_responses Users can view their own questionnaire responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own questionnaire responses" ON public.questionnaire_responses FOR SELECT USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: rate_limit_buckets Users can view their own rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own rate limits" ON public.rate_limit_buckets FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: recommendation_cache Users can view their own recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own recommendations" ON public.recommendation_cache FOR SELECT USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: red_flags Users can view their own red flags; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own red flags" ON public.red_flags FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: point_redemptions Users can view their own redemptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own redemptions" ON public.point_redemptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: safe_space_reference_checks Users can view their own reference checks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own reference checks" ON public.safe_space_reference_checks FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.safe_space_helper_applications
  WHERE ((safe_space_helper_applications.id = safe_space_reference_checks.application_id) AND (safe_space_helper_applications.user_id = auth.uid())))));


--
-- Name: content_reports Users can view their own reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own reports" ON public.content_reports FOR SELECT TO authenticated USING ((auth.uid() = reported_by));


--
-- Name: reports Users can view their own reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own reports" ON public.reports FOR SELECT USING ((auth.uid() = reporter_id));


--
-- Name: safe_space_sessions Users can view their own sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own sessions" ON public.safe_space_sessions FOR SELECT USING (((auth.uid() = requester_id) OR (auth.uid() = helper_id) OR public.is_safeguarding_staff(auth.uid())));


--
-- Name: newsletter_subscribers Users can view their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own subscription" ON public.newsletter_subscribers FOR SELECT USING (((auth.email() = email) OR public.is_admin(auth.uid())));


--
-- Name: newsletter_subscriptions Users can view their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own subscription" ON public.newsletter_subscriptions FOR SELECT USING ((email = auth.email()));


--
-- Name: user_subscriptions Users can view their own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions FOR SELECT USING (((auth.uid() = user_id) OR (organisation_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.is_active = true))))));


--
-- Name: support_actions Users can view their own support actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own support actions" ON public.support_actions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: trust_domains Users can view their own trust domains; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own trust domains" ON public.trust_domains FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: trust_score_history Users can view their own trust score history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own trust score history" ON public.trust_score_history FOR SELECT USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: verification_documents Users can view their own verification documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own verification documents" ON public.verification_documents FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_verifications Users can view their own verifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own verifications" ON public.user_verifications FOR SELECT USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: volunteer_interests Users can view their own volunteer interests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own volunteer interests" ON public.volunteer_interests FOR SELECT USING ((auth.uid() = volunteer_id));


--
-- Name: payment_references Users can view their payment references; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their payment references" ON public.payment_references FOR SELECT USING ((payment_id IN ( SELECT platform_payments.id
   FROM public.platform_payments
  WHERE (platform_payments.user_id = auth.uid()))));


--
-- Name: scheduled_notifications Users can view their scheduled notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their scheduled notifications" ON public.scheduled_notifications FOR SELECT USING (((auth.uid() = recipient_id) OR (auth.uid() = sender_id)));


--
-- Name: content_translations Users can view translations for accessible content; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view translations for accessible content" ON public.content_translations FOR SELECT USING (true);


--
-- Name: admin_action_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_roles admin_roles_admin_all_fixed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_roles_admin_all_fixed ON public.admin_roles TO authenticated USING (public.is_admin_raw(auth.uid())) WITH CHECK (public.is_admin_raw(auth.uid()));


--
-- Name: admin_roles admin_roles_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_roles_select_own ON public.admin_roles FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: advertising_bookings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.advertising_bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_endpoint_rate_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_endpoint_rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: badge_award_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.badge_award_log ENABLE ROW LEVEL SECURITY;

--
-- Name: badges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: business_partnerships; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.business_partnerships ENABLE ROW LEVEL SECURITY;

--
-- Name: business_products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.business_products ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_analytics campaign_analytics_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_analytics_select ON public.campaign_analytics FOR SELECT USING ((public.is_campaign_creator(campaign_id, auth.uid()) OR public.is_campaign_participant(campaign_id, auth.uid())));


--
-- Name: campaign_detailed_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_detailed_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_detailed_analytics campaign_detailed_analytics_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_detailed_analytics_select ON public.campaign_detailed_analytics FOR SELECT USING (public.is_campaign_creator(campaign_id, auth.uid()));


--
-- Name: campaign_donations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_donations ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_donations campaign_donations_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_donations_delete ON public.campaign_donations FOR DELETE USING (((donor_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_donations.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaign_donations campaign_donations_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_donations_insert ON public.campaign_donations FOR INSERT WITH CHECK ((donor_id = auth.uid()));


--
-- Name: campaign_donations campaign_donations_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_donations_select ON public.campaign_donations FOR SELECT USING (((donor_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_donations.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaign_donations campaign_donations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_donations_update ON public.campaign_donations FOR UPDATE USING (((donor_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_donations.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text]))))))) WITH CHECK (((donor_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_donations.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaign_engagement; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_engagement ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_geographic_impact; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_geographic_impact ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_geographic_impact campaign_geographic_impact_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_geographic_impact_select ON public.campaign_geographic_impact FOR SELECT USING (public.is_campaign_creator(campaign_id, auth.uid()));


--
-- Name: campaign_interactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_interactions ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_interactions campaign_interactions_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_interactions_delete ON public.campaign_interactions FOR DELETE USING (((user_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid())));


--
-- Name: campaign_interactions campaign_interactions_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_interactions_insert ON public.campaign_interactions FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: campaign_interactions campaign_interactions_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_interactions_select ON public.campaign_interactions FOR SELECT USING (((user_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()) OR public.is_campaign_participant(campaign_id, auth.uid())));


--
-- Name: campaign_interactions campaign_interactions_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_interactions_update ON public.campaign_interactions FOR UPDATE USING (((user_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()))) WITH CHECK (((user_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid())));


--
-- Name: campaign_invitations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_invitations ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_invitations campaign_invitations_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_invitations_delete ON public.campaign_invitations FOR DELETE USING (((inviter_id = auth.uid()) OR (invitee_id = auth.uid()) OR (lower(invitee_email) = lower((auth.jwt() ->> 'email'::text))) OR public.is_campaign_creator(campaign_id, auth.uid())));


--
-- Name: campaign_invitations campaign_invitations_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_invitations_insert ON public.campaign_invitations FOR INSERT WITH CHECK (((inviter_id = auth.uid()) AND (public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_invitations.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text]))))))));


--
-- Name: campaign_invitations campaign_invitations_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_invitations_select ON public.campaign_invitations FOR SELECT USING (((inviter_id = auth.uid()) OR (invitee_id = auth.uid()) OR (lower(invitee_email) = lower((auth.jwt() ->> 'email'::text))) OR public.is_campaign_creator(campaign_id, auth.uid())));


--
-- Name: campaign_invitations campaign_invitations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_invitations_update ON public.campaign_invitations FOR UPDATE USING (((inviter_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()))) WITH CHECK (((inviter_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid())));


--
-- Name: campaign_participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_participants campaign_participants_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_participants_opt ON public.campaign_participants TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: campaign_predictions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_predictions ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_promotions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_promotions ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_promotions campaign_promotions_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_promotions_delete ON public.campaign_promotions FOR DELETE USING ((public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_promotions.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaign_promotions campaign_promotions_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_promotions_insert ON public.campaign_promotions FOR INSERT WITH CHECK ((public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_promotions.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaign_promotions campaign_promotions_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_promotions_select ON public.campaign_promotions FOR SELECT USING ((public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_promotions.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaign_promotions campaign_promotions_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_promotions_update ON public.campaign_promotions FOR UPDATE USING ((public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_promotions.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text]))))))) WITH CHECK ((public.is_campaign_creator(campaign_id, auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaign_promotions.campaign_id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: campaign_social_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_social_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_social_metrics campaign_social_metrics_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_social_metrics_select ON public.campaign_social_metrics FOR SELECT USING (public.is_campaign_creator(campaign_id, auth.uid()));


--
-- Name: campaign_sponsorships; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_sponsorships ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_updates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_updates ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_updates campaign_updates_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_updates_delete ON public.campaign_updates FOR DELETE USING (((author_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid())));


--
-- Name: campaign_updates campaign_updates_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_updates_insert ON public.campaign_updates FOR INSERT WITH CHECK (((author_id = auth.uid()) AND (public.is_campaign_creator(campaign_id, auth.uid()) OR public.is_campaign_participant(campaign_id, auth.uid()))));


--
-- Name: campaign_updates campaign_updates_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_updates_select ON public.campaign_updates FOR SELECT USING (((author_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()) OR public.is_campaign_participant(campaign_id, auth.uid())));


--
-- Name: campaign_updates campaign_updates_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaign_updates_update ON public.campaign_updates FOR UPDATE USING (((author_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid()))) WITH CHECK (((author_id = auth.uid()) OR public.is_campaign_creator(campaign_id, auth.uid())));


--
-- Name: campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: campaigns campaigns_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaigns_delete ON public.campaigns FOR DELETE USING ((creator_id = auth.uid()));


--
-- Name: campaigns campaigns_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaigns_insert ON public.campaigns FOR INSERT WITH CHECK ((creator_id = auth.uid()));


--
-- Name: campaigns campaigns_insert_with_limit; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaigns_insert_with_limit ON public.campaigns FOR INSERT WITH CHECK (((auth.uid() = creator_id) AND public.check_campaign_limit()));


--
-- Name: campaigns campaigns_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaigns_select ON public.campaigns FOR SELECT USING (((creator_id = auth.uid()) OR public.is_campaign_participant(id, auth.uid())));


--
-- Name: campaigns campaigns_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY campaigns_update ON public.campaigns FOR UPDATE USING (((creator_id = auth.uid()) OR (public.is_campaign_participant(id, auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaigns.id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))))) WITH CHECK (((creator_id = auth.uid()) OR (public.is_campaign_participant(id, auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.campaign_participants cp
  WHERE ((cp.campaign_id = campaigns.id) AND (cp.user_id = auth.uid()) AND (cp.role = ANY (ARRAY['admin'::text, 'moderator'::text]))))))));


--
-- Name: carbon_footprint_data; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.carbon_footprint_data ENABLE ROW LEVEL SECURITY;

--
-- Name: comment_likes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: comment_likes comment_likes_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comment_likes_delete ON public.comment_likes FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: comment_likes comment_likes_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comment_likes_insert ON public.comment_likes FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: comment_likes comment_likes_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comment_likes_select ON public.comment_likes FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM (public.post_interactions c
     JOIN public.posts p ON ((p.id = c.post_id)))
  WHERE ((c.id = comment_likes.comment_id) AND (p.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: connections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

--
-- Name: connections connections_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY connections_opt ON public.connections TO authenticated USING (((requester_id = auth.uid()) OR (addressee_id = auth.uid()))) WITH CHECK ((requester_id = auth.uid()));


--
-- Name: contact_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: content_appeals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_appeals ENABLE ROW LEVEL SECURITY;

--
-- Name: content_reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: content_translations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;

--
-- Name: conversation_participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations conversations_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY conversations_delete ON public.conversations FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.conversation_participants cp
  WHERE ((cp.conversation_id = conversations.id) AND (cp.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: conversations conversations_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY conversations_insert ON public.conversations FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: conversations conversations_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY conversations_select ON public.conversations FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.conversation_participants cp
  WHERE ((cp.conversation_id = conversations.id) AND (cp.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: conversations conversations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY conversations_update ON public.conversations FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.conversation_participants cp
  WHERE ((cp.conversation_id = conversations.id) AND (cp.user_id = ( SELECT auth.uid() AS uid)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.conversation_participants cp
  WHERE ((cp.conversation_id = conversations.id) AND (cp.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: corporate_partnerships; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.corporate_partnerships ENABLE ROW LEVEL SECURITY;

--
-- Name: csr_initiatives; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.csr_initiatives ENABLE ROW LEVEL SECURITY;

--
-- Name: csr_lead_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.csr_lead_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: csr_opportunities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.csr_opportunities ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_request_activity_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_request_activity_log ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: donors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

--
-- Name: employee_engagement; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.employee_engagement ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_announcements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_announcements ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_benchmarks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_benchmarks ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_compliance_reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_compliance_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_data_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_data_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_data_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_data_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_frameworks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_frameworks ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_goals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_goals ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_indicators; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_indicators ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_initiative_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_initiative_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_initiatives; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_initiatives ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_recommendations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_recommendations ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_report_versions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_report_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_risks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_risks ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_targets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_targets ENABLE ROW LEVEL SECURITY;

--
-- Name: esg_verification_audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.esg_verification_audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: evidence_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.evidence_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: fraud_detection_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fraud_detection_log ENABLE ROW LEVEL SECURITY;

--
-- Name: grants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;

--
-- Name: group_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

--
-- Name: group_members group_members_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY group_members_select_policy ON public.group_members FOR SELECT USING (((user_id = auth.uid()) OR public.is_group_public(group_id) OR public.is_group_admin(auth.uid(), group_id)));


--
-- Name: groups; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

--
-- Name: groups groups_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY groups_delete ON public.groups FOR DELETE TO authenticated USING ((admin_id = ( SELECT auth.uid() AS uid)));


--
-- Name: groups groups_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY groups_insert ON public.groups FOR INSERT TO authenticated WITH CHECK ((admin_id = ( SELECT auth.uid() AS uid)));


--
-- Name: groups groups_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY groups_select_policy ON public.groups FOR SELECT USING (((is_private = false) OR (admin_id = auth.uid()) OR public.is_group_member(auth.uid(), id)));


--
-- Name: groups groups_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY groups_update ON public.groups FOR UPDATE TO authenticated USING (((admin_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.group_members gm
  WHERE ((gm.group_id = groups.id) AND (gm.user_id = ( SELECT auth.uid() AS uid)) AND (gm.role = ANY (ARRAY['admin'::text, 'moderator'::text]))))))) WITH CHECK (((admin_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.group_members gm
  WHERE ((gm.group_id = groups.id) AND (gm.user_id = ( SELECT auth.uid() AS uid)) AND (gm.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


--
-- Name: help_completion_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.help_completion_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: impact_activities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.impact_activities ENABLE ROW LEVEL SECURITY;

--
-- Name: impact_activities impact_activities_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY impact_activities_opt ON public.impact_activities TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: impact_goals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.impact_goals ENABLE ROW LEVEL SECURITY;

--
-- Name: impact_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: impact_metrics impact_metrics_select_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY impact_metrics_select_opt ON public.impact_metrics FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: impact_metrics impact_metrics_service; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY impact_metrics_service ON public.impact_metrics TO service_role USING (true) WITH CHECK (true);


--
-- Name: language_detection_cache; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.language_detection_cache ENABLE ROW LEVEL SECURITY;

--
-- Name: materiality_assessments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.materiality_assessments ENABLE ROW LEVEL SECURITY;

--
-- Name: message_access_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.message_access_log ENABLE ROW LEVEL SECURITY;

--
-- Name: message_access_log message_access_log_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY message_access_log_insert ON public.message_access_log FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: message_access_log message_access_log_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY message_access_log_select ON public.message_access_log FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: messages messages_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_delete ON public.messages FOR DELETE TO authenticated USING (((sender_id = ( SELECT auth.uid() AS uid)) OR (recipient_id = ( SELECT auth.uid() AS uid))));


--
-- Name: messages messages_delete_sender; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_delete_sender ON public.messages FOR DELETE USING ((( SELECT auth.uid() AS uid) = sender_id));


--
-- Name: messages messages_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_insert ON public.messages FOR INSERT TO authenticated WITH CHECK ((sender_id = ( SELECT auth.uid() AS uid)));


--
-- Name: messages messages_insert_sender_is_self; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_insert_sender_is_self ON public.messages FOR INSERT WITH CHECK (((( SELECT auth.uid() AS uid) = sender_id) AND (( SELECT auth.uid() AS uid) IS NOT NULL) AND (recipient_id IS NOT NULL) AND (recipient_id <> sender_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE (profiles.id = messages.recipient_id)))));


--
-- Name: messages messages_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_select ON public.messages FOR SELECT TO authenticated USING (((sender_id = ( SELECT auth.uid() AS uid)) OR (recipient_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM (public.conversation_participants cp
     JOIN public.conversations c ON ((c.id = cp.conversation_id)))
  WHERE (((messages.sender_id = cp.user_id) OR (messages.recipient_id = cp.user_id)) AND (cp.user_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: messages messages_select_participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_select_participants ON public.messages FOR SELECT USING (((( SELECT auth.uid() AS uid) = sender_id) OR (( SELECT auth.uid() AS uid) = recipient_id)));


--
-- Name: messages messages_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_update ON public.messages FOR UPDATE TO authenticated USING ((sender_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((sender_id = ( SELECT auth.uid() AS uid)));


--
-- Name: messages messages_update_participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY messages_update_participants ON public.messages FOR UPDATE USING (((( SELECT auth.uid() AS uid) = sender_id) OR (( SELECT auth.uid() AS uid) = recipient_id))) WITH CHECK (((( SELECT auth.uid() AS uid) = sender_id) OR (( SELECT auth.uid() AS uid) = recipient_id)));


--
-- Name: newsletter_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_analytics notification_analytics_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_analytics_delete ON public.notification_analytics FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_analytics notification_analytics_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_analytics_insert ON public.notification_analytics FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_analytics notification_analytics_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_analytics_select ON public.notification_analytics FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_analytics notification_analytics_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_analytics_update ON public.notification_analytics FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_delivery_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_delivery_log ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_delivery_log notification_delivery_log_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_delivery_log_delete ON public.notification_delivery_log FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_delivery_log notification_delivery_log_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_delivery_log_insert ON public.notification_delivery_log FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_delivery_log notification_delivery_log_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_delivery_log_select ON public.notification_delivery_log FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_delivery_log notification_delivery_log_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_delivery_log_update ON public.notification_delivery_log FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_filters; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_filters ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_filters notification_filters_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_filters_delete ON public.notification_filters FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_filters notification_filters_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_filters_insert ON public.notification_filters FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_filters notification_filters_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_filters_select ON public.notification_filters FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_filters notification_filters_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_filters_update ON public.notification_filters FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_templates notification_templates_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_templates_delete ON public.notification_templates FOR DELETE TO authenticated USING ((created_by = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_templates notification_templates_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_templates_insert ON public.notification_templates FOR INSERT TO authenticated WITH CHECK ((created_by = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_templates notification_templates_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_templates_select ON public.notification_templates FOR SELECT TO authenticated USING ((created_by = ( SELECT auth.uid() AS uid)));


--
-- Name: notification_templates notification_templates_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notification_templates_update ON public.notification_templates FOR UPDATE TO authenticated USING ((created_by = ( SELECT auth.uid() AS uid))) WITH CHECK ((created_by = ( SELECT auth.uid() AS uid)));


--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications notifications_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_opt ON public.notifications TO authenticated USING ((recipient_id = auth.uid())) WITH CHECK (((recipient_id = auth.uid()) OR (auth.uid() IS NOT NULL)));


--
-- Name: organization_members org_members_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_delete ON public.organization_members FOR DELETE USING (public.is_org_admin(organization_id, auth.uid()));


--
-- Name: organization_members org_members_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_insert ON public.organization_members FOR INSERT WITH CHECK (public.is_org_admin(organization_id, auth.uid()));


--
-- Name: organization_members org_members_select_if_member; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_select_if_member ON public.organization_members FOR SELECT USING (public.is_org_member(organization_id, auth.uid()));


--
-- Name: organization_members org_members_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_select_own ON public.organization_members FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: organization_members org_members_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_update ON public.organization_members FOR UPDATE USING (public.is_org_admin(organization_id, auth.uid())) WITH CHECK (public.is_org_admin(organization_id, auth.uid()));


--
-- Name: organization_activities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_activities ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_esg_data; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_esg_data ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_followers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_followers ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_impact_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_impact_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_invitations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_invitations organization_invitations_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_invitations_delete ON public.organization_invitations FOR DELETE TO authenticated USING (((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_invitations.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text]))))) OR (lower(email) = lower(( SELECT (auth.jwt() ->> 'email'::text))))));


--
-- Name: organization_invitations organization_invitations_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_invitations_insert ON public.organization_invitations FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_invitations.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: organization_invitations organization_invitations_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_invitations_select ON public.organization_invitations FOR SELECT TO authenticated USING (((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_invitations.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid))))) OR (lower(email) = lower(( SELECT (auth.jwt() ->> 'email'::text))))));


--
-- Name: organization_invitations organization_invitations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_invitations_update ON public.organization_invitations FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_invitations.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_invitations.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: organization_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_preferences organization_preferences_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_preferences_select ON public.organization_preferences FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_preferences.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: organization_preferences organization_preferences_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_preferences_update ON public.organization_preferences FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_preferences.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_preferences.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: organization_preferences organization_preferences_upsert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_preferences_upsert ON public.organization_preferences FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organization_preferences.organization_id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: organization_reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_team_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_team_members ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_trust_scores; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_trust_scores ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_verifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations organizations_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_delete ON public.organizations FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organizations.id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = 'owner'::text)))));


--
-- Name: organizations organizations_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_insert ON public.organizations FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) IS NOT NULL));


--
-- Name: organizations organizations_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_select ON public.organizations FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organizations.id) AND (m.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: organizations organizations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_update ON public.organizations FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organizations.id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members m
  WHERE ((m.organization_id = organizations.id) AND (m.user_id = ( SELECT auth.uid() AS uid)) AND (m.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: partnership_enquiries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.partnership_enquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: payment_references; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payment_references ENABLE ROW LEVEL SECURITY;

--
-- Name: platform_feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.platform_feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: platform_payments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.platform_payments ENABLE ROW LEVEL SECURITY;

--
-- Name: point_decay_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.point_decay_log ENABLE ROW LEVEL SECURITY;

--
-- Name: point_redemptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.point_redemptions ENABLE ROW LEVEL SECURITY;

--
-- Name: points_configuration; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.points_configuration ENABLE ROW LEVEL SECURITY;

--
-- Name: post_interactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;

--
-- Name: post_interactions post_interactions_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_interactions_delete ON public.post_interactions FOR DELETE TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_interactions.post_id) AND (p.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: post_interactions post_interactions_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_interactions_insert ON public.post_interactions FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: post_interactions post_interactions_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_interactions_select ON public.post_interactions FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_interactions.post_id) AND (p.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: post_interactions post_interactions_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_interactions_update ON public.post_interactions FOR UPDATE TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_interactions.post_id) AND (p.author_id = ( SELECT auth.uid() AS uid))))))) WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_interactions.post_id) AND (p.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: post_reactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

--
-- Name: post_reactions post_reactions_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_reactions_delete ON public.post_reactions FOR DELETE TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_reactions.post_id) AND (p.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: post_reactions post_reactions_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_reactions_insert ON public.post_reactions FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: post_reactions post_reactions_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_reactions_select ON public.post_reactions FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_reactions.post_id) AND (p.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: post_reactions post_reactions_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_reactions_update ON public.post_reactions FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

--
-- Name: posts posts_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY posts_delete ON public.posts FOR DELETE TO authenticated USING ((author_id = ( SELECT auth.uid() AS uid)));


--
-- Name: posts posts_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY posts_insert ON public.posts FOR INSERT TO authenticated WITH CHECK ((author_id = ( SELECT auth.uid() AS uid)));


--
-- Name: posts posts_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY posts_select ON public.posts FOR SELECT TO authenticated USING (((visibility = 'public'::text) OR (author_id = ( SELECT auth.uid() AS uid))));


--
-- Name: posts posts_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY posts_update ON public.posts FOR UPDATE TO authenticated USING ((author_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((author_id = ( SELECT auth.uid() AS uid)));


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_insert_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_insert_opt ON public.profiles FOR INSERT TO authenticated WITH CHECK ((id = auth.uid()));


--
-- Name: profiles profiles_select_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_select_opt ON public.profiles FOR SELECT TO authenticated USING (true);


--
-- Name: profiles profiles_update_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_update_opt ON public.profiles FOR UPDATE TO authenticated USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));


--
-- Name: questionnaire_responses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: rate_limit_buckets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: recommendation_cache; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.recommendation_cache ENABLE ROW LEVEL SECURITY;

--
-- Name: red_flags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.red_flags ENABLE ROW LEVEL SECURITY;

--
-- Name: relive_stories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.relive_stories ENABLE ROW LEVEL SECURITY;

--
-- Name: reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_emergency_alerts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_emergency_alerts ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_flagged_keywords; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_flagged_keywords ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_helper_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_helper_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_helper_training_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_helper_training_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_helpers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_helpers ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_queue; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_reference_checks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_reference_checks ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_training_modules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_training_modules ENABLE ROW LEVEL SECURITY;

--
-- Name: safe_space_verification_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safe_space_verification_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: safeguarding_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safeguarding_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: scheduled_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: scheduled_notifications scheduled_notifications_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY scheduled_notifications_delete ON public.scheduled_notifications FOR DELETE TO authenticated USING (((recipient_id = ( SELECT auth.uid() AS uid)) OR (sender_id = ( SELECT auth.uid() AS uid))));


--
-- Name: scheduled_notifications scheduled_notifications_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY scheduled_notifications_insert ON public.scheduled_notifications FOR INSERT TO authenticated WITH CHECK (((recipient_id = ( SELECT auth.uid() AS uid)) OR (sender_id = ( SELECT auth.uid() AS uid))));


--
-- Name: scheduled_notifications scheduled_notifications_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY scheduled_notifications_select ON public.scheduled_notifications FOR SELECT TO authenticated USING (((recipient_id = ( SELECT auth.uid() AS uid)) OR (sender_id = ( SELECT auth.uid() AS uid))));


--
-- Name: scheduled_notifications scheduled_notifications_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY scheduled_notifications_update ON public.scheduled_notifications FOR UPDATE TO authenticated USING (((recipient_id = ( SELECT auth.uid() AS uid)) OR (sender_id = ( SELECT auth.uid() AS uid)))) WITH CHECK (((recipient_id = ( SELECT auth.uid() AS uid)) OR (sender_id = ( SELECT auth.uid() AS uid))));


--
-- Name: seasonal_challenges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seasonal_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: security_audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: skill_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: stakeholder_data_contributions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stakeholder_data_contributions ENABLE ROW LEVEL SECURITY;

--
-- Name: stakeholder_engagement_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stakeholder_engagement_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: stakeholder_groups; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stakeholder_groups ENABLE ROW LEVEL SECURITY;

--
-- Name: story_participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.story_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: story_updates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.story_updates ENABLE ROW LEVEL SECURITY;

--
-- Name: subscription_admin_actions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscription_admin_actions ENABLE ROW LEVEL SECURITY;

--
-- Name: subscription_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: support_actions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.support_actions ENABLE ROW LEVEL SECURITY;

--
-- Name: trust_domains; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trust_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: trust_score_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trust_score_history ENABLE ROW LEVEL SECURITY;

--
-- Name: tutorial_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tutorial_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: typing_indicators; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

--
-- Name: typing_indicators typing_indicators_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY typing_indicators_delete ON public.typing_indicators FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: typing_indicators typing_indicators_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY typing_indicators_insert ON public.typing_indicators FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: typing_indicators typing_indicators_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY typing_indicators_select ON public.typing_indicators FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (conversation_partner_id = ( SELECT auth.uid() AS uid))));


--
-- Name: typing_indicators typing_indicators_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY typing_indicators_update ON public.typing_indicators FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: url_previews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.url_previews ENABLE ROW LEVEL SECURITY;

--
-- Name: user_achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

--
-- Name: user_achievements user_achievements_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_achievements_opt ON public.user_achievements TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_activities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

--
-- Name: user_activities user_activities_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_activities_opt ON public.user_activities TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_badges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

--
-- Name: user_badges user_badges_insert_svc; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_badges_insert_svc ON public.user_badges FOR INSERT TO service_role WITH CHECK (true);


--
-- Name: user_badges user_badges_select_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_badges_select_opt ON public.user_badges FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: user_blocks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

--
-- Name: user_challenge_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: user_interaction_scores; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_interaction_scores ENABLE ROW LEVEL SECURITY;

--
-- Name: user_language_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_language_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: user_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: user_preferences user_preferences_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_preferences_opt ON public.user_preferences TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_presence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

--
-- Name: user_privacy_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_privacy_settings user_privacy_settings_opt; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_privacy_settings_opt ON public.user_privacy_settings TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_tutorial_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_tutorial_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: user_verifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;

--
-- Name: verification_document_audit; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.verification_document_audit ENABLE ROW LEVEL SECURITY;

--
-- Name: verification_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: volunteer_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: volunteer_interests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.volunteer_interests ENABLE ROW LEVEL SECURITY;

--
-- Name: volunteer_opportunities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;

--
-- Name: volunteer_work_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.volunteer_work_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: white_label_purchases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.white_label_purchases ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


