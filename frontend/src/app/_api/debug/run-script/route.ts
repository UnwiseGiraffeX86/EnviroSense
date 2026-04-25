import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const execFileAsync = promisify(execFile);

export async function POST(req: Request) {
  try {
    // 1. Auth Check
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Script Execution
    const { script } = await req.json();
    
    let scriptPath = "";
    const projectRoot = path.resolve(process.cwd(), ".."); // Assuming we are in frontend/
    const pythonPath = path.join(projectRoot, ".venv/bin/python3");

    if (script === "fetch_data") {
      scriptPath = path.join(projectRoot, "scripts/fetch_real_data.py");
    } else if (script === "ingest_knowledge") {
      scriptPath = path.join(projectRoot, "ingest_knowledge.py");
    } else if (script === "validator") {
      scriptPath = path.join(projectRoot, "validator.py");
    } else {
      return NextResponse.json({ error: "Invalid script name" }, { status: 400 });
    }

    try {
      // Use execFile for safety, although arguments are fixed here.
      const { stdout, stderr } = await execFileAsync(pythonPath, [scriptPath], { cwd: projectRoot });
      return NextResponse.json({ 
        success: true, 
        output: stdout,
        error: stderr 
      });
    } catch (error: any) {
      console.error(`exec error: ${error}`);
      return NextResponse.json({ 
        success: false, 
        output: error.stdout || "", 
        error: error.stderr || error.message 
      }, { status: 500 });
    }

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
