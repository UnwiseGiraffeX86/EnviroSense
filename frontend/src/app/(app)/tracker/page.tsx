"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { analyzeLog } from "@/utils/agentDispatcher";
import { Mic, Moon, Wind, Activity, Check, AlertTriangle, Send } from "lucide-react";

export default function TrackerPage() {
  const [focusLevel, setFocusLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState<string | null>(null);
  const [breathingStatus, setBreathingStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [riskAlert, setRiskAlert] = useState<{ level: string; recipient?: string } | null>(null);

  const { isRecording, transcript, setTranscript, isTranscribing, startRecording, stopRecording } = useVoiceRecorder();

  const handleSubmit = async () => {
    if (!sleepQuality || !breathingStatus) {
      alert("Please complete the quick metrics.");
      return;
    }

    setIsSubmitting(true);

    // 1. Agentic Analysis
    const analysis = analyzeLog(breathingStatus, transcript);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("You must be logged in to save logs.");
        setIsSubmitting(false);
        return;
      }

      // 2. Save to Database
      const { error } = await supabase.from("daily_logs").insert({
        user_id: user.id,
        focus_level: focusLevel,
        sleep_quality: sleepQuality,
        breathing_status: breathingStatus,
        transcript: transcript,
        ai_risk_assessment: analysis.riskLevel,
      });

      if (error) throw error;

      // 3. Handle Risk
      if (analysis.action === 'IMMEDIATE_DISPATCH') {
        setRiskAlert({ level: analysis.riskLevel, recipient: analysis.recipient });
      } else {
        setSubmitted(true);
      }

    } catch (error: any) {
      console.error("Error saving log:", error);
      alert("Failed to save log: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dayNumber = Math.ceil((today.getDate() + 6 - today.getDay()) / 7); // Rough week calc or just day

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF3DD] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-white/50"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Log Saved</h2>
          <p className="text-gray-600">Your data has been added to Friday's Weekly Report.</p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="mt-8 text-[#E07A5F] font-medium hover:underline"
          >
            View Log
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3DD] text-gray-800 font-sans selection:bg-[#E07A5F]/20">
      {/* Risk Modal */}
      <AnimatePresence>
        {riskAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-l-8 border-red-500"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Sentinel Alert</h3>
                  <p className="text-red-600 font-medium text-sm uppercase tracking-wide mt-1">High Risk Detected</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                A priority summary has been prepared for <strong>{riskAlert.recipient}</strong> based on your reported symptoms.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setRiskAlert(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Dismiss
                </button>
                <button className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-200 transition-all">
                  Open Triage Chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto p-6 pb-24">
        {/* Header */}
        <header className="mb-10 pt-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Captain's Log</p>
          <h1 className="text-3xl font-bold text-gray-900">{dateString}</h1>
          
          <div className="mt-6">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Weekly Completion</span>
              <span>5/7</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#E07A5F] w-[71%] rounded-full" />
            </div>
          </div>
        </header>

        <main className="space-y-8">
          {/* Zone 1: Quick Metrics */}
          <section className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E07A5F]" />
              Quick Metrics
            </h2>

            {/* Focus Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-3 text-sm font-medium text-gray-600">
                <span>Foggy</span>
                <span>Sharp</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={focusLevel} 
                onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E07A5F]"
              />
              <div className="text-center mt-2 font-bold text-[#E07A5F]">{focusLevel}/10</div>
            </div>

            {/* Sleep Quality */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-3">Sleep Quality</label>
              <div className="grid grid-cols-3 gap-3">
                {['Restorative', 'Fragmented', 'Insomnia'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSleepQuality(type)}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      sleepQuality === type 
                        ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#E07A5F]' 
                        : 'border-transparent bg-white hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    <Moon className={`w-5 h-5 ${sleepQuality === type ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Breathing Status */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Breathing</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Clear', color: 'bg-green-100 text-green-700 hover:bg-green-200', active: 'ring-2 ring-green-500' },
                  { label: 'Mild Resistance', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200', active: 'ring-2 ring-yellow-500' },
                  { label: 'Wheezing/Heavy', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200', active: 'ring-2 ring-orange-500' }
                ].map((status) => (
                  <button
                    key={status.label}
                    onClick={() => setBreathingStatus(status.label)}
                    className={`p-3 rounded-xl text-xs font-bold transition-all ${status.color} ${
                      breathingStatus === status.label ? status.active : ''
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Zone 2: Voice Journal */}
          <section className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#E07A5F]" />
              Voice Journal
            </h2>

            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                {isRecording && (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-[#E07A5F] rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      className="absolute inset-0 bg-[#E07A5F] rounded-full"
                    />
                  </>
                )}
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isRecording ? 'bg-[#E07A5F] text-white scale-95' : 'bg-white text-gray-400 hover:text-[#E07A5F]'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mb-6">
                {isRecording ? "Listening..." : "Press & Hold to Record"}
              </p>

              <div className="w-full">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={isTranscribing ? "Transcribing..." : "Your notes will appear here..."}
                  className="w-full min-h-[120px] p-4 rounded-xl bg-white/50 border border-gray-200 focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F] outline-none resize-none font-serif text-lg leading-relaxed text-gray-700 placeholder:text-gray-300 transition-all"
                  style={{ fontFamily: '"Caveat", "Courier New", cursive' }} // Fallback to handwriting style if available
                />
              </div>
            </div>
          </section>

          {/* Submit Action */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-[#2A2A2A] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                Log Entry <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </main>
      </div>
    </div>
  );
}
