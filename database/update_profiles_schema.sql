-- Update profiles table to include new onboarding fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS sex TEXT,
ADD COLUMN IF NOT EXISTS respiratory_conditions TEXT[],
ADD COLUMN IF NOT EXISTS inhaler_usage_frequency INTEGER,
ADD COLUMN IF NOT EXISTS activity_level TEXT,
ADD COLUMN IF NOT EXISTS pollution_sensitivity INTEGER;

-- Ensure RLS allows users to insert/update their own profile
-- (Assuming existing policies might need review, but usually 'insert' is allowed for authenticated users matching ID)
-- If not, we might need:
-- CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
