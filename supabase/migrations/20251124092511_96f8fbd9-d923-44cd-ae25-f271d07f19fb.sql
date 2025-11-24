-- =====================================================
-- Comprehensive Blog Infrastructure Setup
-- =====================================================

-- 1. CREATE BLOG-IMAGES STORAGE BUCKET
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. STORAGE BUCKET RLS POLICIES
-- =====================================================

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;

-- Admin can upload blog images
CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- Admin can delete blog images
CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- Anyone can view blog images (public bucket)
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 3. BLOG_POSTS TABLE RLS POLICIES
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;

-- Public can read published posts
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts FOR SELECT
TO public
USING (is_published = true);

-- Admins can manage all posts (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- 4. BLOG_CATEGORIES TABLE RLS POLICIES
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admins can manage blog categories" ON public.blog_categories;

-- Public can read all categories
CREATE POLICY "Anyone can read blog categories"
ON public.blog_categories FOR SELECT
TO public
USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage blog categories"
ON public.blog_categories FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- 5. CREATE SAMPLE BLOG CATEGORIES
-- =====================================================
INSERT INTO public.blog_categories (name, slug, description)
VALUES 
  (
    'Platform Updates',
    'platform-updates',
    'Latest features, improvements, and announcements about the SouLVE platform'
  ),
  (
    'Impact Stories',
    'impact-stories',
    'Real stories of change-makers creating positive impact in their communities'
  ),
  (
    'Company News',
    'company-news',
    'Corporate announcements, partnerships, and press releases from SouLVE'
  )
ON CONFLICT (slug) DO NOTHING;

-- 6. CREATE SAMPLE BLOG POSTS
-- =====================================================

-- Get the category IDs for reference
DO $$
DECLARE
  platform_category_id UUID;
  impact_category_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO platform_category_id FROM public.blog_categories WHERE slug = 'platform-updates' LIMIT 1;
  SELECT id INTO impact_category_id FROM public.blog_categories WHERE slug = 'impact-stories' LIMIT 1;

  -- Insert sample blog post 1: Platform Update
  INSERT INTO public.blog_posts (
    title,
    slug,
    excerpt,
    content,
    category_id,
    is_published,
    published_at,
    featured_image,
    meta_description,
    meta_keywords,
    tags,
    read_time
  )
  VALUES (
    'Introducing the New SouLVE Dashboard: A Complete Redesign',
    'introducing-new-soulve-dashboard',
    'We''re excited to announce a complete redesign of the SouLVE dashboard, making it easier than ever to create impact, connect with changemakers, and track your social good activities.',
    '<h2>A Fresh Start for Social Good</h2><p>After months of research and development, we''re thrilled to unveil the completely redesigned SouLVE dashboard. This update represents our commitment to making social impact accessible, engaging, and rewarding for everyone.</p><h3>What''s New?</h3><ul><li><strong>Streamlined Navigation:</strong> Find what you need instantly with our new intuitive menu system</li><li><strong>Real-time Impact Feed:</strong> See posts, campaigns, and opportunities as they happen</li><li><strong>Enhanced Messaging:</strong> Connect with other changemakers through our improved messaging interface</li><li><strong>Campaign Discovery:</strong> Discover causes that matter to you with powerful filtering and search</li></ul><h3>Built with You in Mind</h3><p>Every design decision was made with user feedback at the core. We listened to hundreds of community members to understand what works and what needed improvement.</p><p>The result? A platform that feels natural, responds instantly, and celebrates your impact journey.</p><h3>What''s Next?</h3><p>This is just the beginning. In the coming weeks, we''ll be rolling out additional features including:</p><ul><li>Enhanced analytics for campaign creators</li><li>AI-powered impact recommendations</li><li>Expanded social sharing capabilities</li><li>Mobile app improvements</li></ul><p>Thank you for being part of the SouLVE community. Together, we''re building a platform that makes doing good easier, more connected, and more rewarding.</p>',
    platform_category_id,
    true,
    NOW(),
    NULL,
    'Discover the completely redesigned SouLVE dashboard with streamlined navigation, real-time feeds, enhanced messaging, and powerful campaign discovery tools.',
    ARRAY['platform update', 'dashboard', 'user experience', 'social impact', 'redesign'],
    ARRAY['Product', 'Announcement', 'Features'],
    5
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Insert sample blog post 2: Impact Story
  INSERT INTO public.blog_posts (
    title,
    slug,
    excerpt,
    content,
    category_id,
    is_published,
    published_at,
    featured_image,
    meta_description,
    meta_keywords,
    tags,
    read_time
  )
  VALUES (
    'How One Community Raised £50,000 for Local Youth Programs',
    'community-raised-50000-youth-programs',
    'Meet the Bristol community that came together on SouLVE to transform their local youth center and create opportunities for hundreds of young people.',
    '<h2>A Community United</h2><p>When Sarah Thompson noticed her local youth center was struggling to stay open, she knew something had to be done. The center had been a cornerstone of the Bristol community for over 20 years, providing a safe space and programs for young people.</p><h3>The Campaign Begins</h3><p>Sarah created a campaign on SouLVE with a goal of £50,000 to renovate the facility and fund programs for the next year. Within the first week, something remarkable happened.</p><blockquote>"I expected maybe a few friends to donate. Instead, the entire community rallied behind us. Local businesses, families, even people who had moved away years ago came together." - Sarah Thompson</blockquote><h3>The Power of Connection</h3><p>What made this campaign successful wasn''t just the money raised—it was the community that formed around it. SouLVE''s platform enabled:</p><ul><li>Regular updates that kept supporters engaged</li><li>Direct communication between organizers and donors</li><li>Volunteer opportunities that expanded beyond financial support</li><li>Real-time progress tracking that built momentum</li></ul><h3>Impact Beyond the Numbers</h3><p>Three months after launching, the campaign not only reached its goal but exceeded it by 15%. The youth center now offers:</p><ul><li>After-school tutoring programs</li><li>Arts and music workshops</li><li>Sports facilities and equipment</li><li>Mental health support services</li><li>Career guidance and mentorship</li></ul><p>Over 300 young people now benefit from these programs every week.</p><h3>Lessons Learned</h3><p>"Start with your story, be authentic, and engage your community," Sarah advises. "SouLVE gave us the tools, but it was our community''s passion that made it real."</p><p>The Bristol youth center story reminds us that when communities come together with purpose and the right platform, extraordinary things happen.</p>',
    impact_category_id,
    true,
    NOW() - INTERVAL '2 days',
    NULL,
    'Read how a Bristol community used SouLVE to raise £50,000 for their local youth center, creating programs that now benefit over 300 young people every week.',
    ARRAY['impact story', 'community', 'fundraising', 'youth programs', 'Bristol', 'success story'],
    ARRAY['Impact', 'Community', 'Success Story'],
    4
  )
  ON CONFLICT (slug) DO NOTHING;

END $$;