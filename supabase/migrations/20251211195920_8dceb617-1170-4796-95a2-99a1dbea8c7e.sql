-- Fix search_path warnings for the new functions
CREATE OR REPLACE FUNCTION sync_approved_helper_application()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION match_safe_space_helper(
  p_requester_id uuid,
  p_issue_category text,
  p_urgency_level text DEFAULT 'medium'
)
RETURNS uuid AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION process_safe_space_queue()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION on_helper_availability_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_available = true AND (OLD.is_available = false OR OLD.is_available IS NULL) THEN
    PERFORM public.process_safe_space_queue();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;