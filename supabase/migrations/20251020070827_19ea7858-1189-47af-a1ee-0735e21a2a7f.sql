-- Fix demo_requests UPDATE policy to allow admin updates
DROP POLICY IF EXISTS "Admins can update demo requests" ON public.demo_requests;

CREATE POLICY "Admins can update demo requests"
ON public.demo_requests FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));