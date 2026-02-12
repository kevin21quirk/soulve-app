-- Fix function search path security warnings
-- Update the can_access_message function with secure search path
CREATE OR REPLACE FUNCTION public.can_access_message(message_sender_id uuid, message_recipient_id uuid)
RETURNS boolean AS $$
DECLARE
  current_user_id uuid;
  sender_profile_exists boolean;
  recipient_profile_exists boolean;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  -- Return false if no authenticated user
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Additional verification: Check that user profiles exist to prevent spoofing
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = message_sender_id) INTO sender_profile_exists;
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = message_recipient_id) INTO recipient_profile_exists;
  
  -- Only allow access if profiles exist and user is either sender or recipient
  RETURN sender_profile_exists 
    AND recipient_profile_exists 
    AND (current_user_id = message_sender_id OR current_user_id = message_recipient_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Update the log_message_access function with secure search path
CREATE OR REPLACE FUNCTION public.log_message_access()
RETURNS trigger AS $$
BEGIN
  -- Log message access for security monitoring
  INSERT INTO public.message_access_log (
    user_id, 
    message_id, 
    access_type,
    ip_address
  ) VALUES (
    auth.uid(),
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    inet_client_addr()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the cleanup function with secure search path
CREATE OR REPLACE FUNCTION public.cleanup_old_message_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.message_access_log 
  WHERE created_at < (now() - INTERVAL '90 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;