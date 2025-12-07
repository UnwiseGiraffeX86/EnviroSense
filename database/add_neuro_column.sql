-- Add neuro_profile column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS neuro_profile JSONB DEFAULT '{}'::jsonb;

-- Grant permission to authenticated users to update this column (if not covered by ALL)
GRANT ALL ON profiles TO authenticated;
