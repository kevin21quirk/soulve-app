-- Create badges system tables
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  progress INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, badge_id)
);

-- Create points configuration table
CREATE TABLE IF NOT EXISTS public.points_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default points configuration
INSERT INTO public.points_configuration (config_key, config_value, description, category) VALUES
('base_points', '{"help_completed": 25, "help_received": 5, "donation": 10, "volunteer": 15, "post_created": 5}', 'Base point values for activities', 'points'),
('multipliers', '{"streak": 1.5, "verified_user": 1.2, "premium": 1.3}', 'Multiplier values', 'points'),
('decay_settings', '{"enabled": true, "rate": 5, "interval_days": 30, "max_decay": 50}', 'Point decay configuration', 'decay'),
('trust_levels', '{"bronze": 0, "silver": 100, "gold": 500, "platinum": 1000, "diamond": 2500}', 'Trust level thresholds', 'trust')
ON CONFLICT (config_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_configuration ENABLE ROW LEVEL SECURITY;

-- Badges policies
CREATE POLICY "Anyone can view active badges"
  ON public.badges FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (is_admin(auth.uid()));

-- User badges policies
CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can award badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage user badges"
  ON public.user_badges FOR ALL
  USING (is_admin(auth.uid()));

-- Points configuration policies
CREATE POLICY "Anyone can view points config"
  ON public.points_configuration FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage points config"
  ON public.points_configuration FOR ALL
  USING (is_admin(auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_badges_updated_at
  BEFORE UPDATE ON public.badges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_points_config_updated_at
  BEFORE UPDATE ON public.points_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.badges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_badges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.points_configuration;