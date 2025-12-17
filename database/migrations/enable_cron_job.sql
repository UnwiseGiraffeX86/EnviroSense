-- 1. Enable the required extensions
-- Note: You might need to enable these in the Supabase Dashboard > Database > Extensions if this fails.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Schedule the job (Runs every 10 minutes)
-- We use the project URL and Service Key from your .env file
SELECT cron.schedule(
  'fetch-air-quality-every-10-mins', -- Job name
  '*/10 * * * *',                    -- Cron schedule (every 10 mins)
  $$
  SELECT
    net.http_post(
        url:='https://mlhayhtygyzhhytpuuow.supabase.co/functions/v1/fetch-openaq',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1saGF5aHR5Z3l6aGh5dHB1dW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTAwOTk5MCwiZXhwIjoyMDgwNTg1OTkwfQ.0QiU89TzsrW41kw0pMDp-Bgq7budO5-SGZ63z71eW84"}'::jsonb
    ) as request_id;
  $$
);

-- To verify it's scheduled:
-- SELECT * FROM cron.job;

-- To manually trigger it once for testing:
-- SELECT net.http_post(
--     url:='https://mlhayhtygyzhhytpuuow.supabase.co/functions/v1/fetch-openaq',
--     headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1saGF5aHR5Z3l6aGh5dHB1dW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTAwOTk5MCwiZXhwIjoyMDgwNTg1OTkwfQ.0QiU89TzsrW41kw0pMDp-Bgq7budO5-SGZ63z71eW84"}'::jsonb
-- );
