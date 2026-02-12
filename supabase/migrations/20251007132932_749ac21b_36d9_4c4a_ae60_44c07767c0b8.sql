-- Phase 2: Critical Security Enhancements for Safe Space

-- 1. Add trust_score column to safe_space_helpers
ALTER TABLE public.safe_space_helpers 
ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS id_verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS last_verification_check TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 2. Add session pausing columns
ALTER TABLE public.safe_space_sessions
ADD COLUMN IF NOT EXISTS session_paused BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS paused_reason TEXT,
ADD COLUMN IF NOT EXISTS paused_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS paused_by UUID REFERENCES auth.users(id);

-- 3. Create function to sync helper trust score and verification status
CREATE OR REPLACE FUNCTION public.sync_helper_verification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 4. Create trigger on user_verifications to sync helper status
DROP TRIGGER IF EXISTS sync_helper_verification_on_verification ON public.user_verifications;
CREATE TRIGGER sync_helper_verification_on_verification
AFTER INSERT OR UPDATE ON public.user_verifications
FOR EACH ROW
EXECUTE FUNCTION public.sync_helper_verification_status();

-- 5. Create trigger on impact_metrics to check trust score drops
CREATE OR REPLACE FUNCTION public.check_helper_trust_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

DROP TRIGGER IF EXISTS trust_score_check ON public.impact_metrics;
CREATE TRIGGER trust_score_check
AFTER UPDATE OF trust_score ON public.impact_metrics
FOR EACH ROW
EXECUTE FUNCTION public.check_helper_trust_score();

-- 6. Enhanced match_safe_space_helper with strict verification checks
CREATE OR REPLACE FUNCTION public.match_safe_space_helper(
  p_requester_id UUID,
  p_issue_category TEXT,
  p_urgency_level TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_helper_id UUID;
  session_id UUID;
BEGIN
  -- Find available helper with ALL verification requirements met
  SELECT user_id INTO matched_helper_id
  FROM public.safe_space_helpers
  WHERE is_available = true
    AND current_sessions < max_concurrent_sessions
    AND verification_status = 'verified'
    -- CRITICAL: Trust score must be 70 or higher
    AND trust_score >= 70
    -- CRITICAL: Must have verified government ID
    AND id_verification_status = 'verified'
    -- CRITICAL: Must have valid DBS check
    AND dbs_check_status = 'verified'
    -- Check specialization match
    AND (p_issue_category = ANY(specializations) OR 'general' = ANY(specializations))
  ORDER BY 
    -- Prioritize exact specialization match
    CASE WHEN p_issue_category = ANY(specializations) THEN 1 ELSE 2 END,
    -- Then by trust score (higher is better)
    trust_score DESC,
    -- Then by last active
    last_active DESC
  LIMIT 1;

  IF matched_helper_id IS NOT NULL THEN
    -- Create session
    INSERT INTO public.safe_space_sessions (
      requester_id,
      helper_id,
      session_token,
      issue_category,
      urgency_level,
      status,
      started_at
    ) VALUES (
      p_requester_id,
      matched_helper_id,
      gen_random_uuid()::text,
      p_issue_category,
      p_urgency_level,
      'active',
      now()
    ) RETURNING id INTO session_id;

    -- Update helper current sessions count
    UPDATE public.safe_space_helpers 
    SET current_sessions = current_sessions + 1 
    WHERE user_id = matched_helper_id;

    -- Remove from queue if exists
    DELETE FROM public.safe_space_queue WHERE requester_id = p_requester_id;

    RETURN session_id;
  ELSE
    -- Add to queue with priority based on urgency
    INSERT INTO public.safe_space_queue (
      requester_id,
      issue_category,
      urgency_level,
      position_in_queue
    ) VALUES (
      p_requester_id,
      p_issue_category,
      p_urgency_level,
      (SELECT COALESCE(MAX(position_in_queue), 0) + 1 FROM public.safe_space_queue)
    );

    RETURN NULL;
  END IF;
END;
$$;

-- 7. Function to check and disable helpers with expired DBS
CREATE OR REPLACE FUNCTION public.check_expired_dbs_certificates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 8. Initialize trust_score for existing helpers
UPDATE public.safe_space_helpers sh
SET trust_score = COALESCE(
  (SELECT trust_score FROM public.impact_metrics WHERE user_id = sh.user_id),
  50
)
WHERE trust_score IS NULL OR trust_score = 50;