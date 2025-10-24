-- Fix security warnings by setting search_path on all functions

ALTER FUNCTION check_campaign_limit(uuid, uuid) SET search_path = public, pg_temp;
ALTER FUNCTION check_team_member_limit(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION has_white_label_access(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION get_esg_access_level(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION admin_grant_founding_member(uuid, uuid, text) SET search_path = public, pg_temp;
ALTER FUNCTION admin_revoke_founding_member(uuid, uuid, text) SET search_path = public, pg_temp;
ALTER FUNCTION admin_assign_subscription(uuid, uuid, text, uuid, text) SET search_path = public, pg_temp;