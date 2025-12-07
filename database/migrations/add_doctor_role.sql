-- 1. Add role to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor'));

-- 2. Create helper function to check role safely (prevents recursion in RLS policies)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- 3. Update Profiles RLS
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles; -- Handles legacy name with period
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;  -- Handles correct name
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Doctors can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;

-- Patients can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Doctors can view ALL profiles
CREATE POLICY "Doctors can view all profiles" ON profiles
FOR SELECT USING (get_my_role() = 'doctor');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);


-- 4. Update Daily Logs RLS
DROP POLICY IF EXISTS "Users can view their own logs" ON daily_logs;
DROP POLICY IF EXISTS "Users can insert their own logs" ON daily_logs;
DROP POLICY IF EXISTS "Users can view own logs" ON daily_logs;
DROP POLICY IF EXISTS "Doctors can view all logs" ON daily_logs;
DROP POLICY IF EXISTS "Users can insert own logs" ON daily_logs;

-- Patients can view their own logs
CREATE POLICY "Users can view own logs" ON daily_logs
FOR SELECT USING (auth.uid() = user_id);

-- Doctors can view ALL logs
CREATE POLICY "Doctors can view all logs" ON daily_logs
FOR SELECT USING (get_my_role() = 'doctor');

-- Patients can insert their own logs
CREATE POLICY "Users can insert own logs" ON daily_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 5. Create Clinical Notes Table
CREATE TABLE IF NOT EXISTS clinical_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content TEXT NOT NULL,
    patient_id UUID REFERENCES profiles(id) NOT NULL,
    doctor_id UUID REFERENCES profiles(id) NOT NULL,
    related_log_id UUID REFERENCES daily_logs(id)
);

ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;

-- 6. Clinical Notes RLS
-- Only doctors can view/edit clinical notes
CREATE POLICY "Doctors can view all clinical notes" ON clinical_notes
FOR SELECT USING (get_my_role() = 'doctor');

CREATE POLICY "Doctors can insert clinical notes" ON clinical_notes
FOR INSERT WITH CHECK (get_my_role() = 'doctor');

CREATE POLICY "Doctors can update clinical notes" ON clinical_notes
FOR UPDATE USING (get_my_role() = 'doctor');

-- 7. TEST SETUP: Set a specific user as Doctor (Replace UUID with your actual User ID)
-- UPDATE profiles SET role = 'doctor' WHERE id = 'replace-with-your-uuid';
