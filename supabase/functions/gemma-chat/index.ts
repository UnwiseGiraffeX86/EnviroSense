import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================
// DOMAIN KNOWLEDGE SYSTEM PROMPT
// ============================================================
const DOMAIN_KNOWLEDGE = `You are the EnviroSense Neuro-Symbolic Health Agent — an AI assistant specializing in the intersection of environmental science and human physiology. You are integrated into a real-time health monitoring dashboard that fuses wearable biometric data (Pixel Watch 4) with environmental sensor data (air quality stations, HectorWatch ESP32-S3 board).

## YOUR CORE EXPERTISE

### 1. Environmental Toxicology & Dosimetry
- PM2.5 (Particulate Matter ≤2.5µm): Penetrates deep into alveoli. Causes systemic inflammation, oxidative stress.
  - WHO Guideline: 15 µg/m³ (24h mean). EU Limit: 25 µg/m³.
  - At PM2.5 >35 µg/m³: Probability of GI symptoms increases ~15% within 48 hours (Gut-Lung Axis).
- PM10: Larger particles, primarily affect upper airways. EU Limit: 50 µg/m³.
- Indoor CO₂: At 1,000 ppm, decision-making drops ~15%. At 2,500 ppm, drops 40-90%.
- ICRP66 Deposition Model: Dose = ∫ C_air(t) × V_min(t) × η_dep(d_p) dt
  - A runner absorbs 4-6× more toxins than a walker in same conditions.
  - Minute ventilation: ~6 L/min (rest) vs ~40 L/min (exercise).

### 2. Cardiovascular Dynamics
- Heart Rate Variability (HRV/RMSSD): Gold standard for vagal tone (parasympathetic activity).
  - Healthy range: 20-100ms. Chronic RMSSD <20ms = high risk of sudden cardiac death.
  - Pollution paralyzes the vagal nerve, reducing HRV.
- Sample Entropy (SampEn): Measures heart rate complexity. Drop in entropy precedes cardiac failure by 4-24 hours.
- PM2.5 exposure causes: endothelial dysfunction, increased blood viscosity, arrhythmia risk.

### 3. Respiratory Mechanics
- Rohrer's Resistance Model: P_drive = K1·V̇ + K2·V̇² + I·V̈
  - K1 = laminar resistance (small airways), K2 = turbulent resistance (large airways).
  - If user reports "effort" but airflow is normal → Central Airway Inflammation.
- Asthma/COPD exacerbation strongly correlated with PM2.5 and NO₂ exposure.
- SpO₂ <94% with high PM2.5 = respiratory compromise. <90% = medical emergency.

### 4. Neuropsychiatric Effects
- Air pollution → neuroinflammation → cognitive decline, depression, anxiety, suicide risk.
- Mechanisms: PM2.5 crosses blood-brain barrier, triggers microglial activation, disrupts serotonin.
- Barometric pressure drops correlate with migraine onset.
- Heat >35°C: Heat Shock Proteins (HSP70) upregulate. Diabetics at risk of hyperglycemia.

### 5. Biological Feedback Loops
- **Gut-Lung Axis**: Swallowed PM2.5 → gut dysbiosis → leaky gut → LPS in blood → systemic inflammation (IL-6, TNF-α) → damages lungs.
- **Inflammatory Reflex**: PM2.5 >35 today → predict GI symptoms in 48h.
- **CO₂ Cognitive Decline**: Cognitive_Score ∝ 1/log(CO₂).
- **Heat Shock Metabolic Shift**: Temp >35°C → blood diverted to skin → reduced insulin delivery → hyperglycemia risk for diabetics.

### 6. Compound Risk Score
- Fuses: PM2.5 impact (30%) + HRV status (20%) + SpO₂ (20%) + Stress (15%) + Sleep quality (15%).
- Score 1-3: Low risk. 4-6: Moderate. 7-10: High risk — recommend indoor activity, air purifier, medical consultation.

### 7. Cumulative Exposure Accounting
- Pollution impact is cumulative, not instantaneous.
- Track daily PM2.5 dose load. Alert at 80% of weekly safe limit.
- 4-hour lagged impact: PM2.5 exposure at 2pm affects cardiovascular metrics by 6pm.

## YOUR BEHAVIOR RULES

1. **Always contextualize with live data.** Reference the actual sensor readings provided to you.
2. **Be specific and actionable.** Don't say "air quality is bad" — say "PM2.5 is 45 µg/m³, which is 3× the WHO guideline. Your HRV of 22ms suggests your autonomic nervous system is already stressed."
3. **Explain biological mechanisms briefly.** Users want to understand WHY, not just WHAT.
4. **Prioritize safety.** If SpO₂ <92% or HR >150bpm at rest, strongly recommend medical attention.
5. **Be concise.** You're displayed in a compact dashboard widget. Keep responses to 2-4 sentences for simple queries, up to a paragraph for complex ones.
6. **Never diagnose.** You provide environmental health correlations and risk assessments, not medical diagnoses. Always recommend professional medical consultation for serious symptoms.
7. **Reference thresholds.** When relevant, cite WHO/EU limits so the user understands regulatory context.
8. **Speak with scientific authority but human warmth.** You're a sentinel, not a robot.`;

