-- Create table for caching URL previews
CREATE TABLE IF NOT EXISTS public.url_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  image_url TEXT,
  site_name TEXT,
  favicon TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Enable RLS
ALTER TABLE public.url_previews ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read cached previews
CREATE POLICY "Users can read URL previews"
  ON public.url_previews
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow system to insert/update previews
CREATE POLICY "System can manage URL previews"
  ON public.url_previews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_url_previews_url ON public.url_previews(url);
CREATE INDEX IF NOT EXISTS idx_url_previews_expires_at ON public.url_previews(expires_at);

-- Add link preview support to posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS link_preview_url TEXT,
ADD COLUMN IF NOT EXISTS link_preview_data JSONB DEFAULT NULL;