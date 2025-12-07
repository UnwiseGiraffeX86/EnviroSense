"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  AlertCircle, 
  Stethoscope, 
  Activity, 
  Wind, 
  Thermometer,
  Send
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const SYMPTOMS = [
  { id: "breathing", label: "Breathing Difficulty", icon: Wind, severity: "high" },
  { id: "chest_pain", label: "Chest Pain/Tightness", icon: Activity, severity: "critical" },
  { id: "fever", label: "High Fever", icon: Thermometer, severity: "medium" },
  { id: "dizziness", label: "Severe Dizziness", icon: AlertCircle, severity: "medium" },
];

export default function TriageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async () => {
    if (!selectedSymptom && !description) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const symptomLabel = SYMPTOMS.find(s => s.id === selectedSymptom)?.label || "Unknown Symptom";
        const triageText = `TRIAGE REQUEST: ${symptomLabel} - ${description}`;

        const { error } = await supabase
          .from('daily_logs')
          .insert({
            user_id: user.id,
            breathing_status: 'Severe', // Flag as severe to ensure visibility
            focus_level: 1,
            transcript: triageText,
            sleep_quality: 'Distressed' // Using sleep_quality to store mood/state since mood column doesn't exist
          });

        if (error) throw error;
        
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedSymptom(null);
          setDescription("");
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting triage:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#562C2C]/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#FAF3DD] w-full max-w-md rounded-3xl shadow-2xl border border-[#562C2C]/10 overflow-hidden"
      >
        {submitted ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Send size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#562C2C] mb-2">Request Sent</h3>
            <p className="text-[#562C2C]/70">
              Your triage request has been sent to the clinical team. A doctor will review it shortly.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-red-600">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Stethoscope size={20} />
                </div>
                <h3 className="font-bold text-lg">Triage Request</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[#562C2C]/5 rounded-full text-[#562C2C]">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-[#562C2C]/70 mb-4">
              Select your primary symptom or describe how you are feeling.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {SYMPTOMS.map((symptom) => {
                const Icon = symptom.icon;
                const isSelected = selectedSymptom === symptom.id;
                return (
                  <button
                    key={symptom.id}
                    onClick={() => setSelectedSymptom(symptom.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                      isSelected 
                        ? "bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200" 
                        : "bg-white border-transparent hover:border-red-100 text-[#562C2C]/80"
                    }`}
                  >
                    <Icon size={20} className={isSelected ? "text-red-600" : "text-[#562C2C]/40"} />
                    <span className="text-xs font-bold">{symptom.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-[#562C2C]/50 uppercase mb-2">
                Additional Details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your symptoms..."
                className="w-full p-3 rounded-xl bg-white border border-[#562C2C]/10 text-[#562C2C] focus:outline-none focus:ring-2 focus:ring-red-100 min-h-[100px] text-sm resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={(!selectedSymptom && !description) || isSubmitting}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Request
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
