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
  const pmDisplay = typeof pm25 === 'number' ? Number(pm25.toFixed(1)) : "--";

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 shadow-sm rounded-3xl p-4 h-full flex flex-col overflow-hidden">
      {/* Header row */}
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <div className="min-w-0 mr-2">
          <h3 className="text-[#562C2C] font-bold text-sm flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-[#00A36C] flex-shrink-0" />
            Bio-Weather
          </h3>
          <p className="text-[#562C2C]/60 text-[10px] font-medium truncate">{displayName}</p>
        </div>
        <div className={`${status.bg} ${status.text} px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-1 border border-current/10 flex-shrink-0`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {status.label}
        </div>
      </div>

      {/* PM2.5 hero value + gauge bar */}
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-[#562C2C] tabular-nums leading-none">{pmDisplay}</span>
          <span className="text-xs font-bold text-[#562C2C]/40">µg/m³</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-bold text-[#562C2C]/40 uppercase mb-1">PM2.5 Level</div>
          <div className="w-full h-2 bg-[#562C2C]/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: status.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pm25, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* 4-metric grid */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 flex-shrink-0">
        <div className="bg-white/60 rounded-xl p-2 border border-[#562C2C]/5 text-center">
          <div className="text-[9px] font-bold text-[#562C2C]/40 uppercase mb-0.5">PM10</div>
          <span className="text-base font-bold text-[#562C2C]">{typeof pm10 === 'number' ? Number(pm10.toFixed(1)) : "--"}</span>
        </div>
        <div className="bg-white/60 rounded-xl p-2 border border-[#562C2C]/5 text-center">
          <div className="text-[9px] font-bold text-[#562C2C]/40 uppercase mb-0.5">Temp</div>
          <span className="text-base font-bold text-[#562C2C]">{typeof weather?.temperature === 'number' ? Math.round(weather.temperature) : "--"}°</span>
        </div>
        <div className="bg-white/60 rounded-xl p-2 border border-[#562C2C]/5 text-center">
          <div className="text-[9px] font-bold text-[#562C2C]/40 uppercase mb-0.5">Wind</div>
          <span className="text-base font-bold text-[#562C2C]">{typeof weather?.windSpeed === 'number' ? Number(weather.windSpeed.toFixed(1)) : "--"}</span>
        </div>
        <div className="bg-white/60 rounded-xl p-2 border border-[#562C2C]/5 text-center">
          <div className="text-[9px] font-bold text-[#562C2C]/40 uppercase mb-0.5">Hum</div>
          <span className="text-base font-bold text-[#562C2C]">{typeof weather?.humidity === 'number' ? Math.round(weather.humidity) : "--"}%</span>
        </div>
      </div>

      {/* Ambient sensors row */}
      {watchData && (
        <div className="flex items-center gap-1.5 text-[9px] text-[#562C2C]/40 font-medium mb-2 flex-shrink-0 overflow-hidden">
          <Cpu className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{watchData.ambientTemp}°C · {watchData.ambientHumidity}% RH · {watchData.ambientPressure} hPa</span>
        </div>
      )}

      {/* 24h Trend — fills remaining space */}
      <div className="flex-1 min-h-0 pt-2 border-t border-[#562C2C]/5">
        {stationData?.history24h && stationData.history24h.length > 0 ? (
          <AirQualityTrend history={stationData.history24h} currentPm25={pm25} />
        ) : (
          <div className="flex justify-between items-center h-full">
            {(weather?.forecast || []).slice(0, 4).map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-bold text-[#562C2C]/40">{i === 0 ? 'Now' : f.time}</span>
                <span className="text-sm font-bold text-[#562C2C]">{f.temp}°</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
