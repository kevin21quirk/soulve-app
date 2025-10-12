-- Create campaign_sponsorships table for corporate sponsorships
CREATE TABLE IF NOT EXISTS public.campaign_sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sponsorship_tier TEXT NOT NULL CHECK (sponsorship_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  amount_pledged NUMERIC NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  benefits TEXT[] DEFAULT '{}',
  visibility_type TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activated_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create csr_opportunities table to link organizations with community needs
CREATE TABLE IF NOT EXISTS public.csr_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'interested' CHECK (status IN ('interested', 'contacted', 'committed', 'completed', 'declined')),
  notes TEXT,
  estimated_value NUMERIC,
  actual_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create csr_lead_tracking table for monitoring business engagement
CREATE TABLE IF NOT EXISTS public.csr_lead_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'contact', 'support', 'sponsor')),
  user_id UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_sponsorships_campaign ON public.campaign_sponsorships(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sponsorships_org ON public.campaign_sponsorships(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sponsorships_status ON public.campaign_sponsorships(status);

CREATE INDEX IF NOT EXISTS idx_csr_opportunities_org ON public.csr_opportunities(organization_id);
CREATE INDEX IF NOT EXISTS idx_csr_opportunities_post ON public.csr_opportunities(post_id);
CREATE INDEX IF NOT EXISTS idx_csr_opportunities_status ON public.csr_opportunities(status);

CREATE INDEX IF NOT EXISTS idx_csr_lead_tracking_org ON public.csr_lead_tracking(organization_id);
CREATE INDEX IF NOT EXISTS idx_csr_lead_tracking_action ON public.csr_lead_tracking(action_type);
CREATE INDEX IF NOT EXISTS idx_csr_lead_tracking_created ON public.csr_lead_tracking(created_at);

-- Enable RLS
ALTER TABLE public.campaign_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csr_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csr_lead_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaign_sponsorships
CREATE POLICY "Organizations can view their sponsorships"
  ON public.campaign_sponsorships FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Campaign creators can view sponsorships"
  ON public.campaign_sponsorships FOR SELECT
  USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage sponsorships"
  ON public.campaign_sponsorships FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'manager')
      AND is_active = true
    )
  );

-- RLS Policies for csr_opportunities
CREATE POLICY "Organizations can manage their opportunities"
  ON public.csr_opportunities FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Post authors can view opportunities"
  ON public.csr_opportunities FOR SELECT
  USING (
    post_id IN (
      SELECT id FROM public.posts WHERE author_id = auth.uid()
    )
  );

-- RLS Policies for csr_lead_tracking
CREATE POLICY "Organizations can view their lead tracking"
  ON public.csr_lead_tracking FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "System can insert lead tracking"
  ON public.csr_lead_tracking FOR INSERT
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_campaign_sponsorships_updated_at
  BEFORE UPDATE ON public.campaign_sponsorships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_csr_opportunities_updated_at
  BEFORE UPDATE ON public.csr_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_sponsorships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.csr_opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.csr_lead_tracking;