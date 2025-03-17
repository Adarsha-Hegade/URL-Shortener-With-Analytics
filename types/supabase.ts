export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      shortened_urls: {
        Row: {
          id: string
          user_id: string
          original_url: string
          slug: string
          created_at: string
          expires_at: string | null
          is_premium: boolean
        }
        Insert: {
          id?: string
          user_id: string
          original_url: string
          slug: string
          created_at?: string
          expires_at?: string | null
          is_premium?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          slug?: string
          created_at?: string
          expires_at?: string | null
          is_premium?: boolean
        }
      }
      url_analytics: {
        Row: {
          id: string
          url_id: string
          visitor_id: string
          device_type: string
          browser: string
          country: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          url_id: string
          visitor_id: string
          device_type: string
          browser: string
          country?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          url_id?: string
          visitor_id?: string
          device_type?: string
          browser?: string
          country?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
    }
  }
}