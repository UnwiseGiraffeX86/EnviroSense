"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, User, ShieldCheck, EyeOff, Key } from "lucide-react";

const rows = [
  { id: 1, hash: "0x7F3A9B2C...1A", real: "Patient ID: 1102 | Status: Critical" },
  { id: 2, hash: "0x8E2B1C4D...9F", real: "Patient ID: 2391 | Status: Recovering" },
  { id: 3, hash: "0x9D1C2E5F...8E", real: "Patient ID: 3842 | Status: Discharged" },
  { id: 4, hash: "0xA1F3B4D2...7C", real: "Patient ID: 4920 | Status: Stable" }, // Target
  { id: 5, hash: "0xB2E4C5F3...6B", real: "Patient ID: 5103 | Status: Critical" },
  { id: 6, hash: "0xC3D5E6A4...5A", real: "Patient ID: 6219 | Status: Stable" },
];

export default function SlideSecurity() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Trigger animation sequence on mount/view
  useEffect(() => {
    // Reset for demo purposes if needed, but here we rely on whileInView
  }, []);

  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
      
      {/* Typography */}
      <div className="absolute top-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">Zero Trust Visibility.</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono max-w-2xl mx-auto">
            The database engine itself filters the view. Unmatched rows don't just lock—they vanish.
          </p>
        </motion.div>
      </div>

      {/* Main Visualization Area */}
      <div className="relative w-full max-w-3xl h-[500px] flex flex-col items-center justify-center">
        
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
                  variants={{
                    locked: { 
                      scale: 1, 
                      backgroundColor: "rgba(226, 232, 240, 0.5)", // slate-200/50
                      borderColor: "rgba(255, 255, 255, 0)",
                      boxShadow: "none"
                    },
                    unlocked: { 
                      scale: 1.05, 
                      backgroundColor: "#FFFFFF", 
                      borderColor: "#10B981", // emerald-500
                      boxShadow: "0 0 30px rgba(16,185,129,0.2)"
                    }
                  }}
                  transition={{ duration: 0.5 }}
                  className={`
                    h-14 w-full rounded-lg border backdrop-blur-sm flex items-center px-6 justify-between
                    ${!isTarget && isUnlocked ? "opacity-40 blur-[1px]" : "opacity-100"}
                  `}
                >
                  {/* Content */}
                  <div className="font-mono text-sm flex items-center gap-4">
                    <span className={`text-xs font-bold ${isUnlocked && isTarget ? "text-emerald-600" : "text-slate-400"}`}>
                      {isUnlocked && isTarget ? "ROW_04" : `ROW_0${index + 1}`}
                    </span>
                    
                    <motion.span 
                      key={isUnlocked ? "real" : "hash"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={isUnlocked && isTarget ? "text-[#3D3430] font-bold" : "text-slate-400 tracking-widest"}
                    >
                      {isUnlocked && isTarget ? row.real : row.hash}
                    </motion.span>
                  </div>

                  {/* Icon */}
                  <div>
                    {isUnlocked && isTarget ? (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="bg-emerald-100 p-1.5 rounded-full"
                      >
                        <Unlock className="w-4 h-4 text-emerald-600" />
                      </motion.div>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400/50" />
                    )}
                  </div>
                </motion.div>

                {/* Floating Annotation for Target */}
                {isTarget && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isUnlocked ? 1 : 0, x: isUnlocked ? 0 : -20 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -right-48 top-1/2 -translate-y-1/2 flex items-center gap-3"
                  >
                    <div className="w-12 h-px bg-emerald-500/50" />
                    <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded text-xs font-bold text-emerald-700 shadow-sm">
                      RLS Key Match: AUTHORIZED
                    </div>
                  </motion.div>
                )}

                 {/* Floating Annotation for Others */}
                 {row.id === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isUnlocked ? 1 : 0, x: isUnlocked ? 0 : -20 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -right-44 top-1/2 -translate-y-1/2 flex items-center gap-3"
                  >
                    <div className="w-8 h-px bg-slate-300" />
                    <div className="text-xs font-mono text-slate-400">
                      Default Deny: INVISIBLE
                    </div>
                  </motion.div>
                )}

              </motion.div>
            );
          })}
        </div>

        {/* The User Context (The Key) */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: -40, opacity: 1 }}
          onAnimationComplete={() => setIsUnlocked(true)}
          transition={{ duration: 1, delay: 1, type: "spring" }}
        >
           {/* Connection Line */}
           <motion.div 
             className="h-24 w-0.5 bg-gradient-to-t from-emerald-500 to-transparent absolute bottom-full left-1/2 -translate-x-1/2 origin-bottom"
             initial={{ scaleY: 0 }}
             animate={{ scaleY: isUnlocked ? 1 : 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           />

           <div className="relative">
             <div className="w-16 h-16 bg-[#3D3430] rounded-2xl flex items-center justify-center shadow-2xl border-4 border-[#FDFBF7] relative z-10">
                <User className="w-8 h-8 text-white" />
             </div>
             {/* Badge */}
             <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-[#FDFBF7] flex items-center gap-1">
                <Key className="w-3 h-3" />
                <span>ID:4920</span>
             </div>
           </div>
           
           <p className="mt-4 text-xs font-bold text-[#3D3430]/50 uppercase tracking-widest">Authenticated User</p>
        </motion.div>

      </div>

    </section>
  );
}
