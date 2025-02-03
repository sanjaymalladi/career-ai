export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          description: string
          skills_required: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          skills_required: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          skills_required?: string
        }
      }
      resumes: {
        Row: {
          id: string
          ats_score: number
          user_id: string
        }
        Insert: {
          id?: string
          ats_score: number
          user_id: string
        }
        Update: {
          id?: string
          ats_score?: number
          user_id?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          linkedin_url: string
          github_url: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          linkedin_url?: string
          github_url?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          linkedin_url?: string
          github_url?: string
        }
      }
    }
  }
} 