-- Add index for user_tag interactions for better performance
CREATE INDEX IF NOT EXISTS idx_post_interactions_user_tags 
ON post_interactions(user_id, interaction_type, post_id) 
WHERE interaction_type = 'user_tag';

-- Add index for comment tags
CREATE INDEX IF NOT EXISTS idx_post_interactions_comment_tags 
ON post_interactions(parent_comment_id, interaction_type) 
WHERE interaction_type = 'user_tag' AND parent_comment_id IS NOT NULL;