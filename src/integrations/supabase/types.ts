export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          created_at: string
          description: string
          effort_level: number | null
          evidence_submitted: boolean | null
          id: string
          metadata: Json | null
          points_earned: number
          requires_evidence: boolean | null
          risk_score: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          activity_type: string
          auto_verified?: boolean | null
          created_at?: string
          description: string
          effort_level?: number | null
          evidence_submitted?: boolean | null
          id?: string
          metadata?: Json | null
          points_earned?: number
          requires_evidence?: boolean | null
          risk_score?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          activity_type?: string
          auto_verified?: boolean | null
          created_at?: string
          description?: string
          effort_level?: number | null
          evidence_submitted?: boolean | null
          id?: string
          metadata?: Json | null
          points_earned?: number
          requires_evidence?: boolean | null
          risk_score?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
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
          trust_score?: number
          user_id?: string
          volunteer_hours?: number | null
          xp_points?: number | null
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
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          recipient_id: string
          sender_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          recipient_id: string
          sender_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          recipient_id?: string
          sender_id?: string | null
          title?: string
          type?: string
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
      post_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_point_decay: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      approve_waitlist_user: {
        Args: { target_user_id: string; approving_admin_id: string }
        Returns: undefined
      }
      award_impact_points: {
        Args: {
          target_user_id: string
          activity_type: string
          points: number
          description: string
          metadata?: Json
        }
        Returns: string
      }
      award_user_points: {
        Args: {
          target_user_id: string
          activity_type: string
          points: number
          description: string
          metadata?: Json
        }
        Returns: string
      }
      calculate_campaign_performance_score: {
        Args: { campaign_uuid: string }
        Returns: number
      }
      calculate_enhanced_trust_score: {
        Args: { user_uuid: string }
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
      can_access_dashboard: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      cleanup_expired_safe_space_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      detect_fraud_patterns: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      generate_user_recommendations: {
        Args: { target_user_id: string }
        Returns: {
          recommendation_type: string
          target_id: string
          confidence_score: number
          reasoning: string
          metadata: Json
        }[]
      }
      get_user_total_points: {
        Args: { target_user_id: string }
        Returns: number
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_campaign_creator: {
        Args: { campaign_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      match_safe_space_helper: {
        Args: {
          p_requester_id: string
          p_issue_category: string
          p_urgency_level: string
        }
        Returns: string
      }
      update_campaign_amount: {
        Args: { campaign_uuid: string; donation_amount: number }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
