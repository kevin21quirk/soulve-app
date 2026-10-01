CREATE INDEX idx_admin_action_log_admin_id ON public.admin_action_log USING btree (admin_id);

CREATE INDEX idx_admin_action_log_created_at ON public.admin_action_log USING btree (created_at DESC);

CREATE INDEX idx_admin_action_log_target_user_id ON public.admin_action_log USING btree (target_user_id);

CREATE INDEX idx_admin_roles_granted_by ON public.admin_roles USING btree (granted_by);

CREATE INDEX idx_admin_roles_user_id ON public.admin_roles USING btree (user_id);

CREATE INDEX idx_ai_endpoint_rate_limits_user_id ON public.ai_endpoint_rate_limits USING btree (user_id);

CREATE INDEX idx_ai_rate_limits_user_endpoint ON public.ai_endpoint_rate_limits USING btree (user_id, endpoint_name, window_start);

CREATE INDEX idx_badge_award_log_badge ON public.badge_award_log USING btree (badge_id);

CREATE INDEX idx_badge_award_log_campaign ON public.badge_award_log USING btree (campaign_id) WHERE (campaign_id IS NOT NULL);

CREATE INDEX idx_badge_award_log_status ON public.badge_award_log USING btree (verification_status);

CREATE INDEX idx_badge_award_log_user ON public.badge_award_log USING btree (user_id);

CREATE INDEX idx_badges_campaign ON public.badges USING btree (campaign_id) WHERE (campaign_id IS NOT NULL);

CREATE INDEX idx_badges_event_identifier ON public.badges USING btree (event_identifier) WHERE (event_identifier IS NOT NULL);

CREATE INDEX idx_blog_posts_author ON public.blog_posts USING btree (author_id);

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category_id);

CREATE INDEX idx_blog_posts_published ON public.blog_posts USING btree (published_at) WHERE (is_published = true);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug);

CREATE INDEX idx_business_partnerships_org_id ON public.business_partnerships USING btree (organization_id);

CREATE INDEX idx_business_products_org_id ON public.business_products USING btree (organization_id);

CREATE INDEX idx_camp_part_user ON public.campaign_participants USING btree (user_id);

CREATE INDEX idx_campaign_analytics_campaign_date ON public.campaign_analytics USING btree (campaign_id, date);

CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics USING btree (campaign_id);

CREATE INDEX idx_campaign_analytics_date ON public.campaign_analytics USING btree (date);

CREATE INDEX idx_campaign_donations_campaign_created ON public.campaign_donations USING btree (campaign_id, created_at);

CREATE INDEX idx_campaign_donations_campaign_id ON public.campaign_donations USING btree (campaign_id);

CREATE INDEX idx_campaign_donations_donor_id ON public.campaign_donations USING btree (donor_id);

CREATE INDEX idx_campaign_engagement_campaign_action ON public.campaign_engagement USING btree (campaign_id, action_type, created_at);

CREATE INDEX idx_campaign_engagement_campaign_id ON public.campaign_engagement USING btree (campaign_id);

CREATE INDEX idx_campaign_engagement_user_id ON public.campaign_engagement USING btree (user_id);

CREATE INDEX idx_campaign_geographic_country ON public.campaign_geographic_impact USING btree (campaign_id, country_code);

CREATE INDEX idx_campaign_geographic_impact_campaign_id ON public.campaign_geographic_impact USING btree (campaign_id);

CREATE INDEX idx_campaign_interactions_campaign_id ON public.campaign_interactions USING btree (campaign_id);

CREATE INDEX idx_campaign_interactions_campaign_type ON public.campaign_interactions USING btree (campaign_id, interaction_type) WHERE (is_deleted = false);

CREATE INDEX idx_campaign_interactions_created_at ON public.campaign_interactions USING btree (created_at DESC);

CREATE INDEX idx_campaign_interactions_organization_id ON public.campaign_interactions USING btree (organization_id);

CREATE INDEX idx_campaign_interactions_parent_id ON public.campaign_interactions USING btree (parent_id);

CREATE INDEX idx_campaign_interactions_user_id ON public.campaign_interactions USING btree (user_id);

CREATE INDEX idx_campaign_invitations_campaign_id ON public.campaign_invitations USING btree (campaign_id);

CREATE INDEX idx_campaign_invitations_invitee_email ON public.campaign_invitations USING btree (invitee_email);

CREATE INDEX idx_campaign_invitations_invitee_id ON public.campaign_invitations USING btree (invitee_id);

CREATE INDEX idx_campaign_invitations_inviter_id ON public.campaign_invitations USING btree (inviter_id);

CREATE INDEX idx_campaign_participants_campaign_id ON public.campaign_participants USING btree (campaign_id);

CREATE INDEX idx_campaign_participants_user ON public.campaign_participants USING btree (user_id, campaign_id);

CREATE INDEX idx_campaign_participants_user_id ON public.campaign_participants USING btree (user_id);

CREATE INDEX idx_campaign_predictions_campaign_id ON public.campaign_predictions USING btree (campaign_id);

