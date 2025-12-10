"use client";

import React from "react";
import MapCaller from "@/components/MapCaller";
import { Navigation } from "lucide-react";

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#562C2C]">Sector Map</h1>
          <p className="text-[#562C2C]/60">Real-time air quality monitoring across sectors</p>
        </div>
        <div className="px-3 py-1 bg-[#00A36C]/10 text-[#00A36C] rounded-full text-sm font-medium border border-[#00A36C]/20 flex items-center gap-2">
          <Navigation size={14} />
          Live View
        </div>
      </div>

      <div className="flex-1 w-full rounded-3xl overflow-hidden border border-[#562C2C]/10 shadow-lg relative z-0">
        <MapCaller />
      </div>
    </div>
  );
}
