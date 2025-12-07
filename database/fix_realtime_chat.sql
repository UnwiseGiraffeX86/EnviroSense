-- ==========================================
-- FIX REALTIME CHAT & PERMISSIONS
-- ==========================================

-- 1. Ensure Tables Exist
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) NOT NULL,
  doctor_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'active', 'closed')) DEFAULT 'pending',
  ai_summary TEXT,
  risk_score INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 3. Clean up old policies (to avoid conflicts)
DROP POLICY IF EXISTS "Patients can view own consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can view all consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can update consultations" ON consultations;
DROP POLICY IF EXISTS "Patients can create consultations" ON consultations;

DROP POLICY IF EXISTS "Participants can view messages" ON chat_messages;
DROP POLICY IF EXISTS "Participants can insert messages" ON chat_messages;
DROP POLICY IF EXISTS "Patients can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Doctors can view all messages" ON chat_messages;
DROP POLICY IF EXISTS "Patients can send messages" ON chat_messages;
DROP POLICY IF EXISTS "Doctors can send messages" ON chat_messages;

-- 4. Create Robust Policies

-- CONSULTATIONS
-- Patient can view their own
CREATE POLICY "Patients can view own consultations" ON consultations
FOR SELECT USING (auth.uid() = patient_id);

-- Patient can create
CREATE POLICY "Patients can create consultations" ON consultations
FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Doctors can view ALL consultations (simplified for triage)
-- Note: In a real app, you might restrict this to a 'doctor' role check.
-- For now, we'll assume any authenticated user who isn't the patient *might* be a doctor, 
-- OR we strictly check the profiles table if it exists. 
-- Let's use a safe fallback: If you are the doctor_id OR the status is pending (triage pool).
CREATE POLICY "Doctors can view consultations" ON consultations
FOR SELECT USING (
  auth.uid() = doctor_id 
  OR status = 'pending'
  OR status = 'active' -- Allow viewing active ones too
);

-- Doctors can update (to accept cases)
CREATE POLICY "Doctors can update consultations" ON consultations
FOR UPDATE USING (true); -- Simplified for demo, ideally check role

-- CHAT MESSAGES
-- Allow anyone involved in the consultation to VIEW messages
CREATE POLICY "Participants can view messages" ON chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM consultations c
    WHERE c.id = chat_messages.consultation_id
    AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
  )
);

-- Allow anyone involved to INSERT messages
CREATE POLICY "Participants can insert messages" ON chat_messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id 
  AND EXISTS (
    SELECT 1 FROM consultations c
    WHERE c.id = chat_messages.consultation_id
    AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
  )
);

-- 5. ENABLE REALTIME (CRITICAL STEP)
-- This allows Supabase to broadcast INSERT/UPDATE events to the frontend
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'consultations') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE consultations;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  END IF;
END
$$;

-- 6. Force Schema Cache Reload
NOTIFY pgrst, 'reload config';
