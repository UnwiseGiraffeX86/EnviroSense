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
    <div className="bg-[#FAF3DD]/90 backdrop-blur-xl border border-[#562C2C]/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00A36C]/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#562C2C]/5 rounded-full">
            <CalendarIcon className="w-5 h-5 text-[#562C2C]" />
          </div>
          <h3 className="text-[#562C2C] font-bold">Care Timeline</h3>
        </div>
        <button className="text-xs font-medium text-[#00A36C] hover:text-[#008f5d] transition-colors bg-[#00A36C]/10 px-3 py-1.5 rounded-full">
          View All
        </button>
      </div>

      {/* Split View */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto relative z-10">
        
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-[#562C2C]/5 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-[#562C2C]/20" />
            </div>
            <div>
              <p className="text-[#562C2C] font-medium">No upcoming consultations</p>
              <p className="text-[#562C2C]/60 text-sm mt-1 max-w-[200px] mx-auto">
                Your health schedule is clear. Need to see a specialist?
              </p>
            </div>
            <button className="mt-2 bg-[#00A36C] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#008f5d] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Book Consultation
            </button>
          </div>
        ) : (
          upcoming.map((apt) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={apt.id} 
              className="bg-white/60 p-4 rounded-2xl border border-[#562C2C]/5 hover:border-[#00A36C]/30 transition-colors group cursor-pointer shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00A36C]/10 flex items-center justify-center text-[#00A36C] font-bold">
                    {apt.doctor_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#562C2C] text-sm group-hover:text-[#00A36C] transition-colors">{apt.doctor_name}</h4>
                    <p className="text-xs text-[#562C2C]/60 flex items-center gap-1 mt-0.5">
                      <Video className="w-3 h-3" />
                      {apt.clinic_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#562C2C] bg-[#FAF3DD] px-2 py-1 rounded-lg border border-[#562C2C]/5">
                    {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[10px] text-[#562C2C]/40 mt-1 font-medium uppercase tracking-wide">
                    {new Date(apt.appointment_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </motion.div>
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
