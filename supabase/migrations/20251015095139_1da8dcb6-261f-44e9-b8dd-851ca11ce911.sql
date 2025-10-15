-- Sprint 1: ESG Initiative Management System - Database Foundation

-- Create esg_initiatives table
CREATE TABLE public.esg_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  initiative_name TEXT NOT NULL,
  initiative_type TEXT NOT NULL DEFAULT 'report', -- 'report', 'audit', 'certification', 'assessment'
  framework_id UUID REFERENCES public.esg_frameworks(id),
  reporting_period_start DATE,
  reporting_period_end DATE,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'planning', -- 'planning', 'collecting', 'reviewing', 'completed', 'archived'
  target_stakeholder_groups JSONB DEFAULT '[]'::jsonb,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on esg_initiatives
ALTER TABLE public.esg_initiatives ENABLE ROW LEVEL SECURITY;

-- RLS policies for esg_initiatives
CREATE POLICY "Organization members can view initiatives"
  ON public.esg_initiatives FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage initiatives"
  ON public.esg_initiatives FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() 
        AND role IN ('admin', 'owner', 'manager')
        AND is_active = true
    )
  );

-- Add initiative_id to esg_data_requests
ALTER TABLE public.esg_data_requests 
ADD COLUMN initiative_id UUID REFERENCES public.esg_initiatives(id) ON DELETE SET NULL;

-- Add initiative_id to esg_reports
ALTER TABLE public.esg_reports 
ADD COLUMN initiative_id UUID REFERENCES public.esg_initiatives(id) ON DELETE SET NULL;

-- Create esg_initiative_templates table
CREATE TABLE public.esg_initiative_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  framework_id UUID REFERENCES public.esg_frameworks(id),
  category TEXT NOT NULL, -- 'sustainability', 'carbon', 'social', 'governance', 'compliance'
  description TEXT,
  required_indicators JSONB DEFAULT '[]'::jsonb, -- Array of indicator IDs or references
  suggested_stakeholder_types JSONB DEFAULT '[]'::jsonb, -- ['suppliers', 'employees', 'investors']
  typical_duration_days INTEGER DEFAULT 90,
  milestone_templates JSONB DEFAULT '[]'::jsonb, -- Suggested milestones/checkpoints
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on esg_initiative_templates
ALTER TABLE public.esg_initiative_templates ENABLE ROW LEVEL SECURITY;

-- RLS policy for templates (everyone can view active templates)
CREATE POLICY "Anyone can view active templates"
  ON public.esg_initiative_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON public.esg_initiative_templates FOR ALL
  USING (public.is_admin(auth.uid()));

-- Insert seed templates for common frameworks
INSERT INTO public.esg_initiative_templates (name, category, description, suggested_stakeholder_types, typical_duration_days) VALUES
('GRI Universal Standards Report', 'sustainability', 'Comprehensive sustainability report following GRI Universal Standards 2021', '["suppliers", "employees", "investors", "community"]', 120),
('Carbon Footprint Assessment', 'carbon', 'Measure and report organizational carbon emissions (Scope 1, 2, 3)', '["suppliers", "facility_managers", "logistics_partners"]', 60),
('Supply Chain Social Audit', 'social', 'Assess social compliance and labor practices in supply chain', '["suppliers", "contractors", "vendors"]', 90),
('ISO 14001 Environmental Management', 'governance', 'Environmental management system compliance reporting', '["facility_managers", "operations", "suppliers"]', 180),
('SASB Materiality Assessment', 'governance', 'Identify and prioritize material ESG topics using SASB framework', '["leadership", "stakeholders", "investors"]', 45);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_esg_initiatives_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_esg_initiatives_updated_at
  BEFORE UPDATE ON public.esg_initiatives
  FOR EACH ROW
  EXECUTE FUNCTION public.update_esg_initiatives_updated_at();

CREATE TRIGGER update_esg_initiative_templates_updated_at
  BEFORE UPDATE ON public.esg_initiative_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_esg_initiatives_updated_at();

-- Create index for better query performance
CREATE INDEX idx_esg_initiatives_org_id ON public.esg_initiatives(organization_id);
CREATE INDEX idx_esg_initiatives_status ON public.esg_initiatives(status);
CREATE INDEX idx_esg_data_requests_initiative_id ON public.esg_data_requests(initiative_id);
CREATE INDEX idx_esg_reports_initiative_id ON public.esg_reports(initiative_id);