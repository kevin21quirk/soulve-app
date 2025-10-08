-- Organization Trust Scores Table
CREATE TABLE IF NOT EXISTS public.organization_trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL DEFAULT 50 CHECK (overall_score >= 0 AND overall_score <= 100),
  verification_score INTEGER DEFAULT 0,
  transparency_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  esg_score INTEGER DEFAULT 0,
  review_score INTEGER DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, calculated_at)
);

-- Organization Verifications Table
CREATE TABLE IF NOT EXISTS public.organization_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Organization Reviews Table
CREATE TABLE IF NOT EXISTS public.organization_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewer_type TEXT DEFAULT 'supporter' CHECK (reviewer_type IN ('donor', 'volunteer', 'partner', 'supporter')),
  is_verified BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, reviewer_id)
);

-- Organization Followers Table
CREATE TABLE IF NOT EXISTS public.organization_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notifications_enabled BOOLEAN DEFAULT true,
  UNIQUE(organization_id, follower_id)
);

-- Organization Activities Table
CREATE TABLE IF NOT EXISTS public.organization_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  impact_value NUMERIC,
  beneficiaries_count INTEGER DEFAULT 0,
  location TEXT,
  related_campaign_id UUID,
  media_urls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Organization Impact Metrics Table
CREATE TABLE IF NOT EXISTS public.organization_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  total_funds_raised NUMERIC DEFAULT 0,
  total_people_helped INTEGER DEFAULT 0,
  total_volunteer_hours INTEGER DEFAULT 0,
  active_campaigns INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  carbon_offset_kg NUMERIC DEFAULT 0,
  geographic_reach_countries INTEGER DEFAULT 0,
  partner_organizations INTEGER DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id)
);

-- Indexes
CREATE INDEX idx_org_trust_scores_org ON public.organization_trust_scores(organization_id);
CREATE INDEX idx_org_verifications_org ON public.organization_verifications(organization_id);
CREATE INDEX idx_org_reviews_org ON public.organization_reviews(organization_id);
CREATE INDEX idx_org_reviews_rating ON public.organization_reviews(rating);
CREATE INDEX idx_org_followers_org ON public.organization_followers(organization_id);
CREATE INDEX idx_org_followers_user ON public.organization_followers(follower_id);
CREATE INDEX idx_org_activities_org ON public.organization_activities(organization_id);
CREATE INDEX idx_org_activities_published ON public.organization_activities(published_at DESC);
CREATE INDEX idx_org_impact_metrics_org ON public.organization_impact_metrics(organization_id);

-- Enable RLS
ALTER TABLE public.organization_trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_impact_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Trust Scores (public read)
CREATE POLICY "Anyone can view trust scores"
  ON public.organization_trust_scores FOR SELECT
  USING (true);

CREATE POLICY "System can manage trust scores"
  ON public.organization_trust_scores FOR ALL
  USING (false) WITH CHECK (false);

-- RLS Policies for Verifications (public read)
CREATE POLICY "Anyone can view approved verifications"
  ON public.organization_verifications FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Org admins can manage verifications"
  ON public.organization_verifications FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
    )
  );

-- RLS Policies for Reviews
CREATE POLICY "Anyone can view reviews"
  ON public.organization_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.organization_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
  ON public.organization_reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews"
  ON public.organization_reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

-- RLS Policies for Followers
CREATE POLICY "Users can view followers"
  ON public.organization_followers FOR SELECT
  USING (true);

CREATE POLICY "Users can follow organizations"
  ON public.organization_followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow organizations"
  ON public.organization_followers FOR DELETE
  USING (auth.uid() = follower_id);

CREATE POLICY "Users can update their follow settings"
  ON public.organization_followers FOR UPDATE
  USING (auth.uid() = follower_id);

-- RLS Policies for Activities
CREATE POLICY "Anyone can view published activities"
  ON public.organization_activities FOR SELECT
  USING (published_at IS NOT NULL);

CREATE POLICY "Org members can manage activities"
  ON public.organization_activities FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- RLS Policies for Impact Metrics
CREATE POLICY "Anyone can view impact metrics"
  ON public.organization_impact_metrics FOR SELECT
  USING (true);

CREATE POLICY "Org admins can manage impact metrics"
  ON public.organization_impact_metrics FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
    )
  );

-- Function to calculate organization trust score
CREATE OR REPLACE FUNCTION public.calculate_organization_trust_score(org_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  verification_score INTEGER := 0;
  transparency_score INTEGER := 0;
  engagement_score INTEGER := 0;
  esg_score INTEGER := 0;
  review_score INTEGER := 0;
  total_score INTEGER := 0;
BEGIN
  -- Verification Score (30 points max)
  SELECT COALESCE(COUNT(*) * 5, 0) INTO verification_score
  FROM public.organization_verifications
  WHERE organization_id = org_id AND status = 'approved'
  LIMIT 6;
  
  -- Transparency Score (25 points max) - based on ESG data
  SELECT COALESCE(COUNT(*) * 5, 0) INTO transparency_score
  FROM public.organization_esg_data
  WHERE organization_id = org_id
  LIMIT 5;
  
  -- Engagement Score (20 points max) - followers and activities
  SELECT COALESCE(
    LEAST(20, (COUNT(*) / 10))
  , 0) INTO engagement_score
  FROM public.organization_followers
  WHERE organization_id = org_id;
  
  -- ESG Score (15 points max)
  SELECT COALESCE(
    LEAST(15, ROUND((AVG(business_impact) + AVG(stakeholder_importance)) / 2))
  , 0) INTO esg_score
  FROM public.materiality_assessments
  WHERE organization_id = org_id;
  
  -- Review Score (10 points max)
  SELECT COALESCE(
    LEAST(10, ROUND(AVG(rating) * 2))
  , 0) INTO review_score
  FROM public.organization_reviews
  WHERE organization_id = org_id;
  
  total_score := 50 + verification_score + transparency_score + engagement_score + esg_score + review_score;
  total_score := LEAST(100, GREATEST(0, total_score));
  
  -- Insert calculated score
  INSERT INTO public.organization_trust_scores (
    organization_id, overall_score, verification_score, transparency_score,
    engagement_score, esg_score, review_score
  ) VALUES (
    org_id, total_score, verification_score, transparency_score,
    engagement_score, esg_score, review_score
  );
  
  RETURN total_score;
END;
$$;

-- Trigger to update organization metrics
CREATE OR REPLACE FUNCTION public.update_organization_impact_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.organization_impact_metrics (organization_id)
  VALUES (NEW.organization_id)
  ON CONFLICT (organization_id) DO UPDATE
  SET last_calculated = now(),
      updated_at = now();
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_org_metrics_on_activity
  AFTER INSERT OR UPDATE ON public.organization_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_organization_impact_metrics();

CREATE TRIGGER update_org_metrics_on_review
  AFTER INSERT OR UPDATE ON public.organization_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_organization_impact_metrics();