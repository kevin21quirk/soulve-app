-- Complete the database function hardening by adding SET search_path = public to all remaining functions

-- Update all remaining functions with search_path protection
CREATE OR REPLACE FUNCTION public.calculate_user_similarity(user1_id uuid, user2_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.can_access_donor_details(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'fundraiser') 
      AND is_active = true
  );
$function$;

CREATE OR REPLACE FUNCTION public.calculate_campaign_performance_score(campaign_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.generate_user_recommendations(target_user_id uuid)
RETURNS TABLE(recommendation_type text, target_id uuid, confidence_score numeric, reasoning text, metadata jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_user_impact_metrics(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;