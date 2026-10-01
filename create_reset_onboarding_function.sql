-- Create reset_user_onboarding function for admin dashboard
-- This function allows admins to reset a user's onboarding status
-- Run this in NEW Supabase project (btwuqhrkhbblszuipumg)

CREATE OR REPLACE FUNCTION public.reset_user_onboarding(
  target_user_id UUID,
  reset_profile_data BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can reset user onboarding';
  END IF;

  -- Delete questionnaire response (this marks onboarding as incomplete)
  DELETE FROM public.questionnaire_responses
  WHERE user_id = target_user_id;

  -- Optionally reset profile data
  IF reset_profile_data THEN
    UPDATE public.profiles
    SET 
      first_name = NULL,
      last_name = NULL,
      bio = NULL,
      location = NULL,
      skills = NULL,
      interests = NULL,
      avatar_url = NULL,
      banner_url = NULL,
      banner_type = NULL,
      updated_at = NOW()
    WHERE id = target_user_id;
  END IF;

  -- Log the action (optional - if you have an audit log table)
  -- INSERT INTO admin_audit_log (admin_id, action, target_user_id, details)
  -- VALUES (auth.uid(), 'reset_onboarding', target_user_id, jsonb_build_object('reset_profile_data', reset_profile_data));

END;
$$;

-- Grant execute permission to authenticated users (function checks admin status internally)
GRANT EXECUTE ON FUNCTION public.reset_user_onboarding(UUID, BOOLEAN) TO authenticated;

-- Test the function exists
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name = 'reset_user_onboarding';
