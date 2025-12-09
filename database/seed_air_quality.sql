-- ==========================================
-- SEED AIR QUALITY DATA
-- ==========================================

-- 1. Ensure Unique Constraint Exists (Idempotent)
-- This block checks if the constraint exists before trying to add it.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'air_quality_sector_name_key'
    ) THEN
        ALTER TABLE air_quality ADD CONSTRAINT air_quality_sector_name_key UNIQUE (sector_name);
    END IF;
END
$$;

-- 2. Upsert Data
-- Now that we know the constraint exists, we can safely use ON CONFLICT
INSERT INTO air_quality (sector_name, pm25, pm10, last_updated)
VALUES 
('Sector 1', 12.5, 25.0, now()),
('Sector 2', 15.2, 28.1, now()),
('Sector 3', 10.8, 22.4, now()),
('Sector 4', 18.5, 35.2, now()),
('Sector 5', 14.1, 26.8, now()),
('Sector 6', 11.9, 24.5, now())
ON CONFLICT (sector_name) 
DO UPDATE SET 
    pm25 = EXCLUDED.pm25,
    pm10 = EXCLUDED.pm10,
    last_updated = EXCLUDED.last_updated;
