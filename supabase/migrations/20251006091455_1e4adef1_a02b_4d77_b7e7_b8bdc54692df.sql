-- Phase 1: Add trust-based point management columns to impact_activities
ALTER TABLE impact_activities 
ADD COLUMN IF NOT EXISTS points_state text DEFAULT 'active' CHECK (points_state IN ('active', 'pending', 'escrow', 'reversed')),
ADD COLUMN IF NOT EXISTS trust_score_at_award integer DEFAULT 50;

-- Phase 2: Update calculate_enhanced_trust_score to only count 'active' points
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
  trust_score NUMERIC := 50;
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
  SELECT COALESCE(decay_applied_count, 0) INTO decay_applied_count
  FROM public.impact_metrics
  WHERE user_id = user_uuid;
  
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
  SELECT COALESCE(average_rating, 0) INTO avg_rating
  FROM public.impact_metrics
  WHERE user_id = user_uuid;
  
  -- Get active red flags count
  SELECT COALESCE(COUNT(*), 0) INTO red_flags_count
  FROM public.red_flags
  WHERE user_id = user_uuid AND status = 'active';
  
  -- Trust Score = (Lifetime Points × 0.6) + (Average Rating × 10 × 0.3) - (Red Flags × 10 × 0.1)
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

-- Phase 3: Enable realtime for evidence_submissions
ALTER PUBLICATION supabase_realtime ADD TABLE evidence_submissions;