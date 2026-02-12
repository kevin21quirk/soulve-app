-- Create demo_requests table
CREATE TABLE public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Requester Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  job_title TEXT,
  phone_number TEXT,
  organization_size TEXT CHECK (organization_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  
  -- Demo Preferences
  preferred_date TIMESTAMPTZ,
  preferred_time TEXT CHECK (preferred_time IN ('morning', 'afternoon', 'evening', 'flexible')),
  interest_areas TEXT[] DEFAULT '{}',
  message TEXT,
  
  -- Status & Assignment
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled', 'no_show')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID,
  
  -- Meeting Details
  scheduled_meeting_time TIMESTAMPTZ,
  meeting_link TEXT,
  meeting_duration_minutes INTEGER DEFAULT 30,
  
  -- Admin Notes & Follow-up
  admin_notes TEXT,
  follow_up_notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  
  -- Metadata
  source TEXT DEFAULT 'landing_page',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for performance
CREATE INDEX idx_demo_requests_status ON public.demo_requests(status);
CREATE INDEX idx_demo_requests_created_at ON public.demo_requests(created_at DESC);
CREATE INDEX idx_demo_requests_assigned_to ON public.demo_requests(assigned_to);
CREATE INDEX idx_demo_requests_email ON public.demo_requests(email);

-- Enable RLS
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all demo requests"
ON public.demo_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can update demo requests"
ON public.demo_requests FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role = 'admin'
  )
);

CREATE POLICY "Public can insert demo requests"
ON public.demo_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Auto-update updated_at trigger
CREATE TRIGGER update_demo_requests_updated_at
  BEFORE UPDATE ON public.demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create demo_request_activity_log table for audit trail
CREATE TABLE public.demo_request_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_request_id UUID NOT NULL REFERENCES public.demo_requests(id) ON DELETE CASCADE,
  actor_id UUID,
  action_type TEXT NOT NULL CHECK (action_type IN ('created', 'status_changed', 'assigned', 'unassigned', 'rescheduled', 'notes_added', 'contacted')),
  old_value JSONB,
  new_value JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_demo_activity_log_request_id ON public.demo_request_activity_log(demo_request_id);
CREATE INDEX idx_demo_activity_log_created_at ON public.demo_request_activity_log(created_at DESC);

ALTER TABLE public.demo_request_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs"
ON public.demo_request_activity_log FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role = 'admin'
  )
);

CREATE POLICY "System can insert activity logs"
ON public.demo_request_activity_log FOR INSERT
WITH CHECK (true);

-- Create notification trigger function
CREATE OR REPLACE FUNCTION notify_new_demo_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create notification for all admins
  INSERT INTO public.notifications (
    recipient_id,
    type,
    title,
    message,
    priority,
    action_url,
    action_type,
    metadata
  )
  SELECT 
    ar.user_id,
    'demo_request',
    'New Demo Request',
    NEW.full_name || ' from ' || COALESCE(NEW.company_name, 'an organization') || ' has requested a demo',
    CASE WHEN NEW.priority = 'urgent' THEN 'high' ELSE 'normal' END,
    '/admin/demo-requests',
    'view',
    jsonb_build_object(
      'demo_request_id', NEW.id,
      'email', NEW.email,
      'company', NEW.company_name
    )
  FROM admin_roles ar
  WHERE ar.role = 'admin';
  
  -- Log the creation
  INSERT INTO public.demo_request_activity_log (
    demo_request_id,
    actor_id,
    action_type,
    new_value,
    notes
  ) VALUES (
    NEW.id,
    NULL,
    'created',
    jsonb_build_object(
      'full_name', NEW.full_name,
      'email', NEW.email,
      'company_name', NEW.company_name,
      'status', NEW.status,
      'priority', NEW.priority
    ),
    'Demo request submitted from ' || NEW.source
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_demo_request_created
  AFTER INSERT ON public.demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_demo_request();

-- Real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE demo_requests;