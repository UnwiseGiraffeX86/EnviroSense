"use client";
import React from "react";
import { motion } from "framer-motion";
import { Wind, AlertTriangle } from "lucide-react";

export const BioWeatherCard = () => {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-3xl p-6 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[#562C2C] font-medium text-lg">Bio-Weather Station</h3>
          <p className="text-[#562C2C]/60 text-sm">Sector 1 • Live</p>
        </div>
        <div className="bg-[#00A36C]/10 text-[#00A36C] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <div className="w-2 h-2 bg-[#00A36C] rounded-full animate-pulse" />
          OPTIMAL
        </div>
      </div>

      <div className="flex items-center gap-8 my-4">
        {/* Mock Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center">
           <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#562C2C" strokeOpacity="0.1" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="64" cy="64" r="56" 
                stroke="#00A36C" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="351"
                initial={{ strokeDashoffset: 351 }}
                animate={{ strokeDashoffset: 351 - (351 * 0.25) }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-[#562C2C]">12</span>
              <span className="text-[10px] uppercase text-[#562C2C]/50">PM2.5</span>
            </div>
        </div>
        
        <div className="flex-1 space-y-3">
           <div className="flex items-center gap-2 text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-2 rounded-xl text-sm font-medium">
             <AlertTriangle className="w-4 h-4" />
             <span>Heat Trigger Active</span>
           </div>
           <div className="text-sm text-[#562C2C]/70">
             Wind: 12km/h NE <br/>
             Humidity: 45%
           </div>
        </div>
      </div>

      {/* Forecast Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["Now", "+1h", "+2h", "+3h", "+4h"].map((time, i) => (
          <div key={time} className={`flex-shrink-0 px-3 py-2 rounded-lg text-center ${i === 0 ? 'bg-[#562C2C] text-[#FAF3DD]' : 'bg-white/50 text-[#562C2C]/60'}`}>
            <div className="text-[10px] font-bold uppercase mb-1">{time}</div>
            <div className={`w-2 h-2 rounded-full mx-auto ${i < 3 ? 'bg-[#00A36C]' : 'bg-[#E07A5F]'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
