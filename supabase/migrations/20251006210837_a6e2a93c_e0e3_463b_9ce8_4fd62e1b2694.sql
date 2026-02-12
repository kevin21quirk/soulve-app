-- Update calculate_trust_score function to give more points for government_id verification
CREATE OR REPLACE FUNCTION public.calculate_trust_score(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  base_score INTEGER := 50;
  verification_bonus INTEGER := 0;
  total_score INTEGER;
BEGIN
  -- Calculate bonus points from approved verifications with weighted scoring
  SELECT COALESCE(
    SUM(
      CASE verification_type
        WHEN 'government_id' THEN 25       -- Increased from 10 to 25
        WHEN 'organization' THEN 20
        WHEN 'background_check' THEN 15
        WHEN 'community_leader' THEN 12
        WHEN 'expert' THEN 10
        WHEN 'phone' THEN 5
        WHEN 'email' THEN 5
        ELSE 5
      END
    ), 0
  ) INTO verification_bonus
  FROM public.user_verifications 
  WHERE user_id = user_uuid AND status = 'approved';
  
  -- Calculate total score (cap at 100)
  total_score := LEAST(base_score + verification_bonus, 100);
  
  RETURN total_score;
END;
$function$;