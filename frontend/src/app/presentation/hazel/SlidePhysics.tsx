"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Wind, Database, Zap } from "lucide-react";

const RandomNumber = ({ label }: { label: string }) => {
  const [num, setNum] = useState("0.000");

  useEffect(() => {
    const interval = setInterval(() => {
      setNum((Math.random() * 10).toFixed(3));
    }, 200 + Math.random() * 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2 font-mono text-[10px] text-gray-400">
      <span className="uppercase">{label}:</span>
      <span className="text-emerald-600/80">{num}</span>
    </div>
  );
};

const Sparkline = () => {
  return (
    <div className="w-full h-12 relative overflow-hidden">
      <svg className="w-full h-full" preserveAspectRatio="none">
        <motion.path
          d="M0,20 Q10,10 20,20 T40,20 T60,10 T80,30 T100,20 T120,10 T140,25 T160,15 T180,20 T200,20"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          initial={{ pathLength: 0, x: -200 }}
          animate={{ pathLength: 1, x: 0 }}
          transition={{ 
            pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
            x: { duration: 4, repeat: Infinity, ease: "linear" }
          }}
        />
      </svg>
    </div>
  );
};

const CircularProgress = () => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="4" fill="none" />
        <motion.circle
          cx="32" cy="32" r="28"
          stroke="#10B981"
          strokeWidth="4"
          fill="none"
          strokeDasharray="175.9" // 2 * pi * 28
          initial={{ strokeDashoffset: 175.9 * 0.6 }} // Start at 40%
          animate={{ strokeDashoffset: [175.9 * 0.6, 175.9 * 0.4, 175.9 * 0.6] }} // Oscillate 40% -> 60% -> 40%
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute text-[10px] font-mono font-bold text-emerald-700">
        <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
        >
            RES
        </motion.span>
      </div>
    </div>
  );
};

const Heatmap = () => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className="w-4 h-4 rounded-sm bg-gray-200"
          animate={{ backgroundColor: ["#E5E7EB", "#10B981", "#E5E7EB"] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: i * 0.2,
            ease: "easeInOut" 
          }}
        />
      ))}
    </div>
  );
};

export default function SlidePhysics() {
  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center bg-[#FDFBF7] overflow-hidden font-sans relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1118270a_1px,transparent_1px),linear-gradient(to_bottom,#1118270a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl font-bold text-[#1F2937] tracking-tight mb-4">The Mathematical Core.</h1>
        <p className="text-base font-mono text-gray-500">Deterministic physics. No black-box AI.</p>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl px-8 grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
        
        {/* Column 1: Kinematics */}
        <div className="relative bg-white border border-gray-200 border-t-4 border-emerald-500 shadow-xl rounded-xl p-6 overflow-hidden flex flex-col justify-between h-[400px] group">
            {/* Scanline */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none"
                animate={{ top: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Top */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="font-bold text-sm tracking-widest text-gray-500">KINEMATICS</h3>
                </div>
                <Activity size={16} className="text-gray-400" />
            </div>

            {/* Hero */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <div className="font-mono font-bold text-2xl text-[#1F2937] text-center mb-2">
                    SMV = √(ax² + ay² + az²)
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Signal Magnitude Vector</div>
            </div>

            {/* Active Detail */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-600">GAIT_NOISE</span>
                    <span className="text-[10px] font-mono text-gray-400">0.04Hz</span>
                </div>
                <Sparkline />
            </div>

            {/* Tech Decor */}
            <div className="absolute top-4 right-4 opacity-50"><RandomNumber label="v" /></div>
            <div className="absolute bottom-4 right-4 opacity-50"><RandomNumber label="t" /></div>
        </div>

        {/* Column 2: Fluid Dynamics */}
        <div className="relative bg-white border border-gray-200 border-t-4 border-emerald-500 shadow-xl rounded-xl p-6 overflow-hidden flex flex-col justify-between h-[400px] group">
            {/* Scanline */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none"
                animate={{ top: ["-100%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
            />

            {/* Top */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="font-bold text-sm tracking-widest text-gray-500">FLUID DYNAMICS</h3>
                </div>
                <Wind size={16} className="text-gray-400" />
            </div>

            {/* Hero */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <div className="font-mono font-bold text-2xl text-[#1F2937] text-center mb-2">
                    P_drive = K1·V̇ + K2·V̇²
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Airflow Resistance Model</div>
            </div>

            {/* Active Detail */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-mono font-bold text-emerald-600 mb-1">AIRWAY_RESISTANCE</div>
                    <div className="text-[10px] font-mono text-gray-400">OSCILLATION: ACTIVE</div>
                </div>
                <CircularProgress />
            </div>

            {/* Tech Decor */}
            <div className="absolute top-4 right-4 opacity-50"><RandomNumber label="p" /></div>
            <div className="absolute bottom-4 right-4 opacity-50"><RandomNumber label="f" /></div>
        </div>

        {/* Column 3: Dosimetry */}
        <div className="relative bg-white border border-gray-200 border-t-4 border-emerald-500 shadow-xl rounded-xl p-6 overflow-hidden flex flex-col justify-between h-[400px] group">
            {/* Scanline */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none"
                animate={{ top: ["-100%", "100%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />

            {/* Top */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="font-bold text-sm tracking-widest text-gray-500">DOSIMETRY</h3>
                </div>
                <Database size={16} className="text-gray-400" />
            </div>

            {/* Hero */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <div className="font-mono font-bold text-2xl text-[#1F2937] text-center mb-2">
                    Dose = ∫ D(t) dt
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Cumulative Exposure</div>
            </div>

            {/* Active Detail */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-mono font-bold text-emerald-600 mb-1">ACCUMULATED_LOAD</div>
                    <div className="text-[10px] font-mono text-gray-400">GRID: INTEGRATING</div>
                </div>
                <Heatmap />
            </div>

            {/* Tech Decor */}
            <div className="absolute top-4 right-4 opacity-50"><RandomNumber label="d" /></div>
            <div className="absolute bottom-4 right-4 opacity-50"><RandomNumber label="i" /></div>
        </div>

      </div>
    </section>
  );
}
