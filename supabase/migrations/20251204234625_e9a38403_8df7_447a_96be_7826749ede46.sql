-- Add user_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'individual';

-- Create function to sync questionnaire data to profile and user_preferences
CREATE OR REPLACE FUNCTION public.sync_questionnaire_to_profile()
RETURNS TRIGGER AS $$
DECLARE
  interests_array text[];
  skills_array text[];
  user_location text;
  interest text;
  skill text;
BEGIN
  -- Extract interests and skills from response_data
  interests_array := COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(NEW.response_data->'interests')),
    ARRAY[]::text[]
  );
  
  skills_array := COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(NEW.response_data->'skills')),
    ARRAY[]::text[]
  );
  
  -- Extract location from personalInfo if available
  user_location := NEW.response_data->'personalInfo'->>'location';
  
  -- Update profile with user_type, interests, and skills
  UPDATE public.profiles
  SET 
    user_type = NEW.user_type,
    interests = interests_array,
    skills = skills_array,
    location = COALESCE(user_location, location),
    updated_at = now()
  WHERE id = NEW.user_id;
  
  -- Clear existing preferences for this user
  DELETE FROM public.user_preferences WHERE user_id = NEW.user_id;
  
  -- Insert interests as preferences with weight 2.0
  FOREACH interest IN ARRAY interests_array
  LOOP
    INSERT INTO public.user_preferences (user_id, preference_type, preference_value, weight)
    VALUES (NEW.user_id, 'interest', lower(interest), 2.0)
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Insert skills as preferences with weight 3.0
  FOREACH skill IN ARRAY skills_array
  LOOP
    INSERT INTO public.user_preferences (user_id, preference_type, preference_value, weight)
    VALUES (NEW.user_id, 'skill', lower(skill), 3.0)
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Insert location as preference with weight 1.5
  IF user_location IS NOT NULL AND user_location != '' THEN
    INSERT INTO public.user_preferences (user_id, preference_type, preference_value, weight)
    VALUES (NEW.user_id, 'location_preference', lower(user_location), 1.5)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on questionnaire_responses
DROP TRIGGER IF EXISTS sync_questionnaire_to_profile_trigger ON public.questionnaire_responses;
CREATE TRIGGER sync_questionnaire_to_profile_trigger
  AFTER INSERT ON public.questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_questionnaire_to_profile();

-- Backfill existing questionnaire data to profiles
UPDATE public.profiles p
SET 
  user_type = qr.user_type,
  interests = COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(qr.response_data->'interests')),
    p.interests
  ),
  skills = COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(qr.response_data->'skills')),
    p.skills
  ),
  updated_at = now()
FROM public.questionnaire_responses qr
WHERE p.id = qr.user_id
  AND (p.user_type IS NULL OR p.user_type = 'individual');