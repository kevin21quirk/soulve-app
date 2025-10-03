-- Fix recursive RLS issue on admin_roles table
-- The is_admin() function already exists as SECURITY DEFINER, which bypasses RLS
-- This prevents infinite recursion when checking admin status

-- Drop any existing policies on admin_roles that might cause recursion
DROP POLICY IF EXISTS "Admins can manage roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Users can view admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.admin_roles;

-- Policy 1: Allow users to check their own admin status
-- This is safe and non-recursive since it just checks user_id = auth.uid()
CREATE POLICY "Users can view their own admin status"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Allow admins to manage all admin roles
-- This uses the SECURITY DEFINER function is_admin() which bypasses RLS
-- Therefore it won't cause recursion
CREATE POLICY "Admins can manage all admin roles"
ON public.admin_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));