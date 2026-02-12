-- Fix function search path security warning by recreating with proper search_path
DROP TRIGGER IF EXISTS on_language_prefs_updated ON public.user_language_preferences;
DROP FUNCTION IF EXISTS public.handle_language_prefs_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_language_prefs_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_language_prefs_updated
  BEFORE UPDATE ON public.user_language_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_language_prefs_updated_at();