CREATE INDEX idx_campaign_promotions_campaign_id ON public.campaign_promotions USING btree (campaign_id);

CREATE INDEX idx_campaign_social_metrics_campaign_id ON public.campaign_social_metrics USING btree (campaign_id);

CREATE INDEX idx_campaign_social_platform_date ON public.campaign_social_metrics USING btree (campaign_id, platform, date);

CREATE INDEX idx_campaign_sponsorships_campaign ON public.campaign_sponsorships USING btree (campaign_id);

CREATE INDEX idx_campaign_sponsorships_org ON public.campaign_sponsorships USING btree (organization_id);

CREATE INDEX idx_campaign_sponsorships_status ON public.campaign_sponsorships USING btree (status);

CREATE INDEX idx_campaign_updates_author_id ON public.campaign_updates USING btree (author_id);

CREATE INDEX idx_campaign_updates_campaign_id ON public.campaign_updates USING btree (campaign_id);

CREATE INDEX idx_campaigns_category ON public.campaigns USING btree (category);

CREATE INDEX idx_campaigns_creator_id ON public.campaigns USING btree (creator_id);

CREATE INDEX idx_campaigns_creator_status ON public.campaigns USING btree (creator_id, status);

CREATE INDEX idx_campaigns_end_date ON public.campaigns USING btree (end_date);

CREATE INDEX idx_campaigns_status ON public.campaigns USING btree (status);

CREATE INDEX idx_campaigns_status_date ON public.campaigns USING btree (status, created_at DESC);

CREATE INDEX idx_carbon_footprint_data_created_by ON public.carbon_footprint_data USING btree (created_by);

CREATE INDEX idx_carbon_footprint_data_organization_id ON public.carbon_footprint_data USING btree (organization_id);

CREATE INDEX idx_comment_likes_comment ON public.comment_likes USING btree (comment_id, created_at);

CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes USING btree (comment_id);

CREATE INDEX idx_comment_likes_user_comment ON public.comment_likes USING btree (user_id, comment_id);

CREATE INDEX idx_comment_likes_user_id ON public.comment_likes USING btree (user_id);

CREATE INDEX idx_conn_addr ON public.connections USING btree (addressee_id);

CREATE INDEX idx_conn_req ON public.connections USING btree (requester_id);

CREATE INDEX idx_connections_addressee_id ON public.connections USING btree (addressee_id);

CREATE INDEX idx_connections_addressee_status ON public.connections USING btree (addressee_id, status);

CREATE INDEX idx_connections_both_users ON public.connections USING btree (requester_id, addressee_id);

CREATE INDEX idx_connections_requester_id ON public.connections USING btree (requester_id);

CREATE INDEX idx_connections_requester_status ON public.connections USING btree (requester_id, status);

CREATE INDEX idx_connections_status ON public.connections USING btree (status);

CREATE INDEX idx_connections_users ON public.connections USING btree (requester_id, addressee_id, status);

CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions USING btree (created_at DESC);

CREATE INDEX idx_contact_submissions_status ON public.contact_submissions USING btree (status);

CREATE INDEX idx_content_appeals_report_id ON public.content_appeals USING btree (report_id);

CREATE INDEX idx_content_appeals_reviewed_by ON public.content_appeals USING btree (reviewed_by);

CREATE INDEX idx_content_appeals_user_id ON public.content_appeals USING btree (user_id);

CREATE INDEX idx_content_reports_content ON public.content_reports USING btree (content_id, content_type);

CREATE INDEX idx_content_reports_content_id ON public.content_reports USING btree (content_id);

CREATE INDEX idx_content_reports_content_owner_id ON public.content_reports USING btree (content_owner_id);

CREATE INDEX idx_content_reports_reported_by ON public.content_reports USING btree (reported_by);

CREATE INDEX idx_content_reports_reviewed_by ON public.content_reports USING btree (reviewed_by);

CREATE INDEX idx_content_reports_status ON public.content_reports USING btree (status);

CREATE INDEX idx_content_translations_expires ON public.content_translations USING btree (expires_at);

CREATE INDEX idx_content_translations_lookup ON public.content_translations USING btree (content_id, content_type, target_language);

CREATE INDEX idx_contributions_status ON public.stakeholder_data_contributions USING btree (contribution_status, verification_status);

CREATE INDEX idx_contributions_verification_status ON public.stakeholder_data_contributions USING btree (verification_status);

CREATE INDEX idx_conversation_participants_conv_user ON public.conversation_participants USING btree (conversation_id, user_id);

CREATE INDEX idx_conversation_participants_conversation_id ON public.conversation_participants USING btree (conversation_id);

CREATE INDEX idx_conversation_participants_deleted ON public.conversation_participants USING btree (user_id, deleted_at);

CREATE INDEX idx_conversation_participants_user_conv ON public.conversation_participants USING btree (user_id, conversation_id);

CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants USING btree (user_id);

CREATE INDEX idx_csr_initiatives_org_id ON public.csr_initiatives USING btree (organization_id);

