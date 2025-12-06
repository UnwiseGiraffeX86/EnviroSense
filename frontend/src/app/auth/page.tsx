import React from "react";
import AuthWizard from "@/components/auth/AuthWizard";
import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Elements - Organic Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-brand-green/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-brand-brown/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-brand-cream/80 rounded-full blur-[80px]" />
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')] bg-repeat mix-blend-multiply" />

      {/* Logo / Home Link */}
      <Link href="/" className="absolute top-6 left-6 md:top-10 md:left-10 z-50 group">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-green/20 group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="text-xl font-bold text-brand-brown tracking-tight group-hover:text-brand-green transition-colors">
            BESTEM
          </span>
        </div>
      </Link>

      {/* Main Content Container */}
      <div className="w-full max-w-lg z-10 relative">
        <AuthWizard />
        
        {/* Footer Links */}
        <div className="mt-8 text-center text-brand-brown/40 text-xs flex justify-center gap-6">
          <Link href="/privacy" className="hover:text-brand-brown transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-brown transition-colors">Terms of Service</Link>
          <Link href="/help" className="hover:text-brand-brown transition-colors">Help Center</Link>
        </div>
      </div>
    </main>
  );
}
