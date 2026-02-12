-- Update toggle_post_reaction to allow only one reaction per user per post
CREATE OR REPLACE FUNCTION public.toggle_post_reaction(target_post_id uuid, target_reaction_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  existing_reaction_id UUID;
  existing_reaction_type TEXT;
  result BOOLEAN := false;
BEGIN
  -- Check if user already has ANY reaction on this post
  SELECT id, reaction_type INTO existing_reaction_id, existing_reaction_type
  FROM public.post_reactions
  WHERE post_id = target_post_id 
    AND user_id = auth.uid();
  
  IF existing_reaction_id IS NOT NULL THEN
    -- If user clicked the same reaction, remove it (toggle off)
    IF existing_reaction_type = target_reaction_type THEN
      DELETE FROM public.post_reactions WHERE id = existing_reaction_id;
      result := false;
    ELSE
      -- If user clicked a different reaction, update it (swap reaction)
      UPDATE public.post_reactions 
      SET reaction_type = target_reaction_type, updated_at = NOW()
      WHERE id = existing_reaction_id;
      result := true;
    END IF;
  ELSE
    -- No existing reaction, add new one
    INSERT INTO public.post_reactions (post_id, user_id, reaction_type)
    VALUES (target_post_id, auth.uid(), target_reaction_type);
    result := true;
  END IF;
  
  RETURN result;
END;
$function$;

-- Clean up any existing duplicate reactions (keep only the most recent one per user per post)
DELETE FROM post_reactions 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY post_id, user_id 
      ORDER BY created_at DESC
    ) as rn
    FROM post_reactions
  ) t
  WHERE t.rn > 1
);