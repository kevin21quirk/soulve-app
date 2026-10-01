CREATE TABLE public.admin_action_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    action_type text NOT NULL,
    target_user_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.admin_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    granted_by uuid,
    granted_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.advertising_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organisation_id uuid,
    payment_id uuid,
    ad_type text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    content jsonb DEFAULT '{}'::jsonb,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ai_endpoint_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    endpoint_name text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.badge_award_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    badge_id uuid NOT NULL,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL,
    awarded_by uuid,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    evidence_submitted jsonb DEFAULT '{}'::jsonb,
    contribution_details jsonb DEFAULT '{}'::jsonb,
    campaign_id uuid,
    activity_ids uuid[],
    revoked_at timestamp with time zone,
    revoked_by uuid,
    revocation_reason text,
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT badge_award_log_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'auto_verified'::text])))
);

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    color text NOT NULL,
    requirement_type text NOT NULL,
    requirement_value integer NOT NULL,
    rarity text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    campaign_id uuid,
    event_identifier text,
    availability_window_start timestamp with time zone,
    availability_window_end timestamp with time zone,
    limited_edition boolean DEFAULT false,
    max_awards integer,
    current_award_count integer DEFAULT 0,
    verification_required boolean DEFAULT false,
    evidence_requirements jsonb DEFAULT '{}'::jsonb,
    cooldown_hours integer,
    max_per_user integer DEFAULT 1,
    badge_category text DEFAULT 'achievement'::text,
    CONSTRAINT badges_badge_category_check CHECK ((badge_category = ANY (ARRAY['achievement'::text, 'campaign'::text, 'event'::text, 'milestone'::text, 'recognition'::text]))),
    CONSTRAINT badges_rarity_check CHECK ((rarity = ANY (ARRAY['common'::text, 'rare'::text, 'epic'::text, 'legendary'::text])))
);

CREATE TABLE public.blog_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    author_id uuid,
    category_id uuid,
    featured_image text,
    tags text[],
    meta_description text,
    meta_keywords text[],
    read_time integer,
    published_at timestamp with time zone,
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.business_partnerships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    partner_name text NOT NULL,
    partnership_type text DEFAULT 'strategic'::text NOT NULL,
    description text,
    status text DEFAULT 'active'::text NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    value numeric,
    contact_person text,
    contact_email text,
    objectives text[] DEFAULT '{}'::text[],
    deliverables text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.business_products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    category text DEFAULT 'product'::text NOT NULL,
    price_range text,
    target_audience text,
    launch_date timestamp with time zone,
    status text DEFAULT 'active'::text NOT NULL,
    features text[] DEFAULT '{}'::text[],
    images text[] DEFAULT '{}'::text[],
    social_impact_statement text,
    website_url text,
    contact_email text,
    contact_phone text,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.campaign_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    total_views integer DEFAULT 0,
    unique_views integer DEFAULT 0,
    total_donations integer DEFAULT 0,
    donation_amount numeric DEFAULT 0,
    social_shares integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    conversion_rate numeric DEFAULT 0,
    bounce_rate numeric DEFAULT 0,
    avg_time_on_page integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.campaign_detailed_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    date date NOT NULL,
    views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    shares integer DEFAULT 0,
    donations_count integer DEFAULT 0,
    donations_amount numeric DEFAULT 0,
    new_donors integer DEFAULT 0,
    returning_donors integer DEFAULT 0,
    conversion_rate numeric DEFAULT 0,
    average_donation numeric DEFAULT 0,
    traffic_sources jsonb DEFAULT '{}'::jsonb,
    demographics jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.campaign_donations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    donor_id uuid,
    amount numeric NOT NULL,
    currency text DEFAULT 'USD'::text,
    donation_type text DEFAULT 'one_time'::text,
    source text,
    referrer_url text,
    device_type text,
    location_country text,
    location_city text,
    payment_processor text DEFAULT 'worldpay'::text,
    payment_status text DEFAULT 'pending'::text,
    is_anonymous boolean DEFAULT false,
    donor_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_donations_donation_type_check CHECK ((donation_type = ANY (ARRAY['one_time'::text, 'recurring'::text, 'anonymous'::text]))),
    CONSTRAINT campaign_donations_payment_status_check CHECK ((payment_status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])))
);

CREATE TABLE public.campaign_engagement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid,
    action_type text NOT NULL,
    session_id text,
    ip_address inet,
    user_agent text,
    referrer_url text,
    time_spent integer,
    device_type text,
    location_country text,
    location_city text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_engagement_action_type_check CHECK ((action_type = ANY (ARRAY['view'::text, 'share'::text, 'like'::text, 'comment'::text, 'bookmark'::text, 'report'::text])))
);

CREATE TABLE public.campaign_geographic_impact (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    country_code text NOT NULL,
    country_name text NOT NULL,
    city text,
    region text,
    total_donations numeric DEFAULT 0,
    donor_count integer DEFAULT 0,
    total_views integer DEFAULT 0,
    total_shares integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.campaign_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid NOT NULL,
    interaction_type text NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_id uuid,
    is_deleted boolean DEFAULT false,
    organization_id uuid
);

CREATE TABLE public.campaign_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    inviter_id uuid NOT NULL,
    invitee_email text NOT NULL,
    invitee_id uuid,
    invitation_type text NOT NULL,
    message text,
    status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    responded_at timestamp with time zone,
    CONSTRAINT campaign_invitations_invitation_type_check CHECK ((invitation_type = ANY (ARRAY['participant'::text, 'organizer'::text, 'supporter'::text]))),
    CONSTRAINT campaign_invitations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'expired'::text])))
);

CREATE TABLE public.campaign_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid,
    participant_type text NOT NULL,
    role text DEFAULT 'member'::text,
    contribution_amount numeric(10,2),
    contribution_type text,
    message text,
    is_anonymous boolean DEFAULT false,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_participants_contribution_type_check CHECK ((contribution_type = ANY (ARRAY['monetary'::text, 'time'::text, 'skill'::text, 'resource'::text]))),
    CONSTRAINT campaign_participants_participant_type_check CHECK ((participant_type = ANY (ARRAY['supporter'::text, 'volunteer'::text, 'organizer'::text, 'donor'::text]))),
    CONSTRAINT campaign_participants_role_check CHECK ((role = ANY (ARRAY['member'::text, 'moderator'::text, 'admin'::text])))
);

CREATE TABLE public.campaign_predictions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    prediction_type text NOT NULL,
    predicted_value numeric,
    confidence_score numeric,
    prediction_date date DEFAULT CURRENT_DATE NOT NULL,
    actual_value numeric,
    model_version text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_predictions_confidence_score_check CHECK (((confidence_score >= (0)::numeric) AND (confidence_score <= (1)::numeric))),
    CONSTRAINT campaign_predictions_prediction_type_check CHECK ((prediction_type = ANY (ARRAY['goal_completion'::text, 'daily_donations'::text, 'viral_potential'::text, 'optimal_timing'::text])))
);

CREATE TABLE public.campaign_promotions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    promotion_type text NOT NULL,
    budget_spent numeric(10,2) DEFAULT 0,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    conversions integer DEFAULT 0,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_promotions_promotion_type_check CHECK ((promotion_type = ANY (ARRAY['featured'::text, 'boosted'::text, 'sponsored'::text])))
);

