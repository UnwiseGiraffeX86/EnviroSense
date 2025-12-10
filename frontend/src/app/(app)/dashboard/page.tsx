"use client";

import React from "react";
import { BioWeatherCard } from "@/components/dashboard/BioWeatherCard";
import { NeuroRadar } from "@/components/dashboard/NeuroRadar";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { ClinicalCalendar } from "@/components/dashboard/ClinicalCalendar";
import { DailyInsights } from "@/components/dashboard/DailyInsights";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { profile, airQuality, appointments, weather, loading } = useDashboardData();

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
    <div className="h-screen p-6 bg-[#FAF3DD] flex flex-col relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#562C2C 0.5px, transparent 0.5px)', 
             backgroundSize: '24px 24px' 
           }} 
      />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00A36C]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E07A5F]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-end relative z-10 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-[#562C2C] tracking-tight">Sentinel Command</h1>
          <p className="text-[#562C2C]/60 font-medium mt-1 text-sm">Real-time environmental & biometric monitoring</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-1.5 bg-[#00A36C]/10 text-[#00A36C] rounded-full text-xs font-bold border border-[#00A36C]/20 shadow-sm backdrop-blur-sm">
            System Optimal
          </div>
          <div className="px-4 py-1.5 bg-[#562C2C]/5 text-[#562C2C] rounded-full text-xs font-bold border border-[#562C2C]/10 shadow-sm backdrop-blur-sm">
            v2.4.0
          </div>
        </div>
      </div>

      {/* Main Grid Layout - The "Tetris" Grid */}
      <div className="grid grid-cols-12 grid-rows-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4 flex-1 min-h-0 relative z-10">
        {/* Top Row - 35% Height */}
        <div className="col-span-12 lg:col-span-8 h-full">
          <BioWeatherCard 
            pm25={airQuality?.pm25 || 0} 
            pm10={airQuality?.pm10 || 0}
            lastUpdated={airQuality?.last_updated || ""}
            stressTriggers={profile?.stress_triggers || []} 
            weather={weather}
            sectorName={profile?.sector || "Unknown"}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 h-full">
          <NeuroRadar 
            focusIndex={profile?.focus_index || 10} 
            pm25={airQuality?.pm25 || 0} 
          />
        </div>

        {/* Bottom Row - Remaining Height */}
        <div className="col-span-12 lg:col-span-4 h-full min-h-0">
          <AIChatWidget />
        </div>
        <div className="col-span-12 lg:col-span-4 h-full min-h-0">
          <ClinicalCalendar appointments={appointments} />
        </div>
        <div className="col-span-12 lg:col-span-4 h-full min-h-0">
          <DailyInsights 
            pm25={airQuality?.pm25 || 0} 
            focusIndex={profile?.focus_index || 5} 
          />
        </div>
      </div>
    </div>
  );
}
