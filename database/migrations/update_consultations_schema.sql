-- Add ai_summary column if it doesn't exist
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- Add risk_score column if it doesn't exist
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS risk_score INT CHECK (risk_score >= 1 AND risk_score <= 10);

-- Add doctor_id column if it doesn't exist (ensuring previous fixes are applied)
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS doctor_id UUID REFERENCES auth.users(id);

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload config';
