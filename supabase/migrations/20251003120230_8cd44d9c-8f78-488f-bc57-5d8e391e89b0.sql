-- Enhanced RLS Policies for Training Data and Admin Access

-- Ensure is_admin function exists (it already does based on db functions)
-- No need to recreate it

-- Drop existing policies on safe_space_helper_training_progress
DROP POLICY IF EXISTS "Admins can view all training progress" ON safe_space_helper_training_progress;
DROP POLICY IF EXISTS "Admins can update training progress" ON safe_space_helper_training_progress;
DROP POLICY IF EXISTS "Users can view their own training progress" ON safe_space_helper_training_progress;

-- Create enhanced admin access policies
CREATE POLICY "Admins can view all training progress"
ON safe_space_helper_training_progress
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all training progress"
ON safe_space_helper_training_progress
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Users can only view their own training progress
CREATE POLICY "Users can view own training progress"
ON safe_space_helper_training_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create admin audit log for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_action_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on admin action log
ALTER TABLE admin_action_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view the audit log
CREATE POLICY "Admins can view audit log"
ON admin_action_log
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON admin_action_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = admin_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_action_log_admin_id ON admin_action_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_log_created_at ON admin_action_log(created_at DESC);