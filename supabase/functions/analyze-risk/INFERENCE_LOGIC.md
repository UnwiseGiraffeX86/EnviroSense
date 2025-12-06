# Neuro-Symbolic Inference Logic - Eco-Neuro Sentinel

## Overview

The `analyze-risk` Supabase Edge Function implements **Phase III: The Neuro-Symbolic Agent** of the Eco-Neuro Sentinel architecture. This document details the **Triage Workflow - Step 4: Inference Logic**, which fuses environmental data, regulatory context, and patient symptoms into a structured risk assessment using OpenAI's gpt-4o model.

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TRIAGE WORKFLOW STEPS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 1: INPUT                                                          │
│  ├─ symptom_description (user input)                                    │
│  ├─ user_lat, user_long (geolocation)                                   │
│                                                                          │
│  Step 2: PRIVACY FIREWALL (PII Redaction)                               │
│  ├─ redacted_symptoms (scrubbed of names, emails, phones)               │
│                                                                          │
│  Step 3: CONTEXT RETRIEVAL (RAG + Environmental)                        │
│  ├─ Symptom Embedding → Semantic Search (EU Regulations)                │
│  ├─ regulatory_context (chunks from knowledge base)                      │
│  ├─ Spatial Query → Air Quality Metrics                                 │
│  ├─ pollution_data: { pm25, pm10, sector }                              │
│                                                                          │
│  Step 4: NEURO-SYMBOLIC INFERENCE ⬅━━ THIS DOCUMENT COVERS THIS        │
│  ├─ System Prompt: Expert Medical Triage Assistant                      │
│  ├─ User Prompt: Dynamic context injection                              │
│  ├─ OpenAI API Call (gpt-4o with json_object response)                  │
│  ├─ Output: { risk_level, advisory, relevant_regulation, ... }          │
│                                                                          │
│  Step 5: RESPONSE                                                       │
│  └─ EdgeFunctionResponse: Structured JSON with metadata                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Type Definitions

### PollutionData Interface
```typescript
interface PollutionData {
  pm25: number        // Particulate Matter 2.5 (μg/m³)
  pm10: number        // Particulate Matter 10 (μg/m³)
  sector: string      // Geographic sector (e.g., "Sector 3, Bucharest")
}
```

### RiskAssessment Interface
```typescript
interface RiskAssessment {
  risk_level: 'Low' | 'Medium' | 'High'
  advisory: string                         // Actionable health advice (max 200 chars)
  relevant_regulation: string              // Citation from EU Air Quality Directive
  confidence_score?: number                // 0.0-1.0, default 0.75
  environmental_factor?: string            // Primary pollution driver (PM2.5/PM10/etc)
}
```

### EdgeFunctionResponse Interface
```typescript
interface EdgeFunctionResponse {
  risk_assessment: RiskAssessment
  timestamp: string                        // ISO 8601 format
  location?: {
    lat: number
    long: number
    sector: string
  }
}
```

---

## Inference Logic - Detailed Breakdown

### 1. System Prompt (Safety Guardrails)

The system prompt establishes the AI's persona and enforces **strict safety constraints**:

```typescript
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
```

**Key Features:**
- ✅ **Persona Definition**: Expert Medical Triage Assistant (NOT a medical AI)
- ✅ **Safety Guardrails**: 5 explicit constraints preventing misuse
- ✅ **Schema Definition**: Enforces exact JSON structure
- ✅ **Triage Logic**: Clear rules for risk level assignment
- ✅ **Regulatory Context**: References EU Air Quality Directives

### 2. User Prompt (Dynamic Context Injection)

The user prompt dynamically injects all relevant context:

```typescript
const userPrompt = `
ENVIRONMENTAL DATA:
- ${airQuality}

REGULATORY CONTEXT (EU Air Quality Directive):
${regulatoryContext}

PATIENT SYMPTOMS (Redacted of PII):
${redacted_symptoms}

---
Perform a triage assessment based on the above context. Respond with valid JSON only.`
```

**Variables Injected:**
- `${airQuality}`: "Sector: Sector 3, PM2.5: 32.5, PM10: 58.2"
- `${regulatoryContext}`: Retrieved regulatory chunks from RAG system
- `${redacted_symptoms}`: Privacy-scrubbed patient symptoms

