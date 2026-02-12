-- Add confirmation system for volunteer work (organizations and individuals)

-- Add recipient tracking and confirmation fields to impact_activities
ALTER TABLE public.impact_activities
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id),
ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES public.posts(id),
ADD COLUMN IF NOT EXISTS confirmed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS confirmation_status TEXT DEFAULT 'pending' CHECK (confirmation_status IN ('pending', 'confirmed', 'rejected')),
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS confirmation_requested_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add constraint to ensure either organization_id OR post_id is set (not both, not neither) for volunteer activities
ALTER TABLE public.impact_activities
ADD CONSTRAINT check_volunteer_recipient CHECK (
  (activity_type != 'volunteer_work') OR 
  ((organization_id IS NOT NULL AND post_id IS NULL) OR (organization_id IS NULL AND post_id IS NOT NULL))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_impact_activities_organization_confirmation 
ON public.impact_activities(organization_id, confirmation_status) 
WHERE organization_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_impact_activities_post_confirmation 
ON public.impact_activities(post_id, confirmation_status) 
WHERE post_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_impact_activities_confirmation_status 
ON public.impact_activities(user_id, confirmation_status);

-- Function to get the recipient user_id (either org admin or post author)
CREATE OR REPLACE FUNCTION public.get_volunteer_work_recipient(activity_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_id UUID;
  org_id UUID;
  p_id UUID;
BEGIN
  -- Get the organization_id or post_id from the activity
  SELECT organization_id, post_id INTO org_id, p_id
  FROM public.impact_activities
  WHERE id = activity_id;
  
  -- If it's an organization, get any active admin
  IF org_id IS NOT NULL THEN
    SELECT user_id INTO recipient_id
    FROM public.organization_members
    WHERE organization_id = org_id 
      AND is_active = true 
      AND role IN ('admin', 'owner')
    LIMIT 1;
  -- If it's a post, get the author
  ELSIF p_id IS NOT NULL THEN
    SELECT author_id INTO recipient_id
    FROM public.posts
    WHERE id = p_id;
  END IF;
  
  RETURN recipient_id;
END;
$$;

-- Function to confirm volunteer work
CREATE OR REPLACE FUNCTION public.confirm_volunteer_work(
  activity_id UUID,
  confirm_status TEXT,
  rejection_note TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  volunteer_user_id UUID;
  org_id UUID;
  p_id UUID;
  can_confirm BOOLEAN := FALSE;
BEGIN
  -- Get activity details
  SELECT user_id, organization_id, post_id INTO volunteer_user_id, org_id, p_id
  FROM public.impact_activities
  WHERE id = activity_id;
  
  -- Check if current user can confirm
  IF org_id IS NOT NULL THEN
    -- Check if user is org admin
    SELECT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = org_id 
        AND user_id = auth.uid()
        AND is_active = true
        AND role IN ('admin', 'owner', 'manager')
    ) INTO can_confirm;
  ELSIF p_id IS NOT NULL THEN
    -- Check if user is post author
    SELECT EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = p_id AND author_id = auth.uid()
    ) INTO can_confirm;
  END IF;
  
  IF NOT can_confirm THEN
    RAISE EXCEPTION 'You do not have permission to confirm this volunteer work';
  END IF;
  
  -- Update the activity
  UPDATE public.impact_activities
  SET 
    confirmation_status = confirm_status,
    confirmed_by = auth.uid(),
    confirmed_at = now(),
    rejection_reason = rejection_note,
    verified = CASE WHEN confirm_status = 'confirmed' THEN TRUE ELSE FALSE END
  WHERE id = activity_id;
  
  -- If confirmed, award points
  IF confirm_status = 'confirmed' THEN
    -- Recalculate user metrics
    PERFORM public.calculate_user_impact_metrics(volunteer_user_id);
    
    -- Update trust score
    PERFORM public.calculate_enhanced_trust_score(volunteer_user_id);
  END IF;
END;
$$;

-- Create notification table for real-time updates
CREATE TABLE IF NOT EXISTS public.volunteer_work_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.impact_activities(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  volunteer_id UUID NOT NULL REFERENCES auth.users(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('confirmation_requested', 'confirmed', 'rejected')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on notifications
ALTER TABLE public.volunteer_work_notifications ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.volunteer_work_notifications
FOR SELECT
USING (auth.uid() = recipient_id OR auth.uid() = volunteer_id);

-- RLS: System can create notifications
CREATE POLICY "System can create notifications"
ON public.volunteer_work_notifications
FOR INSERT
WITH CHECK (true);

-- RLS: Users can mark their notifications as read
CREATE POLICY "Users can update their own notifications"
ON public.volunteer_work_notifications
FOR UPDATE
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

-- Create index for notifications
CREATE INDEX IF NOT EXISTS idx_volunteer_notifications_recipient 
ON public.volunteer_work_notifications(recipient_id, is_read, created_at DESC);

-- Trigger to create notification when volunteer work is logged
CREATE OR REPLACE FUNCTION public.notify_volunteer_work_logged()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_id UUID;
BEGIN
  -- Only for volunteer work activities that need confirmation
  IF NEW.activity_type = 'volunteer_work' AND NEW.confirmation_status = 'pending' THEN
    recipient_id := public.get_volunteer_work_recipient(NEW.id);
    
    IF recipient_id IS NOT NULL THEN
      INSERT INTO public.volunteer_work_notifications (
        activity_id,
        recipient_id,
        volunteer_id,
        notification_type,
        metadata
      ) VALUES (
        NEW.id,
        recipient_id,
        NEW.user_id,
        'confirmation_requested',
        jsonb_build_object(
          'hours', NEW.hours_contributed,
          'skill', (SELECT name FROM public.skill_categories WHERE id = NEW.skill_category_id),
          'market_value', NEW.market_value_gbp
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_volunteer_work
AFTER INSERT ON public.impact_activities
FOR EACH ROW
EXECUTE FUNCTION public.notify_volunteer_work_logged();

-- Trigger to notify volunteer when work is confirmed/rejected
CREATE OR REPLACE FUNCTION public.notify_volunteer_work_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only notify on status changes
  IF NEW.confirmation_status != OLD.confirmation_status AND NEW.confirmation_status IN ('confirmed', 'rejected') THEN
    INSERT INTO public.volunteer_work_notifications (
      activity_id,
      recipient_id,
      volunteer_id,
      notification_type,
      metadata
    ) VALUES (
      NEW.id,
      NEW.user_id, -- Notify the volunteer
      NEW.confirmed_by,
      NEW.confirmation_status,
      jsonb_build_object(
        'hours', NEW.hours_contributed,
        'rejection_reason', NEW.rejection_reason
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_volunteer_status
AFTER UPDATE ON public.impact_activities
FOR EACH ROW
WHEN (OLD.confirmation_status IS DISTINCT FROM NEW.confirmation_status)
EXECUTE FUNCTION public.notify_volunteer_work_status();

-- Update RLS policies for impact_activities to allow recipients to confirm
CREATE POLICY "Recipients can view volunteer work awaiting confirmation"
ON public.impact_activities
FOR SELECT
USING (
  confirmation_status = 'pending' AND (
    -- Organization admins can view
    (organization_id IS NOT NULL AND organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'owner', 'manager')
    )) OR
    -- Post authors can view
    (post_id IS NOT NULL AND post_id IN (
      SELECT id FROM public.posts WHERE author_id = auth.uid()
    ))
  )
);

-- Allow recipients to update confirmation status
CREATE POLICY "Recipients can confirm volunteer work"
ON public.impact_activities
FOR UPDATE
USING (
  confirmation_status = 'pending' AND (
    (organization_id IS NOT NULL AND organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'owner', 'manager')
    )) OR
    (post_id IS NOT NULL AND post_id IN (
      SELECT id FROM public.posts WHERE author_id = auth.uid()
    ))
  )
)
WITH CHECK (
  confirmation_status IN ('confirmed', 'rejected')
);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteer_work_notifications;

-- Comments for documentation
COMMENT ON COLUMN public.impact_activities.organization_id IS 'Organization for which volunteer work was done';
COMMENT ON COLUMN public.impact_activities.post_id IS 'Help post/request for which volunteer work was done';
COMMENT ON COLUMN public.impact_activities.confirmed_by IS 'User who confirmed the volunteer work (org admin or post author)';
COMMENT ON COLUMN public.impact_activities.confirmation_status IS 'Status of confirmation: pending, confirmed, rejected';
COMMENT ON COLUMN public.impact_activities.confirmed_at IS 'When the volunteer work was confirmed';
COMMENT ON COLUMN public.impact_activities.rejection_reason IS 'Reason for rejection (if applicable)';
COMMENT ON TABLE public.volunteer_work_notifications IS 'Real-time notifications for volunteer work confirmations';