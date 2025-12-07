CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  focus_level INT, -- 0-10 (Slider)
  sleep_quality TEXT, -- 'Restorative', 'Fragmented', 'Insomnia'
  breathing_status TEXT, -- 'Clear', 'Mild Resistance', 'Wheezing/Heavy'
  audio_url TEXT, -- Link to stored voice note
  transcript TEXT, -- AI Text-to-Speech result
  ai_risk_assessment TEXT, -- 'Low', 'Medium', 'High - Doctor Alerted'
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to avoid errors on re-run
DROP POLICY IF EXISTS "Users can insert their own logs" ON daily_logs;
DROP POLICY IF EXISTS "Users can view their own logs" ON daily_logs;

CREATE POLICY "Users can insert their own logs" ON daily_logs
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs" ON daily_logs
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
