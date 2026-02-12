-- Clean up duplicate questionnaire_responses (keep oldest record based on created_at for each user)
DELETE FROM questionnaire_responses
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS rn
    FROM questionnaire_responses
  ) t
  WHERE t.rn > 1
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE questionnaire_responses
ADD CONSTRAINT questionnaire_responses_user_id_unique UNIQUE (user_id);