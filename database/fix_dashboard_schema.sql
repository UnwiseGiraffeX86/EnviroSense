-- Add missing columns to profiles table for Dashboard
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS focus_index INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS stress_triggers TEXT[] DEFAULT '{}';

-- Ensure appointments table exists (re-definition from chat_system.sql if missing)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_name TEXT,
    clinic_name TEXT,
    appointment_time TIMESTAMPTZ,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for appointments if created
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Add policy for appointments if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can see own appointments'
    ) THEN
        CREATE POLICY "Users can see own appointments"
        ON appointments FOR SELECT TO authenticated
        USING (auth.uid() = patient_id);
    END IF;
END $$;
