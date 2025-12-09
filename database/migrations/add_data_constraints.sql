-- ==============================================================================
-- Add Data Integrity Constraints
-- ==============================================================================
-- Adds CHECK constraints to ensure data quality and prevent integer overflow/underflow attacks.

-- 1. Focus Index (1-10)
ALTER TABLE profiles 
ADD CONSTRAINT check_focus_index 
CHECK (focus_index BETWEEN 1 AND 10);

-- 2. Pollution Sensitivity (1-10)
ALTER TABLE profiles 
ADD CONSTRAINT check_pollution_sensitivity 
CHECK (pollution_sensitivity BETWEEN 1 AND 10);

-- 3. Inhaler Usage Frequency (0-10 scale)
ALTER TABLE profiles 
ADD CONSTRAINT check_inhaler_usage 
CHECK (inhaler_usage_frequency BETWEEN 0 AND 10);

-- 4. Activity Level (Enum-like check)
ALTER TABLE profiles 
ADD CONSTRAINT check_activity_level 
CHECK (activity_level IN ('Sedentary', 'Moderate', 'Active'));
