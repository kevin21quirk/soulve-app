-- Enhanced Badge System: Event-Specific Badges Support

-- Add new columns to badges table for event/campaign-specific badges
ALTER TABLE public.badges 
ADD COLUMN IF NOT EXISTS campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS event_identifier text,
ADD COLUMN IF NOT EXISTS availability_window_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS availability_window_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS limited_edition boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS max_awards integer,
ADD COLUMN IF NOT EXISTS current_award_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS verification_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS evidence_requirements jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cooldown_hours integer,
ADD COLUMN IF NOT EXISTS max_per_user integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS badge_category text DEFAULT 'achievement' CHECK (badge_category IN ('achievement', 'campaign', 'event', 'milestone', 'recognition'));

-- Create index on event_identifier for fast lookups
CREATE INDEX IF NOT EXISTS idx_badges_event_identifier ON public.badges(event_identifier) WHERE event_identifier IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_badges_campaign ON public.badges(campaign_id) WHERE campaign_id IS NOT NULL;

-- Create badge award log table for audit trail and anti-gaming
CREATE TABLE IF NOT EXISTS public.badge_award_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at timestamp with time zone NOT NULL DEFAULT now(),
  awarded_by uuid, -- admin/system identifier
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'auto_verified')),
  evidence_submitted jsonb DEFAULT '{}'::jsonb,
  contribution_details jsonb DEFAULT '{}'::jsonb,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  activity_ids uuid[], -- links to specific impact_activities
  revoked_at timestamp with time zone,
  revoked_by uuid,
  revocation_reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_id) -- Prevent duplicate awards (unless badge allows multiple)
);

-- Enable RLS on badge_award_log
ALTER TABLE public.badge_award_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badge_award_log
CREATE POLICY "Users can view their own badge awards"
  ON public.badge_award_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create badge awards"
  ON public.badge_award_log
  FOR INSERT
  WITH CHECK (true); -- Will be controlled by edge function

