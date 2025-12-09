-- ==========================================
-- FIX PROFILES SCHEMA
-- ==========================================

-- Add missing columns to profiles table to match frontend expectations
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS focus_index INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS stress_triggers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS respiratory_conditions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS inhaler_usage_frequency INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pollution_sensitivity INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS activity_level TEXT DEFAULT 'Moderate';

-- Ensure RLS policies allow updates
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
