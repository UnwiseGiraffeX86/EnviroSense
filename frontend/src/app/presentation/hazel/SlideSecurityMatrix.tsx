"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, User, ShieldCheck, Database } from "lucide-react";

const DataRow = ({ locked, index }: { locked: boolean; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className={`relative p-4 rounded-xl border backdrop-blur-sm overflow-hidden transition-all duration-500 ${
      locked
        ? "border-red-500/20 bg-red-500/5"
        : "border-[#00A36C] bg-[#00A36C]/10 scale-110 shadow-[0_0_30px_rgba(0,163,108,0.2)] z-10"
    }`}
  >
    {/* Skeleton Content */}
    <div className="space-y-3 opacity-50">
      <div className={`h-2 rounded-full w-3/4 ${locked ? "bg-red-900/20" : "bg-[#00A36C]/40"}`} />
      <div className={`h-2 rounded-full w-1/2 ${locked ? "bg-red-900/20" : "bg-[#00A36C]/40"}`} />
      <div className={`h-2 rounded-full w-5/6 ${locked ? "bg-red-900/20" : "bg-[#00A36C]/40"}`} />
    </div>

    {/* Status Icon Overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      {locked ? (
        <div className="bg-red-100/80 p-2 rounded-full backdrop-blur-md shadow-sm">
            <Lock className="w-5 h-5 text-red-500" />
        </div>
      ) : (
        <div className="bg-[#00A36C]/20 p-2 rounded-full backdrop-blur-md shadow-sm">
            <Unlock className="w-5 h-5 text-[#00A36C]" />
        </div>
      )}
    </div>

    {/* Blur Effect for Locked */}
    {locked && <div className="absolute inset-0 backdrop-blur-[2px]" />}
  </motion.div>
);

const SlideSecurityMatrix = () => {
  // 4x4 Grid = 16 items. Let's make index 10 (approx center) the unlocked one.
  const totalRows = 16;
  const unlockedIndex = 10;

  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
      
      {/* Title */}
      <div className="absolute top-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Matrix</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono">Row-Level Security (RLS)</p>
        </motion.div>
      </div>

      {/* The Matrix Container */}
      <div className="relative w-full max-w-5xl mt-16 px-4">
        
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {[...Array(totalRows)].map((_, i) => (
            <DataRow key={i} index={i} locked={i !== unlockedIndex} />
          ))}
        </div>

        {/* Scanning Light Animation */}
        <motion.div
            className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            whileInView={{ x: "200%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />

        {/* Connection to User */}
        <div className="absolute left-0 right-0 -bottom-32 flex flex-col items-center justify-center z-30">
            {/* Connecting Line */}
            <svg className="w-full h-32 overflow-visible absolute bottom-16 pointer-events-none">
                <motion.path 
                    d={`M ${50 + 12.5}% 0 L 50% 100`} // Rough calculation to connect to the "unlocked" card visually
                    fill="none"
                    stroke="#00A36C"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                />
                <motion.circle r="4" fill="#00A36C">
                    <motion.animateMotion 
                        path={`M ${50 + 12.5}% 0 L 50% 100`}
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                </motion.circle>
            </svg>

            {/* User Node */}
            <motion.div 
                className="bg-white border-2 border-[#00A36C] p-4 rounded-full shadow-xl relative z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
            >
                <User className="w-8 h-8 text-[#3D3430]" />
                <div className="absolute -right-2 -top-2 bg-[#00A36C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    AUTH
                </div>
            </motion.div>
            <p className="mt-4 font-mono text-sm text-[#3D3430] font-bold">Authenticated Session</p>
        </div>

      </div>

    </section>
  );
};

export default SlideSecurityMatrix;
