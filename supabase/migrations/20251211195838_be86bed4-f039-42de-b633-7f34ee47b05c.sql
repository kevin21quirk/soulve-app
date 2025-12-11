-- Phase 1: Fix the sync trigger to use correct column name
CREATE OR REPLACE FUNCTION sync_approved_helper_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync when status changes to 'approved'
  IF NEW.application_status = 'approved' AND (OLD.application_status IS NULL OR OLD.application_status != 'approved') THEN
    -- Insert or update the helper record
    INSERT INTO safe_space_helpers (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS on_helper_application_approved ON safe_space_helper_applications;

CREATE TRIGGER on_helper_application_approved
  AFTER UPDATE ON safe_space_helper_applications
  FOR EACH ROW
  EXECUTE FUNCTION sync_approved_helper_application();

-- Phase 2: Update match_safe_space_helper to relax requirements (make verification optional)
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
  -- Find an available helper (relaxed requirements - don't require id_verification or dbs_check)
  SELECT user_id INTO v_helper_id
  FROM safe_space_helpers
  WHERE is_available = true
    AND verification_status = 'verified'
    AND current_sessions < max_concurrent_sessions
    AND user_id != p_requester_id
    AND (
      p_issue_category = ANY(specializations)
      OR 'general' = ANY(specializations)
    )
  ORDER BY 
    CASE WHEN p_issue_category = ANY(specializations) THEN 0 ELSE 1 END,
    trust_score DESC NULLS LAST,
    current_sessions ASC,
    last_active DESC NULLS LAST
  LIMIT 1;

  IF v_helper_id IS NOT NULL THEN
    -- Create session immediately
    INSERT INTO safe_space_sessions (
      requester_id,
      helper_id,
      issue_category,
      urgency_level,
      status
    )
    VALUES (
      p_requester_id,
      v_helper_id,
      p_issue_category,
      p_urgency_level,
      'active'
    )
    RETURNING id INTO v_session_id;

    -- Update helper's current sessions
    UPDATE safe_space_helpers
    SET current_sessions = current_sessions + 1,
        last_active = now()
    WHERE user_id = v_helper_id;

    -- Create notification for helper
    INSERT INTO notifications (
      recipient_id,
      type,
      title,
      message,
      priority
    )
    VALUES (
      v_helper_id,
      'safe_space_session',
      'New Support Session',
      'Someone needs your help. Click to start the session.',
      CASE WHEN p_urgency_level = 'high' THEN 'urgent' ELSE 'high' END
    );

    RETURN v_session_id;
  ELSE
    -- Add to queue
    SELECT COALESCE(MAX(position_in_queue), 0) + 1 INTO v_queue_position
    FROM safe_space_queue
    WHERE matched_at IS NULL;

    INSERT INTO safe_space_queue (
      requester_id,
      issue_category,
      urgency_level,
      position_in_queue
    )
    VALUES (
      p_requester_id,
      p_issue_category,
      p_urgency_level,
      v_queue_position
    );

    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 3: Create function to process queue when helper becomes available
CREATE OR REPLACE FUNCTION process_safe_space_queue()
RETURNS void AS $$
DECLARE
  v_queue_entry RECORD;
  v_helper_id uuid;
  v_session_id uuid;
BEGIN
  -- Loop through queue entries in priority order
  FOR v_queue_entry IN 
    SELECT * FROM safe_space_queue 
    WHERE matched_at IS NULL 
    ORDER BY 
      CASE urgency_level WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
      position_in_queue ASC
  LOOP
    -- Find available helper for this request
    SELECT user_id INTO v_helper_id
    FROM safe_space_helpers
    WHERE is_available = true
      AND verification_status = 'verified'
      AND current_sessions < max_concurrent_sessions
      AND user_id != v_queue_entry.requester_id
      AND (
        v_queue_entry.issue_category = ANY(specializations)
        OR 'general' = ANY(specializations)
      )
    ORDER BY 
      CASE WHEN v_queue_entry.issue_category = ANY(specializations) THEN 0 ELSE 1 END,
      trust_score DESC NULLS LAST,
      current_sessions ASC
    LIMIT 1;

    IF v_helper_id IS NOT NULL THEN
      -- Create session
      INSERT INTO safe_space_sessions (
        requester_id,
        helper_id,
        issue_category,
        urgency_level,
        status
      )
      VALUES (
        v_queue_entry.requester_id,
        v_helper_id,
        v_queue_entry.issue_category,
        v_queue_entry.urgency_level,
        'active'
      )
      RETURNING id INTO v_session_id;

      -- Update helper
      UPDATE safe_space_helpers
      SET current_sessions = current_sessions + 1,
          last_active = now()
      WHERE user_id = v_helper_id;

      -- Mark queue entry as matched
      UPDATE safe_space_queue
      SET matched_at = now(),
          matched_helper_id = v_helper_id
      WHERE id = v_queue_entry.id;

      -- Notify both parties
      INSERT INTO notifications (recipient_id, type, title, message, priority)
      VALUES 
        (v_helper_id, 'safe_space_session', 'New Support Session', 'Someone from the queue needs your help.', 'high'),
        (v_queue_entry.requester_id, 'safe_space_match', 'Helper Found!', 'You''ve been matched with a helper. Your session is ready.', 'high');
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 4: Trigger to process queue when helper becomes available
CREATE OR REPLACE FUNCTION on_helper_availability_change()
RETURNS TRIGGER AS $$
BEGIN
  -- When a helper becomes available, process the queue
  IF NEW.is_available = true AND (OLD.is_available = false OR OLD.is_available IS NULL) THEN
    PERFORM process_safe_space_queue();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS process_queue_on_availability ON safe_space_helpers;

CREATE TRIGGER process_queue_on_availability
  AFTER UPDATE ON safe_space_helpers
  FOR EACH ROW
  EXECUTE FUNCTION on_helper_availability_change();