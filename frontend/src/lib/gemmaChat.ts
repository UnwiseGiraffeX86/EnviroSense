/**
 * Gemma 4 Chat Service
 * 
 * Calls the Google AI Studio (Gemini API) directly from the client.
 * Uses Gemma 4 27B IT with a domain-specific system prompt covering
 * environmental toxicology, cardiovascular dynamics, respiratory mechanics,
 * neuropsychiatric effects, and EU regulatory thresholds.
 * 
 * NOTE: Static export (output: "export") prevents server-side API routes,
 * so we call the Gemini API client-side. The API key is a free-tier key.
 */

// ============================================================
// TYPES
// ============================================================

export interface SensorContext {
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  heartRate?: number;
  hrvMs?: number;
  spo2?: number;
  stressLevel?: number;
  sleepScore?: number;
  skinTempDelta?: number;
  steps?: number;
  dailyReadiness?: number;
  ambientTemp?: number;
  ambientHumidity?: number;
  ambientPressure?: number;
  ambientLight?: number;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

import { supabase } from "@/lib/supabaseClient";

export interface SensorContext {
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  heartRate?: number;
  hrvMs?: number;
  spo2?: number;
  stressLevel?: number;
  sleepScore?: number;
  skinTempDelta?: number;
  steps?: number;
  dailyReadiness?: number;
  ambientTemp?: number;
  ambientHumidity?: number;
  ambientPressure?: number;
  ambientLight?: number;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function sendChatMessage(
  userMessage: string,
  history: ChatMessage[],
  sensorContext: SensorContext,
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('gemma-chat', {
      body: {
        userMessage,
        history,
        sensorContext
      }
    });

    if (error) {
      console.error("[Gemma4 Edge] Error invoking function:", error);
      return `AI service error: ${error.message}`;
    }

    if (data?.error) {
       console.error("[Gemma4 Edge] Backend returned error:", data.error);
       return data.error;
    }

    if (data?.text) {
       return data.text;
    }

    return "I received an empty response. This may be a temporary issue — please try again.";
  } catch (error: any) {
    console.error("[Gemma4 Edge] Network error:", error);
    return "Unable to reach the AI service. Check your internet connection.";
  }
}
