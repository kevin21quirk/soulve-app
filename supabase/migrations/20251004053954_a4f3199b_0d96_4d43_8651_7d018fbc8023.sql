-- Add columns to post_interactions for comment threading and editing
ALTER TABLE post_interactions 
ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES post_interactions(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS edited_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

-- Create comment_likes table for tracking comment likes
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES post_interactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for comment_likes
CREATE POLICY "Users can view comment likes"
  ON comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can add their own comment likes"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own comment likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to get comments with author info and like counts
CREATE OR REPLACE FUNCTION get_post_comments(target_post_id uuid)
RETURNS TABLE (
  id uuid,
  post_id uuid,
  user_id uuid,
  parent_comment_id uuid,
  content text,
  created_at timestamp with time zone,
  edited_at timestamp with time zone,
  is_deleted boolean,
  author_name text,
  author_avatar text,
  likes_count bigint,
  user_has_liked boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    pi.id,
    pi.post_id,
    pi.user_id,
    pi.parent_comment_id,
    CASE 
      WHEN pi.is_deleted THEN '[deleted]'
      ELSE pi.content
    END as content,
    pi.created_at,
    pi.edited_at,
    pi.is_deleted,
    COALESCE(p.first_name || ' ' || p.last_name, 'Anonymous') as author_name,
    p.avatar_url as author_avatar,
    COALESCE(COUNT(DISTINCT cl.id), 0) as likes_count,
    COALESCE(bool_or(cl.user_id = auth.uid()), false) as user_has_liked
  FROM post_interactions pi
  LEFT JOIN profiles p ON pi.user_id = p.id
  LEFT JOIN comment_likes cl ON pi.id = cl.comment_id
  WHERE pi.post_id = target_post_id 
    AND pi.interaction_type = 'comment'
  GROUP BY pi.id, pi.post_id, pi.user_id, pi.parent_comment_id, pi.content, 
           pi.created_at, pi.edited_at, pi.is_deleted, 
           p.first_name, p.last_name, p.avatar_url
  ORDER BY pi.created_at ASC;
$$;

-- Function to toggle comment like
CREATE OR REPLACE FUNCTION toggle_comment_like(target_comment_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_like_id uuid;
BEGIN
  -- Check if user already liked this comment
  SELECT id INTO existing_like_id
  FROM comment_likes
  WHERE comment_id = target_comment_id 
    AND user_id = auth.uid();
  
  IF existing_like_id IS NOT NULL THEN
    -- Unlike - remove the like
    DELETE FROM comment_likes WHERE id = existing_like_id;
    RETURN false;
  ELSE
    -- Like - add new like
    INSERT INTO comment_likes (comment_id, user_id)
    VALUES (target_comment_id, auth.uid());
    RETURN true;
  END IF;
END;
$$;