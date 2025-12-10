import React from "react";
import Sidebar from "@/components/nav/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF3DD]">
      <Sidebar />
      
      {/* Main Content Area */}
      {/* Desktop: Left margin for sidebar. Mobile: Bottom margin for dock. */}
      <main className="md:ml-20 pb-24 md:pb-0 min-h-screen transition-all duration-300">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
