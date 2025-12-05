-- Drop the problematic policy that causes recursive RLS checks
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Create new policy using SECURITY DEFINER function to avoid recursion
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));