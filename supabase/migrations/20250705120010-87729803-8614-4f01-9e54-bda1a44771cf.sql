
-- Organization team management tables
CREATE TABLE public.organization_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  title TEXT,
  permissions JSONB DEFAULT '{}',
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Organization invitations table
CREATE TABLE public.organization_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  title TEXT,
  invited_by UUID NOT NULL,
  invitation_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, email)
);

-- Donor management table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  user_id UUID,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address JSONB,
  donor_type TEXT DEFAULT 'individual',
  preferred_contact_method TEXT DEFAULT 'email',
  communication_preferences JSONB DEFAULT '{}',
  total_donated NUMERIC DEFAULT 0,
  donation_count INTEGER DEFAULT 0,
  first_donation_date TIMESTAMP WITH TIME ZONE,
  last_donation_date TIMESTAMP WITH TIME ZONE,
  average_donation NUMERIC DEFAULT 0,
  donor_status TEXT DEFAULT 'active',
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Volunteer opportunities table
CREATE TABLE public.volunteer_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  skills_needed TEXT[] DEFAULT '{}',
  time_commitment TEXT,
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  max_volunteers INTEGER,
  current_volunteers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  application_deadline TIMESTAMP WITH TIME ZONE,
  background_check_required BOOLEAN DEFAULT false,
  training_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Volunteer applications table
CREATE TABLE public.volunteer_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  user_id UUID NOT NULL,
  application_message TEXT,
  availability TEXT,
  relevant_experience TEXT,
  emergency_contact JSONB,
  background_check_status TEXT DEFAULT 'not_required',
  training_status TEXT DEFAULT 'not_required',
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  hours_logged INTEGER DEFAULT 0,
  UNIQUE(opportunity_id, user_id)
);

-- Grant tracking table
CREATE TABLE public.grants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  funder_name TEXT NOT NULL,
  grant_title TEXT NOT NULL,
  amount_requested NUMERIC,
  amount_awarded NUMERIC,
  application_deadline TIMESTAMP WITH TIME ZONE,
  decision_date TIMESTAMP WITH TIME ZONE,
  project_start_date TIMESTAMP WITH TIME ZONE,
  project_end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'researching',
  application_status TEXT DEFAULT 'not_submitted',
  grant_type TEXT,
  focus_area TEXT,
  eligibility_requirements TEXT,
  application_requirements TEXT,
  notes TEXT,
  documents JSONB DEFAULT '[]',
  reporting_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Corporate partnerships table
CREATE TABLE public.corporate_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  partnership_type TEXT,
  status TEXT DEFAULT 'prospect',
  partnership_value NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  renewal_date TIMESTAMP WITH TIME ZONE,
  benefits_offered TEXT,
  requirements TEXT,
  notes TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced campaign analytics table
CREATE TABLE public.campaign_detailed_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  donations_count INTEGER DEFAULT 0,
  donations_amount NUMERIC DEFAULT 0,
  new_donors INTEGER DEFAULT 0,
  returning_donors INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  average_donation NUMERIC DEFAULT 0,
  traffic_sources JSONB DEFAULT '{}',
  demographics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_id, date)
);

-- Organization settings table
CREATE TABLE public.organization_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL UNIQUE,
  branding JSONB DEFAULT '{}',
  communication_templates JSONB DEFAULT '{}',
  donation_settings JSONB DEFAULT '{}',
  volunteer_settings JSONB DEFAULT '{}',
  analytics_preferences JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  integration_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organization_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_detailed_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organization_team_members
CREATE POLICY "Team members can view their organization members" ON public.organization_team_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage team members" ON public.organization_team_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
    )
  );

-- RLS Policies for organization_invitations
CREATE POLICY "Organization admins can manage invitations" ON public.organization_invitations
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
    )
  );

-- RLS Policies for donors
CREATE POLICY "Organization members can view donors" ON public.donors
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage donors" ON public.donors
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'fundraiser') AND is_active = true
    )
  );

-- RLS Policies for volunteer_opportunities
CREATE POLICY "Everyone can view active volunteer opportunities" ON public.volunteer_opportunities
  FOR SELECT USING (status = 'active');

CREATE POLICY "Organization members can manage volunteer opportunities" ON public.volunteer_opportunities
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- RLS Policies for volunteer_applications
CREATE POLICY "Users can view their own applications" ON public.volunteer_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create applications" ON public.volunteer_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Organization members can view applications" ON public.volunteer_applications
  FOR SELECT USING (
    opportunity_id IN (
      SELECT id FROM public.volunteer_opportunities 
      WHERE organization_id IN (
        SELECT organization_id FROM public.organization_members 
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- RLS Policies for grants
CREATE POLICY "Organization members can manage grants" ON public.grants
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- RLS Policies for corporate_partnerships
CREATE POLICY "Organization members can manage partnerships" ON public.corporate_partnerships
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- RLS Policies for campaign_detailed_analytics
CREATE POLICY "Campaign creators can view detailed analytics" ON public.campaign_detailed_analytics
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM public.campaigns 
      WHERE creator_id = auth.uid()
    )
  );

-- RLS Policies for organization_settings
CREATE POLICY "Organization admins can manage settings" ON public.organization_settings
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
    )
  );

-- Add triggers for updated_at columns
CREATE TRIGGER update_organization_team_members_updated_at 
  BEFORE UPDATE ON public.organization_team_members 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_donors_updated_at 
  BEFORE UPDATE ON public.donors 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_volunteer_opportunities_updated_at 
  BEFORE UPDATE ON public.volunteer_opportunities 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_grants_updated_at 
  BEFORE UPDATE ON public.grants 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_corporate_partnerships_updated_at 
  BEFORE UPDATE ON public.corporate_partnerships 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_organization_settings_updated_at 
  BEFORE UPDATE ON public.organization_settings 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
