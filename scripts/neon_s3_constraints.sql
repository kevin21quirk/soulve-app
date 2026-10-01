ALTER TABLE ONLY public.admin_action_log
    ADD CONSTRAINT admin_action_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_user_id_role_key UNIQUE (user_id, role);

ALTER TABLE ONLY public.advertising_bookings
    ADD CONSTRAINT advertising_bookings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ai_endpoint_rate_limits
    ADD CONSTRAINT ai_endpoint_rate_limits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ai_endpoint_rate_limits
    ADD CONSTRAINT ai_endpoint_rate_limits_user_id_endpoint_name_window_start_key UNIQUE (user_id, endpoint_name, window_start);

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_user_id_badge_id_key UNIQUE (user_id, badge_id);

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_name_key UNIQUE (name);

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.business_partnerships
    ADD CONSTRAINT business_partnerships_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.business_products
    ADD CONSTRAINT business_products_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_analytics
    ADD CONSTRAINT campaign_analytics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_detailed_analytics
    ADD CONSTRAINT campaign_detailed_analytics_campaign_id_date_key UNIQUE (campaign_id, date);

ALTER TABLE ONLY public.campaign_detailed_analytics
    ADD CONSTRAINT campaign_detailed_analytics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_donations
    ADD CONSTRAINT campaign_donations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_engagement
    ADD CONSTRAINT campaign_engagement_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_geographic_impact
    ADD CONSTRAINT campaign_geographic_impact_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_participants
    ADD CONSTRAINT campaign_participants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_predictions
    ADD CONSTRAINT campaign_predictions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_promotions
    ADD CONSTRAINT campaign_promotions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_social_metrics
    ADD CONSTRAINT campaign_social_metrics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_sponsorships
    ADD CONSTRAINT campaign_sponsorships_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT campaign_updates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.carbon_footprint_data
    ADD CONSTRAINT carbon_footprint_data_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_comment_id_user_id_key UNIQUE (comment_id, user_id);

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_requester_id_addressee_id_key UNIQUE (requester_id, addressee_id);

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.content_appeals
    ADD CONSTRAINT content_appeals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.content_translations
    ADD CONSTRAINT content_translations_content_id_content_type_target_languag_key UNIQUE (content_id, content_type, target_language);

ALTER TABLE ONLY public.content_translations
    ADD CONSTRAINT content_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_user_id_key UNIQUE (conversation_id, user_id);

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.corporate_partnerships
    ADD CONSTRAINT corporate_partnerships_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.csr_initiatives
    ADD CONSTRAINT csr_initiatives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.csr_opportunities
    ADD CONSTRAINT csr_opportunities_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.demo_request_activity_log
    ADD CONSTRAINT demo_request_activity_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.donors
    ADD CONSTRAINT donors_organization_id_email_key UNIQUE (organization_id, email);

ALTER TABLE ONLY public.donors
    ADD CONSTRAINT donors_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.employee_engagement
    ADD CONSTRAINT employee_engagement_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_announcements
    ADD CONSTRAINT esg_announcements_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_benchmarks
    ADD CONSTRAINT esg_benchmarks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_data_entries
    ADD CONSTRAINT esg_data_entries_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_frameworks
    ADD CONSTRAINT esg_frameworks_code_key UNIQUE (code);

