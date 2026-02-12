-- Enable real-time for user_verifications table
ALTER TABLE public.user_verifications REPLICA IDENTITY FULL;

-- Create indexes for faster real-time queries
CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id_status 
ON public.user_verifications(user_id, status);

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_user_verifications_status_created 
ON public.user_verifications(status, created_at DESC);