-- Add CASCADE delete for all user-related foreign keys
-- This ensures when a user is deleted from auth.users, all their data is automatically removed

-- Drop and recreate foreign keys with CASCADE for admin_action_log
ALTER TABLE admin_action_log DROP CONSTRAINT IF EXISTS admin_action_log_admin_id_fkey;
ALTER TABLE admin_action_log DROP CONSTRAINT IF EXISTS admin_action_log_target_user_id_fkey;
ALTER TABLE admin_action_log ADD CONSTRAINT admin_action_log_admin_id_fkey 
  FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE admin_action_log ADD CONSTRAINT admin_action_log_target_user_id_fkey 
  FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- admin_roles
ALTER TABLE admin_roles DROP CONSTRAINT IF EXISTS admin_roles_user_id_fkey;
ALTER TABLE admin_roles DROP CONSTRAINT IF EXISTS admin_roles_granted_by_fkey;
ALTER TABLE admin_roles ADD CONSTRAINT admin_roles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE admin_roles ADD CONSTRAINT admin_roles_granted_by_fkey 
  FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- ai_endpoint_rate_limits
ALTER TABLE ai_endpoint_rate_limits DROP CONSTRAINT IF EXISTS ai_endpoint_rate_limits_user_id_fkey;
ALTER TABLE ai_endpoint_rate_limits ADD CONSTRAINT ai_endpoint_rate_limits_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- badge_award_log
ALTER TABLE badge_award_log DROP CONSTRAINT IF EXISTS badge_award_log_user_id_fkey;
ALTER TABLE badge_award_log DROP CONSTRAINT IF EXISTS badge_award_log_awarded_by_fkey;
ALTER TABLE badge_award_log DROP CONSTRAINT IF EXISTS badge_award_log_revoked_by_fkey;
ALTER TABLE badge_award_log ADD CONSTRAINT badge_award_log_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE badge_award_log ADD CONSTRAINT badge_award_log_awarded_by_fkey 
  FOREIGN KEY (awarded_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE badge_award_log ADD CONSTRAINT badge_award_log_revoked_by_fkey 
  FOREIGN KEY (revoked_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- blog_posts
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- campaign_donations
ALTER TABLE campaign_donations DROP CONSTRAINT IF EXISTS campaign_donations_donor_id_fkey;
ALTER TABLE campaign_donations ADD CONSTRAINT campaign_donations_donor_id_fkey 
  FOREIGN KEY (donor_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- campaign_engagement
ALTER TABLE campaign_engagement DROP CONSTRAINT IF EXISTS campaign_engagement_user_id_fkey;
ALTER TABLE campaign_engagement ADD CONSTRAINT campaign_engagement_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- campaign_interactions
ALTER TABLE campaign_interactions DROP CONSTRAINT IF EXISTS campaign_interactions_user_id_fkey;
ALTER TABLE campaign_interactions ADD CONSTRAINT campaign_interactions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- campaign_invitations
ALTER TABLE campaign_invitations DROP CONSTRAINT IF EXISTS campaign_invitations_inviter_id_fkey;
ALTER TABLE campaign_invitations DROP CONSTRAINT IF EXISTS campaign_invitations_invitee_id_fkey;
ALTER TABLE campaign_invitations ADD CONSTRAINT campaign_invitations_inviter_id_fkey 
  FOREIGN KEY (inviter_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE campaign_invitations ADD CONSTRAINT campaign_invitations_invitee_id_fkey 
  FOREIGN KEY (invitee_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- campaign_participants
ALTER TABLE campaign_participants DROP CONSTRAINT IF EXISTS campaign_participants_user_id_fkey;
ALTER TABLE campaign_participants ADD CONSTRAINT campaign_participants_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- campaign_updates
ALTER TABLE campaign_updates DROP CONSTRAINT IF EXISTS campaign_updates_author_id_fkey;
ALTER TABLE campaign_updates ADD CONSTRAINT campaign_updates_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- campaigns
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_creator_id_fkey;
ALTER TABLE campaigns ADD CONSTRAINT campaigns_creator_id_fkey 
  FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- carbon_footprint_data
ALTER TABLE carbon_footprint_data DROP CONSTRAINT IF EXISTS carbon_footprint_data_created_by_fkey;
ALTER TABLE carbon_footprint_data ADD CONSTRAINT carbon_footprint_data_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- comment_likes
ALTER TABLE comment_likes DROP CONSTRAINT IF EXISTS comment_likes_user_id_fkey;
ALTER TABLE comment_likes ADD CONSTRAINT comment_likes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;