CREATE TABLE public.campaign_social_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    platform text NOT NULL,
    metric_type text NOT NULL,
    value integer DEFAULT 0,
    date date DEFAULT CURRENT_DATE NOT NULL,
    external_post_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_social_metrics_metric_type_check CHECK ((metric_type = ANY (ARRAY['share'::text, 'like'::text, 'comment'::text, 'mention'::text, 'reach'::text, 'impression'::text]))),
    CONSTRAINT campaign_social_metrics_platform_check CHECK ((platform = ANY (ARRAY['facebook'::text, 'twitter'::text, 'instagram'::text, 'linkedin'::text, 'whatsapp'::text, 'email'::text])))
);

CREATE TABLE public.campaign_sponsorships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    sponsorship_tier text NOT NULL,
    amount_pledged numeric DEFAULT 0 NOT NULL,
    amount_paid numeric DEFAULT 0 NOT NULL,
    benefits text[] DEFAULT '{}'::text[],
    visibility_type text[] DEFAULT '{}'::text[],
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    activated_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_sponsorships_sponsorship_tier_check CHECK ((sponsorship_tier = ANY (ARRAY['bronze'::text, 'silver'::text, 'gold'::text, 'platinum'::text]))),
    CONSTRAINT campaign_sponsorships_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'completed'::text, 'cancelled'::text])))
);

CREATE TABLE public.campaign_updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    author_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    update_type text NOT NULL,
    media_attachments jsonb DEFAULT '[]'::jsonb,
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT campaign_updates_update_type_check CHECK ((update_type = ANY (ARRAY['general'::text, 'milestone'::text, 'thank_you'::text, 'urgent'::text])))
);

CREATE TABLE public.campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    creator_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    story text,
    category text NOT NULL,
    organization_type text NOT NULL,
    goal_type text NOT NULL,
    goal_amount numeric(12,2),
    current_amount numeric(12,2) DEFAULT 0,
    currency text DEFAULT 'USD'::text,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone,
    location text,
    urgency text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    featured_image text,
    gallery_images jsonb DEFAULT '[]'::jsonb,
    tags text[] DEFAULT ARRAY[]::text[],
    visibility text DEFAULT 'public'::text NOT NULL,
    allow_anonymous_donations boolean DEFAULT true,
    enable_comments boolean DEFAULT true,
    enable_updates boolean DEFAULT true,
    social_links jsonb DEFAULT '{}'::jsonb,
    custom_fields jsonb DEFAULT '{}'::jsonb,
    promotion_budget numeric(10,2) DEFAULT 0,
    total_views integer DEFAULT 0,
    total_shares integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    organizer text,
    exclusive_badge_id uuid,
    badge_criteria jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT campaigns_category_check CHECK ((category = ANY (ARRAY['fundraising'::text, 'volunteer'::text, 'awareness'::text, 'community'::text, 'petition'::text]))),
    CONSTRAINT campaigns_goal_type_check CHECK ((goal_type = ANY (ARRAY['monetary'::text, 'volunteers'::text, 'signatures'::text, 'participants'::text]))),
    CONSTRAINT campaigns_organization_type_check CHECK ((organization_type = ANY (ARRAY['charity'::text, 'business'::text, 'social_group'::text, 'community_group'::text, 'individual'::text]))),
    CONSTRAINT campaigns_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'paused'::text, 'completed'::text, 'cancelled'::text]))),
    CONSTRAINT campaigns_urgency_check CHECK ((urgency = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT campaigns_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'private'::text, 'invite_only'::text])))
);

CREATE TABLE public.carbon_footprint_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    scope_type integer NOT NULL,
    emission_source text NOT NULL,
    activity_data numeric NOT NULL,
    activity_unit text NOT NULL,
    emission_factor numeric NOT NULL,
    co2_equivalent numeric NOT NULL,
    reporting_period date NOT NULL,
    verification_status text DEFAULT 'unverified'::text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.comment_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_id uuid NOT NULL,
    addressee_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT connections_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'blocked'::text])))
);

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    contact_type text DEFAULT 'general'::text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.content_appeals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid NOT NULL,
    user_id uuid NOT NULL,
    appeal_reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.content_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reported_by uuid NOT NULL,
    content_id uuid NOT NULL,
    content_type text NOT NULL,
    content_owner_id uuid,
    reason text NOT NULL,
    details text,
    status text DEFAULT 'pending'::text NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    resolution_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT content_reports_content_type_check CHECK ((content_type = ANY (ARRAY['post'::text, 'comment'::text, 'message'::text, 'profile'::text]))),
    CONSTRAINT content_reports_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'reviewing'::text, 'resolved'::text, 'dismissed'::text])))
);

CREATE TABLE public.content_translations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id text NOT NULL,
    content_type text NOT NULL,
    original_language text NOT NULL,
    target_language text NOT NULL,
    original_text text NOT NULL,
    translated_text text NOT NULL,
    translator text DEFAULT 'gemini-2.5-flash'::text,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + '30 days'::interval),
    CONSTRAINT content_translations_content_type_check CHECK ((content_type = ANY (ARRAY['post'::text, 'comment'::text])))
);

CREATE TABLE public.conversation_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    last_read_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_message_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.corporate_partnerships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    company_name text NOT NULL,
    contact_person text,
    contact_email text,
    contact_phone text,
    partnership_type text,
    status text DEFAULT 'prospect'::text,
    partnership_value numeric,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    renewal_date timestamp with time zone,
    benefits_offered text,
    requirements text,
    notes text,
    documents jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.csr_initiatives (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text DEFAULT 'community'::text NOT NULL,
    status text DEFAULT 'planning'::text NOT NULL,
    budget_allocated numeric,
    budget_spent numeric DEFAULT 0,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    target_beneficiaries integer,
    actual_beneficiaries integer DEFAULT 0,
    impact_metrics jsonb DEFAULT '{}'::jsonb,
    sdg_goals text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.csr_lead_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    post_id uuid,
    campaign_id uuid,
    action_type text NOT NULL,
    user_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT csr_lead_tracking_action_type_check CHECK ((action_type = ANY (ARRAY['view'::text, 'contact'::text, 'support'::text, 'sponsor'::text])))
);

CREATE TABLE public.csr_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    post_id uuid NOT NULL,
    status text DEFAULT 'interested'::text NOT NULL,
    notes text,
    estimated_value numeric,
    actual_value numeric,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT csr_opportunities_status_check CHECK ((status = ANY (ARRAY['interested'::text, 'contacted'::text, 'committed'::text, 'completed'::text, 'declined'::text])))
);

CREATE TABLE public.demo_request_activity_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    demo_request_id uuid NOT NULL,
    actor_id uuid,
    action_type text NOT NULL,
    old_value jsonb,
    new_value jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT demo_request_activity_log_action_type_check CHECK ((action_type = ANY (ARRAY['created'::text, 'status_changed'::text, 'assigned'::text, 'unassigned'::text, 'rescheduled'::text, 'notes_added'::text, 'contacted'::text])))
);

CREATE TABLE public.demo_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    company_name text,
    job_title text,
    phone_number text,
    organization_size text,
    preferred_date timestamp with time zone,
    preferred_time text,
    interest_areas text[] DEFAULT '{}'::text[],
    message text,
    status text DEFAULT 'pending'::text NOT NULL,
    priority text DEFAULT 'normal'::text,
    assigned_to uuid,
    scheduled_meeting_time timestamp with time zone,
    meeting_link text,
    meeting_duration_minutes integer DEFAULT 30,
    admin_notes text,
    follow_up_notes text,
    last_contacted_at timestamp with time zone,
    source text DEFAULT 'landing_page'::text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT demo_requests_organization_size_check CHECK ((organization_size = ANY (ARRAY['1-10'::text, '11-50'::text, '51-200'::text, '201-1000'::text, '1000+'::text]))),
    CONSTRAINT demo_requests_preferred_time_check CHECK ((preferred_time = ANY (ARRAY['morning'::text, 'afternoon'::text, 'evening'::text, 'flexible'::text]))),
    CONSTRAINT demo_requests_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT demo_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'scheduled'::text, 'completed'::text, 'cancelled'::text, 'no_show'::text]))),
    CONSTRAINT valid_email CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))
);

