// src/lib/supabase/types.ts
// TypeScript types matching the DB schema

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type AISummary = {
  pros: string[]
  cons: string[]
  summary: string
  red_flags: string[]
  overall_sentiment: 'positive' | 'neutral' | 'negative'
}

export interface Database {
  public: {
    Tables: {
      apartments: {
        Row: {
          id: string
          name: string
          address: string
          lat: number | null
          lng: number | null
          landlord_id: string | null
          rent_min: number | null
          rent_max: number | null
          bedrooms: number[] | null
          bathrooms: number | null
          sqft_min: number | null
          sqft_max: number | null
          pets_allowed: boolean
          parking_available: boolean
          utilities_included: boolean
          laundry_in_unit: boolean
          laundry_in_building: boolean
          furnished: boolean
          ac: boolean
          dishwasher: boolean
          lease_start_month: number | null
          lease_length_months: number | null
          rating_maintenance: number
          rating_responsiveness: number
          rating_noise: number
          rating_cleanliness: number
          rating_value: number
          rating_pests: number
          rating_overall: number
          review_count: number
          ai_summary: AISummary | null
          ai_red_flags: string[]
          ai_last_updated: string | null
          google_rating: number | null
          google_review_count: number | null
          contact_url: string | null
          leasing_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['apartments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['apartments']['Insert']>
      }
      landlords: {
        Row: {
          id: string
          name: string
          website: string | null
          email: string | null
          phone: string | null
          aggregate_rating: number
          review_count: number
          known_issues: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['landlords']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['landlords']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          apartment_id: string
          user_id: string
          rating_maintenance: number | null
          rating_responsiveness: number | null
          rating_noise: number | null
          rating_cleanliness: number | null
          rating_value: number | null
          rating_pests: number | null
          body: string | null
          photo_urls: string[]
          verified_tenant: boolean
          lease_doc_url: string | null
          lived_from: string | null
          lived_until: string | null
          helpful_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'helpful_count'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          display_name: string | null
          current_apartment_id: string | null
          review_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      questions: {
        Row: {
          id: string
          apartment_id: string
          user_id: string
          question: string
          ai_answer: string | null
          upvotes: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at' | 'upvotes'>
        Update: Partial<Database['public']['Tables']['questions']['Insert']>
      }
      reports: {
        Row: {
          id: string
          review_id: string
          reported_by: string
          reason: string
          status: 'pending' | 'resolved' | 'dismissed'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'status'>
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
    }
  }
}
