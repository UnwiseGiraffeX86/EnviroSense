import React from "react";
import AuthWizard from "@/components/auth/AuthWizard";
import Link from "next/link";
import FirefliesBackground from "@/components/ui/FirefliesBackground";

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAF3DD] relative overflow-hidden flex items-center justify-center p-4 text-[#562C2C]">
      {/* Fireflies Background */}
      <FirefliesBackground />

      {/* Main Content Container */}
      <div className="w-full max-w-2xl z-10 relative">
        {/* Header / Logo Area */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-light tracking-wide mb-2">EnviroSense</h1>
          <p className="text-[#562C2C]/60 text-sm uppercase tracking-widest">Precision Neuro-Optimization</p>
        </div>

        <AuthWizard />
        
        {/* Footer Links */}
        <div className="mt-12 text-center text-[#562C2C]/40 text-xs flex justify-center gap-6 uppercase tracking-wider">
          <Link href="/privacy" className="hover:text-[#562C2C] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#562C2C] transition-colors">Terms</Link>
          <Link href="/help" className="hover:text-[#562C2C] transition-colors">Support</Link>
        </div>
      </div>
    </main>
  );
}