CREATE TABLE public.donors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    address jsonb,
    donor_type text DEFAULT 'individual'::text,
    preferred_contact_method text DEFAULT 'email'::text,
    communication_preferences jsonb DEFAULT '{}'::jsonb,
    total_donated numeric DEFAULT 0,
    donation_count integer DEFAULT 0,
    first_donation_date timestamp with time zone,
    last_donation_date timestamp with time zone,
    average_donation numeric DEFAULT 0,
    donor_status text DEFAULT 'active'::text,
    notes text,
    tags text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.employee_engagement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    hours_contributed integer DEFAULT 0 NOT NULL,
    impact_points integer DEFAULT 0 NOT NULL,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.esg_announcements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    announcement_type text,
    target_audience jsonb DEFAULT '["all"]'::jsonb,
    published_at timestamp with time zone DEFAULT now(),
    created_by uuid NOT NULL,
    view_count integer DEFAULT 0,
    engagement_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT esg_announcements_announcement_type_check CHECK ((announcement_type = ANY (ARRAY['update'::text, 'achievement'::text, 'target'::text, 'event'::text, 'data_request'::text])))
);

CREATE TABLE public.esg_benchmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    industry_sector text NOT NULL,
    indicator_id uuid NOT NULL,
    benchmark_type text NOT NULL,
    value numeric NOT NULL,
    unit text,
    data_source text,
    reporting_year integer NOT NULL,
    geographical_scope text,
    sample_size integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_benchmarks_benchmark_type_check CHECK ((benchmark_type = ANY (ARRAY['industry_average'::text, 'top_quartile'::text, 'best_practice'::text, 'regulatory_minimum'::text])))
);

CREATE TABLE public.esg_compliance_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    framework_id uuid,
    report_type text NOT NULL,
    reporting_period_start date NOT NULL,
    reporting_period_end date NOT NULL,
    status text DEFAULT 'draft'::text,
    generated_data jsonb DEFAULT '{}'::jsonb,
    report_url text,
    generated_by uuid,
    approved_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.esg_data_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    indicator_id uuid NOT NULL,
    reporting_period date NOT NULL,
    value numeric,
    text_value text,
    unit text,
    data_source text DEFAULT 'manual_entry'::text,
    verification_status text DEFAULT 'unverified'::text,
    supporting_documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_data_entries_verification_status_check CHECK ((verification_status = ANY (ARRAY['unverified'::text, 'internal'::text, 'third_party'::text])))
);

CREATE TABLE public.esg_data_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    requested_from_org_id uuid,
    requested_from_email text,
    indicator_id uuid,
    framework_id uuid,
    reporting_period date NOT NULL,
    due_date timestamp with time zone,
    priority text DEFAULT 'medium'::text,
    status text DEFAULT 'pending'::text,
    request_message text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    initiative_id uuid,
    CONSTRAINT esg_data_requests_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT esg_data_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'submitted'::text, 'approved'::text, 'rejected'::text])))
);

CREATE TABLE public.esg_frameworks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    version text,
    description text,
    official_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.esg_goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    indicator_id uuid,
    goal_name text NOT NULL,
    description text,
    target_value numeric,
    target_unit text,
    baseline_value numeric,
    baseline_year integer,
    target_year integer NOT NULL,
    current_value numeric DEFAULT 0,
    progress_percentage numeric DEFAULT 0,
    status text DEFAULT 'active'::text,
    priority_level text DEFAULT 'medium'::text,
    category text NOT NULL,
    milestones jsonb DEFAULT '[]'::jsonb,
    responsible_team text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_goals_category_check CHECK ((category = ANY (ARRAY['environmental'::text, 'social'::text, 'governance'::text]))),
    CONSTRAINT esg_goals_priority_level_check CHECK ((priority_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT esg_goals_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'paused'::text, 'cancelled'::text])))
);

CREATE TABLE public.esg_indicators (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    framework_id uuid,
    indicator_code text NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    subcategory text,
    unit_of_measurement text,
    calculation_method text,
    is_quantitative boolean DEFAULT true,
    reporting_frequency text DEFAULT 'annual'::text,
    materiality_level text DEFAULT 'medium'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.esg_initiative_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    framework_id uuid,
    category text NOT NULL,
    description text,
    required_indicators jsonb DEFAULT '[]'::jsonb,
    suggested_stakeholder_types jsonb DEFAULT '[]'::jsonb,
    typical_duration_days integer DEFAULT 90,
    milestone_templates jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.esg_initiatives (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    initiative_name text NOT NULL,
    initiative_type text DEFAULT 'report'::text NOT NULL,
    framework_id uuid,
    reporting_period_start date,
    reporting_period_end date,
    due_date timestamp with time zone,
    status text DEFAULT 'planning'::text NOT NULL,
    target_stakeholder_groups jsonb DEFAULT '[]'::jsonb,
    progress_percentage integer DEFAULT 0,
    description text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_initiatives_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);

CREATE TABLE public.esg_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    recommendation_type text NOT NULL,
    priority_score numeric DEFAULT 50,
    title text NOT NULL,
    description text NOT NULL,
    recommended_actions jsonb DEFAULT '[]'::jsonb,
    potential_impact text,
    implementation_effort text DEFAULT 'medium'::text,
    estimated_cost_range text,
    related_indicators jsonb DEFAULT '[]'::jsonb,
    data_sources jsonb DEFAULT '[]'::jsonb,
    confidence_score numeric DEFAULT 0.7,
    status text DEFAULT 'new'::text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    implementation_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_recommendations_implementation_effort_check CHECK ((implementation_effort = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT esg_recommendations_recommendation_type_check CHECK ((recommendation_type = ANY (ARRAY['improvement'::text, 'risk_mitigation'::text, 'best_practice'::text, 'compliance'::text, 'efficiency'::text]))),
    CONSTRAINT esg_recommendations_status_check CHECK ((status = ANY (ARRAY['new'::text, 'reviewed'::text, 'accepted'::text, 'rejected'::text, 'implemented'::text])))
);

CREATE TABLE public.esg_report_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid,
    version_number integer NOT NULL,
    snapshot_data jsonb,
    pdf_url text,
    html_url text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);

CREATE TABLE public.esg_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    report_name text NOT NULL,
    report_type text NOT NULL,
    framework_version text,
    reporting_period_start date NOT NULL,
    reporting_period_end date NOT NULL,
    status text DEFAULT 'draft'::text,
    template_data jsonb DEFAULT '{}'::jsonb,
    generated_content text,
    cover_image text,
    executive_summary text,
    created_by uuid,
    approved_by uuid,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    initiative_id uuid,
    report_version integer DEFAULT 1,
    is_final boolean DEFAULT false,
    previous_version_id uuid,
    pdf_url text,
    html_url text,
    file_size_bytes integer,
    report_format text DEFAULT 'html'::text,
    download_count integer DEFAULT 0,
    archived_at timestamp with time zone,
    CONSTRAINT esg_reports_report_type_check CHECK ((report_type = ANY (ARRAY['gri'::text, 'sasb'::text, 'tcfd'::text, 'ungc'::text, 'integrated'::text, 'custom'::text]))),
    CONSTRAINT esg_reports_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'in_review'::text, 'approved'::text, 'published'::text])))
);

