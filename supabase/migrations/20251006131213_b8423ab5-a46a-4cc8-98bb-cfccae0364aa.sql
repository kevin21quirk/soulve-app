-- Create feedback types enum
CREATE TYPE public.feedback_type AS ENUM ('bug', 'feature_request', 'ui_issue', 'performance', 'general');

-- Create feedback priority enum
CREATE TYPE public.feedback_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create feedback status enum
CREATE TYPE public.feedback_status AS ENUM ('new', 'in_review', 'in_progress', 'resolved', 'wont_fix');

-- Create platform_feedback table
CREATE TABLE public.platform_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type public.feedback_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  page_url TEXT,
  page_section TEXT,
  screenshot_url TEXT,
  browser_info JSONB DEFAULT '{}'::jsonb,
  priority public.feedback_priority DEFAULT 'medium',
  status public.feedback_status DEFAULT 'new',
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own feedback"
  ON public.platform_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON public.platform_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON public.platform_feedback
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all feedback"
  ON public.platform_feedback
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create updated_at trigger
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.platform_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for feedback screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'feedback-screenshots',
  'feedback-screenshots',
  false,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
);

-- Storage RLS policies
CREATE POLICY "Authenticated users can upload feedback screenshots"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'feedback-screenshots' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own feedback screenshots"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'feedback-screenshots' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all feedback screenshots"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'feedback-screenshots' AND
    public.is_admin(auth.uid())
  );

-- Create index for faster queries
CREATE INDEX idx_feedback_user_id ON public.platform_feedback(user_id);
CREATE INDEX idx_feedback_status ON public.platform_feedback(status);
CREATE INDEX idx_feedback_type ON public.platform_feedback(feedback_type);
CREATE INDEX idx_feedback_created_at ON public.platform_feedback(created_at DESC);