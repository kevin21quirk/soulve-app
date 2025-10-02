-- Phase 4: Advanced Notification Features

-- Notification Templates Table
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  default_priority TEXT DEFAULT 'normal' CHECK (default_priority IN ('urgent', 'high', 'normal', 'low')),
  default_action_type TEXT,
  metadata_schema JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scheduled Notifications Table
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.notification_templates(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  scheduled_for TIMESTAMPTZ NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  action_url TEXT,
  action_type TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notification Filters Table (saved filters)
CREATE TABLE IF NOT EXISTS public.notification_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  filter_config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_filters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Templates
CREATE POLICY "Anyone can view active templates"
  ON public.notification_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON public.notification_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Scheduled Notifications
CREATE POLICY "Users can view their scheduled notifications"
  ON public.scheduled_notifications FOR SELECT
  USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "Users can create scheduled notifications"
  ON public.scheduled_notifications FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their scheduled notifications"
  ON public.scheduled_notifications FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can delete their scheduled notifications"
  ON public.scheduled_notifications FOR DELETE
  USING (auth.uid() = sender_id);

-- RLS Policies for Filters
CREATE POLICY "Users can manage their own filters"
  ON public.notification_filters FOR ALL
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_scheduled_notifications_scheduled_for ON public.scheduled_notifications(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_scheduled_notifications_recipient ON public.scheduled_notifications(recipient_id);
CREATE INDEX idx_notification_filters_user ON public.notification_filters(user_id);
CREATE INDEX idx_notification_templates_type ON public.notification_templates(type) WHERE is_active = true;

-- Function to process scheduled notifications
CREATE OR REPLACE FUNCTION public.process_scheduled_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert due notifications into notifications table
  INSERT INTO public.notifications (
    recipient_id,
    sender_id,
    type,
    title,
    message,
    priority,
    action_url,
    action_type,
    metadata,
    delivery_status
  )
  SELECT
    sn.recipient_id,
    sn.sender_id,
    sn.type,
    sn.title,
    sn.message,
    sn.priority,
    sn.action_url,
    sn.action_type,
    sn.metadata,
    'pending'
  FROM public.scheduled_notifications sn
  WHERE sn.status = 'pending'
    AND sn.scheduled_for <= now();

  -- Mark scheduled notifications as sent
  UPDATE public.scheduled_notifications
  SET 
    status = 'sent',
    sent_at = now(),
    updated_at = now()
  WHERE status = 'pending'
    AND scheduled_for <= now();
END;
$$;

-- Function to render template with variables
CREATE OR REPLACE FUNCTION public.render_notification_template(
  template_id_input UUID,
  variables JSONB DEFAULT '{}'
)
RETURNS TABLE(
  title TEXT,
  message TEXT,
  type TEXT,
  priority TEXT,
  action_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  template_record RECORD;
  rendered_title TEXT;
  rendered_message TEXT;
  var_key TEXT;
  var_value TEXT;
BEGIN
  -- Get template
  SELECT * INTO template_record
  FROM public.notification_templates
  WHERE id = template_id_input AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found or inactive';
  END IF;

  -- Start with template content
  rendered_title := template_record.title_template;
  rendered_message := template_record.message_template;

  -- Replace variables in title and message
  FOR var_key, var_value IN SELECT * FROM jsonb_each_text(variables)
  LOOP
    rendered_title := replace(rendered_title, '{{' || var_key || '}}', var_value);
    rendered_message := replace(rendered_message, '{{' || var_key || '}}', var_value);
  END LOOP;

  RETURN QUERY SELECT
    rendered_title,
    rendered_message,
    template_record.type,
    template_record.default_priority,
    template_record.default_action_type;
END;
$$;

-- Function for bulk operations
CREATE OR REPLACE FUNCTION public.bulk_mark_notifications_read(
  notification_ids UUID[] DEFAULT NULL,
  mark_all BOOLEAN DEFAULT false
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  IF mark_all THEN
    -- Mark all unread notifications as read for the user
    UPDATE public.notifications
    SET 
      is_read = true,
      read_at = now(),
      delivery_status = 'read'
    WHERE recipient_id = auth.uid()
      AND is_read = false;
  ELSE
    -- Mark specific notifications as read
    UPDATE public.notifications
    SET 
      is_read = true,
      read_at = now(),
      delivery_status = 'read'
    WHERE id = ANY(notification_ids)
      AND recipient_id = auth.uid()
      AND is_read = false;
  END IF;

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$;

-- Function for bulk delete
CREATE OR REPLACE FUNCTION public.bulk_delete_notifications(
  notification_ids UUID[],
  older_than_days INTEGER DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  IF older_than_days IS NOT NULL THEN
    -- Delete notifications older than specified days
    DELETE FROM public.notifications
    WHERE recipient_id = auth.uid()
      AND created_at < (now() - (older_than_days || ' days')::INTERVAL)
      AND is_read = true;
  ELSE
    -- Delete specific notifications
    DELETE FROM public.notifications
    WHERE id = ANY(notification_ids)
      AND recipient_id = auth.uid();
  END IF;

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$;