CREATE TABLE public.esg_risks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    risk_name text NOT NULL,
    risk_category text NOT NULL,
    risk_type text NOT NULL,
    description text NOT NULL,
    probability_score numeric DEFAULT 3,
    impact_score numeric DEFAULT 3,
    risk_score numeric GENERATED ALWAYS AS ((probability_score * impact_score)) STORED,
    risk_level text GENERATED ALWAYS AS (
CASE
    WHEN ((probability_score * impact_score) <= (6)::numeric) THEN 'low'::text
    WHEN ((probability_score * impact_score) <= (15)::numeric) THEN 'medium'::text
    WHEN ((probability_score * impact_score) <= (20)::numeric) THEN 'high'::text
    ELSE 'critical'::text
END) STORED,
    mitigation_strategies jsonb DEFAULT '[]'::jsonb,
    residual_risk_score numeric,
    owner_department text,
    review_frequency text DEFAULT 'quarterly'::text,
    last_reviewed date,
    next_review_date date,
    status text DEFAULT 'active'::text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT esg_risks_impact_score_check CHECK (((impact_score >= (1)::numeric) AND (impact_score <= (5)::numeric))),
    CONSTRAINT esg_risks_probability_score_check CHECK (((probability_score >= (1)::numeric) AND (probability_score <= (5)::numeric))),
    CONSTRAINT esg_risks_risk_category_check CHECK ((risk_category = ANY (ARRAY['environmental'::text, 'social'::text, 'governance'::text]))),
    CONSTRAINT esg_risks_risk_type_check CHECK ((risk_type = ANY (ARRAY['physical'::text, 'transition'::text, 'regulatory'::text, 'reputational'::text, 'operational'::text]))),
    CONSTRAINT esg_risks_status_check CHECK ((status = ANY (ARRAY['active'::text, 'mitigated'::text, 'transferred'::text, 'accepted'::text])))
);

CREATE TABLE public.esg_targets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    indicator_id uuid,
    target_name text NOT NULL,
    baseline_value numeric,
    target_value numeric,
    baseline_year integer,
    target_year integer,
    progress_percentage numeric DEFAULT 0,
    status text DEFAULT 'active'::text,
    description text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.esg_verification_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contribution_id uuid,
    action_type text NOT NULL,
    performed_by uuid NOT NULL,
    notes text,
    previous_status text,
    new_status text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT esg_verification_audit_log_action_type_check CHECK ((action_type = ANY (ARRAY['submitted'::text, 'approved'::text, 'rejected'::text, 'revision_requested'::text, 'resubmitted'::text])))
);

CREATE TABLE public.evidence_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_id uuid,
    evidence_type text NOT NULL,
    file_url text,
    metadata jsonb DEFAULT '{}'::jsonb,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT evidence_submissions_evidence_type_check CHECK ((evidence_type = ANY (ARRAY['photo'::text, 'video'::text, 'document'::text, 'geolocation'::text, 'timestamp'::text, 'witness_confirmation'::text]))),
    CONSTRAINT evidence_submissions_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'requires_review'::text])))
);

CREATE TABLE public.fraud_detection_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    detection_type text NOT NULL,
    threshold_value numeric NOT NULL,
    actual_value numeric NOT NULL,
    time_window text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    risk_score numeric DEFAULT 0 NOT NULL,
    auto_flagged boolean DEFAULT false,
    reviewed boolean DEFAULT false,
    reviewer_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fraud_detection_log_detection_type_check CHECK ((detection_type = ANY (ARRAY['point_burst'::text, 'pattern_farming'::text, 'rapid_actions'::text, 'suspicious_timing'::text, 'location_anomaly'::text])))
);

CREATE TABLE public.grants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    funder_name text NOT NULL,
    grant_title text NOT NULL,
    amount_requested numeric,
    amount_awarded numeric,
    application_deadline timestamp with time zone,
    decision_date timestamp with time zone,
    project_start_date timestamp with time zone,
    project_end_date timestamp with time zone,
    status text DEFAULT 'researching'::text,
    application_status text DEFAULT 'not_submitted'::text,
    grant_type text,
    focus_area text,
    eligibility_requirements text,
    application_requirements text,
    notes text,
    documents jsonb DEFAULT '[]'::jsonb,
    reporting_requirements text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.group_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT group_members_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'moderator'::text, 'member'::text])))
);

CREATE TABLE public.groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    cover_image text,
    category text NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    location text,
    tags text[] DEFAULT ARRAY[]::text[],
    admin_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.help_completion_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    helper_id uuid NOT NULL,
    requester_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    helper_message text,
    feedback_rating integer,
    feedback_message text,
    completion_evidence jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    CONSTRAINT help_completion_requests_feedback_rating_check CHECK (((feedback_rating >= 1) AND (feedback_rating <= 5))),
    CONSTRAINT help_completion_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);

CREATE TABLE public.impact_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    points_earned integer DEFAULT 0 NOT NULL,
    description text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    effort_level integer DEFAULT 1,
    requires_evidence boolean DEFAULT false,
    evidence_submitted boolean DEFAULT false,
    risk_score numeric DEFAULT 0,
    auto_verified boolean DEFAULT true,
    skill_category_id uuid,
    hours_contributed numeric DEFAULT 0,
    market_rate_used numeric DEFAULT 0,
    market_value_gbp numeric DEFAULT 0,
    points_conversion_rate numeric DEFAULT 0.5,
    organization_id uuid,
    post_id uuid,
    confirmed_by uuid,
    confirmation_status text DEFAULT 'pending'::text,
    confirmed_at timestamp with time zone,
    rejection_reason text,
    confirmation_requested_at timestamp with time zone DEFAULT now(),
    points_state text DEFAULT 'active'::text,
    trust_score_at_award integer DEFAULT 0,
    CONSTRAINT check_volunteer_recipient CHECK (((activity_type <> 'volunteer_work'::text) OR (((organization_id IS NOT NULL) AND (post_id IS NULL)) OR ((organization_id IS NULL) AND (post_id IS NOT NULL))))),
    CONSTRAINT impact_activities_confirmation_status_check CHECK ((confirmation_status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'rejected'::text]))),
    CONSTRAINT impact_activities_effort_level_check CHECK (((effort_level >= 1) AND (effort_level <= 5))),
    CONSTRAINT impact_activities_points_state_check CHECK ((points_state = ANY (ARRAY['active'::text, 'pending'::text, 'escrow'::text, 'reversed'::text])))
);

CREATE TABLE public.impact_goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    target_value integer NOT NULL,
    current_value integer DEFAULT 0,
    deadline date,
    category text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.impact_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    impact_score integer DEFAULT 0 NOT NULL,
    trust_score integer DEFAULT 50 NOT NULL,
    help_provided_count integer DEFAULT 0,
    help_received_count integer DEFAULT 0,
    volunteer_hours integer DEFAULT 0,
    donation_amount numeric DEFAULT 0,
    connections_count integer DEFAULT 0,
    response_time_hours numeric DEFAULT 0,
    calculated_at timestamp with time zone DEFAULT now() NOT NULL,
    average_rating numeric DEFAULT 0,
    red_flag_count integer DEFAULT 0,
    last_activity_date timestamp with time zone DEFAULT now(),
    xp_points integer DEFAULT 0,
    decay_applied_count integer DEFAULT 0,
    total_market_value_contributed numeric DEFAULT 0
);

