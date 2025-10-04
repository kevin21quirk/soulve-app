-- Add columns to support skill-based volunteer tracking with market rates

ALTER TABLE public.impact_activities 
ADD COLUMN IF NOT EXISTS skill_category_id UUID REFERENCES public.skill_categories(id),
ADD COLUMN IF NOT EXISTS hours_contributed NUMERIC,
ADD COLUMN IF NOT EXISTS market_rate_used NUMERIC,
ADD COLUMN IF NOT EXISTS market_value_gbp NUMERIC,
ADD COLUMN IF NOT EXISTS points_conversion_rate NUMERIC DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS evidence_submitted BOOLEAN DEFAULT false;

-- Add index for faster lookups by skill category
CREATE INDEX IF NOT EXISTS idx_impact_activities_skill_category 
ON public.impact_activities(skill_category_id);

-- Add index for market value calculations
CREATE INDEX IF NOT EXISTS idx_impact_activities_market_value 
ON public.impact_activities(user_id, market_value_gbp) 
WHERE market_value_gbp > 0;

-- Add comment explaining the columns
COMMENT ON COLUMN public.impact_activities.skill_category_id IS 'Reference to the professional skill used for volunteer work';
COMMENT ON COLUMN public.impact_activities.hours_contributed IS 'Number of hours contributed for this activity';
COMMENT ON COLUMN public.impact_activities.market_rate_used IS 'Market rate per hour (in GBP) used for point calculation';
COMMENT ON COLUMN public.impact_activities.market_value_gbp IS 'Total market value calculated (hours × rate)';
COMMENT ON COLUMN public.impact_activities.points_conversion_rate IS 'Conversion rate from market value to points (default 0.5)';
COMMENT ON COLUMN public.impact_activities.evidence_submitted IS 'Whether evidence has been submitted for verification';