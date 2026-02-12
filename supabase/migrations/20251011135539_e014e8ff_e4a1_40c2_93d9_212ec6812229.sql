-- Add organization_id to posts and post_interactions for multi-account support (fixed)

-- Add organization_id to posts table (nullable)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add organization_id to post_interactions table (nullable)
ALTER TABLE public.post_interactions 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_organization_id ON public.posts(organization_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_organization_id ON public.post_interactions(organization_id);

-- Update RLS policies for posts to include organization access
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
CREATE POLICY "Users can create posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = author_id) OR
  (organization_id IS NOT NULL AND public.is_org_admin(organization_id, auth.uid()))
);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = author_id) OR
  (organization_id IS NOT NULL AND public.is_org_admin(organization_id, auth.uid()))
)
WITH CHECK (
  (auth.uid() = author_id) OR
  (organization_id IS NOT NULL AND public.is_org_admin(organization_id, auth.uid()))
);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (
  (auth.uid() = author_id) OR
  (organization_id IS NOT NULL AND public.is_org_admin(organization_id, auth.uid()))
);

-- Update RLS policies for post_interactions to include organization access
DROP POLICY IF EXISTS "Users can create interactions" ON public.post_interactions;
CREATE POLICY "Users can create interactions"
ON public.post_interactions
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id) OR
  (organization_id IS NOT NULL AND public.is_org_member(organization_id, auth.uid()))
);

DROP POLICY IF EXISTS "Users can update their own interactions" ON public.post_interactions;
CREATE POLICY "Users can update their own interactions"
ON public.post_interactions
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = user_id) OR
  (organization_id IS NOT NULL AND public.is_org_admin(organization_id, auth.uid()))
)
WITH CHECK (
  (auth.uid() = user_id) OR
  (organization_id IS NOT NULL AND public.is_org_admin(organization_id, auth.uid()))
);

DROP POLICY IF EXISTS "Users can delete their own interactions" ON public.post_interactions;
CREATE POLICY "Users can delete their own interactions"
ON public.post_interactions
FOR DELETE
TO authenticated
USING (
  (auth.uid() = user_id) OR
  (organization_id IS NOT NULL AND public.is_org_admin(organization_id, auth.uid()))
);