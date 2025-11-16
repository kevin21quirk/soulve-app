-- Add DELETE policy for demo_requests table
-- This allows admins to delete demo requests from the admin panel

CREATE POLICY "Admins can delete demo requests"
ON public.demo_requests FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);