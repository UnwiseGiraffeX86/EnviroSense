"use client";
import React from "react";
import { motion } from "framer-motion";
import { Wind, AlertTriangle } from "lucide-react";

export const BioWeatherCard = ({ pm25, pm10, lastUpdated, stressTriggers, weather }: { 
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
  } | null
}) => {
  const getStatus = (val: number) => {
    if (val <= 10) return { label: "OPTIMAL", color: "bg-[#00A36C]", text: "text-[#00A36C]", bg: "bg-[#00A36C]/10" };
    if (val <= 25) return { label: "MODERATE", color: "bg-[#E9C46A]", text: "text-[#E9C46A]", bg: "bg-[#E9C46A]/10" };
    return { label: "HIGH RISK", color: "bg-[#E76F51]", text: "text-[#E76F51]", bg: "bg-[#E76F51]/10" };
  };

  const status = getStatus(pm25);
  const showTriggerWarning = pm25 > 30 && stressTriggers?.includes("Smog");

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-3xl p-6 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[#562C2C] font-medium text-lg">Bio-Weather Station</h3>
          <p className="text-[#562C2C]/60 text-sm">Sector 1 • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}</p>
        </div>
        <div className={`${status.bg} ${status.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
          <div className={`w-2 h-2 ${status.color} rounded-full animate-pulse`} />
          {status.label}
        </div>
      </div>

      {showTriggerWarning && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded-xl flex items-center gap-2 text-sm mt-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Trigger Warning: High Smog Levels</span>
        </div>
      )}

      <div className="flex items-center gap-8 my-4">
        {/* Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center">
           <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#562C2C" strokeOpacity="0.1" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="64" cy="64" r="56" 
                stroke={status.color.replace("bg-", "")} // Hacky but works for now, ideally use hex
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="351"
                strokeDashoffset={351 - (351 * Math.min(pm25, 100)) / 100}
                initial={{ strokeDashoffset: 351 }}
                animate={{ strokeDashoffset: 351 - (351 * Math.min(pm25, 100)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
           </svg>
           <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-bold text-[#562C2C]">{pm25}</span>
             <span className="text-xs text-[#562C2C]/60">PM2.5</span>
           </div>
        </div>
        
        <div className="flex-1 space-y-3">
           <div className="text-sm text-[#562C2C]/70">
             <div className="flex justify-between items-center mb-1">
               <span>PM10:</span>
               <span className="font-bold">{pm10} µg/m³</span>
             </div>
             <div className="flex justify-between items-center mb-1">
               <span>Temp:</span>
               <span className="font-bold">{weather ? `${weather.temperature}°C` : '--'}</span>
             </div>
             <div className="flex justify-between items-center mb-1">
               <span>Wind:</span>
               <span className="font-bold">{weather ? `${weather.windSpeed} km/h` : '--'}</span>
             </div>
             <div className="flex justify-between items-center mb-1">
               <span>Humidity:</span>
               <span className="font-bold">{weather ? `${weather.humidity}%` : '--'}</span>
             </div>
             <div className="flex justify-between items-center pt-2 border-t border-[#562C2C]/10">
               <span>Condition:</span>
               <span className="font-bold text-[#562C2C]">{weather ? weather.condition : '--'}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Forecast Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weather?.forecast ? weather.forecast.map((item, i) => (
          <div key={item.time} className={`flex-shrink-0 px-3 py-2 rounded-lg text-center ${i === 0 ? 'bg-[#562C2C] text-[#FAF3DD]' : 'bg-white/50 text-[#562C2C]/60'}`}>
            <div className="text-[10px] font-bold uppercase mb-1">{item.time}</div>
            <div className="text-xs font-bold">{item.temp}°</div>
            <div className="text-[9px] opacity-80">{item.condition}</div>
          </div>
        )) : (
           ["Now", "+1h", "+2h", "+3h", "+4h"].map((time, i) => (
            <div key={time} className={`flex-shrink-0 px-3 py-2 rounded-lg text-center ${i === 0 ? 'bg-[#562C2C] text-[#FAF3DD]' : 'bg-white/50 text-[#562C2C]/60'}`}>
              <div className="text-[10px] font-bold uppercase mb-1">{time}</div>
              <div className="w-2 h-2 rounded-full mx-auto bg-gray-300 animate-pulse" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
