"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  CloudRain, 
  ShieldCheck, 
  Lock, 
  Stethoscope, 
  ChevronDown, 
  AlertTriangle
} from "lucide-react";

// --- Shared Wrapper ---
export const SectionWrapper = ({ 
  children, 
  className = "", 
  id = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
  id?: string;
}) => (
  <section id={id} className={`py-24 px-6 lg:px-20 relative overflow-hidden ${className}`}>
    <div className="max-w-7xl mx-auto relative z-10">
      {children}
    </div>
  </section>
);

// --- 1. Bucharest Reality (The Problem) ---
export const BucharestReality = () => {
  return (
    <SectionWrapper className="bg-brand-cream">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Visual Data */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-brand-brown/10 relative overflow-hidden">
            <h3 className="text-brand-brown/60 text-sm font-bold uppercase tracking-wider mb-8">Annual PM2.5 Average (µg/m³)</h3>
            
            <div className="flex gap-4 h-64 items-end">
              {/* WHO Safe Limit (5) */}
              <div className="h-full flex-1 flex flex-col justify-end gap-2 group">
                <div className="text-center text-brand-green font-bold opacity-0 group-hover:opacity-100 transition-opacity">5</div>
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: "17%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-full bg-brand-green/20 rounded-t-xl relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-green" />
                </motion.div>
                <p className="text-center text-[10px] font-bold text-brand-brown/40">WHO</p>
              </div>

              {/* EU 2024 Limit (10) */}
              <div className="h-full flex-1 flex flex-col justify-end gap-2 group">
                <div className="text-center text-brand-yellow font-bold opacity-0 group-hover:opacity-100 transition-opacity">10</div>
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: "33%" }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                  className="w-full bg-brand-yellow/20 rounded-t-xl relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow" />
                </motion.div>
                <p className="text-center text-[10px] font-bold text-brand-brown/60">EU '24</p>
              </div>

              {/* Bucharest (28.4) */}
              <div className="h-full flex-1 flex flex-col justify-end gap-2 group">
                <div className="text-center text-brand-orange font-bold opacity-0 group-hover:opacity-100 transition-opacity">28.4</div>
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: "95%" }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="w-full bg-brand-orange/20 rounded-t-xl relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange" />
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg z-10">
                    184% &gt; EU Limit
                  </div>
                </motion.div>
                <p className="text-center text-[10px] font-bold text-brand-brown">Bucharest</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Copy */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-brand-orange/20">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Health Alert</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-6 leading-tight">
              Bucharest exceeds the new <span className="text-brand-orange">EU 2024 Directive</span> limits.
            </h2>
            <p className="text-lg text-brand-brown/80 leading-relaxed mb-8">
              Directive 2024/2881 slashes the PM2.5 limit to 10 µg/m³. Bucharest is nearly triple that. 
              While legislation catches up, EnviroSense gives you the personal data to protect your lungs today.
            </p>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

