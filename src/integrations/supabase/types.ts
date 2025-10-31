export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      carbon_actions: {
        Row: {
          action_date: string;
          action_id: number;
          action_type: string;
          co2_impact: number;
          created_at: string;
          description: string;
          id: string;
          location: string | null;
          proof_url: string | null;
          tokens_minted: number | null;
          serial_number: number | null;
          topic_id: string | null;
          updated_at: string;
          user_id: string;
          verification_status: string;
        };
        Insert: {
          action_date: string;
          action_id?: number;
          action_type: string;
          co2_impact: number;
          created_at?: string;
          description: string;
          id?: string;
          location?: string | null;
          proof_url?: string | null;
          tokens_minted?: number | null;
          serial_number?: number | null;
          topic_id?: string | null;
          updated_at?: string;
          user_id: string;
          verification_status?: string;
        };
        Update: {
          action_date?: string;
          action_id?: number;
          action_type?: string;
          co2_impact?: number;
          created_at?: string;
          description?: string;
          id?: string;
          location?: string | null;
          proof_url?: string | null;
          tokens_minted?: number | null;
          serial_number?: number | null;
          topic_id?: string | null;
          updated_at?: string;
          user_id?: string;
          verification_status?: string;
        };
        Relationships: [];
      };
      marketplace_listings: {
        Row: {
          co2_offset: number;
          created_at: string;
          expires_at: string;
          id: string;
          price_per_token: number;
          seller_id: string;
          status: string;
          total_price: number;
          tokens: number;
          seller_account_id: string;
          listing_id: number;
          updated_at: string;
        };
        Insert: {
          co2_offset: number;
          created_at?: string;
          expires_at?: string;
          id?: string;
          price_per_token: number;
          seller_id: string;
          status?: string;
          tokens: number;
          seller_account_id: string;
          listing_id: number;
          total_price: number;
          updated_at?: string;
        };
        Update: {
          co2_offset?: number;
          created_at?: string;
          expires_at?: string;
          id?: string;
          price_per_token?: number;
          seller_id?: string;
          status?: string;
          tokens?: number;
          seller_account_id?: string;
          listing_id?: number;
          total_price?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          carbon_tokens: number | null;
          created_at: string;
          full_name: string | null;
          hbar_balance: number | null;
          id: string;
          updated_at: string;
          wallet_address: string | null;
        };
        Insert: {
          carbon_tokens?: number | null;
          created_at?: string;
          full_name?: string | null;
          hbar_balance?: number | null;
          id: string;
          updated_at?: string;
          wallet_address?: string | null;
        };
        Update: {
          carbon_tokens?: number | null;
          created_at?: string;
          full_name?: string | null;
          hbar_balance?: number | null;
          id?: string;
          updated_at?: string;
          wallet_address?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          buyer_id: string;
          created_at: string;
          id: string;
          listing_id: string | null;
          seller_id: string | null;
          total_price: number;
          transaction_id: string | null;
        };
        Insert: {
          amount: number;
          buyer_id: string;
          created_at?: string;
          id?: string;
          listing_id?: string | null;
          seller_id?: string | null;
          total_price: number;
          transaction_id?: string | null;
        };
        Update: {
          amount?: number;
          buyer_id?: string;
          created_at?: string;
          id?: string;
          listing_id?: string | null;
          seller_id?: string | null;
          total_price?: number;
          transaction_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "marketplace_listings";
            referencedColumns: ["id"];
          }
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      verra_rounds: {
        Row: {
          achieved_amount: number | null;
          created_at: string;
          end_date: string | null;
          id: string;
          is_certified: boolean | null;
          round_number: number;
          start_date: string | null;
          status: string;
          target_amount: number;
          topic_id: string | null;
        };
        Insert: {
          achieved_amount?: number | null;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          is_certified?: boolean | null;
          round_number: number;
          start_date?: string | null;
          status: string;
          target_amount: number;
          topic_id?: string | null;
        };
        Update: {
          achieved_amount?: number | null;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          is_certified?: boolean | null;
          round_number?: number;
          start_date?: string | null;
          status?: string;
          target_amount?: number;
          topic_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
