-- Phase 3: Auto-generate reports when initiatives reach 100%

-- Create function to auto-generate report when initiative completes
CREATE OR REPLACE FUNCTION public.auto_generate_esg_report()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger when progress reaches 100% and status changes to 'completed'
  IF NEW.progress_percentage >= 100 AND OLD.progress_percentage < 100 THEN
    -- Update initiative status to completed
    NEW.status := 'completed';
    
    -- Insert a report generation task
    INSERT INTO public.esg_reports (
      organization_id,
      initiative_id,
      report_name,
      report_type,
      reporting_period_start,
      reporting_period_end,
      status,
      created_by
    ) VALUES (
      NEW.organization_id,
      NEW.id,
      NEW.initiative_name || ' - Completion Report',
      'sustainability',
      NEW.reporting_period_start,
      NEW.reporting_period_end,
      'draft',
      NEW.created_by
    );
    
    -- Create notification for organization admins
    INSERT INTO public.notifications (
      recipient_id,
      type,
      title,
      message,
      priority,
      metadata
    )
    SELECT 
      om.user_id,
      'esg_report_ready',
      'ESG Report Ready for Review',
      'Initiative "' || NEW.initiative_name || '" has been completed and a draft report has been generated.',
      'high',
      jsonb_build_object(
        'initiative_id', NEW.id,
        'report_generated', true
      )
    FROM public.organization_members om
    WHERE om.organization_id = NEW.organization_id
      AND om.role IN ('admin', 'owner', 'manager')
      AND om.is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-report generation
DROP TRIGGER IF EXISTS trigger_auto_generate_esg_report ON public.esg_initiatives;

CREATE TRIGGER trigger_auto_generate_esg_report
  BEFORE UPDATE ON public.esg_initiatives
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_esg_report();

-- Add index for faster notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread 
  ON public.notifications(recipient_id, is_read, created_at DESC)
  WHERE is_read = false;