CREATE TABLE public.language_detection_cache (
    content_hash text NOT NULL,
    detected_language text NOT NULL,
    confidence double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.materiality_assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    assessment_year integer NOT NULL,
    stakeholder_importance numeric NOT NULL,
    business_impact numeric NOT NULL,
    indicator_id uuid,
    priority_level text,
    stakeholder_feedback text,
    action_plan text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.message_access_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    message_id uuid NOT NULL,
    access_type text NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text'::text NOT NULL,
    file_url text,
    file_name text,
    file_size integer,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    attachment_type text,
    attachment_url text,
    attachment_name text,
    attachment_size integer,
    delivered_at timestamp with time zone,
    read_at timestamp with time zone,
    CONSTRAINT messages_message_type_check CHECK ((message_type = ANY (ARRAY['text'::text, 'image'::text, 'file'::text, 'voice'::text])))
);

CREATE TABLE public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true,
    unsubscribed_at timestamp with time zone
);

CREATE TABLE public.newsletter_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    first_name text,
    interests text[],
    frequency text DEFAULT 'monthly'::text NOT NULL,
    gdpr_consent boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    unsubscribed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.notification_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    notification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    event_type text NOT NULL,
    event_metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_analytics_event_type_check CHECK ((event_type = ANY (ARRAY['viewed'::text, 'clicked'::text, 'dismissed'::text, 'action_taken'::text])))
);

CREATE TABLE public.notification_delivery_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    notification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    delivery_method text NOT NULL,
    delivered_at timestamp with time zone DEFAULT now(),
    opened_at timestamp with time zone,
    clicked_at timestamp with time zone,
    action_taken text,
    device_info jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_delivery_log_delivery_method_check CHECK ((delivery_method = ANY (ARRAY['in_app'::text, 'push'::text, 'email'::text])))
);

CREATE TABLE public.notification_filters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    filter_config jsonb NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.notification_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    type text NOT NULL,
    title_template text NOT NULL,
    message_template text NOT NULL,
    default_priority text DEFAULT 'normal'::text,
    default_action_type text,
    metadata_schema jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_templates_default_priority_check CHECK ((default_priority = ANY (ARRAY['urgent'::text, 'high'::text, 'normal'::text, 'low'::text])))
);

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipient_id uuid NOT NULL,
    sender_id uuid,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    priority text DEFAULT 'normal'::text,
    action_url text,
    action_type text,
    grouped_with uuid,
    delivery_status text DEFAULT 'pending'::text,
    group_key text,
    read_at timestamp with time zone,
    CONSTRAINT notifications_delivery_status_check CHECK ((delivery_status = ANY (ARRAY['pending'::text, 'delivered'::text, 'read'::text, 'failed'::text]))),
    CONSTRAINT notifications_priority_check CHECK ((priority = ANY (ARRAY['urgent'::text, 'high'::text, 'normal'::text, 'low'::text]))),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['connection_request'::text, 'connection_accepted'::text, 'message'::text, 'post_interaction'::text, 'group_invitation'::text, 'campaign_update'::text, 'demo_request'::text, 'esg_milestone'::text, 'esg_verification'::text, 'esg_report_ready'::text, 'help_completion_request'::text, 'help_approved'::text, 'help_rejected'::text, 'feedback_status_update'::text])))
);

CREATE TABLE public.organization_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    impact_value numeric,
    beneficiaries_count integer DEFAULT 0,
    location text,
    related_campaign_id uuid,
    media_urls jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.organization_esg_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    indicator_id uuid,
    reporting_period date NOT NULL,
    value numeric,
    text_value text,
    unit text,
    data_source text,
    verification_status text DEFAULT 'unverified'::text,
    notes text,
    collected_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.organization_followers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    follower_id uuid NOT NULL,
    followed_at timestamp with time zone DEFAULT now(),
    notifications_enabled boolean DEFAULT true
);

CREATE TABLE public.organization_impact_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    total_funds_raised numeric DEFAULT 0,
    total_people_helped integer DEFAULT 0,
    total_volunteer_hours integer DEFAULT 0,
    active_campaigns integer DEFAULT 0,
    completed_projects integer DEFAULT 0,
    carbon_offset_kg numeric DEFAULT 0,
    geographic_reach_countries integer DEFAULT 0,
    partner_organizations integer DEFAULT 0,
    last_calculated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.organization_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    title text,
    invited_by uuid NOT NULL,
    invitation_token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'::text) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    created_at timestamp with time zone DEFAULT now(),
    accepted_at timestamp with time zone,
    invitation_type text DEFAULT 'general'::text,
    esg_context jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT organization_invitations_invitation_type_check CHECK ((invitation_type = ANY (ARRAY['general'::text, 'esg_contributor'::text, 'esg_viewer'::text])))
);

CREATE TABLE public.organization_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    title text,
    department text,
    start_date date,
    end_date date,
    is_public boolean DEFAULT true,
    is_active boolean DEFAULT true,
    verified_by uuid,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    esg_role text,
    CONSTRAINT organization_members_esg_role_check CHECK ((esg_role = ANY (ARRAY['esg_admin'::text, 'esg_contributor'::text, 'esg_viewer'::text, 'esg_approver'::text]))),
    CONSTRAINT organization_members_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'staff'::text, 'volunteer'::text, 'board_member'::text, 'supporter'::text, 'member'::text])))
);

CREATE TABLE public.organization_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    preference_type text NOT NULL,
    preference_value text NOT NULL,
    weight numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organization_preferences_preference_type_check CHECK ((preference_type = ANY (ARRAY['cause_area'::text, 'skill_need'::text, 'volunteer_type'::text, 'geographic_focus'::text])))
);

CREATE TABLE public.organization_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    reviewer_id uuid NOT NULL,
    rating integer NOT NULL,
    review_text text,
    reviewer_type text DEFAULT 'supporter'::text,
    is_verified boolean DEFAULT false,
    is_anonymous boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT organization_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT organization_reviews_reviewer_type_check CHECK ((reviewer_type = ANY (ARRAY['donor'::text, 'volunteer'::text, 'partner'::text, 'supporter'::text])))
);

CREATE TABLE public.organization_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    branding jsonb DEFAULT '{}'::jsonb,
    communication_templates jsonb DEFAULT '{}'::jsonb,
    donation_settings jsonb DEFAULT '{}'::jsonb,
    volunteer_settings jsonb DEFAULT '{}'::jsonb,
    analytics_preferences jsonb DEFAULT '{}'::jsonb,
    notification_preferences jsonb DEFAULT '{}'::jsonb,
    integration_settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.organization_team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    title text,
    permissions jsonb DEFAULT '{}'::jsonb,
    invited_by uuid,
    invited_at timestamp with time zone,
    joined_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.organization_trust_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    overall_score integer DEFAULT 50 NOT NULL,
    verification_score integer DEFAULT 0,
    transparency_score integer DEFAULT 0,
    engagement_score integer DEFAULT 0,
    esg_score integer DEFAULT 0,
    review_score integer DEFAULT 0,
    calculated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT organization_trust_scores_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100)))
);

CREATE TABLE public.organization_verifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    verification_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    verified_at timestamp with time zone,
    verified_by uuid,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT organization_verifications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    organization_type text NOT NULL,
    description text,
    mission text,
    vision text,
    website text,
    location text,
    avatar_url text,
    banner_url text,
    established_year integer,
    registration_number text,
    contact_email text,
    contact_phone text,
    social_links jsonb DEFAULT '{}'::jsonb,
    tags text[] DEFAULT ARRAY[]::text[],
    is_verified boolean DEFAULT false,
    verification_status text DEFAULT 'pending'::text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organizations_organization_type_check CHECK ((organization_type = ANY (ARRAY['individual'::text, 'business'::text, 'charity'::text, 'community-group'::text, 'religious-group'::text, 'social-group'::text]))),
    CONSTRAINT organizations_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])))
);

