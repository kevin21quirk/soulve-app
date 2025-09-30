-- Phase 1: Clean up orphaned data and fix Post Reactions Relationship
-- Delete post_reactions that reference non-existent users
DELETE FROM public.post_reactions
WHERE user_id NOT IN (SELECT id FROM public.profiles);

-- Now add the foreign key constraint
ALTER TABLE public.post_reactions
DROP CONSTRAINT IF EXISTS post_reactions_user_id_fkey;

ALTER TABLE public.post_reactions
ADD CONSTRAINT post_reactions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Phase 2: Fix Points System Initialization
-- Update handle_new_user to initialize gamification data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Initialize impact metrics for gamification
  INSERT INTO public.impact_metrics (
    user_id,
    impact_score,
    trust_score,
    help_provided_count,
    help_received_count,
    volunteer_hours,
    donation_amount,
    connections_count,
    response_time_hours,
    average_rating,
    red_flag_count
  ) VALUES (
    NEW.id,
    0,    -- impact_score
    50,   -- trust_score (starting value)
    0,    -- help_provided_count
    0,    -- help_received_count
    0,    -- volunteer_hours
    0,    -- donation_amount
    0,    -- connections_count
    0,    -- response_time_hours
    0,    -- average_rating
    0     -- red_flag_count
  );
  
  -- Initialize default trust domain
  INSERT INTO public.trust_domains (
    user_id,
    domain,
    domain_score,
    actions_count,
    average_rating
  ) VALUES (
    NEW.id,
    'community_building',
    0,
    0,
    0
  );
  
  -- Insert default privacy settings
  INSERT INTO public.user_privacy_settings (
    user_id,
    profile_visibility,
    allow_direct_messages,
    show_online_status,
    show_location,
    show_email,
    show_phone,
    allow_tagging,
    show_activity_feed
  ) VALUES (
    NEW.id,
    'public',
    'everyone',
    true,
    true,
    false,
    false,
    true,
    true
  );
  
  RETURN NEW;
END;
$function$;

-- Phase 3: Initialize missing impact_metrics for existing users
INSERT INTO public.impact_metrics (
  user_id,
  impact_score,
  trust_score,
  help_provided_count,
  help_received_count,
  volunteer_hours,
  donation_amount,
  connections_count,
  response_time_hours,
  average_rating,
  red_flag_count
)
SELECT 
  p.id,
  0,
  50,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
FROM public.profiles p
WHERE p.id NOT IN (SELECT user_id FROM public.impact_metrics)
ON CONFLICT (user_id) DO NOTHING;

-- Initialize missing trust_domains for existing users
INSERT INTO public.trust_domains (
  user_id,
  domain,
  domain_score,
  actions_count,
  average_rating
)
SELECT 
  p.id,
  'community_building',
  0,
  0,
  0
FROM public.profiles p
WHERE p.id NOT IN (SELECT user_id FROM public.trust_domains WHERE domain = 'community_building')
ON CONFLICT (user_id, domain) DO NOTHING;