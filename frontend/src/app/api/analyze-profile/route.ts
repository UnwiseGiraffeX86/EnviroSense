import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Server Error: OPENAI_API_KEY is missing.");
      return NextResponse.json(
        { error: "Configuration Error: OpenAI API Key is missing. Please add it to .env.local" }, 
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert medical data clerk for a "Digital Twin" health platform. 
          Your task is to analyze natural language updates from users and extract specific health and environmental data to update their profile.
          
          The user profile has the following schema (only return fields that should be updated):
          - sector: string (e.g., "Sector 1", "Sector 2", ... "Sector 6")
          - focus_index: number (1-10, where 1 is severe brain fog/unfocused, 10 is sharp/focused)
          - respiratory_conditions: string[] (e.g., "Asthma", "Allergies", "COPD", "Bronchitis", "None")
          - inhaler_usage_frequency: number (0-10, where 0 is never, 10 is daily/high usage)
          - stress_triggers: string[] (e.g., "Heat", "Cold", "Humidity", "Pollen", "Dust", "Smoke", "Crowds", "Noise")
          - activity_level: "Sedentary" | "Moderate" | "Active"

          Rules:
          1. Infer "focus_index" from keywords like "brain fog", "tired", "weak" (low scores 1-4) vs "sharp", "energetic" (high scores 8-10).
          2. Infer "inhaler_usage_frequency" from severity. "Breathing through a straw" implies severe obstruction -> high usage (8-10). "Occasional puff" -> low usage (1-3).
          3. Infer "respiratory_conditions" from symptoms. "Wheezing", "straw breathing" -> "Asthma". "Runny nose", "sneezing" -> "Allergies".
          4. Infer "stress_triggers" from context. "Cold weather" -> "Cold". "Summer heat" -> "Heat".
          5. Infer "activity_level" from lifestyle clues. "Running", "gym" -> "Active". "Couch", "weak" -> "Sedentary".
          6. Only return the JSON object with the fields that have changed. Do not include fields that are not mentioned or inferred.
          7. Be sensitive to medical nuances. "Breathing through a straw" is a classic metaphor for an asthma attack.
          
          Return ONLY valid JSON.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = completion.choices[0].message.content;
    console.log("OpenAI Response:", content); // Debug log

    const result = JSON.parse(content || "{}");
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
