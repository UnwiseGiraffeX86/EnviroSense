-- Ensure consultations table has doctor_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'doctor_id') THEN
        ALTER TABLE consultations ADD COLUMN doctor_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Ensure RLS policies are correct
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Policy for Doctors to update consultations (Accept Case)
DROP POLICY IF EXISTS "Doctors can update consultations" ON consultations;
CREATE POLICY "Doctors can update consultations" ON consultations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Policy for Doctors to view all consultations
DROP POLICY IF EXISTS "Doctors can view all consultations" ON consultations;
CREATE POLICY "Doctors can view all consultations" ON consultations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );
