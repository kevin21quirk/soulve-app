-- Phase 1: Storage bucket and supporting documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'esg-supporting-documents', 
  'esg-supporting-documents', 
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Add supporting documents field to stakeholder contributions
ALTER TABLE public.stakeholder_data_contributions
ADD COLUMN IF NOT EXISTS supporting_documents JSONB DEFAULT '[]'::jsonb;

-- Storage policies for ESG documents
CREATE POLICY "Contributors can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'esg-supporting-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Contributors can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'esg-supporting-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Organization admins can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'esg-supporting-documents' AND
  EXISTS (
    SELECT 1 FROM public.stakeholder_data_contributions sdc
    JOIN public.esg_data_requests edr ON sdc.data_request_id = edr.id
    JOIN public.organization_members om ON om.organization_id = edr.organization_id
    WHERE om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner', 'manager')
      AND om.is_active = true
      AND (storage.foldername(name))[1] = sdc.contributor_user_id::text
  )
);

-- Phase 2: Notification triggers
CREATE OR REPLACE FUNCTION public.notify_esg_milestone()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  milestone_percentage INTEGER;
  org_admins UUID[];
BEGIN
  -- Check if progress crossed a milestone (25%, 50%, 75%, 100%)
  IF NEW.progress_percentage >= 25 AND OLD.progress_percentage < 25 THEN
    milestone_percentage := 25;
  ELSIF NEW.progress_percentage >= 50 AND OLD.progress_percentage < 50 THEN
    milestone_percentage := 50;
  ELSIF NEW.progress_percentage >= 75 AND OLD.progress_percentage < 75 THEN
    milestone_percentage := 75;
  ELSIF NEW.progress_percentage >= 100 AND OLD.progress_percentage < 100 THEN
    milestone_percentage := 100;
  ELSE
    RETURN NEW;
  END IF;

  -- Get organization admins
  SELECT ARRAY_AGG(user_id) INTO org_admins
  FROM public.organization_members
  WHERE organization_id = NEW.organization_id
    AND role IN ('admin', 'owner', 'manager')
    AND is_active = true;

  -- Create notifications for each admin
  IF org_admins IS NOT NULL THEN
    INSERT INTO public.notifications (recipient_id, type, title, message, priority, metadata)
    SELECT 
      unnest(org_admins),
      'esg_milestone',
      'ESG Initiative Milestone Reached',
      'Initiative "' || NEW.initiative_name || '" has reached ' || milestone_percentage || '% completion',
      CASE WHEN milestone_percentage = 100 THEN 'high' ELSE 'normal' END,
      jsonb_build_object(
        'initiative_id', NEW.id,
        'milestone', milestone_percentage,
        'initiative_name', NEW.initiative_name
      );
  END IF;

  -- Auto-generate report at 100%
  IF milestone_percentage = 100 AND NEW.status = 'collecting' THEN
    UPDATE public.esg_initiatives
    SET status = 'reviewing'
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER esg_initiative_milestone_trigger
AFTER UPDATE OF progress_percentage ON public.esg_initiatives
FOR EACH ROW
EXECUTE FUNCTION public.notify_esg_milestone();

-- Trigger for data contribution status changes
CREATE OR REPLACE FUNCTION public.notify_contribution_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contributor_user UUID;
  indicator_name_var TEXT;
BEGIN
  -- Get contributor and indicator info
  SELECT 
    sdc.contributor_user_id,
    ei.name
  INTO contributor_user, indicator_name_var
  FROM public.stakeholder_data_contributions sdc
  JOIN public.esg_data_requests edr ON sdc.data_request_id = edr.id
  JOIN public.esg_indicators ei ON edr.indicator_id = ei.id
  WHERE sdc.id = NEW.id;

  -- Notify contributor on verification status change
  IF NEW.verification_status != OLD.verification_status AND NEW.verification_status IN ('verified', 'rejected') THEN
    INSERT INTO public.notifications (recipient_id, type, title, message, priority, metadata)
    VALUES (
      contributor_user,
      'esg_verification',
      CASE 
        WHEN NEW.verification_status = 'verified' THEN 'Data Contribution Approved'
        ELSE 'Data Contribution Needs Revision'
      END,
      CASE 
        WHEN NEW.verification_status = 'verified' THEN 'Your submission for "' || indicator_name_var || '" has been approved'
        ELSE 'Your submission for "' || indicator_name_var || '" needs revision: ' || COALESCE(NEW.verification_notes, 'Please review')
      END,
      CASE WHEN NEW.verification_status = 'verified' THEN 'normal' ELSE 'high' END,
      jsonb_build_object(
        'contribution_id', NEW.id,
        'verification_status', NEW.verification_status,
        'indicator_name', indicator_name_var
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER contribution_status_notification_trigger
AFTER UPDATE OF verification_status ON public.stakeholder_data_contributions
FOR EACH ROW
EXECUTE FUNCTION public.notify_contribution_status();

-- Phase 4: Report versioning
ALTER TABLE public.esg_reports
ADD COLUMN IF NOT EXISTS report_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_final BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS previous_version_id UUID REFERENCES public.esg_reports(id);

-- Add draft status tracking
ALTER TABLE public.stakeholder_data_contributions
ADD COLUMN IF NOT EXISTS draft_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.stakeholder_data_contributions(contribution_status, verification_status);
CREATE INDEX IF NOT EXISTS idx_initiatives_progress ON public.esg_initiatives(organization_id, progress_percentage);
CREATE INDEX IF NOT EXISTS idx_data_requests_status ON public.esg_data_requests(status, due_date);