-- 004_actor_context.sql
-- Replace Supabase auth.uid()/auth.email() usage in ported functions.
--
-- The Supabase schema used auth.uid() (= the caller's auth.users id, which was
-- also profiles.id) and auth.email(). Neon has no auth schema; the API resolves
-- Clerk -> profiles.id via resolveCaller() and passes it explicitly.
--
-- New convention:
--   * Non-trigger functions take a trailing `p_user_id uuid` / `p_user_email text`
--     parameter (default: the app.actor_id / app.actor_email session GUC).
--   * Trigger functions read the GUC via public.current_actor_id().
--   * API routes either pass the id explicitly or, inside a transaction:
--       SET LOCAL app.actor_id = '<profiles.id>';
--       SET LOCAL app.actor_email = '<email>';

CREATE OR REPLACE FUNCTION public.current_actor_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('app.actor_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION public.current_actor_email() RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('app.actor_email', true), '')
$$;

-- ── accept_organization_invitation ────────────────────────────────────────
DROP FUNCTION IF EXISTS public.accept_organization_invitation(text);
CREATE FUNCTION public.accept_organization_invitation(
  token_input text,
  p_user_id uuid DEFAULT public.current_actor_id(),
  p_user_email text DEFAULT public.current_actor_email()
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  IF p_user_email IS NULL OR p_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT * INTO invitation_record
  FROM organization_invitations
  WHERE invitation_token = token_input
    AND email = p_user_email
    AND status = 'pending'
    AND (expires_at IS NULL OR expires_at > now());

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE organization_invitations
  SET status = 'accepted', accepted_at = now()
  WHERE id = invitation_record.id;

  INSERT INTO organization_members (organization_id, user_id, role, title, is_active)
  VALUES (invitation_record.organization_id, p_user_id, invitation_record.role, invitation_record.title, true);

  RETURN true;
END;
$$;

-- ── bulk_delete_notifications ─────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.bulk_delete_notifications(uuid[], integer);
CREATE FUNCTION public.bulk_delete_notifications(
  notification_ids uuid[],
  older_than_days integer DEFAULT NULL::integer,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  IF older_than_days IS NOT NULL THEN
    DELETE FROM public.notifications
    WHERE recipient_id = p_user_id
      AND created_at < (now() - (older_than_days || ' days')::INTERVAL)
      AND is_read = true;
  ELSE
    DELETE FROM public.notifications
    WHERE id = ANY(notification_ids)
      AND recipient_id = p_user_id;
  END IF;

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$;

-- ── bulk_mark_notifications_read ──────────────────────────────────────────
DROP FUNCTION IF EXISTS public.bulk_mark_notifications_read(uuid[], boolean);
CREATE FUNCTION public.bulk_mark_notifications_read(
  notification_ids uuid[] DEFAULT NULL::uuid[],
  mark_all boolean DEFAULT false,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  IF mark_all THEN
    UPDATE public.notifications
    SET is_read = true, read_at = now(), delivery_status = 'read'
    WHERE recipient_id = p_user_id AND is_read = false;
  ELSE
    UPDATE public.notifications
    SET is_read = true, read_at = now(), delivery_status = 'read'
    WHERE id = ANY(notification_ids) AND recipient_id = p_user_id AND is_read = false;
  END IF;

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$;

-- ── can_access_message ────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.can_access_message(uuid, uuid);
CREATE FUNCTION public.can_access_message(
  message_sender_id uuid,
  message_recipient_id uuid,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;
  RETURN EXISTS(SELECT 1 FROM public.profiles WHERE id = message_sender_id)
    AND EXISTS(SELECT 1 FROM public.profiles WHERE id = message_recipient_id)
    AND (p_user_id = message_sender_id OR p_user_id = message_recipient_id);
END;
$$;

-- ── check_campaign_limit ──────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.check_campaign_limit();
CREATE FUNCTION public.check_campaign_limit(
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  user_campaign_count INTEGER;
  user_max_campaigns INTEGER := 3; -- Default free tier limit
  user_subscription RECORD;
BEGIN
  SELECT COUNT(*) INTO user_campaign_count
  FROM public.campaigns
  WHERE creator_id = p_user_id
    AND status != 'deleted';

  SELECT us.*, sp.max_campaigns INTO user_subscription
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id
    AND us.status = 'active'
  ORDER BY us.created_at DESC
  LIMIT 1;

  IF FOUND THEN
    user_max_campaigns := user_subscription.max_campaigns;
  END IF;

  RETURN user_campaign_count < user_max_campaigns;
END;
$$;

-- ── confirm_volunteer_work ────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.confirm_volunteer_work(uuid, text, text);
CREATE FUNCTION public.confirm_volunteer_work(
  activity_id uuid,
  confirm_status text,
  rejection_note text DEFAULT NULL::text,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  volunteer_user_id UUID;
  org_id UUID;
  p_id UUID;
  can_confirm BOOLEAN := FALSE;
BEGIN
  SELECT user_id, organization_id, post_id INTO volunteer_user_id, org_id, p_id
  FROM public.impact_activities
  WHERE id = activity_id;

  IF org_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = org_id
        AND user_id = p_user_id
        AND is_active = true
        AND role IN ('admin', 'owner', 'manager')
    ) INTO can_confirm;
  ELSIF p_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = p_id AND author_id = p_user_id
    ) INTO can_confirm;
  END IF;

  IF NOT can_confirm THEN
    RAISE EXCEPTION 'You do not have permission to confirm this volunteer work';
  END IF;

  UPDATE public.impact_activities
  SET
    confirmation_status = confirm_status,
    confirmed_by = p_user_id,
    confirmed_at = now(),
    rejection_reason = rejection_note,
    verified = CASE WHEN confirm_status = 'confirmed' THEN TRUE ELSE FALSE END
  WHERE id = activity_id;

  IF confirm_status = 'confirmed' THEN
    PERFORM public.calculate_user_impact_metrics(volunteer_user_id);
    PERFORM public.calculate_enhanced_trust_score(volunteer_user_id);
  END IF;
END;
$$;

-- ── find_nearby_users ─────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.find_nearby_users(numeric, numeric, numeric, integer);
CREATE FUNCTION public.find_nearby_users(
  user_lat numeric,
  user_lon numeric,
  radius_km numeric DEFAULT 50,
  limit_count integer DEFAULT 20,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS TABLE(id uuid, first_name text, last_name text, avatar_url text, location text, skills text[], interests text[], latitude numeric, longitude numeric, distance_km numeric)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.location,
    p.skills,
    p.interests,
    p.latitude,
    p.longitude,
    calculate_distance(user_lat, user_lon, p.latitude, p.longitude) as distance_km
  FROM profiles p
  WHERE
    p.location_sharing_enabled = true
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND p.id IS DISTINCT FROM p_user_id
    AND calculate_distance(user_lat, user_lon, p.latitude, p.longitude) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$;

-- ── get_post_comments ─────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.get_post_comments(uuid);
CREATE FUNCTION public.get_post_comments(
  target_post_id uuid,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS TABLE(id uuid, post_id uuid, user_id uuid, organization_id uuid, parent_comment_id uuid, content text, created_at timestamp with time zone, edited_at timestamp with time zone, is_deleted boolean, author_name text, author_avatar text, is_organization boolean, likes_count bigint, user_has_liked boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  RETURN QUERY
  SELECT
    pi.id,
    pi.post_id,
    pi.user_id,
    pi.organization_id,
    pi.parent_comment_id,
    pi.content,
    pi.created_at,
    pi.edited_at,
    pi.is_deleted,
    COALESCE(
      o.name,
      COALESCE(p.first_name || ' ' || p.last_name, 'Anonymous')
    ) as author_name,
    COALESCE(o.avatar_url, p.avatar_url) as author_avatar,
    (pi.organization_id IS NOT NULL) as is_organization,
    COALESCE(COUNT(DISTINCT cl.id), 0) as likes_count,
    EXISTS(
      SELECT 1 FROM comment_likes cl2
      WHERE cl2.comment_id = pi.id
      AND cl2.user_id = p_user_id
    ) as user_has_liked
  FROM post_interactions pi
  LEFT JOIN profiles p ON p.id = pi.user_id
  LEFT JOIN organizations o ON o.id = pi.organization_id
  LEFT JOIN comment_likes cl ON cl.comment_id = pi.id
  WHERE pi.post_id = target_post_id
    AND pi.interaction_type = 'comment'
    AND pi.is_deleted = false
  GROUP BY pi.id, pi.post_id, pi.user_id, pi.organization_id, pi.parent_comment_id,
           pi.content, pi.created_at, pi.edited_at, pi.is_deleted,
           p.first_name, p.last_name, p.avatar_url,
           o.name, o.avatar_url
  ORDER BY pi.created_at ASC;
END;
$$;

-- ── toggle_comment_like ───────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.toggle_comment_like(uuid);
CREATE FUNCTION public.toggle_comment_like(
  target_comment_id uuid,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  existing_like_id uuid;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;
  SELECT id INTO existing_like_id
  FROM comment_likes
  WHERE comment_id = target_comment_id
    AND user_id = p_user_id;
  IF existing_like_id IS NOT NULL THEN
    DELETE FROM comment_likes WHERE id = existing_like_id;
    RETURN false;
  ELSE
    INSERT INTO comment_likes (comment_id, user_id)
    VALUES (target_comment_id, p_user_id);
    RETURN true;
  END IF;
END;
$$;

-- ── toggle_post_reaction ──────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.toggle_post_reaction(uuid, text);
CREATE FUNCTION public.toggle_post_reaction(
  target_post_id uuid,
  target_reaction_type text,
  p_user_id uuid DEFAULT public.current_actor_id()
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  existing_reaction_id UUID;
  existing_reaction_type TEXT;
  result BOOLEAN := false;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;
  SELECT id, reaction_type INTO existing_reaction_id, existing_reaction_type
  FROM public.post_reactions
  WHERE post_id = target_post_id
    AND user_id = p_user_id;
  IF existing_reaction_id IS NOT NULL THEN
    IF existing_reaction_type = target_reaction_type THEN
      DELETE FROM public.post_reactions WHERE id = existing_reaction_id;
      result := false;
    ELSE
      UPDATE public.post_reactions
      SET reaction_type = target_reaction_type, updated_at = NOW()
      WHERE id = existing_reaction_id;
      result := true;
    END IF;
  ELSE
    INSERT INTO public.post_reactions (post_id, user_id, reaction_type)
    VALUES (target_post_id, p_user_id, target_reaction_type);
    result := true;
  END IF;
  RETURN result;
END;
$$;

-- ── Trigger functions (no params possible — use the GUC helper) ───────────
CREATE OR REPLACE FUNCTION public.log_esg_data_access()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action_type,
    severity,
    details
  ) VALUES (
    public.current_actor_id(),
    'esg_data_access',
    'info',
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'organization_id', COALESCE(NEW.organization_id, OLD.organization_id),
      'operation', TG_OP,
      'timestamp', now()
    )
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_message_access()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.message_access_log (
    user_id,
    message_id,
    access_type,
    ip_address
  ) VALUES (
    public.current_actor_id(),
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    inet_client_addr()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_verification_action()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.esg_verification_audit_log (
    contribution_id,
    action_type,
    performed_by,
    notes,
    previous_status,
    new_status
  ) VALUES (
    NEW.id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'submitted'
      WHEN OLD.verification_status = 'pending' AND NEW.verification_status = 'approved' THEN 'approved'
      WHEN OLD.verification_status = 'pending' AND NEW.verification_status = 'rejected' THEN 'rejected'
      WHEN OLD.verification_status = 'pending' AND NEW.verification_status = 'needs_revision' THEN 'revision_requested'
      WHEN OLD.verification_status = 'needs_revision' AND NEW.verification_status = 'pending' THEN 'resubmitted'
      ELSE 'submitted'
    END,
    COALESCE(NEW.verified_by, public.current_actor_id()),
    NEW.verification_notes,
    OLD.verification_status,
    NEW.verification_status
  );

  RETURN NEW;
END;
$$;