CREATE INDEX idx_csr_lead_tracking_action ON public.csr_lead_tracking USING btree (action_type);

CREATE INDEX idx_csr_lead_tracking_created ON public.csr_lead_tracking USING btree (created_at);

CREATE INDEX idx_csr_lead_tracking_org ON public.csr_lead_tracking USING btree (organization_id);

CREATE INDEX idx_csr_opportunities_org ON public.csr_opportunities USING btree (organization_id);

CREATE INDEX idx_csr_opportunities_post ON public.csr_opportunities USING btree (post_id);

CREATE INDEX idx_csr_opportunities_status ON public.csr_opportunities USING btree (status);

CREATE INDEX idx_data_requests_status ON public.esg_data_requests USING btree (status, due_date);

CREATE INDEX idx_demo_activity_log_created_at ON public.demo_request_activity_log USING btree (created_at DESC);

CREATE INDEX idx_demo_activity_log_request_id ON public.demo_request_activity_log USING btree (demo_request_id);

CREATE INDEX idx_demo_requests_assigned_to ON public.demo_requests USING btree (assigned_to);

CREATE INDEX idx_demo_requests_created_at ON public.demo_requests USING btree (created_at DESC);

CREATE INDEX idx_demo_requests_email ON public.demo_requests USING btree (email);

CREATE INDEX idx_demo_requests_status ON public.demo_requests USING btree (status);

CREATE INDEX idx_donors_org_id ON public.donors USING btree (organization_id);

CREATE INDEX idx_donors_user_id ON public.donors USING btree (user_id);

CREATE INDEX idx_employee_engagement_org_id ON public.employee_engagement USING btree (organization_id);

CREATE INDEX idx_esg_announcements_org ON public.esg_announcements USING btree (organization_id);

CREATE INDEX idx_esg_benchmarks_indicator_id ON public.esg_benchmarks USING btree (indicator_id);

CREATE INDEX idx_esg_compliance_reports_approved_by ON public.esg_compliance_reports USING btree (approved_by);

CREATE INDEX idx_esg_compliance_reports_framework_id ON public.esg_compliance_reports USING btree (framework_id);

CREATE INDEX idx_esg_compliance_reports_generated_by ON public.esg_compliance_reports USING btree (generated_by);

CREATE INDEX idx_esg_compliance_reports_org_id ON public.esg_compliance_reports USING btree (organization_id);

CREATE INDEX idx_esg_data_entries_indicator_id ON public.esg_data_entries USING btree (indicator_id);

CREATE INDEX idx_esg_data_entries_org_id ON public.esg_data_entries USING btree (organization_id);

CREATE INDEX idx_esg_data_requests_framework_id ON public.esg_data_requests USING btree (framework_id);

CREATE INDEX idx_esg_data_requests_indicator_id ON public.esg_data_requests USING btree (indicator_id);

CREATE INDEX idx_esg_data_requests_initiative_id ON public.esg_data_requests USING btree (initiative_id);

CREATE INDEX idx_esg_data_requests_org_id ON public.esg_data_requests USING btree (organization_id);

CREATE INDEX idx_esg_data_requests_requested_from_org_id ON public.esg_data_requests USING btree (requested_from_org_id);

CREATE INDEX idx_esg_data_requests_status ON public.esg_data_requests USING btree (status);

CREATE INDEX idx_esg_goals_indicator_id ON public.esg_goals USING btree (indicator_id);

CREATE INDEX idx_esg_goals_org_id ON public.esg_goals USING btree (organization_id);

CREATE INDEX idx_esg_indicators_framework_id ON public.esg_indicators USING btree (framework_id);

CREATE INDEX idx_esg_initiatives_org_id ON public.esg_initiatives USING btree (organization_id);

CREATE INDEX idx_esg_initiatives_status ON public.esg_initiatives USING btree (status);

CREATE INDEX idx_esg_recommendations_org_id ON public.esg_recommendations USING btree (organization_id);

CREATE INDEX idx_esg_reports_initiative_id ON public.esg_reports USING btree (initiative_id);

CREATE INDEX idx_esg_reports_org_id ON public.esg_reports USING btree (organization_id);

CREATE INDEX idx_esg_risks_org_id ON public.esg_risks USING btree (organization_id);

CREATE INDEX idx_esg_targets_created_by ON public.esg_targets USING btree (created_by);

CREATE INDEX idx_esg_targets_indicator_id ON public.esg_targets USING btree (indicator_id);

CREATE INDEX idx_esg_targets_org_id ON public.esg_targets USING btree (organization_id);

CREATE INDEX idx_esg_verification_audit_log_contribution_id ON public.esg_verification_audit_log USING btree (contribution_id);

CREATE INDEX idx_esg_verification_audit_log_performed_by ON public.esg_verification_audit_log USING btree (performed_by);

CREATE INDEX idx_evidence_submissions_activity_id ON public.evidence_submissions USING btree (activity_id);

CREATE INDEX idx_evidence_submissions_user_id ON public.evidence_submissions USING btree (user_id);

CREATE INDEX idx_evidence_submissions_verified_by ON public.evidence_submissions USING btree (verified_by);

