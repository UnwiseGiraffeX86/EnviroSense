-- ==============================================================================
-- RPC: Execute Dynamic SQL (Restricted)
-- ==============================================================================
-- Allows the 'text-to-sql' Edge Function to execute generated queries.
-- SECURITY WARNING: This function allows executing arbitrary SQL.
-- It MUST be restricted to specific roles (e.g., service_role or doctor).

CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres/admin)
AS $$
DECLARE
  result json;
BEGIN
  -- 1. Basic Safety Checks (Prevent destructive commands)
  IF query ~* '\y(DELETE|DROP|TRUNCATE|UPDATE|INSERT|ALTER|GRANT|REVOKE)\y' THEN
    RAISE EXCEPTION 'Destructive queries are not allowed.';
  END IF;

  -- 2. Execute and return as JSON
  EXECUTE 'SELECT json_agg(t) FROM (' || query || ') t' INTO result;
  
  RETURN result;
END;
$$;

-- Revoke public access
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM public;
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM anon;
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM authenticated;

-- Grant access ONLY to service_role (Edge Functions use this)
-- Wait, our Edge Function uses the User's Auth Context (authenticated role).
-- So we need to grant it to 'authenticated', BUT check the user's role inside the function?
-- Or, we rely on the Edge Function to verify the role before calling this.
-- Since the Edge Function uses the Service Key to call this RPC (if we switch back), it's safer.
-- BUT we switched the Edge Function to use the User's Key.
-- So the User (authenticated) needs permission.

GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- Add internal role check
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  user_role text;
BEGIN
  -- Check if the calling user is a doctor
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  
  IF user_role IS DISTINCT FROM 'doctor' THEN
    RAISE EXCEPTION 'Access Denied: Doctors only.';
  END IF;

  -- Safety Checks
  IF query ~* '\y(DELETE|DROP|TRUNCATE|UPDATE|INSERT|ALTER|GRANT|REVOKE)\y' THEN
    RAISE EXCEPTION 'Destructive queries are not allowed.';
  END IF;

  EXECUTE 'SELECT json_agg(t) FROM (' || query || ') t' INTO result;
  RETURN result;
END;
$$;