CREATE TABLE public.partnership_enquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organisation_name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL,
    phone text,
    partnership_type text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.payment_references (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference_code text NOT NULL,
    payment_id uuid,
    expected_amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'GBP'::text NOT NULL,
    expires_at timestamp with time zone,
    used_at timestamp with time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.platform_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    feedback_type public.feedback_type NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    page_url text,
    page_section text,
    screenshot_url text,
    browser_info jsonb DEFAULT '{}'::jsonb,
    priority public.feedback_priority DEFAULT 'medium'::public.feedback_priority,
    status public.feedback_status DEFAULT 'new'::public.feedback_status,
    admin_notes text,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.platform_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    organisation_id uuid,
    payment_type text NOT NULL,
    payment_method text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'GBP'::text NOT NULL,
    yapily_payment_id text,
    yapily_consent_id text,
    yapily_institution_id text,
    payment_reference text,
    bank_transfer_details jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    payment_date timestamp with time zone,
    reconciled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.point_decay_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    points_before integer DEFAULT 0 NOT NULL,
    points_after integer DEFAULT 0 NOT NULL,
    decay_percentage numeric DEFAULT 5.0 NOT NULL,
    reason text DEFAULT 'inactivity_decay'::text NOT NULL,
    last_activity_date timestamp with time zone,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.point_redemptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    reward_id text NOT NULL,
    points_cost integer NOT NULL,
    status text DEFAULT 'pending'::text,
    redeemed_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE public.points_configuration (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    config_key text NOT NULL,
    config_value jsonb NOT NULL,
    description text,
    category text NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.post_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    interaction_type text NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_comment_id uuid,
    edited_at timestamp with time zone,
    is_deleted boolean DEFAULT false,
    organization_id uuid,
    CONSTRAINT post_interactions_interaction_type_check CHECK ((interaction_type = ANY (ARRAY['like'::text, 'love'::text, 'support'::text, 'laugh'::text, 'angry'::text, 'sad'::text, 'wow'::text, 'comment'::text, 'share'::text, 'bookmark'::text])))
);

CREATE TABLE public.post_reactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reaction_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    author_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    location text,
    urgency text DEFAULT 'medium'::text NOT NULL,
    media_urls text[] DEFAULT ARRAY[]::text[],
    tags text[] DEFAULT ARRAY[]::text[],
    visibility text DEFAULT 'public'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    link_preview_url text,
    link_preview_data jsonb,
    import_source text,
    external_id text,
    import_metadata jsonb,
    imported_at timestamp with time zone,
    organization_id uuid,
    latitude numeric,
    longitude numeric,
    CONSTRAINT posts_category_check CHECK ((category = ANY (ARRAY['help-needed'::text, 'help-offered'::text, 'success-story'::text, 'announcement'::text, 'question'::text, 'recommendation'::text, 'event'::text, 'lost-found'::text]))),
    CONSTRAINT posts_urgency_check CHECK ((urgency = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT posts_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'friends'::text, 'private'::text])))
);

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    first_name text,
    last_name text,
    phone text,
    location text,
    bio text,
    avatar_url text,
    banner_url text,
    skills text[],
    interests text[],
    website text,
    facebook text,
    twitter text,
    instagram text,
    linkedin text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    banner_type text,
    waitlist_status public.waitlist_status DEFAULT 'pending'::public.waitlist_status,
    waitlist_approved_by uuid,
    approved_at timestamp with time zone,
    waitlist_notes text,
    admin_notes text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    location_updated_at timestamp with time zone,
    location_sharing_enabled boolean DEFAULT false,
    is_founding_member boolean DEFAULT false,
    founding_member_granted_at timestamp with time zone,
    founding_member_granted_by uuid,
    user_type text DEFAULT 'individual'::text,
    email text,
    clerk_user_id text UNIQUE
);

CREATE TABLE public.questionnaire_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    user_type text NOT NULL,
    response_data jsonb NOT NULL,
    motivation text,
    agree_to_terms boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.rate_limit_buckets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    bucket_type text NOT NULL,
    tokens integer DEFAULT 0 NOT NULL,
    max_tokens integer NOT NULL,
    refill_rate integer DEFAULT 1 NOT NULL,
    last_refill timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.recommendation_cache (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    recommendation_type text NOT NULL,
    target_id uuid NOT NULL,
    confidence_score numeric NOT NULL,
    reasoning text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '24:00:00'::interval)
);

CREATE TABLE public.red_flags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    flag_type text NOT NULL,
    severity text DEFAULT 'medium'::text NOT NULL,
    description text NOT NULL,
    evidence jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'active'::text NOT NULL,
    flagged_by uuid,
    resolved_by uuid,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT red_flags_flag_type_check CHECK ((flag_type = ANY (ARRAY['dispute'::text, 'reversal'::text, 'suspicious_activity'::text, 'pattern_farming'::text, 'point_burst'::text, 'fake_evidence'::text]))),
    CONSTRAINT red_flags_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT red_flags_status_check CHECK ((status = ANY (ARRAY['active'::text, 'resolved'::text, 'dismissed'::text])))
);

CREATE TABLE public.relive_stories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    cover_image text,
    start_date timestamp with time zone NOT NULL,
    completed_date timestamp with time zone,
    total_impact jsonb DEFAULT '{"peopleHelped": 0, "pointsEarned": 0, "emotionalImpact": "", "hoursContributed": 0}'::jsonb,
    preview_text text,
    emotions text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reporter_id uuid NOT NULL,
    reported_user_id uuid,
    reported_post_id uuid,
    report_type text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    CONSTRAINT check_reported_target CHECK ((((reported_user_id IS NOT NULL) AND (reported_post_id IS NULL)) OR ((reported_user_id IS NULL) AND (reported_post_id IS NOT NULL)))),
    CONSTRAINT reports_report_type_check CHECK ((report_type = ANY (ARRAY['spam'::text, 'harassment'::text, 'inappropriate_content'::text, 'fake_account'::text, 'other'::text]))),
    CONSTRAINT reports_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text, 'dismissed'::text])))
);

CREATE TABLE public.safe_space_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    action_type text NOT NULL,
    resource_type text NOT NULL,
    resource_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.safe_space_emergency_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid,
    message_id uuid,
    alert_type text NOT NULL,
    severity text NOT NULL,
    risk_score integer,
    detected_keywords text[],
    ai_analysis jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text,
    assigned_to uuid,
    acknowledged_at timestamp with time zone,
    resolved_at timestamp with time zone,
    resolution_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT safe_space_emergency_alerts_risk_score_check CHECK (((risk_score >= 0) AND (risk_score <= 100))),
    CONSTRAINT safe_space_emergency_alerts_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT safe_space_emergency_alerts_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'acknowledged'::text, 'reviewing'::text, 'resolved'::text, 'escalated'::text])))
);

CREATE TABLE public.safe_space_flagged_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    keyword text NOT NULL,
    category text NOT NULL,
    severity text NOT NULL,
    requires_immediate_escalation boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT safe_space_flagged_keywords_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);

CREATE TABLE public.safe_space_helper_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    application_status text DEFAULT 'draft'::text NOT NULL,
    personal_statement text,
    experience_description text,
    qualifications jsonb DEFAULT '[]'::jsonb,
    reference_contacts jsonb DEFAULT '[]'::jsonb,
    availability_commitment text,
    preferred_specializations text[] DEFAULT ARRAY[]::text[],
    reviewed_by uuid,
    reviewer_notes text,
    rejection_reason text,
    submitted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT safe_space_helper_applications_application_status_check CHECK ((application_status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text])))
);

