-- Final batch: Add CASCADE delete for remaining user-related tables
-- Only including tables we're certain exist with correct column names

-- post_interactions
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'post_interactions' AND column_name = 'user_id') THEN
    ALTER TABLE post_interactions DROP CONSTRAINT IF EXISTS post_interactions_user_id_fkey;
    ALTER TABLE post_interactions ADD CONSTRAINT post_interactions_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- post_reactions
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'post_reactions' AND column_name = 'user_id') THEN
    ALTER TABLE post_reactions DROP CONSTRAINT IF EXISTS post_reactions_user_id_fkey;
    ALTER TABLE post_reactions ADD CONSTRAINT post_reactions_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- profiles
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') THEN
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
    ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- safe_space_audit_log
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'safe_space_audit_log' AND column_name = 'user_id') THEN
    ALTER TABLE safe_space_audit_log DROP CONSTRAINT IF EXISTS safe_space_audit_log_user_id_fkey;
    ALTER TABLE safe_space_audit_log ADD CONSTRAINT safe_space_audit_log_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- safe_space_helpers
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'safe_space_helpers' AND column_name = 'user_id') THEN
    ALTER TABLE safe_space_helpers DROP CONSTRAINT IF EXISTS safe_space_helpers_user_id_fkey;
    ALTER TABLE safe_space_helpers ADD CONSTRAINT safe_space_helpers_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- safe_space_sessions
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'safe_space_sessions' AND column_name = 'user_id') THEN
    ALTER TABLE safe_space_sessions DROP CONSTRAINT IF EXISTS safe_space_sessions_user_id_fkey;
    ALTER TABLE safe_space_sessions DROP CONSTRAINT IF EXISTS safe_space_sessions_helper_id_fkey;
    ALTER TABLE safe_space_sessions ADD CONSTRAINT safe_space_sessions_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE safe_space_sessions ADD CONSTRAINT safe_space_sessions_helper_id_fkey 
      FOREIGN KEY (helper_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- security_audit_log
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'security_audit_log' AND column_name = 'user_id') THEN
    ALTER TABLE security_audit_log DROP CONSTRAINT IF EXISTS security_audit_log_user_id_fkey;
    ALTER TABLE security_audit_log ADD CONSTRAINT security_audit_log_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- trust_scores
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trust_scores' AND column_name = 'user_id') THEN
    ALTER TABLE trust_scores DROP CONSTRAINT IF EXISTS trust_scores_user_id_fkey;
    ALTER TABLE trust_scores ADD CONSTRAINT trust_scores_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- user_activities
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_activities' AND column_name = 'user_id') THEN
    ALTER TABLE user_activities DROP CONSTRAINT IF EXISTS user_activities_user_id_fkey;
    ALTER TABLE user_activities ADD CONSTRAINT user_activities_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- user_connections (alternative name check)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_connections' AND column_name = 'user_id') THEN
    ALTER TABLE user_connections DROP CONSTRAINT IF EXISTS user_connections_user_id_fkey;
    ALTER TABLE user_connections DROP CONSTRAINT IF EXISTS user_connections_connection_id_fkey;
    ALTER TABLE user_connections ADD CONSTRAINT user_connections_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE user_connections ADD CONSTRAINT user_connections_connection_id_fkey 
      FOREIGN KEY (connection_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- user_preferences
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_preferences' AND column_name = 'user_id') THEN
    ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS user_preferences_user_id_fkey;
    ALTER TABLE user_preferences ADD CONSTRAINT user_preferences_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- user_privacy_settings
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_privacy_settings' AND column_name = 'user_id') THEN
    ALTER TABLE user_privacy_settings DROP CONSTRAINT IF EXISTS user_privacy_settings_user_id_fkey;
    ALTER TABLE user_privacy_settings ADD CONSTRAINT user_privacy_settings_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- waitlist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'user_id') THEN
    ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_user_id_fkey;
    ALTER TABLE waitlist ADD CONSTRAINT waitlist_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;