-- ==============================================================================
-- RPC Function: get_air_quality_for_point
-- ==============================================================================
-- Description: Retrieves the air quality data (PM2.5, PM10) for a specific
-- geographic point by finding which sector polygon contains it.
-- Used by the 'analyze-risk' Edge Function.

CREATE OR REPLACE FUNCTION get_air_quality_for_point(lat float, long float)
RETURNS TABLE (sector_name text, pm25 float, pm10 float)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    air_quality.sector_name, 
    air_quality.pm25, 
    air_quality.pm10
  FROM air_quality
  WHERE ST_Intersects(boundary, ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography);
END;
$$;