CREATE INDEX idx_feedback_created_at ON public.platform_feedback USING btree (created_at DESC);

CREATE INDEX idx_feedback_status ON public.platform_feedback USING btree (status);

CREATE INDEX idx_feedback_type ON public.platform_feedback USING btree (feedback_type);

CREATE INDEX idx_fraud_detection_log_reviewer_id ON public.fraud_detection_log USING btree (reviewer_id);

CREATE INDEX idx_fraud_detection_log_user_id ON public.fraud_detection_log USING btree (user_id);

CREATE INDEX idx_group_members_group_id ON public.group_members USING btree (group_id);

CREATE INDEX idx_group_members_group_user ON public.group_members USING btree (group_id, user_id);

CREATE INDEX idx_group_members_user_group ON public.group_members USING btree (user_id, group_id);

CREATE INDEX idx_group_members_user_id ON public.group_members USING btree (user_id);

CREATE INDEX idx_groups_admin_id ON public.groups USING btree (admin_id);

CREATE INDEX idx_groups_category ON public.groups USING btree (category);

CREATE INDEX idx_help_completion_requests_helper_id ON public.help_completion_requests USING btree (helper_id);

CREATE INDEX idx_help_completion_requests_post_id ON public.help_completion_requests USING btree (post_id);

CREATE INDEX idx_help_completion_requests_requester_id ON public.help_completion_requests USING btree (requester_id);

CREATE INDEX idx_help_completion_requests_status ON public.help_completion_requests USING btree (status);

CREATE INDEX idx_helper_applications_status ON public.safe_space_helper_applications USING btree (application_status);

CREATE INDEX idx_helper_applications_submitted ON public.safe_space_helper_applications USING btree (submitted_at DESC) WHERE (submitted_at IS NOT NULL);

CREATE INDEX idx_impact_act_user ON public.impact_activities USING btree (user_id);

CREATE INDEX idx_impact_activities_confirmation_status ON public.impact_activities USING btree (user_id, confirmation_status);

CREATE INDEX idx_impact_activities_confirmed_by ON public.impact_activities USING btree (confirmed_by);

CREATE INDEX idx_impact_activities_created_at ON public.impact_activities USING btree (created_at);

CREATE INDEX idx_impact_activities_market_value ON public.impact_activities USING btree (user_id, market_value_gbp) WHERE (market_value_gbp > (0)::numeric);

CREATE INDEX idx_impact_activities_organization_confirmation ON public.impact_activities USING btree (organization_id, confirmation_status) WHERE (organization_id IS NOT NULL);

CREATE INDEX idx_impact_activities_organization_id ON public.impact_activities USING btree (organization_id);

CREATE INDEX idx_impact_activities_post_confirmation ON public.impact_activities USING btree (post_id, confirmation_status) WHERE (post_id IS NOT NULL);

CREATE INDEX idx_impact_activities_post_id ON public.impact_activities USING btree (post_id);

CREATE INDEX idx_impact_activities_skill_category ON public.impact_activities USING btree (skill_category_id);

CREATE INDEX idx_impact_activities_type_verified ON public.impact_activities USING btree (activity_type, verified);

CREATE INDEX idx_impact_activities_user_created ON public.impact_activities USING btree (user_id, created_at DESC);

CREATE INDEX idx_impact_activities_user_id ON public.impact_activities USING btree (user_id);

CREATE INDEX idx_impact_goals_user_active ON public.impact_goals USING btree (user_id, is_active) WHERE (is_active = true);

CREATE INDEX idx_impact_goals_user_id ON public.impact_goals USING btree (user_id);

CREATE INDEX idx_impact_met_user ON public.impact_metrics USING btree (user_id);

CREATE INDEX idx_impact_metrics_impact_score ON public.impact_metrics USING btree (impact_score DESC);

CREATE INDEX idx_impact_metrics_user_id ON public.impact_metrics USING btree (user_id);

CREATE INDEX idx_initiatives_progress ON public.esg_initiatives USING btree (organization_id, progress_percentage);

CREATE INDEX idx_language_detection_created ON public.language_detection_cache USING btree (created_at);

CREATE INDEX idx_materiality_assessments_created_by ON public.materiality_assessments USING btree (created_by);

CREATE INDEX idx_materiality_assessments_indicator_id ON public.materiality_assessments USING btree (indicator_id);

CREATE INDEX idx_materiality_assessments_org_id ON public.materiality_assessments USING btree (organization_id);

CREATE INDEX idx_message_access_log_message_id ON public.message_access_log USING btree (message_id);

CREATE INDEX idx_message_access_log_user_id ON public.message_access_log USING btree (user_id);

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at DESC);

CREATE INDEX idx_messages_delivered_at ON public.messages USING btree (delivered_at);

CREATE INDEX idx_messages_read_at ON public.messages USING btree (read_at);

CREATE INDEX idx_messages_recipient_id ON public.messages USING btree (recipient_id);

CREATE INDEX idx_messages_recipient_id_created_at ON public.messages USING btree (recipient_id, created_at);

