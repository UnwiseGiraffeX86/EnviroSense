-- ==============================================================================
-- FIX PROFILE RLS POLICIES
-- ==============================================================================

-- Allow users to create their own profile row.
-- This is required for the "Sign in with Google" flow where the client
-- creates the profile if it doesn't exist.

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);
