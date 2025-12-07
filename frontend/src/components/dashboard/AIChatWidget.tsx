"use client";
import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";

export const AIChatWidget = () => {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#00A36C]" />
        <h3 className="text-[#562C2C] font-medium">Consult Sentinel AI</h3>
      </div>

      <div className="flex-1 bg-white/40 rounded-2xl p-4 mb-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none" />
        <div className="space-y-3">
          <div className="bg-white/60 p-3 rounded-tl-xl rounded-tr-xl rounded-br-xl text-sm text-[#562C2C] shadow-sm w-4/5">
            Based on your biometrics, I recommend keeping your inhaler nearby today.
          </div>
          <div className="text-[10px] text-[#562C2C]/40 text-right">Last analysis: 2h ago</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["I feel wheezy", "Check interactions", "Pollution forecast"].map(action => (
            <button key={action} className="whitespace-nowrap px-3 py-1.5 bg-[#562C2C]/5 hover:bg-[#562C2C]/10 rounded-full text-xs font-medium text-[#562C2C] transition-colors">
              {action}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Describe symptoms..." 
            className="w-full bg-white/60 border border-[#562C2C]/10 rounded-xl py-3 px-4 text-sm text-[#562C2C] placeholder:text-[#562C2C]/40 focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#00A36C] text-white rounded-lg hover:bg-[#00A36C]/90 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
