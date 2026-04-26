"use client";

import React, { useEffect } from "react";
import { BioWeatherCard } from "@/components/dashboard/BioWeatherCard";
import { WatchVitalsCard } from "@/components/dashboard/WatchVitalsCard";
import { CompoundRiskCard } from "@/components/dashboard/CompoundRiskCard";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { LiveSectorMap } from "@/components/dashboard/LiveSectorMap";
import { TabbedInsights } from "@/components/dashboard/TabbedInsights";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { profile, airQuality, appointments, weather, watchData, stationData, loading } = useDashboardData();

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
    <div className="min-h-screen w-full bg-[#FAF3DD]">
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

      <div className="p-4 lg:p-5 w-full relative z-10">
        {/* Header */}
        <div className="mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#562C2C] tracking-tight">Sentinel Command</h1>
            <p className="text-[#562C2C]/60 font-medium mt-0.5 text-xs">Real-time environmental & biometric monitoring</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <div className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-bold border border-brand-orange/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              DEMO
            </div>
            <div className="hidden sm:block px-2.5 py-1 bg-[#00A36C]/10 text-[#00A36C] rounded-full text-[10px] font-bold border border-[#00A36C]/20">
              System Optimal
            </div>
            <div className="hidden sm:block px-2.5 py-1 bg-[#562C2C]/5 text-[#562C2C] rounded-full text-[10px] font-bold border border-[#562C2C]/10">
              v3.0.0
            </div>
          </div>
        </div>

        {/* ── Row 1: Environment + Watch + Map ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mb-3 lg:mb-4">
          {/* Bio-Weather */}
          <div className="h-[360px] lg:h-[340px]">
            <BioWeatherCard 
              pm25={airQuality?.pm25 || 0} 
              pm10={airQuality?.pm10 || 0}
              lastUpdated={airQuality?.last_updated || ""}
              stressTriggers={profile?.stress_triggers || []} 
              weather={weather}
              sectorName={profile?.sector || "Unknown"}
              stationData={stationData}
              watchData={watchData}
            />
          </div>

          {/* Watch Vitals */}
          <div className="h-[360px] lg:h-[340px]">
            {watchData ? (
              <WatchVitalsCard watchData={watchData} />
            ) : (
              <div className="bg-white/60 backdrop-blur-xl border border-[#562C2C]/20 rounded-3xl p-6 h-full flex items-center justify-center">
                <p className="text-[#562C2C]/40 text-sm">Connecting watch...</p>
              </div>
            )}
          </div>

          {/* Live Map */}
          <div className="h-[300px] lg:h-[340px]">
            <LiveSectorMap 
              sector={profile?.sector || "Sector 1"} 
              pm25={airQuality?.pm25 || 0} 
              weather={weather}
              stationData={stationData}
              watchData={watchData}
            />
          </div>
        </div>

        {/* ── Row 2: Chat + Risk + Insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          {/* AI Chat */}
          <div className="h-[380px] lg:h-[320px]">
            <AIChatWidget 
              watchData={watchData}
              stationData={stationData}
              weather={weather}
              pm25={airQuality?.pm25 || 0}
              pm10={airQuality?.pm10 || 0}
            />
          </div>

          {/* Compound Risk */}
          <div className="h-[320px] lg:h-[320px]">
            <CompoundRiskCard
              pm25={airQuality?.pm25 || 0}
              watchData={watchData}
              pollutionSensitivity={profile?.pollution_sensitivity || 5}
              respiratoryConditions={profile?.respiratory_conditions || []}
            />
          </div>

          {/* Tabbed Insights */}
          <div className="h-[380px] lg:h-[320px]">
            <TabbedInsights 
              pm25={airQuality?.pm25 || 0}
              focusIndex={profile?.focus_index || 10}
              appointments={appointments}
              watchData={watchData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
