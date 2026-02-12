-- Create ESG Framework and Standards tables
CREATE TABLE public.esg_frameworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- 'GRI', 'SASB', 'UN_SDG', 'TCFD', 'CUSTOM'
  version TEXT,
  description TEXT,
  official_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ESG Indicators table
CREATE TABLE public.esg_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  framework_id UUID REFERENCES public.esg_frameworks(id),
  indicator_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'environmental', 'social', 'governance'
  subcategory TEXT,
  unit_of_measurement TEXT,
  calculation_method TEXT,
  is_quantitative BOOLEAN DEFAULT true,
  reporting_frequency TEXT DEFAULT 'annual', -- 'monthly', 'quarterly', 'annual'
  materiality_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Organization ESG Data table
CREATE TABLE public.organization_esg_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  indicator_id UUID REFERENCES public.esg_indicators(id),
  reporting_period DATE NOT NULL,
  value NUMERIC,
  text_value TEXT,
  unit TEXT,
  data_source TEXT,
  verification_status TEXT DEFAULT 'unverified', -- 'unverified', 'internal', 'third_party'
  notes TEXT,
  collected_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, indicator_id, reporting_period)
);

-- Create ESG Targets table
CREATE TABLE public.esg_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  indicator_id UUID REFERENCES public.esg_indicators(id),
  target_name TEXT NOT NULL,
  baseline_value NUMERIC,
  target_value NUMERIC,
  baseline_year INTEGER,
  target_year INTEGER,
  progress_percentage NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'achieved', 'revised', 'cancelled'
  description TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ESG Compliance Reports table
CREATE TABLE public.esg_compliance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  framework_id UUID REFERENCES public.esg_frameworks(id),
  report_type TEXT NOT NULL, -- 'annual', 'quarterly', 'audit', 'custom'
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published'
  generated_data JSONB DEFAULT '{}',
  report_url TEXT,
  generated_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Materiality Assessment table
CREATE TABLE public.materiality_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  assessment_year INTEGER NOT NULL,
  stakeholder_importance NUMERIC NOT NULL, -- 0-10 scale
  business_impact NUMERIC NOT NULL, -- 0-10 scale
  indicator_id UUID REFERENCES public.esg_indicators(id),
  priority_level TEXT, -- 'low', 'medium', 'high', 'critical'
  stakeholder_feedback TEXT,
  action_plan TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, assessment_year, indicator_id)
);

-- Create Carbon Footprint Data table
CREATE TABLE public.carbon_footprint_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  scope_type INTEGER NOT NULL, -- 1, 2, or 3
  emission_source TEXT NOT NULL,
  activity_data NUMERIC NOT NULL,
  activity_unit TEXT NOT NULL,
  emission_factor NUMERIC NOT NULL,
  co2_equivalent NUMERIC NOT NULL,
  reporting_period DATE NOT NULL,
  verification_status TEXT DEFAULT 'unverified',
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Stakeholder Engagement Metrics table
CREATE TABLE public.stakeholder_engagement_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  stakeholder_type TEXT NOT NULL, -- 'employees', 'community', 'suppliers', 'investors', 'customers'
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_unit TEXT,
  measurement_date DATE NOT NULL,
  engagement_method TEXT, -- 'survey', 'interview', 'focus_group', 'digital_platform'
  response_rate NUMERIC,
  satisfaction_score NUMERIC,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.esg_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_esg_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiality_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_footprint_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_engagement_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ESG Frameworks (public read)
CREATE POLICY "ESG frameworks are viewable by everyone"
ON public.esg_frameworks FOR SELECT
USING (is_active = true);

-- RLS Policies for ESG Indicators (public read)
CREATE POLICY "ESG indicators are viewable by everyone"
ON public.esg_indicators FOR SELECT
USING (true);

-- RLS Policies for Organization ESG Data
CREATE POLICY "Organization members can view ESG data"
ON public.organization_esg_data FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage ESG data"
ON public.organization_esg_data FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- RLS Policies for ESG Targets
CREATE POLICY "Organization members can view ESG targets"
ON public.esg_targets FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage ESG targets"
ON public.esg_targets FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- RLS Policies for ESG Compliance Reports
CREATE POLICY "Organization members can view compliance reports"
ON public.esg_compliance_reports FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage compliance reports"
ON public.esg_compliance_reports FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- Similar policies for other tables
CREATE POLICY "Organization members can view materiality assessments"
ON public.materiality_assessments FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage materiality assessments"
ON public.materiality_assessments FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

CREATE POLICY "Organization members can view carbon data"
ON public.carbon_footprint_data FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage carbon data"
ON public.carbon_footprint_data FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