ALTER TABLE ONLY public.esg_frameworks
    ADD CONSTRAINT esg_frameworks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_goals
    ADD CONSTRAINT esg_goals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_indicators
    ADD CONSTRAINT esg_indicators_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_initiative_templates
    ADD CONSTRAINT esg_initiative_templates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_recommendations
    ADD CONSTRAINT esg_recommendations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_report_versions
    ADD CONSTRAINT esg_report_versions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_reports
    ADD CONSTRAINT esg_reports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_risks
    ADD CONSTRAINT esg_risks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.esg_verification_audit_log
    ADD CONSTRAINT esg_verification_audit_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fraud_detection_log
    ADD CONSTRAINT fraud_detection_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.grants
    ADD CONSTRAINT grants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_group_id_user_id_key UNIQUE (group_id, user_id);

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.help_completion_requests
    ADD CONSTRAINT help_completion_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.impact_goals
    ADD CONSTRAINT impact_goals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.impact_metrics
    ADD CONSTRAINT impact_metrics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.impact_metrics
    ADD CONSTRAINT impact_metrics_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.language_detection_cache
    ADD CONSTRAINT language_detection_cache_pkey PRIMARY KEY (content_hash);

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_organization_id_assessment_year_ind_key UNIQUE (organization_id, assessment_year, indicator_id);

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.message_access_log
    ADD CONSTRAINT message_access_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_email_key UNIQUE (email);

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.notification_analytics
    ADD CONSTRAINT notification_analytics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.notification_delivery_log
    ADD CONSTRAINT notification_delivery_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.notification_filters
    ADD CONSTRAINT notification_filters_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_activities
    ADD CONSTRAINT organization_activities_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_organization_id_indicator_id_reportin_key UNIQUE (organization_id, indicator_id, reporting_period);

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_organization_id_follower_id_key UNIQUE (organization_id, follower_id);

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_impact_metrics
    ADD CONSTRAINT organization_impact_metrics_organization_id_key UNIQUE (organization_id);

ALTER TABLE ONLY public.organization_impact_metrics
    ADD CONSTRAINT organization_impact_metrics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_invitations
    ADD CONSTRAINT organization_invitations_organization_id_email_key UNIQUE (organization_id, email);

ALTER TABLE ONLY public.organization_invitations
    ADD CONSTRAINT organization_invitations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_user_id_role_key UNIQUE (organization_id, user_id, role);

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_preferences
    ADD CONSTRAINT organization_preferences_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_organization_id_reviewer_id_key UNIQUE (organization_id, reviewer_id);

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_organization_id_key UNIQUE (organization_id);

ALTER TABLE ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_team_members
    ADD CONSTRAINT organization_team_members_organization_id_user_id_key UNIQUE (organization_id, user_id);

ALTER TABLE ONLY public.organization_team_members
    ADD CONSTRAINT organization_team_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_trust_scores
    ADD CONSTRAINT organization_trust_scores_organization_id_calculated_at_key UNIQUE (organization_id, calculated_at);

ALTER TABLE ONLY public.organization_trust_scores
    ADD CONSTRAINT organization_trust_scores_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organization_verifications
    ADD CONSTRAINT organization_verifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.partnership_enquiries
    ADD CONSTRAINT partnership_enquiries_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_references
    ADD CONSTRAINT payment_references_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_references
    ADD CONSTRAINT payment_references_reference_code_key UNIQUE (reference_code);

ALTER TABLE ONLY public.platform_feedback
    ADD CONSTRAINT platform_feedback_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_payment_reference_key UNIQUE (payment_reference);

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.point_decay_log
    ADD CONSTRAINT point_decay_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.point_redemptions
    ADD CONSTRAINT point_redemptions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.points_configuration
    ADD CONSTRAINT points_configuration_config_key_key UNIQUE (config_key);

ALTER TABLE ONLY public.points_configuration
    ADD CONSTRAINT points_configuration_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.post_reactions
    ADD CONSTRAINT post_reactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.post_reactions
    ADD CONSTRAINT post_reactions_post_id_user_id_reaction_type_key UNIQUE (post_id, user_id, reaction_type);

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.questionnaire_responses
    ADD CONSTRAINT questionnaire_responses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.questionnaire_responses
    ADD CONSTRAINT questionnaire_responses_user_id_unique UNIQUE (user_id);

ALTER TABLE ONLY public.rate_limit_buckets
    ADD CONSTRAINT rate_limit_buckets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.rate_limit_buckets
    ADD CONSTRAINT rate_limit_buckets_user_id_bucket_type_key UNIQUE (user_id, bucket_type);

