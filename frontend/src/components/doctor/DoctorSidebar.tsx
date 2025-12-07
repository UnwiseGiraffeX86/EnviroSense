"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  LayoutTemplate, 
  Users, 
  BellRing, 
  Settings,
  LogOut
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/doctor", icon: LayoutTemplate },
  { name: "Patient Directory", href: "/doctor/patients", icon: Users },
  { name: "Triage Alerts", href: "/doctor/triage", icon: BellRing, alert: true },
  { name: "Settings", href: "/doctor/settings", icon: Settings },
];

export default function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#023E8A] text-white flex flex-col shadow-xl z-50 hidden md:flex font-sans">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">EnviroSense <span className="text-[#48CAE4] font-light">MD</span></h1>
        <p className="text-xs text-blue-200 mt-1">Clinical Command</p>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 transition-all duration-200
                ${isActive 
                  ? "bg-white/10 text-white border-l-4 border-[#0077B6]" 
                  : "text-blue-100 hover:bg-white/5 border-l-4 border-transparent"
                }
              `}
            >
              <div className="relative">
                <Icon size={20} />
                {item.alert && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
