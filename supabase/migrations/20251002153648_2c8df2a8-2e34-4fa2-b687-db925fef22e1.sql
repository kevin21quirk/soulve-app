-- Phase 3: Advanced Notification System Schema Updates (Fixed)

-- Add new columns to notifications table for advanced features
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
ADD COLUMN IF NOT EXISTS action_url text,
ADD COLUMN IF NOT EXISTS action_type text,
ADD COLUMN IF NOT EXISTS grouped_with uuid REFERENCES public.notifications(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'read', 'failed')),
ADD COLUMN IF NOT EXISTS group_key text,
ADD COLUMN IF NOT EXISTS read_at timestamp with time zone;

-- Create notification_delivery_log table for analytics
CREATE TABLE IF NOT EXISTS public.notification_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES public.notifications(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  delivery_method text NOT NULL CHECK (delivery_method IN ('in_app', 'push', 'email')),
  delivered_at timestamp with time zone DEFAULT now(),
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  action_taken text,
  device_info jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create notification_analytics table for tracking engagement
CREATE TABLE IF NOT EXISTS public.notification_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES public.notifications(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('viewed', 'clicked', 'dismissed', 'action_taken')),
  event_metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_group_key ON public.notifications(group_key);
CREATE INDEX IF NOT EXISTS idx_notifications_delivery_status ON public.notifications(delivery_status);
CREATE INDEX IF NOT EXISTS idx_notification_delivery_log_user ON public.notification_delivery_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_analytics_user ON public.notification_analytics(user_id);

-- Enable RLS on new tables
ALTER TABLE public.notification_delivery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notification_delivery_log
CREATE POLICY "Users can view their own delivery logs"
ON public.notification_delivery_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert delivery logs"
ON public.notification_delivery_log
FOR INSERT
WITH CHECK (true);

-- RLS Policies for notification_analytics
CREATE POLICY "Users can view their own analytics"
ON public.notification_analytics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
ON public.notification_analytics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to group similar notifications
CREATE OR REPLACE FUNCTION public.group_similar_notifications(
  p_user_id uuid,
  p_type text,
  p_time_window interval DEFAULT '1 hour'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_key text;
BEGIN
  -- Generate a group key based on type and time window
  v_group_key := p_type || '_' || DATE_TRUNC('hour', NOW())::text;
  RETURN v_group_key;
END;
$$;

-- Function to get notification analytics summary
CREATE OR REPLACE FUNCTION public.get_notification_analytics(
  p_user_id uuid,
  p_days_back integer DEFAULT 30
)
RETURNS TABLE(
  total_notifications bigint,
  delivered_count bigint,
  opened_count bigint,
  clicked_count bigint,
  open_rate numeric,
  click_rate numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(DISTINCT ndl.notification_id) as total_notifications,
    COUNT(DISTINCT CASE WHEN ndl.delivered_at IS NOT NULL THEN ndl.id END) as delivered_count,
    COUNT(DISTINCT CASE WHEN ndl.opened_at IS NOT NULL THEN ndl.id END) as opened_count,
    COUNT(DISTINCT CASE WHEN ndl.clicked_at IS NOT NULL THEN ndl.id END) as clicked_count,
    ROUND(
      COUNT(DISTINCT CASE WHEN ndl.opened_at IS NOT NULL THEN ndl.id END)::numeric / 
      NULLIF(COUNT(DISTINCT CASE WHEN ndl.delivered_at IS NOT NULL THEN ndl.id END), 0) * 100,
      2
    ) as open_rate,
    ROUND(
      COUNT(DISTINCT CASE WHEN ndl.clicked_at IS NOT NULL THEN ndl.id END)::numeric / 
      NULLIF(COUNT(DISTINCT CASE WHEN ndl.opened_at IS NOT NULL THEN ndl.id END), 0) * 100,
      2
    ) as click_rate
  FROM public.notification_delivery_log ndl
  WHERE ndl.user_id = p_user_id
    AND ndl.created_at >= NOW() - INTERVAL '1 day' * p_days_back;
$$;