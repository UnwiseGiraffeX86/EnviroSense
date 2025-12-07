-- ==============================================================================
-- CHAT & CONSULTATION SYSTEM
-- ==============================================================================

-- Drop tables if they exist to ensure clean state and correct types
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;

-- 1. Update Profiles with Roles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'patient';

-- 2. Consultations Table
-- Tracks the lifecycle of a patient's request
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES profiles(id),
    doctor_id UUID REFERENCES profiles(id), -- Nullable until accepted
    status TEXT DEFAULT 'pending_ai', -- pending_ai, waiting_doctor, active, closed
    initial_symptoms TEXT,
    ai_analysis JSONB, -- Stores { severity, causes, weather_context }
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Messages Table
-- Stores chat history
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id), -- Could be patient or doctor
    content TEXT,
    is_system_message BOOLEAN DEFAULT false, -- For "Doctor joined" etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Appointments Table (Re-creating it)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(id),
    doctor_id UUID NOT NULL REFERENCES profiles(id),
    patient_id UUID NOT NULL REFERENCES profiles(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. RLS Policies

-- Consultations
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can see own consultations"
ON consultations FOR SELECT TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can see available consultations"
ON consultations FOR SELECT TO authenticated
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'doctor' 
    OR auth.uid() = doctor_id
);

CREATE POLICY "Patients can create consultations"
ON consultations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update consultations (accept)"
ON consultations FOR UPDATE TO authenticated
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'doctor'
    OR auth.uid() = doctor_id
);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see messages in their consultations"
ON messages FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM consultations c 
        WHERE c.id = messages.consultation_id 
        AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
    )
);

CREATE POLICY "Users can send messages in their consultations"
ON messages FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM consultations c 
        WHERE c.id = messages.consultation_id 
        AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
    )
);

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own appointments"
ON appointments FOR SELECT TO authenticated
USING (patient_id = auth.uid() OR doctor_id = auth.uid());

CREATE POLICY "Doctors can create appointments"
ON appointments FOR INSERT TO authenticated
WITH CHECK (doctor_id = auth.uid());
