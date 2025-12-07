-- ==============================================================================
-- Public View for Air Quality
-- ==============================================================================
-- Exposes air quality data with pre-converted GeoJSON boundaries for the frontend.

CREATE OR REPLACE VIEW air_quality_public AS
SELECT
  id,
  sector_name,
  pm25,
  pm10,
  ST_AsGeoJSON(boundary)::jsonb as boundary_geojson
FROM air_quality;

-- Grant access to anon (public)
GRANT SELECT ON air_quality_public TO anon;
GRANT SELECT ON air_quality_public TO authenticated;