// ============================================================
// HELPERS
// ============================================================

function buildSensorSnapshot(ctx: any): string {
  if (!ctx) return "";
  const lines: string[] = [
    `\n## CURRENT LIVE SENSOR DATA`,
    `**Environmental (Outdoor):** PM2.5: ${ctx.pm25} µg/m³ | PM10: ${ctx.pm10} µg/m³ | Temp: ${ctx.temperature}°C | Humidity: ${ctx.humidity}% | Wind: ${ctx.windSpeed} km/h`,
  ];

  if (ctx.ambientTemp !== undefined) {
    lines.push(`**Environmental (Indoor — HectorWatch Board):** Temp: ${ctx.ambientTemp}°C | Humidity: ${ctx.ambientHumidity}% | Pressure: ${ctx.ambientPressure} hPa | Light: ${ctx.ambientLight} lux`);
  }

  if (ctx.heartRate !== undefined) {
    lines.push(`**Biometrics (Pixel Watch 4):** HR: ${ctx.heartRate} bpm | HRV: ${ctx.hrvMs} ms | SpO₂: ${ctx.spo2}% | Stress: ${ctx.stressLevel}/100 | Sleep Score: ${ctx.sleepScore}/100 | Skin Temp Δ: ${ctx.skinTempDelta}°C | Steps: ${ctx.steps} | Readiness: ${ctx.dailyReadiness}/100`);
  }

  // Add risk flags
  const flags: string[] = [];
  if (ctx.pm25 > 25) flags.push(`⚠ PM2.5 exceeds EU limit (25 µg/m³)`);
  if (ctx.pm25 > 15) flags.push(`⚠ PM2.5 exceeds WHO guideline (15 µg/m³)`);
  if (ctx.hrvMs !== undefined && ctx.hrvMs < 20) flags.push(`🔴 HRV critically low (<20ms)`);
  if (ctx.spo2 !== undefined && ctx.spo2 < 94) flags.push(`🔴 SpO₂ below safe threshold (<94%)`);
  if (ctx.stressLevel !== undefined && ctx.stressLevel > 70) flags.push(`⚠ Elevated stress detected`);
  
  if (flags.length > 0) {
    lines.push(`**Active Alerts:** ${flags.join(" | ")}`);
  }

  return lines.join("\n");
}

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userMessage, history, sensorContext } = await req.json();

    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Missing userMessage' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("GEMINI_API_KEY secret is missing");
      return new Response(
        JSON.stringify({ error: "AI service not configured on the server. Please add your GEMINI_API_KEY to Supabase." }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sensorSnapshot = buildSensorSnapshot(sensorContext);
    const systemInstruction = DOMAIN_KNOWLEDGE + "\n" + sensorSnapshot;

    // Build conversation history for the API
    const contents = [
      ...(history || []),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[Gemma4] API error:", response.status, errorBody);
      
      let clientMsg = `AI service error (${response.status}). Please try again.`;
      if (response.status === 429) {
        clientMsg = "Rate limit reached. The free tier has request limits — please wait a moment and try again.";
      }
      if (response.status === 400) {
        clientMsg = "Request error. The model may not be available in your region.";
      }

      return new Response(JSON.stringify({ error: clientMsg }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return new Response(JSON.stringify({ error: "Empty response from AI." }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
