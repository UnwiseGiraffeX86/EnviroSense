import { createClient } from 'jsr:@supabase/supabase-js@2'
import OpenAI from 'jsr:@openai/openai'
import { Redactor } from 'npm:redact-pii'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Air Quality Data object containing pollution metrics
 */
interface PollutionData {
  pm25: number
  pm10: number
  sector: string
}

/**
 * Risk Assessment Response from the Neuro-Symbolic Agent
 * Enforces strict JSON schema for triage output
 */
interface RiskAssessment {
  risk_level: 'Low' | 'Medium' | 'High'
  advisory: string
  relevant_regulation: string
  confidence_score?: number
  environmental_factor?: string
}

/**
 * Structured response for the Edge Function
 */
interface EdgeFunctionResponse {
  risk_assessment: RiskAssessment
  timestamp: string
  location?: {
    lat: number
    long: number
    sector: string
  }
}

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

    try {
      const redactor = new Redactor({
        builtInRedactors: {
          names: { enabled: true },
          emailAddress: { enabled: true },
          phoneNumber: { enabled: true },
        },
      })
      redacted_symptoms = await redactor.redact(symptom_description)
    } catch (err) {
      console.error('Redact-pii failed, using fallback regex:', err)
      // Fallback Regex for Emails and Phone Numbers
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
      const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
      redacted_symptoms = symptom_description.replace(emailRegex, '[EMAIL]').replace(phoneRegex, '[PHONE]')
    }

    // --------------------------------------------------------------------------
    // 2. Context Retrieval (RAG)
    // --------------------------------------------------------------------------
    // Generate embedding for the redacted symptoms
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: redacted_symptoms,
    })
    const symptomEmbedding = embeddingResponse.data[0].embedding

    // Query Knowledge Base via RPC
    const { data: documents, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: symptomEmbedding,
      match_threshold: 0.5, // Adjust threshold as needed
      match_count: 3,
    })

    if (matchError) {
      console.error('Error matching documents:', matchError)
      throw matchError
    }

    const regulatoryContext = documents
      ?.map((doc: any) => doc.content_chunk)
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
    // 4. Neuro-Symbolic Inference (Triage Workflow - Step 4)
    // --------------------------------------------------------------------------
    
    /**
     * Construct the System Prompt with strict safety guardrails
     * This defines the AI's persona as an Expert Medical Triage Assistant
     * while explicitly forbidding definitive medical diagnoses
     */
    const systemPrompt = `You are an Expert Medical Triage Assistant specialized in environmental health monitoring. You analyze patient symptoms in correlation with air quality metrics and EU Air Quality Directives.

CRITICAL SAFETY GUARDRAILS:
1. YOU MUST NEVER provide definitive medical diagnoses or replace professional medical consultation.
2. This assessment is ADVISORY ONLY and should trigger professional medical evaluation if risk_level is High or Medium.
3. Always emphasize that users should consult healthcare professionals for diagnosis and treatment.
4. Base your risk assessment ONLY on the provided pollution data, symptoms, and regulatory guidance.
5. DO NOT make assumptions beyond the provided context.

TRIAGE LOGIC:
- Correlate symptom severity with air quality metrics (PM2.5, PM10)
- Reference EU Air Quality Directive thresholds and guidelines
- Assign risk_level based on: (symptom severity + pollution level + regulatory context)
- Provide actionable environmental health advice

OUTPUT REQUIREMENTS:
Return ONLY valid JSON matching this exact schema:
{
  "risk_level": "Low" | "Medium" | "High",
  "advisory": "Actionable health advice (max 200 chars)",
  "relevant_regulation": "Citation or excerpt from EU Air Quality Directive",
  "confidence_score": 0.0-1.0,
  "environmental_factor": "Primary pollution driver (PM2.5/PM10/NO2/etc or None)"
}`

    /**
     * Construct the User Prompt by dynamically injecting all context
     * This ensures the AI has all necessary information for risk assessment
     */
    const userPrompt = `
ENVIRONMENTAL DATA:
- ${airQuality}

REGULATORY CONTEXT (EU Air Quality Directive):
${regulatoryContext}

PATIENT SYMPTOMS (Redacted of PII):
${redacted_symptoms}

---
Perform a triage assessment based on the above context. Respond with valid JSON only.`

    /**
     * Execute Neuro-Symbolic Inference with OpenAI gpt-4o
     * Use structured JSON output format to ensure valid response schema
     */
    let riskAssessment: RiskAssessment
    
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3, // Lower temperature for more consistent triage decisions
        max_tokens: 500,
      })

      const responseContent = completion.choices[0].message.content
      
      if (!responseContent) {
        throw new Error('Empty response from OpenAI API')
      }

      // Parse and validate the JSON response
      const parsedResponse = JSON.parse(responseContent)
      
      // Validate required fields
      if (!parsedResponse.risk_level || !parsedResponse.advisory || !parsedResponse.relevant_regulation) {
        throw new Error('Invalid response schema: missing required fields')
      }

      // Validate risk_level enum
      if (!['Low', 'Medium', 'High'].includes(parsedResponse.risk_level)) {
        throw new Error(`Invalid risk_level: ${parsedResponse.risk_level}`)
      }

      riskAssessment = {
        risk_level: parsedResponse.risk_level,
        advisory: parsedResponse.advisory.substring(0, 200), // Enforce max length
        relevant_regulation: parsedResponse.relevant_regulation,
        confidence_score: parsedResponse.confidence_score || 0.75,
        environmental_factor: parsedResponse.environmental_factor || 'Unknown',
      }

    } catch (inferenceError) {
      console.error('Neuro-Symbolic Inference Error:', inferenceError)
      
      // Graceful fallback to conservative risk assessment
      riskAssessment = {
        risk_level: 'Medium',
        advisory: 'Unable to complete AI assessment. Please consult a healthcare professional.',
        relevant_regulation: 'EU Air Quality Directive assessment temporarily unavailable.',
        confidence_score: 0.0,
        environmental_factor: 'Error',
      }
    }

    // Add advisory footer emphasizing professional consultation
    const advisoryWithDisclaimer = `${riskAssessment.advisory}\n\n⚠️ IMPORTANT: This is an advisory tool only. Always consult a qualified healthcare professional for diagnosis and treatment.`

    // --------------------------------------------------------------------------
    // 5. Construct Final Response
    // --------------------------------------------------------------------------
    const response: EdgeFunctionResponse = {
      risk_assessment: {
        ...riskAssessment,
        advisory: advisoryWithDisclaimer,
      },
      timestamp: new Date().toISOString(),
      location: {
        lat: user_lat,
        long: user_long,
        sector: (airQualityData && airQualityData[0]?.sector_name) || 'Unknown',
      },
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Edge Function Error:', error)
    
    const errorResponse = {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      advisory: 'An error occurred during risk assessment. Please try again or contact support.',
    }
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
