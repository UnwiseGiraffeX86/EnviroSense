import { createClient } from 'jsr:@supabase/supabase-js@2'
import OpenAI from 'jsr:@openai/openai'

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --------------------------------------------------------------------------
    // 0. Setup & Auth
    // --------------------------------------------------------------------------
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
      throw new Error('Missing environment variables.')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const openai = new OpenAI({ apiKey: openaiApiKey })

    // Parse request body
    const { symptom_description, user_lat, user_long } = await req.json()

    if (!symptom_description || !user_lat || !user_long) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: symptom_description, user_lat, user_long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // --------------------------------------------------------------------------
    // 1. Privacy Firewall (PII Redaction)
    // --------------------------------------------------------------------------
    let redacted_symptoms = symptom_description

    // Simple Regex for Emails and Phone Numbers (removing npm:redact-pii to fix boot errors)
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
    redacted_symptoms = symptom_description.replace(emailRegex, '[EMAIL]').replace(phoneRegex, '[PHONE]')

    // --------------------------------------------------------------------------
    // 2. Context Retrieval (RAG)
    // --------------------------------------------------------------------------
    // Enhance query to bridge the gap between "symptoms" and "regulations/studies"
    const searchQuery = `${redacted_symptoms} health risks air pollution EU regulations particulate matter`

    // Generate embedding for the enhanced query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: searchQuery,
    })
    const symptomEmbedding = embeddingResponse.data[0].embedding

    // Query Knowledge Base via RPC
    const { data: documents, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: symptomEmbedding,
      match_threshold: 0.4, // Lowered threshold for broader matching
      match_count: 3,
    })

    if (matchError) {
      console.error('Error matching documents:', matchError)
      throw matchError
    }

    const regulatoryContext = documents
      ?.map((doc: any) => doc.content)
      .join('\n---\n') || 'No specific regulation found.'

    // --------------------------------------------------------------------------
    // 3. Environmental Context
    // --------------------------------------------------------------------------
    // Note: This requires a corresponding RPC function in Postgres to perform the spatial query.
    // CREATE OR REPLACE FUNCTION get_air_quality_for_point(lat float, long float)
    // RETURNS TABLE (sector_name text, pm25 float, pm10 float)
    // LANGUAGE plpgsql
    // AS $$
    // BEGIN
    //   RETURN QUERY
    //   SELECT sector_name, pm25, pm10
    //   FROM air_quality
    //   WHERE ST_Contains(boundary, ST_SetSRID(ST_MakePoint(long, lat), 4326));
    // END;
    // $$;

    const { data: airQualityData, error: aqError } = await supabase.rpc('get_air_quality_for_point', {
      lat: user_lat,
      long: user_long,
    })

    if (aqError) {
      console.error('Error fetching air quality:', aqError)
      // Proceeding without AQ data if error, or handle gracefully
    }

    const airQuality = airQualityData && airQualityData[0] 
      ? `Sector: ${airQualityData[0].sector_name}, PM2.5: ${airQualityData[0].pm25}, PM10: ${airQualityData[0].pm10}`
      : 'Air quality data unavailable for this location.'

    // --------------------------------------------------------------------------
    // 4. Neuro-Symbolic Inference
    // --------------------------------------------------------------------------
    const systemPrompt = `You are an expert medical triage assistant using EU Air Quality regulations. You must analyze the patient's symptoms in the context of the provided pollution levels and regulations. Output a JSON object with keys: 'risk_level' (Low/Medium/High), 'advisory' (Actionable advice), and 'relevant_regulation' (Citation from context).`
    
    const userPrompt = `
    Pollution Context: ${airQuality}
    Regulation Context: ${regulatoryContext}
    Patient Symptoms (Redacted): ${redacted_symptoms}
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    // --------------------------------------------------------------------------
    // 5. Response
    // --------------------------------------------------------------------------
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
