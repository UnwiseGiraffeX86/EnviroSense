"use client";

import React from "react";
import { motion } from "framer-motion";
import { Power, ShieldCheck, ArrowRight, Leaf } from "lucide-react";

const SlideFutureInitialization = () => {
  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
      {/* Background Pattern - Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Title */}
      <div className="absolute top-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Blueprint is Ready.</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono">Sector 3 infrastructure is standing by for deployment.</p>
        </motion.div>
      </div>

      {/* Main Visual: The Power Button */}
      <div className="relative flex items-center justify-center mt-10">
        
        {/* Pulsing Rings */}
        <motion.div
            className="absolute w-64 h-64 rounded-full border border-[#00A36C]/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute w-80 h-80 rounded-full border border-[#00A36C]/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* The Button Itself */}
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-48 h-48 rounded-full bg-white border-4 border-[#00A36C] shadow-[0_0_40px_rgba(0,163,108,0.2)] flex items-center justify-center group cursor-pointer z-20 transition-shadow hover:shadow-[0_0_60px_rgba(0,163,108,0.4)]"
        >
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-full bg-[#00A36C]/5 group-hover:bg-[#00A36C]/10 transition-colors" />
            
            {/* EnviroSense Logo Representation */}
            <div className="flex flex-col items-center gap-2">
                <Leaf className="w-16 h-16 text-[#00A36C] fill-[#00A36C]/10" strokeWidth={1.5} />
                <Power className="w-8 h-8 text-[#3D3430]/40 group-hover:text-[#00A36C] transition-colors mt-2" />
            </div>
        </motion.button>

      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 163, 108, 0.05)" }}
        whileTap={{ scale: 0.98 }}
        className="mt-16 px-10 py-4 border-2 border-[#00A36C] text-[#00A36C] rounded-lg text-lg font-mono font-bold tracking-widest uppercase flex items-center gap-4 group cursor-pointer z-20 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A36C] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A36C]"></span>
        </span>
        Initialize Pilot Protocol
      </motion.button>

      {/* Footer Logos */}
      <div className="absolute bottom-12 flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        {/* EnviroSense */}
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#3D3430] rounded-md">
                <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#3D3430] text-sm tracking-wide">EnviroSense</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-[#3D3430]/20" />

        {/* HazelHeartwood */}
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#00A36C]" />
            <span className="font-bold text-[#00A36C] text-sm tracking-wide">HazelHeartwood</span>
        </div>
      </div>

    </section>
  );
};

export default SlideFutureInitialization;
