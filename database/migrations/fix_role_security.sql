-- ==============================================================================
-- Fix Role Security
-- ==============================================================================
-- Prevents users from escalating their privileges by updating their own role.

CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Allow if it's a service_role (superuser) or if the user is not updating themselves (e.g. admin updating user)
    -- However, in Supabase, RLS policies control WHO can update.
    -- If the current user is the one being updated (auth.uid() = OLD.id), they should NOT be able to change the role.
    IF auth.uid() = OLD.id THEN
        RAISE EXCEPTION 'You cannot change your own role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid errors on re-run
DROP TRIGGER IF EXISTS check_role_update ON profiles;

CREATE TRIGGER check_role_update
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION prevent_role_change();
