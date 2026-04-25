"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Heart, Wind, Thermometer, Info } from "lucide-react";
import type { WatchData } from "@/hooks/useDashboardData";

interface CompoundRiskCardProps {
  pm25: number;
  watchData: WatchData | null;
  pollutionSensitivity: number;
  respiratoryConditions: string[];
}

type RiskFactor = { label: string; contribution: number; icon: React.ElementType; color: string };

function computeRisk(pm25: number, w: WatchData | null, sens: number, conds: string[]) {
  const factors: RiskFactor[] = [];
  let r = 1.0;
  const p = pm25 <= 10 ? 0 : pm25 <= 25 ? (pm25-10)*0.1 : pm25 <= 50 ? 1.5+(pm25-25)*0.06 : 3;
  if (p > 0.2) { factors.push({ label: `PM2.5 ${pm25.toFixed(0)}µg`, contribution: p, icon: Wind, color: "#E07A5F" }); }
  r += p;
  if (w) {
    const h = w.hrvMs < 30 ? 2 : w.hrvMs < 45 ? 1.2 : w.hrvMs < 60 ? 0.5 : 0;
    if (h > 0.2) factors.push({ label: `Low HRV ${w.hrvMs}ms`, contribution: h, icon: Heart, color: "#E07A5F" });
    r += h;
    const s2 = w.spo2 < 93 ? 2 : w.spo2 < 95 ? 1 : w.spo2 < 97 ? 0.3 : 0;
    if (s2 > 0.2) factors.push({ label: `SpO₂ ${w.spo2}%`, contribution: s2, icon: Heart, color: "#E07A5F" });
    r += s2;
    const st = w.edaStressLevel > 60 ? (w.edaStressLevel-60)*0.025 : 0;
    if (st > 0.2) factors.push({ label: "Elevated Stress", contribution: st, icon: AlertTriangle, color: "#E9C46A" });
    r += st;
    const sl = w.sleepScore < 50 ? 1.5 : w.sleepScore < 65 ? 0.8 : w.sleepScore < 75 ? 0.3 : 0;
    if (sl > 0.2) factors.push({ label: `Poor Sleep (${w.sleepScore})`, contribution: sl, icon: AlertTriangle, color: "#E9C46A" });
    r += sl;
    const sk = Math.abs(w.skinTempDelta) > 1 ? 0.5 : Math.abs(w.skinTempDelta) > 0.5 ? 0.2 : 0;
    if (sk > 0.1) factors.push({ label: `Skin Δ ${w.skinTempDelta > 0?"+":""}${w.skinTempDelta}°`, contribution: sk, icon: Thermometer, color: "#E9C46A" });
    r += sk;
  }
  r *= (0.8 + (sens/10)*0.5);
  r += conds.filter(c => c !== "None").length * 0.3;
  factors.sort((a, b) => b.contribution - a.contribution);
  return { score: Math.max(1, Math.min(10, r)), factors: factors.slice(0, 3) };
}

function getStatus(s: number) {
  if (s <= 3) return { label: "Low Risk", color: "#00A36C", bg: "bg-[#00A36C]/10", text: "text-[#00A36C]" };
  if (s <= 5) return { label: "Moderate", color: "#E9C46A", bg: "bg-[#E9C46A]/10", text: "text-[#E9C46A]" };
  if (s <= 7) return { label: "Elevated", color: "#E07A5F", bg: "bg-[#E07A5F]/10", text: "text-[#E07A5F]" };
  return { label: "Critical", color: "#562C2C", bg: "bg-[#562C2C]/10", text: "text-[#562C2C]" };
}

