-- Drop the old constraint that's missing notification types
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add comprehensive constraint with all notification types used in triggers
ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type = ANY (ARRAY[
  'connection_request'::text,
  'connection_accepted'::text,
  'message'::text,
  'post_interaction'::text,
  'group_invitation'::text,
  'campaign_update'::text,
  'demo_request'::text,
  'esg_milestone'::text,
  'esg_verification'::text,
  'esg_report_ready'::text,
  'help_completion_request'::text,
  'help_approved'::text,
  'help_rejected'::text,
  'feedback_status_update'::text
]));