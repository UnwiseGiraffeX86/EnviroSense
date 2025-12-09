-- ==========================================
-- FIX USER SECTOR
-- ==========================================

-- Update all profiles that have no sector to 'Sector 1'
-- This ensures the dashboard has data to load.
UPDATE profiles
SET sector = 'Sector 1'
WHERE sector IS NULL OR sector = '';

-- Also ensure the air_quality table has data (just in case the previous seed failed)
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
