"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutTemplate, 
  Users, 
  BellRing, 
  Settings,
  LogOut
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutTemplate },
  { name: "Patients", href: "/doctor/patients", icon: Users },
  { name: "Triage", href: "/doctor/triage", icon: BellRing, alert: true },
  { name: "Settings", href: "/doctor/settings", icon: Settings },
];

export default function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#023E8A] text-white flex flex-col shadow-xl z-50 hidden md:flex">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">BESTEM <span className="text-[#0077B6] font-light">MD</span></h1>
        <p className="text-xs text-blue-200 mt-1">Clinical Command</p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? "bg-[#0077B6] text-white shadow-md" 
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <div className="relative">
                <Icon size={20} />
                {item.alert && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#023E8A]" />
                )}
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
