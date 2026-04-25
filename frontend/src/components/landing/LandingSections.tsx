"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  CloudRain, 
  ShieldCheck, 
  Lock, 
  ChevronDown, 
  AlertTriangle,
  Sparkles,
  Radio,
  Brain,
  Zap,
  Check,
  ArrowUpRight,
  MessageSquare
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

// --- 2. AI Trust Strip (Authority) ---
export const AITrust = () => {
  return (
    <div className="bg-white border-y border-brand-brown/10 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-brand-green/10 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-brand-brown font-bold text-lg">AI Foundation Engine</span>
          </div>
          
          <div className="h-8 w-px bg-brand-brown/20 hidden md:block" />
          
          <p className="text-brand-brown/60 font-medium text-sm md:text-base">
            Powered by advanced LLMs and secured by EU Directives. Real-time telemetry from OpenAQ.
          </p>

          <div className="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-serif font-bold text-xl text-brand-brown">OPENAI</span>
            <span className="font-sans font-black text-xl text-brand-brown tracking-tighter">OPENAQ</span>
            <span className="font-mono font-bold text-lg text-brand-brown">SUPABASE</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- 3. Sentinel Network (4-Card Architecture) ---
export const SentinelNetwork = () => {
  const cards = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      iconBg: "bg-brand-brown/10",
      iconColor: "text-brand-brown",
      title: "Subjective Bio-Data",
      description: "Your reported symptoms, energy levels, and sleep quality logged via secure voice or chat.",
      stat: "14 signals",
      statColor: "text-brand-green",
      cardBg: "bg-white",
      textColor: "text-brand-brown",
      descColor: "text-brand-brown/60",
    },
    {
      icon: <Radio className="w-6 h-6" />,
      iconBg: "bg-brand-brown/10",
      iconColor: "text-brand-brown",
      title: "Objective Telemetry",
      description: "Hyper-local PM2.5, NO\u2082, and humidity data from our 247-station mesh in your sector.",
      stat: "247 stations",
      statColor: "text-brand-green",
      cardBg: "bg-white",
      textColor: "text-brand-brown",
      descColor: "text-brand-brown/60",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      iconBg: "bg-brand-cream/20",
      iconColor: "text-brand-cream",
      title: "Neuro-Symbolic Score",
      description: "A real-time risk assessment calculated by GPT-4o with deterministic guardrails.",
      stat: "< 200ms",
      statColor: "text-brand-green",
      statExtra: "● ",
      cardBg: "bg-brand-brown",
      textColor: "text-brand-cream",
      descColor: "text-brand-cream/70",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      iconBg: "bg-brand-brown/10",
      iconColor: "text-brand-brown",
      title: "Predictive Action",
      description: "The Sentinel pre-empts spikes — rerouting your run, triggering inhaler reminders.",
      stat: "6h forecast",
      statColor: "text-brand-green",
      cardBg: "bg-white",
      textColor: "text-brand-brown",
      descColor: "text-brand-brown/60",
    },
  ];

  return (
    <SectionWrapper className="bg-brand-cream">
      {/* Section Label */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-brand-brown/20" />
          <span className="text-brand-brown/50 text-sm font-medium uppercase tracking-widest">How it Thinks</span>
          <div className="h-px w-12 bg-brand-brown/20" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-4">The Sentinel Architecture</h2>
        <p className="text-brand-brown/70 text-lg">
          We don&apos;t guess. We correlate. By fusing two distinct data streams, we eliminate false positives and provide medical-grade insights.
        </p>
      </div>

      {/* 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={`${card.cardBg} p-7 rounded-2xl shadow-lg border border-brand-brown/10 flex flex-col justify-between relative overflow-hidden group`}
          >
            {/* Icon */}
            <div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-5 ${card.iconColor} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className={`text-lg font-bold ${card.textColor} mb-2`}>{card.title}</h3>
              <p className={`text-sm ${card.descColor} leading-relaxed`}>
                {card.description}
              </p>
            </div>
            {/* Stat Pill */}
            <div className="mt-5 pt-4 border-t border-brand-brown/5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                {card.statExtra && <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                <span className={`text-xs font-semibold ${card.statColor}`}>{card.stat}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

// --- 4. Compound Risk Showcase ---
export const CompoundRiskShowcase = () => {
  // Sparkline data points for 24h trend
  const sparklinePoints = [4, 5, 4.5, 5.5, 6, 5, 6.5, 7, 7.5, 7, 6.5, 7];
  const maxVal = Math.max(...sparklinePoints);
  const sparklineSvg = sparklinePoints
    .map((v, i) => `${(i / (sparklinePoints.length - 1)) * 100},${100 - (v / maxVal) * 80}`)
    .join(" ");

  const bulletPoints = [
    { text: "Cited.", detail: "Every score links to its EU Directive or OpenAQ data point." },
    { text: "Local-first.", detail: "Cough audio is processed at the edge — never uploaded." },
    { text: "Pre-emptive.", detail: "6-hour forecast lets you reroute before the spike hits." },
  ];

  // Bar chart data (mimicking the mockup)
  const barData = [
    { pm: 22, hr: 15 }, { pm: 28, hr: 12 }, { pm: 18, hr: 20 },
    { pm: 32, hr: 8 }, { pm: 25, hr: 18 }, { pm: 15, hr: 22 },
    { pm: 28, hr: 10 }, { pm: 35, hr: 6 }, { pm: 30, hr: 14 },
    { pm: 20, hr: 16 }, { pm: 26, hr: 12 }, { pm: 18, hr: 20 },
    { pm: 24, hr: 15 }, { pm: 30, hr: 8 }, { pm: 22, hr: 18 },
    { pm: 12, hr: 24 },
  ];

  const getBarColor = (pm: number) => {
    if (pm >= 30) return "#E07A5F"; // coral/red
    if (pm >= 22) return "#F4A259"; // orange/yellow
    return "#00A36C"; // green
  };

  return (
    <SectionWrapper className="bg-brand-cream">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy + Bullet Points */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-brand-brown/20" />
            <span className="text-brand-brown/50 text-sm font-medium uppercase tracking-widest">A Sample Risk Card</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-4 leading-tight">
            Your <span className="text-brand-green">Compound Risk</span>, every five minutes.
          </h2>
          <p className="text-lg text-brand-brown/70 leading-relaxed mb-8">
            The Sentinel fuses subjective + objective signals into a single 1–10 score. Below 4: breathe easy. Above 7: act now. Citations open in one tap.
          </p>

          {/* Bullet points */}
          <div className="space-y-4">
            {bulletPoints.map((bp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 bg-white rounded-xl p-4 border border-brand-brown/5 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-brand-green" />
                </div>
                <p className="text-brand-brown text-sm">
                  <span className="font-bold">{bp.text}</span>{" "}{bp.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Risk Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl border border-brand-brown/10 overflow-hidden"
        >
          {/* Card Header */}
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider">Live · Last sync 4s ago</span>
              </div>
              <span className="text-xs font-mono text-brand-brown/30">1d_38a4f</span>
            </div>

            <div className="flex items-start gap-8">
              {/* Risk Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28">
                  {/* Background arc */}
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#f0ebe3" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 104 * 0.75} ${Math.PI * 104 * 0.25}`}
                    />
                    {/* Filled arc — 70% of 75% range */}
                    <circle cx="60" cy="60" r="52" fill="none" stroke="url(#riskGradient)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 104 * 0.525} ${Math.PI * 104 * 0.475}`}
                    />
                    <defs>
                      <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00A36C" />
                        <stop offset="50%" stopColor="#F4A259" />
                        <stop offset="100%" stopColor="#E07A5F" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-wider">Risk</span>
                    <span className="text-3xl font-black text-brand-brown">7.0</span>
                    <span className="text-xs font-bold text-brand-orange">Critical</span>
                  </div>
                </div>
              </div>

              {/* Trend + Recommendation */}
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <span className="text-xs font-bold text-brand-brown/40 uppercase tracking-wider">Trend · 24h</span>
                  {/* Sparkline */}
                  <svg viewBox="0 0 100 40" className="w-full h-10 mt-1">
                    <polyline
                      points={sparklineSvg}
                      fill="none"
                      stroke="#00A36C"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {/* End dot */}
                    <circle cx="100" cy={`${100 - (sparklinePoints[sparklinePoints.length - 1] / maxVal) * 80}`} r="2.5" fill="#E07A5F" />
                  </svg>
                </div>
                {/* Recommendation bubble */}
                <div className="bg-brand-green/10 rounded-xl p-3 border border-brand-green/20">
                  <p className="text-xs text-brand-brown leading-relaxed">
                    <span className="font-bold text-brand-green">Sentinel:</span> Move your 18:00 walk to Herăstrău Park — 42% lower exposure than your usual route.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-3 divide-x divide-brand-brown/5 mt-6 border-t border-brand-brown/5">
            <div className="p-4 text-center">
              <div className="text-xs font-bold text-brand-brown/40 uppercase tracking-wider mb-1">PM2.5</div>
              <div className="text-lg font-black text-brand-brown">34.2 <span className="text-xs font-normal text-brand-brown/40">µg/m³</span></div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs font-bold text-brand-brown/40 uppercase tracking-wider mb-1">HR Var</div>
              <div className="text-lg font-black text-brand-brown">48 <span className="text-xs font-normal text-brand-brown/40">ms</span></div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs font-bold text-brand-brown/40 uppercase tracking-wider mb-1">Sleep Δ</div>
              <div className="text-lg font-black text-brand-orange">−8 <span className="text-xs font-normal text-brand-brown/40">%</span></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Colorful Bar Chart Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-brand-brown/10"
      >
        <div className="flex items-end gap-1.5 h-24">
          {barData.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col gap-0.5 h-full justify-end">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(bar.pm / 40) * 100}%` }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="w-full rounded-t-sm"
                style={{ backgroundColor: getBarColor(bar.pm) }}
              />
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(bar.hr / 30) * 100}%` }}
                transition={{ duration: 0.4, delay: i * 0.03 + 0.1 }}
                className="w-full rounded-t-sm"
                style={{ backgroundColor: getBarColor(bar.pm), opacity: 0.4 }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs font-mono text-brand-brown/40">
          <span>06:00</span>
          <span>now</span>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};

// --- 5. Chat Preview ---
export const ChatPreview = () => {
  return (
    <SectionWrapper className="bg-brand-cream">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Chat Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-brand-green/10 rounded-2xl rounded-br-md px-5 py-3 max-w-[75%] border border-brand-green/20">
              <p className="text-brand-brown text-sm">Wheezy since this morning&apos;s run.</p>
            </div>
          </div>

          {/* AI response 1 */}
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 max-w-[85%] border border-brand-brown/10 shadow-sm">
              <p className="text-brand-brown text-sm">
                High PM2.5 spike at 07:14 in Sector 5.{" "}
                <span className="text-brand-green/70 text-xs font-medium cursor-pointer hover:text-brand-green transition-colors">[citation]</span>
              </p>
            </div>
          </div>

          {/* AI response 2 */}
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 max-w-[85%] border border-brand-brown/10 shadow-sm">
              <p className="text-brand-brown text-sm">
                Suggesting Herăstrău route tomorrow.
              </p>
            </div>
          </div>

          {/* Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-brand-brown rounded-2xl p-5 shadow-xl mt-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-brand-cream/10 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-brand-cream" />
              </div>
              <span className="text-brand-cream font-bold text-sm">AI Sentinel</span>
            </div>
            <button className="w-full bg-brand-green text-white py-2.5 rounded-xl font-bold text-sm hover:bg-brand-green/90 transition-colors shadow-lg shadow-brand-green/30">
              Reroute Accepted
            </button>
            <p className="text-center text-brand-cream/50 text-xs mt-2">
              Saved 18min · −42% PM2.5 exposure
            </p>
          </motion.div>
        </motion.div>

        {/* Right: Copy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-brand-brown/20" />
            <span className="text-brand-brown/50 text-sm font-medium uppercase tracking-widest">The Conversation</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-6 leading-tight">
            It doesn&apos;t just <span className="text-brand-green">chat</span>. It acts.
          </h2>
          <p className="text-lg text-brand-brown/70 leading-relaxed mb-8">
            When the Sentinel detects an environmental spike correlating with your symptoms, it doesn&apos;t wait for you to ask. It surfaces the data, cites the source, and proposes an action — all within the conversation.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-brown/10 text-sm text-brand-brown/70">
              <MessageSquare className="w-4 h-4 text-brand-green" />
              <span>Natural language</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-brown/10 text-sm text-brand-brown/70">
              <ArrowUpRight className="w-4 h-4 text-brand-green" />
              <span>Cited sources</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-brown/10 text-sm text-brand-brown/70">
              <Zap className="w-4 h-4 text-brand-green" />
              <span>One-tap actions</span>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

// --- 6. Validated Performance (Social Proof) ---
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

// --- 7. Zero-Trust FAQ (Objection Handling) ---
export const ZeroTrustFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who sees my health data?",
      a: "Only you. We use Row Level Security (RLS) in our database, meaning even our system administrators cannot query your specific health records. It is a Zero-Trust architecture by design."
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
