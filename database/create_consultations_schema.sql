-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) NOT NULL,
  doctor_id UUID REFERENCES auth.users(id), -- Nullable initially
  status TEXT CHECK (status IN ('pending', 'active', 'closed')) DEFAULT 'pending',
  ai_summary TEXT,
  risk_score INT CHECK (risk_score >= 1 AND risk_score <= 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Patients can view own consultations" ON consultations;
DROP POLICY IF EXISTS "Patients can create consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can view all consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can update consultations" ON consultations;

DROP POLICY IF EXISTS "Patients can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Doctors can view all messages" ON chat_messages;
DROP POLICY IF EXISTS "Patients can send messages" ON chat_messages;
DROP POLICY IF EXISTS "Doctors can send messages" ON chat_messages;

-- Policies for consultations

-- Patients can view their own consultations
CREATE POLICY "Patients can view own consultations" ON consultations
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id);

-- Patients can create a consultation
CREATE POLICY "Patients can create consultations" ON consultations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Doctors can view all consultations
CREATE POLICY "Doctors can view all consultations" ON consultations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Doctors can update consultations (e.g. assign themselves, close)
CREATE POLICY "Doctors can update consultations" ON consultations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Policies for chat_messages

-- Patients can view messages for their consultations
CREATE POLICY "Patients can view own messages" ON chat_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.id = chat_messages.consultation_id
      AND c.patient_id = auth.uid()
    )
  );

-- Doctors can view all messages
CREATE POLICY "Doctors can view all messages" ON chat_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Patients can send messages
CREATE POLICY "Patients can send messages" ON chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.id = consultation_id
      AND c.patient_id = auth.uid()
    )
  );

-- Doctors can send messages
CREATE POLICY "Doctors can send messages" ON chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );
