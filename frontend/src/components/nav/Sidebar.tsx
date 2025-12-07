"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  NotebookPen, 
  Map as MapIcon, 
  UserCog, 
  Stethoscope,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tracker", href: "/tracker", icon: NotebookPen },
  { name: "Map", href: "/map", icon: MapIcon },
  { name: "Profile", href: "/profile", icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop Sidebar (Icon Rail)
  if (!isMobile) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-20 bg-[#FAF3DD]/80 backdrop-blur-md border-r border-[#562C2C]/10 z-50 flex flex-col items-center py-8">
        {/* Logo Area */}
        <div className="mb-10">
          <div className="w-10 h-10 bg-[#00A36C] rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
            <span className="text-white font-bold text-xl">E</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-4 w-full px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-[#00A36C]/10 text-[#00A36C]" 
                    : "text-[#562C2C]/60 hover:text-[#562C2C] hover:bg-[#562C2C]/5"
                }`}
                title={item.name} // Tooltip for accessibility
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-[#00A36C] rounded-r-full"
                  />
                )}
                <item.icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
              </Link>
            );
          })}
        </nav>

        {/* Emergency Action */}
        <div className="mt-auto">
          <button 
            className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-100 group shadow-sm"
            title="Triage"
          >
            <Stethoscope className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </aside>
    );
  }

  // Mobile Bottom Dock
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FAF3DD]/90 backdrop-blur-xl border-t border-[#562C2C]/10 z-50 pb-safe">
      <div className="flex justify-around items-center h-20 px-2">
        {/* Dashboard */}
        <Link href="/dashboard" className={`flex flex-col items-center p-2 ${pathname === '/dashboard' ? 'text-[#00A36C]' : 'text-[#562C2C]/60'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>

        {/* Map */}
        <Link href="/map" className={`flex flex-col items-center p-2 ${pathname === '/map' ? 'text-[#00A36C]' : 'text-[#562C2C]/60'}`}>
          <MapIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Map</span>
        </Link>

        {/* Central FAB (Tracker) */}
        <div className="relative -top-6">
          <Link href="/tracker">
            <div className="w-16 h-16 bg-[#00A36C] rounded-full shadow-lg shadow-green-200 flex items-center justify-center transform transition-transform active:scale-95 border-4 border-[#FAF3DD]">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </Link>
        </div>

        {/* Profile */}
        <Link href="/profile" className={`flex flex-col items-center p-2 ${pathname === '/profile' ? 'text-[#00A36C]' : 'text-[#562C2C]/60'}`}>
          <UserCog className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </Link>

        {/* Triage (Mobile) */}
        <button className="flex flex-col items-center p-2 text-red-500/80">
          <Stethoscope className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Help</span>
        </button>
      </div>
    </nav>
  );
}