export const CompoundRiskCard = ({ pm25, watchData, pollutionSensitivity, respiratoryConditions }: CompoundRiskCardProps) => {
  const { score, factors } = computeRisk(pm25, watchData, pollutionSensitivity, respiratoryConditions);
  const status = getStatus(score);
  const rec = score <= 3 ? "Conditions favorable. Great time for outdoor activity."
    : score <= 5 ? "Monitor your breathing. Consider indoor exercise."
    : score <= 7 ? "Move evening walk to Herăstrău — 42% lower exposure."
    : "Stay indoors. Air purifier on. Avoid exertion.";

  const R = 38, C = 2*Math.PI*R, arc = C*0.75, off = arc - (score/10)*arc;

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 shadow-sm rounded-3xl p-4 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-[#562C2C] flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-[#562C2C] font-bold text-sm leading-none">Compound Risk</h3>
            <p className="text-[9px] text-[#562C2C]/50 font-medium mt-0.5">Fused Biometric + Environmental</p>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${status.bg} ${status.text} border border-current/10 flex-shrink-0`}>
          {status.label}
        </div>
      </div>

      {/* Gauge + Factors */}
      <div className="flex gap-3 flex-1 min-h-0 overflow-hidden">
        <div className="relative w-[76px] h-[76px] flex-shrink-0 self-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: "rotate(135deg)" }}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="#562C2C" strokeOpacity="0.06" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${arc} ${C-arc}`} />
            <motion.circle cx="50" cy="50" r={R} fill="none" stroke={status.color} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${arc} ${C-arc}`} initial={{ strokeDashoffset: arc }} animate={{ strokeDashoffset: off }} transition={{ duration: 1.5, ease: "easeOut" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[8px] font-bold text-[#562C2C]/40 uppercase">Risk</span>
            <span className="text-xl font-black text-[#562C2C] leading-none">{score.toFixed(1)}</span>
            <span className="text-[7px] font-bold text-[#562C2C]/30">/10</span>
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 overflow-hidden">
          <span className="text-[8px] font-bold text-[#562C2C]/40 uppercase tracking-wider">Contributing Factors</span>
          {factors.length === 0 ? (
            <p className="text-[11px] text-[#00A36C] font-medium">All clear — no risk factors.</p>
          ) : factors.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 min-w-0">
              <f.icon className="w-3 h-3 flex-shrink-0" style={{ color: f.color }} />
              <span className="text-[11px] text-[#562C2C]/70 truncate flex-1">{f.label}</span>
              <span className="text-[11px] font-bold text-[#562C2C] flex-shrink-0">+{f.contribution.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-2 flex-shrink-0">
        <div className="bg-[#00A36C]/8 rounded-xl p-2 border border-[#00A36C]/15 flex items-start gap-1.5">
          <Info className="w-3 h-3 text-[#00A36C] mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-[#562C2C] leading-relaxed"><span className="font-bold text-[#00A36C]">Sentinel:</span> {rec}</p>
        </div>
      </div>

      {/* Bottom: HR, PM2.5, Skin Δ */}
      <div className="mt-2 pt-2 border-t border-[#562C2C]/5 grid grid-cols-3 divide-x divide-[#562C2C]/5 flex-shrink-0">
        <div className="text-center px-1">
          <div className="text-[7px] font-bold text-[#562C2C]/40 uppercase">HR</div>
          <div className="text-xs font-black text-[#562C2C]">{watchData?.heartRate||"--"}<span className="text-[7px] font-normal text-[#562C2C]/40"> bpm</span></div>
        </div>
        <div className="text-center px-1">
          <div className="text-[7px] font-bold text-[#562C2C]/40 uppercase">PM2.5</div>
          <div className="text-xs font-black text-[#562C2C]">{pm25.toFixed(0)}<span className="text-[7px] font-normal text-[#562C2C]/40"> µg</span></div>
        </div>
        <div className="text-center px-1">
          <div className="text-[7px] font-bold text-[#562C2C]/40 uppercase">Skin Δ</div>
          <div className="text-xs font-black text-[#562C2C]">{watchData?`${watchData.skinTempDelta>0?"+":""}${watchData.skinTempDelta}°`:"--"}</div>
        </div>
      </div>
    </div>
  );
};
