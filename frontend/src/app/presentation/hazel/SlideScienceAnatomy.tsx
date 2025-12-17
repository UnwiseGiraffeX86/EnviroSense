"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Wind } from "lucide-react";

const SlideScienceAnatomy = () => {
  return (
    <section className="h-screen w-full snap-start relative overflow-hidden bg-[#FDFBF7] flex items-center justify-center">
      {/* Medical Grid Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #bfdbfe 1px, transparent 1px), linear-gradient(to bottom, #bfdbfe 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Typography Header */}
      <div className="absolute top-12 left-0 w-full text-center z-20">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight"
        >
          The Triple Digital Twin
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 mt-2 font-medium tracking-widest uppercase"
        >
          Modeling Body, Mind, and Environment
        </motion.p>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
        
        {/* --- The Glass Body (Centerpiece) --- */}
        <div className="relative w-[300px] h-[600px] flex items-center justify-center z-10">
          
          {/* Silhouette SVG */}
          <svg 
            viewBox="0 0 200 500" 
            className="w-full h-full drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.1))" }}
          >
            <defs>
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
              <filter id="backdropBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              </filter>
            </defs>
            
            {/* Body Path - Abstract Human Silhouette */}
            <path 
              d="M 100 40 
                 C 130 40 150 65 150 95 
                 C 150 120 135 140 120 145 
                 L 120 160 
                 C 160 165 190 180 190 220 
                 V 500 
                 H 10 
                 V 220 
                 C 10 180 40 165 80 160 
                 L 80 145 
                 C 65 140 50 120 50 95 
                 C 50 65 70 40 100 40 Z"
              fill="url(#glassGradient)"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              className="backdrop-blur-md"
            />
          </svg>

          {/* Layer 1: Somatic (Heart) */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-red-500/20 blur-xl absolute inset-0"
            />
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] relative z-10"
            />
          </div>

          {/* Layer 2: Cognitive (Head) */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 rounded-full border border-blue-400/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] bg-blue-50/10"
            />
          </div>

          {/* Layer 3: Contextual (Particles) */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => {
              // Deterministic random values based on index to prevent hydration mismatch
              const r1 = (i * 137.5) % 200;
              const r2 = (i * 293.3) % 500;
              const r3 = (i * 41.7) % 100;
              const r4 = (i * 73.1) % 20;
              const r5 = (i * 19.9) % 3;
              const r6 = (i * 7.7) % 2;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                  initial={{ 
                    x: r1 + 50, 
                    y: r2, 
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [null, -r3],
                    opacity: [0, 0.6, 0],
                    x: [null, r4 - 10]
                  }}
                  transition={{ 
                    duration: 4 + r5, 
                    repeat: Infinity, 
                    delay: r6 
                  }}
                />
              );
            })}
          </div>

          {/* The Scanning Laser */}
          <motion.div
            className="absolute left-[-30%] right-[-30%] h-[2px] bg-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-50"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
             <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-600 bg-emerald-100 px-1 rounded-l">SCANNING</div>
          </motion.div>
        </div>

        {/* --- Data Widgets (Floating Cards) --- */}

        {/* Left Card: Somatic (Chest) */}
        <motion.div 
          className="absolute left-[5%] lg:left-[15%] top-[35%] z-30"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }} // Timed to match laser crossing chest (~35%)
        >
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-xl w-56 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4 text-red-500" />
              Somatic (Heart)
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-800 tracking-tight">45<span className="text-sm text-slate-400 ml-1 font-medium">ms</span></span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50/80 px-2 py-1 rounded-full border border-emerald-100">Stable</span>
            </div>
            {/* Mini Sparkline */}
            <div className="h-8 w-full flex items-end gap-1 mt-2 opacity-80">
              {[40, 60, 45, 70, 30, 50, 35, 42, 55, 48].map((h, i) => (
                <div key={i} className="flex-1 bg-red-100 rounded-full relative overflow-hidden h-full flex items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: 1.5 + (i * 0.05) }}
                    className="w-full bg-red-500 rounded-full" 
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Card: Cognitive (Head) */}
        <motion.div 
          className="absolute right-[5%] lg:right-[15%] top-[15%] z-30"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }} // Timed to match laser crossing head (~15%)
        >
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-xl w-56 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4 text-blue-500" />
              Cognitive (Mind)
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="relative w-14 h-14">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.92 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-600">92%</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-800">Focus</div>
                <div className="text-xs text-slate-400 font-medium">High Capacity</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Card: Contextual (Environment) */}
        <motion.div 
          className="absolute bottom-[10%] z-30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }} // Timed to match laser reaching bottom
        >
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-3 pr-6 rounded-full shadow-xl flex items-center gap-4">
            <div className="bg-emerald-100 p-2.5 rounded-full">
              <Wind className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Environmental Context</div>
              <div className="text-sm font-bold text-slate-800">PM2.5: 12 µg/m³ <span className="text-emerald-500 font-normal ml-1">(Good)</span></div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer Equation */}
      <div className="absolute bottom-24 text-center w-full z-50 pointer-events-none">
        <p className="font-serif italic text-slate-400 text-lg md:text-xl tracking-wide">
          R_global = α(S) + β(C) + γ(E)
        </p>
      </div>

    </section>
  );
};

export default SlideScienceAnatomy;
