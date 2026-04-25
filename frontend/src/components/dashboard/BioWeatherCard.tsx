"use client";
import React from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Thermometer, Gauge, Cpu } from "lucide-react";
import { AirQualityTrend } from "./AirQualityTrend";
import type { StationData, WatchData } from "@/hooks/useDashboardData";

export const BioWeatherCard = ({ pm25, pm10, lastUpdated, stressTriggers, weather, sectorName, stationData, watchData }: { 
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
  sectorName: string,
  stationData?: StationData | null,
  watchData?: WatchData | null,
}) => {
  const getStatus = (val: number) => {
    if (val <= 10) return { label: "OPTIMAL", color: "#00A36C", bg: "bg-[#00A36C]/10", text: "text-[#00A36C]" };
    if (val <= 25) return { label: "MODERATE", color: "#E9C46A", bg: "bg-[#E9C46A]/10", text: "text-[#E9C46A]" };
    return { label: "HIGH RISK", color: "#E07A5F", bg: "bg-[#E07A5F]/10", text: "text-[#E07A5F]" };
  };

  const status = getStatus(pm25);
  const displayName = stationData?.active?.displayName || sectorName;

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 shadow-sm rounded-3xl p-4 lg:p-5 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 flex-shrink-0">
        <div className="min-w-0 flex-1 mr-3">
          <h3 className="text-[#562C2C] font-bold text-base flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#00A36C] flex-shrink-0" />
            <span className="truncate">Bio-Weather</span>
          </h3>
          <p className="text-[#562C2C]/70 text-[11px] font-medium mt-0.5 truncate">
            {displayName} • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
          </p>
        </div>
        <div className={`${status.bg} ${status.text} px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border border-current/10 flex-shrink-0 whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {status.label}
        </div>
      </div>

      {/* Main Content: Gauge + Metrics */}
      <div className="flex items-center gap-4 lg:gap-5 flex-1 min-h-0">
        {/* Gauge — fixed size, never overlaps */}
        <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/40 rounded-full border border-[#562C2C]/5" />
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform p-1.5" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#562C2C" strokeOpacity="0.05" strokeWidth="8" fill="none" />
            <motion.circle 
              cx="50" cy="50" r="42" 
              stroke={status.color}
              strokeWidth="8" 
              strokeLinecap="round"
              fill="none" 
              strokeDasharray="264"
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 - (264 * Math.min(pm25, 100)) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="relative flex flex-col items-center z-10">
            <span className="text-2xl lg:text-3xl font-bold text-[#562C2C] tracking-tighter leading-none">{typeof pm25 === 'number' ? Number(pm25.toFixed(1)) : "--"}</span>
            <span className="text-[8px] lg:text-[9px] font-bold text-[#562C2C]/50 uppercase mt-0.5">PM2.5</span>
          </div>
        </div>
        
        {/* Metrics Grid — fills remaining space */}
        <div className="flex-1 grid grid-cols-2 gap-1.5 lg:gap-2 min-w-0">
          {/* PM10 */}
          <div className="bg-white/60 p-2 rounded-xl border border-[#562C2C]/5 flex flex-col items-center justify-center min-w-0">
            <div className="flex items-center gap-1 text-[#562C2C]/60 mb-0.5">
              <Gauge className="w-3 h-3 flex-shrink-0" />
              <span className="text-[10px] font-bold truncate">PM10</span>
            </div>
            <span className="text-lg font-bold text-[#562C2C]">{typeof pm10 === 'number' ? Number(pm10.toFixed(1)) : "--"}</span>
          </div>

          {/* Temperature */}
          <div className="bg-white/60 p-2 rounded-xl border border-[#562C2C]/5 flex flex-col items-center justify-center min-w-0">
            <div className="flex items-center gap-1 text-[#562C2C]/60 mb-0.5">
              <Thermometer className="w-3 h-3 flex-shrink-0" />
              <span className="text-[10px] font-bold truncate">Temp</span>
            </div>
            <span className="text-lg font-bold text-[#562C2C]">{typeof weather?.temperature === 'number' ? Number(weather.temperature.toFixed(1)) : "--"}°</span>
          </div>

          {/* Wind */}
          <div className="bg-white/60 p-2 rounded-xl border border-[#562C2C]/5 flex flex-col items-center justify-center min-w-0">
            <div className="flex items-center gap-1 text-[#562C2C]/60 mb-0.5">
              <Wind className="w-3 h-3 flex-shrink-0" />
              <span className="text-[10px] font-bold truncate">Wind</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-[#562C2C]">{typeof weather?.windSpeed === 'number' ? Number(weather.windSpeed.toFixed(1)) : "--"}</span>
              <span className="text-[8px] font-medium text-[#562C2C]/50">km/h</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white/60 p-2 rounded-xl border border-[#562C2C]/5 flex flex-col items-center justify-center min-w-0">
            <div className="flex items-center gap-1 text-[#562C2C]/60 mb-0.5">
              <Droplets className="w-3 h-3 flex-shrink-0" />
              <span className="text-[10px] font-bold truncate">Hum</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-[#562C2C]">{typeof weather?.humidity === 'number' ? Math.round(weather.humidity) : "--"}</span>
              <span className="text-[8px] font-medium text-[#562C2C]/50">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Sensors (HectorWatch Board) */}
      {watchData && (
        <div className="mt-2 flex items-center gap-2 text-[9px] text-[#562C2C]/50 font-medium overflow-hidden flex-shrink-0">
          <Cpu className="w-3 h-3 text-[#562C2C]/30 flex-shrink-0" />
          <span className="truncate">Indoor: {watchData.ambientTemp}°C · {watchData.ambientHumidity}% RH · {watchData.ambientPressure} hPa · {Math.round(watchData.ambientLight)} lux</span>
        </div>
      )}

      {/* 24h Trend */}
      <div className="mt-2 pt-2 border-t border-[#562C2C]/5 flex-shrink-0">
        {stationData?.history24h && stationData.history24h.length > 0 ? (
          <AirQualityTrend history={stationData.history24h} currentPm25={pm25} />
        ) : (
          <div className="flex justify-between items-center">
            {(weather?.forecast || []).slice(0, 4).map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-bold text-[#562C2C]/40 uppercase">{i === 0 ? 'Now' : f.time}</span>
                <span className="text-sm font-bold text-[#562C2C]">{f.temp}°</span>
              </div>
            ))}
            {(!weather?.forecast || weather.forecast.length === 0) && (
              <div className="w-full text-center text-xs text-[#562C2C]/40">Forecast unavailable</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
