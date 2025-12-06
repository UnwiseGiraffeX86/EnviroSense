"use client";

import { useState } from "react";
import Link from "next/link";

export default function DebugPage() {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeScript, setActiveScript] = useState<string | null>(null);

  const runScript = async (scriptName: string) => {
    setLoading(true);
    setActiveScript(scriptName);
    setOutput((prev) => prev + `\n> Running ${scriptName}...\n`);

    try {
      const res = await fetch("/api/debug/run-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptName }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput((prev) => prev + data.output + "\n> Done.\n");
      } else {
        setOutput((prev) => prev + "ERROR:\n" + (data.error || data.output) + "\n");
      }
    } catch (e: any) {
      setOutput((prev) => prev + "FETCH ERROR: " + e.message + "\n");
    } finally {
      setLoading(false);
      setActiveScript(null);
    }
  };

  const clearConsole = () => setOutput("");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-green-500">Eco-Neuro Sentinel</h1>
            <p className="text-sm text-gray-500">System Debug & Control Center</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition">
              ← Back to Map
            </Link>
            <Link href="/patients" className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-100 rounded text-sm transition">
              View Patient Logs
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            
            {/* Data Pipeline Control */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Data Pipeline</h2>
              <p className="text-xs text-gray-500 mb-4">
                Manage data ingestion from OpenAQ and synthetic patient generation.
              </p>
              <button
                onClick={() => runScript("fetch_data")}
                disabled={loading}
                className={`w-full py-3 px-4 rounded flex items-center justify-center gap-2 font-bold transition ${
                  loading && activeScript === "fetch_data"
                    ? "bg-purple-900/50 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-500 text-white"
                }`}
              >
                {loading && activeScript === "fetch_data" ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  "⚡"
                )}
                Fetch Real Data & Generate Logs
              </button>
            </div>

            {/* Knowledge Base Control */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">Knowledge Base (RAG)</h2>
              <p className="text-xs text-gray-500 mb-4">
                Ingest PDF documents into the vector store for the AI agent.
              </p>
              <button
                onClick={() => runScript("ingest_knowledge")}
                disabled={loading}
                className={`w-full py-3 px-4 rounded flex items-center justify-center gap-2 font-bold transition ${
                  loading && activeScript === "ingest_knowledge"
                    ? "bg-yellow-900/50 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-500 text-black"
                }`}
              >
                {loading && activeScript === "ingest_knowledge" ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  "📚"
                )}
                Ingest Knowledge (PDF)
              </button>
            </div>

            {/* Validator Control */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-pink-400">Synthetic Validator</h2>
              <p className="text-xs text-gray-500 mb-4">
                Train ML model on synthetic data to predict symptom severity.
              </p>
              <button
                onClick={() => runScript("validator")}
                disabled={loading}
                className={`w-full py-3 px-4 rounded flex items-center justify-center gap-2 font-bold transition ${
                  loading && activeScript === "validator"
                    ? "bg-pink-900/50 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-500 text-white"
                }`}
              >
                {loading && activeScript === "validator" ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  "🧠"
                )}
                Run ML Validator
              </button>
            </div>

            {/* System Status (Mock for now) */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">System Status</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Database Connection</span>
                  <span className="text-green-500">● Online</span>
                </div>
                <div className="flex justify-between">
                  <span>OpenAQ API</span>
                  <span className="text-green-500">● Reachable</span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption Engine</span>
                  <span className="text-green-500">● Active (AES-256)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Terminal Output */}
          <div className="lg:col-span-2 flex flex-col h-[600px]">
            <div className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-t-lg border border-gray-700 border-b-0">
              <span className="text-xs text-gray-400">Terminal Output</span>
              <button 
                onClick={clearConsole}
                className="text-xs text-gray-400 hover:text-white hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 bg-black p-4 rounded-b-lg border border-gray-700 overflow-y-auto font-mono text-sm shadow-inner">
              {output ? (
                <pre className="whitespace-pre-wrap break-words text-green-400">
                  {output}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600 italic">
                  Ready for commands...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
