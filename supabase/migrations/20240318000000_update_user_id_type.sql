-- Drop existing foreign key constraints
ALTER TABLE resumes DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

-- Change the type of id column in users table
ALTER TABLE users 
  ALTER COLUMN id TYPE text;

-- Change the type of user_id column in resumes table
ALTER TABLE resumes 
  ALTER COLUMN user_id TYPE text;

-- Recreate the foreign key constraint
ALTER TABLE resumes 
  ADD CONSTRAINT resumes_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE; 