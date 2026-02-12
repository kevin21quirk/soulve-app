-- Create blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES public.blog_categories(id),
  featured_image TEXT,
  tags TEXT[],
  meta_description TEXT,
  meta_keywords TEXT[],
  read_time INTEGER,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories (public read)
CREATE POLICY "Anyone can view blog categories"
  ON public.blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON public.blog_categories FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for blog_posts (public read for published)
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all blog posts"
  ON public.blog_posts FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own subscription"
  ON public.newsletter_subscribers FOR SELECT
  USING (auth.email() = email OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage subscriptions"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at) WHERE is_published = true;
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
  ('Community Stories', 'community-stories', 'Real stories from our community members'),
  ('Platform Updates', 'platform-updates', 'Latest features and improvements'),
  ('Social Impact', 'social-impact', 'Making a difference in communities'),
  ('Trust & Safety', 'trust-and-safety', 'Building a safer platform'),
  ('How-To Guides', 'how-to-guides', 'Tips and tutorials for using SouLVE')
ON CONFLICT (slug) DO NOTHING;