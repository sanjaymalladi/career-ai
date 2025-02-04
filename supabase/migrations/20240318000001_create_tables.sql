-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text,
  email text,
  linkedin_url text,
  github_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  file_url text NOT NULL,
  file_path text NOT NULL,
  ats_score integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id);
CREATE INDEX IF NOT EXISTS resumes_created_at_idx ON resumes(created_at DESC); 