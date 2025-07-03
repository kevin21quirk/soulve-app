
-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_author_active ON posts(author_id, is_active);
CREATE INDEX IF NOT EXISTS idx_posts_urgency ON posts(urgency);

CREATE INDEX IF NOT EXISTS idx_post_interactions_post_user ON post_interactions(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_type ON post_interactions(interaction_type);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user ON post_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_waitlist_status ON profiles(waitlist_status);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);

CREATE INDEX IF NOT EXISTS idx_campaigns_creator ON campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_id, is_read);

CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_posts_feed_query ON posts(is_active, created_at DESC) WHERE visibility = 'public';
CREATE INDEX IF NOT EXISTS idx_posts_user_active ON posts(author_id, is_active, created_at DESC);

-- Optimize RLS policy performance
CREATE INDEX IF NOT EXISTS idx_connections_participants ON connections(requester_id, addressee_id, status);

-- Add constraints for data integrity
ALTER TABLE posts ADD CONSTRAINT check_urgency_valid 
  CHECK (urgency IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE posts ADD CONSTRAINT check_category_valid 
  CHECK (category IN ('help_needed', 'help_offered', 'announcement', 'event', 'volunteer', 'success_story', 'community_update'));

ALTER TABLE posts ADD CONSTRAINT check_visibility_valid 
  CHECK (visibility IN ('public', 'private', 'connections'));

-- Update table statistics for better query planning
ANALYZE posts;
ANALYZE post_interactions;
ANALYZE post_reactions;
ANALYZE profiles;
ANALYZE campaigns;
