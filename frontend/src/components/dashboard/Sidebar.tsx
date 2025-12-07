"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  User, 
  LogOut, 
  Home,
  TreeDeciduous
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Map, label: "Map", href: "/map" }, // Assuming /map exists or will exist
    { icon: User, label: "Profile", href: "/profile" }, // Assuming /profile exists
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[#FAF3DD]/80 backdrop-blur-md border-r border-[#562C2C]/10 flex flex-col items-center py-8 z-50 hidden md:flex">
      {/* Logo */}
      <div className="mb-12 p-2 bg-[#00A36C]/10 rounded-xl">
        <TreeDeciduous className="w-6 h-6 text-[#00A36C]" />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-6 w-full px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`p-3 rounded-xl flex justify-center transition-all duration-200 group relative ${
                isActive 
                  ? "bg-[#00A36C]/10 text-[#00A36C]" 
                  : "text-[#562C2C]/60 hover:bg-[#562C2C]/5 hover:text-[#562C2C]"
              }`}
            >
              <Icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-2 py-1 bg-[#562C2C] text-[#FAF3DD] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="p-3 text-[#E07A5F] hover:bg-[#E07A5F]/10 rounded-xl transition-colors mt-auto"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
};
