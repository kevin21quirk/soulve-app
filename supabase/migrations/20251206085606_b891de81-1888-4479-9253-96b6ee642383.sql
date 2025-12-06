-- Fix trust score to start at 0 instead of 50
-- Trust should be EARNED, not given

-- 1. Update calculate_trust_score function to start at 0
CREATE OR REPLACE FUNCTION public.calculate_trust_score(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- 2. Update calculate_enhanced_trust_score function to start at 0
CREATE OR REPLACE FUNCTION public.calculate_enhanced_trust_score(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Trust Score = (Lifetime Points × 0.6) + (Average Rating × 10 × 0.3) - (Red Flags × 10 × 0.1)
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
$function$;

-- 3. Update default values for trust_score columns
ALTER TABLE public.safe_space_helpers 
ALTER COLUMN trust_score SET DEFAULT 0;

ALTER TABLE public.impact_activities 
ALTER COLUMN trust_score_at_award SET DEFAULT 0;

-- 4. Update existing users with 50 trust score to recalculate
-- This will trigger recalculation for users who had the default 50
UPDATE public.impact_metrics 
SET trust_score = 0, calculated_at = now()
WHERE trust_score = 50;