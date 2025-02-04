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
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          linkedin_url: string | null
          github_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          file_url: string
          file_path: string
          ats_score: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          file_url: string
          file_path: string
          ats_score?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          file_url?: string
          file_path?: string
          ats_score?: number
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 