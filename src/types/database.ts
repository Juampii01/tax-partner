// Generado desde Supabase (proyecto GovBidder Tax Partner). No editar a mano:
// regenerar después de cada migración.
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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      partners: {
        Row: {
          commission_rate: number
          company_name: string
          contact_name: string | null
          created_at: string
          email: string
          fee_status: string
          id: string
          logo_url: string | null
          phone: string | null
          referral_code: string
          status: string
          timezone: string
          user_id: string | null
        }
        Insert: {
          commission_rate?: number
          company_name: string
          contact_name?: string | null
          created_at?: string
          email: string
          fee_status?: string
          id?: string
          logo_url?: string | null
          phone?: string | null
          referral_code?: string
          status?: string
          timezone?: string
          user_id?: string | null
        }
        Update: {
          commission_rate?: number
          company_name?: string
          contact_name?: string | null
          created_at?: string
          email?: string
          fee_status?: string
          id?: string
          logo_url?: string | null
          phone?: string | null
          referral_code?: string
          status?: string
          timezone?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          id: string
          paid_at: string | null
          partner_id: string
          period_end: string
          period_start: string
          status: string
          total_cents: number
        }
        Insert: {
          id?: string
          paid_at?: string | null
          partner_id: string
          period_end: string
          period_start: string
          status?: string
          total_cents?: number
        }
        Update: {
          id?: string
          paid_at?: string | null
          partner_id?: string
          period_end?: string
          period_start?: string
          status?: string
          total_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          industry: string | null
          partner_id: string
          phone: string | null
          status: string
          webinar_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          industry?: string | null
          partner_id: string
          phone?: string | null
          status?: string
          webinar_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          industry?: string | null
          partner_id?: string
          phone?: string | null
          status?: string
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          body: string
          id: string
          is_active: boolean
          kind: string
          sort_order: number
          title: string
        }
        Insert: {
          body: string
          id?: string
          is_active?: boolean
          kind: string
          sort_order?: number
          title: string
        }
        Update: {
          body?: string
          id?: string
          is_active?: boolean
          kind?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      sale_reassignments: {
        Row: {
          created_at: string
          from_partner_id: string
          id: string
          reason: string | null
          reassigned_by: string | null
          sale_id: string
          to_partner_id: string
        }
        Insert: {
          created_at?: string
          from_partner_id: string
          id?: string
          reason?: string | null
          reassigned_by?: string | null
          sale_id: string
          to_partner_id: string
        }
        Update: {
          created_at?: string
          from_partner_id?: string
          id?: string
          reason?: string | null
          reassigned_by?: string | null
          sale_id?: string
          to_partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_reassignments_from_partner_id_fkey"
            columns: ["from_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_reassignments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_reassignments_to_partner_id_fkey"
            columns: ["to_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount_cents: number
          attributed_at: string
          attributed_by: string | null
          closed_at: string
          commission_cents: number
          created_at: string
          id: string
          partner_id: string
          payout_id: string | null
          referral_id: string
          status: string
        }
        Insert: {
          amount_cents: number
          attributed_at?: string
          attributed_by?: string | null
          closed_at?: string
          commission_cents: number
          created_at?: string
          id?: string
          partner_id: string
          payout_id?: string | null
          referral_id: string
          status?: string
        }
        Update: {
          amount_cents?: number
          attributed_at?: string
          attributed_by?: string | null
          closed_at?: string
          commission_cents?: number
          created_at?: string
          id?: string
          partner_id?: string
          payout_id?: string | null
          referral_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          audience: string
          created_at: string
          id: string
          is_active: boolean
          join_url: string | null
          starts_at: string
          title: string
        }
        Insert: {
          audience?: string
          created_at?: string
          id?: string
          is_active?: boolean
          join_url?: string | null
          starts_at: string
          title: string
        }
        Update: {
          audience?: string
          created_at?: string
          id?: string
          is_active?: boolean
          join_url?: string | null
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_partner_id: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
