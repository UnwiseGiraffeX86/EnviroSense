"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Video, FileText, X, ChevronRight, Clock } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// --- Types ---
type Consultation = {
  id: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  created_at: string;
  ai_summary?: string;
  doctor_notes?: string;
  scheduled_at?: string; // Assuming this field exists or we mock it
  doctor?: {
    full_name: string;
    specialty: string;
  };
};

// --- Supabase Init ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const ClinicalCalendar = ({ appointments }: { appointments: any[] }) => {
  const upcoming = appointments?.filter(c => c.status === "scheduled") || [];

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-3xl p-6 h-full flex flex-col relative">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-[#562C2C]" />
        <h3 className="text-[#562C2C] font-medium">Care Timeline</h3>
      </div>

      {/* Split View */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#562C2C]/60">
            <p>No upcoming consultations.</p>
            <button className="mt-2 text-[#00A36C] font-bold text-sm hover:underline">Book Now</button>
          </div>
        ) : (
          upcoming.map((apt) => (
            <div key={apt.id} className="bg-white/40 p-3 rounded-xl border border-white/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[#562C2C] text-sm">{apt.doctor_name}</h4>
                  <p className="text-xs text-[#562C2C]/60">{apt.clinic_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#00A36C]">
                    {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[10px] text-[#562C2C]/40">
                    {new Date(apt.appointment_time).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper Icon
const UserCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);
