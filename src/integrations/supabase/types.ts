export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          condition_type: string
          condition_value: number
          created_at: string
          description: string
          experience_points: number | null
          icon_emoji: string
          id: string
          is_active: boolean | null
          sort_order: number | null
          tier_boost: number | null
          title: string
        }
        Insert: {
          condition_type: string
          condition_value: number
          created_at?: string
          description: string
          experience_points?: number | null
          icon_emoji: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          tier_boost?: number | null
          title: string
        }
        Update: {
          condition_type?: string
          condition_value?: number
          created_at?: string
          description?: string
          experience_points?: number | null
          icon_emoji?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          tier_boost?: number | null
          title?: string
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          current_bank: number | null
          current_step: number | null
          id: string
          is_eliminated: boolean | null
          joined_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          current_bank?: number | null
          current_step?: number | null
          id?: string
          is_eliminated?: boolean | null
          joined_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          current_bank?: number | null
          current_step?: number | null
          id?: string
          is_eliminated?: boolean | null
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_hours: number | null
          end_date: string | null
          entry_fee: number | null
          id: string
          is_private: boolean | null
          max_participants: number | null
          min_coefficient: number | null
          participants_count: number | null
          prize_pool: number | null
          rules: string | null
          start_date: string | null
          status: string | null
          steps_count: number | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          min_coefficient?: number | null
          participants_count?: number | null
          prize_pool?: number | null
          rules?: string | null
          start_date?: string | null
          status?: string | null
          steps_count?: number | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          min_coefficient?: number | null
          participants_count?: number | null
          prize_pool?: number | null
          rules?: string | null
          start_date?: string | null
          status?: string | null
          steps_count?: number | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          from_user_id: string | null
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          prediction_id: string | null
          read_at: string | null
          telegram_message_id: number | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          prediction_id?: string | null
          read_at?: string | null
          telegram_message_id?: number | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          prediction_id?: string | null
          read_at?: string | null
          telegram_message_id?: number | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          likes_count: number | null
          parent_comment_id: string | null
          prediction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          prediction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          prediction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "prediction_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prediction_comments_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_likes: {
        Row: {
          created_at: string
          id: string
          prediction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prediction_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prediction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_likes_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          category: Database["public"]["Enums"]["prediction_category"]
          coefficient: number
          comments_count: number | null
          competition_name: string | null
          created_at: string
          description: string | null
          event_name: string
          event_start_time: string
          id: string
          is_featured: boolean | null
          is_premium: boolean | null
          is_public: boolean | null
          league_name: string | null
          likes_count: number | null
          prediction_deadline: string | null
          profit: number | null
          result_note: string | null
          result_time: string | null
          shares_count: number | null
          stake: number | null
          status: Database["public"]["Enums"]["prediction_status"] | null
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["prediction_type"]
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["prediction_category"]
          coefficient: number
          comments_count?: number | null
          competition_name?: string | null
          created_at?: string
          description?: string | null
          event_name: string
          event_start_time: string
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          is_public?: boolean | null
          league_name?: string | null
          likes_count?: number | null
          prediction_deadline?: string | null
          profit?: number | null
          result_note?: string | null
          result_time?: string | null
          shares_count?: number | null
          stake?: number | null
          status?: Database["public"]["Enums"]["prediction_status"] | null
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["prediction_type"]
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["prediction_category"]
          coefficient?: number
          comments_count?: number | null
          competition_name?: string | null
          created_at?: string
          description?: string | null
          event_name?: string
          event_start_time?: string
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          is_public?: boolean | null
          league_name?: string | null
          likes_count?: number | null
          prediction_deadline?: string | null
          profit?: number | null
          result_note?: string | null
          result_time?: string | null
          shares_count?: number | null
          stake?: number | null
          status?: Database["public"]["Enums"]["prediction_status"] | null
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["prediction_type"]
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auto_subscribe_enabled: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          first_name: string
          id: string
          is_verified: boolean | null
          language_code: string | null
          last_active_at: string | null
          last_name: string | null
          notifications_enabled: boolean | null
          public_profile: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          telegram_id: number
          telegram_username: string | null
          tier: Database["public"]["Enums"]["user_tier"] | null
          timezone: string | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verification_type: string | null
        }
        Insert: {
          auto_subscribe_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name: string
          id?: string
          is_verified?: boolean | null
          language_code?: string | null
          last_active_at?: string | null
          last_name?: string | null
          notifications_enabled?: boolean | null
          public_profile?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          telegram_id: number
          telegram_username?: string | null
          tier?: Database["public"]["Enums"]["user_tier"] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verification_type?: string | null
        }
        Update: {
          auto_subscribe_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string
          id?: string
          is_verified?: boolean | null
          language_code?: string | null
          last_active_at?: string | null
          last_name?: string | null
          notifications_enabled?: boolean | null
          public_profile?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          telegram_id?: number
          telegram_username?: string | null
          tier?: Database["public"]["Enums"]["user_tier"] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verification_type?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          analyst_id: string
          auto_bet_enabled: boolean | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_trial: boolean | null
          max_auto_bet_amount: number | null
          notifications_enabled: boolean | null
          started_at: string
          subscriber_id: string
          type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
        }
        Insert: {
          analyst_id: string
          auto_bet_enabled?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_trial?: boolean | null
          max_auto_bet_amount?: number | null
          notifications_enabled?: boolean | null
          started_at?: string
          subscriber_id: string
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
        }
        Update: {
          analyst_id?: string
          auto_bet_enabled?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_trial?: boolean | null
          max_auto_bet_amount?: number | null
          notifications_enabled?: boolean | null
          started_at?: string
          subscriber_id?: string
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
        }
        Relationships: []
      }
      telegram_sessions: {
        Row: {
          auth_date: string
          created_at: string
          expires_at: string
          id: string
          init_data_hash: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity_at: string | null
          telegram_id: number
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_date: string
          created_at?: string
          expires_at: string
          id?: string
          init_data_hash: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity_at?: string | null
          telegram_id: number
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_date?: string
          created_at?: string
          expires_at?: string
          id?: string
          init_data_hash?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity_at?: string | null
          telegram_id?: number
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          completed_at: string | null
          created_at: string
          current_progress: number | null
          id: string
          is_completed: boolean | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          average_coefficient: number | null
          best_loss_streak: number | null
          best_win_streak: number | null
          current_loss_streak: number | null
          current_win_streak: number | null
          experience_points: number | null
          failed_predictions: number | null
          highest_coefficient: number | null
          id: string
          last_calculated_at: string | null
          level: number | null
          pending_predictions: number | null
          rating: number | null
          roi: number | null
          successful_predictions: number | null
          total_likes_given: number | null
          total_likes_received: number | null
          total_loss: number | null
          total_predictions: number | null
          total_profit: number | null
          total_stake: number | null
          total_subscribers: number | null
          total_subscriptions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_coefficient?: number | null
          best_loss_streak?: number | null
          best_win_streak?: number | null
          current_loss_streak?: number | null
          current_win_streak?: number | null
          experience_points?: number | null
          failed_predictions?: number | null
          highest_coefficient?: number | null
          id?: string
          last_calculated_at?: string | null
          level?: number | null
          pending_predictions?: number | null
          rating?: number | null
          roi?: number | null
          successful_predictions?: number | null
          total_likes_given?: number | null
          total_likes_received?: number | null
          total_loss?: number | null
          total_predictions?: number | null
          total_profit?: number | null
          total_stake?: number | null
          total_subscribers?: number | null
          total_subscriptions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_coefficient?: number | null
          best_loss_streak?: number | null
          best_win_streak?: number | null
          current_loss_streak?: number | null
          current_win_streak?: number | null
          experience_points?: number | null
          failed_predictions?: number | null
          highest_coefficient?: number | null
          id?: string
          last_calculated_at?: string | null
          level?: number | null
          pending_predictions?: number | null
          rating?: number | null
          roi?: number | null
          successful_predictions?: number | null
          total_likes_given?: number | null
          total_likes_received?: number | null
          total_loss?: number | null
          total_predictions?: number | null
          total_profit?: number | null
          total_stake?: number | null
          total_subscribers?: number | null
          total_subscriptions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      top_analysts: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          first_name: string | null
          last_name: string | null
          rating: number | null
          roi: number | null
          successful_predictions: number | null
          tier: Database["public"]["Enums"]["user_tier"] | null
          total_predictions: number | null
          total_subscribers: number | null
          user_id: string | null
          win_rate: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_telegram_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      notification_type:
        | "prediction"
        | "result"
        | "subscription"
        | "achievement"
        | "system"
      prediction_category:
        | "football"
        | "basketball"
        | "tennis"
        | "hockey"
        | "esports"
        | "other"
      prediction_status: "pending" | "win" | "loss" | "cancelled" | "returned"
      prediction_type: "single" | "express" | "system" | "accumulator"
      subscription_type: "daily" | "weekly" | "monthly" | "season"
      user_role: "user" | "analyst" | "premium" | "vip" | "admin"
      user_tier: "free" | "bronze" | "silver" | "gold" | "platinum" | "diamond"
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
      notification_type: [
        "prediction",
        "result",
        "subscription",
        "achievement",
        "system",
      ],
      prediction_category: [
        "football",
        "basketball",
        "tennis",
        "hockey",
        "esports",
        "other",
      ],
      prediction_status: ["pending", "win", "loss", "cancelled", "returned"],
      prediction_type: ["single", "express", "system", "accumulator"],
      subscription_type: ["daily", "weekly", "monthly", "season"],
      user_role: ["user", "analyst", "premium", "vip", "admin"],
      user_tier: ["free", "bronze", "silver", "gold", "platinum", "diamond"],
    },
  },
} as const
