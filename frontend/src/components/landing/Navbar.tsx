"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF3DD]/80 backdrop-blur-md border-b border-[#562C2C]/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#00A36C] rounded-xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="text-2xl font-bold text-[#2A2A2A] tracking-tight">
            Enviro<span className="text-[#00A36C]">Sense</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {!loading && (
            isAuthenticated ? (
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#2A2A2A] text-white rounded-full font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Enter Sentinel <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link 
                href="/auth"
                className="px-6 py-2.5 bg-[#E07A5F] text-white rounded-full font-medium hover:bg-[#D06A4F] transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 active:scale-95"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
