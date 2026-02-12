-- Complete the remaining database function security hardening

CREATE OR REPLACE FUNCTION public.get_user_organizations(target_user_id uuid)
RETURNS TABLE(organization_id uuid, organization_name text, role text, title text, is_current boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_donor_statistics(org_id uuid)
RETURNS TABLE(id uuid, organization_id uuid, donor_type text, total_donated numeric, donation_count integer, first_donation_date timestamp with time zone, last_donation_date timestamp with time zone, average_donation numeric, donor_status text, tags text[], created_at timestamp with time zone, updated_at timestamp with time zone, first_initial text, last_initial text, masked_email text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_help_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_post_reaction_counts(target_post_id uuid)
RETURNS TABLE(reaction_type text, count bigint, user_reacted boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    pr.reaction_type,
    COUNT(*) as count,
    bool_or(pr.user_id = auth.uid()) as user_reacted
  FROM public.post_reactions pr
  WHERE pr.post_id = target_post_id
  GROUP BY pr.reaction_type
  ORDER BY count DESC;
$function$;

CREATE OR REPLACE FUNCTION public.toggle_post_reaction(target_post_id uuid, target_reaction_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  existing_reaction_id UUID;
  result BOOLEAN := false;
BEGIN
  -- Check if user already has this reaction
  SELECT id INTO existing_reaction_id
  FROM public.post_reactions
  WHERE post_id = target_post_id 
    AND user_id = auth.uid() 
    AND reaction_type = target_reaction_type;
  
  IF existing_reaction_id IS NOT NULL THEN
    -- Remove existing reaction
    DELETE FROM public.post_reactions WHERE id = existing_reaction_id;
    result := false;
  ELSE
    -- Add new reaction
    INSERT INTO public.post_reactions (post_id, user_id, reaction_type)
    VALUES (target_post_id, auth.uid(), target_reaction_type);
    result := true;
  END IF;
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid, viewer_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.is_campaign_creator(campaign_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE id = campaign_uuid AND creator_id = user_uuid
  );
$function$;

CREATE OR REPLACE FUNCTION public.detect_fraud_patterns(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;