-- Create skill categories table with market rates
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  market_rate_gbp NUMERIC NOT NULL,
  requires_verification BOOLEAN DEFAULT false,
  evidence_required BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on skill_categories
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

-- Public read access to skill categories
CREATE POLICY "Anyone can view skill categories"
  ON public.skill_categories FOR SELECT
  USING (true);

-- Add new columns to impact_activities for skill-based tracking
ALTER TABLE public.impact_activities
ADD COLUMN IF NOT EXISTS skill_category_id UUID REFERENCES public.skill_categories(id),
ADD COLUMN IF NOT EXISTS hours_contributed NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS market_rate_used NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS market_value_gbp NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_conversion_rate NUMERIC DEFAULT 0.5;

-- Add total market value to impact_metrics
ALTER TABLE public.impact_metrics
ADD COLUMN IF NOT EXISTS total_market_value_contributed NUMERIC DEFAULT 0;

-- Create index for skill category lookups
CREATE INDEX IF NOT EXISTS idx_impact_activities_skill_category 
  ON public.impact_activities(skill_category_id);

-- Populate initial skill categories with market rates
INSERT INTO public.skill_categories (name, category, market_rate_gbp, requires_verification, evidence_required, description) VALUES
  ('Legal Advice', 'professional_services', 120, true, true, 'Legal consultation and advice'),
  ('Financial Planning', 'professional_services', 90, true, true, 'Financial advisory and planning services'),
  ('Accounting', 'professional_services', 80, true, true, 'Bookkeeping and accounting services'),
  ('Web Development', 'technology', 75, true, true, 'Website and web application development'),
  ('Software Development', 'technology', 85, true, true, 'Software engineering and programming'),
  ('Data Analysis', 'technology', 70, true, true, 'Data analytics and insights'),
  ('Cybersecurity', 'technology', 95, true, true, 'Security consulting and implementation'),
  ('Graphic Design', 'creative', 45, false, true, 'Visual design and branding'),
  ('Video Production', 'creative', 55, false, true, 'Video editing and production'),
  ('Photography', 'creative', 50, false, true, 'Professional photography services'),
  ('Marketing Strategy', 'marketing', 60, false, true, 'Marketing planning and strategy'),
  ('Social Media Management', 'marketing', 40, false, false, 'Social media content and management'),
  ('Content Writing', 'marketing', 35, false, false, 'Copywriting and content creation'),
  ('SEO Consulting', 'marketing', 55, false, true, 'Search engine optimization'),
  ('Project Management', 'management', 65, false, true, 'Project planning and coordination'),
  ('Event Planning', 'management', 45, false, false, 'Event coordination and management'),
  ('HR Consulting', 'management', 70, true, true, 'Human resources consulting'),
  ('Teaching/Tutoring', 'education', 35, false, false, 'Educational instruction and tutoring'),
  ('Training & Development', 'education', 50, false, true, 'Professional training programs'),
  ('Language Translation', 'education', 40, false, false, 'Translation and interpretation'),
  ('Medical Services', 'healthcare', 100, true, true, 'Medical consultation and care'),
  ('Mental Health Counseling', 'healthcare', 80, true, true, 'Therapy and counseling services'),
  ('Nutrition Consulting', 'healthcare', 60, true, true, 'Dietary and nutrition advice'),
  ('Carpentry', 'trades', 45, false, true, 'Woodworking and construction'),
  ('Plumbing', 'trades', 50, false, true, 'Plumbing services and repairs'),
  ('Electrical Work', 'trades', 55, true, true, 'Electrical installation and repair'),
  ('Painting', 'trades', 35, false, false, 'Interior and exterior painting'),
  ('Landscaping', 'trades', 30, false, false, 'Garden and landscape maintenance'),
  ('Automotive Repair', 'trades', 45, false, true, 'Vehicle maintenance and repair'),
  ('General Labor', 'general', 15, false, false, 'General assistance and labor'),
  ('Administrative Support', 'general', 25, false, false, 'Office and administrative tasks'),
  ('Customer Service', 'general', 20, false, false, 'Customer support and service'),
  ('Transportation/Driving', 'general', 18, false, false, 'Transportation and delivery services'),
  ('Childcare', 'caregiving', 20, false, false, 'Childcare and supervision'),
  ('Elder Care', 'caregiving', 25, false, true, 'Senior care and assistance'),
  ('Pet Care', 'caregiving', 18, false, false, 'Pet sitting and care')
ON CONFLICT DO NOTHING;

-- Create function to calculate total market value
CREATE OR REPLACE FUNCTION public.calculate_total_market_value(target_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_value NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(market_value_gbp), 0) INTO total_value
  FROM public.impact_activities
  WHERE user_id = target_user_id 
    AND verified = true
    AND market_value_gbp > 0;
  
  RETURN total_value;
END;
$$;

-- Update trigger to recalculate market value when activities change
CREATE OR REPLACE FUNCTION public.update_market_value_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.impact_metrics
  SET total_market_value_contributed = public.calculate_total_market_value(NEW.user_id),
      calculated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_market_value_metrics
  AFTER INSERT OR UPDATE ON public.impact_activities
  FOR EACH ROW
  WHEN (NEW.market_value_gbp > 0)
  EXECUTE FUNCTION public.update_market_value_metrics();