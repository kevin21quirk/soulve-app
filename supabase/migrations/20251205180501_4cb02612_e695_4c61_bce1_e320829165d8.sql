-- Step 1: Drop the problematic recursive policy on admin_roles
DROP POLICY IF EXISTS "admin_roles_admin_all" ON public.admin_roles;

-- Step 2: Create a SECURITY DEFINER function that bypasses RLS entirely
-- This is safe because SECURITY DEFINER functions run with owner privileges
CREATE OR REPLACE FUNCTION public.is_admin_raw(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'super_admin')
  );
$$;

-- Step 3: Update the existing is_admin function to use the raw function
-- This ensures all existing usages continue to work
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_admin_raw(user_uuid);
$$;

-- Step 4: Create a new non-recursive policy for admin_roles
-- Uses is_admin_raw which bypasses RLS, breaking the recursion loop
CREATE POLICY "admin_roles_admin_all_fixed"
ON public.admin_roles
FOR ALL
TO authenticated
USING (public.is_admin_raw(auth.uid()))
WITH CHECK (public.is_admin_raw(auth.uid()));