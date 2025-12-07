"use client";

import React from "react";
import { BioWeatherCard } from "@/components/dashboard/BioWeatherCard";
import { NeuroRadar } from "@/components/dashboard/NeuroRadar";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { ClinicalCalendar } from "@/components/dashboard/ClinicalCalendar";
import { LiveSectorMap } from "@/components/dashboard/LiveSectorMap";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 bg-[#FAF3DD] flex flex-col pb-10">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#562C2C]">Sentinel Command</h1>
          <p className="text-[#562C2C]/60">Real-time environmental & biometric monitoring</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-[#00A36C]/10 text-[#00A36C] rounded-full text-sm font-medium border border-[#00A36C]/20">
            System Optimal
          </div>
          <div className="px-3 py-1 bg-[#562C2C]/5 text-[#562C2C] rounded-full text-sm font-medium border border-[#562C2C]/10">
            v2.4.0
          </div>
        </div>
      </div>

      {/* Main Grid Layout - The "Tetris" Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Top Row */}
        <div className="col-span-12 lg:col-span-8 h-full min-h-[300px]">
          <BioWeatherCard />
        </div>
        <div className="col-span-12 lg:col-span-4 h-full min-h-[300px]">
          <NeuroRadar />
        </div>

        {/* Bottom Row */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-full min-h-[300px]">
          <AIChatWidget />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-full min-h-[300px]">
          <ClinicalCalendar />
        </div>
        <div className="col-span-12 lg:col-span-4 h-full min-h-[300px]">
          <LiveSectorMap />
        </div>
      </div>
    </div>
  );
}
