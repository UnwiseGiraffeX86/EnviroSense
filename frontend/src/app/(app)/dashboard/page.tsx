"use client";

import React, { useEffect } from "react";
import { BioWeatherCard } from "@/components/dashboard/BioWeatherCard";
import { NeuroRadar } from "@/components/dashboard/NeuroRadar";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { LiveSectorMap } from "@/components/dashboard/LiveSectorMap";
import { TabbedInsights } from "@/components/dashboard/TabbedInsights";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { profile, airQuality, appointments, weather, loading } = useDashboardData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF3DD]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#562C2C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#562C2C] font-medium">Syncing Sentinel Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#FAF3DD] flex flex-col overflow-y-auto lg:overflow-hidden">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#562C2C 0.5px, transparent 0.5px)', 
             backgroundSize: '24px 24px' 
           }} 
      />
      
      {/* Ambient Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#00A36C]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#E07A5F]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col p-4 lg:p-6 w-full h-full relative z-10">
        {/* Header Section */}
        <div className="mb-4 lg:mb-4 flex justify-between items-end flex-shrink-0">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#562C2C] tracking-tight">Sentinel Command</h1>
            <p className="text-[#562C2C]/60 font-medium mt-1 text-xs">Real-time environmental & biometric monitoring</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-[#00A36C]/10 text-[#00A36C] rounded-full text-[10px] font-bold border border-[#00A36C]/20 shadow-sm backdrop-blur-sm">
              System Optimal
            </div>
            <div className="px-3 py-1 bg-[#562C2C]/5 text-[#562C2C] rounded-full text-[10px] font-bold border border-[#562C2C]/10 shadow-sm backdrop-blur-sm">
              v2.5.0
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-1 gap-4 min-h-0">
          
          {/* Column 1: Environmental (50% / 50%) */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full min-h-0">
             <div className="h-[350px] lg:h-[50%] w-full min-h-0">
                <BioWeatherCard 
                  pm25={airQuality?.pm25 || 0} 
                  pm10={airQuality?.pm10 || 0}
                  lastUpdated={airQuality?.last_updated || ""}
                  stressTriggers={profile?.stress_triggers || []} 
                  weather={weather}
                  sectorName={profile?.sector || "Unknown"}
                />
             </div>
             <div className="h-[400px] lg:h-[50%] w-full min-h-0">
                <AIChatWidget />
             </div>
          </div>

          {/* Column 2: Neurological (50% / 50%) */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full min-h-0">
             <div className="h-[300px] lg:h-[50%] w-full min-h-0">
                <NeuroRadar 
                  focusIndex={profile?.focus_index || 10} 
                  pm25={airQuality?.pm25 || 0} 
                />
             </div>
             <div className="h-[300px] lg:h-[50%] w-full min-h-0">
                <TabbedInsights 
                  pm25={airQuality?.pm25 || 0}
                  focusIndex={profile?.focus_index || 10}
                  appointments={appointments}
                />
             </div>
          </div>

          {/* Column 3: Geospatial (100%) */}
          <div className="lg:col-span-4 h-[300px] lg:h-full w-full min-h-0">
             <LiveSectorMap 
               sector={profile?.sector || "Sector 1"} 
               pm25={airQuality?.pm25 || 0} 
             />
          </div>

        </div>
      </div>
    </div>
  );
}
