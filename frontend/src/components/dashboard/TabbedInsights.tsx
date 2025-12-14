"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Calendar as CalendarIcon, Clock, Video, ChevronRight } from "lucide-react";

export const TabbedInsights = ({ 
  pm25, 
  focusIndex, 
  appointments 
}: { 
  pm25: number, 
  focusIndex: number, 
  appointments: any[] 
}) => {
  const [activeTab, setActiveTab] = useState<"insights" | "timeline">("insights");
  const upcoming = appointments?.filter(c => c.status === "scheduled") || [];

  // Insights Data
  const insights = [
    {
      id: 1,
      text: pm25 < 15 
        ? "Air quality is pristine. Great time for a walk." 
        : "PM2.5 rising. Keep windows closed.",
      color: pm25 < 15 ? "text-[#00A36C]" : "text-[#E07A5F]",
      bg: pm25 < 15 ? "bg-[#00A36C]/10" : "bg-[#E07A5F]/10"
    },
    {
      id: 2,
      text: focusIndex > 7 
        ? "Cognitive peak. Tackle complex tasks." 
        : "Focus dipping. Take a 15m break.",
      color: "text-[#562C2C]",
      bg: "bg-[#562C2C]/5"
    }
  ];

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 shadow-sm rounded-3xl flex flex-col h-full overflow-hidden relative">
      {/* Header / Tabs */}
      <div className="flex items-center p-2 gap-2 border-b border-[#562C2C]/5">
        <button
          onClick={() => setActiveTab("insights")}
          className={`flex-1 py-3 rounded-xl text-base font-bold transition-all ${
            activeTab === "insights" 
              ? "bg-[#562C2C]/5 text-[#562C2C]" 
              : "text-[#562C2C]/40 hover:bg-[#562C2C]/5"
          }`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex-1 py-3 rounded-xl text-base font-bold transition-all ${
            activeTab === "timeline" 
              ? "bg-[#562C2C]/5 text-[#562C2C]" 
              : "text-[#562C2C]/40 hover:bg-[#562C2C]/5"
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          {activeTab === "insights" ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {insights.map((insight) => (
                <div key={insight.id} className={`p-5 rounded-2xl ${insight.bg} border border-current/10`}>
                  <div className="flex gap-4">
                    <Lightbulb className={`w-6 h-6 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <p className={`text-base font-medium ${insight.color} leading-relaxed`}>
                      {insight.text}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-5 rounded-2xl bg-[#00A36C]/10 border border-[#00A36C]/20">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#00A36C] flex items-center justify-center text-sm text-white font-bold">✓</div>
                  <p className="text-base font-medium text-[#00A36C]">
                    Sentinel System Active. No bio-threats.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 h-full"
            >
              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                  <Clock className="w-12 h-12 text-[#562C2C]/20 mb-4" />
                  <p className="text-[#562C2C]/60 text-base">No upcoming visits</p>
                  <button className="mt-5 text-base bg-[#00A36C] text-white px-6 py-3 rounded-xl font-medium">
                    Book Now
                  </button>
                </div>
              ) : (
                upcoming.map((apt) => (
                  <div key={apt.id} className="bg-white/60 p-5 rounded-xl border border-[#562C2C]/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#00A36C]/10 flex items-center justify-center text-[#00A36C] font-bold text-base">
                        {apt.doctor_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#562C2C]">{apt.doctor_name}</p>
                        <p className="text-sm text-[#562C2C]/60">{apt.clinic_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#562C2C]">
                        {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-[#562C2C]/40 uppercase">
                        {new Date(apt.appointment_time).toLocaleDateString(undefined, { weekday: 'short' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
