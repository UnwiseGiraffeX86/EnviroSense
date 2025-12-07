-- 1. Ensure chat_messages table exists
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Participants can insert messages" ON chat_messages;
DROP POLICY IF EXISTS "Participants can view messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view messages for their consultations" ON chat_messages;

-- 4. Create comprehensive policies
-- Allow participants (patient or doctor) to insert messages
CREATE POLICY "Participants can insert messages" ON chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND (
    EXISTS (
      SELECT 1 FROM consultations 
      WHERE id = consultation_id 
      AND (patient_id = auth.uid() OR doctor_id = auth.uid())
    )
  )
);

-- Allow participants to view messages
CREATE POLICY "Participants can view messages" ON chat_messages
FOR SELECT
USING (
    EXISTS (
      SELECT 1 FROM consultations 
      WHERE id = consultation_id 
      AND (patient_id = auth.uid() OR doctor_id = auth.uid())
    )
);

-- 5. Enable Realtime (Publication)
-- We use a DO block to avoid errors if tables are already added
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
