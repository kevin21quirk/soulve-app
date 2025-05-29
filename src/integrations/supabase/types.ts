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
      profiles: {
        Row: {
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
          website: string | null
        }
        Insert: {
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
          website?: string | null
        }
        Update: {
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
      calculate_trust_score: {
        Args: { user_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
