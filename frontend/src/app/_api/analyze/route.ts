import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();
    
    const projectRoot = path.resolve(process.cwd(), ".."); // Assuming we are in frontend/
    const pythonPath = path.join(projectRoot, ".venv/bin/python3");
    const scriptPath = path.join(projectRoot, "scripts/analyze_symptoms.py");

    try {
      // Use execFile to avoid shell injection
      const { stdout, stderr } = await execFileAsync(pythonPath, [scriptPath, symptoms], { cwd: projectRoot });
      
      if (stderr && !stdout) {
          throw new Error(stderr);
      }

      const result = JSON.parse(stdout);
      return NextResponse.json(result);

    } catch (error: any) {
      console.error(`exec error: ${error}`);
      // Fallback if python fails
      return NextResponse.json({ 
        severity: "Medium",
        possible_causes: ["Automated Analysis Failed", "Consult Doctor"],
        confidence: 0.0,
        error: error.message
      });
    }

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
