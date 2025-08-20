-- Fix remaining functions with search_path protection

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_privacy_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.match_safe_space_helper(p_requester_id uuid, p_issue_category text, p_urgency_level text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  matched_helper_id UUID;
  session_id UUID;
BEGIN
  -- Find available helper with matching specialization
  SELECT user_id INTO matched_helper_id
  FROM public.safe_space_helpers
  WHERE is_available = true
    AND current_sessions < max_concurrent_sessions
    AND verification_status = 'verified'
    AND (p_issue_category = ANY(specializations) OR 'general' = ANY(specializations))
  ORDER BY 
    CASE WHEN p_issue_category = ANY(specializations) THEN 1 ELSE 2 END,
    last_active DESC
  LIMIT 1;

  IF matched_helper_id IS NOT NULL THEN
    -- Create session
    INSERT INTO public.safe_space_sessions (
      requester_id, helper_id, session_token, issue_category, urgency_level, status, started_at
    ) VALUES (
      p_requester_id, matched_helper_id, gen_random_uuid()::text, p_issue_category, p_urgency_level, 'active', now()
    ) RETURNING id INTO session_id;

    -- Update helper current sessions count
    UPDATE public.safe_space_helpers 
    SET current_sessions = current_sessions + 1 
    WHERE user_id = matched_helper_id;

    -- Remove from queue if exists
    DELETE FROM public.safe_space_queue WHERE requester_id = p_requester_id;

    RETURN session_id;
  ELSE
    -- Add to queue
    INSERT INTO public.safe_space_queue (
      requester_id, issue_category, urgency_level, position_in_queue
    ) VALUES (
      p_requester_id, p_issue_category, p_urgency_level, 
      (SELECT COALESCE(MAX(position_in_queue), 0) + 1 FROM public.safe_space_queue)
    );

    RETURN NULL;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_helper_session_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.status = 'ended' AND OLD.status != 'ended' AND NEW.helper_id IS NOT NULL THEN
    UPDATE public.safe_space_helpers 
    SET current_sessions = GREATEST(0, current_sessions - 1)
    WHERE user_id = NEW.helper_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.approve_waitlist_user(target_user_id uuid, approving_admin_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.can_access_dashboard(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid 
    AND (waitlist_status = 'approved' OR public.is_admin(user_uuid))
  );
$function$;

CREATE OR REPLACE FUNCTION public.generate_user_recommendations_with_orgs(target_user_id uuid)
RETURNS TABLE(recommendation_type text, target_id uuid, confidence_score numeric, reasoning text, metadata jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;