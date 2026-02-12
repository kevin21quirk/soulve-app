-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view all comments" ON post_interactions;

-- Create RLS policy for post_interactions to allow reading comments
CREATE POLICY "Users can view all comments"
ON post_interactions
FOR SELECT
USING (interaction_type = 'comment' AND is_deleted = false);

-- Create function to get post comments with user details
CREATE OR REPLACE FUNCTION get_post_comments(target_post_id uuid)
RETURNS TABLE (
  id uuid,
  post_id uuid,
  user_id uuid,
  parent_comment_id uuid,
  content text,
  created_at timestamptz,
  edited_at timestamptz,
  is_deleted boolean,
  author_name text,
  author_avatar text,
  likes_count bigint,
  user_has_liked boolean
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.id,
    pi.post_id,
    pi.user_id,
    pi.parent_comment_id,
    pi.content,
    pi.created_at,
    pi.edited_at,
    pi.is_deleted,
    COALESCE(p.first_name || ' ' || p.last_name, 'Anonymous') as author_name,
    p.avatar_url as author_avatar,
    COALESCE(COUNT(DISTINCT cl.id), 0) as likes_count,
    EXISTS(
      SELECT 1 FROM comment_likes cl2 
      WHERE cl2.comment_id = pi.id 
      AND cl2.user_id = auth.uid()
    ) as user_has_liked
  FROM post_interactions pi
  LEFT JOIN profiles p ON p.id = pi.user_id
  LEFT JOIN comment_likes cl ON cl.comment_id = pi.id
  WHERE pi.post_id = target_post_id
    AND pi.interaction_type = 'comment'
    AND pi.is_deleted = false
  GROUP BY pi.id, pi.post_id, pi.user_id, pi.parent_comment_id, pi.content, 
           pi.created_at, pi.edited_at, pi.is_deleted, p.first_name, p.last_name, p.avatar_url
  ORDER BY pi.created_at ASC;
END;
$$;