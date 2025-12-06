"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PatientsDebugPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/patients");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Error fetching logs:", data.error);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Debug: Patient Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="py-3 px-4 border-b border-gray-600">ID</th>
              <th className="py-3 px-4 border-b border-gray-600">User ID</th>
              <th className="py-3 px-4 border-b border-gray-600">Symptom</th>
              <th className="py-3 px-4 border-b border-gray-600">Severity</th>
              <th className="py-3 px-4 border-b border-gray-600">Location</th>
              <th className="py-3 px-4 border-b border-gray-600">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-750 border-b border-gray-700">
                <td className="py-3 px-4">{log.id}</td>
                <td className="py-3 px-4 text-xs font-mono text-gray-400">{log.user_id}</td>
                <td className="py-3 px-4">{log.symptom_text}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.severity_score > 7 ? 'bg-red-900 text-red-200' :
                    log.severity_score > 4 ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {log.severity_score}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-400 truncate max-w-xs" title={log.log_location}>
                  {log.log_location}
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">
                  {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No patient logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
