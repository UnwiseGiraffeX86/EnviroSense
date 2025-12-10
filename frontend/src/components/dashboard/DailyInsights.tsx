"use client";

import React from "react";
import { Lightbulb, Wind, Brain, ShieldCheck, AlertTriangle, Leaf } from "lucide-react";

export const DailyInsights = ({ pm25, focusIndex }: { pm25: number, focusIndex: number }) => {
  // Simple logic to generate insights based on props
  const insights = [
    {
      id: 1,
      type: "environment",
      icon: Leaf,
      text: pm25 < 15 
        ? "Air quality is pristine. Great time for a walk in the park." 
        : "Particulate matter is rising. Keep windows closed during peak traffic.",
      color: pm25 < 15 ? "text-[#00A36C]" : "text-[#E07A5F]",
      bg: pm25 < 15 ? "bg-[#00A36C]/10" : "bg-[#E07A5F]/10"
    },
    {
      id: 2,
      type: "neuro",
      icon: Brain,
      text: focusIndex > 7 
        ? "Your cognitive rhythm is peaking. Tackle complex tasks now." 
        : "Focus levels are dipping. A 15-minute disconnect is recommended.",
      color: "text-[#562C2C]",
      bg: "bg-[#562C2C]/5"
    },
    {
      id: 3,
      type: "protection",
      icon: ShieldCheck,
      text: "Sentinel System is active. No immediate bio-threats detected in Sector 3.",
      color: "text-[#00A36C]",
      bg: "bg-[#00A36C]/10"
    }
  ];

  return (
    <div className="bg-[#FAF3DD]/90 backdrop-blur-xl border border-[#562C2C]/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="p-2 bg-[#E9C46A]/20 rounded-full">
          <Lightbulb className="w-5 h-5 text-[#E9C46A]" />
        </div>
        <h3 className="text-[#562C2C] font-bold">Sentinel Insights</h3>
      </div>

      {/* Insights List */}
      <div className="flex-1 space-y-4 relative z-10 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#562C2C]/20">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white/60 p-4 rounded-2xl border border-[#562C2C]/5 flex gap-4 items-start hover:bg-white/80 transition-colors cursor-default">
            <div className={`p-2.5 rounded-xl ${insight.bg} flex-shrink-0`}>
              <insight.icon className={`w-5 h-5 ${insight.color}`} />
            </div>
            <div>
              <p className="text-sm text-[#562C2C] font-medium leading-relaxed">
                {insight.text}
              </p>
              <p className="text-[10px] text-[#562C2C]/40 uppercase tracking-wider font-bold mt-1">
                {insight.type}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-[#562C2C]/5 relative z-10">
        <button className="w-full py-3 bg-[#562C2C] text-[#FAF3DD] rounded-xl font-bold text-sm hover:bg-[#3E1F1F] transition-colors flex items-center justify-center gap-2 shadow-lg">
          <Wind className="w-4 h-4" />
          View Full Report
        </button>
      </div>
    </div>
  );
};
