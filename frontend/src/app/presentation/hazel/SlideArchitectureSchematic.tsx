"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, ShieldCheck, CheckCircle, Server, BrainCircuit, Scale, RefreshCw } from "lucide-react";

const SlideArchitectureSchematic = () => {
  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden p-4">
      
      {/* Header */}
      <div className="absolute top-12 text-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#3D3430] mb-2 tracking-tight">The Engine Room.</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono uppercase tracking-widest">Neuro-Symbolic Architecture</p>
        </motion.div>
      </div>

      {/* --- MAIN DIAGRAM CONTAINER --- */}
      <div className="relative w-full max-w-[90%] h-[700px] flex items-center justify-center mt-8 scale-90 md:scale-100">
        
        {/* --- SVG LAYER (Connectors) --- */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#34d399" />
                </marker>
                 <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                </marker>
            </defs>

            {/* 1. Ingest -> Gateway */}
            <path d="M 180 350 L 280 350" stroke="#34d399" strokeWidth="4" markerEnd="url(#arrowhead)" opacity="0.5" />
            
            {/* 2. Gateway -> Engine */}
            <path d="M 420 350 L 480 350" stroke="#34d399" strokeWidth="4" markerEnd="url(#arrowhead)" opacity="0.5" />

            {/* 3. Engine -> Output */}
            <path d="M 920 350 L 980 350" stroke="#34d399" strokeWidth="4" markerEnd="url(#arrowhead)" opacity="0.5" />

            {/* 4. RAG -> Engine (Upward) */}
            <path d="M 700 580 L 700 520" stroke="#60a5fa" strokeWidth="4" markerEnd="url(#arrowhead-blue)" strokeDasharray="8 4" />

            {/* 5. RLHF Loop (Output -> Ingest) */}
            <motion.path 
                d="M 1050 300 C 1050 100, 350 100, 100 300" 
                fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray="10 10" opacity="0.3"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }}
            />
            <path d="M 100 300 L 100 310" stroke="#34d399" strokeWidth="3" markerEnd="url(#arrowhead)" opacity="0.3" />

        </svg>

        {/* --- STAGE 1: INGESTION (Left) --- */}
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 z-10">
            <motion.div 
                className="w-48 h-56 bg-[#3D3430] rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 border border-slate-700"
                whileHover={{ scale: 1.05 }}
            >
                <div className="p-4 bg-white/10 rounded-full mb-4">
                    <Server className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white font-bold text-center text-base">Raw Data Ingestion</h3>
                <p className="text-sm text-slate-400 text-center mt-2">Unstructured</p>
            </motion.div>
        </div>

        {/* --- STAGE 2: AIRLOCK (Middle-Left) --- */}
        <div className="absolute left-[22%] top-1/2 -translate-y-1/2 z-10">
            <motion.div 
                className="w-48 h-48 bg-emerald-500/10 backdrop-blur-md border-2 border-emerald-500/30 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6"
                whileHover={{ scale: 1.05 }}
            >
                <div className="p-4 bg-emerald-100 rounded-full mb-3">
                    <ShieldCheck className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-[#3D3430] font-bold text-center text-base">Secure Gateway</h3>
                <p className="text-xs text-emerald-700 font-mono text-center mt-1">PII Redacted</p>
            </motion.div>
        </div>

        {/* --- STAGE 3: FUSION ENGINE (Center - LARGE) --- */}
        <div className="absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div 
                className="w-[400px] h-[420px] bg-white/80 backdrop-blur-xl border-2 border-emerald-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 flex flex-col relative"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white border border-emerald-100 px-6 py-2 rounded-full shadow-sm">
                    <span className="font-bold text-[#3D3430] text-sm tracking-wide">NEURO-SYMBOLIC FUSION</span>
                </div>

                {/* Inner Box 1: Neural Generator */}
                <div className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-4 flex items-center gap-4 mb-2 relative overflow-hidden">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <BrainCircuit className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#3D3430] text-lg">Neural Generator</h4>
                        <p className="text-sm text-indigo-600 font-mono">Model: GPT-4o</p>
                    </div>
                    {/* Flow Animation */}
                    <motion.div 
                        className="absolute right-4 top-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <RefreshCw className="w-4 h-4 text-indigo-300" />
                    </motion.div>
                </div>

                {/* Cycle Arrows */}
                <div className="h-12 flex items-center justify-center gap-8 relative">
                    <div className="flex flex-col items-center">
                        <div className="w-0.5 h-full bg-slate-200" />
                        <span className="text-xs font-bold text-slate-400 bg-white px-2 absolute">VALIDATE</span>
                    </div>
                </div>

                {/* Inner Box 2: Symbolic Guardrails */}
                <div className="flex-1 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4 flex items-center gap-4 mt-2">
                    <div className="p-3 bg-amber-100 rounded-xl">
                        <Scale className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#3D3430] text-lg">Symbolic Safety</h4>
                        <p className="text-sm text-amber-600 font-mono">Logic: SQL/Regex</p>
                    </div>
                </div>

            </motion.div>
        </div>

        {/* --- STAGE 4: VERIFIED OUTPUT (Right) --- */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 z-10">
            <motion.div 
                className="w-48 h-56 bg-emerald-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 border border-emerald-500"
                whileHover={{ scale: 1.05 }}
            >
                <div className="p-4 bg-white/20 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-white font-bold text-center text-base">Verified Output</h3>
                <div className="mt-3 px-3 py-1 bg-white/20 rounded-full">
                    <p className="text-xs text-white font-mono">Score: 99.8%</p>
                </div>
            </motion.div>
        </div>

        {/* --- EXTERNAL: RAG BASE (Bottom) --- */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-10">
            <motion.div 
                className="flex items-center gap-4 bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
            >
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h4 className="font-bold text-[#3D3430] text-sm">RAG Knowledge Base</h4>
                    <p className="text-xs text-slate-500">Injecting EU Directives</p>
                </div>
            </motion.div>
        </div>

        {/* --- RLHF LABEL (Top) --- */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 bg-[#FDFBF7] px-4 py-1 z-0">
            <span className="text-xs font-mono text-emerald-600 tracking-widest">FUTURE: RLHF FEEDBACK LOOP</span>
        </div>

      </div>
    </section>
  );
};

export default SlideArchitectureSchematic;