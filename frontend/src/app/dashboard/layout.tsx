import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF3DD]">
      <Sidebar />
      <main className="md:ml-20 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
