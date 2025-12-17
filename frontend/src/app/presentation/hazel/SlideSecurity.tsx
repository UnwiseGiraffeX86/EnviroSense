"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, User, ShieldCheck, EyeOff, Key, Cpu } from "lucide-react";

const rows = [
  { id: 1, hash: "0x7A4F91B2C8D3E4F5...[ENCRYPTED]", real: "Patient ID: 1102 | Status: Critical" },
  { id: 2, hash: "0x8E2B1C4D5F6A7B8C...[ENCRYPTED]", real: "Patient ID: 2391 | Status: Recovering" },
  { id: 3, hash: "0x9D1C2E5F3A4B6C7D...[ENCRYPTED]", real: "Patient ID: 3842 | Status: Discharged" },
  { id: 4, hash: "0xA1F3B4D2E5C6F7A8...[ENCRYPTED]", real: "Patient ID: 4920 | Status: Stable" }, // Target
  { id: 5, hash: "0xB2E4C5F3D6A7B8C9...[ENCRYPTED]", real: "Patient ID: 5103 | Status: Critical" },
  { id: 6, hash: "0xC3D5E6A4B7C8D9E0...[ENCRYPTED]", real: "Patient ID: 6219 | Status: Stable" },
];

export default function SlideSecurity() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
      
      {/* Typography */}
      <div className="absolute top-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Living Security Terminal.</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono max-w-2xl mx-auto">
            Active denial by default. Liquid data flow on verification.
          </p>
        </motion.div>
      </div>

      {/* Main Visualization Area */}
      <div className="relative w-full max-w-3xl h-[600px] flex flex-col items-center justify-center">
        
        {/* The Database Stack */}
        <div className="relative w-full max-w-xl flex flex-col gap-3 z-20">
          {rows.map((row, index) => {
            const isTarget = row.id === 4;
            
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <motion.div
                  animate={isUnlocked && isTarget ? "unlocked" : "locked"}
                  whileHover={!isTarget ? {
                    borderColor: "rgba(239, 68, 68, 0.5)",
                    x: [0, -2, 2, -2, 2, 0],
                    color: "rgba(239, 68, 68, 0.8)",
                    transition: { duration: 0.4 }
                  } : {}}
                  variants={{
                    locked: { 
                      scale: 1, 
                      backgroundColor: "rgba(226, 232, 240, 0.3)", // lighter slate
                      borderColor: "rgba(0,0,0,0)",
                      boxShadow: "none",
                      opacity: 0.6
                    },
                    unlocked: { 
                      scale: 1.1, 
                      backgroundColor: "#FFFFFF", 
                      borderColor: "#10B981", // emerald-500
                      boxShadow: "0 0 30px rgba(16,185,129,0.25)",
                      opacity: 1,
                      zIndex: 50 // Bring to front
                    }
                  }}
                  transition={{ duration: 0.5 }}
                  className={`
                    h-14 w-full rounded-lg border flex items-center px-6 justify-between relative overflow-hidden
                    ${!isTarget ? "font-mono text-slate-400 cursor-not-allowed" : ""}
                  `}
                >
                  {/* Holographic Shimmer for Active Row */}
                  {isUnlocked && isTarget && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {/* Content */}
                  <div className="font-mono text-sm flex items-center gap-4 w-full overflow-hidden relative z-10">
                    <span className={`text-xs font-bold shrink-0 ${isUnlocked && isTarget ? "text-emerald-600" : "text-inherit"}`}>
                      {isUnlocked && isTarget ? "ROW_04" : `ROW_0${index + 1}`}
                    </span>
                    
                    <motion.span 
                      key={isUnlocked ? "real" : "hash"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`truncate w-full ${isUnlocked && isTarget ? "text-[#3D3430]" : "text-inherit tracking-widest opacity-60"}`}
                    >
                      {isUnlocked && isTarget ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                           <span className="font-extrabold text-slate-800 text-base">Patient ID: 4920</span>
                           <span className="text-slate-300">|</span>
                           <span className="text-emerald-600 font-bold">Status: Stable</span>
                        </div>
                      ) : (
                        row.hash
                      )}
                    </motion.span>
                  </div>

                  {/* Icon */}
                  <div className="shrink-0 ml-4 relative z-10">
                    {isUnlocked && isTarget ? (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="bg-emerald-100 p-1.5 rounded-full"
                      >
                        <Unlock className="w-4 h-4 text-emerald-600" />
                      </motion.div>
                    ) : (
                      <Lock className="w-4 h-4 text-inherit opacity-50" />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* The User Context (The Key) */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          onAnimationComplete={() => setIsUnlocked(true)}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
        >
           {/* SVG Circuit Line Connection */}
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-1 h-[160px] overflow-visible pointer-events-none z-0">
             <svg width="20" height="100%" viewBox="0 0 20 100" preserveAspectRatio="none" className="overflow-visible">
               {/* Background Track */}
               <line x1="10" y1="100%" x2="10" y2="0" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
               
               {/* Liquid Data Pulse */}
               {isUnlocked && (
                 <motion.path
                   d="M 10 100 L 10 0"
                   stroke="#10B981"
                   strokeWidth="3"
                   strokeLinecap="round"
                   strokeDasharray="10 10"
                   initial={{ strokeDashoffset: 0 }}
                   animate={{ strokeDashoffset: -20 }}
                   transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                 />
               )}
             </svg>
           </div>

           <div className="relative z-10 bg-[#FDFBF7] p-2 rounded-xl"> {/* Background to hide line behind chip */}
             {/* Chip Container */}
             <motion.div 
               className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center shadow-2xl border border-emerald-500/50 relative overflow-hidden"
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             >
                {/* Chip Pattern */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                
                <Cpu className="w-8 h-8 text-emerald-400 relative z-10" />
             </motion.div>
             
             {/* Badge */}
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-900 text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 shadow-lg">
                SESSION_VERIFIED
             </div>
           </div>
        </motion.div>

      </div>

    </section>
  );
}
