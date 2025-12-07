-- Table: medical_profiles
-- Description: Stores sensitive encrypted medical information for patients.
-- All 'encrypted_' columns store data in format: iv:ciphertext:tag (hex encoded)
CREATE TABLE IF NOT EXISTS medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    encrypted_full_name TEXT,
    encrypted_dob TEXT,
    encrypted_gender TEXT,
    encrypted_height_cm TEXT,
    encrypted_weight_kg TEXT,
    encrypted_blood_type TEXT,
    encrypted_existing_conditions TEXT, -- JSON string of conditions
    encrypted_family_history TEXT, -- JSON string of history
    encrypted_medications TEXT, -- JSON string of current meds
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- RLS
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own medical profile"
ON medical_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY "Service role full access"
ON medical_profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