// --- 2. Medical Trust Strip (Authority) ---
export const MedicalTrust = () => {
  return (
    <div className="bg-white border-y border-brand-brown/10 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-brand-green/10 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-brand-brown font-bold text-lg">Medical Advisory Board</span>
          </div>
          
          <div className="h-8 w-px bg-brand-brown/20 hidden md:block" />
          
          <p className="text-brand-brown/60 font-medium text-sm md:text-base">
            Protocols validated by Pulmonologists. Data secured by EU Directives.
          </p>

          <div className="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos */}
            <span className="font-serif font-bold text-xl text-brand-brown">MEDLIFE</span>
            <span className="font-sans font-black text-xl text-brand-brown tracking-tighter">REGINA MARIA</span>
            <span className="font-mono font-bold text-lg text-brand-brown">SANADOR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Sentinel Network (Data Transparency) ---
export const SentinelNetwork = () => {
  return (
    <SectionWrapper className="bg-brand-cream">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-brand-brown mb-4">The Sentinel Architecture</h2>
        <p className="text-brand-brown/80">
          We don't guess. We correlate. By fusing two distinct data streams, we eliminate false positives and provide medical-grade insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-green/30 to-transparent -z-10 border-t border-dashed border-brand-green/40" />

        {/* Input 1 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-brand-brown/10 relative z-10"
        >
          <div className="w-14 h-14 bg-brand-brown/10 rounded-2xl flex items-center justify-center mb-6 mx-auto text-brand-brown">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-brand-brown text-center mb-2">Subjective Bio-Data</h3>
          <p className="text-brand-brown/60 text-center text-sm">
            Your reported symptoms, energy levels, and sleep quality logged via secure voice or text.
          </p>
        </motion.div>

        {/* Input 2 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-brand-brown/10 relative z-10"
        >
          <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6 mx-auto text-brand-green">
            <CloudRain className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-brand-brown text-center mb-2">Objective Telemetry</h3>
          <p className="text-brand-brown/60 text-center text-sm">
            Hyper-local PM2.5, NO2, and humidity data from our dense sensor mesh in your sector.
          </p>
        </motion.div>

        {/* Result */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-brand-brown p-8 rounded-3xl shadow-xl shadow-brand-brown/20 border border-brand-brown relative z-10"
        >
          <div className="w-14 h-14 bg-brand-cream/10 rounded-2xl flex items-center justify-center mb-6 mx-auto text-brand-cream">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-brand-cream text-center mb-2">Neuro-Symbolic Score</h3>
          <p className="text-brand-cream/80 text-center text-sm">
            A real-time risk assessment calculated by GPT-4o with strict medical guardrails.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

// --- 4. Validated Performance (Social Proof) ---
export const ValidatedPerformance = () => {
  const stats = [
    { label: "Synthetic Scenarios Tested", value: "10,000+", sub: "Before real-world deployment" },
    { label: "Real-time Alert Latency", value: "< 200ms", sub: "From sensor to dashboard" },
    { label: "Compliance Standard", value: "EU 2024/2881", sub: "Air Quality Directive Ready" },
  ];

  return (
    <SectionWrapper className="bg-brand-brown text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-brand-cream/10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="text-center px-4 pt-8 md:pt-0"
          >
            <div className="text-4xl lg:text-5xl font-bold text-brand-yellow mb-2">{stat.value}</div>
            <div className="text-lg font-bold text-brand-cream mb-1">{stat.label}</div>
            <div className="text-sm text-brand-cream/60">{stat.sub}</div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

// --- 5. Zero-Trust FAQ (Objection Handling) ---
export const ZeroTrustFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who sees my health data?",
      a: "Only you and your assigned doctor. We use Row Level Security (RLS) in our database, meaning even our system administrators cannot query your specific health records. It is a Zero-Trust architecture by design."
    },
    {
      q: "How do you calculate risk?",
      a: "We use a Neuro-Symbolic approach. We combine your subjective symptom logs with objective hyper-local sensor data (PM2.5). OpenAI's GPT-4o correlates these inputs to find patterns, but strict SQL constraints prevent any 'hallucinations' or false medical advice."
    },
    {
      q: "Is this a replacement for emergency care?",
      a: "No. EnviroSense is a predictive monitoring tool for chronic management and prevention. It does not replace 112 or emergency services. If you are experiencing a medical emergency, contact emergency services immediately."
    }
  ];

  return (
    <SectionWrapper className="bg-brand-cream">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-brown/5 px-3 py-1 rounded-full text-xs font-bold text-brand-brown/80 mb-4">
            <Lock className="w-3 h-3" />
            <span>Privacy First</span>
          </div>
          <h2 className="text-3xl font-bold text-brand-brown">Common Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-brand-brown/10 overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-brown/5 transition-colors"
              >
                <span className="font-bold text-brand-brown text-lg">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-brand-brown/40 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-brand-brown/80 leading-relaxed border-t border-brand-brown/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
