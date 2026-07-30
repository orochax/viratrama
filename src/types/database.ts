export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type SessionStatus = "draft" | "lobby" | "role_assignment" | "role_reveal" |
  "prologue" | "active" | "paused" | "final_decision" | "completed" | "abandoned";
type LicenseStatus = "unactivated" | "active" | "revoked";
export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "checkout_failed"
  | "cancelled"
  | "refunded"
  | "disputed";
export type FulfillmentStatus =
  | "not_required"
  | "waiting_payment"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; is_admin: boolean; created_at: string; updated_at: string };
        Insert: { id: string; full_name?: string | null; is_admin?: boolean; created_at?: string; updated_at?: string };
        Update: { full_name?: string | null; is_admin?: boolean; updated_at?: string };
        Relationships: [];
      };
      stories: {
        Row: { id: string; slug: string; title: string; subtitle: string | null; status: string; version: number; cover_path: string | null };
        Insert: { id?: string; slug: string; title: string; subtitle?: string | null; status?: string; version?: number; cover_path?: string | null };
        Update: { title?: string; subtitle?: string | null; status?: string; version?: number; cover_path?: string | null };
        Relationships: [];
      };
      licenses: {
        Row: { id: string; story_id: string; code_hash: string; code_last4: string; owner_user_id: string | null; activated_at: string | null; status: LicenseStatus; metadata: Json; order_item_id: string | null; order_item_unit: number | null; created_at: string };
        Insert: { id?: string; story_id: string; code_hash: string; code_last4: string; owner_user_id?: string | null; activated_at?: string | null; status?: LicenseStatus; metadata?: Json; order_item_id?: string | null; order_item_unit?: number | null; created_at?: string };
        Update: { owner_user_id?: string | null; activated_at?: string | null; status?: LicenseStatus; metadata?: Json; order_item_id?: string | null; order_item_unit?: number | null };
        Relationships: [{ foreignKeyName: "licenses_story_id_fkey"; columns: ["story_id"]; isOneToOne: false; referencedRelation: "stories"; referencedColumns: ["id"] }];
      };
      orders: {
        Row: {
          id: string; public_number: string; access_token_hash: string; user_id: string | null;
          customer_name: string; customer_email: string; customer_phone: string; customer_tax_id: string;
          status: OrderStatus; currency: "BRL"; subtotal_cents: number; shipping_cents: number;
          total_cents: number; provider: "abacatepay"; provider_customer_id: string | null;
          provider_checkout_id: string | null; checkout_url: string | null; receipt_url: string | null;
          paid_at: string | null; refunded_at: string | null; metadata: Json; created_at: string; updated_at: string;
        };
        Insert: {
          id: string; public_number: string; access_token_hash: string; user_id?: string | null;
          customer_name: string; customer_email: string; customer_phone: string; customer_tax_id: string;
          status?: OrderStatus; currency?: "BRL"; subtotal_cents: number; shipping_cents?: number;
          total_cents: number; provider?: "abacatepay"; provider_customer_id?: string | null;
          provider_checkout_id?: string | null; checkout_url?: string | null; receipt_url?: string | null;
          paid_at?: string | null; refunded_at?: string | null; metadata?: Json; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string; order_id: string; story_id: string; product_slug: string; product_title: string;
          format_id: "physical" | "digital"; format_label: string; provider_product_id: string;
          unit_price_cents: number; quantity: number; created_at: string;
        };
        Insert: {
          id: string; order_id: string; story_id: string; product_slug: string; product_title: string;
          format_id: "physical" | "digital"; format_label: string; provider_product_id: string;
          unit_price_cents: number; quantity: number; created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      order_addresses: {
        Row: {
          order_id: string; recipient_name: string; zip_code: string; street: string; number: string;
          complement: string | null; neighborhood: string; city: string; state: string; created_at: string;
        };
        Insert: {
          order_id: string; recipient_name: string; zip_code: string; street: string; number: string;
          complement?: string | null; neighborhood: string; city: string; state: string; created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_addresses"]["Insert"]>;
        Relationships: [];
      };
      order_fulfillments: {
        Row: {
          order_id: string; status: FulfillmentStatus; tracking_code: string | null; carrier: string | null;
          shipped_at: string | null; delivered_at: string | null; updated_at: string;
        };
        Insert: {
          order_id: string; status?: FulfillmentStatus; tracking_code?: string | null; carrier?: string | null;
          shipped_at?: string | null; delivered_at?: string | null; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_fulfillments"]["Insert"]>;
        Relationships: [];
      };
      payment_events: {
        Row: {
          provider_event_id: string; order_id: string | null; event_type: string; payload: Json; processed_at: string;
        };
        Insert: {
          provider_event_id: string; order_id?: string | null; event_type: string; payload?: Json; processed_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      license_deliveries: {
        Row: { license_id: string; encrypted_code: string; delivered_at: string | null; created_at: string };
        Insert: { license_id: string; encrypted_code: string; delivered_at?: string | null; created_at?: string };
        Update: { delivered_at?: string | null };
        Relationships: [];
      };
      game_sessions: {
        Row: {
          id: string; license_id: string; host_user_id: string; room_code: string; status: SessionStatus;
          current_act: number; story_version: number; elapsed_seconds: number; started_at: string | null;
          paused_at: string | null; completed_at: string | null; alarm_deadline_at: string | null;
          entry_deadline_at: string | null; extraction_deadline_at: string | null; alert_level: number;
          max_alert_level: number; collective_score: number; route_slug: string | null;
          police_eta_known: boolean; kit_restored: boolean; state: Json; version: number;
          max_players: number; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; license_id: string; host_user_id: string; room_code: string; status?: SessionStatus;
          current_act?: number; story_version: number; elapsed_seconds?: number; started_at?: string | null;
          paused_at?: string | null; completed_at?: string | null; alarm_deadline_at?: string | null;
          entry_deadline_at?: string | null; extraction_deadline_at?: string | null; alert_level?: number;
          max_alert_level?: number; collective_score?: number; route_slug?: string | null;
          police_eta_known?: boolean; kit_restored?: boolean; state?: Json; version?: number;
          max_players?: number; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["game_sessions"]["Insert"]>;
        Relationships: [{ foreignKeyName: "game_sessions_license_id_fkey"; columns: ["license_id"]; isOneToOne: false; referencedRelation: "licenses"; referencedColumns: ["id"] }];
      };
      players: {
        Row: {
          id: string; session_id: string; auth_user_id: string | null; nickname: string;
          personal_code_hash: string | null; guest_token_hash: string | null; personal_code_last4: string | null;
          device_mode: "own" | "shared" | "none"; is_host: boolean; is_active: boolean; confirmed: boolean;
          ready: boolean; role_revealed: boolean; avatar_gender: "default" | "masculino" | "feminino";
          joined_at: string; last_seen_at: string | null; disconnected_at: string | null;
          current_location_node: string | null; individual_score: number; metadata: Json;
        };
        Insert: {
          id?: string; session_id: string; auth_user_id?: string | null; nickname: string;
          personal_code_hash?: string | null; guest_token_hash?: string | null; personal_code_last4?: string | null;
          device_mode?: "own" | "shared" | "none"; is_host?: boolean; is_active?: boolean; confirmed?: boolean;
          ready?: boolean; role_revealed?: boolean; avatar_gender?: "default" | "masculino" | "feminino";
          joined_at?: string; last_seen_at?: string | null; disconnected_at?: string | null;
          current_location_node?: string | null; individual_score?: number; metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["players"]["Insert"]>;
        Relationships: [{ foreignKeyName: "players_session_id_fkey"; columns: ["session_id"]; isOneToOne: false; referencedRelation: "game_sessions"; referencedColumns: ["id"] }];
      };
      game_events: {
        Row: { id: number; session_id: string; player_id: string | null; event_type: string; payload: Json; idempotency_key: string | null; created_at: string };
        Insert: { session_id: string; player_id?: string | null; event_type: string; payload?: Json; idempotency_key?: string | null; created_at?: string };
        Update: never;
        Relationships: [];
      };
      session_action_receipts: {
        Row: { id: string; session_id: string; player_id: string | null; idempotency_key: string; command: string; response: Json; created_at: string };
        Insert: { id?: string; session_id: string; player_id?: string | null; idempotency_key: string; command: string; response?: Json; created_at?: string };
        Update: never;
        Relationships: [];
      };
      media_assets: {
        Row: { id: string; story_id: string; code: string; kind: string; storage_path: string | null; transcript: string | null; status: string; production_state: string; duration_seconds: number | null; character_slug: string | null; portrait_path: string | null; theme: string };
        Insert: { id?: string; story_id: string; code: string; kind: string; storage_path?: string | null; transcript?: string | null; status?: string; production_state?: string; duration_seconds?: number | null; character_slug?: string | null; portrait_path?: string | null; theme?: string };
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Insert"]>;
        Relationships: [];
      };
      media_transmission_events: {
        Row: { id: number; session_id: string; media_asset_id: string; player_id: string | null; event_type: string; idempotency_key: string; position_seconds: number | null; payload: Json; created_at: string };
        Insert: { session_id: string; media_asset_id: string; player_id?: string | null; event_type: string; idempotency_key: string; position_seconds?: number | null; payload?: Json; created_at?: string };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      claim_session_version: {
        Args: {
          target_session: string;
          expected_version: number;
          next_status: SessionStatus;
          next_state: Json;
          next_act: number;
          next_alert: number;
          next_score: number;
          next_route: string | null;
        };
        Returns: boolean;
      };
      create_store_order: {
        Args: { p_order: Json; p_items: Json; p_address: Json | null };
        Returns: string;
      };
      process_abacate_checkout_event: {
        Args: {
          p_event_id: string;
          p_event_type: string;
          p_order_id: string;
          p_checkout_id: string;
          p_paid_amount: number;
          p_receipt_url: string | null;
          p_payload: Json;
          p_licenses?: Json;
        };
        Returns: boolean;
      };
    };
    Enums: {
      license_status: LicenseStatus;
      session_status: SessionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