ALTER TABLE ONLY public.recommendation_cache
    ADD CONSTRAINT recommendation_cache_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.recommendation_cache
    ADD CONSTRAINT recommendation_cache_user_id_recommendation_type_target_id_key UNIQUE (user_id, recommendation_type, target_id);

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.relive_stories
    ADD CONSTRAINT relive_stories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.relive_stories
    ADD CONSTRAINT relive_stories_post_id_key UNIQUE (post_id);

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_audit_log
    ADD CONSTRAINT safe_space_audit_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_flagged_keywords
    ADD CONSTRAINT safe_space_flagged_keywords_keyword_key UNIQUE (keyword);

ALTER TABLE ONLY public.safe_space_flagged_keywords
    ADD CONSTRAINT safe_space_flagged_keywords_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_helper_applications
    ADD CONSTRAINT safe_space_helper_applications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_user_id_module_id_key UNIQUE (user_id, module_id);

ALTER TABLE ONLY public.safe_space_helpers
    ADD CONSTRAINT safe_space_helpers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_messages
    ADD CONSTRAINT safe_space_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_queue
    ADD CONSTRAINT safe_space_queue_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_reference_checks
    ADD CONSTRAINT safe_space_reference_checks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_reference_checks
    ADD CONSTRAINT safe_space_reference_checks_verification_token_key UNIQUE (verification_token);

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_session_token_key UNIQUE (session_token);

ALTER TABLE ONLY public.safe_space_training_modules
    ADD CONSTRAINT safe_space_training_modules_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_unique_lead_per_user UNIQUE (user_id, role);

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_user_id_role_key UNIQUE (user_id, role);

ALTER TABLE ONLY public.scheduled_notifications
    ADD CONSTRAINT scheduled_notifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.seasonal_challenges
    ADD CONSTRAINT seasonal_challenges_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.security_audit_log
    ADD CONSTRAINT security_audit_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.skill_categories
    ADD CONSTRAINT skill_categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stakeholder_engagement_metrics
    ADD CONSTRAINT stakeholder_engagement_metrics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stakeholder_groups
    ADD CONSTRAINT stakeholder_groups_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_post_id_user_id_key UNIQUE (post_id, user_id);

ALTER TABLE ONLY public.story_updates
    ADD CONSTRAINT story_updates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.subscription_admin_actions
    ADD CONSTRAINT subscription_admin_actions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.support_actions
    ADD CONSTRAINT support_actions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.trust_domains
    ADD CONSTRAINT trust_domains_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.trust_domains
    ADD CONSTRAINT trust_domains_user_id_domain_key UNIQUE (user_id, domain);

ALTER TABLE ONLY public.trust_score_history
    ADD CONSTRAINT trust_score_history_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tutorial_preferences
    ADD CONSTRAINT tutorial_preferences_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tutorial_preferences
    ADD CONSTRAINT tutorial_preferences_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.typing_indicators
    ADD CONSTRAINT typing_indicators_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.typing_indicators
    ADD CONSTRAINT typing_indicators_user_id_conversation_partner_id_key UNIQUE (user_id, conversation_partner_id);

ALTER TABLE ONLY public.url_previews
    ADD CONSTRAINT url_previews_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.url_previews
    ADD CONSTRAINT url_previews_url_key UNIQUE (url);

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_badge_id_key UNIQUE (user_id, badge_id);

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocker_id_blocked_id_key UNIQUE (blocker_id, blocked_id);

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT user_challenge_progress_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT user_challenge_progress_user_id_challenge_id_key UNIQUE (user_id, challenge_id);

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_user_id_target_user_id_target_post__key UNIQUE (user_id, target_user_id, target_post_id, interaction_type);

ALTER TABLE ONLY public.user_language_preferences
    ADD CONSTRAINT user_language_preferences_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_language_preferences
    ADD CONSTRAINT user_language_preferences_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_preference_type_preference_value_key UNIQUE (user_id, preference_type, preference_value);

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_tutorial_progress
    ADD CONSTRAINT user_tutorial_progress_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.verification_document_audit
    ADD CONSTRAINT verification_document_audit_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteer_applications
    ADD CONSTRAINT volunteer_applications_opportunity_id_user_id_key UNIQUE (opportunity_id, user_id);

