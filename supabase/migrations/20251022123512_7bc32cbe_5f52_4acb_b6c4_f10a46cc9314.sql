-- Subscription plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_monthly NUMERIC(10,2),
  price_annual NUMERIC(10,2),
  features JSONB DEFAULT '[]'::jsonb,
  max_campaigns INTEGER,
  max_team_members INTEGER,
  white_label_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  yapily_consent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  current_period_start DATE,
  current_period_end DATE,
  next_payment_date DATE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Platform payments
CREATE TABLE IF NOT EXISTS public.platform_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organisation_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  payment_type TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  yapily_payment_id TEXT,
  yapily_consent_id TEXT,
  yapily_institution_id TEXT,
  payment_reference TEXT UNIQUE,
  bank_transfer_details JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  payment_date TIMESTAMPTZ,
  reconciled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payment references for bank transfers
CREATE TABLE IF NOT EXISTS public.payment_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL,
  payment_id UUID REFERENCES public.platform_payments(id) ON DELETE CASCADE,
  expected_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  expires_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- White label purchases
CREATE TABLE IF NOT EXISTS public.white_label_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.platform_payments(id),
  configuration JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  licence_start_date DATE,
  licence_end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Advertising bookings
CREATE TABLE IF NOT EXISTS public.advertising_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.platform_payments(id),
  ad_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.white_label_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertising_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id OR organisation_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "Users can insert their own subscriptions"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id OR organisation_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  ));

-- RLS Policies for platform_payments
CREATE POLICY "Users can view their own payments"
  ON public.platform_payments FOR SELECT
  USING (auth.uid() = user_id OR organisation_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "Users can create their own payments"
  ON public.platform_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_references
CREATE POLICY "Users can view their payment references"
  ON public.payment_references FOR SELECT
  USING (payment_id IN (
    SELECT id FROM public.platform_payments WHERE user_id = auth.uid()
  ));

-- RLS Policies for white_label_purchases
CREATE POLICY "Org admins can view white label purchases"
  ON public.white_label_purchases FOR SELECT
  USING (organisation_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  ));

-- RLS Policies for advertising_bookings
CREATE POLICY "Org members can view advertising bookings"
  ON public.advertising_bookings FOR SELECT
  USING (organisation_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_annual, features, max_campaigns, max_team_members, white_label_enabled) VALUES
('Free', 0.00, 0.00, '["Basic Impact Analytics", "Up to 3 Campaigns", "Badge System Access", "Safe Space Access"]'::jsonb, 3, 1, false),
('Individual', 9.99, 95.90, '["Advanced Impact Analytics", "Up to 10 Campaigns", "Badge System Access", "Safe Space Access", "Priority Support"]'::jsonb, 10, 1, false),
('Organisation', 49.99, 479.90, '["Advanced Impact Analytics", "Up to 50 Campaigns", "Badge System Access", "Safe Space Access", "Team Collaboration (15 members)", "Custom Branding", "Priority Support"]'::jsonb, 50, 15, false),
('Enterprise', 299.00, 2870.00, '["Premium Analytics & Custom Reports", "Unlimited Campaigns", "Badge System Access", "Safe Space Priority Support", "Unlimited Team Members", "White Label Option", "API Access", "Dedicated Account Manager", "Custom Badge Design"]'::jsonb, 999999, 999999, true)
ON CONFLICT DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();