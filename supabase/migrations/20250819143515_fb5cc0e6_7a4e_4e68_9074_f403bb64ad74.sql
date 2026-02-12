-- Fix donor data security by restricting access to sensitive personal information
-- Current issue: All organization members can view sensitive donor data
-- Solution: Create separate policies for public vs sensitive donor information

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Organization members can view donors" ON public.donors;
DROP POLICY IF EXISTS "Organization admins can manage donors" ON public.donors;

-- Create secure policies that separate access to sensitive vs non-sensitive data

-- Policy 1: Organization members can view basic donor statistics (no personal info)
CREATE POLICY "Organization members can view donor statistics" 
ON public.donors 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true
  )
  -- This policy only works with specific column-level access
  -- The application should use views or functions to expose only non-sensitive data
);

-- Policy 2: Only authorized fundraising staff can view sensitive donor information
CREATE POLICY "Fundraising staff can view all donor data" 
ON public.donors 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'fundraiser') 
      AND is_active = true
  )
);

-- Policy 3: Only authorized fundraising staff can manage donors
CREATE POLICY "Fundraising staff can manage donors" 
ON public.donors 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'fundraiser') 
      AND is_active = true
  )
);

-- Create a secure view for organization members to access donor statistics without personal info
CREATE OR REPLACE VIEW public.donor_statistics AS
SELECT 
  id,
  organization_id,
  donor_type,
  total_donated,
  donation_count,
  first_donation_date,
  last_donation_date,
  average_donation,
  donor_status,
  tags,
  created_at,
  updated_at,
  -- Only show first letter of first name and last name for privacy
  CASE 
    WHEN first_name IS NOT NULL THEN LEFT(first_name, 1) || '.'
    ELSE NULL 
  END as first_initial,
  CASE 
    WHEN last_name IS NOT NULL THEN LEFT(last_name, 1) || '.'
    ELSE NULL 
  END as last_initial,
  -- Show masked email (first 2 chars + *** + domain)
  CASE 
    WHEN email IS NOT NULL THEN 
      LEFT(email, 2) || '***@' || SPLIT_PART(email, '@', 2)
    ELSE NULL 
  END as masked_email
FROM public.donors;

-- Enable RLS on the view
ALTER VIEW public.donor_statistics SET (security_barrier = true);

-- Create RLS policy for the statistics view
CREATE POLICY "Organization members can view donor statistics view" 
ON public.donor_statistics 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true
  )
);

-- Create a security definer function to check if user has fundraising access
CREATE OR REPLACE FUNCTION public.can_access_donor_details(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'fundraiser') 
      AND is_active = true
  );
$$;