export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      dashboards: {
        Row: {
          id: string;
          raw_data: Json;
          user_id: string;
          client_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          raw_data: Json;
          user_id: string;
          client_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          raw_data?: Json;
          user_id?: string;
          client_id?: string | null;
          updated_at?: string | null;
        };
      };
      widgets: {
        Row: {
          id: string;
          raw_data: Json;
          user_id: string;
          client_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          raw_data: Json;
          user_id: string;
          client_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          raw_data?: Json;
          user_id?: string;
          client_id?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Functions: {
      change_user_password: {
        Args: { current_password: string; new_password: string };
        Returns: Json;
      };
      cancel_email_change: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
  };
}

