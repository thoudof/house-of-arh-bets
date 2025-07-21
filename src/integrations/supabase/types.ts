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
          condition: string
          created_at: string | null
          description: string
          icon: string
          id: string
          title: string
        }
        Insert: {
          condition: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          title: string
        }
        Update: {
          condition?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      challenge_predictions: {
        Row: {
          challenge_id: string
          id: string
          prediction_id: string
          step_number: number
        }
        Insert: {
          challenge_id: string
          id?: string
          prediction_id: string
          step_number: number
        }
        Update: {
          challenge_id?: string
          id?: string
          prediction_id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_predictions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_predictions_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string | null
          creator_id: string
          creator_name: string
          current_bank: number
          current_step: number | null
          end_date: string | null
          id: string
          start_bank: number
          start_date: string | null
          status: Database["public"]["Enums"]["challenge_status"] | null
          title: string
          total_steps: number | null
          type: Database["public"]["Enums"]["challenge_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          creator_name: string
          current_bank: number
          current_step?: number | null
          end_date?: string | null
          id?: string
          start_bank: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["challenge_status"] | null
          title: string
          total_steps?: number | null
          type: Database["public"]["Enums"]["challenge_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          creator_name?: string
          current_bank?: number
          current_step?: number | null
          end_date?: string | null
          id?: string
          start_bank?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["challenge_status"] | null
          title?: string
          total_steps?: number | null
          type?: Database["public"]["Enums"]["challenge_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      predictions: {
        Row: {
          analyst: string | null
          category: string
          coefficient: number
          created_at: string | null
          description: string | null
          end_date: string | null
          event: string
          id: string
          is_public: boolean | null
          prediction: string
          profit: number | null
          stake: number | null
          start_date: string
          status: Database["public"]["Enums"]["prediction_status"] | null
          time_left: string | null
          type: Database["public"]["Enums"]["prediction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analyst?: string | null
          category: string
          coefficient: number
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event: string
          id?: string
          is_public?: boolean | null
          prediction: string
          profit?: number | null
          stake?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["prediction_status"] | null
          time_left?: string | null
          type: Database["public"]["Enums"]["prediction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analyst?: string | null
          category?: string
          coefficient?: number
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event?: string
          id?: string
          is_public?: boolean | null
          prediction?: string
          profit?: number | null
          stake?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["prediction_status"] | null
          time_left?: string | null
          type?: Database["public"]["Enums"]["prediction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string
          id: string
          is_premium: boolean | null
          language_code: string | null
          last_name: string | null
          telegram_id: string
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          is_premium?: boolean | null
          language_code?: string | null
          last_name?: string | null
          telegram_id: string
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          is_premium?: boolean | null
          language_code?: string | null
          last_name?: string | null
          telegram_id?: string
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
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
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_stats: {
        Row: {
          average_coefficient: number | null
          best_streak: number | null
          created_at: string | null
          current_streak: number | null
          id: string
          profit: number | null
          roi: number | null
          total_predictions: number | null
          total_stake: number | null
          updated_at: string | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          average_coefficient?: number | null
          best_streak?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          profit?: number | null
          roi?: number | null
          total_predictions?: number | null
          total_stake?: number | null
          updated_at?: string | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          average_coefficient?: number | null
          best_streak?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          profit?: number | null
          roi?: number | null
          total_predictions?: number | null
          total_stake?: number | null
          updated_at?: string | null
          user_id?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      challenge_status: "active" | "completed" | "failed"
      challenge_type: "bank_growth" | "win_streak" | "roi_challenge"
      prediction_status: "pending" | "win" | "loss" | "cancelled"
      prediction_type: "sport" | "crypto" | "stock" | "other"
      user_rank: "newbie" | "experienced" | "professional" | "expert" | "legend"
      user_role: "user" | "analyst" | "moderator" | "admin" | "superadmin"
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
      challenge_status: ["active", "completed", "failed"],
      challenge_type: ["bank_growth", "win_streak", "roi_challenge"],
      prediction_status: ["pending", "win", "loss", "cancelled"],
      prediction_type: ["sport", "crypto", "stock", "other"],
      user_rank: ["newbie", "experienced", "professional", "expert", "legend"],
      user_role: ["user", "analyst", "moderator", "admin", "superadmin"],
    },
  },
} as const
