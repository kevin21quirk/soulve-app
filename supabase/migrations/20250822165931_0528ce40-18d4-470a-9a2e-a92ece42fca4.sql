-- Fix critical security vulnerability in messages table
-- Enable Row Level Security on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to verify message access with additional checks
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
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = message_sender_id) INTO sender_profile_exists;
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = message_recipient_id) INTO recipient_profile_exists;
  
  -- Only allow access if profiles exist and user is either sender or recipient
  RETURN sender_profile_exists 
    AND recipient_profile_exists 
    AND (current_user_id = message_sender_id OR current_user_id = message_recipient_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create restrictive RLS policies for messages table

-- Policy for viewing messages: Only sender and recipient can see their messages
CREATE POLICY "Users can only view their own messages" 
ON public.messages 
FOR SELECT 
USING (
  public.can_access_message(sender_id, recipient_id)
);

-- Policy for creating messages: Users can only send messages as themselves
CREATE POLICY "Users can only send messages as themselves" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id 
  AND auth.uid() IS NOT NULL
  AND recipient_id IS NOT NULL
  AND recipient_id != sender_id  -- Prevent sending messages to self
  AND EXISTS(SELECT 1 FROM profiles WHERE id = recipient_id)  -- Recipient must exist
);

-- Policy for updating messages: Only sender can update their own messages (for read status, etc.)
CREATE POLICY "Users can only update messages they sent or received" 
ON public.messages 
FOR UPDATE 
USING (
  public.can_access_message(sender_id, recipient_id)
) 
WITH CHECK (
  public.can_access_message(sender_id, recipient_id)
  -- Prevent changing sender_id, recipient_id, or content in updates
  AND sender_id = OLD.sender_id
  AND recipient_id = OLD.recipient_id
  AND content = OLD.content
);

-- Policy for deleting messages: Only sender can delete their own sent messages
CREATE POLICY "Users can only delete messages they sent" 
ON public.messages 
FOR DELETE 
USING (
  auth.uid() = sender_id 
  AND auth.uid() IS NOT NULL
);

-- Create audit log for message access (security monitoring)
CREATE TABLE IF NOT EXISTS public.message_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message_id uuid NOT NULL,
  access_type text NOT NULL, -- 'read', 'send', 'update', 'delete'
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.message_access_log ENABLE ROW LEVEL SECURITY;

-- Only system can write to audit log, admins can read for security monitoring
CREATE POLICY "System can log message access" 
ON public.message_access_log 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view message access logs" 
ON public.message_access_log 
FOR SELECT 
USING (
  EXISTS(
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create function to log message access for security monitoring
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging
CREATE TRIGGER message_access_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.log_message_access();

-- Add index for better performance on message queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient 
ON public.messages (sender_id, recipient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_recipient_unread 
ON public.messages (recipient_id, is_read, created_at DESC);

-- Create function to clean up old audit logs (privacy compliance)
CREATE OR REPLACE FUNCTION public.cleanup_old_message_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.message_access_log 
  WHERE created_at < (now() - INTERVAL '90 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;