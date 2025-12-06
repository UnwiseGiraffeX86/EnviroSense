-- Table: weather_history
-- Description: Stores historical weather data for correlation analysis.
CREATE TABLE IF NOT EXISTS weather_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    temperature_2m DOUBLE PRECISION,
    relative_humidity_2m DOUBLE PRECISION,
    surface_pressure DOUBLE PRECISION,
    wind_speed_10m DOUBLE PRECISION,
    wind_direction_10m DOUBLE PRECISION,
    precipitation DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_weather_history_timestamp ON weather_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_weather_history_location ON weather_history(lat, lon);

-- RLS
ALTER TABLE weather_history ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (authenticated and anon)
CREATE POLICY "Public read access"
ON weather_history FOR SELECT
TO authenticated, anon
USING (true);

-- Allow write access only to service role (scripts)
CREATE POLICY "Service role write access"
ON weather_history FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