CREATE INDEX idx_messages_recipient_sender ON public.messages USING btree (recipient_id, sender_id);

CREATE INDEX idx_messages_recipient_unread ON public.messages USING btree (recipient_id, is_read, created_at DESC);

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);

CREATE INDEX idx_messages_sender_id_created_at ON public.messages USING btree (sender_id, created_at);

CREATE INDEX idx_messages_sender_recipient ON public.messages USING btree (sender_id, recipient_id, created_at DESC);

CREATE INDEX idx_messages_unread ON public.messages USING btree (recipient_id, is_read) WHERE (is_read = false);

CREATE INDEX idx_newsletter_subscriptions_email ON public.newsletter_subscriptions USING btree (email);

CREATE INDEX idx_newsletter_subscriptions_is_active ON public.newsletter_subscriptions USING btree (is_active);

CREATE INDEX idx_notif_recip ON public.notifications USING btree (recipient_id);

CREATE INDEX idx_notification_analytics_notification_id ON public.notification_analytics USING btree (notification_id);

CREATE INDEX idx_notification_analytics_user_id ON public.notification_analytics USING btree (user_id);

CREATE INDEX idx_notification_delivery_log_notification_id ON public.notification_delivery_log USING btree (notification_id);

CREATE INDEX idx_notification_delivery_log_user_id ON public.notification_delivery_log USING btree (user_id);

CREATE INDEX idx_notification_filters_user_id ON public.notification_filters USING btree (user_id);

CREATE INDEX idx_notification_templates_created_by ON public.notification_templates USING btree (created_by);

CREATE INDEX idx_notification_templates_type ON public.notification_templates USING btree (type) WHERE (is_active = true);

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at DESC);

CREATE INDEX idx_notifications_delivery_status ON public.notifications USING btree (delivery_status);

CREATE INDEX idx_notifications_group_key ON public.notifications USING btree (group_key);

CREATE INDEX idx_notifications_grouped_with ON public.notifications USING btree (grouped_with);

CREATE INDEX idx_notifications_priority ON public.notifications USING btree (priority);

CREATE INDEX idx_notifications_recipient_created ON public.notifications USING btree (recipient_id, created_at DESC);

CREATE INDEX idx_notifications_recipient_id ON public.notifications USING btree (recipient_id);

CREATE INDEX idx_notifications_recipient_id_created_at ON public.notifications USING btree (recipient_id, created_at);

CREATE INDEX idx_notifications_recipient_read ON public.notifications USING btree (recipient_id, is_read, created_at DESC);

CREATE INDEX idx_notifications_recipient_unread ON public.notifications USING btree (recipient_id, is_read, created_at DESC) WHERE (is_read = false);

CREATE INDEX idx_notifications_sender_id ON public.notifications USING btree (sender_id);

CREATE INDEX idx_notifications_unread ON public.notifications USING btree (recipient_id, is_read);

CREATE INDEX idx_org_activities_org ON public.organization_activities USING btree (organization_id);

CREATE INDEX idx_org_activities_published ON public.organization_activities USING btree (published_at DESC);

CREATE INDEX idx_org_followers_org ON public.organization_followers USING btree (organization_id);

CREATE INDEX idx_org_followers_user ON public.organization_followers USING btree (follower_id);

CREATE INDEX idx_org_impact_metrics_org ON public.organization_impact_metrics USING btree (organization_id);

CREATE INDEX idx_org_members_org_user ON public.organization_members USING btree (organization_id, user_id, is_active);

CREATE INDEX idx_org_reviews_org ON public.organization_reviews USING btree (organization_id);

CREATE INDEX idx_org_reviews_rating ON public.organization_reviews USING btree (rating);

CREATE INDEX idx_org_trust_scores_org ON public.organization_trust_scores USING btree (organization_id);

CREATE INDEX idx_org_verifications_org ON public.organization_verifications USING btree (organization_id);

CREATE INDEX idx_organization_esg_data_collected_by ON public.organization_esg_data USING btree (collected_by);

CREATE INDEX idx_organization_esg_data_indicator_id ON public.organization_esg_data USING btree (indicator_id);

CREATE INDEX idx_organization_esg_data_org_id ON public.organization_esg_data USING btree (organization_id);

CREATE INDEX idx_organization_members_organization_id ON public.organization_members USING btree (organization_id);

CREATE INDEX idx_organization_members_user_id ON public.organization_members USING btree (user_id);

CREATE INDEX idx_organization_members_verified_by ON public.organization_members USING btree (verified_by);

CREATE INDEX idx_organization_preferences_organization_id ON public.organization_preferences USING btree (organization_id);

CREATE INDEX idx_organization_reviews_reviewer_id ON public.organization_reviews USING btree (reviewer_id);

CREATE INDEX idx_organization_settings_org_id ON public.organization_settings USING btree (organization_id);

CREATE INDEX idx_organization_verifications_verified_by ON public.organization_verifications USING btree (verified_by);

CREATE INDEX idx_organizations_created_by ON public.organizations USING btree (created_by);

