"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, MessageSquare, Database, Lock } from "lucide-react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function SlideArchitecture() {
  const [isHovered, setIsHovered] = useState(false);
  // Increased threshold to 1080px to catch most laptops (13", 14", 15" screens usually have <1000px viewport height)
  const isShortScreen = useMediaQuery("(max-height: 1080px)");

  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden perspective-[2000px]">
      
      {/* Typography */}
      <div className="absolute top-24 text-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">Depth of Intelligence.</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono">Hover to see the layers of logic behind a single response.</p>
        </motion.div>
      </div>

      {/* 3D Stack Container */}
      <div 
        className="relative w-[600px] h-[300px] group cursor-pointer mt-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Layer 1: The Ground Truth (Bottom/Back) */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-[#3D3430]/10 bg-[#F0EBE0] shadow-xl overflow-hidden flex flex-col"
          initial={{ y: 0, z: 0, scale: 0.9, opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={isHovered ? (isShortScreen ? {
            x: -340, // Increased spread to reveal content
            y: 0,
            z: 0,
            rotateZ: -5,
            scale: 0.85 // Slightly smaller to fit width
          } : {
            y: 320,
            z: -100,
            rotateX: 20,
            scale: 0.95
          }) : {
            x: 0,
            y: 10,
            z: 0,
            rotateZ: 0,
            rotateX: 0,
            scale: 0.9
          }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="h-10 bg-[#E5E0D0] border-b border-[#3D3430]/10 flex items-center px-4 justify-between">
             <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#3D3430]/60" />
                <span className="text-xs font-bold text-[#3D3430]/60 uppercase tracking-wider">RAG Context (Legal Grounding)</span>
             </div>
             <div className="w-2 h-2 rounded-full bg-[#3D3430]/20" />
          </div>
          <div className="p-6 font-serif text-[#3D3430]/70 text-sm leading-relaxed relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none" />
             <p className="mb-4">
               Directive 2008/50/EC of the European Parliament and of the Council of 21 May 2008 on ambient air quality and cleaner air for Europe.
             </p>
             <p className="mb-4">
               Member States shall ensure that, throughout their zones and agglomerations, levels of PM2.5 do not exceed the target value laid down in Annex XIV.
             </p>
             <span className="bg-yellow-200/80 px-1 py-0.5 rounded border border-yellow-400/30 text-[#3D3430] font-bold">
               Annual limit value for PM2.5: 10 µg/m³
             </span>
          </div>
        </motion.div>

        {/* Layer 2: The Security Filter (Middle) */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col"
          initial={{ y: 0, z: 0, scale: 0.95, opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={isHovered ? (isShortScreen ? {
            x: 0,
            y: 0,
            z: 50,
            scale: 1
          } : {
            y: 0,
            z: -50,
            rotateX: 10,
            scale: 0.98
          }) : {
            x: 0,
            y: 5,
            z: 0,
            scale: 0.95
          }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.05 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="h-10 bg-slate-800/50 border-b border-white/5 flex items-center px-4 justify-between">
             <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Zero-Trust Airlock</span>
             </div>
             <Lock className="w-3 h-3 text-emerald-400/50" />
          </div>
          <div className="p-6 font-mono text-xs text-slate-300 space-y-3">
             <div className="flex gap-3">
                <span className="text-slate-500">10:42:01</span>
                <span className="text-blue-400">INFO</span>
                <span>Incoming query analysis...</span>
             </div>
             <div className="flex gap-3">
                <span className="text-slate-500">10:42:02</span>
                <span className="text-yellow-400">WARN</span>
                <span>DETECTED_PII: [REDACTED]</span>
             </div>
             <div className="flex gap-3">
                <span className="text-slate-500">10:42:02</span>
                <span className="text-emerald-400">PASS</span>
                <span>EDGE_GATEWAY: SECURE</span>
             </div>
             <div className="flex gap-3">
                <span className="text-slate-500">10:42:03</span>
                <span className="text-purple-400">EXEC</span>
                <span>Injecting context ID: 8f92-a1</span>
             </div>
          </div>
        </motion.div>

        {/* Layer 3: The Interaction (Top/Front) */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
          initial={{ y: 0, z: 0, scale: 1, opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={isHovered ? (isShortScreen ? {
            x: 340, // Increased spread to reveal content
            y: 0,
            z: 100,
            rotateZ: 5,
            scale: 0.85 // Matched scale
          } : {
            y: -320,
            z: 0,
            rotateX: -10,
            scale: 1
          }) : {
            x: 0,
            y: 0,
            z: 0,
            rotateZ: 0,
            rotateX: 0,
            scale: 1
          }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.1 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="h-10 bg-white/30 border-b border-white/20 flex items-center px-4 justify-between">
             <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3D3430]" />
                <span className="text-xs font-bold text-[#3D3430] uppercase tracking-wider">Neuro-Symbolic Output</span>
             </div>
             <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/40" />
                <div className="w-2 h-2 rounded-full bg-green-400/40" />
             </div>
          </div>
          <div className="p-6 flex flex-col justify-center h-full gap-4">
             {/* User Input */}
             <div className="self-end bg-[#3D3430] text-[#FDFBF7] px-5 py-3 rounded-2xl rounded-tr-none shadow-md max-w-xs transform translate-x-2">
                <p className="text-sm font-medium">Is the air quality in Sector 3 safe right now?</p>
             </div>

             {/* AI Output */}
             <div className="self-start bg-white/80 p-6 rounded-2xl rounded-tl-none shadow-sm border border-white/50 max-w-md">
                <p className="text-[#3D3430] text-lg font-medium leading-snug">
                   "Based on the <span className="font-bold text-[#E07A5F]">EU Directive</span>, your sector is currently exceeding safety limits."
                </p>
             </div>
          </div>
        </motion.div>
      </div>
      
      {/* Connecting Lines (Optional visual aid when expanded) */}
      <motion.div 
         className="absolute w-[1px] bg-gradient-to-b from-[#3D3430]/0 via-[#3D3430]/20 to-[#3D3430]/0"
        style={{ height: '400px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        animate={{ opacity: isHovered && !isShortScreen ? 1 : 0 }}
      />
    </section>
  );
}
