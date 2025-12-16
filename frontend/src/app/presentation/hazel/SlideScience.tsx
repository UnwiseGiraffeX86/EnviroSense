"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Wind } from "lucide-react";

const SlideScience = () => {
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
          The Triple Twin
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 mt-2 font-medium tracking-widest uppercase"
        >
          Somatic • Cognitive • Contextual
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
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
              <filter id="backdropBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              </filter>
            </defs>
            
            {/* Body Path */}
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
              stroke="#cbd5e1"
              strokeWidth="1.5"
              className="backdrop-blur-sm"
            />
          </svg>

          {/* Layer 1: Somatic (Heart) */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-red-500/30 blur-xl absolute inset-0"
            />
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] relative z-10"
            />
          </div>

          {/* Layer 2: Cognitive (Mind) */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full border-2 border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-blue-100/10"
            />
          </div>

          {/* Layer 3: Contextual (Particles) */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_5px_rgba(74,222,128,0.8)]"
                initial={{ 
                  x: Math.random() * 300, 
                  y: Math.random() * 600, 
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, Math.random() * -50],
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity, 
                  delay: Math.random() * 2 
                }}
              />
            ))}
          </div>

          {/* The Scanning Laser */}
          <motion.div
            className="absolute left-[-20%] right-[-20%] h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] z-50"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </div>

        {/* --- Data Widgets (Floating Cards) --- */}

        {/* Left Card: Somatic (Chest) */}
        <motion.div 
          className="absolute left-[10%] lg:left-[20%] top-[35%] z-30"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }} // Timed to match laser crossing chest (~35%)
        >
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-lg w-48 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3 h-3 text-red-500" />
              Somatic Load
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-800">42<span className="text-sm text-slate-400 ml-1">ms</span></span>
              <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Warning</span>
            </div>
            {/* Mini Sparkline */}
            <div className="h-8 w-full flex items-end gap-0.5 mt-1">
              {[40, 60, 45, 70, 30, 50, 35, 42].map((h, i) => (
                <div key={i} className="flex-1 bg-red-400/20 rounded-t-sm relative overflow-hidden">
                  <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-red-500 rounded-t-sm" />
                </div>
              ))}
            </div>
            {/* Connector Line */}
            <div className="absolute top-1/2 -right-12 w-12 h-[1px] bg-slate-300 hidden lg:block">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Right Card: Cognitive (Head) */}
        <motion.div 
          className="absolute right-[10%] lg:right-[20%] top-[15%] z-30"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }} // Timed to match laser crossing head (~15%)
        >
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-lg w-48 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-3 h-3 text-blue-500" />
              Cognitive Reserve
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="85, 100" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">85%</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-800">Focus</div>
                <div className="text-xs text-slate-400">Optimal</div>
              </div>
            </div>
            {/* Connector Line */}
            <div className="absolute top-1/2 -left-12 w-12 h-[1px] bg-slate-300 hidden lg:block">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer Equation */}
      <div className="absolute bottom-12 w-full text-center">
        <p className="font-serif text-2xl text-slate-400 italic">
          R<span className="text-sm align-sub">global</span> = α(S) + β(C) + γ(E)
        </p>
      </div>
    </section>
  );
};

export default SlideScience;