CREATE INDEX idx_partnership_enquiries_created_at ON public.partnership_enquiries USING btree (created_at DESC);

CREATE INDEX idx_partnership_enquiries_status ON public.partnership_enquiries USING btree (status);

CREATE INDEX idx_platform_feedback_user_id ON public.platform_feedback USING btree (user_id);

CREATE INDEX idx_point_decay_log_user_id ON public.point_decay_log USING btree (user_id);

CREATE INDEX idx_points_configuration_updated_by ON public.points_configuration USING btree (updated_by);

CREATE INDEX idx_post_interactions_comment_tags ON public.post_interactions USING btree (parent_comment_id, interaction_type) WHERE ((interaction_type = 'user_tag'::text) AND (parent_comment_id IS NOT NULL));

CREATE INDEX idx_post_interactions_comments ON public.post_interactions USING btree (post_id, created_at) WHERE ((interaction_type = 'comment'::text) AND (is_deleted = false));

CREATE INDEX idx_post_interactions_organization_id ON public.post_interactions USING btree (organization_id);

CREATE INDEX idx_post_interactions_parent_comment_id ON public.post_interactions USING btree (parent_comment_id);

CREATE INDEX idx_post_interactions_post_id ON public.post_interactions USING btree (post_id);

CREATE INDEX idx_post_interactions_post_id_created_at ON public.post_interactions USING btree (post_id, created_at);

CREATE INDEX idx_post_interactions_post_type ON public.post_interactions USING btree (post_id, interaction_type) WHERE (is_deleted = false);

CREATE INDEX idx_post_interactions_user_id ON public.post_interactions USING btree (user_id);

CREATE INDEX idx_post_interactions_user_post ON public.post_interactions USING btree (user_id, post_id);

CREATE INDEX idx_post_interactions_user_tags ON public.post_interactions USING btree (user_id, interaction_type, post_id) WHERE (interaction_type = 'user_tag'::text);

CREATE INDEX idx_post_reactions_post_id ON public.post_reactions USING btree (post_id);

CREATE INDEX idx_post_reactions_type ON public.post_reactions USING btree (reaction_type);

CREATE INDEX idx_post_reactions_user_id ON public.post_reactions USING btree (user_id);

CREATE INDEX idx_post_reactions_user_post ON public.post_reactions USING btree (user_id, post_id);

CREATE INDEX idx_posts_author_active ON public.posts USING btree (author_id, is_active, created_at DESC);

CREATE INDEX idx_posts_author_created ON public.posts USING btree (author_id, created_at DESC) WHERE (is_active = true);

CREATE INDEX idx_posts_author_id ON public.posts USING btree (author_id);

CREATE INDEX idx_posts_category ON public.posts USING btree (category);

CREATE INDEX idx_posts_category_created ON public.posts USING btree (category, created_at DESC) WHERE (is_active = true);

CREATE INDEX idx_posts_created_at ON public.posts USING btree (created_at DESC);

CREATE INDEX idx_posts_location ON public.posts USING btree (latitude, longitude) WHERE ((latitude IS NOT NULL) AND (longitude IS NOT NULL));

CREATE INDEX idx_posts_org_active ON public.posts USING btree (organization_id, is_active, created_at DESC);

CREATE INDEX idx_posts_organization_id ON public.posts USING btree (organization_id);

CREATE UNIQUE INDEX idx_posts_user_import_source_external_id ON public.posts USING btree (author_id, import_source, external_id) WHERE ((import_source IS NOT NULL) AND (external_id IS NOT NULL));

CREATE INDEX idx_profiles_id ON public.profiles USING btree (id);

CREATE INDEX idx_profiles_location ON public.profiles USING btree (location) WHERE (location IS NOT NULL);

CREATE INDEX idx_profiles_name_search ON public.profiles USING btree (first_name, last_name) WHERE ((first_name IS NOT NULL) OR (last_name IS NOT NULL));

CREATE INDEX idx_profiles_waitlist_approved_by ON public.profiles USING btree (waitlist_approved_by);

CREATE INDEX idx_questionnaire_responses_user_id ON public.questionnaire_responses USING btree (user_id);

CREATE INDEX idx_rate_limit_buckets_user_id ON public.rate_limit_buckets USING btree (user_id);

CREATE INDEX idx_recommendation_cache_user_id ON public.recommendation_cache USING btree (user_id);

CREATE INDEX idx_red_flags_flagged_by ON public.red_flags USING btree (flagged_by);

CREATE INDEX idx_red_flags_resolved_by ON public.red_flags USING btree (resolved_by);

CREATE INDEX idx_red_flags_user_id ON public.red_flags USING btree (user_id);

CREATE INDEX idx_relive_stories_post_id ON public.relive_stories USING btree (post_id);

CREATE INDEX idx_reports_reported_post_id ON public.reports USING btree (reported_post_id);

CREATE INDEX idx_reports_reported_user_id ON public.reports USING btree (reported_user_id);

CREATE INDEX idx_reports_reporter_id ON public.reports USING btree (reporter_id);