### 3. OpenAI API Call (gpt-4o)

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',                                    // Latest OpenAI model
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
  response_format: { type: 'json_object' },          // Forces valid JSON
  temperature: 0.3,                                  // Low temp for consistency
  max_tokens: 500,                                   // Limit response size
})
```

**Configuration Rationale:**
- **model: gpt-4o**: State-of-the-art reasoning for medical context
- **response_format**: Ensures structured JSON output (no parsing errors)
- **temperature: 0.3**: Lower = more deterministic triage decisions
- **max_tokens: 500**: Prevents hallucinations in long responses

### 4. Response Validation & Error Handling

```typescript
try {
  const responseContent = completion.choices[0].message.content
  
  if (!responseContent) {
    throw new Error('Empty response from OpenAI API')
  }

  const parsedResponse = JSON.parse(responseContent)
  
  // Validate required fields
  if (!parsedResponse.risk_level || !parsedResponse.advisory || !parsedResponse.relevant_regulation) {
    throw new Error('Invalid response schema: missing required fields')
  }

  // Validate risk_level enum
  if (!['Low', 'Medium', 'High'].includes(parsedResponse.risk_level)) {
    throw new Error(`Invalid risk_level: ${parsedResponse.risk_level}`)
  }

  // Enforce length constraints
  riskAssessment = {
    risk_level: parsedResponse.risk_level,
    advisory: parsedResponse.advisory.substring(0, 200),
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
```

**Validation Layers:**
1. **Content Check**: Ensures non-empty response
2. **Schema Validation**: All required fields present
3. **Enum Validation**: risk_level is one of {Low, Medium, High}
4. **Length Enforcement**: Advisory capped at 200 characters
5. **Fallback Logic**: Conservative assessment on error

### 5. Advisory Disclaimer

```typescript
const advisoryWithDisclaimer = `${riskAssessment.advisory}\n\n⚠️ IMPORTANT: This is an advisory tool only. Always consult a qualified healthcare professional for diagnosis and treatment.`
```

**Purpose**: Ensures every response includes a liability disclaimer.

### 6. Final Response Structure

```typescript
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
```

---

## Example Request & Response

### Request
```json
{
  "symptom_description": "I've been experiencing severe cough and difficulty breathing for the past 3 days. My name is John Smith and you can reach me at john@example.com.",
  "user_lat": 44.4268,
  "user_long": 26.1025
}
```

### Response
```json
{
  "risk_assessment": {
    "risk_level": "High",
    "advisory": "High pollution levels (PM2.5: 32.5) detected at your location, combined with respiratory symptoms. Consider remaining indoors with air filtration. Wear N95 mask if outdoor activity is necessary.\n\n⚠️ IMPORTANT: This is an advisory tool only. Always consult a qualified healthcare professional for diagnosis and treatment.",
    "relevant_regulation": "EU Air Quality Directive 2008/50/EC: PM2.5 limit value for daily mean is 25 μg/m³. Your location exceeds recommended thresholds.",
    "confidence_score": 0.87,
    "environmental_factor": "PM2.5"
  },
  "timestamp": "2025-01-15T14:32:00.000Z",
  "location": {
    "lat": 44.4268,
    "long": 26.1025,
    "sector": "Sector 3"
  }
}
```

---

## Risk Level Decision Matrix

| **Risk Level** | **Criteria** | **Action** |
|---|---|---|
| **Low** | PM2.5 < 12 AND mild/no respiratory symptoms | Monitor, maintain healthy lifestyle |
| **Medium** | PM2.5 12-35 OR moderate symptoms OR vulnerable population | Consult healthcare provider if symptoms persist |
| **High** | PM2.5 > 35 OR severe symptoms + high pollution OR chronic condition | Seek immediate professional medical evaluation |

---

## Safety & Compliance

### Privacy
✅ PII Redaction before LLM inference
✅ No personal data stored in API calls
✅ GDPR compliant data handling

### Medical Safety
✅ Explicit disclaimer in every response
✅ System prompt forbids medical diagnoses
✅ Conservative fallback on errors (Medium risk)
✅ Confidence scores indicate uncertainty

### Regulatory
✅ References EU Air Quality Directives
✅ Correlates with EPA/WHO air quality standards
✅ Audit trail via Deno/Supabase logging

---

## Configuration Parameters

| Parameter | Value | Rationale |
|---|---|---|
| model | gpt-4o | Best reasoning for medical/environmental context |
| temperature | 0.3 | Consistent, deterministic triage decisions |
| max_tokens | 500 | Prevents verbose responses, reduces cost |
| response_format | json_object | Structured output, eliminates parsing errors |
| confidence_score (default) | 0.75 | Moderate confidence baseline |

---

## Debugging & Logging

**Key Log Points:**
```
1. console.error('Neuro-Symbolic Inference Error:', inferenceError)
   → Logs any OpenAI API or validation errors
   
2. console.error('Edge Function Error:', error)
   → Logs top-level function errors (auth, parsing, etc.)
```

**Monitor in Supabase Dashboard:**
1. Navigate to Edge Functions → analyze-risk
2. View Function Logs tab for real-time inference debugging
3. Check error patterns and response times

---

## Future Enhancements

1. **Multi-Model Ensemble**: Combine gpt-4o with specialized models (medical, environmental)
2. **Feedback Loop**: Store user responses to retrain/fine-tune prompts
3. **Regulatory Updates**: Auto-refresh regulatory context from EU directives
4. **Multilingual Support**: Extend to Romanian, German, French, etc.
5. **Mobile Integration**: Native iOS/Android app with local caching

---

## References

- **EU Air Quality Directive**: https://ec.europa.eu/environment/air/pdf/air-quality-standards.pdf
- **OpenAI gpt-4o Docs**: https://platform.openai.com/docs/models/gpt-4o
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Deno Runtime**: https://docs.deno.com/runtime/manual/

---

**Last Updated**: December 6, 2025  
**Author**: Eco-Neuro Sentinel Development Team  
**Version**: Phase III - Neuro-Symbolic Agent v1.0
