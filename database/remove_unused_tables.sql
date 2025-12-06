-- ==============================================================================
-- REMOVE UNUSED TABLES
-- ==============================================================================
-- This script removes tables that are no longer used by the current ML pipeline.
-- Current Pipeline uses: profiles, patient_logs, air_quality, weather_history, medical_profiles

DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS lab_results;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS documents;

-- Optional: Clean up any orphaned profiles if necessary (though we generated them for medical_profiles)
-- DELETE FROM profiles WHERE id NOT IN (SELECT user_id FROM medical_profiles);
