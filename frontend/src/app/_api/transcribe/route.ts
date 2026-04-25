import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Security: Validate File Size (Max 25MB)
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 25MB limit." }, { status: 413 });
    }

    // 2. Security: Validate MIME Type
    const ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/webm"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: mp3, wav, mp4, m4a, webm" }, { status: 415 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API Key missing" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
      prompt: "Medical journal entry. Patient describing symptoms: dyspnea, insomnia, brain fog, asthma, wheezing, focus level, sleep quality.",
    });

    // Log usage (Whisper doesn't return tokens, so we log 0 but record the event)
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value; },
                    set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch (error) {} },
                    remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: "", ...options }); } catch (error) {} },
                },
            }
        );
        const { data: { user } } = await supabase.auth.getUser();

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );

        await supabaseAdmin.from('token_usage').insert({
            user_id: user?.id,
            feature_name: 'voice_journal_transcription',
            model: 'whisper-1',
            input_tokens: 0,
            output_tokens: 0,
            total_tokens: 0
        });
    } catch (err) {
        console.error("Failed to log Whisper usage:", err);
    }

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