CREATE TABLE public.safe_space_helper_training_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    module_id uuid NOT NULL,
    status text DEFAULT 'not_started'::text NOT NULL,
    score integer,
    attempts integer DEFAULT 0 NOT NULL,
    time_spent_minutes integer DEFAULT 0,
    answers jsonb DEFAULT '{}'::jsonb,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_attempt_at timestamp with time zone,
    can_retry_at timestamp with time zone,
    CONSTRAINT safe_space_helper_training_progress_score_check CHECK (((score >= 0) AND (score <= 100))),
    CONSTRAINT safe_space_helper_training_progress_status_check CHECK ((status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text, 'failed'::text])))
);

CREATE TABLE public.safe_space_helpers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    specializations text[] DEFAULT '{}'::text[] NOT NULL,
    is_available boolean DEFAULT false NOT NULL,
    max_concurrent_sessions integer DEFAULT 1 NOT NULL,
    current_sessions integer DEFAULT 0 NOT NULL,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    professional_credentials jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_active timestamp with time zone DEFAULT now(),
    emergency_contact_name text,
    emergency_contact_phone text,
    emergency_contact_relationship text,
    dbs_required boolean DEFAULT false,
    trust_score integer DEFAULT 0,
    id_verification_status text DEFAULT 'pending'::text,
    last_verification_check timestamp with time zone DEFAULT now()
);

CREATE TABLE public.safe_space_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid,
    sender_role text NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '24:00:00'::interval) NOT NULL,
    encrypted_content bytea,
    is_encrypted boolean DEFAULT false
);

CREATE TABLE public.safe_space_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_id uuid,
    issue_category text NOT NULL,
    urgency_level text DEFAULT 'medium'::text NOT NULL,
    preferred_helper_type text,
    additional_info text,
    position_in_queue integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    estimated_wait_minutes integer
);

CREATE TABLE public.safe_space_reference_checks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    reference_name text NOT NULL,
    reference_email text NOT NULL,
    reference_phone text,
    relationship text NOT NULL,
    verification_token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'::text) NOT NULL,
    questionnaire_responses jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    submitted_at timestamp with time zone,
    expires_at timestamp with time zone DEFAULT (now() + '14 days'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT safe_space_reference_checks_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'expired'::text])))
);

CREATE TABLE public.safe_space_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_id uuid,
    helper_id uuid,
    session_token text NOT NULL,
    issue_category text NOT NULL,
    urgency_level text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'waiting'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    duration_minutes integer,
    feedback_rating integer,
    metadata jsonb DEFAULT '{}'::jsonb,
    session_paused boolean DEFAULT false,
    paused_reason text,
    paused_at timestamp with time zone,
    paused_by uuid
);

CREATE TABLE public.safe_space_training_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    content_type text NOT NULL,
    content_url text,
    content_html text,
    quiz_questions jsonb DEFAULT '[]'::jsonb,
    duration_minutes integer NOT NULL,
    passing_score integer DEFAULT 80,
    order_sequence integer NOT NULL,
    is_required boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    category text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    max_attempts integer,
    retry_delay_days integer,
    question_count integer DEFAULT 0 NOT NULL,
    difficulty_level text DEFAULT 'medium'::text NOT NULL,
    CONSTRAINT safe_space_training_modules_content_type_check CHECK ((content_type = ANY (ARRAY['video'::text, 'reading'::text, 'quiz'::text, 'interactive'::text])))
);

CREATE TABLE public.safe_space_verification_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    application_id uuid,
    document_type text NOT NULL,
    file_path text NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    rejection_reason text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    dbs_certificate_number text,
    dbs_issue_date date,
    dbs_expiry_date date,
    dbs_check_level text,
    CONSTRAINT safe_space_verification_documents_dbs_check_level_check CHECK ((dbs_check_level = ANY (ARRAY['basic'::text, 'standard'::text, 'enhanced'::text]))),
    CONSTRAINT safe_space_verification_documents_document_type_check CHECK ((document_type = ANY (ARRAY['government_id'::text, 'selfie'::text, 'address_proof'::text, 'qualification_cert'::text, 'dbs_certificate'::text]))),
    CONSTRAINT safe_space_verification_documents_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])))
);

CREATE TABLE public.safeguarding_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.safeguarding_role NOT NULL,
    assigned_by uuid,
    assigned_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.scheduled_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid,
    recipient_id uuid NOT NULL,
    sender_id uuid,
    scheduled_for timestamp with time zone NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    priority text DEFAULT 'normal'::text,
    action_url text,
    action_type text,
    metadata jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text,
    sent_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT scheduled_notifications_priority_check CHECK ((priority = ANY (ARRAY['urgent'::text, 'high'::text, 'normal'::text, 'low'::text]))),
    CONSTRAINT scheduled_notifications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text, 'cancelled'::text])))
);

CREATE TABLE public.seasonal_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    point_multiplier numeric DEFAULT 1,
    target_categories text[] DEFAULT '{}'::text[],
    max_progress integer DEFAULT 100,
    reward_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.security_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action_type text NOT NULL,
    resource_type text,
    resource_id uuid,
    ip_address inet,
    user_agent text,
    severity text DEFAULT 'info'::text,
    details jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT security_audit_log_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);

CREATE TABLE public.skill_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    market_rate_gbp numeric NOT NULL,
    requires_verification boolean DEFAULT false,
    evidence_required boolean DEFAULT false,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.stakeholder_data_contributions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    data_request_id uuid,
    esg_data_id uuid,
    contributor_org_id uuid,
    contributor_user_id uuid,
    contribution_status text DEFAULT 'draft'::text,
    submitted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    review_notes text,
    created_at timestamp with time zone DEFAULT now(),
    verification_status text DEFAULT 'pending'::text,
    verified_by uuid,
    verified_at timestamp with time zone,
    verification_notes text,
    revision_requested_notes text,
    supporting_documents jsonb DEFAULT '[]'::jsonb,
    draft_data jsonb DEFAULT '{}'::jsonb,
    last_saved_at timestamp with time zone DEFAULT now(),
    CONSTRAINT stakeholder_data_contributions_contribution_status_check CHECK ((contribution_status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text]))),
    CONSTRAINT stakeholder_data_contributions_verification_status_check CHECK ((verification_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'needs_revision'::text])))
);

CREATE TABLE public.stakeholder_engagement_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    stakeholder_type text NOT NULL,
    metric_name text NOT NULL,
    metric_value numeric,
    metric_unit text,
    measurement_date date NOT NULL,
    engagement_method text,
    response_rate numeric,
    satisfaction_score numeric,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.stakeholder_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    group_name text NOT NULL,
    stakeholder_type text NOT NULL,
    description text,
    engagement_methods jsonb DEFAULT '[]'::jsonb,
    contact_frequency text DEFAULT 'quarterly'::text,
    key_interests jsonb DEFAULT '[]'::jsonb,
    influence_level text DEFAULT 'medium'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT stakeholder_groups_influence_level_check CHECK ((influence_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT stakeholder_groups_stakeholder_type_check CHECK ((stakeholder_type = ANY (ARRAY['employees'::text, 'investors'::text, 'customers'::text, 'suppliers'::text, 'community'::text, 'regulators'::text, 'ngos'::text])))
);

CREATE TABLE public.story_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    participation_type text NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT story_participants_participation_type_check CHECK ((participation_type = ANY (ARRAY['created'::text, 'helped'::text, 'received_help'::text, 'supported'::text]))),
    CONSTRAINT story_participants_role_check CHECK ((role = ANY (ARRAY['creator'::text, 'helper'::text, 'beneficiary'::text, 'supporter'::text])))
);

