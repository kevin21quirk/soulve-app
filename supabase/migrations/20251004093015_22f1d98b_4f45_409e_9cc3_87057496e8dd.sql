-- Phase 2A: ESG Stakeholder Onboarding Database Schema

-- Create esg_data_requests table
CREATE TABLE IF NOT EXISTS public.esg_data_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_from_org_id UUID REFERENCES public.organizations(id),
  requested_from_email TEXT,
  indicator_id UUID REFERENCES public.esg_indicators(id),
  framework_id UUID REFERENCES public.esg_frameworks(id),
  reporting_period DATE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'rejected')),
  request_message TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stakeholder_data_contributions table
CREATE TABLE IF NOT EXISTS public.stakeholder_data_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_request_id UUID REFERENCES public.esg_data_requests(id) ON DELETE CASCADE,
  esg_data_id UUID REFERENCES public.organization_esg_data(id),
  contributor_org_id UUID REFERENCES public.organizations(id),
  contributor_user_id UUID,
  contribution_status TEXT DEFAULT 'draft' CHECK (contribution_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extend organization_invitations for ESG context
ALTER TABLE public.organization_invitations 
ADD COLUMN IF NOT EXISTS invitation_type TEXT DEFAULT 'general' CHECK (invitation_type IN ('general', 'esg_contributor', 'esg_viewer'));

ALTER TABLE public.organization_invitations 
ADD COLUMN IF NOT EXISTS esg_context JSONB DEFAULT '{}'::jsonb;

-- Add ESG role to organization_members
ALTER TABLE public.organization_members
ADD COLUMN IF NOT EXISTS esg_role TEXT CHECK (esg_role IN ('esg_admin', 'esg_contributor', 'esg_viewer', 'esg_approver'));

-- Create esg_announcements table for Phase 2D
CREATE TABLE IF NOT EXISTS public.esg_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT CHECK (announcement_type IN ('update', 'achievement', 'target', 'event', 'data_request')),
  target_audience JSONB DEFAULT '["all"]'::jsonb,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL,
  view_count INTEGER DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for esg_data_requests
ALTER TABLE public.esg_data_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view data requests"
ON public.esg_data_requests
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR requested_from_org_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization admins can create data requests"
ON public.esg_data_requests
FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

CREATE POLICY "Organization admins can update data requests"
ON public.esg_data_requests
FOR UPDATE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- RLS Policies for stakeholder_data_contributions
ALTER TABLE public.stakeholder_data_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contributors can view their contributions"
ON public.stakeholder_data_contributions
FOR SELECT
TO authenticated
USING (
  contributor_user_id = auth.uid()
  OR contributor_org_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR data_request_id IN (
    SELECT id FROM public.esg_data_requests
    WHERE organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  )
);

CREATE POLICY "Contributors can create contributions"
ON public.stakeholder_data_contributions
FOR INSERT
TO authenticated
WITH CHECK (
  contributor_user_id = auth.uid()
  OR contributor_org_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Contributors can update their contributions"
ON public.stakeholder_data_contributions
FOR UPDATE
TO authenticated
USING (
  contributor_user_id = auth.uid()
  OR contributor_org_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- RLS Policies for esg_announcements
ALTER TABLE public.esg_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view announcements"
ON public.esg_announcements
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR target_audience @> '["all"]'::jsonb
);

CREATE POLICY "Organization admins can manage announcements"
ON public.esg_announcements
FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner') 
      AND is_active = true
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_esg_data_requests_org ON public.esg_data_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_esg_data_requests_status ON public.esg_data_requests(status);
CREATE INDEX IF NOT EXISTS idx_esg_data_requests_from_org ON public.esg_data_requests(requested_from_org_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_contributions_request ON public.stakeholder_data_contributions(data_request_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_contributions_org ON public.stakeholder_data_contributions(contributor_org_id);
CREATE INDEX IF NOT EXISTS idx_esg_announcements_org ON public.esg_announcements(organization_id);