ALTER TABLE ONLY public.volunteer_applications
    ADD CONSTRAINT volunteer_applications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_post_id_volunteer_id_key UNIQUE (post_id, volunteer_id);

ALTER TABLE ONLY public.volunteer_opportunities
    ADD CONSTRAINT volunteer_opportunities_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.white_label_purchases
    ADD CONSTRAINT white_label_purchases_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.admin_action_log
    ADD CONSTRAINT admin_action_log_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.admin_action_log
    ADD CONSTRAINT admin_action_log_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.advertising_bookings
    ADD CONSTRAINT advertising_bookings_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.advertising_bookings
    ADD CONSTRAINT advertising_bookings_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.platform_payments(id);

ALTER TABLE ONLY public.ai_endpoint_rate_limits
    ADD CONSTRAINT ai_endpoint_rate_limits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_awarded_by_fkey FOREIGN KEY (awarded_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_revoked_by_fkey FOREIGN KEY (revoked_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.badge_award_log
    ADD CONSTRAINT badge_award_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_categories(id);

ALTER TABLE ONLY public.business_partnerships
    ADD CONSTRAINT business_partnerships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.business_products
    ADD CONSTRAINT business_products_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_analytics
    ADD CONSTRAINT campaign_analytics_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_donations
    ADD CONSTRAINT campaign_donations_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_donations
    ADD CONSTRAINT campaign_donations_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_engagement
    ADD CONSTRAINT campaign_engagement_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_engagement
    ADD CONSTRAINT campaign_engagement_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_geographic_impact
    ADD CONSTRAINT campaign_geographic_impact_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.campaign_interactions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_interactions
    ADD CONSTRAINT campaign_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_invitee_id_fkey FOREIGN KEY (invitee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_invitations
    ADD CONSTRAINT campaign_invitations_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_participants
    ADD CONSTRAINT campaign_participants_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_participants
    ADD CONSTRAINT campaign_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_predictions
    ADD CONSTRAINT campaign_predictions_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_promotions
    ADD CONSTRAINT campaign_promotions_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_social_metrics
    ADD CONSTRAINT campaign_social_metrics_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_sponsorships
    ADD CONSTRAINT campaign_sponsorships_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_sponsorships
    ADD CONSTRAINT campaign_sponsorships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT campaign_updates_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT campaign_updates_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_exclusive_badge_id_fkey FOREIGN KEY (exclusive_badge_id) REFERENCES public.badges(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.carbon_footprint_data
    ADD CONSTRAINT carbon_footprint_data_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.carbon_footprint_data
    ADD CONSTRAINT carbon_footprint_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.post_interactions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.content_appeals
    ADD CONSTRAINT content_appeals_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id);

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_content_owner_id_fkey FOREIGN KEY (content_owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.csr_initiatives
    ADD CONSTRAINT csr_initiatives_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.csr_lead_tracking
    ADD CONSTRAINT csr_lead_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.csr_opportunities
    ADD CONSTRAINT csr_opportunities_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.csr_opportunities
    ADD CONSTRAINT csr_opportunities_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.demo_request_activity_log
    ADD CONSTRAINT demo_request_activity_log_demo_request_id_fkey FOREIGN KEY (demo_request_id) REFERENCES public.demo_requests(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.employee_engagement
    ADD CONSTRAINT employee_engagement_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.esg_announcements
    ADD CONSTRAINT esg_announcements_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.esg_compliance_reports
    ADD CONSTRAINT esg_compliance_reports_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.esg_initiatives(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.esg_data_requests
    ADD CONSTRAINT esg_data_requests_requested_from_org_id_fkey FOREIGN KEY (requested_from_org_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.esg_indicators
    ADD CONSTRAINT esg_indicators_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);

ALTER TABLE ONLY public.esg_initiative_templates
    ADD CONSTRAINT esg_initiative_templates_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.esg_frameworks(id);

ALTER TABLE ONLY public.esg_initiatives
    ADD CONSTRAINT esg_initiatives_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.esg_report_versions
    ADD CONSTRAINT esg_report_versions_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.esg_reports(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.esg_reports
    ADD CONSTRAINT esg_reports_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.esg_initiatives(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.esg_reports
    ADD CONSTRAINT esg_reports_previous_version_id_fkey FOREIGN KEY (previous_version_id) REFERENCES public.esg_reports(id);

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);

ALTER TABLE ONLY public.esg_targets
    ADD CONSTRAINT esg_targets_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.esg_verification_audit_log
    ADD CONSTRAINT esg_verification_audit_log_contribution_id_fkey FOREIGN KEY (contribution_id) REFERENCES public.stakeholder_data_contributions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.esg_verification_audit_log
    ADD CONSTRAINT esg_verification_audit_log_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.impact_activities(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.evidence_submissions
    ADD CONSTRAINT evidence_submissions_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.fraud_detection_log
    ADD CONSTRAINT fraud_detection_log_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.fraud_detection_log
    ADD CONSTRAINT fraud_detection_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.help_completion_requests
    ADD CONSTRAINT help_completion_requests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);

ALTER TABLE ONLY public.impact_activities
    ADD CONSTRAINT impact_activities_skill_category_id_fkey FOREIGN KEY (skill_category_id) REFERENCES public.skill_categories(id);

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);

ALTER TABLE ONLY public.materiality_assessments
    ADD CONSTRAINT materiality_assessments_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.notification_analytics
    ADD CONSTRAINT notification_analytics_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.notification_delivery_log
    ADD CONSTRAINT notification_delivery_log_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_grouped_with_fkey FOREIGN KEY (grouped_with) REFERENCES public.notifications(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_activities
    ADD CONSTRAINT organization_activities_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_collected_by_fkey FOREIGN KEY (collected_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.esg_indicators(id);

ALTER TABLE ONLY public.organization_esg_data
    ADD CONSTRAINT organization_esg_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_followers
    ADD CONSTRAINT organization_followers_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_impact_metrics
    ADD CONSTRAINT organization_impact_metrics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.organization_preferences
    ADD CONSTRAINT organization_preferences_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_reviews
    ADD CONSTRAINT organization_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_trust_scores
    ADD CONSTRAINT organization_trust_scores_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_verifications
    ADD CONSTRAINT organization_verifications_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.organization_verifications
    ADD CONSTRAINT organization_verifications_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.payment_references
    ADD CONSTRAINT payment_references_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.platform_payments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.platform_feedback
    ADD CONSTRAINT platform_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.platform_payments
    ADD CONSTRAINT platform_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.point_decay_log
    ADD CONSTRAINT point_decay_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.points_configuration
    ADD CONSTRAINT points_configuration_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.post_interactions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.post_interactions
    ADD CONSTRAINT post_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.post_reactions
    ADD CONSTRAINT post_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_founding_member_granted_by_fkey FOREIGN KEY (founding_member_granted_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_waitlist_approved_by_fkey FOREIGN KEY (waitlist_approved_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.questionnaire_responses
    ADD CONSTRAINT questionnaire_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.recommendation_cache
    ADD CONSTRAINT recommendation_cache_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_flagged_by_fkey FOREIGN KEY (flagged_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.red_flags
    ADD CONSTRAINT red_flags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.relive_stories
    ADD CONSTRAINT relive_stories_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reported_post_id_fkey FOREIGN KEY (reported_post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reported_user_id_fkey FOREIGN KEY (reported_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.safe_space_audit_log
    ADD CONSTRAINT safe_space_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.safe_space_messages(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.safe_space_emergency_alerts
    ADD CONSTRAINT safe_space_emergency_alerts_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.safe_space_sessions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_flagged_keywords
    ADD CONSTRAINT safe_space_flagged_keywords_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.safe_space_helper_applications
    ADD CONSTRAINT safe_space_helper_applications_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.safe_space_helper_applications
    ADD CONSTRAINT safe_space_helper_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.safe_space_training_modules(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_helper_training_progress
    ADD CONSTRAINT safe_space_helper_training_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_helpers
    ADD CONSTRAINT safe_space_helpers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_messages
    ADD CONSTRAINT safe_space_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.safe_space_sessions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_queue
    ADD CONSTRAINT safe_space_queue_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_reference_checks
    ADD CONSTRAINT safe_space_reference_checks_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.safe_space_helper_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_paused_by_fkey FOREIGN KEY (paused_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.safe_space_sessions
    ADD CONSTRAINT safe_space_sessions_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.safe_space_helper_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.safe_space_verification_documents
    ADD CONSTRAINT safe_space_verification_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.safeguarding_roles
    ADD CONSTRAINT safeguarding_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.scheduled_notifications
    ADD CONSTRAINT scheduled_notifications_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.notification_templates(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.security_audit_log
    ADD CONSTRAINT security_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_contributor_org_id_fkey FOREIGN KEY (contributor_org_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_data_request_id_fkey FOREIGN KEY (data_request_id) REFERENCES public.esg_data_requests(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_esg_data_id_fkey FOREIGN KEY (esg_data_id) REFERENCES public.organization_esg_data(id);

ALTER TABLE ONLY public.stakeholder_data_contributions
    ADD CONSTRAINT stakeholder_data_contributions_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.stakeholder_engagement_metrics
    ADD CONSTRAINT stakeholder_engagement_metrics_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.stakeholder_engagement_metrics
    ADD CONSTRAINT stakeholder_engagement_metrics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.story_participants
    ADD CONSTRAINT story_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.story_updates
    ADD CONSTRAINT story_updates_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.story_updates
    ADD CONSTRAINT story_updates_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.subscription_admin_actions
    ADD CONSTRAINT subscription_admin_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.subscription_admin_actions
    ADD CONSTRAINT subscription_admin_actions_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.support_actions
    ADD CONSTRAINT support_actions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.support_actions
    ADD CONSTRAINT support_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.trust_domains
    ADD CONSTRAINT trust_domains_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.trust_score_history
    ADD CONSTRAINT trust_score_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.trust_score_history
    ADD CONSTRAINT trust_score_history_verification_id_fkey FOREIGN KEY (verification_id) REFERENCES public.user_verifications(id);

ALTER TABLE ONLY public.tutorial_preferences
    ADD CONSTRAINT tutorial_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocked_id_fkey FOREIGN KEY (blocked_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocker_id_fkey FOREIGN KEY (blocker_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT user_challenge_progress_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.seasonal_challenges(id);

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_target_post_id_fkey FOREIGN KEY (target_post_id) REFERENCES public.posts(id);

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.user_interaction_scores
    ADD CONSTRAINT user_interaction_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.user_language_preferences
    ADD CONSTRAINT user_language_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_typing_to_user_id_fkey FOREIGN KEY (typing_to_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_tutorial_progress
    ADD CONSTRAINT user_tutorial_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.verification_document_audit
    ADD CONSTRAINT verification_document_audit_accessed_by_fkey FOREIGN KEY (accessed_by) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.verification_document_audit
    ADD CONSTRAINT verification_document_audit_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.verification_documents(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_verification_id_fkey FOREIGN KEY (verification_id) REFERENCES public.user_verifications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.volunteer_interests
    ADD CONSTRAINT volunteer_interests_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.impact_activities(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.volunteer_work_notifications
    ADD CONSTRAINT volunteer_work_notifications_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.profiles(id);

ALTER TABLE ONLY public.white_label_purchases
    ADD CONSTRAINT white_label_purchases_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.white_label_purchases
    ADD CONSTRAINT white_label_purchases_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.platform_payments(id);