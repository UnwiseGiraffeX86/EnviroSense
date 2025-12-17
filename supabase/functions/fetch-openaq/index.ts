import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Bucharest Coordinates
const LAT = 44.4268
const LON = 26.1025
const RADIUS = 25000 // 25km

async function fetchOpenMeteo(lat: number, lon: number) {
  try {
    const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality')
    url.searchParams.set('latitude', lat.toString())
    url.searchParams.set('longitude', lon.toString())
    url.searchParams.set('current', 'pm10,pm2_5')
    
    const res = await fetch(url)
    if (!res.ok) return null
    
    const data = await res.json()
    return {
      pm25: data.current?.pm2_5 || 0,
      pm10: data.current?.pm10 || 0
    }
  } catch (e) {
    console.error("OpenMeteo error:", e)
    return null
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const openAqKey = Deno.env.get('OPENAQ_API_KEY')

    if (!supabaseUrl || !supabaseKey || !openAqKey) {
      throw new Error('Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAQ_API_KEY')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Starting OpenAQ fetch...")

    // 1. Cleanup old zero-value records first
    const { error: deleteError } = await supabase
      .from('air_quality')
      .delete()
      .eq('pm25', 0)
    
    if (deleteError) console.error("Cleanup error:", deleteError)

    // 2. Fetch Locations from OpenAQ
    const locationsUrl = new URL('https://api.openaq.org/v3/locations')
    locationsUrl.searchParams.set('coordinates', `${LAT},${LON}`)
    locationsUrl.searchParams.set('radius', RADIUS.toString())
    locationsUrl.searchParams.set('limit', '100')

    const locRes = await fetch(locationsUrl, {
      headers: {
        'X-API-Key': openAqKey,
        'Accept': 'application/json'
      }
    })

    if (!locRes.ok) {
      throw new Error(`OpenAQ Locations API error: ${locRes.statusText}`)
    }

    const locData = await locRes.json()
    const locations = locData.results || []
    console.log(`Found ${locations.length} locations.`)

    let processedCount = 0

    // 3. Process each location
    for (const loc of locations) {
      const name = loc.name || "Unknown Station"
      const coords = loc.coordinates || {}
      
      if (!coords.latitude || !coords.longitude) continue

      let pm25 = 0
      let pm10 = 0

      // Check sensors
      const sensors = loc.sensors || []
      
      for (const sensor of sensors) {
        let rawParam = "";
        if (sensor.parameter && typeof sensor.parameter === 'object' && sensor.parameter.name) {
            rawParam = sensor.parameter.name;
        } else if (typeof sensor.parameter === 'string') {
            rawParam = sensor.parameter;
        }
        
        const param = rawParam.toLowerCase().replace(/[^a-z0-9]/g, "");
        const sensorId = sensor.id

        if (param === 'pm25' || param === 'pm10') {
          // Fetch latest measurement for this sensor
          try {
            const measureUrl = new URL(`https://api.openaq.org/v3/sensors/${sensorId}/measurements`)
            measureUrl.searchParams.set('limit', '1')
            
            const mRes = await fetch(measureUrl, {
              headers: { 'X-API-Key': openAqKey }
            })
            
            if (mRes.ok) {
              const mData = await mRes.json()
              const val = mData.results?.[0]?.value || 0
              
              if (val > 0) {
                if (param === 'pm25') pm25 = val
                if (param === 'pm10') pm10 = val
              }
            }
          } catch (e) {
            console.error(`Error fetching sensor ${sensorId}:`, e)
          }
        }
      }

      // Fallback to Open-Meteo if OpenAQ has no data
      if (pm25 === 0 && pm10 === 0) {
        console.log(`No OpenAQ data for ${name}, trying Open-Meteo...`)
        const omData = await fetchOpenMeteo(coords.latitude, coords.longitude)
        if (omData) {
          pm25 = omData.pm25
          pm10 = omData.pm10
        }
      }

      // Skip if still no valid data
      if (pm25 === 0 && pm10 === 0) {
        continue
      }

      // Create WKT Polygon (Buffer ~1.5km)
      const buffer = 0.015
      const lat = coords.latitude
      const lon = coords.longitude
      const wkt = `POLYGON((${lon-buffer} ${lat-buffer}, ${lon+buffer} ${lat-buffer}, ${lon+buffer} ${lat+buffer}, ${lon-buffer} ${lat+buffer}, ${lon-buffer} ${lat-buffer}))`
      
      const sectorName = `${name} (Station)`

      // Upsert to DB
      const { error: upsertError } = await supabase
        .from('air_quality')
        .upsert({
          sector_name: sectorName,
          pm25: pm25,
          pm10: pm10,
          boundary: wkt,
          last_updated: new Date().toISOString()
        }, { onConflict: 'sector_name' })

      if (upsertError) {
        console.error(`Error upserting ${sectorName}:`, upsertError)
      } else {
        processedCount++
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed ${processedCount} stations`,
      locationsFound: locations.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Function error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
