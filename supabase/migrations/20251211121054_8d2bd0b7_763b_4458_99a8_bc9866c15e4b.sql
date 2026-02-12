-- Phase 1: Create trigger to sync approved applications to safe_space_helpers

-- Function to create helper record when application is approved
CREATE OR REPLACE FUNCTION public.sync_approved_helper_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when application_status changes to 'approved'
  IF NEW.application_status = 'approved' AND (OLD.application_status IS NULL OR OLD.application_status != 'approved') THEN
    -- Insert or update the safe_space_helpers record
    INSERT INTO public.safe_space_helpers (
      user_id,
      specializations,
      verification_status,
      is_available,
      max_concurrent_sessions,
      current_sessions,
      last_active
    ) VALUES (
      NEW.user_id,
      COALESCE(NEW.areas_of_focus, ARRAY['general']::text[]),
      'verified',
      false,
      3,
      0,
      now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      verification_status = 'verified',
      specializations = COALESCE(NEW.areas_of_focus, ARRAY['general']::text[]),
      last_active = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on safe_space_helper_applications
DROP TRIGGER IF EXISTS trigger_sync_approved_helper ON public.safe_space_helper_applications;
CREATE TRIGGER trigger_sync_approved_helper
  AFTER UPDATE ON public.safe_space_helper_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_approved_helper_application();

-- Phase 3: Add unique constraint to prevent duplicate applications (only one active per user)
-- First clean up duplicates by keeping only the most recent per user
DELETE FROM public.safe_space_helper_applications a
USING public.safe_space_helper_applications b
WHERE a.user_id = b.user_id
  AND a.created_at < b.created_at;

-- Add unique constraint on user_id for non-rejected applications
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_helper_application 
ON public.safe_space_helper_applications (user_id) 
WHERE application_status NOT IN ('rejected', 'withdrawn');

-- Add index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_helper_applications_status 
ON public.safe_space_helper_applications (application_status);

CREATE INDEX IF NOT EXISTS idx_helper_applications_submitted 
ON public.safe_space_helper_applications (submitted_at DESC) 
WHERE submitted_at IS NOT NULL;