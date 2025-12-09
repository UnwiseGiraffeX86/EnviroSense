import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const ENCRYPTION_KEY_HEX = process.env.DATA_ENCRYPTION_KEY!;

function decryptText(encryptedText: string) {
  try {
    if (!encryptedText.includes(":")) return encryptedText; // Not encrypted or legacy data

    const parts = encryptedText.split(":");
    if (parts.length !== 3) return encryptedText;

    const iv = Buffer.from(parts[0], "hex");
    const ciphertext = Buffer.from(parts[1], "hex");
    const tag = Buffer.from(parts[2], "hex");
    const key = Buffer.from(ENCRYPTION_KEY_HEX, "hex");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (e) {
    console.error("Decryption error:", e);
    return "[Decryption Failed]";
  }
}

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a doctor
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "doctor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("patient_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Decrypt symptoms
  const decryptedData = data?.map(log => ({
    ...log,
    symptom_text: decryptText(log.symptom_text)
  }));

  return NextResponse.json(decryptedData);
}
