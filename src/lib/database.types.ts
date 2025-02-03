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
      jobs: {
        Row: {
          id: number
          created_at: string
          title: string
          company: string
          location: string
          description: string
          requirements: string
          salary_range: string | null
          application_url: string
          posted_by: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          company: string
          location: string
          description: string
          requirements: string
          salary_range?: string | null
          application_url: string
          posted_by: string
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          company?: string
          location?: string
          description?: string
          requirements?: string
          salary_range?: string | null
          application_url?: string
          posted_by?: string
        }
      }
      resumes: {
        Row: {
          id: number
          created_at: string
          user_id: string
          file_path: string
          public_url: string
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          file_path: string
          public_url: string
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          file_path?: string
          public_url?: string
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          linkedin_url: string | null
          github_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          email: string
          linkedin_url?: string | null
          github_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          linkedin_url?: string | null
          github_url?: string | null
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