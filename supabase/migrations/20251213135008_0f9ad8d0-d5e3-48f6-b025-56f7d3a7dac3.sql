-- Add admin RLS policies for user_verifications table
-- Admins need to view ALL verification requests
CREATE POLICY "Admins can view all verifications" 
ON public.user_verifications 
FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

-- Admins need to update ANY verification (approve/reject)
CREATE POLICY "Admins can update all verifications" 
ON public.user_verifications 
FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));