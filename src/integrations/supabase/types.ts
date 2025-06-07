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
      ambassador_registrations: {
        Row: {
          activated_at: string | null
          ambassador_id: string
          country: string
          created_at: string
          id: string
          payment_verified_at: string | null
          receipt_code: string | null
          referral_code: string | null
          region: string
          registration_date: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          ambassador_id: string
          country: string
          created_at?: string
          id?: string
          payment_verified_at?: string | null
          receipt_code?: string | null
          referral_code?: string | null
          region: string
          registration_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          ambassador_id?: string
          country?: string
          created_at?: string
          id?: string
          payment_verified_at?: string | null
          receipt_code?: string | null
          referral_code?: string | null
          region?: string
          registration_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_registrations_receipt_code_fkey"
            columns: ["receipt_code"]
            isOneToOne: false
            referencedRelation: "receipt_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      ambassador_stats: {
        Row: {
          activation_pack_earnings_usd: number
          active_referrals: number
          created_at: string
          current_commission_tier: string
          direct_sales_earnings_usd: number
          id: string
          last_calculated: string
          next_payout_date: string | null
          pending_referrals: number
          second_level_earnings_usd: number
          team_bonus_earnings_usd: number
          total_earnings_usd: number
          total_referrals: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activation_pack_earnings_usd?: number
          active_referrals?: number
          created_at?: string
          current_commission_tier?: string
          direct_sales_earnings_usd?: number
          id?: string
          last_calculated?: string
          next_payout_date?: string | null
          pending_referrals?: number
          second_level_earnings_usd?: number
          team_bonus_earnings_usd?: number
          total_earnings_usd?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activation_pack_earnings_usd?: number
          active_referrals?: number
          created_at?: string
          current_commission_tier?: string
          direct_sales_earnings_usd?: number
          id?: string
          last_calculated?: string
          next_payout_date?: string | null
          pending_referrals?: number
          second_level_earnings_usd?: number
          team_bonus_earnings_usd?: number
          total_earnings_usd?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          amount: number
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_name: string
          id: string
          patient_notes: string | null
          payment_status: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_name?: string
          id?: string
          patient_notes?: string | null
          payment_status?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_name?: string
          id?: string
          patient_notes?: string | null
          payment_status?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      commission_tiers: {
        Row: {
          activation_pack_commission: number
          created_at: string
          direct_sales_commission_max: number
          direct_sales_commission_min: number
          id: string
          is_active: boolean
          requirements: Json
          second_level_commission: number
          tier_name: string
        }
        Insert: {
          activation_pack_commission: number
          created_at?: string
          direct_sales_commission_max: number
          direct_sales_commission_min: number
          id?: string
          is_active?: boolean
          requirements: Json
          second_level_commission: number
          tier_name: string
        }
        Update: {
          activation_pack_commission?: number
          created_at?: string
          direct_sales_commission_max?: number
          direct_sales_commission_min?: number
          id?: string
          is_active?: boolean
          requirements?: Json
          second_level_commission?: number
          tier_name?: string
        }
        Relationships: []
      }
      country_limits: {
        Row: {
          ambassador_limit: number
          country_code: string
          country_name: string
          created_at: string
          current_count: number
          id: string
          is_active: boolean
          premium_unlocked: boolean
          updated_at: string
        }
        Insert: {
          ambassador_limit?: number
          country_code: string
          country_name: string
          created_at?: string
          current_count?: number
          id?: string
          is_active?: boolean
          premium_unlocked?: boolean
          updated_at?: string
        }
        Update: {
          ambassador_limit?: number
          country_code?: string
          country_name?: string
          created_at?: string
          current_count?: number
          id?: string
          is_active?: boolean
          premium_unlocked?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      doctor_availability: {
        Row: {
          available_date: string
          created_at: string
          doctor_name: string
          end_time: string
          id: string
          is_available: boolean
          max_bookings_per_slot: number
          slot_duration: number
          start_time: string
        }
        Insert: {
          available_date: string
          created_at?: string
          doctor_name?: string
          end_time: string
          id?: string
          is_available?: boolean
          max_bookings_per_slot?: number
          slot_duration?: number
          start_time: string
        }
        Update: {
          available_date?: string
          created_at?: string
          doctor_name?: string
          end_time?: string
          id?: string
          is_available?: boolean
          max_bookings_per_slot?: number
          slot_duration?: number
          start_time?: string
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount_local: number
          amount_usd: number
          commission_rate: number | null
          created_at: string
          currency: string
          earned_date: string
          earning_type: string
          id: string
          paid_date: string | null
          source_transaction_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount_local: number
          amount_usd: number
          commission_rate?: number | null
          created_at?: string
          currency?: string
          earned_date?: string
          earning_type: string
          id?: string
          paid_date?: string | null
          source_transaction_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount_local?: number
          amount_usd?: number
          commission_rate?: number | null
          created_at?: string
          currency?: string
          earned_date?: string
          earning_type?: string
          id?: string
          paid_date?: string | null
          source_transaction_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "earnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type: string
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          commission_eligible: boolean
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price_local: number
          price_usd: number
          product_type: string
        }
        Insert: {
          commission_eligible?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_local: number
          price_usd: number
          product_type: string
        }
        Update: {
          commission_eligible?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_local?: number
          price_usd?: number
          product_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ambassador_id: string | null
          country: string | null
          created_at: string | null
          full_name: string | null
          id: string
          payment_status: string | null
          phone: string | null
          referral_code: string | null
          region: string | null
          registration_data: Json | null
          registration_date: string | null
          status: string | null
          updated_at: string | null
          user_referral_id: string | null
        }
        Insert: {
          ambassador_id?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          payment_status?: string | null
          phone?: string | null
          referral_code?: string | null
          region?: string | null
          registration_data?: Json | null
          registration_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_referral_id?: string | null
        }
        Update: {
          ambassador_id?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          payment_status?: string | null
          phone?: string | null
          referral_code?: string | null
          region?: string | null
          registration_data?: Json | null
          registration_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_referral_id?: string | null
        }
        Relationships: []
      }
      receipt_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          status: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          activated_date: string | null
          country: string
          created_at: string
          id: string
          joined_date: string
          referral_code: string
          referred_id: string | null
          referrer_id: string | null
          status: string
        }
        Insert: {
          activated_date?: string | null
          country: string
          created_at?: string
          id?: string
          joined_date?: string
          referral_code: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string
        }
        Update: {
          activated_date?: string | null
          country?: string
          created_at?: string
          id?: string
          joined_date?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          commission_paid: boolean
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          product_id: string | null
          quantity: number
          sale_date: string
          seller_id: string | null
          total_amount_local: number
          total_amount_usd: number
          unit_price_local: number
          unit_price_usd: number
        }
        Insert: {
          commission_paid?: boolean
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          sale_date?: string
          seller_id?: string | null
          total_amount_local: number
          total_amount_usd: number
          unit_price_local: number
          unit_price_usd: number
        }
        Update: {
          commission_paid?: boolean
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          sale_date?: string
          seller_id?: string | null
          total_amount_local?: number
          total_amount_usd?: number
          unit_price_local?: number
          unit_price_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_bonuses: {
        Row: {
          achieved: boolean
          achieved_date: string | null
          bonus_type: string
          created_at: string
          current_amount_usd: number
          id: string
          period_end: string | null
          period_start: string | null
          period_type: string
          progress_percentage: number
          target_amount_usd: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          achieved?: boolean
          achieved_date?: string | null
          bonus_type: string
          created_at?: string
          current_amount_usd?: number
          id?: string
          period_end?: string | null
          period_start?: string | null
          period_type: string
          progress_percentage?: number
          target_amount_usd: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          achieved?: boolean
          achieved_date?: string | null
          bonus_type?: string
          created_at?: string
          current_amount_usd?: number
          id?: string
          period_end?: string | null
          period_start?: string | null
          period_type?: string
          progress_percentage?: number
          target_amount_usd?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_bonuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_ambassador_stats: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      generate_ambassador_id: {
        Args: { p_region: string; p_country: string }
        Returns: string
      }
      generate_progressive_ambassador_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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
