-- Fix infinite recursion in admin_roles RLS policies
-- The issue: is_admin() function queries admin_roles, but admin_roles RLS calls is_admin()
-- Solution: Use direct user_id check in admin_roles policies to break recursion

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can manage all admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Users can view their own admin status" ON public.admin_roles;

-- Policy 1: Allow users to check their own admin status
-- This is safe and non-recursive
CREATE POLICY "Users can view their own admin status"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Allow existing admins to manage all admin roles
-- Use direct EXISTS check instead of calling is_admin() to avoid recursion
CREATE POLICY "Admins can manage all admin roles"
ON public.admin_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'admin'
  )
);