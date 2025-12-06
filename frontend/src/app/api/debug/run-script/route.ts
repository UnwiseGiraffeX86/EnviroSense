import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req: Request) {
  try {
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

    return new Promise((resolve) => {
      exec(`${pythonPath} ${scriptPath}`, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          resolve(NextResponse.json({ 
            success: false, 
            output: stdout, 
            error: stderr || error.message 
          }, { status: 500 }));
          return;
        }
        resolve(NextResponse.json({ 
          success: true, 
          output: stdout,
          error: stderr 
        }));
      });
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
