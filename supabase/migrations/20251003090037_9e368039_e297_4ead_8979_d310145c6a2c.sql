-- Add automatic goal progress tracking when impact activities are created
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Update goals based on activity type
  FOR goal_record IN 
    SELECT id, target_value, current_value, category
    FROM public.impact_goals
    WHERE user_id = NEW.user_id 
      AND is_active = true
  LOOP
    -- Update helping goals
    IF goal_record.category = 'helping' AND NEW.activity_type IN ('help_provided', 'help_completed') THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(current_value + 1, target_value),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update volunteer goals  
    ELSIF goal_record.category = 'volunteer' AND NEW.activity_type = 'volunteer' THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(
            current_value + COALESCE((NEW.metadata->>'hours')::INTEGER, 1), 
            target_value
          ),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update donation goals
    ELSIF goal_record.category = 'donation' AND NEW.activity_type IN ('donation', 'recurring_donation') THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(
            current_value + COALESCE((NEW.metadata->>'amount')::NUMERIC, 0), 
            target_value
          ),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update networking goals
    ELSIF goal_record.category = 'networking' AND NEW.activity_type = 'connection' THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(current_value + 1, target_value),
          updated_at = now()
      WHERE id = goal_record.id;
    
    -- Update engagement goals
    ELSIF goal_record.category = 'engagement' AND NEW.activity_type = 'engagement' THEN
      UPDATE public.impact_goals
      SET current_value = LEAST(current_value + 1, target_value),
          updated_at = now()
      WHERE id = goal_record.id;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update goals when activities are added
DROP TRIGGER IF EXISTS update_goals_on_activity ON public.impact_activities;
CREATE TRIGGER update_goals_on_activity
  AFTER INSERT ON public.impact_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress();

-- Function to create default goals for new users
CREATE OR REPLACE FUNCTION create_default_goals_for_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user already has goals
  IF EXISTS (SELECT 1 FROM public.impact_goals WHERE user_id = target_user_id) THEN
    RETURN;
  END IF;
  
  -- Create default goals
  INSERT INTO public.impact_goals (user_id, title, description, target_value, current_value, deadline, category, is_active)
  VALUES
    (target_user_id, 'Help 5 People This Month', 'Complete help requests from community members', 5, 0, (now() + interval '30 days')::date, 'helping', true),
    (target_user_id, 'Volunteer 10 Hours', 'Contribute volunteer time to community projects', 10, 0, (now() + interval '60 days')::date, 'volunteer', true),
    (target_user_id, 'Make 10 Connections', 'Build your community network', 10, 0, (now() + interval '30 days')::date, 'networking', true);
END;
$$;

-- Function to track response time for help requests
CREATE OR REPLACE FUNCTION calculate_response_time()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  post_created_at TIMESTAMP WITH TIME ZONE;
  response_time_hours NUMERIC;
BEGIN
  -- Get when the post was created
  SELECT created_at INTO post_created_at
  FROM public.posts
  WHERE id = NEW.post_id;
  
  IF post_created_at IS NOT NULL AND NEW.interaction_type = 'interest_shown' THEN
    -- Calculate hours between post creation and first response
    response_time_hours := EXTRACT(EPOCH FROM (NEW.created_at - post_created_at)) / 3600;
    
    -- Update user's average response time
    UPDATE public.impact_metrics
    SET response_time_hours = COALESCE(
          (response_time_hours * 0.3 + response_time_hours * 0.7), 
          response_time_hours
        ),
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for response time tracking
DROP TRIGGER IF EXISTS track_response_time ON public.post_interactions;
CREATE TRIGGER track_response_time
  AFTER INSERT ON public.post_interactions
  FOR EACH ROW
  WHEN (NEW.interaction_type = 'interest_shown')
  EXECUTE FUNCTION calculate_response_time();

-- Add index for better performance on impact activities queries
CREATE INDEX IF NOT EXISTS idx_impact_activities_user_created 
  ON public.impact_activities(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_impact_activities_type_verified 
  ON public.impact_activities(activity_type, verified);

-- Add index for goals queries
CREATE INDEX IF NOT EXISTS idx_impact_goals_user_active 
  ON public.impact_goals(user_id, is_active) WHERE is_active = true;