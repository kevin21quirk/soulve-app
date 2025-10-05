-- Fix security warning: Set search_path for verification function
CREATE OR REPLACE FUNCTION public.log_verification_action()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
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