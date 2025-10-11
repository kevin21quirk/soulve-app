-- ================================================================
-- MINIMAL RLS PERFORMANCE OPTIMIZATION
-- Only touching tables we're certain exist
-- ================================================================

-- CONNECTIONS TABLE
DROP POLICY IF EXISTS "Users can create connection requests" ON public.connections;
DROP POLICY IF EXISTS "Users can update their connection status" ON public.connections;
DROP POLICY IF EXISTS "Users can view their own connections" ON public.connections;

CREATE POLICY "connections_opt" ON public.connections FOR ALL TO authenticated
USING (requester_id = auth.uid() OR addressee_id = auth.uid())
WITH CHECK (requester_id = auth.uid());

-- PROFILES TABLE
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_select_opt" ON public.profiles FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "profiles_insert_opt" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_opt" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- NOTIFICATIONS TABLE
DROP POLICY IF EXISTS "Users can delete their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can mark as read" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;

CREATE POLICY "notifications_opt" ON public.notifications FOR ALL TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid() OR auth.uid() IS NOT NULL);

-- IMPACT_ACTIVITIES TABLE
DROP POLICY IF EXISTS "Users can create their own activities" ON public.impact_activities;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.impact_activities;
DROP POLICY IF EXISTS "impact_activities_delete" ON public.impact_activities;
DROP POLICY IF EXISTS "impact_activities_insert" ON public.impact_activities;
DROP POLICY IF EXISTS "impact_activities_select" ON public.impact_activities;
DROP POLICY IF EXISTS "impact_activities_update" ON public.impact_activities;

CREATE POLICY "impact_activities_opt" ON public.impact_activities FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- IMPACT_METRICS TABLE - Fix current_setting issue
DROP POLICY IF EXISTS "Users can view their own metrics" ON public.impact_metrics;
DROP POLICY IF EXISTS "impact_metrics_select" ON public.impact_metrics;
DROP POLICY IF EXISTS "impact_metrics_insert" ON public.impact_metrics;
DROP POLICY IF EXISTS "impact_metrics_update" ON public.impact_metrics;

CREATE POLICY "impact_metrics_select_opt" ON public.impact_metrics FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "impact_metrics_service" ON public.impact_metrics FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- CAMPAIGN_PARTICIPANTS TABLE
DROP POLICY IF EXISTS "Users can join campaigns" ON public.campaign_participants;
DROP POLICY IF EXISTS "Users can leave campaigns" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_delete_creator_admin" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_insert_own" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_select_access" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_update_creator" ON public.campaign_participants;
DROP POLICY IF EXISTS "cp_update_own" ON public.campaign_participants;

CREATE POLICY "campaign_participants_opt" ON public.campaign_participants FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- USER_BADGES TABLE
DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "user_badges_select" ON public.user_badges;
DROP POLICY IF EXISTS "user_badges_insert" ON public.user_badges;

CREATE POLICY "user_badges_select_opt" ON public.user_badges FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_badges_insert_svc" ON public.user_badges FOR INSERT TO service_role WITH CHECK (TRUE);

-- USER_ACHIEVEMENTS TABLE
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "user_achievements_select" ON public.user_achievements;
DROP POLICY IF EXISTS "user_achievements_insert" ON public.user_achievements;
DROP POLICY IF EXISTS "user_achievements_update" ON public.user_achievements;

CREATE POLICY "user_achievements_opt" ON public.user_achievements FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- USER_ACTIVITIES TABLE
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "user_activities_select" ON public.user_activities;
DROP POLICY IF EXISTS "user_activities_insert" ON public.user_activities;
DROP POLICY IF EXISTS "user_activities_update" ON public.user_activities;
DROP POLICY IF EXISTS "user_activities_delete" ON public.user_activities;

CREATE POLICY "user_activities_opt" ON public.user_activities FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- USER_PREFERENCES TABLE
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_select" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_insert" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_update" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_delete" ON public.user_preferences;

CREATE POLICY "user_preferences_opt" ON public.user_preferences FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- USER_PRIVACY_SETTINGS TABLE
DROP POLICY IF EXISTS "Users can manage their own privacy settings" ON public.user_privacy_settings;
DROP POLICY IF EXISTS "user_privacy_settings_select" ON public.user_privacy_settings;
DROP POLICY IF EXISTS "user_privacy_settings_insert" ON public.user_privacy_settings;
DROP POLICY IF EXISTS "user_privacy_settings_update" ON public.user_privacy_settings;

CREATE POLICY "user_privacy_settings_opt" ON public.user_privacy_settings FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ADD PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_conn_req ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_conn_addr ON public.connections(addressee_id);
CREATE INDEX IF NOT EXISTS idx_notif_recip ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_impact_act_user ON public.impact_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_impact_met_user ON public.impact_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_camp_part_user ON public.campaign_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badge_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ach_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_act_user ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pref_user ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_priv_user ON public.user_privacy_settings(user_id);