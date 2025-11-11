-- Create RPC function to fetch posts with all stats in one query
-- This eliminates N+1 queries by pre-computing reactions, comments, and campaign stats

CREATE OR REPLACE FUNCTION get_feed_with_stats(
  p_user_id UUID,
  p_organization_id UUID DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  author_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  organization_id UUID,
  organization_name TEXT,
  organization_logo TEXT,
  category TEXT,
  urgency TEXT,
  location TEXT,
  tags TEXT[],
  media_urls TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_active BOOLEAN,
  import_source TEXT,
  external_id TEXT,
  import_metadata JSONB,
  imported_at TIMESTAMPTZ,
  -- Pre-computed stats
  likes_count BIGINT,
  comments_count BIGINT,
  shares_count BIGINT,
  is_liked BOOLEAN,
  is_bookmarked BOOLEAN,
  -- Reactions data
  reactions JSONB,
  -- Campaign-specific fields
  status TEXT,
  goal_amount NUMERIC,
  current_amount NUMERIC,
  end_date TIMESTAMPTZ,
  campaign_category TEXT,
  currency TEXT,
  donor_count BIGINT,
  recent_donations_24h BIGINT,
  recent_donors JSONB,
  average_donation NUMERIC,
  progress_percentage NUMERIC,
  days_remaining INT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH posts_with_profiles AS (
    SELECT 
      p.id,
      p.title,
      p.content,
      p.author_id,
      COALESCE(
        CASE WHEN p.organization_id IS NOT NULL THEN o.name ELSE (prof.first_name || ' ' || prof.last_name) END,
        'Anonymous'
      ) as author_name,
      COALESCE(
        CASE WHEN p.organization_id IS NOT NULL THEN o.avatar_url ELSE prof.avatar_url END,
        ''
      ) as author_avatar,
      p.organization_id,
      o.name as organization_name,
      o.avatar_url as organization_logo,
      p.category,
      p.urgency,
      p.location,
      p.tags,
      p.media_urls,
      p.created_at,
      p.updated_at,
      p.is_active,
      p.import_source,
      p.external_id,
      p.import_metadata,
      p.imported_at,
      -- Compute interaction counts
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'like'), 0) as likes_count,
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'comment'), 0) as comments_count,
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'share'), 0) as shares_count,
      -- Check if user has liked/bookmarked
      EXISTS(SELECT 1 FROM post_interactions WHERE post_id = p.id AND user_id = p_user_id AND interaction_type = 'like') as is_liked,
      EXISTS(SELECT 1 FROM post_interactions WHERE post_id = p.id AND user_id = p_user_id AND interaction_type = 'bookmark') as is_bookmarked,
      -- Get reactions as JSONB
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'emoji', pr.reaction_type,
            'count', reaction_counts.count,
            'userReacted', EXISTS(SELECT 1 FROM post_reactions pr2 WHERE pr2.post_id = p.id AND pr2.user_id = p_user_id AND pr2.reaction_type = pr.reaction_type)
          )
        )
        FROM (
          SELECT reaction_type, COUNT(*) as count
          FROM post_reactions
          WHERE post_id = p.id
          GROUP BY reaction_type
        ) reaction_counts
        JOIN post_reactions pr ON pr.post_id = p.id AND pr.reaction_type = reaction_counts.reaction_type
        GROUP BY pr.reaction_type, reaction_counts.count
      ), '[]'::jsonb) as reactions,
      NULL::TEXT as status,
      NULL::NUMERIC as goal_amount,
      NULL::NUMERIC as current_amount,
      NULL::TIMESTAMPTZ as end_date,
      NULL::TEXT as campaign_category,
      NULL::TEXT as currency,
      NULL::BIGINT as donor_count,
      NULL::BIGINT as recent_donations_24h,
      NULL::JSONB as recent_donors,
      NULL::NUMERIC as average_donation,
      NULL::NUMERIC as progress_percentage,
      NULL::INT as days_remaining
    FROM posts p
    LEFT JOIN profiles prof ON prof.id = p.author_id
    LEFT JOIN organizations o ON o.id = p.organization_id
    WHERE p.is_active = true
      AND (p_organization_id IS NULL AND p.organization_id IS NULL OR p.organization_id = p_organization_id)
  ),
  campaigns_with_stats AS (
    SELECT 
      c.id,
      c.title,
      c.description as content,
      c.creator_id as author_id,
      (prof.first_name || ' ' || prof.last_name) as author_name,
      prof.avatar_url as author_avatar,
      NULL::UUID as organization_id,
      NULL::TEXT as organization_name,
      NULL::TEXT as organization_logo,
      'fundraising'::TEXT as category,
      COALESCE(c.urgency, 'medium') as urgency,
      c.location,
      c.tags,
      COALESCE(
        CASE 
          WHEN c.gallery_images IS NOT NULL AND jsonb_typeof(c.gallery_images) = 'array' 
          THEN ARRAY(SELECT jsonb_array_elements_text(c.gallery_images))
          ELSE ARRAY[]::TEXT[]
        END,
        ARRAY[]::TEXT[]
      ) as media_urls,
      c.created_at,
      c.updated_at,
      true as is_active,
      NULL::TEXT as import_source,
      NULL::TEXT as external_id,
      NULL::JSONB as import_metadata,
      NULL::TIMESTAMPTZ as imported_at,
      -- Campaign interactions
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'like'), 0) as likes_count,
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'comment'), 0) as comments_count,
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'share'), 0) as shares_count,
      EXISTS(SELECT 1 FROM campaign_interactions WHERE campaign_id = c.id AND user_id = p_user_id AND interaction_type = 'like') as is_liked,
      EXISTS(SELECT 1 FROM campaign_interactions WHERE campaign_id = c.id AND user_id = p_user_id AND interaction_type = 'bookmark') as is_bookmarked,
      -- Campaign reactions
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'emoji', cr.reaction_type,
            'count', reaction_counts.count,
            'userReacted', EXISTS(SELECT 1 FROM campaign_reactions cr2 WHERE cr2.campaign_id = c.id AND cr2.user_id = p_user_id AND cr2.reaction_type = cr.reaction_type)
          )
        )
        FROM (
          SELECT reaction_type, COUNT(*) as count
          FROM campaign_reactions
          WHERE campaign_id = c.id
          GROUP BY reaction_type
        ) reaction_counts
        JOIN campaign_reactions cr ON cr.campaign_id = c.id AND cr.reaction_type = reaction_counts.reaction_type
        GROUP BY cr.reaction_type, reaction_counts.count
      ), '[]'::jsonb) as reactions,
      c.status,
      c.goal_amount,
      c.current_amount,
      c.end_date,
      c.category as campaign_category,
      COALESCE(c.currency, 'USD') as currency,
      -- Campaign stats
      COALESCE((SELECT COUNT(*) FROM campaign_donations WHERE campaign_id = c.id AND payment_status = 'completed'), 0) as donor_count,
      COALESCE((SELECT COUNT(*) FROM campaign_donations WHERE campaign_id = c.id AND payment_status = 'completed' AND created_at > NOW() - INTERVAL '24 hours'), 0) as recent_donations_24h,
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', COALESCE(cd.donor_id::TEXT, 'anonymous'),
            'avatar', donor_prof.avatar_url,
            'name', CASE WHEN cd.is_anonymous THEN NULL ELSE (donor_prof.first_name || ' ' || donor_prof.last_name) END,
            'isAnonymous', cd.is_anonymous,
            'amount', cd.amount,
            'createdAt', cd.created_at
          )
        )
        FROM (
          SELECT * FROM campaign_donations 
          WHERE campaign_id = c.id AND payment_status = 'completed'
          ORDER BY created_at DESC
          LIMIT 5
        ) cd
        LEFT JOIN profiles donor_prof ON donor_prof.id = cd.donor_id
      ), '[]'::jsonb) as recent_donors,
      COALESCE((
        SELECT AVG(amount) 
        FROM campaign_donations 
        WHERE campaign_id = c.id AND payment_status = 'completed'
      ), 0) as average_donation,
      CASE WHEN c.goal_amount > 0 THEN LEAST((c.current_amount / c.goal_amount) * 100, 100) ELSE 0 END as progress_percentage,
      CASE WHEN c.end_date IS NOT NULL THEN GREATEST(EXTRACT(DAY FROM (c.end_date - NOW())), 0)::INT ELSE NULL END as days_remaining
    FROM campaigns c
    LEFT JOIN profiles prof ON prof.id = c.creator_id
    WHERE (c.status = 'active' OR (c.status = 'draft' AND c.creator_id = p_user_id))
  )
  SELECT * FROM (
    SELECT * FROM posts_with_profiles
    UNION ALL
    SELECT * FROM campaigns_with_stats
  ) combined
  ORDER BY created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;