CREATE POLICY "Organization members can view stakeholder metrics"
ON public.stakeholder_engagement_metrics FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage stakeholder metrics"
ON public.stakeholder_engagement_metrics FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- Insert standard ESG frameworks
INSERT INTO public.esg_frameworks (name, code, version, description, official_url) VALUES
('Global Reporting Initiative', 'GRI', '2023', 'The most widely used sustainability reporting standards', 'https://www.globalreporting.org/'),
('Sustainability Accounting Standards Board', 'SASB', '2023', 'Industry-specific sustainability accounting standards', 'https://www.sasb.org/'),
('UN Sustainable Development Goals', 'UN_SDG', '2015', '17 global goals for sustainable development', 'https://sdgs.un.org/'),
('Task Force on Climate-related Financial Disclosures', 'TCFD', '2023', 'Climate-related financial risk disclosure framework', 'https://www.fsb-tcfd.org/'),
('Custom Framework', 'CUSTOM', '1.0', 'Organization-specific ESG framework', null);

-- Insert sample ESG indicators
INSERT INTO public.esg_indicators (framework_id, indicator_code, name, description, category, subcategory, unit_of_measurement) VALUES
-- Environmental indicators
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-305-1', 'Direct GHG emissions (Scope 1)', 'Gross direct GHG emissions in metric tons of CO2 equivalent', 'environmental', 'emissions', 'tCO2e'),
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-305-2', 'Energy indirect GHG emissions (Scope 2)', 'Gross location-based energy indirect GHG emissions in metric tons of CO2 equivalent', 'environmental', 'emissions', 'tCO2e'),
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-303-3', 'Water withdrawal', 'Total water withdrawal in megaliters', 'environmental', 'water', 'ML'),
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-306-3', 'Waste generated', 'Total weight of waste generated in metric tons', 'environmental', 'waste', 'metric tons'),

-- Social indicators
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-401-1', 'New employee hires', 'Total number and rates of new employee hires', 'social', 'employment', 'number'),
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-403-9', 'Work-related injuries', 'Number of fatalities, high-consequence and recordable work-related injuries', 'social', 'health_safety', 'number'),
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-404-1', 'Training per employee', 'Average hours of training per year per employee', 'social', 'training', 'hours'),
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-405-1', 'Diversity in governance', 'Percentage of individuals within governance bodies by gender and age group', 'social', 'diversity', 'percentage'),

-- Governance indicators
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-205-1', 'Anti-corruption assessment', 'Total number and percentage of operations assessed for risks related to corruption', 'governance', 'ethics', 'percentage'),
((SELECT id FROM public.esg_frameworks WHERE code = 'GRI'), 'GRI-418-1', 'Customer privacy', 'Number of substantiated complaints concerning breaches of customer privacy', 'governance', 'privacy', 'number');

-- Create functions for ESG calculations
CREATE OR REPLACE FUNCTION public.calculate_esg_score(org_id UUID, assessment_year INTEGER)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  environmental_score NUMERIC := 0;
  social_score NUMERIC := 0;
  governance_score NUMERIC := 0;
  total_score NUMERIC := 0;
  indicator_count INTEGER := 0;
BEGIN
  -- Calculate weighted average scores by category
  SELECT 
    COALESCE(AVG(CASE WHEN ei.category = 'environmental' THEN ma.business_impact * ma.stakeholder_importance END), 0),
    COALESCE(AVG(CASE WHEN ei.category = 'social' THEN ma.business_impact * ma.stakeholder_importance END), 0),
    COALESCE(AVG(CASE WHEN ei.category = 'governance' THEN ma.business_impact * ma.stakeholder_importance END), 0),
    COUNT(*)
  INTO environmental_score, social_score, governance_score, indicator_count
  FROM public.materiality_assessments ma
  JOIN public.esg_indicators ei ON ma.indicator_id = ei.id
  WHERE ma.organization_id = org_id AND ma.assessment_year = assessment_year;
  
  -- Calculate overall ESG score (weighted average: E=40%, S=35%, G=25%)
  IF indicator_count > 0 THEN
    total_score := (environmental_score * 0.4) + (social_score * 0.35) + (governance_score * 0.25);
  END IF;
  
  RETURN ROUND(total_score, 2);
END;
$$;

-- Create function to get ESG compliance status
CREATE OR REPLACE FUNCTION public.get_esg_compliance_status(org_id UUID)
RETURNS TABLE(
  framework_name TEXT,
  compliance_percentage NUMERIC,
  missing_indicators INTEGER,
  last_update DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ef.name,
    ROUND((COUNT(oed.id)::NUMERIC / COUNT(ei.id)::NUMERIC) * 100, 1) as compliance_percentage,
    (COUNT(ei.id) - COUNT(oed.id))::INTEGER as missing_indicators,
    MAX(oed.reporting_period) as last_update
  FROM public.esg_frameworks ef
  JOIN public.esg_indicators ei ON ef.id = ei.framework_id
  LEFT JOIN public.organization_esg_data oed ON ei.id = oed.indicator_id 
    AND oed.organization_id = org_id
    AND oed.reporting_period >= (CURRENT_DATE - INTERVAL '1 year')
  WHERE ef.is_active = true
  GROUP BY ef.id, ef.name
  ORDER BY compliance_percentage DESC;
END;
$$;