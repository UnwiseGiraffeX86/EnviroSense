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

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 shadow-sm rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-shrink-0">
        <div>
          <h3 className="text-[#562C2C] font-bold text-2xl flex items-center gap-2">
            <Wind className="w-6 h-6 text-[#00A36C]" />
            Bio-Weather
          </h3>
          <p className="text-[#562C2C]/70 text-sm font-medium mt-1">
            {sectorName} • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
          </p>
        </div>
        <div className={`${status.bg} ${status.text} px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-current/10`}>
          <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
          {status.label}
        </div>
      </div>

      {/* Main Content: Split Layout */}
      <div className="flex items-center gap-8 flex-1 min-h-0">
        {/* Large Gauge Section */}
        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center bg-white/40 rounded-full border border-[#562C2C]/5">
           <svg className="w-full h-full -rotate-90 transform p-2">
              <circle cx="50%" cy="50%" r="45%" stroke="#562C2C" strokeOpacity="0.05" strokeWidth="12" fill="none" />
              <motion.circle 
                cx="50%" cy="50%" r="45%" 
                stroke={status.color}
                strokeWidth="12" 
                strokeLinecap="round"
                fill="none" 
                strokeDasharray="283" // 2 * pi * 45
                strokeDashoffset={283 - (283 * Math.min(pm25, 100)) / 100}
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * Math.min(pm25, 100)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
           </svg>
           <div className="absolute flex flex-col items-center">
             <span className="text-5xl font-bold text-[#562C2C] tracking-tighter">{typeof pm25 === 'number' ? Number(pm25.toFixed(1)) : "--"}</span>
             <span className="text-xs font-bold text-[#562C2C]/50 uppercase mt-1">PM2.5 Index</span>
           </div>
        </div>
        
        {/* Metrics Grid - Compact & Readable */}
        <div className="flex-1 grid grid-cols-2 gap-3 h-full">
           {/* PM10 */}
           <div className="bg-white/60 p-3 rounded-2xl border border-[#562C2C]/5 flex flex-col justify-center items-center">
             <div className="flex items-center gap-2 text-[#562C2C]/60 mb-1">
               <Gauge className="w-5 h-5" />
               <span className="text-sm font-bold">PM10</span>
             </div>
             <span className="text-3xl font-bold text-[#562C2C]">{typeof pm10 === 'number' ? Number(pm10.toFixed(2)) : "--"}</span>
           </div>

           {/* Temperature */}
           <div className="bg-white/60 p-3 rounded-2xl border border-[#562C2C]/5 flex flex-col justify-center items-center">
             <div className="flex items-center gap-2 text-[#562C2C]/60 mb-1">
               <Thermometer className="w-5 h-5" />
               <span className="text-sm font-bold">Temp</span>
             </div>
             <span className="text-3xl font-bold text-[#562C2C]">{typeof weather?.temperature === 'number' ? Number(weather.temperature.toFixed(2)) : "--"}°</span>
           </div>

           {/* Wind */}
           <div className="bg-white/60 p-3 rounded-2xl border border-[#562C2C]/5 flex flex-col justify-center items-center">
             <div className="flex items-center gap-2 text-[#562C2C]/60 mb-1">
               <Wind className="w-5 h-5" />
               <span className="text-sm font-bold">Wind</span>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#562C2C]">{typeof weather?.windSpeed === 'number' ? Number(weather.windSpeed.toFixed(2)) : "--"}</span>
                <span className="text-sm font-medium text-[#562C2C]/50">km/h</span>
             </div>
           </div>

           {/* Humidity */}
           <div className="bg-white/60 p-3 rounded-2xl border border-[#562C2C]/5 flex flex-col justify-center items-center">
             <div className="flex items-center gap-2 text-[#562C2C]/60 mb-1">
               <Droplets className="w-5 h-5" />
               <span className="text-sm font-bold">Hum</span>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#562C2C]">{typeof weather?.humidity === 'number' ? Number(weather.humidity.toFixed(2)) : "--"}</span>
                <span className="text-sm font-medium text-[#562C2C]/50">%</span>
             </div>
           </div>
        </div>
      </div>

      {/* Forecast Footer */}
      <div className="mt-6 pt-4 border-t border-[#562C2C]/5 flex justify-between items-center">
        {(weather?.forecast || []).slice(0, 4).map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-[#562C2C]/40 uppercase">{i === 0 ? 'Now' : f.time}</span>
            <span className="text-lg font-bold text-[#562C2C]">{f.temp}°</span>
          </div>
        ))}
        {(!weather?.forecast || weather.forecast.length === 0) && (
            <div className="w-full text-center text-xs text-[#562C2C]/40">Forecast unavailable</div>
        )}
      </div>
    </div>
  );
};
