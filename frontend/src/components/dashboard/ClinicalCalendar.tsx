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

export const ClinicalCalendar = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock Data for Demo if DB is empty
  const MOCK_CONSULTATIONS: Consultation[] = [
    {
      id: "1",
      doctor_id: "d1",
      patient_id: "p1",
      status: "completed",
      created_at: "2023-10-12T10:00:00Z",
      scheduled_at: "2023-10-12T10:00:00Z",
      ai_summary: "Patient reported mild wheezing. AI analysis suggests correlation with high PM2.5 levels on Oct 10th. Recommended increasing inhaler usage frequency.",
      doctor_notes: "Prescribed Ventolin. Follow up in 2 weeks.",
      doctor: { full_name: "Dr. Elena Ionescu", specialty: "Pulmonology" }
    },
    {
      id: "2",
      doctor_id: "d2",
      patient_id: "p1",
      status: "scheduled",
      created_at: "2025-12-08T14:30:00Z",
      scheduled_at: "2025-12-08T14:30:00Z", // Tomorrow
      doctor: { full_name: "Dr. Andrei Popa", specialty: "General Practice" }
    }
  ];

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // In a real app, we would join with a 'doctors' table
        // For now, we'll use the mock data mixed with any real data if available
        // const { data, error } = await supabase
        //   .from("consultations")
        //   .select("*, doctors(full_name, specialty)")
        //   .eq("patient_id", session.user.id);
        
        // Simulating fetch delay
        setTimeout(() => {
          setConsultations(MOCK_CONSULTATIONS);
          setLoading(false);
        }, 500);

      } catch (err) {
        console.error("Error fetching consultations:", err);
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const upcoming = consultations.filter(c => c.status === "scheduled");
  const past = consultations.filter(c => c.status === "completed");

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-3xl p-6 h-full flex flex-col relative">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-[#562C2C]" />
        <h3 className="text-[#562C2C] font-medium">Care Timeline</h3>
      </div>

      {/* Split View */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Top: Mini Calendar Strip */}
        <div className="bg-white/40 rounded-2xl p-4 flex justify-between items-center">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const date = new Date();
            date.setDate(date.getDate() + offset);
            const isToday = offset === 0;
            const hasAppt = consultations.some(c => {
                const cDate = new Date(c.scheduled_at || c.created_at);
                return cDate.getDate() === date.getDate() && cDate.getMonth() === date.getMonth();
            });

            return (
              <div key={offset} className={`flex flex-col items-center gap-1 ${isToday ? 'opacity-100' : 'opacity-50'}`}>
                <span className="text-[10px] font-bold uppercase text-[#562C2C]">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isToday ? 'bg-[#562C2C] text-[#FAF3DD]' : 'text-[#562C2C]'}`}>
                  {date.getDate()}
                </div>
                {hasAppt && <div className="w-1 h-1 rounded-full bg-[#00A36C]" />}
              </div>
            );
          })}
        </div>

        {/* Bottom: Agenda */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {/* Upcoming */}
          {upcoming.map(appt => (
            <div key={appt.id} className="bg-white/60 p-3 rounded-xl border-l-4 border-[#00A36C] shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-[#00A36C] uppercase tracking-wider">Upcoming</span>
                <Video className="w-4 h-4 text-[#562C2C]/40" />
              </div>
              <div className="font-medium text-[#562C2C] text-sm">{appt.doctor?.full_name}</div>
              <div className="text-xs text-[#562C2C]/60">{appt.doctor?.specialty}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-[#562C2C]/80 font-medium bg-[#562C2C]/5 py-1 px-2 rounded-lg w-fit">
                <Clock className="w-3 h-3" />
                {new Date(appt.scheduled_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}

          {/* Past */}
          {past.map(appt => (
            <button 
              key={appt.id} 
              onClick={() => setSelectedConsultation(appt)}
              className="w-full text-left bg-white/30 p-3 rounded-xl border border-transparent hover:border-[#562C2C]/10 hover:bg-white/50 transition-all group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#562C2C]/40 uppercase tracking-wider">Past • {new Date(appt.created_at).toLocaleDateString()}</span>
                <ChevronRight className="w-4 h-4 text-[#562C2C]/20 group-hover:text-[#562C2C]/60 transition-colors" />
              </div>
              <div className="font-medium text-[#562C2C]/80 text-sm">{appt.doctor?.full_name}</div>
              <div className="text-xs text-[#562C2C]/50">{appt.doctor?.specialty}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Notes Drawer (Modal) */}
      <AnimatePresence>
        {selectedConsultation && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConsultation(null)}
              className="absolute inset-0 bg-[#562C2C]/20 backdrop-blur-sm z-10 rounded-3xl"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-[#FAF3DD] rounded-t-3xl shadow-2xl z-20 max-h-[80%] flex flex-col border-t border-[#562C2C]/10"
            >
              <div className="p-4 border-b border-[#562C2C]/10 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-[#562C2C]">Consultation Notes</h4>
                  <p className="text-xs text-[#562C2C]/60">{new Date(selectedConsultation.created_at).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedConsultation(null)}
                  className="p-2 hover:bg-[#562C2C]/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#562C2C]" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                {/* AI Summary Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#00A36C]">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Analysis Summary</span>
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl text-sm text-[#562C2C] leading-relaxed border border-[#562C2C]/5">
                    {selectedConsultation.ai_summary || "No summary available."}
                  </div>
                </div>

                {/* Doctor Notes Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#562C2C]/60">
                    <UserCircleIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Doctor's Notes</span>
                  </div>
                  <div className="bg-[#562C2C]/5 p-4 rounded-xl text-sm text-[#562C2C] leading-relaxed italic">
                    "{selectedConsultation.doctor_notes || "No notes added."}"
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
