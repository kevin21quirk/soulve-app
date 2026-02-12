-- Continue hardening remaining database functions

CREATE OR REPLACE FUNCTION public.award_impact_points(target_user_id uuid, activity_type text, points integer, description text, metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_help_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.create_relive_story_on_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
      ARRAY['😊', '🤝', '⭐']
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_user_similarity_with_orgs(user1_id uuid, user2_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_user_total_points(target_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  total_points INTEGER := 0;
BEGIN
  SELECT COALESCE(SUM(points_earned), 0) INTO total_points
  FROM public.impact_activities
  WHERE user_id = target_user_id AND verified = true;
  
  RETURN total_points;
END;
$function$;

CREATE OR REPLACE FUNCTION public.award_user_points(target_user_id uuid, activity_type text, points integer, description text, metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;