CREATE TABLE public.story_updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    author_id uuid NOT NULL,
    update_type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    media_url text,
    media_type text,
    emotions text[] DEFAULT '{}'::text[],
    stats jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT story_updates_media_type_check CHECK ((media_type = ANY (ARRAY['image'::text, 'video'::text]))),
    CONSTRAINT story_updates_update_type_check CHECK ((update_type = ANY (ARRAY['progress'::text, 'completion'::text, 'impact'::text, 'reflection'::text])))
);

CREATE TABLE public.subscription_admin_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    target_user_id uuid NOT NULL,
    action_type text NOT NULL,
    action_details jsonb DEFAULT '{}'::jsonb,
    reason text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT subscription_admin_actions_action_type_check CHECK ((action_type = ANY (ARRAY['grant_founding_member'::text, 'revoke_founding_member'::text, 'assign_subscription'::text, 'cancel_subscription'::text, 'extend_subscription'::text])))
);

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    price_monthly numeric(10,2),
    price_annual numeric(10,2),
    features jsonb DEFAULT '[]'::jsonb,
    max_campaigns integer,
    max_team_members integer,
    white_label_enabled boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.support_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    action_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT support_actions_action_type_check CHECK ((action_type = ANY (ARRAY['volunteer'::text, 'donate_intent'::text, 'message'::text, 'share'::text]))),
    CONSTRAINT support_actions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])))
);

CREATE TABLE public.trust_domains (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    domain text NOT NULL,
    domain_score integer DEFAULT 50 NOT NULL,
    actions_count integer DEFAULT 0 NOT NULL,
    average_rating numeric DEFAULT 0,
    last_activity timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trust_domains_domain_check CHECK ((domain = ANY (ARRAY['elderly_support'::text, 'event_organization'::text, 'emergency_response'::text, 'fundraising'::text, 'community_building'::text, 'education'::text, 'environmental'::text])))
);

CREATE TABLE public.trust_score_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    previous_score integer,
    new_score integer NOT NULL,
    change_reason text NOT NULL,
    verification_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.tutorial_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    show_tutorials boolean DEFAULT true,
    dismissed_tutorials text[] DEFAULT ARRAY[]::text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.typing_indicators (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    conversation_partner_id uuid NOT NULL,
    is_typing boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.url_previews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    url text NOT NULL,
    title text,
    description text,
    image_url text,
    site_name text,
    favicon text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval)
);

CREATE TABLE public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    achievement_id text NOT NULL,
    unlocked_at timestamp with time zone DEFAULT now() NOT NULL,
    progress integer DEFAULT 0,
    max_progress integer DEFAULT 1,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE public.user_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    visibility text DEFAULT 'public'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_activities_activity_type_check CHECK ((activity_type = ANY (ARRAY['connection_request'::text, 'connection_accepted'::text, 'group_joined'::text, 'campaign_joined'::text, 'post_created'::text, 'help_offered'::text, 'help_received'::text]))),
    CONSTRAINT user_activities_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'connections'::text, 'private'::text])))
);

CREATE TABLE public.user_badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    badge_id uuid NOT NULL,
    earned_at timestamp with time zone DEFAULT now(),
    progress integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE public.user_blocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blocker_id uuid NOT NULL,
    blocked_id uuid NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_challenge_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    progress integer DEFAULT 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_interaction_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    target_user_id uuid,
    target_post_id uuid,
    interaction_type text NOT NULL,
    score_value numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_language_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    preferred_language text DEFAULT 'en'::text NOT NULL,
    auto_translate boolean DEFAULT false,
    show_translation_button boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    preference_type text NOT NULL,
    preference_value text NOT NULL,
    weight numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_presence (
    user_id uuid NOT NULL,
    is_online boolean DEFAULT false,
    last_seen timestamp with time zone DEFAULT now(),
    typing_to_user_id uuid,
    typing_started_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_privacy_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    profile_visibility text DEFAULT 'public'::text NOT NULL,
    allow_direct_messages text DEFAULT 'everyone'::text NOT NULL,
    show_online_status boolean DEFAULT true NOT NULL,
    show_location boolean DEFAULT true NOT NULL,
    show_email boolean DEFAULT false NOT NULL,
    show_phone boolean DEFAULT false NOT NULL,
    allow_tagging boolean DEFAULT true NOT NULL,
    show_activity_feed boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_privacy_settings_allow_direct_messages_check CHECK ((allow_direct_messages = ANY (ARRAY['everyone'::text, 'friends'::text, 'verified'::text, 'none'::text]))),
    CONSTRAINT user_privacy_settings_profile_visibility_check CHECK ((profile_visibility = ANY (ARRAY['public'::text, 'friends'::text, 'private'::text])))
);

CREATE TABLE public.user_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    organisation_id uuid,
    plan_id uuid,
    yapily_consent_id text,
    status text DEFAULT 'pending_payment'::text NOT NULL,
    billing_cycle text DEFAULT 'monthly'::text NOT NULL,
    current_period_start date,
    current_period_end date,
    next_payment_date date,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_tutorial_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tutorial_type text NOT NULL,
    user_type text NOT NULL,
    steps_completed jsonb DEFAULT '[]'::jsonb,
    total_steps integer NOT NULL,
    current_step integer DEFAULT 1,
    is_completed boolean DEFAULT false,
    dismissed boolean DEFAULT false,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    last_step_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_verifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    verification_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    verification_data jsonb,
    verified_at timestamp with time zone,
    expires_at timestamp with time zone,
    verified_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    face_match_score numeric(3,2),
    liveness_check_passed boolean DEFAULT false,
    face_embedding jsonb
);

CREATE TABLE public.verification_document_audit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    document_id uuid NOT NULL,
    accessed_by uuid NOT NULL,
    action_type text NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT verification_document_audit_action_type_check CHECK ((action_type = ANY (ARRAY['view'::text, 'download'::text, 'approve'::text, 'reject'::text])))
);

CREATE TABLE public.verification_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    verification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    document_type text NOT NULL,
    file_path text NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    face_detected boolean DEFAULT false,
    face_quality_score numeric(3,2),
    CONSTRAINT verification_documents_document_type_check CHECK ((document_type = ANY (ARRAY['id_front'::text, 'id_back'::text, 'selfie'::text])))
);

CREATE TABLE public.volunteer_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    opportunity_id uuid NOT NULL,
    user_id uuid NOT NULL,
    application_message text,
    availability text,
    relevant_experience text,
    emergency_contact jsonb,
    background_check_status text DEFAULT 'not_required'::text,
    training_status text DEFAULT 'not_required'::text,
    status text DEFAULT 'pending'::text,
    applied_at timestamp with time zone DEFAULT now(),
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    hours_logged integer DEFAULT 0
);

CREATE TABLE public.volunteer_interests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    volunteer_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT volunteer_interests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'completed'::text])))
);

CREATE TABLE public.volunteer_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    created_by uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    requirements text,
    skills_needed text[] DEFAULT '{}'::text[],
    time_commitment text,
    location text,
    is_remote boolean DEFAULT false,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    max_volunteers integer,
    current_volunteers integer DEFAULT 0,
    status text DEFAULT 'active'::text,
    application_deadline timestamp with time zone,
    background_check_required boolean DEFAULT false,
    training_required boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.volunteer_work_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    activity_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    volunteer_id uuid NOT NULL,
    notification_type text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT volunteer_work_notifications_notification_type_check CHECK ((notification_type = ANY (ARRAY['confirmation_requested'::text, 'confirmed'::text, 'rejected'::text])))
);

CREATE TABLE public.white_label_purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organisation_id uuid,
    payment_id uuid,
    configuration jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    licence_start_date date,
    licence_end_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);