    "use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, User, Shield, Scale, Brain, ArrowRight, Lock, Activity, Zap, Wind } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#E5E0D0]" />
});

// --- Placeholder Components ---

const SlideContext = () => (
  <section className="h-screen w-full snap-start relative overflow-hidden bg-[#E5E0D0]">
    {/* Background Map with Zoom Animation */}
    <div className="absolute inset-0 z-0">
       <motion.div 
         initial={{ scale: 1 }}
         whileInView={{ scale: 1.1 }}
         transition={{ duration: 20, ease: "linear" }}
         className="w-full h-full"
       >
          <Map />
       </motion.div>
    </div>

    {/* Vignette Overlay */}
    <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(61,52,48,0.3)_100%)]" />

    {/* Content Container */}
    <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 items-center">
      
      {/* Typography (Top-Left) */}
      <div className="lg:col-span-12 absolute top-24 left-6 lg:left-12">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
         >
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#3D3430] tracking-tight leading-[0.9] drop-shadow-sm mb-6">
             The Crisis <br/> is Local.
           </h1>
           <p className="text-lg md:text-2xl text-[#3D3430] font-medium max-w-lg backdrop-blur-sm bg-white/40 p-4 rounded-xl border border-white/20 shadow-sm">
             Real-time telemetry from your office window.
           </p>
         </motion.div>
      </div>

      {/* Data Card (Center-Right) */}
      <div className="hidden lg:block lg:col-start-9 lg:col-span-4">
         <motion.div
           initial={{ x: 100, opacity: 0 }}
           whileInView={{ x: 0, opacity: 1 }}
           transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.4 }}
           className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8"
         >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A5F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E07A5F]"></span>
                </span>
                <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-widest">Live Analysis</span>
              </div>
              <span className="text-xs font-mono text-[#3D3430]/50 font-bold">ID: SEC-03</span>
            </div>

            <h3 className="text-2xl font-bold text-[#3D3430] mb-1">Splaiul Unirii</h3>
            <p className="text-sm text-[#3D3430]/60 mb-6">Sector 3, Bucharest</p>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-7xl font-extrabold text-[#E07A5F] tracking-tighter">38</span>
              <span className="text-xl font-bold text-[#3D3430]/40">µg/m³</span>
            </div>

            <div className="w-full bg-[#3D3430]/5 rounded-full h-3 overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "65%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                className="h-full bg-[#E07A5F]" 
              />
            </div>
            <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-[#E07A5F]">Moderate Risk</p>
                <p className="text-xs text-[#3D3430]/40">Updated: Now</p>
            </div>

         </motion.div>
      </div>

    </div>
  </section>
);

const SlideArchitecture = () => (
  <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
    {/* Title */}
    <div className="absolute top-24 text-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Logic</h2>
        <p className="text-lg text-[#3D3430]/60 font-mono">Neuro-Symbolic Architecture</p>
      </motion.div>
    </div>

    {/* Diagram Container */}
    <div className="relative w-full max-w-6xl px-4 md:px-10 flex items-center justify-between z-0 mt-10">
      
      {/* Connecting Pipe */}
      <div className="absolute top-[3rem] left-0 w-full h-1 bg-[#3D3430]/10 z-0 mx-10 md:mx-20 max-w-[calc(100%-5rem)] md:max-w-[calc(100%-10rem)]">
         {/* Data Packet Animation */}
         <motion.div
           className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#00A36C] rounded-full shadow-[0_0_15px_#00A36C]"
           animate={{ 
             left: ["0%", "100%"],
             opacity: [0, 1, 1, 0]
           }}
           transition={{ 
             duration: 4, 
             repeat: Infinity, 
             ease: "linear",
             times: [0, 0.1, 0.9, 1]
           }}
         />
      </div>

      {/* Node 1: Input */}
      <div className="relative z-10 flex flex-col items-center gap-6 group">
         <div className="w-24 h-24 bg-[#FDFBF7] rounded-2xl shadow-lg border border-[#3D3430]/5 flex items-center justify-center relative z-10">
            <User className="w-10 h-10 text-[#3D3430]" />
         </div>
         <div className="text-center">
            <h3 className="font-bold text-[#3D3430] text-lg">Input</h3>
            <p className="text-xs text-[#3D3430]/60 font-mono mt-1">User Query</p>
         </div>
      </div>

      {/* Node 2: Airlock */}
      <div className="relative z-10 flex flex-col items-center gap-6">
         <div className="w-24 h-24 bg-[#FDFBF7] rounded-2xl shadow-lg border border-[#3D3430]/5 flex items-center justify-center relative z-10">
            <Shield className="w-10 h-10 text-[#3D3430]" />
         </div>
         <div className="text-center">
            <h3 className="font-bold text-[#3D3430] text-lg">Airlock</h3>
            <p className="text-xs text-[#3D3430]/60 font-mono mt-1">Edge PII Redaction</p>
         </div>
      </div>

      {/* Node 3: Grounding (Gold Glow) */}
      <div className="relative z-10 flex flex-col items-center gap-6">
         <motion.div 
           className="w-24 h-24 bg-[#FDFBF7] rounded-2xl shadow-lg border border-[#3D3430]/5 flex items-center justify-center relative z-10"
           animate={{
             boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 0 40px rgba(233, 196, 106, 0.6)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"],
             borderColor: ["rgba(61, 52, 48, 0.05)", "rgba(233, 196, 106, 1)", "rgba(61, 52, 48, 0.05)"],
             scale: [1, 1.1, 1]
           }}
           transition={{
             duration: 0.6,
             delay: 2.5, // Timing to match packet passing ~66%
             repeat: Infinity,
             repeatDelay: 3.4
           }}
         >
            <Scale className="w-10 h-10 text-[#E9C46A]" />
         </motion.div>
         <div className="text-center">
            <h3 className="font-bold text-[#3D3430] text-lg">Grounding</h3>
            <p className="text-xs text-[#3D3430]/60 font-mono mt-1">RAG (EU Directives)</p>
         </div>
      </div>

      {/* Node 4: Reasoning */}
      <div className="relative z-10 flex flex-col items-center gap-6">
         <div className="w-24 h-24 bg-[#FDFBF7] rounded-2xl shadow-lg border border-[#3D3430]/5 flex items-center justify-center relative z-10">
            <Brain className="w-10 h-10 text-[#3D3430]" />
         </div>
         <div className="text-center">
            <h3 className="font-bold text-[#3D3430] text-lg">Reasoning</h3>
            <p className="text-xs text-[#3D3430]/60 font-mono mt-1">GPT-4o Inference</p>
         </div>
      </div>

    </div>
  </section>
);

const SlideSecurity = () => (
  <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
    {/* Title */}
    <div className="absolute top-24 text-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Vault</h2>
        <p className="text-lg text-[#3D3430]/60 font-mono">Database-Level Immunity</p>
      </motion.div>
    </div>

    {/* Main Visual Area */}
    <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center">
      
      {/* The Shield */}
      <div className="relative z-20">
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-[#00A36C]/20 blur-3xl rounded-full" />
            
            {/* 3D Shield Icon */}
            <div className="relative z-10 drop-shadow-[0_20px_20px_rgba(0,163,108,0.4)]">
                <Shield className="w-32 h-32 text-[#00A36C] fill-[#00A36C]/10" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-[#00A36C]" />
                </div>
            </div>
        </div>
      </div>

      {/* Animation Layer */}
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-16 pointer-events-none">
        
        {/* Unauthorized Access (Red) */}
        <div className="w-full flex items-center relative h-10">
            <motion.div
                className="absolute left-[10%] flex items-center gap-2"
                animate={{ 
                    x: ["0%", "35%", "20%"], // Move to shield, bounce back
                    opacity: [0, 1, 0]
                }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 1 
                }}
            >
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Anon</span>
                <ArrowRight className="w-8 h-8 text-red-500" />
            </motion.div>
            
            {/* Impact Effect */}
            <motion.div
                className="absolute left-[48%] w-8 h-8 rounded-full border-2 border-red-500/50"
                animate={{ scale: [0.5, 1.5], opacity: [1, 0] }}
                transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatDelay: 2.5 }}
            />
        </div>

        {/* Authorized Access (Green) */}
        <div className="w-full flex items-center relative h-10">
            <motion.div
                className="absolute left-[10%] flex items-center gap-2"
                animate={{ 
                    x: ["0%", "80%"], // Pass through
                    opacity: [0, 1, 0]
                }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 1,
                    delay: 1 // Offset timing
                }}
            >
                <span className="text-xs font-bold text-[#00A36C] uppercase tracking-wider">Doctor</span>
                <ArrowRight className="w-8 h-8 text-[#00A36C]" />
            </motion.div>
        </div>

      </div>
    </div>

    {/* Code Snippet */}
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 w-full max-w-2xl bg-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl border border-[#3D3430]/10"
    >
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2D2D2D] border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-white/40 font-mono">supabase_rls.sql</span>
        </div>
        <div className="p-6 font-mono text-sm text-gray-300 leading-relaxed">
            <p><span className="text-purple-400">CREATE POLICY</span> <span className="text-green-400">"Doctors Only"</span></p>
            <p><span className="text-purple-400">ON</span> patient_logs</p>
            <p><span className="text-purple-400">FOR SELECT</span></p>
            <p><span className="text-purple-400">USING</span> (</p>
            <p className="pl-4">auth.jwt() -{'>'}{'>'} <span className="text-green-400">'role'</span> = <span className="text-green-400">'doctor'</span></p>
            <p>);</p>
        </div>
    </motion.div>

  </section>
);

