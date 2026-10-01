-- Complete Mark Smith's onboarding by creating a questionnaire response
-- This will allow him to access the dashboard after being approved

-- Get Mark's user ID
DO $$
DECLARE
  mark_user_id UUID;
  mark_email TEXT := 'mark.smith.iom@gmail.com';
BEGIN
  -- Get Mark's ID
  SELECT id INTO mark_user_id
  FROM public.profiles
  WHERE email = mark_email;

  IF mark_user_id IS NULL THEN
    RAISE NOTICE 'User with email % not found', mark_email;
  ELSE
    RAISE NOTICE 'Found Mark Smith with ID: %', mark_user_id;
    
    -- Check if questionnaire response already exists
    IF EXISTS (SELECT 1 FROM public.questionnaire_responses WHERE user_id = mark_user_id) THEN
      RAISE NOTICE 'Questionnaire response already exists for Mark';
    ELSE
      -- Create a basic questionnaire response to complete onboarding
      INSERT INTO public.questionnaire_responses (
        user_id,
        user_type,
        motivation,
        response_data,
        created_at,
        updated_at
      )
      VALUES (
        mark_user_id,
        'individual', -- Default to individual, can be updated later
        'help_others', -- Default motivation
        '{"onboarding_completed": true, "created_by": "admin_manual_fix"}', -- Minimal response data
        NOW(),
        NOW()
      );
      
      RAISE NOTICE 'Created questionnaire response for Mark Smith';
    END IF;
  END IF;
END $$;

-- Verify Mark's complete status
SELECT 
  p.id,
  p.email,
  p.waitlist_status,
  CASE 
    WHEN qr.id IS NOT NULL THEN 'YES - Onboarding Complete'
    ELSE 'NO - Missing Questionnaire'
  END as onboarding_status,
  qr.user_type,
  qr.motivation,
  qr.created_at as questionnaire_created
FROM public.profiles p
LEFT JOIN public.questionnaire_responses qr ON p.id = qr.user_id
WHERE p.email = 'mark.smith.iom@gmail.com';
