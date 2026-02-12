-- Create user language preferences table
CREATE TABLE public.user_language_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  auto_translate BOOLEAN DEFAULT false,
  show_translation_button BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create content translations cache table
CREATE TABLE public.content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment')),
  original_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  translator TEXT DEFAULT 'gemini-2.5-flash',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  UNIQUE(content_id, content_type, target_language)
);

-- Create language detection cache table
CREATE TABLE public.language_detection_cache (
  content_hash TEXT PRIMARY KEY,
  detected_language TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_content_translations_expires ON public.content_translations(expires_at);
CREATE INDEX idx_content_translations_lookup ON public.content_translations(content_id, content_type, target_language);
CREATE INDEX idx_language_detection_created ON public.language_detection_cache(created_at);

-- Enable RLS
ALTER TABLE public.user_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_detection_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_language_preferences
CREATE POLICY "Users can view their own language preferences"
  ON public.user_language_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own language preferences"
  ON public.user_language_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own language preferences"
  ON public.user_language_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for content_translations
CREATE POLICY "Users can view translations for accessible content"
  ON public.content_translations FOR SELECT
  USING (true);

CREATE POLICY "System can insert translations"
  ON public.content_translations FOR INSERT
  WITH CHECK (true);

-- RLS Policies for language_detection_cache
CREATE POLICY "Users can view language detection cache"
  ON public.language_detection_cache FOR SELECT
  USING (true);

CREATE POLICY "System can insert detection cache"
  ON public.language_detection_cache FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_language_prefs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_language_prefs_updated
  BEFORE UPDATE ON public.user_language_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_language_prefs_updated_at();