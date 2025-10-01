-- Drop public access policies that expose sensitive business data
DROP POLICY IF EXISTS "Anyone can view products" ON public.business_products;
DROP POLICY IF EXISTS "Anyone can view CSR initiatives" ON public.csr_initiatives;

-- Ensure only authenticated organization members can view business products
-- (The existing "Organization members can view business products" policy already handles this correctly)

-- Ensure only authenticated organization members can view CSR initiatives  
-- (The existing "Organization members can view CSR initiatives" policy already handles this correctly)

-- Verify RLS is enabled on both tables
ALTER TABLE public.business_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csr_initiatives ENABLE ROW LEVEL SECURITY;

-- Add comment explaining the security model
COMMENT ON TABLE public.business_products IS 'Business products are private - only viewable by authenticated organization members';
COMMENT ON TABLE public.csr_initiatives IS 'CSR initiatives are private - only viewable by authenticated organization members';