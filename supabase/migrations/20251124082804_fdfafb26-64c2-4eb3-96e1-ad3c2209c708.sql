-- Fix function search path security warning
CREATE OR REPLACE FUNCTION expire_typing_indicator()
RETURNS TRIGGER AS $$
BEGIN
  -- Clear typing indicator after 3 seconds of inactivity
  IF NEW.typing_started_at IS NOT NULL AND NEW.typing_started_at < NOW() - INTERVAL '3 seconds' THEN
    NEW.typing_to_user_id := NULL;
    NEW.typing_started_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public';