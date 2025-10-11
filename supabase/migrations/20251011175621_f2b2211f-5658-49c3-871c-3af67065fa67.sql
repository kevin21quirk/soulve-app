-- Phase 3: Database Optimization - Add missing indexes for better performance

-- Index for post_interactions lookups by post and interaction type
CREATE INDEX IF NOT EXISTS idx_post_interactions_post_type 
ON public.post_interactions(post_id, interaction_type) 
WHERE is_deleted = false;

-- Index for campaign_interactions lookups
CREATE INDEX IF NOT EXISTS idx_campaign_interactions_campaign_type 
ON public.campaign_interactions(campaign_id, interaction_type) 
WHERE is_deleted = false;

-- Index for posts by organization and active status
CREATE INDEX IF NOT EXISTS idx_posts_org_active 
ON public.posts(organization_id, is_active, created_at DESC);

-- Index for campaigns by status and date
CREATE INDEX IF NOT EXISTS idx_campaigns_status_date 
ON public.campaigns(status, created_at DESC);

-- Composite index for post author lookups
CREATE INDEX IF NOT EXISTS idx_posts_author_active 
ON public.posts(author_id, is_active, created_at DESC);

-- Index for comment likes for faster count queries
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment 
ON public.comment_likes(comment_id, created_at);

-- Add index for connections lookups
CREATE INDEX IF NOT EXISTS idx_connections_users 
ON public.connections(requester_id, addressee_id, status);