CREATE INDEX idx_reports_reviewed_by ON public.reports USING btree (reviewed_by);

CREATE INDEX idx_safe_space_audit_log_user_id ON public.safe_space_audit_log USING btree (user_id);

CREATE INDEX idx_safe_space_emergency_alerts_assigned_to ON public.safe_space_emergency_alerts USING btree (assigned_to);

CREATE INDEX idx_safe_space_emergency_alerts_message_id ON public.safe_space_emergency_alerts USING btree (message_id);

CREATE INDEX idx_safe_space_emergency_alerts_session_id ON public.safe_space_emergency_alerts USING btree (session_id);

CREATE INDEX idx_safe_space_flagged_keywords_created_by ON public.safe_space_flagged_keywords USING btree (created_by);

CREATE INDEX idx_safe_space_helper_applications_reviewed_by ON public.safe_space_helper_applications USING btree (reviewed_by);

CREATE INDEX idx_safe_space_helper_applications_user_id ON public.safe_space_helper_applications USING btree (user_id);

CREATE INDEX idx_safe_space_helper_training_progress_module_id ON public.safe_space_helper_training_progress USING btree (module_id);

CREATE INDEX idx_safe_space_helper_training_progress_user_id ON public.safe_space_helper_training_progress USING btree (user_id);

CREATE INDEX idx_safe_space_helpers_user_id ON public.safe_space_helpers USING btree (user_id);

CREATE INDEX idx_safe_space_messages_session_id ON public.safe_space_messages USING btree (session_id);

CREATE INDEX idx_safe_space_queue_requester_id ON public.safe_space_queue USING btree (requester_id);

CREATE INDEX idx_safe_space_reference_checks_application_id ON public.safe_space_reference_checks USING btree (application_id);

CREATE INDEX idx_safe_space_sessions_helper_id ON public.safe_space_sessions USING btree (helper_id);

CREATE INDEX idx_safe_space_sessions_paused_by ON public.safe_space_sessions USING btree (paused_by);

CREATE INDEX idx_safe_space_sessions_requester_id ON public.safe_space_sessions USING btree (requester_id);

CREATE INDEX idx_safe_space_verification_documents_application_id ON public.safe_space_verification_documents USING btree (application_id);

CREATE INDEX idx_safe_space_verification_documents_user_id ON public.safe_space_verification_documents USING btree (user_id);

CREATE INDEX idx_safe_space_verification_documents_verified_by ON public.safe_space_verification_documents USING btree (verified_by);

CREATE INDEX idx_safeguarding_roles_assigned_by ON public.safeguarding_roles USING btree (assigned_by);

CREATE INDEX idx_safeguarding_roles_user_role ON public.safeguarding_roles USING btree (user_id, role);

CREATE INDEX idx_scheduled_notifications_recipient_id ON public.scheduled_notifications USING btree (recipient_id);

CREATE INDEX idx_scheduled_notifications_scheduled_for ON public.scheduled_notifications USING btree (scheduled_for) WHERE (status = 'pending'::text);

CREATE INDEX idx_scheduled_notifications_sender_id ON public.scheduled_notifications USING btree (sender_id);

CREATE INDEX idx_scheduled_notifications_template_id ON public.scheduled_notifications USING btree (template_id);

CREATE INDEX idx_stakeholder_data_contributions_contributor_org_id ON public.stakeholder_data_contributions USING btree (contributor_org_id);

CREATE INDEX idx_stakeholder_data_contributions_data_request_id ON public.stakeholder_data_contributions USING btree (data_request_id);

CREATE INDEX idx_stakeholder_data_contributions_esg_data_id ON public.stakeholder_data_contributions USING btree (esg_data_id);

CREATE INDEX idx_stakeholder_data_contributions_verified_by ON public.stakeholder_data_contributions USING btree (verified_by);

CREATE INDEX idx_stakeholder_engagement_metrics_org_id ON public.stakeholder_engagement_metrics USING btree (organization_id);

CREATE INDEX idx_stakeholder_groups_org_id ON public.stakeholder_groups USING btree (organization_id);

CREATE INDEX idx_stakeholder_metrics_created_by ON public.stakeholder_engagement_metrics USING btree (created_by);

CREATE INDEX idx_story_participants_post_id ON public.story_participants USING btree (post_id);

CREATE INDEX idx_story_participants_user_id ON public.story_participants USING btree (user_id);

CREATE INDEX idx_story_updates_author_id ON public.story_updates USING btree (author_id);

CREATE INDEX idx_story_updates_post_id ON public.story_updates USING btree (post_id);

CREATE INDEX idx_support_actions_action_type ON public.support_actions USING btree (action_type);

CREATE INDEX idx_support_actions_post_id ON public.support_actions USING btree (post_id);

CREATE INDEX idx_support_actions_user_id ON public.support_actions USING btree (user_id);

CREATE INDEX idx_trust_domains_user_id ON public.trust_domains USING btree (user_id);

CREATE INDEX idx_trust_score_history_user_id ON public.trust_score_history USING btree (user_id);

