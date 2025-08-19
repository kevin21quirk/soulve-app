-- Create materiality assessment table
CREATE TABLE public.materiality_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID,
  indicator_id UUID,
  assessment_year INTEGER NOT NULL,
  stakeholder_importance NUMERIC NOT NULL,
  business_impact NUMERIC NOT NULL,
  priority_level TEXT,
  stakeholder_feedback TEXT,
  action_plan TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ESG benchmarks table
CREATE TABLE public.esg_benchmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  indicator_id UUID,
  benchmark_type TEXT NOT NULL,
  benchmark_value NUMERIC,
  industry_average NUMERIC,
  percentile_rank NUMERIC,
  comparison_period TEXT,
  data_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ESG audit logs table
CREATE TABLE public.esg_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_values JSONB DEFAULT '{}',
  new_values JSONB DEFAULT '{}',
  user_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create stakeholder engagement metrics table
CREATE TABLE public.stakeholder_engagement_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID,
  stakeholder_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_unit TEXT,
  measurement_date DATE NOT NULL,
  engagement_method TEXT,
  response_rate NUMERIC,
  satisfaction_score NUMERIC,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ESG compliance reports table
CREATE TABLE public.esg_compliance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID,
  framework_id UUID,
  report_type TEXT NOT NULL,
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  status TEXT DEFAULT 'draft',
  generated_data JSONB DEFAULT '{}',
  report_url TEXT,
  generated_by UUID,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stakeholder groups table
CREATE TABLE public.stakeholder_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  group_name TEXT NOT NULL,
  stakeholder_type TEXT NOT NULL,
  description TEXT,
  contact_frequency TEXT DEFAULT 'quarterly',
  influence_level TEXT DEFAULT 'medium',
  engagement_methods JSONB DEFAULT '[]',
  key_interests JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create carbon footprint data table
CREATE TABLE public.carbon_footprint_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  scope_1_emissions NUMERIC DEFAULT 0,
  scope_2_emissions NUMERIC DEFAULT 0,
  scope_3_emissions NUMERIC DEFAULT 0,
  total_emissions NUMERIC DEFAULT 0,
  measurement_period_start DATE NOT NULL,
  measurement_period_end DATE NOT NULL,
  verification_status TEXT DEFAULT 'unverified',
  verified_by TEXT,
  emissions_reduction_target NUMERIC,
  renewable_energy_percentage NUMERIC DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.materiality_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_footprint_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organization members
CREATE POLICY "Organization members can manage materiality assessments" ON public.materiality_assessments
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization members can view materiality assessments" ON public.materiality_assessments
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage materiality assessments" ON public.materiality_assessments
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  )
);

CREATE POLICY "Organization members can view benchmarks" ON public.esg_benchmarks
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage benchmarks" ON public.esg_benchmarks
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  )
);

CREATE POLICY "Organization members can view audit logs" ON public.esg_audit_logs
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "System can create audit logs" ON public.esg_audit_logs
FOR INSERT WITH CHECK (true);

CREATE POLICY "Organization members can view stakeholder metrics" ON public.stakeholder_engagement_metrics
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage stakeholder metrics" ON public.stakeholder_engagement_metrics
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  )
);

CREATE POLICY "Organization members can view compliance reports" ON public.esg_compliance_reports
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage compliance reports" ON public.esg_compliance_reports
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  )
);

CREATE POLICY "Organization members can manage stakeholder groups" ON public.stakeholder_groups
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization members can view carbon footprint" ON public.carbon_footprint_data
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage carbon footprint" ON public.carbon_footprint_data
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  )
);

-- Create updated_at triggers
CREATE TRIGGER update_materiality_assessments_updated_at
  BEFORE UPDATE ON public.materiality_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_benchmarks_updated_at
  BEFORE UPDATE ON public.esg_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stakeholder_engagement_metrics_updated_at
  BEFORE UPDATE ON public.stakeholder_engagement_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_compliance_reports_updated_at
  BEFORE UPDATE ON public.esg_compliance_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stakeholder_groups_updated_at
  BEFORE UPDATE ON public.stakeholder_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_carbon_footprint_data_updated_at
  BEFORE UPDATE ON public.carbon_footprint_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create functions for ESG calculations
CREATE OR REPLACE FUNCTION public.calculate_esg_score(org_id UUID, assessment_year INTEGER)
RETURNS NUMERIC AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_esg_compliance_status(org_id UUID)
RETURNS TABLE(framework_name TEXT, compliance_percentage NUMERIC, missing_indicators INTEGER, last_update DATE) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;