import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  return supabaseUrl !== "" && supabaseAnonKey !== ""
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      shopping_lists: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      shopping_items: {
        Row: {
          id: string
          list_id: string
          name: string
          quantity: number
          unit: string
          category: string
          purchased: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          list_id: string
          name: string
          quantity?: number
          unit?: string
          category?: string
          purchased?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          name?: string
          quantity?: number
          unit?: string
          category?: string
          purchased?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
