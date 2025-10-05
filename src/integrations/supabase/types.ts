export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_action_log: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_endpoint_rate_limits: {
        Row: {
          created_at: string | null
          endpoint_name: string
          id: string
          request_count: number | null
          user_id: string
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint_name: string
          id?: string
          request_count?: number | null
          user_id: string
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint_name?: string
          id?: string
          request_count?: number | null
          user_id?: string
          window_start?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          color: string
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          name: string
          rarity: string
          requirement_type: string
          requirement_value: number
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          rarity: string
          requirement_type: string
          requirement_value: number
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string
          requirement_type?: string
          requirement_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      business_partnerships: {
        Row: {
          contact_email: string | null
          contact_person: string | null
          created_at: string
          deliverables: string[] | null
          description: string | null
          end_date: string | null
          id: string
          objectives: string[] | null
          organization_id: string
          partner_name: string
          partnership_type: string
          start_date: string | null
          status: string
          updated_at: string
          value: number | null
        }
        Insert: {
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          deliverables?: string[] | null
          description?: string | null
          end_date?: string | null
          id?: string
          objectives?: string[] | null
          organization_id: string
          partner_name: string
          partnership_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          deliverables?: string[] | null
          description?: string | null
          end_date?: string | null
          id?: string
          objectives?: string[] | null
          organization_id?: string
          partner_name?: string
          partnership_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_partnerships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_products: {
        Row: {
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          launch_date: string | null
          name: string
          organization_id: string
          price_range: string | null
          social_impact_statement: string | null
          status: string
          target_audience: string | null
          updated_at: string
          view_count: number | null
          website_url: string | null
        }
        Insert: {
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          launch_date?: string | null
          name: string
          organization_id: string
          price_range?: string | null
          social_impact_statement?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          view_count?: number | null
          website_url?: string | null
        }
        Update: {
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          launch_date?: string | null
          name?: string
          organization_id?: string
          price_range?: string | null
          social_impact_statement?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          view_count?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          avg_time_on_page: number | null
          bounce_rate: number | null
          campaign_id: string
          comment_count: number | null
          conversion_rate: number | null
          created_at: string
          date: string
          donation_amount: number | null
          id: string
          social_shares: number | null
          total_donations: number | null
          total_views: number | null
          unique_views: number | null
          updated_at: string
        }
        Insert: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          campaign_id: string
          comment_count?: number | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          donation_amount?: number | null
          id?: string
          social_shares?: number | null
          total_donations?: number | null
          total_views?: number | null
          unique_views?: number | null
          updated_at?: string
        }
        Update: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          campaign_id?: string
          comment_count?: number | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          donation_amount?: number | null
          id?: string
          social_shares?: number | null
          total_donations?: number | null
          total_views?: number | null
          unique_views?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_detailed_analytics: {
        Row: {
          average_donation: number | null
          campaign_id: string
          conversion_rate: number | null
          created_at: string | null
          date: string
          demographics: Json | null
          donations_amount: number | null
          donations_count: number | null
          id: string
          new_donors: number | null
          returning_donors: number | null
          shares: number | null
          traffic_sources: Json | null
          unique_visitors: number | null
          views: number | null
        }
        Insert: {
          average_donation?: number | null
          campaign_id: string
          conversion_rate?: number | null
          created_at?: string | null
          date: string
          demographics?: Json | null
          donations_amount?: number | null
          donations_count?: number | null
          id?: string
          new_donors?: number | null
          returning_donors?: number | null
          shares?: number | null
          traffic_sources?: Json | null
          unique_visitors?: number | null
          views?: number | null
        }
        Update: {
          average_donation?: number | null
          campaign_id?: string
          conversion_rate?: number | null
          created_at?: string | null
          date?: string
          demographics?: Json | null
          donations_amount?: number | null
          donations_count?: number | null
          id?: string
          new_donors?: number | null
          returning_donors?: number | null
          shares?: number | null
          traffic_sources?: Json | null
          unique_visitors?: number | null
          views?: number | null
        }
        Relationships: []
      }
      campaign_donations: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string
          currency: string | null
          device_type: string | null
          donation_type: string | null
          donor_id: string | null
          donor_message: string | null
          id: string
          is_anonymous: boolean | null
          location_city: string | null
          location_country: string | null
          payment_processor: string | null
          payment_status: string | null
          referrer_url: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string
          currency?: string | null
          device_type?: string | null
          donation_type?: string | null
          donor_id?: string | null
          donor_message?: string | null
          id?: string
          is_anonymous?: boolean | null
          location_city?: string | null
          location_country?: string | null
          payment_processor?: string | null
          payment_status?: string | null
          referrer_url?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string
          currency?: string | null
          device_type?: string | null
          donation_type?: string | null
          donor_id?: string | null
          donor_message?: string | null
          id?: string
          is_anonymous?: boolean | null
          location_city?: string | null
          location_country?: string | null
          payment_processor?: string | null
          payment_status?: string | null
          referrer_url?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_engagement: {
        Row: {
          action_type: string
          campaign_id: string
          created_at: string
          device_type: string | null
          id: string
          ip_address: unknown | null
          location_city: string | null
          location_country: string | null
          referrer_url: string | null
          session_id: string | null
          time_spent: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          campaign_id: string
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          location_city?: string | null
          location_country?: string | null
          referrer_url?: string | null
          session_id?: string | null
          time_spent?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          campaign_id?: string
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          location_city?: string | null
          location_country?: string | null
          referrer_url?: string | null
          session_id?: string | null
          time_spent?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_engagement_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_geographic_impact: {
        Row: {
          campaign_id: string
          city: string | null
          country_code: string
          country_name: string
          created_at: string
          donor_count: number | null
          id: string
          region: string | null
          total_donations: number | null
          total_shares: number | null
          total_views: number | null
          updated_at: string
        }
        Insert: {
          campaign_id: string
          city?: string | null
          country_code: string
          country_name: string
          created_at?: string
          donor_count?: number | null
          id?: string
          region?: string | null
          total_donations?: number | null
          total_shares?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          city?: string | null
          country_code?: string
          country_name?: string
          created_at?: string
          donor_count?: number | null
          id?: string
          region?: string | null
          total_donations?: number | null
          total_shares?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_geographic_impact_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_invitations: {
        Row: {
          campaign_id: string
          expires_at: string | null
          id: string
          invitation_type: string
          invitee_email: string
          invitee_id: string | null
          inviter_id: string
          message: string | null
          responded_at: string | null
          sent_at: string
          status: string
        }
        Insert: {
          campaign_id: string
          expires_at?: string | null
          id?: string
          invitation_type: string
          invitee_email: string
          invitee_id?: string | null
          inviter_id: string
          message?: string | null
          responded_at?: string | null
          sent_at?: string
          status?: string
        }
        Update: {
          campaign_id?: string
          expires_at?: string | null
          id?: string
          invitation_type?: string
          invitee_email?: string
          invitee_id?: string | null
          inviter_id?: string
          message?: string | null
          responded_at?: string | null
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_invitations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_participants: {
        Row: {
          campaign_id: string
          contribution_amount: number | null
          contribution_type: string | null
          id: string
          is_anonymous: boolean | null
          joined_at: string
          message: string | null
          participant_type: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id: string
          contribution_amount?: number | null
          contribution_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string
          message?: string | null
          participant_type: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string
          contribution_amount?: number | null
          contribution_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string
          message?: string | null
          participant_type?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participants_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_predictions: {
        Row: {
          actual_value: number | null
          campaign_id: string
          confidence_score: number | null
          created_at: string
          id: string
          model_version: string | null
          predicted_value: number | null
          prediction_date: string
          prediction_type: string
        }
        Insert: {
          actual_value?: number | null
          campaign_id: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          model_version?: string | null
          predicted_value?: number | null
          prediction_date?: string
          prediction_type: string
        }
        Update: {
          actual_value?: number | null
          campaign_id?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          model_version?: string | null
          predicted_value?: number | null
          prediction_date?: string
          prediction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_predictions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_promotions: {
        Row: {
          budget_spent: number | null
          campaign_id: string
          clicks: number | null
          conversions: number | null
          created_at: string
          end_date: string | null
          id: string
          impressions: number | null
          is_active: boolean | null
          promotion_type: string
          start_date: string
        }
        Insert: {
          budget_spent?: number | null
          campaign_id: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          promotion_type: string
          start_date?: string
        }
        Update: {
          budget_spent?: number | null
          campaign_id?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          promotion_type?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_promotions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_social_metrics: {
        Row: {
          campaign_id: string
          created_at: string
          date: string
          external_post_id: string | null
          id: string
          metric_type: string
          platform: string
          value: number | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          date?: string
          external_post_id?: string | null
          id?: string
          metric_type: string
          platform: string
          value?: number | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          date?: string
          external_post_id?: string | null
          id?: string
          metric_type?: string
          platform?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_social_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_updates: {
        Row: {
          author_id: string
          campaign_id: string
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          media_attachments: Json | null
          title: string
          update_type: string
        }
        Insert: {
          author_id: string
          campaign_id: string
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          media_attachments?: Json | null
          title: string
          update_type: string
        }
        Update: {
          author_id?: string
          campaign_id?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          media_attachments?: Json | null
          title?: string
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_updates_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          allow_anonymous_donations: boolean | null
          category: string
          created_at: string
          creator_id: string
          currency: string | null
          current_amount: number | null
          custom_fields: Json | null
          description: string | null
          enable_comments: boolean | null
          enable_updates: boolean | null
          end_date: string | null
          featured_image: string | null
          gallery_images: Json | null
          goal_amount: number | null
          goal_type: string
          id: string
          location: string | null
          organization_type: string
          organizer: string | null
          promotion_budget: number | null
          social_links: Json | null
          start_date: string
          status: string
          story: string | null
          tags: string[] | null
          title: string
          total_shares: number | null
          total_views: number | null
          updated_at: string
          urgency: string
          visibility: string
        }
        Insert: {
          allow_anonymous_donations?: boolean | null
          category: string
          created_at?: string
          creator_id: string
          currency?: string | null
          current_amount?: number | null
          custom_fields?: Json | null
          description?: string | null
          enable_comments?: boolean | null
          enable_updates?: boolean | null
          end_date?: string | null
          featured_image?: string | null
          gallery_images?: Json | null
          goal_amount?: number | null
          goal_type: string
          id?: string
          location?: string | null
          organization_type: string
          organizer?: string | null
          promotion_budget?: number | null
          social_links?: Json | null
          start_date?: string
          status?: string
          story?: string | null
          tags?: string[] | null
          title: string
          total_shares?: number | null
          total_views?: number | null
          updated_at?: string
          urgency?: string
          visibility?: string
        }
        Update: {
          allow_anonymous_donations?: boolean | null
          category?: string
          created_at?: string
          creator_id?: string
          currency?: string | null
          current_amount?: number | null
          custom_fields?: Json | null
          description?: string | null
          enable_comments?: boolean | null
          enable_updates?: boolean | null
          end_date?: string | null
          featured_image?: string | null
          gallery_images?: Json | null
          goal_amount?: number | null
          goal_type?: string
          id?: string
          location?: string | null
          organization_type?: string
          organizer?: string | null
          promotion_budget?: number | null
          social_links?: Json | null
          start_date?: string
          status?: string
          story?: string | null
          tags?: string[] | null
          title?: string
          total_shares?: number | null
          total_views?: number | null
          updated_at?: string
          urgency?: string
          visibility?: string
        }
        Relationships: []
      }
      carbon_footprint_data: {
        Row: {
          activity_data: number
          activity_unit: string
          co2_equivalent: number
          created_at: string
          created_by: string | null
          emission_factor: number
          emission_source: string
          id: string
          notes: string | null
          organization_id: string | null
          reporting_period: string
          scope_type: number
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          activity_data: number
          activity_unit: string
          co2_equivalent: number
          created_at?: string
          created_by?: string | null
          emission_factor: number
          emission_source: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          reporting_period: string
          scope_type: number
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          activity_data?: number
          activity_unit?: string
          co2_equivalent?: number
          created_at?: string
          created_by?: string | null
          emission_factor?: number
          emission_source?: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          reporting_period?: string
          scope_type?: number
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_footprint_data_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_footprint_data_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_interactions"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_appeals: {
        Row: {
          appeal_reason: string
          created_at: string
          id: string
          report_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appeal_reason: string
          created_at?: string
          id?: string
          report_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appeal_reason?: string
          created_at?: string
          id?: string
          report_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_appeals_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          content_id: string
          content_owner_id: string | null
          content_type: string
          created_at: string
          details: string | null
          id: string
          reason: string
          reported_by: string
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          content_id: string
          content_owner_id?: string | null
          content_type: string
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reported_by: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          content_id?: string
          content_owner_id?: string | null
          content_type?: string
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reported_by?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      corporate_partnerships: {
        Row: {
          benefits_offered: string | null
          company_name: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          documents: Json | null
          end_date: string | null
          id: string
          notes: string | null
          organization_id: string
          partnership_type: string | null
          partnership_value: number | null
          renewal_date: string | null
          requirements: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          benefits_offered?: string | null
          company_name: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          partnership_type?: string | null
          partnership_value?: number | null
          renewal_date?: string | null
          requirements?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          benefits_offered?: string | null
          company_name?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          partnership_type?: string | null
          partnership_value?: number | null
          renewal_date?: string | null
          requirements?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      csr_initiatives: {
        Row: {
          actual_beneficiaries: number | null
          budget_allocated: number | null
          budget_spent: number | null
          category: string
          created_at: string
          description: string
          end_date: string | null
          id: string
          impact_metrics: Json | null
          organization_id: string
          sdg_goals: string[] | null
          start_date: string | null
          status: string
          target_beneficiaries: number | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_beneficiaries?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          category?: string
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          impact_metrics?: Json | null
          organization_id: string
          sdg_goals?: string[] | null
          start_date?: string | null
          status?: string
          target_beneficiaries?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_beneficiaries?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          category?: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          impact_metrics?: Json | null
          organization_id?: string
          sdg_goals?: string[] | null
          start_date?: string | null
          status?: string
          target_beneficiaries?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "csr_initiatives_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          address: Json | null
          average_donation: number | null
          communication_preferences: Json | null
          created_at: string | null
          donation_count: number | null
          donor_status: string | null
          donor_type: string | null
          email: string
          first_donation_date: string | null
          first_name: string | null
          id: string
          last_donation_date: string | null
          last_name: string | null
          notes: string | null
          organization_id: string
          phone: string | null
          preferred_contact_method: string | null
          tags: string[] | null
          total_donated: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          average_donation?: number | null
          communication_preferences?: Json | null
          created_at?: string | null
          donation_count?: number | null
          donor_status?: string | null
          donor_type?: string | null
          email: string
          first_donation_date?: string | null
          first_name?: string | null
          id?: string
          last_donation_date?: string | null
          last_name?: string | null
          notes?: string | null
          organization_id: string
          phone?: string | null
          preferred_contact_method?: string | null
          tags?: string[] | null
          total_donated?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          average_donation?: number | null
          communication_preferences?: Json | null
          created_at?: string | null
          donation_count?: number | null
          donor_status?: string | null
          donor_type?: string | null
          email?: string
          first_donation_date?: string | null
          first_name?: string | null
          id?: string
          last_donation_date?: string | null
          last_name?: string | null
          notes?: string | null
          organization_id?: string
          phone?: string | null
          preferred_contact_method?: string | null
          tags?: string[] | null
          total_donated?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      employee_engagement: {
        Row: {
          activity_type: string
          completed_at: string | null
          created_at: string
          description: string | null
          employee_id: string
          hours_contributed: number
          id: string
          impact_points: number
          organization_id: string
          title: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          employee_id: string
          hours_contributed?: number
          id?: string
          impact_points?: number
          organization_id: string
          title: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          employee_id?: string
          hours_contributed?: number
          id?: string
          impact_points?: number
          organization_id?: string
          title?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_engagement_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_announcements: {
        Row: {
          announcement_type: string | null
          content: string
          created_at: string | null
          created_by: string
          engagement_count: number | null
          id: string
          organization_id: string
          published_at: string | null
          target_audience: Json | null
          title: string
          view_count: number | null
        }
        Insert: {
          announcement_type?: string | null
          content: string
          created_at?: string | null
          created_by: string
          engagement_count?: number | null
          id?: string
          organization_id: string
          published_at?: string | null
          target_audience?: Json | null
          title: string
          view_count?: number | null
        }
        Update: {
          announcement_type?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          engagement_count?: number | null
          id?: string
          organization_id?: string
          published_at?: string | null
          target_audience?: Json | null
          title?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_announcements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_benchmarks: {
        Row: {
          benchmark_type: string
          created_at: string
          data_source: string | null
          geographical_scope: string | null
          id: string
          indicator_id: string
          industry_sector: string
          reporting_year: number
          sample_size: number | null
          unit: string | null
          updated_at: string
          value: number
        }
        Insert: {
          benchmark_type: string
          created_at?: string
          data_source?: string | null
          geographical_scope?: string | null
          id?: string
          indicator_id: string
          industry_sector: string
          reporting_year: number
          sample_size?: number | null
          unit?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          benchmark_type?: string
          created_at?: string
          data_source?: string | null
          geographical_scope?: string | null
          id?: string
          indicator_id?: string
          industry_sector?: string
          reporting_year?: number
          sample_size?: number | null
          unit?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      esg_compliance_reports: {
        Row: {
          approved_by: string | null
          created_at: string
          framework_id: string | null
          generated_by: string | null
          generated_data: Json | null
          id: string
          organization_id: string | null
          report_type: string
          report_url: string | null
          reporting_period_end: string
          reporting_period_start: string
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          framework_id?: string | null
          generated_by?: string | null
          generated_data?: Json | null
          id?: string
          organization_id?: string | null
          report_type: string
          report_url?: string | null
          reporting_period_end: string
          reporting_period_start: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          framework_id?: string | null
          generated_by?: string | null
          generated_data?: Json | null
          id?: string
          organization_id?: string | null
          report_type?: string
          report_url?: string | null
          reporting_period_end?: string
          reporting_period_start?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esg_compliance_reports_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_compliance_reports_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "esg_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_compliance_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_compliance_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_data_entries: {
        Row: {
          created_at: string
          created_by: string | null
          data_source: string | null
          id: string
          indicator_id: string
          notes: string | null
          organization_id: string
          reporting_period: string
          supporting_documents: Json | null
          text_value: string | null
          unit: string | null
          updated_at: string
          value: number | null
          verification_status: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_source?: string | null
          id?: string
          indicator_id: string
          notes?: string | null
          organization_id: string
          reporting_period: string
          supporting_documents?: Json | null
          text_value?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
          verification_status?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_source?: string | null
          id?: string
          indicator_id?: string
          notes?: string | null
          organization_id?: string
          reporting_period?: string
          supporting_documents?: Json | null
          text_value?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
          verification_status?: string | null
        }
        Relationships: []
      }
      esg_data_requests: {
        Row: {
          created_at: string | null
          created_by: string
          due_date: string | null
          framework_id: string | null
          id: string
          indicator_id: string | null
          organization_id: string
          priority: string | null
          reporting_period: string
          request_message: string | null
          requested_from_email: string | null
          requested_from_org_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          due_date?: string | null
          framework_id?: string | null
          id?: string
          indicator_id?: string | null
          organization_id: string
          priority?: string | null
          reporting_period: string
          request_message?: string | null
          requested_from_email?: string | null
          requested_from_org_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          due_date?: string | null
          framework_id?: string | null
          id?: string
          indicator_id?: string | null
          organization_id?: string
          priority?: string | null
          reporting_period?: string
          request_message?: string | null
          requested_from_email?: string | null
          requested_from_org_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_data_requests_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "esg_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_data_requests_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "esg_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_data_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_data_requests_requested_from_org_id_fkey"
            columns: ["requested_from_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_frameworks: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          official_url: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          official_url?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          official_url?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      esg_goals: {
        Row: {
          baseline_value: number | null
          baseline_year: number | null
          category: string
          created_at: string
          created_by: string | null
          current_value: number | null
          description: string | null
          goal_name: string
          id: string
          indicator_id: string | null
          milestones: Json | null
          organization_id: string
          priority_level: string | null
          progress_percentage: number | null
          responsible_team: string | null
          status: string | null
          target_unit: string | null
          target_value: number | null
          target_year: number
          updated_at: string
        }
        Insert: {
          baseline_value?: number | null
          baseline_year?: number | null
          category: string
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          goal_name: string
          id?: string
          indicator_id?: string | null
          milestones?: Json | null
          organization_id: string
          priority_level?: string | null
          progress_percentage?: number | null
          responsible_team?: string | null
          status?: string | null
          target_unit?: string | null
          target_value?: number | null
          target_year: number
          updated_at?: string
        }
        Update: {
          baseline_value?: number | null
          baseline_year?: number | null
          category?: string
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          goal_name?: string
          id?: string
          indicator_id?: string | null
          milestones?: Json | null
          organization_id?: string
          priority_level?: string | null
          progress_percentage?: number | null
          responsible_team?: string | null
          status?: string | null
          target_unit?: string | null
          target_value?: number | null
          target_year?: number
          updated_at?: string
        }
        Relationships: []
      }
      esg_indicators: {
        Row: {
          calculation_method: string | null
          category: string
          created_at: string
          description: string | null
          framework_id: string | null
          id: string
          indicator_code: string
          is_quantitative: boolean | null
          materiality_level: string | null
          name: string
          reporting_frequency: string | null
          subcategory: string | null
          unit_of_measurement: string | null
          updated_at: string
        }
        Insert: {
          calculation_method?: string | null
          category: string
          created_at?: string
          description?: string | null
          framework_id?: string | null
          id?: string
          indicator_code: string
          is_quantitative?: boolean | null
          materiality_level?: string | null
          name: string
          reporting_frequency?: string | null
          subcategory?: string | null
          unit_of_measurement?: string | null
          updated_at?: string
        }
        Update: {
          calculation_method?: string | null
          category?: string
          created_at?: string
          description?: string | null
          framework_id?: string | null
          id?: string
          indicator_code?: string
          is_quantitative?: boolean | null
          materiality_level?: string | null
          name?: string
          reporting_frequency?: string | null
          subcategory?: string | null
          unit_of_measurement?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esg_indicators_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "esg_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string
          data_sources: Json | null
          description: string
          estimated_cost_range: string | null
          id: string
          implementation_date: string | null
          implementation_effort: string | null
          organization_id: string
          potential_impact: string | null
          priority_score: number | null
          recommendation_type: string
          recommended_actions: Json | null
          related_indicators: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          data_sources?: Json | null
          description: string
          estimated_cost_range?: string | null
          id?: string
          implementation_date?: string | null
          implementation_effort?: string | null
          organization_id: string
          potential_impact?: string | null
          priority_score?: number | null
          recommendation_type: string
          recommended_actions?: Json | null
          related_indicators?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          data_sources?: Json | null
          description?: string
          estimated_cost_range?: string | null
          id?: string
          implementation_date?: string | null
          implementation_effort?: string | null
          organization_id?: string
          potential_impact?: string | null
          priority_score?: number | null
          recommendation_type?: string
          recommended_actions?: Json | null
          related_indicators?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      esg_reports: {
        Row: {
          approved_by: string | null
          cover_image: string | null
          created_at: string
          created_by: string | null
          executive_summary: string | null
          framework_version: string | null
          generated_content: string | null
          id: string
          organization_id: string
          published_at: string | null
          report_name: string
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status: string | null
          template_data: Json | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          executive_summary?: string | null
          framework_version?: string | null
          generated_content?: string | null
          id?: string
          organization_id: string
          published_at?: string | null
          report_name: string
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status?: string | null
          template_data?: Json | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          executive_summary?: string | null
          framework_version?: string | null
          generated_content?: string | null
          id?: string
          organization_id?: string
          published_at?: string | null
          report_name?: string
          report_type?: string
          reporting_period_end?: string
          reporting_period_start?: string
          status?: string | null
          template_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      esg_risks: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          impact_score: number | null
          last_reviewed: string | null
          mitigation_strategies: Json | null
          next_review_date: string | null
          organization_id: string
          owner_department: string | null
          probability_score: number | null
          residual_risk_score: number | null
          review_frequency: string | null
          risk_category: string
          risk_level: string | null
          risk_name: string
          risk_score: number | null
          risk_type: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          impact_score?: number | null
          last_reviewed?: string | null
          mitigation_strategies?: Json | null
          next_review_date?: string | null
          organization_id: string
          owner_department?: string | null
          probability_score?: number | null
          residual_risk_score?: number | null
          review_frequency?: string | null
          risk_category: string
          risk_level?: string | null
          risk_name: string
          risk_score?: number | null
          risk_type: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          impact_score?: number | null
          last_reviewed?: string | null
          mitigation_strategies?: Json | null
          next_review_date?: string | null
          organization_id?: string
          owner_department?: string | null
          probability_score?: number | null
          residual_risk_score?: number | null
          review_frequency?: string | null
          risk_category?: string
          risk_level?: string | null
          risk_name?: string
          risk_score?: number | null
          risk_type?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      esg_targets: {
        Row: {
          baseline_value: number | null
          baseline_year: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          indicator_id: string | null
          organization_id: string | null
          progress_percentage: number | null
          status: string | null
          target_name: string
          target_value: number | null
          target_year: number | null
          updated_at: string
        }
        Insert: {
          baseline_value?: number | null
          baseline_year?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          indicator_id?: string | null
          organization_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_name: string
          target_value?: number | null
          target_year?: number | null
          updated_at?: string
        }
        Update: {
          baseline_value?: number | null
          baseline_year?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          indicator_id?: string | null
          organization_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_name?: string
          target_value?: number | null
          target_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esg_targets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_targets_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "esg_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_targets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_verification_audit_log: {
        Row: {
          action_type: string
          contribution_id: string | null
          created_at: string | null
          id: string
          new_status: string | null
          notes: string | null
          performed_by: string
          previous_status: string | null
        }
        Insert: {
          action_type: string
          contribution_id?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          performed_by: string
          previous_status?: string | null
        }
        Update: {
          action_type?: string
          contribution_id?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          performed_by?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_verification_audit_log_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "stakeholder_data_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_submissions: {
        Row: {
          activity_id: string | null
          created_at: string
          evidence_type: string
          file_url: string | null
          id: string
          metadata: Json | null
          rejection_reason: string | null
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          evidence_type: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          rejection_reason?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          evidence_type?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_submissions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "impact_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_detection_log: {
        Row: {
          actual_value: number
          auto_flagged: boolean | null
          created_at: string
          detection_type: string
          id: string
          metadata: Json | null
          reviewed: boolean | null
          reviewer_id: string | null
          risk_score: number
          threshold_value: number
          time_window: string
          user_id: string
        }
        Insert: {
          actual_value: number
          auto_flagged?: boolean | null
          created_at?: string
          detection_type: string
          id?: string
          metadata?: Json | null
          reviewed?: boolean | null
          reviewer_id?: string | null
          risk_score?: number
          threshold_value: number
          time_window: string
          user_id: string
        }
        Update: {
          actual_value?: number
          auto_flagged?: boolean | null
          created_at?: string
          detection_type?: string
          id?: string
          metadata?: Json | null
          reviewed?: boolean | null
          reviewer_id?: string | null
          risk_score?: number
          threshold_value?: number
          time_window?: string
          user_id?: string
        }
        Relationships: []
      }
      grants: {
        Row: {
          amount_awarded: number | null
          amount_requested: number | null
          application_deadline: string | null
          application_requirements: string | null
          application_status: string | null
          created_at: string | null
          decision_date: string | null
          documents: Json | null
          eligibility_requirements: string | null
          focus_area: string | null
          funder_name: string
          grant_title: string
          grant_type: string | null
          id: string
          notes: string | null
          organization_id: string
          project_end_date: string | null
          project_start_date: string | null
          reporting_requirements: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_awarded?: number | null
          amount_requested?: number | null
          application_deadline?: string | null
          application_requirements?: string | null
          application_status?: string | null
          created_at?: string | null
          decision_date?: string | null
          documents?: Json | null
          eligibility_requirements?: string | null
          focus_area?: string | null
          funder_name: string
          grant_title: string
          grant_type?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          project_end_date?: string | null
          project_start_date?: string | null
          reporting_requirements?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_awarded?: number | null
          amount_requested?: number | null
          application_deadline?: string | null
          application_requirements?: string | null
          application_status?: string | null
          created_at?: string | null
          decision_date?: string | null
          documents?: Json | null
          eligibility_requirements?: string | null
          focus_area?: string | null
          funder_name?: string
          grant_title?: string
          grant_type?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          project_end_date?: string | null
          project_start_date?: string | null
          reporting_requirements?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          admin_id: string
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_private: boolean
          location: string | null
          name: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          admin_id: string
          category: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean
          location?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          admin_id?: string
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean
          location?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      help_completion_requests: {
        Row: {
          completion_evidence: Json | null
          created_at: string
          expires_at: string | null
          feedback_message: string | null
          feedback_rating: number | null
          helper_id: string
          helper_message: string | null
          id: string
          post_id: string
          requester_id: string
          reviewed_at: string | null
          status: string
        }
        Insert: {
          completion_evidence?: Json | null
          created_at?: string
          expires_at?: string | null
          feedback_message?: string | null
          feedback_rating?: number | null
          helper_id: string
          helper_message?: string | null
          id?: string
          post_id: string
          requester_id: string
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          completion_evidence?: Json | null
          created_at?: string
          expires_at?: string | null
          feedback_message?: string | null
          feedback_rating?: number | null
          helper_id?: string
          helper_message?: string | null
          id?: string
          post_id?: string
          requester_id?: string
          reviewed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_completion_requests_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_activities: {
        Row: {
          activity_type: string
          auto_verified: boolean | null
          confirmation_requested_at: string | null
          confirmation_status: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          description: string
          effort_level: number | null
          evidence_submitted: boolean | null
          hours_contributed: number | null
          id: string
          market_rate_used: number | null
          market_value_gbp: number | null
          metadata: Json | null
          organization_id: string | null
          points_conversion_rate: number | null
          points_earned: number
          post_id: string | null
          rejection_reason: string | null
          requires_evidence: boolean | null
          risk_score: number | null
          skill_category_id: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          activity_type: string
          auto_verified?: boolean | null
          confirmation_requested_at?: string | null
          confirmation_status?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          description: string
          effort_level?: number | null
          evidence_submitted?: boolean | null
          hours_contributed?: number | null
          id?: string
          market_rate_used?: number | null
          market_value_gbp?: number | null
          metadata?: Json | null
          organization_id?: string | null
          points_conversion_rate?: number | null
          points_earned?: number
          post_id?: string | null
          rejection_reason?: string | null
          requires_evidence?: boolean | null
          risk_score?: number | null
          skill_category_id?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          activity_type?: string
          auto_verified?: boolean | null
          confirmation_requested_at?: string | null
          confirmation_status?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          description?: string
          effort_level?: number | null
          evidence_submitted?: boolean | null
          hours_contributed?: number | null
          id?: string
          market_rate_used?: number | null
          market_value_gbp?: number | null
          metadata?: Json | null
          organization_id?: string | null
          points_conversion_rate?: number | null
          points_earned?: number
          post_id?: string | null
          rejection_reason?: string | null
          requires_evidence?: boolean | null
          risk_score?: number | null
          skill_category_id?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "impact_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impact_activities_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impact_activities_skill_category_id_fkey"
            columns: ["skill_category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_goals: {
        Row: {
          category: string
          created_at: string
          current_value: number | null
          deadline: string | null
          description: string | null
          id: string
          is_active: boolean | null
          target_value: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_value: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_value?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      impact_metrics: {
        Row: {
          average_rating: number | null
          calculated_at: string
          connections_count: number | null
          decay_applied_count: number | null
          donation_amount: number | null
          help_provided_count: number | null
          help_received_count: number | null
          id: string
          impact_score: number
          last_activity_date: string | null
          red_flag_count: number | null
          response_time_hours: number | null
          total_market_value_contributed: number | null
          trust_score: number
          user_id: string
          volunteer_hours: number | null
          xp_points: number | null
        }
        Insert: {
          average_rating?: number | null
          calculated_at?: string
          connections_count?: number | null
          decay_applied_count?: number | null
          donation_amount?: number | null
          help_provided_count?: number | null
          help_received_count?: number | null
          id?: string
          impact_score?: number
          last_activity_date?: string | null
          red_flag_count?: number | null
          response_time_hours?: number | null
          total_market_value_contributed?: number | null
          trust_score?: number
          user_id: string
          volunteer_hours?: number | null
          xp_points?: number | null
        }
        Update: {
          average_rating?: number | null
          calculated_at?: string
          connections_count?: number | null
          decay_applied_count?: number | null
          donation_amount?: number | null
          help_provided_count?: number | null
          help_received_count?: number | null
          id?: string
          impact_score?: number
          last_activity_date?: string | null
          red_flag_count?: number | null
          response_time_hours?: number | null
          total_market_value_contributed?: number | null
          trust_score?: number
          user_id?: string
          volunteer_hours?: number | null
          xp_points?: number | null
        }
        Relationships: []
      }
      materiality_assessments: {
        Row: {
          action_plan: string | null
          assessment_year: number
          business_impact: number
          created_at: string
          created_by: string | null
          id: string
          indicator_id: string | null
          organization_id: string | null
          priority_level: string | null
          stakeholder_feedback: string | null
          stakeholder_importance: number
          updated_at: string
        }
        Insert: {
          action_plan?: string | null
          assessment_year: number
          business_impact: number
          created_at?: string
          created_by?: string | null
          id?: string
          indicator_id?: string | null
          organization_id?: string | null
          priority_level?: string | null
          stakeholder_feedback?: string | null
          stakeholder_importance: number
          updated_at?: string
        }
        Update: {
          action_plan?: string | null
          assessment_year?: number
          business_impact?: number
          created_at?: string
          created_by?: string | null
          id?: string
          indicator_id?: string | null
          organization_id?: string | null
          priority_level?: string | null
          stakeholder_feedback?: string | null
          stakeholder_importance?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_assessments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_assessments_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "esg_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      message_access_log: {
        Row: {
          access_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          message_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          message_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          message_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_name: string | null
          attachment_size: number | null
          attachment_type: string | null
          attachment_url: string | null
          content: string
          created_at: string
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_read: boolean
          message_type: string
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_type?: string | null
          attachment_url?: string | null
          content: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_read?: boolean
          message_type?: string
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_read?: boolean
          message_type?: string
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_analytics: {
        Row: {
          created_at: string | null
          event_metadata: Json | null
          event_type: string
          id: string
          notification_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_metadata?: Json | null
          event_type: string
          id?: string
          notification_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_metadata?: Json | null
          event_type?: string
          id?: string
          notification_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_analytics_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_delivery_log: {
        Row: {
          action_taken: string | null
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_method: string
          device_info: Json | null
          id: string
          notification_id: string
          opened_at: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_method: string
          device_info?: Json | null
          id?: string
          notification_id: string
          opened_at?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_method?: string
          device_info?: Json | null
          id?: string
          notification_id?: string
          opened_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_delivery_log_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_filters: {
        Row: {
          created_at: string | null
          filter_config: Json
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filter_config: Json
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filter_config?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          default_action_type: string | null
          default_priority: string | null
          description: string | null
          id: string
          is_active: boolean | null
          message_template: string
          metadata_schema: Json | null
          name: string
          title_template: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          default_action_type?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_template: string
          metadata_schema?: Json | null
          name: string
          title_template: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          default_action_type?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: string
          metadata_schema?: Json | null
          name?: string
          title_template?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_type: string | null
          action_url: string | null
          created_at: string
          delivery_status: string | null
          group_key: string | null
          grouped_with: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          priority: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string | null
          title: string
          type: string
        }
        Insert: {
          action_type?: string | null
          action_url?: string | null
          created_at?: string
          delivery_status?: string | null
          group_key?: string | null
          grouped_with?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          title: string
          type: string
        }
        Update: {
          action_type?: string | null
          action_url?: string | null
          created_at?: string
          delivery_status?: string | null
          group_key?: string | null
          grouped_with?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_grouped_with_fkey"
            columns: ["grouped_with"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_esg_data: {
        Row: {
          collected_by: string | null
          created_at: string
          data_source: string | null
          id: string
          indicator_id: string | null
          notes: string | null
          organization_id: string | null
          reporting_period: string
          text_value: string | null
          unit: string | null
          updated_at: string
          value: number | null
          verification_status: string | null
        }
        Insert: {
          collected_by?: string | null
          created_at?: string
          data_source?: string | null
          id?: string
          indicator_id?: string | null
          notes?: string | null
          organization_id?: string | null
          reporting_period: string
          text_value?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
          verification_status?: string | null
        }
        Update: {
          collected_by?: string | null
          created_at?: string
          data_source?: string | null
          id?: string
          indicator_id?: string | null
          notes?: string | null
          organization_id?: string | null
          reporting_period?: string
          text_value?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_esg_data_collected_by_fkey"
            columns: ["collected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_esg_data_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "esg_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_esg_data_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          esg_context: Json | null
          expires_at: string | null
          id: string
          invitation_token: string
          invitation_type: string | null
          invited_by: string
          organization_id: string
          role: string
          status: string
          title: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          esg_context?: Json | null
          expires_at?: string | null
          id?: string
          invitation_token?: string
          invitation_type?: string | null
          invited_by: string
          organization_id: string
          role?: string
          status?: string
          title?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          esg_context?: Json | null
          expires_at?: string | null
          id?: string
          invitation_token?: string
          invitation_type?: string | null
          invited_by?: string
          organization_id?: string
          role?: string
          status?: string
          title?: string | null
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          department: string | null
          end_date: string | null
          esg_role: string | null
          id: string
          is_active: boolean | null
          is_public: boolean | null
          organization_id: string
          role: string
          start_date: string | null
          title: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          end_date?: string | null
          esg_role?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          organization_id: string
          role?: string
          start_date?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          end_date?: string | null
          esg_role?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          organization_id?: string
          role?: string
          start_date?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_preferences: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          preference_type: string
          preference_value: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          preference_type: string
          preference_value: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          preference_type?: string
          preference_value?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          analytics_preferences: Json | null
          branding: Json | null
          communication_templates: Json | null
          created_at: string | null
          donation_settings: Json | null
          id: string
          integration_settings: Json | null
          notification_preferences: Json | null
          organization_id: string
          updated_at: string | null
          volunteer_settings: Json | null
        }
        Insert: {
          analytics_preferences?: Json | null
          branding?: Json | null
          communication_templates?: Json | null
          created_at?: string | null
          donation_settings?: Json | null
          id?: string
          integration_settings?: Json | null
          notification_preferences?: Json | null
          organization_id: string
          updated_at?: string | null
          volunteer_settings?: Json | null
        }
        Update: {
          analytics_preferences?: Json | null
          branding?: Json | null
          communication_templates?: Json | null
          created_at?: string | null
          donation_settings?: Json | null
          id?: string
          integration_settings?: Json | null
          notification_preferences?: Json | null
          organization_id?: string
          updated_at?: string | null
          volunteer_settings?: Json | null
        }
        Relationships: []
      }
      organization_team_members: {
        Row: {
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          organization_id: string
          permissions: Json | null
          role: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          organization_id: string
          permissions?: Json | null
          role?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          organization_id?: string
          permissions?: Json | null
          role?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string
          description: string | null
          established_year: number | null
          id: string
          is_verified: boolean | null
          location: string | null
          mission: string | null
          name: string
          organization_type: string
          registration_number: string | null
          social_links: Json | null
          tags: string[] | null
          updated_at: string
          verification_status: string | null
          vision: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          established_year?: number | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          mission?: string | null
          name: string
          organization_type: string
          registration_number?: string | null
          social_links?: Json | null
          tags?: string[] | null
          updated_at?: string
          verification_status?: string | null
          vision?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          established_year?: number | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          mission?: string | null
          name?: string
          organization_type?: string
          registration_number?: string | null
          social_links?: Json | null
          tags?: string[] | null
          updated_at?: string
          verification_status?: string | null
          vision?: string | null
          website?: string | null
        }
        Relationships: []
      }
      point_decay_log: {
        Row: {
          applied_at: string
          decay_percentage: number
          id: string
          last_activity_date: string | null
          points_after: number
          points_before: number
          reason: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          decay_percentage?: number
          id?: string
          last_activity_date?: string | null
          points_after?: number
          points_before?: number
          reason?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          decay_percentage?: number
          id?: string
          last_activity_date?: string | null
          points_after?: number
          points_before?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      point_redemptions: {
        Row: {
          id: string
          metadata: Json | null
          points_cost: number
          redeemed_at: string
          reward_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          points_cost: number
          redeemed_at?: string
          reward_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          points_cost?: number
          redeemed_at?: string
          reward_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      points_configuration: {
        Row: {
          category: string
          config_key: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          config_key: string
          config_value: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          config_key?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      post_interactions: {
        Row: {
          content: string | null
          created_at: string
          edited_at: string | null
          id: string
          interaction_type: string
          is_deleted: boolean | null
          parent_comment_id: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          edited_at?: string | null
          id?: string
          interaction_type: string
          is_deleted?: boolean | null
          parent_comment_id?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          edited_at?: string | null
          id?: string
          interaction_type?: string
          is_deleted?: boolean | null
          parent_comment_id?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_interactions_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          location: string | null
          media_urls: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
          urgency: string
          visibility: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          media_urls?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          urgency?: string
          visibility?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          media_urls?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          urgency?: string
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          avatar_url: string | null
          banner_type: string | null
          banner_url: string | null
          bio: string | null
          created_at: string | null
          facebook: string | null
          first_name: string | null
          id: string
          instagram: string | null
          interests: string[] | null
          last_name: string | null
          linkedin: string | null
          location: string | null
          phone: string | null
          skills: string[] | null
          twitter: string | null
          updated_at: string | null
          waitlist_approved_by: string | null
          waitlist_notes: string | null
          waitlist_status: Database["public"]["Enums"]["waitlist_status"] | null
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          avatar_url?: string | null
          banner_type?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          facebook?: string | null
          first_name?: string | null
          id: string
          instagram?: string | null
          interests?: string[] | null
          last_name?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          twitter?: string | null
          updated_at?: string | null
          waitlist_approved_by?: string | null
          waitlist_notes?: string | null
          waitlist_status?:
            | Database["public"]["Enums"]["waitlist_status"]
            | null
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          avatar_url?: string | null
          banner_type?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          facebook?: string | null
          first_name?: string | null
          id?: string
          instagram?: string | null
          interests?: string[] | null
          last_name?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          twitter?: string | null
          updated_at?: string | null
          waitlist_approved_by?: string | null
          waitlist_notes?: string | null
          waitlist_status?:
            | Database["public"]["Enums"]["waitlist_status"]
            | null
          website?: string | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          agree_to_terms: boolean
          completed_at: string
          created_at: string
          id: string
          motivation: string | null
          response_data: Json
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          agree_to_terms?: boolean
          completed_at?: string
          created_at?: string
          id?: string
          motivation?: string | null
          response_data: Json
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          agree_to_terms?: boolean
          completed_at?: string
          created_at?: string
          id?: string
          motivation?: string | null
          response_data?: Json
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      rate_limit_buckets: {
        Row: {
          bucket_type: string
          created_at: string | null
          id: string
          last_refill: string | null
          max_tokens: number
          refill_rate: number
          tokens: number
          user_id: string | null
        }
        Insert: {
          bucket_type: string
          created_at?: string | null
          id?: string
          last_refill?: string | null
          max_tokens: number
          refill_rate?: number
          tokens?: number
          user_id?: string | null
        }
        Update: {
          bucket_type?: string
          created_at?: string | null
          id?: string
          last_refill?: string | null
          max_tokens?: number
          refill_rate?: number
          tokens?: number
          user_id?: string | null
        }
        Relationships: []
      }
      recommendation_cache: {
        Row: {
          confidence_score: number
          created_at: string
          expires_at: string | null
          id: string
          metadata: Json | null
          reasoning: string | null
          recommendation_type: string
          target_id: string
          user_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type: string
          target_id: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type?: string
          target_id?: string
          user_id?: string
        }
        Relationships: []
      }
      red_flags: {
        Row: {
          created_at: string
          description: string
          evidence: Json | null
          flag_type: string
          flagged_by: string | null
          id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          evidence?: Json | null
          flag_type: string
          flagged_by?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          evidence?: Json | null
          flag_type?: string
          flagged_by?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      relive_stories: {
        Row: {
          category: string
          completed_date: string | null
          cover_image: string | null
          created_at: string
          emotions: string[] | null
          id: string
          post_id: string
          preview_text: string | null
          start_date: string
          title: string
          total_impact: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          completed_date?: string | null
          cover_image?: string | null
          created_at?: string
          emotions?: string[] | null
          id?: string
          post_id: string
          preview_text?: string | null
          start_date: string
          title: string
          total_impact?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          completed_date?: string | null
          cover_image?: string | null
          created_at?: string
          emotions?: string[] | null
          id?: string
          post_id?: string
          preview_text?: string | null
          start_date?: string
          title?: string
          total_impact?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relive_stories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          report_type: string
          reported_post_id: string | null
          reported_user_id: string | null
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          report_type: string
          reported_post_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          report_type?: string
          reported_post_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_post_id_fkey"
            columns: ["reported_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_space_helper_applications: {
        Row: {
          application_status: string
          availability_commitment: string | null
          created_at: string
          experience_description: string | null
          id: string
          personal_statement: string | null
          preferred_specializations: string[] | null
          qualifications: Json | null
          reference_contacts: Json | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_status?: string
          availability_commitment?: string | null
          created_at?: string
          experience_description?: string | null
          id?: string
          personal_statement?: string | null
          preferred_specializations?: string[] | null
          qualifications?: Json | null
          reference_contacts?: Json | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_status?: string
          availability_commitment?: string | null
          created_at?: string
          experience_description?: string | null
          id?: string
          personal_statement?: string | null
          preferred_specializations?: string[] | null
          qualifications?: Json | null
          reference_contacts?: Json | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      safe_space_helper_training_progress: {
        Row: {
          answers: Json | null
          attempts: number
          can_retry_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          last_attempt_at: string | null
          module_id: string
          score: number | null
          status: string
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          attempts?: number
          can_retry_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          module_id: string
          score?: number | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          attempts?: number
          can_retry_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          module_id?: string
          score?: number | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safe_space_helper_training_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "safe_space_training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_space_helpers: {
        Row: {
          created_at: string
          current_sessions: number
          id: string
          is_available: boolean
          last_active: string | null
          max_concurrent_sessions: number
          professional_credentials: Json | null
          specializations: string[]
          updated_at: string
          user_id: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string
          current_sessions?: number
          id?: string
          is_available?: boolean
          last_active?: string | null
          max_concurrent_sessions?: number
          professional_credentials?: Json | null
          specializations?: string[]
          updated_at?: string
          user_id?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string
          current_sessions?: number
          id?: string
          is_available?: boolean
          last_active?: string | null
          max_concurrent_sessions?: number
          professional_credentials?: Json | null
          specializations?: string[]
          updated_at?: string
          user_id?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      safe_space_messages: {
        Row: {
          content: string
          created_at: string
          expires_at: string
          id: string
          message_type: string
          sender_role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string
          id?: string
          message_type?: string
          sender_role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string
          id?: string
          message_type?: string
          sender_role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safe_space_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "safe_space_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_space_queue: {
        Row: {
          additional_info: string | null
          created_at: string
          estimated_wait_minutes: number | null
          id: string
          issue_category: string
          position_in_queue: number | null
          preferred_helper_type: string | null
          requester_id: string | null
          urgency_level: string
        }
        Insert: {
          additional_info?: string | null
          created_at?: string
          estimated_wait_minutes?: number | null
          id?: string
          issue_category: string
          position_in_queue?: number | null
          preferred_helper_type?: string | null
          requester_id?: string | null
          urgency_level?: string
        }
        Update: {
          additional_info?: string | null
          created_at?: string
          estimated_wait_minutes?: number | null
          id?: string
          issue_category?: string
          position_in_queue?: number | null
          preferred_helper_type?: string | null
          requester_id?: string | null
          urgency_level?: string
        }
        Relationships: []
      }
      safe_space_reference_checks: {
        Row: {
          application_id: string
          created_at: string
          expires_at: string
          id: string
          questionnaire_responses: Json | null
          reference_email: string
          reference_name: string
          reference_phone: string | null
          relationship: string
          status: string
          submitted_at: string | null
          verification_token: string
        }
        Insert: {
          application_id: string
          created_at?: string
          expires_at?: string
          id?: string
          questionnaire_responses?: Json | null
          reference_email: string
          reference_name: string
          reference_phone?: string | null
          relationship: string
          status?: string
          submitted_at?: string | null
          verification_token?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          questionnaire_responses?: Json | null
          reference_email?: string
          reference_name?: string
          reference_phone?: string | null
          relationship?: string
          status?: string
          submitted_at?: string | null
          verification_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "safe_space_reference_checks_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "safe_space_helper_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_space_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          feedback_rating: number | null
          helper_id: string | null
          id: string
          issue_category: string
          metadata: Json | null
          requester_id: string | null
          session_token: string
          started_at: string | null
          status: string
          urgency_level: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          feedback_rating?: number | null
          helper_id?: string | null
          id?: string
          issue_category: string
          metadata?: Json | null
          requester_id?: string | null
          session_token: string
          started_at?: string | null
          status?: string
          urgency_level?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          feedback_rating?: number | null
          helper_id?: string | null
          id?: string
          issue_category?: string
          metadata?: Json | null
          requester_id?: string | null
          session_token?: string
          started_at?: string | null
          status?: string
          urgency_level?: string
        }
        Relationships: []
      }
      safe_space_training_modules: {
        Row: {
          category: string
          content_html: string | null
          content_type: string
          content_url: string | null
          created_at: string
          description: string
          difficulty_level: string
          duration_minutes: number
          id: string
          is_active: boolean
          is_required: boolean
          max_attempts: number | null
          order_sequence: number
          passing_score: number | null
          question_count: number
          quiz_questions: Json | null
          retry_delay_days: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content_html?: string | null
          content_type: string
          content_url?: string | null
          created_at?: string
          description: string
          difficulty_level?: string
          duration_minutes: number
          id?: string
          is_active?: boolean
          is_required?: boolean
          max_attempts?: number | null
          order_sequence: number
          passing_score?: number | null
          question_count?: number
          quiz_questions?: Json | null
          retry_delay_days?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content_html?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          description?: string
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          is_required?: boolean
          max_attempts?: number | null
          order_sequence?: number
          passing_score?: number | null
          question_count?: number
          quiz_questions?: Json | null
          retry_delay_days?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      safe_space_verification_documents: {
        Row: {
          application_id: string | null
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          metadata: Json | null
          mime_type: string
          rejection_reason: string | null
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          metadata?: Json | null
          mime_type: string
          rejection_reason?: string | null
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          metadata?: Json | null
          mime_type?: string
          rejection_reason?: string | null
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safe_space_verification_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "safe_space_helper_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_notifications: {
        Row: {
          action_type: string | null
          action_url: string | null
          created_at: string | null
          error_message: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          recipient_id: string
          scheduled_for: string
          sender_id: string | null
          sent_at: string | null
          status: string | null
          template_id: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          action_type?: string | null
          action_url?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          recipient_id: string
          scheduled_for: string
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          action_type?: string | null
          action_url?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          recipient_id?: string
          scheduled_for?: string
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_challenges: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          max_progress: number | null
          point_multiplier: number | null
          reward_description: string | null
          start_date: string
          target_categories: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_progress?: number | null
          point_multiplier?: number | null
          reward_description?: string | null
          start_date: string
          target_categories?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_progress?: number | null
          point_multiplier?: number | null
          reward_description?: string | null
          start_date?: string
          target_categories?: string[] | null
          title?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          category: string
          created_at: string
          description: string | null
          evidence_required: boolean | null
          id: string
          market_rate_gbp: number
          name: string
          requires_verification: boolean | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          evidence_required?: boolean | null
          id?: string
          market_rate_gbp: number
          name: string
          requires_verification?: boolean | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          evidence_required?: boolean | null
          id?: string
          market_rate_gbp?: number
          name?: string
          requires_verification?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      stakeholder_data_contributions: {
        Row: {
          contribution_status: string | null
          contributor_org_id: string | null
          contributor_user_id: string | null
          created_at: string | null
          data_request_id: string | null
          esg_data_id: string | null
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_requested_notes: string | null
          submitted_at: string | null
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          contribution_status?: string | null
          contributor_org_id?: string | null
          contributor_user_id?: string | null
          created_at?: string | null
          data_request_id?: string | null
          esg_data_id?: string | null
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_requested_notes?: string | null
          submitted_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          contribution_status?: string | null
          contributor_org_id?: string | null
          contributor_user_id?: string | null
          created_at?: string | null
          data_request_id?: string | null
          esg_data_id?: string | null
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_requested_notes?: string | null
          submitted_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stakeholder_data_contributions_contributor_org_id_fkey"
            columns: ["contributor_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_data_contributions_data_request_id_fkey"
            columns: ["data_request_id"]
            isOneToOne: false
            referencedRelation: "esg_data_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_data_contributions_esg_data_id_fkey"
            columns: ["esg_data_id"]
            isOneToOne: false
            referencedRelation: "organization_esg_data"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholder_engagement_metrics: {
        Row: {
          created_at: string
          created_by: string | null
          engagement_method: string | null
          id: string
          measurement_date: string
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
          notes: string | null
          organization_id: string | null
          response_rate: number | null
          satisfaction_score: number | null
          stakeholder_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          engagement_method?: string | null
          id?: string
          measurement_date: string
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
          notes?: string | null
          organization_id?: string | null
          response_rate?: number | null
          satisfaction_score?: number | null
          stakeholder_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          engagement_method?: string | null
          id?: string
          measurement_date?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
          notes?: string | null
          organization_id?: string | null
          response_rate?: number | null
          satisfaction_score?: number | null
          stakeholder_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stakeholder_engagement_metrics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_engagement_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholder_groups: {
        Row: {
          contact_frequency: string | null
          created_at: string
          description: string | null
          engagement_methods: Json | null
          group_name: string
          id: string
          influence_level: string | null
          is_active: boolean | null
          key_interests: Json | null
          organization_id: string
          stakeholder_type: string
          updated_at: string
        }
        Insert: {
          contact_frequency?: string | null
          created_at?: string
          description?: string | null
          engagement_methods?: Json | null
          group_name: string
          id?: string
          influence_level?: string | null
          is_active?: boolean | null
          key_interests?: Json | null
          organization_id: string
          stakeholder_type: string
          updated_at?: string
        }
        Update: {
          contact_frequency?: string | null
          created_at?: string
          description?: string | null
          engagement_methods?: Json | null
          group_name?: string
          id?: string
          influence_level?: string | null
          is_active?: boolean | null
          key_interests?: Json | null
          organization_id?: string
          stakeholder_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      story_participants: {
        Row: {
          id: string
          joined_at: string
          participation_type: string
          post_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          participation_type: string
          post_id: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          participation_type?: string
          post_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_participants_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_updates: {
        Row: {
          author_id: string
          content: string
          created_at: string
          emotions: string[] | null
          id: string
          media_type: string | null
          media_url: string | null
          post_id: string
          stats: Json | null
          title: string
          update_type: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          emotions?: string[] | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          post_id: string
          stats?: Json | null
          title: string
          update_type: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          emotions?: string[] | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          post_id?: string
          stats?: Json | null
          title?: string
          update_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_updates_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      support_actions: {
        Row: {
          action_type: string
          created_at: string
          id: string
          metadata: Json | null
          post_id: string
          status: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          post_id: string
          status?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          post_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_actions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_domains: {
        Row: {
          actions_count: number
          average_rating: number | null
          created_at: string
          domain: string
          domain_score: number
          id: string
          last_activity: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actions_count?: number
          average_rating?: number | null
          created_at?: string
          domain: string
          domain_score?: number
          id?: string
          last_activity?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actions_count?: number
          average_rating?: number | null
          created_at?: string
          domain?: string
          domain_score?: number
          id?: string
          last_activity?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trust_score_history: {
        Row: {
          change_reason: string
          created_at: string
          id: string
          new_score: number
          previous_score: number | null
          user_id: string
          verification_id: string | null
        }
        Insert: {
          change_reason: string
          created_at?: string
          id?: string
          new_score: number
          previous_score?: number | null
          user_id: string
          verification_id?: string | null
        }
        Update: {
          change_reason?: string
          created_at?: string
          id?: string
          new_score?: number
          previous_score?: number | null
          user_id?: string
          verification_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trust_score_history_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "user_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_indicators: {
        Row: {
          conversation_partner_id: string
          id: string
          is_typing: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conversation_partner_id: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conversation_partner_id?: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          max_progress: number | null
          metadata: Json | null
          progress: number | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          max_progress?: number | null
          metadata?: Json | null
          progress?: number | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          max_progress?: number | null
          metadata?: Json | null
          progress?: number | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          title: string
          user_id: string
          visibility: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
          visibility?: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          metadata: Json | null
          progress: number | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          progress?: number | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "seasonal_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interaction_scores: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          score_value: number | null
          target_post_id: string | null
          target_user_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          score_value?: number | null
          target_post_id?: string | null
          target_user_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          score_value?: number | null
          target_post_id?: string | null
          target_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interaction_scores_target_post_id_fkey"
            columns: ["target_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preference_type: string
          preference_value: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          preference_type: string
          preference_value: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          preference_type?: string
          preference_value?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          allow_direct_messages: string
          allow_tagging: boolean
          created_at: string
          id: string
          profile_visibility: string
          show_activity_feed: boolean
          show_email: boolean
          show_location: boolean
          show_online_status: boolean
          show_phone: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_direct_messages?: string
          allow_tagging?: boolean
          created_at?: string
          id?: string
          profile_visibility?: string
          show_activity_feed?: boolean
          show_email?: boolean
          show_location?: boolean
          show_online_status?: boolean
          show_phone?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_direct_messages?: string
          allow_tagging?: boolean
          created_at?: string
          id?: string
          profile_visibility?: string
          show_activity_feed?: boolean
          show_email?: boolean
          show_location?: boolean
          show_online_status?: boolean
          show_phone?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_verifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          application_message: string | null
          applied_at: string | null
          availability: string | null
          background_check_status: string | null
          emergency_contact: Json | null
          end_date: string | null
          hours_logged: number | null
          id: string
          opportunity_id: string
          relevant_experience: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string | null
          status: string | null
          training_status: string | null
          user_id: string
        }
        Insert: {
          application_message?: string | null
          applied_at?: string | null
          availability?: string | null
          background_check_status?: string | null
          emergency_contact?: Json | null
          end_date?: string | null
          hours_logged?: number | null
          id?: string
          opportunity_id: string
          relevant_experience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string | null
          status?: string | null
          training_status?: string | null
          user_id: string
        }
        Update: {
          application_message?: string | null
          applied_at?: string | null
          availability?: string | null
          background_check_status?: string | null
          emergency_contact?: Json | null
          end_date?: string | null
          hours_logged?: number | null
          id?: string
          opportunity_id?: string
          relevant_experience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string | null
          status?: string | null
          training_status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      volunteer_interests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          post_id: string
          status: string
          updated_at: string
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          post_id: string
          status?: string
          updated_at?: string
          volunteer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          post_id?: string
          status?: string
          updated_at?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_interests_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_interests_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_opportunities: {
        Row: {
          application_deadline: string | null
          background_check_required: boolean | null
          created_at: string | null
          created_by: string
          current_volunteers: number | null
          description: string
          end_date: string | null
          id: string
          is_remote: boolean | null
          location: string | null
          max_volunteers: number | null
          organization_id: string
          requirements: string | null
          skills_needed: string[] | null
          start_date: string | null
          status: string | null
          time_commitment: string | null
          title: string
          training_required: boolean | null
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          background_check_required?: boolean | null
          created_at?: string | null
          created_by: string
          current_volunteers?: number | null
          description: string
          end_date?: string | null
          id?: string
          is_remote?: boolean | null
          location?: string | null
          max_volunteers?: number | null
          organization_id: string
          requirements?: string | null
          skills_needed?: string[] | null
          start_date?: string | null
          status?: string | null
          time_commitment?: string | null
          title: string
          training_required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          background_check_required?: boolean | null
          created_at?: string | null
          created_by?: string
          current_volunteers?: number | null
          description?: string
          end_date?: string | null
          id?: string
          is_remote?: boolean | null
          location?: string | null
          max_volunteers?: number | null
          organization_id?: string
          requirements?: string | null
          skills_needed?: string[] | null
          start_date?: string | null
          status?: string | null
          time_commitment?: string | null
          title?: string
          training_required?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      volunteer_work_notifications: {
        Row: {
          activity_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          notification_type: string
          recipient_id: string
          volunteer_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          notification_type: string
          recipient_id: string
          volunteer_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          notification_type?: string
          recipient_id?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_work_notifications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "impact_activities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_organization_invitation: {
        Args: { token_input: string }
        Returns: boolean
      }
      apply_point_decay: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      approve_waitlist_user: {
        Args: { approving_admin_id: string; target_user_id: string }
        Returns: undefined
      }
      award_impact_points: {
        Args: {
          activity_type: string
          description: string
          metadata?: Json
          points: number
          target_user_id: string
        }
        Returns: string
      }
      award_user_points: {
        Args: {
          activity_type: string
          description: string
          metadata?: Json
          points: number
          target_user_id: string
        }
        Returns: string
      }
      bulk_delete_notifications: {
        Args: { notification_ids: string[]; older_than_days?: number }
        Returns: number
      }
      bulk_mark_notifications_read: {
        Args: { mark_all?: boolean; notification_ids?: string[] }
        Returns: number
      }
      calculate_campaign_performance_score: {
        Args: { campaign_uuid: string }
        Returns: number
      }
      calculate_enhanced_trust_score: {
        Args: { user_uuid: string }
        Returns: number
      }
      calculate_esg_score: {
        Args: { assessment_year: number; org_id: string }
        Returns: number
      }
      calculate_total_market_value: {
        Args: { target_user_id: string }
        Returns: number
      }
      calculate_trust_score: {
        Args: { user_uuid: string }
        Returns: number
      }
      calculate_user_impact_metrics: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      calculate_user_similarity: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      calculate_user_similarity_with_orgs: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      can_access_dashboard: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      can_access_donor_details: {
        Args: { org_id: string }
        Returns: boolean
      }
      can_access_message: {
        Args: { message_recipient_id: string; message_sender_id: string }
        Returns: boolean
      }
      can_view_profile: {
        Args: { profile_user_id: string; viewer_id: string }
        Returns: boolean
      }
      check_ai_rate_limit: {
        Args: {
          p_endpoint_name: string
          p_max_requests?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          limit_type: string
          max_requests?: number
          target_user_id: string
          window_seconds?: number
        }
        Returns: boolean
      }
      cleanup_expired_safe_space_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_message_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      confirm_volunteer_work: {
        Args: {
          activity_id: string
          confirm_status: string
          rejection_note?: string
        }
        Returns: undefined
      }
      create_default_goals_for_user: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      detect_fraud_patterns: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      generate_user_recommendations: {
        Args: { target_user_id: string }
        Returns: {
          confidence_score: number
          metadata: Json
          reasoning: string
          recommendation_type: string
          target_id: string
        }[]
      }
      generate_user_recommendations_with_orgs: {
        Args: { target_user_id: string }
        Returns: {
          confidence_score: number
          metadata: Json
          reasoning: string
          recommendation_type: string
          target_id: string
        }[]
      }
      get_donor_statistics: {
        Args: { org_id: string }
        Returns: {
          average_donation: number
          created_at: string
          donation_count: number
          donor_status: string
          donor_type: string
          first_donation_date: string
          first_initial: string
          id: string
          last_donation_date: string
          last_initial: string
          masked_email: string
          organization_id: string
          tags: string[]
          total_donated: number
          updated_at: string
        }[]
      }
      get_esg_compliance_status: {
        Args: { org_id: string }
        Returns: {
          compliance_percentage: number
          framework_name: string
          last_update: string
          missing_indicators: number
        }[]
      }
      get_notification_analytics: {
        Args: { p_days_back?: number; p_user_id: string }
        Returns: {
          click_rate: number
          clicked_count: number
          delivered_count: number
          open_rate: number
          opened_count: number
          total_notifications: number
        }[]
      }
      get_or_create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      get_post_comments: {
        Args: { target_post_id: string }
        Returns: {
          author_avatar: string
          author_name: string
          content: string
          created_at: string
          edited_at: string
          id: string
          is_deleted: boolean
          likes_count: number
          parent_comment_id: string
          post_id: string
          user_has_liked: boolean
          user_id: string
        }[]
      }
      get_post_reaction_counts: {
        Args: { target_post_id: string }
        Returns: {
          count: number
          reaction_type: string
          user_reacted: boolean
        }[]
      }
      get_user_conversations: {
        Args: { target_user_id: string }
        Returns: {
          conversation_id: string
          last_message: string
          last_message_time: string
          other_user_avatar: string
          other_user_id: string
          other_user_name: string
          unread_count: number
        }[]
      }
      get_user_organizations: {
        Args: { target_user_id: string }
        Returns: {
          is_current: boolean
          organization_id: string
          organization_name: string
          role: string
          title: string
        }[]
      }
      get_user_total_points: {
        Args: { target_user_id: string }
        Returns: number
      }
      get_volunteer_work_recipient: {
        Args: { activity_id: string }
        Returns: string
      }
      group_similar_notifications: {
        Args: { p_time_window?: unknown; p_type: string; p_user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_campaign_creator: {
        Args: { campaign_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_campaign_participant: {
        Args: { campaign_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_organization_admin: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      is_organization_member: {
        Args: { org_id: string; user_uuid: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      match_safe_space_helper: {
        Args: {
          p_issue_category: string
          p_requester_id: string
          p_urgency_level: string
        }
        Returns: string
      }
      process_scheduled_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      render_notification_template: {
        Args: { template_id_input: string; variables?: Json }
        Returns: {
          action_type: string
          message: string
          priority: string
          title: string
          type: string
        }[]
      }
      toggle_comment_like: {
        Args: { target_comment_id: string }
        Returns: boolean
      }
      toggle_post_reaction: {
        Args: { target_post_id: string; target_reaction_type: string }
        Returns: boolean
      }
      update_campaign_amount: {
        Args: { campaign_uuid: string; donation_amount: number }
        Returns: undefined
      }
      validate_organization_invitation: {
        Args: { token_input: string }
        Returns: {
          email: string
          expires_at: string
          invitation_id: string
          invited_by: string
          is_valid: boolean
          organization_id: string
          role: string
          title: string
        }[]
      }
    }
    Enums: {
      waitlist_status: "pending" | "approved" | "denied"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      waitlist_status: ["pending", "approved", "denied"],
    },
  },
} as const
