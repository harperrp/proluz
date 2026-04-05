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
      activity_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          city_hall_id: string | null
          created_at: string
          details: Json
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          city_hall_id?: string | null
          created_at?: string
          details?: Json
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          city_hall_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_city_hall_id_fkey"
            columns: ["city_hall_id"]
            isOneToOne: false
            referencedRelation: "city_halls"
            referencedColumns: ["id"]
          },
        ]
      }
      city_halls: {
        Row: {
          city: string
          cnpj: string | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          state: string
          status: string
          updated_at: string
        }
        Insert: {
          city: string
          cnpj?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name: string
          state: string
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string
          cnpj?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          state?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          citizen_cpf: string
          citizen_name: string
          citizen_phone: string | null
          city_hall_id: string
          created_at: string
          description: string
          id: string
          latitude: number
          lighting_point_code: string | null
          longitude: number
          rejection_reason: string | null
          secretary_observations: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          updated_at: string
        }
        Insert: {
          citizen_cpf: string
          citizen_name: string
          citizen_phone?: string | null
          city_hall_id: string
          created_at?: string
          description: string
          id?: string
          latitude: number
          lighting_point_code?: string | null
          longitude: number
          rejection_reason?: string | null
          secretary_observations?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string
        }
        Update: {
          citizen_cpf?: string
          citizen_name?: string
          citizen_phone?: string | null
          city_hall_id?: string
          created_at?: string
          description?: string
          id?: string
          latitude?: number
          lighting_point_code?: string | null
          longitude?: number
          rejection_reason?: string | null
          secretary_observations?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_city_hall_id_fkey"
            columns: ["city_hall_id"]
            isOneToOne: false
            referencedRelation: "city_halls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_lighting_point_code_fkey"
            columns: ["lighting_point_code"]
            isOneToOne: false
            referencedRelation: "lighting_points"
            referencedColumns: ["code"]
          },
        ]
      }
      lighting_points: {
        Row: {
          address: string | null
          city_hall_id: string
          code: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          neighborhood: string | null
          observations: string | null
          status: Database["public"]["Enums"]["pole_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          city_hall_id: string
          code: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          neighborhood?: string | null
          observations?: string | null
          status?: Database["public"]["Enums"]["pole_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          city_hall_id?: string
          code?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          neighborhood?: string | null
          observations?: string | null
          status?: Database["public"]["Enums"]["pole_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lighting_points_city_hall_id_fkey"
            columns: ["city_hall_id"]
            isOneToOne: false
            referencedRelation: "city_halls"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_orders: {
        Row: {
          assigned_to: string | null
          city_hall_id: string
          complaint_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          lighting_point_code: string
          opened_at: string
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["maintenance_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          city_hall_id: string
          complaint_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lighting_point_code: string
          opened_at?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["maintenance_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          city_hall_id?: string
          complaint_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lighting_point_code?: string
          opened_at?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["maintenance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_orders_city_hall_id_fkey"
            columns: ["city_hall_id"]
            isOneToOne: false
            referencedRelation: "city_halls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_orders_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_orders_lighting_point_code_fkey"
            columns: ["lighting_point_code"]
            isOneToOne: false
            referencedRelation: "lighting_points"
            referencedColumns: ["code"]
          },
        ]
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_city_halls: {
        Row: {
          city_hall_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          city_hall_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          city_hall_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_city_halls_city_hall_id_fkey"
            columns: ["city_hall_id"]
            isOneToOne: false
            referencedRelation: "city_halls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_city_halls_user_id_fkey"
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
      belongs_to_city_hall: {
        Args: { target_city_hall: string }
        Returns: boolean
      }
      can_access_city_hall: {
        Args: {
          allowed_roles: Database["public"]["Enums"]["user_role"][]
          target_city_hall: string
        }
        Returns: boolean
      }
      is_admin_master: { Args: never; Returns: boolean }
      user_has_role: {
        Args: { allowed_roles: Database["public"]["Enums"]["user_role"][] }
        Returns: boolean
      }
    }
    Enums: {
      complaint_status: "PENDENTE" | "APROVADA" | "REJEITADA"
      maintenance_status: "ABERTA" | "EM_EXECUCAO" | "CONCLUIDA"
      pole_status: "FUNCIONANDO" | "QUEIMADO"
      priority_level: "BAIXA" | "MEDIA" | "ALTA"
      user_role:
        | "ADMIN"
        | "CITY_HALL_ADMIN"
        | "SECRETARY"
        | "TECHNICAL"
        | "CITIZEN"
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
      complaint_status: ["PENDENTE", "APROVADA", "REJEITADA"],
      maintenance_status: ["ABERTA", "EM_EXECUCAO", "CONCLUIDA"],
      pole_status: ["FUNCIONANDO", "QUEIMADO"],
      priority_level: ["BAIXA", "MEDIA", "ALTA"],
      user_role: [
        "ADMIN",
        "CITY_HALL_ADMIN",
        "SECRETARY",
        "TECHNICAL",
        "CITIZEN",
      ],
    },
  },
} as const
