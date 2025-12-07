"use client";

import React, { useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { 
  Save, 
  Moon, 
  Smile, 
  Frown, 
  Meh, 
  Activity, 
  FileText,
  Loader2,
  CheckCircle2
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function TrackerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [mood, setMood] = useState("Neutral");
  const [sleepHours, setSleepHours] = useState<number | "">("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const MOODS = ["Great", "Good", "Neutral", "Poor", "Bad"];
  const COMMON_SYMPTOMS = ["Headache", "Nausea", "Fatigue", "Cough", "Fever", "Anxiety"];

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("You must be logged in to save logs.");
        return;
      }

      const { error } = await supabase.from("daily_logs").insert({
        user_id: user.id,
        mood,
        sleep_hours: Number(sleepHours),
        symptoms, // Assuming array column
        notes
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Reset form or redirect
        setMood("Neutral");
        setSleepHours("");
        setSymptoms([]);
        setNotes("");
        router.push("/dashboard"); // Redirect to dashboard after log
      }, 2000);

    } catch (error) {
      console.error("Error saving log:", error);
      alert("Failed to save log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">Daily Health Tracker</h1>
        <p className="text-[#64748B]">Log your daily vitals and symptoms.</p>
      </div>

      {success ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
          <CheckCircle2 size={48} className="mb-4" />
          <h2 className="text-xl font-semibold">Log Saved!</h2>
          <p>Your daily health log has been recorded.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Mood Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#1E293B]">How are you feeling?</label>
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                    mood === m 
                      ? "bg-[#0077B6] text-white shadow-md scale-105" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Hours */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#1E293B] flex items-center gap-2">
              <Moon size={16} /> Sleep Duration (Hours)
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              placeholder="e.g. 7.5"
              required
            />
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#1E293B] flex items-center gap-2">
              <Activity size={16} /> Symptoms
            </label>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-lg text-sm text-left transition-all flex justify-between items-center ${
                    symptoms.includes(symptom)
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {symptom}
                  {symptoms.includes(symptom) && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#1E293B] flex items-center gap-2">
              <FileText size={16} /> Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] min-h-[100px]"
              placeholder="Any other details..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0077B6] text-white rounded-xl font-semibold shadow-lg hover:bg-[#023E8A] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Daily Log
          </button>

        </form>
      )}
    </div>
  );
}
