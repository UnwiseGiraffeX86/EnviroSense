CREATE TABLE IF NOT EXISTS token_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    feature_name TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to avoid errors on re-run
DROP POLICY IF EXISTS "Users can insert their own token usage" ON token_usage;
DROP POLICY IF EXISTS "Users can view their own token usage" ON token_usage;

-- Allow authenticated users to insert their own usage (if we use client-side or auth-context server-side)
CREATE POLICY "Users can insert their own token usage" ON token_usage
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own usage
CREATE POLICY "Users can view their own token usage" ON token_usage
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Service role bypasses RLS, so edge functions using service key are fine.
