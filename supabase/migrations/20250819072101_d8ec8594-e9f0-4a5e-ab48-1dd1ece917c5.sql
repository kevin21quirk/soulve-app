-- ESG Data Input and Management Tables
CREATE TABLE public.esg_data_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  indicator_id UUID NOT NULL,
  reporting_period DATE NOT NULL,
  value NUMERIC,
  text_value TEXT,
  unit TEXT,
  data_source TEXT DEFAULT 'manual_entry',
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'internal', 'third_party')),
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ESG Goals and Targets
CREATE TABLE public.esg_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  indicator_id UUID,
  goal_name TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  target_unit TEXT,
  baseline_value NUMERIC,
  baseline_year INTEGER,
  target_year INTEGER NOT NULL,
  current_value NUMERIC DEFAULT 0,
  progress_percentage NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL CHECK (category IN ('environmental', 'social', 'governance')),
  milestones JSONB DEFAULT '[]'::jsonb,
  responsible_team TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ESG Reports and Templates
CREATE TABLE public.esg_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('gri', 'sasb', 'tcfd', 'ungc', 'integrated', 'custom')),
  framework_version TEXT,
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published')),
  template_data JSONB DEFAULT '{}'::jsonb,
  generated_content TEXT,
  cover_image TEXT,
  executive_summary TEXT,
  created_by UUID,
  approved_by UUID,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Stakeholder Engagement Tracking
CREATE TABLE public.stakeholder_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  group_name TEXT NOT NULL,
  stakeholder_type TEXT NOT NULL CHECK (stakeholder_type IN ('employees', 'investors', 'customers', 'suppliers', 'community', 'regulators', 'ngos')),
  description TEXT,
  engagement_methods JSONB DEFAULT '[]'::jsonb,
  contact_frequency TEXT DEFAULT 'quarterly',
  key_interests JSONB DEFAULT '[]'::jsonb,
  influence_level TEXT DEFAULT 'medium' CHECK (influence_level IN ('low', 'medium', 'high')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Benchmarking Data
CREATE TABLE public.esg_benchmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry_sector TEXT NOT NULL,
  indicator_id UUID NOT NULL,
  benchmark_type TEXT NOT NULL CHECK (benchmark_type IN ('industry_average', 'top_quartile', 'best_practice', 'regulatory_minimum')),
  value NUMERIC NOT NULL,
  unit TEXT,
  data_source TEXT,
  reporting_year INTEGER NOT NULL,
  geographical_scope TEXT,
  sample_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Recommendations and Insights
CREATE TABLE public.esg_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('improvement', 'risk_mitigation', 'best_practice', 'compliance', 'efficiency')),
  priority_score NUMERIC DEFAULT 50,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommended_actions JSONB DEFAULT '[]'::jsonb,
  potential_impact TEXT,
  implementation_effort TEXT DEFAULT 'medium' CHECK (implementation_effort IN ('low', 'medium', 'high')),
  estimated_cost_range TEXT,
  related_indicators JSONB DEFAULT '[]'::jsonb,
  data_sources JSONB DEFAULT '[]'::jsonb,
  confidence_score NUMERIC DEFAULT 0.7,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'accepted', 'rejected', 'implemented')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  implementation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk Assessment
CREATE TABLE public.esg_risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  risk_name TEXT NOT NULL,
  risk_category TEXT NOT NULL CHECK (risk_category IN ('environmental', 'social', 'governance')),
  risk_type TEXT NOT NULL CHECK (risk_type IN ('physical', 'transition', 'regulatory', 'reputational', 'operational')),
  description TEXT NOT NULL,
  probability_score NUMERIC DEFAULT 3 CHECK (probability_score >= 1 AND probability_score <= 5),
  impact_score NUMERIC DEFAULT 3 CHECK (impact_score >= 1 AND impact_score <= 5),
  risk_score NUMERIC GENERATED ALWAYS AS (probability_score * impact_score) STORED,
  risk_level TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (probability_score * impact_score) <= 6 THEN 'low'
      WHEN (probability_score * impact_score) <= 15 THEN 'medium'
      WHEN (probability_score * impact_score) <= 20 THEN 'high'
      ELSE 'critical'
    END
  ) STORED,
  mitigation_strategies JSONB DEFAULT '[]'::jsonb,
  residual_risk_score NUMERIC,
  owner_department TEXT,
  review_frequency TEXT DEFAULT 'quarterly',
  last_reviewed DATE,
  next_review_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'mitigated', 'transferred', 'accepted')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.esg_data_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_risks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ESG Data Entries
CREATE POLICY "Organization members can manage ESG data entries"
ON public.esg_data_entries
FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = true
));

-- RLS Policies for ESG Goals
CREATE POLICY "Organization members can manage ESG goals"
ON public.esg_goals
FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = true
));

-- RLS Policies for ESG Reports
CREATE POLICY "Organization members can manage ESG reports"
ON public.esg_reports
FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = true
));

-- RLS Policies for Stakeholder Groups
CREATE POLICY "Organization members can manage stakeholder groups"
ON public.stakeholder_groups
FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = true
));

-- RLS Policies for ESG Benchmarks (read-only for most users)
CREATE POLICY "ESG benchmarks are viewable by organization members"
ON public.esg_benchmarks
FOR SELECT
USING (true);

-- RLS Policies for ESG Recommendations
CREATE POLICY "Organization members can manage ESG recommendations"
ON public.esg_recommendations
FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = true
));

-- RLS Policies for ESG Risks
CREATE POLICY "Organization members can manage ESG risks"
ON public.esg_risks
FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = true
));

-- Create updated_at triggers
CREATE TRIGGER update_esg_data_entries_updated_at
  BEFORE UPDATE ON public.esg_data_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_goals_updated_at
  BEFORE UPDATE ON public.esg_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_reports_updated_at
  BEFORE UPDATE ON public.esg_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stakeholder_groups_updated_at
  BEFORE UPDATE ON public.stakeholder_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_benchmarks_updated_at
  BEFORE UPDATE ON public.esg_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_recommendations_updated_at
  BEFORE UPDATE ON public.esg_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_risks_updated_at
  BEFORE UPDATE ON public.esg_risks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();