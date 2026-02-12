-- Fix critical security vulnerability: Secure ESG data access with proper RLS policies
-- This addresses the issue where confidential ESG data could be misused by competitors

-- Enable RLS on all ESG-related tables if not already enabled
ALTER TABLE public.esg_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_esg_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiality_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_groups ENABLE ROW LEVEL SECURITY;

-- Drop any overly permissive policies that might exist
DROP POLICY IF EXISTS "ESG data is public" ON public.organization_esg_data;
DROP POLICY IF EXISTS "Anyone can view ESG data" ON public.organization_esg_data;
DROP POLICY IF EXISTS "Public ESG access" ON public.esg_reports;
DROP POLICY IF EXISTS "Public materiality access" ON public.materiality_assessments;

-- Secure organization_esg_data table (most sensitive data)
DROP POLICY IF EXISTS "Organization members can view ESG data" ON public.organization_esg_data;
DROP POLICY IF EXISTS "Organization admins can manage ESG data" ON public.organization_esg_data;

CREATE POLICY "Organization members can view ESG data"
ON public.organization_esg_data 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage ESG data"
ON public.organization_esg_data 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- Secure esg_frameworks and esg_indicators (reference data should be readable by authenticated users only)
DROP POLICY IF EXISTS "Authenticated users can view ESG frameworks" ON public.esg_frameworks;
CREATE POLICY "Authenticated users can view active ESG frameworks"
ON public.esg_frameworks 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

DROP POLICY IF EXISTS "Authenticated users can view ESG indicators" ON public.esg_indicators;
CREATE POLICY "Authenticated users can view ESG indicators"
ON public.esg_indicators 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Verify existing policies for other ESG tables are properly restrictive
-- esg_recommendations should only be accessible to organization members
DROP POLICY IF EXISTS "Organization members can manage ESG recommendations" ON public.esg_recommendations;
CREATE POLICY "Organization members can view ESG recommendations"
ON public.esg_recommendations 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage ESG recommendations"
ON public.esg_recommendations 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- esg_risks should only be accessible to organization members
DROP POLICY IF EXISTS "Organization members can manage ESG risks" ON public.esg_risks;
CREATE POLICY "Organization members can view ESG risks"
ON public.esg_risks 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage ESG risks"
ON public.esg_risks 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- esg_reports should only be accessible to organization members
DROP POLICY IF EXISTS "Organization members can manage ESG reports" ON public.esg_reports;
CREATE POLICY "Organization members can view ESG reports"
ON public.esg_reports 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage ESG reports"
ON public.esg_reports 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- Verify materiality_assessments policies are properly restrictive
DROP POLICY IF EXISTS "Organization members can view materiality assessments" ON public.materiality_assessments;
DROP POLICY IF EXISTS "Organization admins can manage materiality assessments" ON public.materiality_assessments;

CREATE POLICY "Organization members can view materiality assessments"
ON public.materiality_assessments 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage materiality assessments"
ON public.materiality_assessments 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- Verify stakeholder engagement metrics policies
DROP POLICY IF EXISTS "Organization members can view stakeholder metrics" ON public.stakeholder_engagement_metrics;
DROP POLICY IF EXISTS "Organization admins can manage stakeholder metrics" ON public.stakeholder_engagement_metrics;

CREATE POLICY "Organization members can view stakeholder metrics"
ON public.stakeholder_engagement_metrics 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage stakeholder metrics"
ON public.stakeholder_engagement_metrics 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- Verify stakeholder groups policies
DROP POLICY IF EXISTS "Organization members can manage stakeholder groups" ON public.stakeholder_groups;
CREATE POLICY "Organization members can view stakeholder groups"
ON public.stakeholder_groups 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can manage stakeholder groups"
ON public.stakeholder_groups 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- Add audit logging for sensitive ESG data access
CREATE OR REPLACE FUNCTION public.log_esg_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Log access to sensitive ESG data for security monitoring
  INSERT INTO public.security_audit_log (
    user_id, 
    action_type, 
    severity, 
    details
  ) VALUES (
    auth.uid(),
    'esg_data_access',
    'info',
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'organization_id', COALESCE(NEW.organization_id, OLD.organization_id),
      'operation', TG_OP,
      'timestamp', now()
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Add audit triggers for sensitive ESG tables
CREATE TRIGGER esg_data_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.organization_esg_data
  FOR EACH ROW EXECUTE FUNCTION public.log_esg_data_access();

CREATE TRIGGER materiality_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.materiality_assessments
  FOR EACH ROW EXECUTE FUNCTION public.log_esg_data_access();