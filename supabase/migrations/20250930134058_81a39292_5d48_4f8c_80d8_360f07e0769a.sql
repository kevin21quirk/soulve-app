-- Fix security vulnerabilities: Restrict public access to sensitive data

-- Organizations: Remove overly permissive public view policy and restrict contact info
DROP POLICY IF EXISTS "Organizations are viewable by everyone" ON public.organizations;

-- Organizations can be viewed by members and admins only
CREATE POLICY "Organization members can view organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR created_by = auth.uid()
);

-- Business Products: Restrict to organization members only
DROP POLICY IF EXISTS "Public can view business products" ON public.business_products;

CREATE POLICY "Organization members can view business products"
ON public.business_products
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- CSR Initiatives: Restrict to organization members only
DROP POLICY IF EXISTS "Public can view CSR initiatives" ON public.csr_initiatives;

CREATE POLICY "Organization members can view CSR initiatives"
ON public.csr_initiatives
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Organization Preferences: Already has correct policy, but ensure it's strict
DROP POLICY IF EXISTS "Organization preferences are viewable by everyone" ON public.organization_preferences;

CREATE POLICY "Organization members can view preferences"
ON public.organization_preferences
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);