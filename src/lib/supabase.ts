import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          company: string | null;
          need: string | null;
          budget: string | null;
          score: number;
          score_label: string;
          transcript: unknown;
          notified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          company?: string | null;
          need?: string | null;
          budget?: string | null;
          score?: number;
          score_label?: string;
          transcript?: unknown;
          notified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string | null;
          email?: string | null;
          company?: string | null;
          need?: string | null;
          budget?: string | null;
          score?: number;
          score_label?: string;
          transcript?: unknown;
          notified?: boolean;
          updated_at?: string;
        };
      };
    };
  };
};

/** Returns a Supabase client or null if env vars are not configured. */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key);
}

/** Server-side admin client. Returns null if not configured. */
export function createServiceClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey ?? anonKey;
  if (!url || !key) return null;
  return createClient<Database>(url, key);
}

/** Singleton anon client (for client components). */
let _supabase: SupabaseClient<Database> | null = null;
export function getSupabase(): SupabaseClient<Database> | null {
  if (!_supabase) _supabase = getSupabaseClient();
  return _supabase;
}
