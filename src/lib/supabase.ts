import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role for admin operations
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    // Fall back to anon key if service role not available
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return createClient(supabaseUrl, serviceKey);
}

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
