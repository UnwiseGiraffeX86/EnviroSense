"use client";
import React from "react";
import { Maximize2, Navigation, Cpu } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { StationData, WatchData } from "@/hooks/useDashboardData";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#E5E0D0] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#00A36C] border-t-transparent rounded-full animate-spin" />
    </div>
  )
});

export const LiveSectorMap = ({ sector, pm25, weather, stationData, watchData }: { 
  sector: string, 
  pm25: number, 
  weather?: any,
  stationData?: StationData | null,
  watchData?: WatchData | null,
}) => {
  const displayName = stationData?.active?.displayName || sector;

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden rounded-3xl group bg-[#E5E0D0] border border-[#562C2C]/20 shadow-sm">
      {/* Real Map Component */}
      <div className="absolute inset-0 z-0">
        <Map weather={weather} />
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-[#562C2C]/20 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#00A36C] fill-current" />
            <span className="text-sm font-bold text-[#562C2C]">{displayName} • Live</span>
          </div>
        </div>
        
        <Link href="/map" className="pointer-events-auto">
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-xl hover:bg-white transition-all shadow-sm border border-[#562C2C]/20 group-hover:scale-105 active:scale-95">
            <Maximize2 className="w-5 h-5 text-[#562C2C]" />
          </button>
        </Link>
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
         <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-[#562C2C]/20 shadow-sm pointer-events-auto">
           <div className="flex justify-between items-center text-sm">
             <span className="text-[#562C2C]/60">Air Quality Index</span>
             <span className="font-bold text-[#00A36C]">{pm25 <= 10 ? "Good" : pm25 <= 25 ? "Moderate" : "High Risk"} ({typeof pm25 === 'number' ? Number(pm25.toFixed(1)) : "--"})</span>
           </div>
           <div className="w-full h-1.5 bg-[#562C2C]/10 rounded-full mt-3 overflow-hidden">
             <div className="h-full bg-[#00A36C] rounded-full transition-all duration-700" style={{ width: `${Math.min(pm25, 100)}%` }} />
           </div>
           {/* Ambient data from HectorWatch */}
           {watchData && (
             <div className="mt-2 pt-2 border-t border-[#562C2C]/5 flex items-center gap-2 text-[10px] text-[#562C2C]/50 font-medium">
               <Cpu className="w-3 h-3 text-[#562C2C]/30 flex-shrink-0" />
               <span>Indoor: {watchData.ambientTemp}°C · {watchData.ambientHumidity}% · {watchData.ambientPressure} hPa</span>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};
