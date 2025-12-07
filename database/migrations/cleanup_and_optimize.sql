-- ==============================================================================
-- DATABASE CLEANUP & OPTIMIZATION SCRIPT
-- ==============================================================================

-- 1. Remove duplicates from weather_history (if any)
-- Keeps the most recent entry (by ID) if duplicates exist
DELETE FROM weather_history a USING weather_history b
WHERE a.id < b.id
AND a.timestamp = b.timestamp
AND a.lat = b.lat
AND a.lon = b.lon;

-- 2. Add Unique Constraint to prevent future duplicates
-- This ensures we don't pay for storing the same weather data twice
ALTER TABLE weather_history 
ADD CONSTRAINT unique_weather_entry UNIQUE (timestamp, lat, lon);

-- 3. Optimize Spatial Queries for Patient Logs
-- GIST indexes are essential for efficient "Find nearest station" queries
CREATE INDEX IF NOT EXISTS idx_patient_logs_location ON patient_logs USING GIST (log_location);

-- 4. Optimize Air Quality Spatial Queries
CREATE INDEX IF NOT EXISTS idx_air_quality_boundary ON air_quality USING GIST (boundary);

-- 5. Remove Air Quality records with no useful data
DELETE FROM air_quality WHERE pm25 IS NULL AND pm10 IS NULL;

-- 6. Analyze tables to update statistics for the Query Planner
ANALYZE weather_history;
ANALYZE patient_logs;
ANALYZE air_quality;
ANALYZE medical_profiles;

-- Note: To reclaim physical disk space, you can run 'VACUUM FULL;' 
-- but this locks tables and should be done during maintenance windows.