CREATE INDEX idx_trust_score_history_verification_id ON public.trust_score_history USING btree (verification_id);

CREATE INDEX idx_tutorial_preferences_user_id ON public.tutorial_preferences USING btree (user_id);

CREATE INDEX idx_typing_indicators_user_partner ON public.typing_indicators USING btree (user_id, conversation_partner_id);

CREATE UNIQUE INDEX idx_unique_active_helper_application ON public.safe_space_helper_applications USING btree (user_id) WHERE (application_status <> ALL (ARRAY['rejected'::text, 'withdrawn'::text]));

CREATE INDEX idx_url_previews_expires_at ON public.url_previews USING btree (expires_at);

CREATE INDEX idx_url_previews_url ON public.url_previews USING btree (url);

CREATE INDEX idx_user_ach_user ON public.user_achievements USING btree (user_id);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements USING btree (user_id);

CREATE INDEX idx_user_act_user ON public.user_activities USING btree (user_id);

CREATE INDEX idx_user_activities_created_at ON public.user_activities USING btree (created_at DESC);

CREATE INDEX idx_user_activities_user_id ON public.user_activities USING btree (user_id);

CREATE INDEX idx_user_activities_user_id_created_at ON public.user_activities USING btree (user_id, created_at);

CREATE INDEX idx_user_badge_user ON public.user_badges USING btree (user_id);

CREATE INDEX idx_user_badges_badge_id ON public.user_badges USING btree (badge_id);

CREATE INDEX idx_user_blocks_blocked_id ON public.user_blocks USING btree (blocked_id);

CREATE INDEX idx_user_blocks_blocker_id ON public.user_blocks USING btree (blocker_id);

CREATE INDEX idx_user_challenge_progress_challenge_id ON public.user_challenge_progress USING btree (challenge_id);

CREATE INDEX idx_user_interaction_scores_target_post_id ON public.user_interaction_scores USING btree (target_post_id);

CREATE INDEX idx_user_interaction_scores_target_user_id ON public.user_interaction_scores USING btree (target_user_id);

CREATE INDEX idx_user_pref_user ON public.user_preferences USING btree (user_id);

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences USING btree (user_id);

CREATE INDEX idx_user_priv_user ON public.user_privacy_settings USING btree (user_id);

CREATE INDEX idx_user_privacy_settings_user_id ON public.user_privacy_settings USING btree (user_id);

CREATE INDEX idx_user_tutorial_progress_tutorial_type ON public.user_tutorial_progress USING btree (tutorial_type);

CREATE INDEX idx_user_tutorial_progress_user_id ON public.user_tutorial_progress USING btree (user_id);

CREATE INDEX idx_user_verifications_face_match_score ON public.user_verifications USING btree (face_match_score) WHERE (face_match_score IS NOT NULL);

CREATE INDEX idx_user_verifications_status_created ON public.user_verifications USING btree (status, created_at DESC);

CREATE INDEX idx_user_verifications_user_id ON public.user_verifications USING btree (user_id);

CREATE INDEX idx_user_verifications_user_id_status ON public.user_verifications USING btree (user_id, status);

CREATE INDEX idx_user_verifications_verified_by ON public.user_verifications USING btree (verified_by);

CREATE INDEX idx_verification_document_audit_accessed_by ON public.verification_document_audit USING btree (accessed_by);

CREATE INDEX idx_verification_document_audit_document_id ON public.verification_document_audit USING btree (document_id);

CREATE INDEX idx_verification_documents_user_id ON public.verification_documents USING btree (user_id);

CREATE INDEX idx_verification_documents_verification_id ON public.verification_documents USING btree (verification_id);

CREATE INDEX idx_volunteer_applications_opportunity_id ON public.volunteer_applications USING btree (opportunity_id);

CREATE INDEX idx_volunteer_applications_user_id ON public.volunteer_applications USING btree (user_id);

CREATE INDEX idx_volunteer_interests_post_id ON public.volunteer_interests USING btree (post_id);

CREATE INDEX idx_volunteer_interests_status ON public.volunteer_interests USING btree (status);

CREATE INDEX idx_volunteer_interests_volunteer_id ON public.volunteer_interests USING btree (volunteer_id);

CREATE INDEX idx_volunteer_notifications_recipient ON public.volunteer_work_notifications USING btree (recipient_id, is_read, created_at DESC);

CREATE INDEX idx_volunteer_opportunities_created_by ON public.volunteer_opportunities USING btree (created_by);

CREATE INDEX idx_volunteer_opportunities_org_id ON public.volunteer_opportunities USING btree (organization_id);

CREATE INDEX idx_volunteer_work_notifications_activity_id ON public.volunteer_work_notifications USING btree (activity_id);

CREATE INDEX idx_volunteer_work_notifications_volunteer_id ON public.volunteer_work_notifications USING btree (volunteer_id);

CREATE UNIQUE INDEX post_interactions_unique_non_comment ON public.post_interactions USING btree (post_id, user_id, interaction_type) WHERE (interaction_type = ANY (ARRAY['like'::text, 'bookmark'::text, 'share'::text]));