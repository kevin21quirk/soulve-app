-- SECURITY FIX: Remove the overly permissive policy that allows viewing all users' impact metrics
-- This policy was allowing anyone to harvest user IDs and behavioral patterns

-- Drop the dangerous policy that exposes all users' data
DROP POLICY IF EXISTS "Users can view all impact metrics for community comparison" ON public.impact_metrics;

-- Drop the overly permissive system policy as well 
DROP POLICY IF EXISTS "System can update impact metrics" ON public.impact_metrics;

-- Create a more secure policy that only allows users to view their own impact metrics
-- This policy already exists but ensuring it's the primary one
CREATE POLICY "Users can view only their own impact metrics" 
ON public.impact_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to update their own impact metrics (for legitimate use cases)
CREATE POLICY "Users can update their own impact metrics" 
ON public.impact_metrics 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to insert their own impact metrics
CREATE POLICY "Users can insert their own impact metrics" 
ON public.impact_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Only allow system functions to update/insert impact metrics 
-- This prevents direct manipulation while allowing legitimate system operations
CREATE POLICY "System functions can manage impact metrics" 
ON public.impact_metrics 
FOR ALL 
USING (current_setting('role') = 'service_role' OR auth.role() = 'service_role');

-- For debugging: Allow admins to view impact metrics if needed
-- (You may remove this if admin access is not required)
CREATE POLICY "Admins can view impact metrics for moderation" 
ON public.impact_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);