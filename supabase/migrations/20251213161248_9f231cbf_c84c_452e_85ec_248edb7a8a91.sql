-- Add email column to profiles table with sync from auth.users
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create function to sync email from auth.users to profiles
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Get email from auth.users and update profile
  UPDATE public.profiles
  SET email = (SELECT email FROM auth.users WHERE id = NEW.id)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to sync email when profile is created
DROP TRIGGER IF EXISTS sync_profile_email_trigger ON public.profiles;
CREATE TRIGGER sync_profile_email_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_email();

-- Backfill existing profiles with emails from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- Create function to recalculate trust score when verification status changes
CREATE OR REPLACE FUNCTION public.recalculate_trust_score_on_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only recalculate when status changes to approved
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    PERFORM public.calculate_enhanced_trust_score(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic trust score recalculation
DROP TRIGGER IF EXISTS recalculate_trust_score_trigger ON public.user_verifications;
CREATE TRIGGER recalculate_trust_score_trigger
  AFTER UPDATE ON public.user_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_trust_score_on_verification();

-- Also trigger on insert if verification is created as approved
DROP TRIGGER IF EXISTS recalculate_trust_score_insert_trigger ON public.user_verifications;
CREATE TRIGGER recalculate_trust_score_insert_trigger
  AFTER INSERT ON public.user_verifications
  FOR EACH ROW
  WHEN (NEW.status = 'approved')
  EXECUTE FUNCTION public.recalculate_trust_score_on_verification();