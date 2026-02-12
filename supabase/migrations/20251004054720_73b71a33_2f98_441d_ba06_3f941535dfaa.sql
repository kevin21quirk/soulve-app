-- Drop the existing unique constraint that prevents multiple comments
ALTER TABLE post_interactions 
DROP CONSTRAINT IF EXISTS post_interactions_post_id_user_id_interaction_type_key;

-- Add a new constraint that only applies to non-comment interactions
-- Users can only have one like, bookmark, or share per post, but unlimited comments
CREATE UNIQUE INDEX post_interactions_unique_non_comment 
ON post_interactions (post_id, user_id, interaction_type) 
WHERE interaction_type IN ('like', 'bookmark', 'share');

-- Add index for better comment query performance
CREATE INDEX IF NOT EXISTS idx_post_interactions_comments 
ON post_interactions (post_id, created_at) 
WHERE interaction_type = 'comment' AND is_deleted = false;