CREATE POLICY "Admins can manage all badge awards"
  ON public.badge_award_log
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_badge_award_log_user ON public.badge_award_log(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_award_log_badge ON public.badge_award_log(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_award_log_status ON public.badge_award_log(verification_status);
CREATE INDEX IF NOT EXISTS idx_badge_award_log_campaign ON public.badge_award_log(campaign_id) WHERE campaign_id IS NOT NULL;

-- Add columns to campaigns table to link exclusive badges
ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS exclusive_badge_id uuid REFERENCES public.badges(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS badge_criteria jsonb DEFAULT '{}'::jsonb;

-- Function to increment badge award count when badge is awarded
CREATE OR REPLACE FUNCTION public.increment_badge_award_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only increment if verification status is verified or auto_verified
  IF NEW.verification_status IN ('verified', 'auto_verified') AND 
     (OLD.verification_status IS NULL OR OLD.verification_status NOT IN ('verified', 'auto_verified')) THEN
    
    UPDATE public.badges
    SET current_award_count = COALESCE(current_award_count, 0) + 1
    WHERE id = NEW.badge_id;
    
    -- Also update user_badges table if exists
    INSERT INTO public.user_badges (user_id, badge_id, earned_at, progress)
    VALUES (NEW.user_id, NEW.badge_id, NEW.awarded_at, 100)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to increment badge award count
DROP TRIGGER IF EXISTS increment_badge_award_count_trigger ON public.badge_award_log;
CREATE TRIGGER increment_badge_award_count_trigger
  AFTER INSERT OR UPDATE ON public.badge_award_log
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_badge_award_count();

-- Function to check if badge can be awarded (rate limiting, max awards, etc.)
CREATE OR REPLACE FUNCTION public.can_award_badge(
  p_badge_id uuid,
  p_user_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_badge RECORD;
  v_user_award_count integer;
  v_last_award_time timestamp with time zone;
  v_result jsonb;
BEGIN
  -- Get badge configuration
  SELECT * INTO v_badge FROM public.badges WHERE id = p_badge_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge not found');
  END IF;
  
  -- Check if badge is active
  IF NOT v_badge.is_active THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge is not active');
  END IF;
  
  -- Check availability window
  IF v_badge.availability_window_start IS NOT NULL AND now() < v_badge.availability_window_start THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge not yet available');
  END IF;
  
  IF v_badge.availability_window_end IS NOT NULL AND now() > v_badge.availability_window_end THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Badge availability window has ended');
  END IF;
  
  -- Check max awards limit
  IF v_badge.max_awards IS NOT NULL AND v_badge.current_award_count >= v_badge.max_awards THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'Maximum badge awards reached');
  END IF;
  
  -- Check per-user limit
  SELECT COUNT(*) INTO v_user_award_count
  FROM public.badge_award_log
  WHERE badge_id = p_badge_id 
    AND user_id = p_user_id
    AND verification_status IN ('verified', 'auto_verified')
    AND revoked_at IS NULL;
  
  IF v_user_award_count >= COALESCE(v_badge.max_per_user, 1) THEN
    RETURN jsonb_build_object('can_award', false, 'reason', 'User already has this badge');
  END IF;
  
  -- Check cooldown
  IF v_badge.cooldown_hours IS NOT NULL THEN
    SELECT MAX(awarded_at) INTO v_last_award_time
    FROM public.badge_award_log
    WHERE badge_id = p_badge_id 
      AND user_id = p_user_id
      AND verification_status IN ('verified', 'auto_verified');
    
    IF v_last_award_time IS NOT NULL AND 
       v_last_award_time + (v_badge.cooldown_hours || ' hours')::interval > now() THEN
      RETURN jsonb_build_object(
        'can_award', false, 
        'reason', 'Cooldown period not expired',
        'retry_after', v_last_award_time + (v_badge.cooldown_hours || ' hours')::interval
      );
    END IF;
  END IF;
  
  RETURN jsonb_build_object('can_award', true);
END;
$$;

-- Create notification trigger for badge awards
CREATE OR REPLACE FUNCTION public.notify_badge_award()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_badge RECORD;
BEGIN
  -- Only notify on verified badges
  IF NEW.verification_status IN ('verified', 'auto_verified') AND
     (OLD.verification_status IS NULL OR OLD.verification_status NOT IN ('verified', 'auto_verified')) THEN
    
    SELECT * INTO v_badge FROM public.badges WHERE id = NEW.badge_id;
    
    INSERT INTO public.notifications (
      recipient_id,
      type,
      title,
      message,
      priority,
      metadata
    ) VALUES (
      NEW.user_id,
      'badge_awarded',
      'New Badge Earned! 🎖️',
      'Congratulations! You''ve earned the "' || v_badge.name || '" badge',
      CASE 
        WHEN v_badge.rarity = 'legendary' THEN 'high'
        WHEN v_badge.limited_edition THEN 'high'
        ELSE 'normal'
      END,
      jsonb_build_object(
        'badge_id', NEW.badge_id,
        'badge_name', v_badge.name,
        'badge_icon', v_badge.icon,
        'rarity', v_badge.rarity,
        'limited_edition', v_badge.limited_edition,
        'award_log_id', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_badge_award_trigger ON public.badge_award_log;
CREATE TRIGGER notify_badge_award_trigger
  AFTER INSERT OR UPDATE ON public.badge_award_log
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_badge_award();

-- Add comment explaining the system
COMMENT ON TABLE public.badge_award_log IS 'Audit trail for all badge awards, includes verification status and anti-gaming measures';
COMMENT ON COLUMN public.badges.event_identifier IS 'Unique identifier for historical events (e.g., "grenfell_2017", "7_7_2005")';
COMMENT ON COLUMN public.badges.limited_edition IS 'Marks badges as permanently exclusive and highly valuable';
COMMENT ON COLUMN public.badges.verification_required IS 'If true, requires admin approval before badge is awarded';
COMMENT ON COLUMN public.badges.evidence_requirements IS 'JSON specification of what evidence/proof is required to earn this badge';