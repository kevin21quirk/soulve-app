-- Fix get_feed_with_stats to handle missing campaign_reactions table
CREATE OR REPLACE FUNCTION public.get_feed_with_stats(
  p_user_id uuid, 
  p_organization_id uuid DEFAULT NULL::uuid, 
  p_limit integer DEFAULT 20, 
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, title text, content text, author_id uuid, author_name text, 
  author_avatar text, organization_id uuid, organization_name text, 
  organization_logo text, category text, urgency text, location text, 
  tags text[], media_urls text[], created_at timestamp with time zone, 
  updated_at timestamp with time zone, is_active boolean, import_source text, 
  external_id text, import_metadata jsonb, imported_at timestamp with time zone, 
  likes_count bigint, comments_count bigint, shares_count bigint, 
  is_liked boolean, is_bookmarked boolean, reactions jsonb, status text, 
  goal_amount numeric, current_amount numeric, end_date timestamp with time zone, 
  campaign_category text, currency text, donor_count bigint, 
  recent_donations_24h bigint, recent_donors jsonb, average_donation numeric, 
  progress_percentage numeric, days_remaining integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'like'), 0) as likes_count,
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'comment'), 0) as comments_count,
      COALESCE((SELECT COUNT(*) FROM post_interactions WHERE post_id = p.id AND interaction_type = 'share'), 0) as shares_count,
      EXISTS(SELECT 1 FROM post_interactions WHERE post_id = p.id AND user_id = p_user_id AND interaction_type = 'like') as is_liked,
      EXISTS(SELECT 1 FROM post_interactions WHERE post_id = p.id AND user_id = p_user_id AND interaction_type = 'bookmark') as is_bookmarked,
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
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'like'), 0) as likes_count,
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'comment'), 0) as comments_count,
      COALESCE((SELECT COUNT(*) FROM campaign_interactions WHERE campaign_id = c.id AND interaction_type = 'share'), 0) as shares_count,
      EXISTS(SELECT 1 FROM campaign_interactions WHERE campaign_id = c.id AND user_id = p_user_id AND interaction_type = 'like') as is_liked,
      EXISTS(SELECT 1 FROM campaign_interactions WHERE campaign_id = c.id AND user_id = p_user_id AND interaction_type = 'bookmark') as is_bookmarked,
      '[]'::jsonb as reactions,  -- Return empty reactions array instead of querying non-existent table
      c.status,
      c.goal_amount,
      c.current_amount,
      c.end_date,
      c.category as campaign_category,
      COALESCE(c.currency, 'USD') as currency,
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
$function$;