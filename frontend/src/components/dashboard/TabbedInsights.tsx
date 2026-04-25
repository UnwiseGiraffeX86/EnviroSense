"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Calendar as CalendarIcon, Clock, Heart, Moon, Activity, ChevronRight } from "lucide-react";
import type { WatchData } from "@/hooks/useDashboardData";

export const TabbedInsights = ({ 
  pm25, 
  focusIndex, 
  appointments,
  watchData
}: { 
  pm25: number, 
  focusIndex: number, 
  appointments: any[],
  watchData?: WatchData | null,
}) => {
  const [activeTab, setActiveTab] = useState<"insights" | "vitals" | "timeline">("insights");
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

  // Correlation insight (if watch data available)
  const hrCorrelation = watchData && pm25 > 25
    ? `Your HR averaged ${watchData.heartRate}bpm — ${Math.round((watchData.heartRate / 70 - 1) * 100)}% above baseline during elevated PM2.5.`
    : null;

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 shadow-sm rounded-3xl flex flex-col h-full overflow-hidden relative">
      {/* Header / Tabs */}
      <div className="flex items-center p-1.5 gap-1 border-b border-[#562C2C]/5">
        {(["insights", "vitals", "timeline"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab 
                ? "bg-[#562C2C]/5 text-[#562C2C]" 
                : "text-[#562C2C]/40 hover:bg-[#562C2C]/5"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === "insights" ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {insights.map((insight) => (
                <div key={insight.id} className={`p-4 rounded-2xl ${insight.bg} border border-current/10`}>
                  <div className="flex gap-3">
                    <Lightbulb className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <p className={`text-sm font-medium ${insight.color} leading-relaxed`}>
                      {insight.text}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-2xl bg-[#00A36C]/10 border border-[#00A36C]/20">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00A36C] flex items-center justify-center text-xs text-white font-bold flex-shrink-0">✓</div>
                  <p className="text-sm font-medium text-[#00A36C]">
                    Sentinel System Active. No bio-threats.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "vitals" ? (
            <motion.div
              key="vitals"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {watchData ? (
                <>
                  {/* HR Trend */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-[#E07A5F]" />
                      <span className="text-xs font-bold text-[#562C2C]/60 uppercase tracking-wider">Heart Rate — 24h</span>
                    </div>
                    <div className="bg-white/50 rounded-xl p-3 border border-[#562C2C]/5">
                      <svg viewBox="0 0 200 40" className="w-full h-10">
                        {(() => {
                          const data = watchData.heartRateHistory;
                          const max = Math.max(...data);
                          const min = Math.min(...data);
                          const range = max - min || 1;
                          const points = data
                            .map((v, i) => `${(i / (data.length - 1)) * 200},${36 - ((v - min) / range) * 30}`)
                            .join(" ");
                          return (
                            <>
                              <polyline points={points} fill="none" stroke="#E07A5F" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                              <circle cx="200" cy={36 - ((data[data.length - 1] - min) / range) * 30} r="3" fill="#E07A5F" />
                            </>
                          );
                        })()}
                      </svg>
                      <div className="flex justify-between text-[9px] text-[#562C2C]/40 font-mono mt-1">
                        <span>-24h</span>
                        <span>now</span>
                      </div>
                    </div>
                  </div>

                  {/* Sleep Breakdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-[#264653]" />
                        <span className="text-xs font-bold text-[#562C2C]/60 uppercase tracking-wider">Sleep Stages</span>
                      </div>
                      <span className="text-sm font-bold text-[#562C2C]">{watchData.sleepScore}/100</span>
                    </div>
                    <div className="bg-white/50 rounded-xl p-3 border border-[#562C2C]/5">
                      {/* Stacked horizontal bar */}
                      <div className="flex rounded-full h-3 overflow-hidden">
                        {[
                          { val: watchData.sleepStages.deep, color: "bg-[#264653]", label: "Deep" },
                          { val: watchData.sleepStages.rem, color: "bg-[#2A9D8F]", label: "REM" },
                          { val: watchData.sleepStages.light, color: "bg-[#E9C46A]", label: "Light" },
                          { val: watchData.sleepStages.awake, color: "bg-[#E07A5F]", label: "Awake" },
                        ].map(stage => {
                          const total = watchData.sleepStages.deep + watchData.sleepStages.rem + watchData.sleepStages.light + watchData.sleepStages.awake;
                          const pct = (stage.val / total) * 100;
                          return (
                            <div
                              key={stage.label}
                              className={`${stage.color} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                              title={`${stage.label}: ${stage.val}min`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2 text-[9px] text-[#562C2C]/50 font-medium">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#264653]" /> Deep {watchData.sleepStages.deep}m</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2A9D8F]" /> REM {watchData.sleepStages.rem}m</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E9C46A]" /> Light {watchData.sleepStages.light}m</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E07A5F]" /> Awake {watchData.sleepStages.awake}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Readiness Score */}
                  <div className="bg-white/50 rounded-xl p-3 border border-[#562C2C]/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00A36C]" />
                      <span className="text-xs font-bold text-[#562C2C]">Daily Readiness</span>
                    </div>
                    <span className={`text-lg font-black ${
                      watchData.dailyReadiness >= 70 ? "text-[#00A36C]" : 
                      watchData.dailyReadiness >= 40 ? "text-[#E9C46A]" : "text-[#E07A5F]"
                    }`}>
                      {watchData.dailyReadiness}<span className="text-[#562C2C]/30 text-xs font-normal">/100</span>
                    </span>
                  </div>

                  {/* Correlation Insight */}
                  {hrCorrelation && (
                    <div className="bg-[#E07A5F]/8 rounded-xl p-3 border border-[#E07A5F]/15">
                      <p className="text-[11px] text-[#562C2C] leading-relaxed">
                        <span className="font-bold text-[#E07A5F]">⚡ Correlation:</span> {hrCorrelation}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                  <Heart className="w-10 h-10 text-[#562C2C]/15 mb-3" />
                  <p className="text-[#562C2C]/50 text-sm">No watch data available</p>
                  <p className="text-[#562C2C]/30 text-xs mt-1">Connect your Pixel Watch 4</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3 h-full"
            >
              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                  <Clock className="w-10 h-10 text-[#562C2C]/15 mb-3" />
                  <p className="text-[#562C2C]/50 text-sm">No upcoming visits</p>
                  <button className="mt-4 text-sm bg-[#00A36C] text-white px-5 py-2.5 rounded-xl font-medium">
                    Book Now
                  </button>
                </div>
              ) : (
                upcoming.map((apt) => (
                  <div key={apt.id} className="bg-white/60 p-4 rounded-xl border border-[#562C2C]/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#00A36C]/10 flex items-center justify-center text-[#00A36C] font-bold text-sm">
                        {apt.doctor_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#562C2C]">{apt.doctor_name}</p>
                        <p className="text-xs text-[#562C2C]/60">{apt.clinic_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#562C2C]">
                        {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-[#562C2C]/40 uppercase">
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
