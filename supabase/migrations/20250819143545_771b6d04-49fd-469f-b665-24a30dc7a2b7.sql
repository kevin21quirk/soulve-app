-- Fix donor data security by restricting access to sensitive personal information
-- Current issue: All organization members can view sensitive donor data
-- Solution: Create separate policies for authorized fundraising staff only

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Organization members can view donors" ON public.donors;
DROP POLICY IF EXISTS "Organization admins can manage donors" ON public.donors;

-- Create secure policies that restrict access to sensitive donor information

-- Policy 1: Only authorized fundraising staff can view sensitive donor information
CREATE POLICY "Fundraising staff can view donor data" 
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

-- Policy 2: Only authorized fundraising staff can manage donors
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

-- Create a function to get donor statistics without sensitive personal information
CREATE OR REPLACE FUNCTION public.get_donor_statistics(org_id uuid)
RETURNS TABLE (
  id uuid,
  organization_id uuid,
  donor_type text,
  total_donated numeric,
  donation_count integer,
  first_donation_date timestamp with time zone,
  last_donation_date timestamp with time zone,
  average_donation numeric,
  donor_status text,
  tags text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  first_initial text,
  last_initial text,
  masked_email text
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  -- Check if user has access to this organization
  SELECT 
    d.id,
    d.organization_id,
    d.donor_type,
    d.total_donated,
    d.donation_count,
    d.first_donation_date,
    d.last_donation_date,
    d.average_donation,
    d.donor_status,
    d.tags,
    d.created_at,
    d.updated_at,
    -- Only show first letter of first name and last name for privacy
    CASE 
      WHEN d.first_name IS NOT NULL THEN LEFT(d.first_name, 1) || '.'
      ELSE NULL 
    END as first_initial,
    CASE 
      WHEN d.last_name IS NOT NULL THEN LEFT(d.last_name, 1) || '.'
      ELSE NULL 
    END as last_initial,
    -- Show masked email (first 2 chars + *** + domain)
    CASE 
      WHEN d.email IS NOT NULL THEN 
        LEFT(d.email, 2) || '***@' || SPLIT_PART(d.email, '@', 2)
      ELSE NULL 
    END as masked_email
  FROM public.donors d
  WHERE d.organization_id = org_id
    AND EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = org_id 
        AND om.user_id = auth.uid() 
        AND om.is_active = true
    );
$$;