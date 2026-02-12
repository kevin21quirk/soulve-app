-- Add verification workflow fields to stakeholder_data_contributions
ALTER TABLE public.stakeholder_data_contributions
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verification_notes text,
ADD COLUMN IF NOT EXISTS revision_requested_notes text;

-- Create verification audit log table
CREATE TABLE IF NOT EXISTS public.esg_verification_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id uuid REFERENCES public.stakeholder_data_contributions(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('submitted', 'approved', 'rejected', 'revision_requested', 'resubmitted')),
  performed_by uuid REFERENCES auth.users(id) NOT NULL,
  notes text,
  previous_status text,
  new_status text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on verification audit log
ALTER TABLE public.esg_verification_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Organization admins can view verification logs
CREATE POLICY "Organization admins can view verification logs"
ON public.esg_verification_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.stakeholder_data_contributions sdc
    JOIN public.esg_data_requests edr ON sdc.data_request_id = edr.id
    WHERE sdc.id = esg_verification_audit_log.contribution_id
    AND public.is_organization_admin(edr.organization_id, auth.uid())
  )
);

-- Policy: System can insert audit logs
CREATE POLICY "System can insert verification audit logs"
ON public.esg_verification_audit_log
FOR INSERT
WITH CHECK (true);

-- Create function to log verification actions
CREATE OR REPLACE FUNCTION public.log_verification_action()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for verification audit logging
DROP TRIGGER IF EXISTS log_verification_action_trigger ON public.stakeholder_data_contributions;
CREATE TRIGGER log_verification_action_trigger
AFTER INSERT OR UPDATE OF verification_status ON public.stakeholder_data_contributions
FOR EACH ROW
EXECUTE FUNCTION public.log_verification_action();

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contributions_verification_status 
ON public.stakeholder_data_contributions(verification_status);

CREATE INDEX IF NOT EXISTS idx_verification_audit_contribution 
ON public.esg_verification_audit_log(contribution_id);