-- ==============================================================================
-- Update RLS Policies for Public Access
-- ==============================================================================
-- The initial setup restricted 'air_quality' to authenticated users.
-- This script opens it up to the 'anon' role so the public dashboard can render.

CREATE POLICY "Public can view air quality" 
    ON air_quality FOR SELECT 
    TO anon 
    USING (true);
