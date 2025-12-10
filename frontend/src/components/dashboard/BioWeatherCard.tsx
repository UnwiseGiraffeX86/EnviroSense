"use client";
import React from "react";
import { motion } from "framer-motion";
import { Wind, AlertTriangle, Droplets, Thermometer, Gauge } from "lucide-react";

export const BioWeatherCard = ({ pm25, pm10, lastUpdated, stressTriggers, weather, sectorName }: { 
  pm25: number, 
  pm10: number, 
  lastUpdated: string, 
  stressTriggers: string[],
  weather: { 
    temperature: number; 
    humidity: number; 
    windSpeed: number; 
    condition: string;
    forecast: { time: string; temp: number; condition: string }[]
  } | null,
  sectorName: string
}) => {
  const getStatus = (val: number) => {
    if (val <= 10) return { label: "OPTIMAL", color: "#00A36C", bg: "bg-[#00A36C]/10", text: "text-[#00A36C]" };
    if (val <= 25) return { label: "MODERATE", color: "#E9C46A", bg: "bg-[#E9C46A]/10", text: "text-[#E9C46A]" };
    return { label: "HIGH RISK", color: "#E07A5F", bg: "bg-[#E07A5F]/10", text: "text-[#E07A5F]" };
  };

  const status = getStatus(pm25);
  const showTriggerWarning = pm25 > 30 && stressTriggers?.includes("Smog");

  return (
    <div className="bg-[#FAF3DD]/90 backdrop-blur-xl border border-[#562C2C]/10 rounded-3xl p-5 h-full flex flex-col relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#00A36C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-start relative z-10 flex-shrink-0">
        <div>
          <h3 className="text-[#562C2C] font-bold text-lg flex items-center gap-2">
            <Wind className="w-5 h-5 text-[#00A36C]" />
            Bio-Weather Station
          </h3>
          <p className="text-[#562C2C]/60 text-xs mt-1 font-medium">
            {sectorName || "Unknown Sector"} • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
          </p>
        </div>
        <div className={`${status.bg} ${status.text} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-current/10`}>
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: status.color }}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2`} style={{ backgroundColor: status.color }}></span>
          </div>
          {status.label}
        </div>
      </div>

      {showTriggerWarning && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#E07A5F]/10 border border-[#E07A5F]/20 text-[#E07A5F] px-3 py-2 rounded-xl flex items-center gap-2 text-xs mt-2 font-medium flex-shrink-0"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>High Smog Levels Detected</span>
        </motion.div>
      )}

      <div className="flex items-center gap-4 my-2 flex-1 relative z-10 min-h-0">
        {/* Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
           <svg className="w-full h-full -rotate-90 transform">
              <circle cx="56" cy="56" r="46" stroke="#562C2C" strokeOpacity="0.05" strokeWidth="10" fill="none" />
              <motion.circle 
                cx="56" cy="56" r="46" 
                stroke={status.color}
                strokeWidth="10" 
                strokeLinecap="round"
                fill="none" 
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * Math.min(pm25, 100)) / 100}
                initial={{ strokeDashoffset: 289 }}
                animate={{ strokeDashoffset: 289 - (289 * Math.min(pm25, 100)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
           </svg>
           <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-bold text-[#562C2C] tracking-tighter">{pm25}</span>
             <span className="text-[10px] font-semibold text-[#562C2C]/50 uppercase tracking-wider">PM2.5</span>
           </div>
        </div>
        
        <div className="flex-1 space-y-2">
           <div className="grid grid-cols-2 gap-2">
             <div className="bg-white/50 p-2.5 rounded-xl border border-[#562C2C]/5">
               <div className="flex items-center gap-1.5 text-[#562C2C]/60 text-[10px] mb-0.5">
                 <Gauge className="w-3 h-3" />
                 PM10
               </div>
               <div className="font-bold text-[#562C2C] text-base">{pm10}</div>
             </div>
             <div className="bg-white/50 p-2.5 rounded-xl border border-[#562C2C]/5">
               <div className="flex items-center gap-1.5 text-[#562C2C]/60 text-[10px] mb-0.5">
                 <Thermometer className="w-3 h-3" />
                 Temp
               </div>
               <div className="font-bold text-[#562C2C] text-base">{weather ? `${weather.temperature}°` : '--'}</div>
             </div>
             <div className="bg-white/50 p-2.5 rounded-xl border border-[#562C2C]/5">
               <div className="flex items-center gap-1.5 text-[#562C2C]/60 text-[10px] mb-0.5">
                 <Wind className="w-3 h-3" />
                 Wind
               </div>
               <div className="font-bold text-[#562C2C] text-base">{weather ? `${weather.windSpeed}` : '--'} <span className="text-[10px] font-normal">km/h</span></div>
             </div>
             <div className="bg-white/50 p-2.5 rounded-xl border border-[#562C2C]/5">
               <div className="flex items-center gap-1.5 text-[#562C2C]/60 text-[10px] mb-0.5">
                 <Droplets className="w-3 h-3" />
                 Hum
               </div>
               <div className="font-bold text-[#562C2C] text-base">{weather ? `${weather.humidity}%` : '--'}</div>
             </div>
           </div>
        </div>
      </div>

      {/* Forecast Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 pt-2 scrollbar-hide mt-auto flex-shrink-0">
        {weather?.forecast ? weather.forecast.map((item, i) => (
          <div key={item.time} className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-center ${i === 0 ? 'bg-[#562C2C] text-[#FAF3DD]' : 'bg-white/50 text-[#562C2C]/60'}`}>
            <div className="text-[9px] font-bold uppercase mb-0.5">{item.time}</div>
            <div className="text-xs font-bold">{item.temp}°</div>
            <div className="text-[8px] opacity-80">{item.condition}</div>
          </div>
        )) : (
           ["Now", "+1h", "+2h", "+3h", "+4h"].map((time, i) => (
            <div key={time} className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-center ${i === 0 ? 'bg-[#562C2C] text-[#FAF3DD]' : 'bg-white/50 text-[#562C2C]/60'}`}>
              <div className="text-[9px] font-bold uppercase mb-0.5">{time}</div>
              <div className="w-2 h-2 rounded-full mx-auto bg-gray-300 animate-pulse" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
