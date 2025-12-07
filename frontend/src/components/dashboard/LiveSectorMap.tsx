"use client";
import React from "react";
import { MapPin, Maximize2, Navigation } from "lucide-react";
import Link from "next/link";

export const LiveSectorMap = ({ sector, pm25 }: { sector: string, pm25: number }) => {
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden rounded-3xl group bg-[#E5E0D0]">
      {/* Mock Map Background Pattern */}
      <div className="absolute inset-0 opacity-40" 
           style={{ 
             backgroundImage: 'radial-gradient(#562C2C 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} 
      />
      
      {/* Mock Map Features (Roads/Parks) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <path d="M0,50 Q100,150 200,50 T400,100" stroke="#562C2C" strokeWidth="2" fill="none" />
        <path d="M50,0 Q150,100 50,200" stroke="#562C2C" strokeWidth="2" fill="none" />
        <circle cx="300" cy="150" r="40" fill="#00A36C" fillOpacity="0.2" />
      </svg>

      {/* Sector Overlay (Polygon) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border-2 border-[#00A36C]/30 rounded-full flex items-center justify-center bg-[#00A36C]/5">
           {/* User Location Marker */}
           <div className="relative">
             <div className="w-4 h-4 bg-[#00A36C] rounded-full shadow-lg shadow-[#00A36C]/40 z-10 relative border-2 border-white" />
             <div className="absolute inset-0 bg-[#00A36C] rounded-full animate-ping opacity-75" />
           </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-[#562C2C]/5">
          <div className="flex items-center gap-2">
            <Navigation className="w-3 h-3 text-[#00A36C] fill-current" />
            <span className="text-xs font-bold text-[#562C2C]">{sector || "Unknown Sector"} • Live</span>
          </div>
        </div>
        
        <Link href="/map">
          <button className="p-2 bg-white/90 backdrop-blur-md rounded-xl hover:bg-white transition-all shadow-sm border border-[#562C2C]/5 group-hover:scale-105 active:scale-95">
            <Maximize2 className="w-4 h-4 text-[#562C2C]" />
          </button>
        </Link>
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-4 left-4 right-4">
         <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-[#562C2C]/5 shadow-sm">
           <div className="flex justify-between items-center text-xs">
             <span className="text-[#562C2C]/60">Air Quality Index</span>
             <span className="font-bold text-[#00A36C]">{pm25 <= 10 ? "Good" : pm25 <= 25 ? "Moderate" : "High Risk"} ({pm25})</span>
           </div>
           <div className="w-full h-1 bg-[#562C2C]/10 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-[#00A36C] rounded-full" style={{ width: `${Math.min(pm25, 100)}%` }} />
           </div>
         </div>
      </div>
    </div>
  );
};
