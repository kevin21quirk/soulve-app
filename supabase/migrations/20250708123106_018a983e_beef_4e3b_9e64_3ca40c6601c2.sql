-- Create business products table for companies to advertise their products/services
CREATE TABLE public.business_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'product',
  price_range TEXT,
  target_audience TEXT,
  launch_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  social_impact_statement TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business partnerships table
CREATE TABLE public.business_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  partnership_type TEXT NOT NULL DEFAULT 'strategic',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  value NUMERIC,
  contact_person TEXT,
  contact_email TEXT,
  objectives TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employee engagement table
CREATE TABLE public.employee_engagement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  hours_contributed INTEGER NOT NULL DEFAULT 0,
  impact_points INTEGER NOT NULL DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CSR initiatives table
CREATE TABLE public.csr_initiatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'community',
  status TEXT NOT NULL DEFAULT 'planning',
  budget_allocated NUMERIC,
  budget_spent NUMERIC DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_beneficiaries INTEGER,
  actual_beneficiaries INTEGER DEFAULT 0,
  impact_metrics JSONB DEFAULT '{}',
  sdg_goals TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.business_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csr_initiatives ENABLE ROW LEVEL SECURITY;

-- Create policies for business_products
CREATE POLICY "Anyone can view products" 
ON public.business_products 
FOR SELECT 
USING (true);

CREATE POLICY "Organization members can manage products" 
ON public.business_products 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'manager', 'staff')
      AND is_active = true
  )
);

-- Create policies for business_partnerships
CREATE POLICY "Organization members can view partnerships" 
ON public.business_partnerships 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage partnerships" 
ON public.business_partnerships 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'manager')
      AND is_active = true
  )
);

-- Create policies for employee_engagement
CREATE POLICY "Organization members can view engagement" 
ON public.employee_engagement 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true
  )
);

CREATE POLICY "Organization members can manage their engagement" 
ON public.employee_engagement 
FOR ALL 
USING (
  (employee_id = auth.uid()) OR 
  (organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'manager')
      AND is_active = true
  ))
);

-- Create policies for csr_initiatives
CREATE POLICY "Anyone can view CSR initiatives" 
ON public.csr_initiatives 
FOR SELECT 
USING (true);

CREATE POLICY "Organization members can manage CSR initiatives" 
ON public.csr_initiatives 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'manager', 'staff')
      AND is_active = true
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_business_products_updated_at
  BEFORE UPDATE ON public.business_products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_business_partnerships_updated_at
  BEFORE UPDATE ON public.business_partnerships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_employee_engagement_updated_at
  BEFORE UPDATE ON public.employee_engagement
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_csr_initiatives_updated_at
  BEFORE UPDATE ON public.csr_initiatives
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();