"use client";
import React from "react";
import { BrainCircuit, Zap, Moon, Waves, Target, Info } from "lucide-react";

export const NeuroRadar = ({ focusIndex, pm25 }: { focusIndex: number, pm25: number }) => {
  const impact = Math.min(pm25 / 10, focusIndex);
  const currentFocus = Math.max(0, focusIndex - impact);
  
  // Helper for status
  const getStatus = (score: number) => {
    if (score >= 8) return { label: "Peak Performance", color: "text-[#00A36C]", bg: "bg-[#00A36C]" };
    if (score >= 5) return { label: "Moderate Clarity", color: "text-[#E9C46A]", bg: "bg-[#E9C46A]" };
    return { label: "Brain Fog", color: "text-[#E07A5F]", bg: "bg-[#E07A5F]" };
  };

  const status = getStatus(currentFocus);

  // Mock metrics derived from focusIndex for visualization
  const metrics = [
    { label: "Focus", value: currentFocus * 10, icon: Target, color: "bg-[#00A36C]" },
    { label: "Energy", value: Math.min(100, currentFocus * 10 + 5), icon: Zap, color: "bg-[#E9C46A]" },
    { label: "Calmness", value: Math.min(100, currentFocus * 10 + 10), icon: Waves, color: "bg-[#2A9D8F]" },
    { label: "Sleep", value: Math.max(20, currentFocus * 10 - 10), icon: Moon, color: "bg-[#264653]" },
  ];

  return (
    <div className="bg-[#FAF3DD]/90 backdrop-blur-xl border border-[#562C2C]/10 rounded-3xl p-5 h-full flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-[#E07A5F]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-[#562C2C]/5 rounded-full">
          <BrainCircuit className="w-5 h-5 text-[#562C2C]" />
        </div>
        <div>
            <h3 className="text-[#562C2C] font-bold leading-none text-base">Brain Clarity</h3>
            <p className="text-xs text-[#562C2C]/60 font-medium mt-0.5">Real-time Cognitive Index</p>
        </div>
      </div>
      
      {/* Main Score & Status */}
      <div className="flex items-end gap-4 mb-6 relative z-10">
         <div className="text-5xl font-bold text-[#562C2C] tracking-tighter leading-none">
            {currentFocus.toFixed(1)}
         </div>
         <div className="pb-1.5">
            <div className={`text-sm font-bold ${status.color} uppercase tracking-wide`}>{status.label}</div>
            <div className="text-[10px] text-[#562C2C]/50 font-medium">Based on biometric & env data</div>
         </div>
      </div>

      {/* Metrics Bars */}
      <div className="flex-1 flex flex-col justify-center gap-3 relative z-10">
         {metrics.map((m) => (
            <div key={m.label} className="w-full">
               <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2 text-[#562C2C]/80 font-bold">
                    <m.icon size={14} className="text-[#562C2C]/40" />
                    {m.label}
                  </div>
                  <span className="font-bold text-[#562C2C]">{m.value.toFixed(0)}%</span>
               </div>
               <div className="h-2 w-full bg-[#562C2C]/5 rounded-full overflow-hidden border border-[#562C2C]/5">
                  <div 
                    className={`h-full rounded-full ${m.color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${m.value}%` }}
                  />
               </div>
            </div>
         ))}
      </div>

      {/* Impact Note */}
      <div className="mt-auto pt-4 relative z-10">
        <div className="bg-white/50 rounded-xl p-3 flex items-start gap-2.5 border border-[#562C2C]/5">
            <Info size={14} className="text-[#E07A5F] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#562C2C]/80 leading-relaxed">
                <span className="font-bold text-[#E07A5F]">Air Quality Impact:</span> High PM2.5 levels are reducing your cognitive score by <span className="font-bold">-{impact.toFixed(1)}</span> points today.
            </p>
        </div>
      </div>
    </div>
  );
};
