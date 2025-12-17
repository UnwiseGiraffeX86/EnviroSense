"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Stethoscope, Building2, GripHorizontal } from "lucide-react";

export default function SlideBusiness() {
  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center bg-[#FDFBF7] overflow-hidden font-sans relative">
      
      {/* 1. The Canvas */}
      {/* Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1118270a_1px,transparent_1px),linear-gradient(to_bottom,#1118270a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative w-full max-w-6xl h-[85vh] flex flex-col items-center justify-between py-12 z-10">
        
        {/* 2. The Modules (Revenue Blades) */}
        <div className="flex gap-8 h-[65%] w-full justify-center items-end">
            
            {/* Module 1: Consumer */}
            <div className="relative w-72 h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(6,78,59,0.15)] border border-stone-100 flex flex-col overflow-hidden group hover:-translate-y-2 transition-transform duration-500 ease-out">
                {/* Physical Detail: Handle & LED */}
                <div className="h-12 bg-stone-50 border-b border-stone-100 flex items-center justify-between px-4">
                    <GripHorizontal className="text-stone-300" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-stone-400 tracking-widest">ONLINE</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Smartphone size={32} className="text-emerald-700" />
                    </div>
                    <h3 className="font-serif text-3xl text-stone-800 mb-2">Consumer</h3>
                    <p className="text-xs text-stone-500 leading-relaxed px-2">
                        Direct-to-consumer application for personal environmental monitoring.
                    </p>
                </div>

                {/* Data Block */}
                <div className="bg-stone-100 p-6 border-t border-stone-200">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Subscription Model</div>
                    <div className="font-mono text-2xl font-bold text-emerald-700">€9.99<span className="text-sm text-stone-500 font-normal">/mo</span></div>
                </div>
            </div>

            {/* Module 2: Clinical */}
            <div className="relative w-72 h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(6,78,59,0.15)] border border-stone-100 flex flex-col overflow-hidden group hover:-translate-y-2 transition-transform duration-500 ease-out">
                {/* Physical Detail: Handle & LED */}
                <div className="h-12 bg-stone-50 border-b border-stone-100 flex items-center justify-between px-4">
                    <GripHorizontal className="text-stone-300" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-stone-400 tracking-widest">ACTIVE</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Stethoscope size={32} className="text-emerald-700" />
                    </div>
                    <h3 className="font-serif text-3xl text-stone-800 mb-2">Clinical</h3>
                    <p className="text-xs text-stone-500 leading-relaxed px-2">
                        Remote patient monitoring integration for healthcare providers.
                    </p>
                </div>

                {/* Data Block */}
                <div className="bg-stone-100 p-6 border-t border-stone-200">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Reimbursement</div>
                    <div className="font-mono text-2xl font-bold text-emerald-700">#99454<span className="text-sm text-stone-500 font-normal"> RPM</span></div>
                </div>
            </div>

            {/* Module 3: Insurance */}
            <div className="relative w-72 h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(6,78,59,0.15)] border border-stone-100 flex flex-col overflow-hidden group hover:-translate-y-2 transition-transform duration-500 ease-out">
                {/* Physical Detail: Handle & LED */}
                <div className="h-12 bg-stone-50 border-b border-stone-100 flex items-center justify-between px-4">
                    <GripHorizontal className="text-stone-300" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-stone-400 tracking-widest">LINKED</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Building2 size={32} className="text-emerald-700" />
                    </div>
                    <h3 className="font-serif text-3xl text-stone-800 mb-2">Insurance</h3>
                    <p className="text-xs text-stone-500 leading-relaxed px-2">
                        Risk assessment data licensing for actuarial models.
                    </p>
                </div>

                {/* Data Block */}
                <div className="bg-stone-100 p-6 border-t border-stone-200">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Risk Reduction</div>
                    <div className="font-mono text-2xl font-bold text-emerald-700">-35%<span className="text-sm text-stone-500 font-normal"> CLAIM</span></div>
                </div>
            </div>

        </div>

        {/* 4. The Connections (Fiber Optics) */}
        <div className="absolute bottom-24 left-0 right-0 h-32 pointer-events-none z-0">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* Left Ribbon */}
                <path d="M350,0 C350,80 576,20 576,120" fill="none" stroke="url(#ribbonGradient)" strokeWidth="6" strokeLinecap="round" />
                <motion.path 
                    d="M350,0 C350,80 576,20 576,120" 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth="2"
                    strokeDasharray="4 12"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -100 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Ribbon */}
                <path d="M576,0 L576,120" fill="none" stroke="url(#ribbonGradient)" strokeWidth="6" strokeLinecap="round" />
                <motion.path 
                    d="M576,0 L576,120" 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth="2"
                    strokeDasharray="4 12"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -100 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Right Ribbon */}
                <path d="M800,0 C800,80 576,20 576,120" fill="none" stroke="url(#ribbonGradient)" strokeWidth="6" strokeLinecap="round" />
                <motion.path 
                    d="M800,0 C800,80 576,20 576,120" 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth="2"
                    strokeDasharray="4 12"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -100 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </svg>
        </div>

        {/* 5. The Footer (The Hub) */}
        <div className="relative z-20 w-full max-w-2xl">
            <div className="bg-gradient-to-b from-stone-200 to-stone-300 rounded-t-xl p-1 shadow-inner">
                <div className="bg-stone-800 rounded-t-lg py-4 px-8 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full" />
                        </div>
                        <span className="text-stone-400 font-mono text-xs tracking-[0.2em]">PORT_01</span>
                    </div>
                    <h2 className="text-white font-bold tracking-widest text-sm">TOTAL_ADDRESSABLE_MARKET</h2>
                    <div className="font-mono text-emerald-400 font-bold">€4.2B</div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