const SlideScience = () => (
  <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
    {/* Title */}
    <div className="absolute top-24 text-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Science</h2>
        <p className="text-lg text-[#3D3430]/60 font-mono">The Triple Digital Twin</p>
      </motion.div>
    </div>

    {/* The Stack Container */}
    <div className="relative w-full max-w-md h-[400px] flex items-center justify-center perspective-1000">
        
        {/* Bottom Layer: Somatic (Red) */}
        <motion.div
            className="absolute w-80 h-48 bg-white rounded-2xl shadow-xl border-l-4 border-red-500 flex flex-col p-6 justify-between z-10"
            initial={{ y: 0, scale: 0.9, opacity: 0 }}
            whileInView={{ y: 140, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                    <Activity className="w-6 h-6 text-red-500" />
                </div>
                <span className="font-bold text-[#3D3430]">Somatic Twin</span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Heart Rate</span>
                    <span className="font-mono font-bold">72 BPM</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-red-500" />
                </div>
            </div>
        </motion.div>

        {/* Middle Layer: Cognitive (Blue) */}
        <motion.div
            className="absolute w-80 h-48 bg-white rounded-2xl shadow-xl border-l-4 border-blue-500 flex flex-col p-6 justify-between z-20"
            initial={{ y: 0, scale: 0.95, opacity: 0 }}
            whileInView={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <span className="font-bold text-[#3D3430]">Cognitive Twin</span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stress Load</span>
                    <span className="font-mono font-bold">Low</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[30%] bg-blue-500" />
                </div>
            </div>
        </motion.div>

        {/* Top Layer: Contextual (Green) */}
        <motion.div
            className="absolute w-80 h-48 bg-white rounded-2xl shadow-xl border-l-4 border-[#00A36C] flex flex-col p-6 justify-between z-30"
            initial={{ y: 0, scale: 1, opacity: 0 }}
            whileInView={{ y: -140, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                    <Wind className="w-6 h-6 text-[#00A36C]" />
                </div>
                <span className="font-bold text-[#3D3430]">Contextual Twin</span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">PM2.5 Exposure</span>
                    <span className="font-mono font-bold">12 µg/m³</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-[#00A36C]" />
                </div>
            </div>
        </motion.div>

    </div>

    {/* The Equation */}
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 text-center"
    >
        <p className="font-serif text-2xl md:text-3xl text-[#3D3430] italic">
            R<span className="text-sm align-sub not-italic">global</span> = 
            <span className="text-red-500 mx-2">αS</span> + 
            <span className="text-blue-500 mx-2">βC</span> + 
            <span className="text-[#00A36C] mx-2">γE</span>
        </p>
        <p className="text-xs text-[#3D3430]/40 mt-4 font-mono uppercase tracking-widest">Global Resilience Algorithm</p>
    </motion.div>

  </section>
);

const SlideFuture = () => (
  <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
    {/* Background Pattern - Topographic */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    </div>

    {/* Title */}
    <div className="absolute top-24 text-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Horizon</h2>
        <p className="text-lg text-[#3D3430]/60 font-mono">Roadmap & Partnership</p>
      </motion.div>
    </div>

    {/* Roadmap Container */}
    <div className="relative w-full max-w-5xl h-[300px] flex items-center justify-center mt-10">
        {/* The Path (SVG) */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
            {/* Background Track */}
            <motion.path
                d="M 100,150 C 300,150 300,50 500,150 C 700,250 700,150 900,150"
                fill="none"
                stroke="#3D3430"
                strokeWidth="2"
                strokeOpacity="0.1"
                strokeDasharray="10 10"
            />
            {/* Active Progress Track */}
            <motion.path
                d="M 100,150 C 300,150 300,50 500,150 C 700,250 700,150 900,150"
                fill="none"
                stroke="#00A36C"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 0.4 }} // Animates up to the second node roughly
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            />
        </svg>

        {/* Node 1: Sector 3 (Now) */}
        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-6 h-6 bg-[#00A36C] rounded-full z-10 relative shadow-[0_0_20px_#00A36C]" />
                <div className="absolute inset-0 bg-[#00A36C] rounded-full animate-ping opacity-50" />
            </div>
            <div className="text-center w-32">
                <h3 className="font-bold text-[#3D3430]">Sector 3</h3>
                <p className="text-xs text-[#00A36C] font-mono uppercase">Live Now</p>
            </div>
        </div>

        {/* Node 2: National Mesh (2026) */}
        <div className="absolute left-[50%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <div className="w-6 h-6 bg-[#3D3430] rounded-full z-10 border-4 border-[#FDFBF7]" />
            <div className="text-center w-40">
                <h3 className="font-bold text-[#3D3430]">National Mesh</h3>
                <p className="text-xs text-[#3D3430]/60 font-mono">2026 Expansion</p>
            </div>
        </div>

        {/* Node 3: Enviro-Link (2027) */}
        <div className="absolute left-[90%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <div className="w-6 h-6 bg-[#FDFBF7] border-4 border-[#3D3430]/40 rounded-full z-10" />
            <div className="text-center w-40">
                <h3 className="font-bold text-[#3D3430]/60">Enviro-Link</h3>
                <p className="text-xs text-[#3D3430]/40 font-mono">2027 Hardware</p>
            </div>
        </div>
    </div>

    {/* CTA Button */}
    <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(0, 163, 108, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="mt-16 px-12 py-6 bg-[#00A36C] text-white rounded-full text-xl font-bold tracking-wide shadow-xl flex items-center gap-3 group cursor-pointer z-20"
    >
        Initialize Pilot
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
    </motion.button>

    {/* Footer */}
    <div className="absolute bottom-8 flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#3D3430] rounded-md" />
            <span className="font-bold text-[#3D3430]">EnviroSense</span>
        </div>
        <span className="text-[#3D3430]/30">+</span>
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#00A36C]" />
            <span className="font-bold text-[#00A36C]">HazelHeartwood</span>
        </div>
    </div>

  </section>
);

// --- Main Page Shell ---

export default function HazelPresentationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5;

  // Scroll listener to update current slide indicator
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const height = container.clientHeight;
      // Calculate index based on scroll position (adding 0.5 for rounding)
      const slideIndex = Math.floor((scrollPosition + height * 0.5) / height) + 1;
      setCurrentSlide(Math.min(Math.max(slideIndex, 1), totalSlides));
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: (index - 1) * height,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="relative h-screen w-full bg-[#FDFBF7] text-[#3D3430] font-sans overflow-hidden">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <SlideContext />
        <SlideArchitecture />
        <SlideSecurity />
        <SlideScience />
        <SlideFuture />
      </div>

      {/* Presenter Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-white/80 backdrop-blur-xl border border-[#3D3430]/5 px-6 py-3 rounded-2xl shadow-2xl shadow-[#3D3430]/5 transition-all hover:scale-105">
        
        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00A36C]/10 rounded-full border border-[#00A36C]/20">
            <ShieldCheck className="w-4 h-4 text-[#00A36C]" />
            <span className="text-[10px] font-bold text-[#00A36C] uppercase tracking-widest">HazelHeartwood Mode</span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#3D3430]/10" />

        {/* Controls */}
        <div className="flex items-center gap-4">
            <button 
                onClick={() => scrollToSlide(Math.max(1, currentSlide - 1))}
                disabled={currentSlide === 1}
                className="p-2 hover:bg-[#3D3430]/5 rounded-full transition-colors disabled:opacity-30 active:scale-95"
            >
                <ChevronLeft className="w-5 h-5 text-[#3D3430]" />
            </button>

            <span className="font-mono font-bold text-[#3D3430] text-sm min-w-[60px] text-center">
                {String(currentSlide).padStart(2, '0')} <span className="text-[#3D3430]/30">/</span> {String(totalSlides).padStart(2, '0')}
            </span>

            <button 
                onClick={() => scrollToSlide(Math.min(totalSlides, currentSlide + 1))}
                disabled={currentSlide === totalSlides}
                className="p-2 hover:bg-[#3D3430]/5 rounded-full transition-colors disabled:opacity-30 active:scale-95"
            >
                <ChevronRight className="w-5 h-5 text-[#3D3430]" />
            </button>
        </div>
      </div>
    </main>
  );
}
