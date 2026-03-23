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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_sessions: {
        Row: {
          created_at: string
          id: string
          messages: Json
          session_type: string
          summary: string | null
          trade_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          session_type?: string
          summary?: string | null
          trade_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          session_type?: string
          summary?: string | null
          trade_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_sessions_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          sort_order: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          sort_order?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: []
      }
      checklist_logs: {
        Row: {
          all_checked: boolean
          completed_items: Json
          created_at: string
          id: string
          trade_id: string | null
          user_id: string
        }
        Insert: {
          all_checked?: boolean
          completed_items?: Json
          created_at?: string
          id?: string
          trade_id?: string | null
          user_id: string
        }
        Update: {
          all_checked?: boolean
          completed_items?: Json
          created_at?: string
          id?: string
          trade_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_logs_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      discipline_logs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          penalty_points: number
          severity: string
          trade_id: string | null
          user_id: string
          violation_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          penalty_points?: number
          severity?: string
          trade_id?: string | null
          user_id: string
          violation_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          penalty_points?: number
          severity?: string
          trade_id?: string | null
          user_id?: string
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "discipline_logs_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      market_context: {
        Row: {
          context_date: string
          created_at: string
          id: string
          key_news: string | null
          market_trend: string | null
          notes: string | null
          sector_highlights: string | null
          sentiment: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_date: string
          created_at?: string
          id?: string
          key_news?: string | null
          market_trend?: string | null
          notes?: string | null
          sector_highlights?: string | null
          sentiment?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_date?: string
          created_at?: string
          id?: string
          key_news?: string | null
          market_trend?: string | null
          notes?: string | null
          sector_highlights?: string | null
          sentiment?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_plans: {
        Row: {
          created_at: string
          direction: string
          id: string
          name: string
          plan_date: string
          planned_entry: number
          position_size: number | null
          rationale: string | null
          status: string
          stop_loss: number
          symbol: string
          take_profit: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          name: string
          plan_date?: string
          planned_entry: number
          position_size?: number | null
          rationale?: string | null
          status?: string
          stop_loss: number
          symbol: string
          take_profit?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          name?: string
          plan_date?: string
          planned_entry?: number
          position_size?: number | null
          rationale?: string | null
          status?: string
          stop_loss?: number
          symbol?: string
          take_profit?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          closed_at: string | null
          commission: number | null
          confidence_score: number | null
          created_at: string
          decision_logic: string | null
          direction: string
          entry_price: number
          exit_price: number | null
          fomo_score: number | null
          id: string
          name: string
          notes: string | null
          opened_at: string
          plan_id: string | null
          pnl: number | null
          pnl_percent: number | null
          quantity: number
          r_multiple: number | null
          slippage: number | null
          status: string
          symbol: string
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          commission?: number | null
          confidence_score?: number | null
          created_at?: string
          decision_logic?: string | null
          direction: string
          entry_price: number
          exit_price?: number | null
          fomo_score?: number | null
          id?: string
          name: string
          notes?: string | null
          opened_at?: string
          plan_id?: string | null
          pnl?: number | null
          pnl_percent?: number | null
          quantity: number
          r_multiple?: number | null
          slippage?: number | null
          status?: string
          symbol: string
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          commission?: number | null
          confidence_score?: number | null
          created_at?: string
          decision_logic?: string | null
          direction?: string
          entry_price?: number
          exit_price?: number | null
          fomo_score?: number | null
          id?: string
          name?: string
          notes?: string | null
          opened_at?: string
          plan_id?: string | null
          pnl?: number | null
          pnl_percent?: number | null
          quantity?: number
          r_multiple?: number | null
          slippage?: number | null
          status?: string
          symbol?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_trades_plan"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "trade_plans"
            referencedColumns: ["id"]
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
