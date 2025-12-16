"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Wind, Brain, Heart, Thermometer, Droplets } from "lucide-react";

const SlideScienceAnatomy = () => {
  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-transparent overflow-hidden p-6">
      
      {/* Header */}
      <div className="absolute top-24 text-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-[#3D3430] mb-2 tracking-tight">The Triple Twin.</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono uppercase tracking-widest">Modeling Body, Mind, and Air</p>
        </motion.div>
      </div>

      {/* --- THE SCANNER MACHINE (Central Dark Container) --- */}
      <div className="relative w-full max-w-4xl h-[600px] mt-16 bg-[#1a1a1a] rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden flex items-center justify-center z-10">
        
        {/* Grid Background inside Machine */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#4ade8012_1px,transparent_1px),linear-gradient(to_bottom,#4ade8012_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Vignette inside Machine */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1a1a1a_80%)] pointer-events-none" />

        {/* --- THE SUBJECT (Holographic Wireframe) --- */}
        <div className="relative z-10 opacity-80">
            <svg height="500" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {/* Human Outline */}
                <path 
                    d="M100 20 C 115 20 125 35 125 50 C 125 65 115 80 100 80 C 85 80 75 65 75 50 C 75 35 85 20 100 20 Z" 
                    stroke="white" strokeWidth="1.5" strokeOpacity="0.5"
                />
                <path 
                    d="M 100 80 C 130 90 150 110 150 150 L 150 250 L 140 250 L 140 160 C 140 140 130 130 100 130 C 70 130 60 140 60 160 L 60 250 L 50 250 L 50 150 C 50 110 70 90 100 80" 
                    stroke="white" strokeWidth="1.5" strokeOpacity="0.5"
                />
                <path 
                    d="M 100 130 L 100 250 L 120 400 L 80 400 L 100 250" 
                    stroke="white" strokeWidth="1.5" strokeOpacity="0.5"
                />
                
                {/* Internal Organs (Stylized) */}
                <motion.path 
                    d="M 95 100 L 105 100 L 100 110 Z" // Brain-ish
                    stroke="#60a5fa" strokeWidth="1" fill="#60a5fa" fillOpacity="0.2"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                    cx="100" cy="140" r="5" // Heart
                    stroke="#f87171" strokeWidth="1" fill="#f87171" fillOpacity="0.2"
                    animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                />
            </svg>
        </div>

        {/* --- THE LASER SCAN (Animation) --- */}
        <motion.div 
            className="absolute left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20"
            initial={{ top: "10%" }}
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
            {/* Laser Glow Line */}
            <div className="absolute inset-0 bg-emerald-400 blur-sm" />
        </motion.div>

        {/* --- FLOATING DUST PARTICLES (Environment) --- */}
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    initial={{ 
                        x: Math.random() * 800, 
                        y: Math.random() * 600, 
                        scale: Math.random() 
                    }}
                    animate={{ 
                        y: [null, Math.random() * 600],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ 
                        duration: 10 + Math.random() * 10, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                />
            ))}
        </div>

        {/* --- DATA HUD (Floating Widgets) --- */}
        
        {/* 1. Cognitive Twin (Head) - Appears when laser is top */}
        <motion.div 
            className="absolute top-20 right-10 md:right-20 w-64 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: [0, 1, 1, 0], x: [20, 0, 0, 20] }}
            transition={{ duration: 8, repeat: Infinity, times: [0, 0.1, 0.3, 0.4] }} // Visible during top scan
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Cognitive Twin</h3>
                    <p className="text-xs text-slate-400">Real-time Neural Link</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Stress Level</span>
                    <span className="text-red-400 font-mono font-bold">HIGH (82%)</span>
                </div>
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[82%] bg-red-500" />
                </div>
            </div>
        </motion.div>

        {/* 2. Somatic Twin (Heart) - Appears when laser is mid */}
        <motion.div 
            className="absolute top-1/3 left-10 md:left-20 w-64 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, -20] }}
            transition={{ duration: 8, repeat: Infinity, times: [0.2, 0.3, 0.5, 0.6] }} // Visible during mid scan
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Heart className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Somatic Twin</h3>
                    <p className="text-xs text-slate-400">Biometric Stability</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase">HRV</div>
                    <div className="text-emerald-400 font-mono font-bold text-lg">98</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase">SpO2</div>
                    <div className="text-emerald-400 font-mono font-bold text-lg">99%</div>
                </div>
            </div>
        </motion.div>

        {/* 3. Environmental Twin (Air) - Appears when laser is bottom */}
        <motion.div 
            className="absolute bottom-20 right-10 md:right-20 w-64 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: [0, 1, 1, 0], x: [20, 0, 0, 20] }}
            transition={{ duration: 8, repeat: Infinity, times: [0.5, 0.6, 0.8, 0.9] }} // Visible during bottom scan
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Wind className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Contextual Twin</h3>
                    <p className="text-xs text-slate-400">Local Atmosphere</p>
                </div>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-300">PM2.5</span>
                </div>
                <span className="text-amber-400 font-mono font-bold">35 µg/m³</span>
            </div>
        </motion.div>

      </div>

    </section>
  );
};

export default SlideScienceAnatomy;
