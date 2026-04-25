"use client";
import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Droplets, Zap, Moon, Footprints, Watch } from "lucide-react";
import type { WatchData } from "@/hooks/useDashboardData";

interface WatchVitalsCardProps {
  watchData: WatchData;
}

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-6" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle
        cx={w}
        cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2}
        r="2"
        fill={color}
      />
    </svg>
  );
};

const StepsRing = ({ steps, goal = 10000 }: { steps: number; goal?: number }) => {
  const progress = Math.min(steps / goal, 1);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#562C2C" strokeOpacity="0.06" strokeWidth="3" />
        <motion.circle
          cx="20" cy="20" r={radius} fill="none"
          stroke="#00A36C" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Footprints className="w-3.5 h-3.5 text-[#00A36C]" />
      </div>
    </div>
  );
};

export const WatchVitalsCard = ({ watchData }: WatchVitalsCardProps) => {
  const getSpo2Status = (val: number) => {
    if (val >= 96) return { color: "text-[#00A36C]", bg: "bg-[#00A36C]/10" };
    if (val >= 93) return { color: "text-[#E9C46A]", bg: "bg-[#E9C46A]/10" };
    return { color: "text-[#E07A5F]", bg: "bg-[#E07A5F]/10" };
  };

  const getStressLabel = (val: number) => {
    if (val < 30) return { label: "Calm", color: "text-[#00A36C]" };
    if (val < 60) return { label: "Moderate", color: "text-[#E9C46A]" };
    return { label: "Elevated", color: "text-[#E07A5F]" };
  };

  const getCardioChip = (load: WatchData['cardioLoad']) => {
    const map = {
      low: { label: "Low Load", bg: "bg-[#562C2C]/5", text: "text-[#562C2C]/60" },
      optimal: { label: "Optimal", bg: "bg-[#00A36C]/10", text: "text-[#00A36C]" },
      high: { label: "High Load", bg: "bg-[#E9C46A]/10", text: "text-[#E9C46A]" },
      overreaching: { label: "Overreaching", bg: "bg-[#E07A5F]/10", text: "text-[#E07A5F]" },
    };
    return map[load];
  };

  const spo2Status = getSpo2Status(watchData.spo2);
  const stressInfo = getStressLabel(watchData.edaStressLevel);
  const cardioChip = getCardioChip(watchData.cardioLoad);
  const syncAgo = Math.round((Date.now() - new Date(watchData.lastSynced).getTime()) / 1000);

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 shadow-sm rounded-3xl p-4 h-full flex flex-col relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#00A36C]/8 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#562C2C]/5 rounded-lg">
            <Watch className="w-4 h-4 text-[#562C2C]" />
          </div>
          <div>
            <h3 className="text-[#562C2C] font-bold text-sm leading-none">Pixel Watch 4</h3>
            <p className="text-[10px] text-[#562C2C]/50 font-medium mt-0.5">Wearable Telemetry</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A36C] animate-pulse" />
          <span className="text-[10px] font-bold text-[#00A36C]">{syncAgo}s ago</span>
        </div>
      </div>

      {/* Heart Rate — Hero Metric */}
      <div className="mb-2 relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <Heart className="w-3 h-3 text-[#E07A5F]" />
          <span className="text-[10px] font-bold text-[#562C2C]/40 uppercase tracking-wider">Heart Rate</span>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#562C2C] leading-none">{watchData.heartRate}</span>
            <span className="text-xs font-bold text-[#562C2C]/40">bpm</span>
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <MiniSparkline data={watchData.heartRateHistory} color="#E07A5F" />
          </div>
        </div>
      </div>

      {/* 2×3 Metrics Grid */}
      <div className="grid grid-cols-3 gap-1.5 flex-1 min-h-0 relative z-10">
        {/* HRV */}
        <div className="bg-white/50 rounded-xl p-2 border border-[#562C2C]/5 flex flex-col justify-center">
          <div className="flex items-center gap-1 mb-1">
            <Activity className="w-3 h-3 text-[#562C2C]/40" />
            <span className="text-[9px] font-bold text-[#562C2C]/40 uppercase">HRV</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-base font-black text-[#562C2C]">{watchData.hrvMs}</span>
            <span className="text-[9px] font-medium text-[#562C2C]/40">ms</span>
          </div>
        </div>

        {/* SpO2 */}
        <div className={`${spo2Status.bg} rounded-xl p-2 border border-current/5 flex flex-col justify-center`}>
          <div className="flex items-center gap-1 mb-1">
            <Droplets className="w-3 h-3 text-[#562C2C]/40" />
            <span className="text-[9px] font-bold text-[#562C2C]/40 uppercase">SpO₂</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className={`text-base font-black ${spo2Status.color}`}>{watchData.spo2}</span>
            <span className="text-[9px] font-medium text-[#562C2C]/40">%</span>
          </div>
        </div>

        {/* Stress (cEDA) */}
        <div className="bg-white/50 rounded-xl p-2 border border-[#562C2C]/5 flex flex-col justify-center">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-[#562C2C]/40" />
            <span className="text-[9px] font-bold text-[#562C2C]/40 uppercase">Stress</span>
          </div>
          <span className={`text-sm font-bold ${stressInfo.color}`}>{stressInfo.label}</span>
        </div>

        {/* Steps + Ring */}
        <div className="bg-white/50 rounded-xl p-2 border border-[#562C2C]/5 flex items-center gap-1.5">
          <StepsRing steps={watchData.steps} />
          <div>
            <span className="text-sm font-black text-[#562C2C] block leading-none">{(watchData.steps / 1000).toFixed(1)}k</span>
            <span className="text-[9px] text-[#562C2C]/40 font-medium">steps</span>
          </div>
        </div>

        {/* Sleep */}
        <div className="bg-white/50 rounded-xl p-2 border border-[#562C2C]/5 flex flex-col justify-center">
          <div className="flex items-center gap-1 mb-1">
            <Moon className="w-3 h-3 text-[#562C2C]/40" />
            <span className="text-[9px] font-bold text-[#562C2C]/40 uppercase">Sleep</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-base font-black text-[#562C2C]">{watchData.sleepScore}</span>
            <span className="text-[9px] font-medium text-[#562C2C]/40">/100</span>
          </div>
        </div>

        {/* Skin Temp Δ */}
        <div className="bg-white/50 rounded-xl p-2 border border-[#562C2C]/5 flex flex-col justify-center">
          <span className="text-[9px] font-bold text-[#562C2C]/40 uppercase mb-1">Skin Δ</span>
          <span className={`text-base font-black ${watchData.skinTempDelta > 0.5 ? "text-[#E07A5F]" : watchData.skinTempDelta < -0.5 ? "text-[#2A9D8F]" : "text-[#562C2C]"}`}>
            {watchData.skinTempDelta > 0 ? "+" : ""}{watchData.skinTempDelta}°
          </span>
        </div>
      </div>

      {/* Footer: Readiness + Cardio Load */}
      <div className="mt-2 pt-2 border-t border-[#562C2C]/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#562C2C]/40 uppercase">Readiness</span>
          <span className="text-sm font-black text-[#562C2C]">{watchData.dailyReadiness}<span className="text-[#562C2C]/40 font-medium">/100</span></span>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${cardioChip.bg} ${cardioChip.text}`}>
          {cardioChip.label}
        </div>
      </div>
    </div>
  );
};
