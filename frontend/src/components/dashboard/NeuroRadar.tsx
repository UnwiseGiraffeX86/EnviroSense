"use client";
import React from "react";
import { BrainCircuit } from "lucide-react";

export const NeuroRadar = () => {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-[#562C2C]" />
        <h3 className="text-[#562C2C] font-medium">Brain Clarity Index</h3>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative">
        {/* Mock Radar Chart Visual */}
        <div className="w-40 h-40 border border-[#562C2C]/10 rounded-full relative flex items-center justify-center">
          <div className="w-24 h-24 border border-[#562C2C]/10 rounded-full absolute" />
          <div className="w-8 h-8 border border-[#562C2C]/10 rounded-full absolute" />
          
          {/* Mock Data Shape */}
          <svg className="absolute w-full h-full overflow-visible">
            <polygon points="100,20 140,100 80,140 20,80" fill="#E07A5F" fillOpacity="0.2" stroke="#E07A5F" strokeWidth="2" />
            <polygon points="100,10 150,100 100,150 10,100" fill="#562C2C" fillOpacity="0.05" stroke="#562C2C" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
        
        {/* Labels */}
        <span className="absolute top-0 text-[10px] font-bold text-[#562C2C]/60">FOCUS</span>
        <span className="absolute bottom-0 text-[10px] font-bold text-[#562C2C]/60">SLEEP</span>
        <span className="absolute left-0 text-[10px] font-bold text-[#562C2C]/60">STRESS</span>
        <span className="absolute right-0 text-[10px] font-bold text-[#562C2C]/60">ENERGY</span>
      </div>

      <div className="mt-4 bg-[#E07A5F]/10 p-3 rounded-xl text-xs text-[#562C2C]">
        <span className="font-bold text-[#E07A5F]">Insight:</span> High CO2 levels detected. Predicted Focus Drop: -15%.
      </div>
    </div>
  );
};
