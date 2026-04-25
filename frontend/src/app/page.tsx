"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck, 
  ChevronDown,
  Lock,
  Wind,
  Sparkles,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import MapCaller from "@/components/MapCaller";
import NeuroTree from "@/components/NeuroTree";

import { 
  BucharestReality, 
  AITrust, 
  SentinelNetwork, 
  ValidatedPerformance, 
  ZeroTrustFAQ 
} from "@/components/landing/LandingSections";

// --- Components ---

const Navbar = () => (
  <motion.nav 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
  >
    <div className="bg-brand-cream/80 backdrop-blur-md border border-brand-brown/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-sm">
      <div className="flex items-center gap-6 text-sm font-medium text-brand-brown/80">
        <Link href="#mission" className="hover:text-brand-green transition-colors">Mission</Link>
        <Link href="#map" className="hover:text-brand-green transition-colors">Live Map</Link>
        <Link href="/auth" className="hover:text-brand-green transition-colors">Login</Link>
      </div>
      <Link href="/auth?mode=signup">
        <button className="bg-brand-green text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-brown transition-colors shadow-lg shadow-brand-green/20">
          Check My Risk
        </button>
      </Link>
    </div>
  </motion.nav>
);

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 pt-32 pb-20 relative overflow-hidden">
      {/* Text Content */}
      <div className="flex-1 z-10 max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl lg:text-7xl font-bold text-brand-brown leading-[1.1] mb-6"
        >
          Breathe Smarter. <br />
          <span className="text-brand-green italic">Live Safer.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-brand-brown/70 mb-8 leading-relaxed max-w-lg"
        >
          The first <span className="font-bold text-brand-brown">Neuro-Symbolic</span> health guardian that correlates your respiratory health with Bucharest&apos;s hyper-local air quality — in milliseconds.
        </motion.p>

        {/* Live Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-3 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-brand-brown/10 rounded-xl px-4 py-3 flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-brand-brown/40" />
                <span className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-wider">Your AQI</span>
              </div>
              <span className="text-[10px] font-bold text-brand-green">+3</span>
            </div>
            <div className="text-2xl font-black text-brand-brown">82<span className="text-sm font-normal text-brand-brown/40">/100</span></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-brand-brown/10 rounded-xl px-4 py-3 flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-brown/40" />
                <span className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-wider">Breath Rate</span>
              </div>
              <span className="text-[10px] font-bold text-brand-brown/40">stable</span>
            </div>
            <div className="text-2xl font-black text-brand-brown">14 <span className="text-sm font-normal text-brand-brown/40">bpm</span></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-brand-brown/10 rounded-xl px-4 py-3 flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-brown/40" />
                <span className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-wider">Sector PM2.5</span>
              </div>
              <span className="text-[10px] font-bold text-brand-orange">↑ 12%</span>
            </div>
            <div className="text-2xl font-black text-brand-brown">34.2 <span className="text-sm font-normal text-brand-brown/40">µg</span></div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link href="/chat">
            <button className="flex items-center gap-2 bg-brand-green text-white px-7 py-3.5 rounded-full font-semibold text-base hover:bg-brand-brown transition-all shadow-xl shadow-brand-green/20">
              <Sparkles className="w-4 h-4" />
              Launch Sentinel
            </button>
          </Link>
          <button className="flex items-center gap-2 border border-brand-brown/20 text-brand-brown px-7 py-3.5 rounded-full font-semibold text-base hover:bg-brand-brown/5 transition-all">
            <ChevronDown className="w-4 h-4" />
            How it Works
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-4 text-xs text-brand-brown/40"
        >
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>Zero-Trust by design</span>
          </div>
          <div className="w-px h-3 bg-brand-brown/20" />
          <span>Free for Bucharest residents · 2026 cohort</span>
        </motion.div>
      </div>

      {/* Visual Composition */}
      <div className="flex-1 relative h-[600px] w-full flex items-center justify-center mt-10 lg:mt-0">
        {/* Circle 1: Environment (Pollution) */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute w-[500px] h-[500px] rounded-full bg-brand-orange/20 blur-3xl -translate-x-10 -translate-y-10"
        />
        
        {/* Circle 2: You (Health) */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute w-[500px] h-[500px] rounded-full bg-brand-green/20 blur-3xl translate-x-10 translate-y-10"
        />

        {/* The Neuro Connection (Intersection) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute z-20 w-full h-full flex items-center justify-center -mt-48"
        >
          <NeuroTree />
        </motion.div>
      </div>
    </section>
  );
};



const LiveMapSection = () => (
  <section id="map" className="py-20 px-6 lg:px-20 bg-brand-cream relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-brand-brown mb-4">Live Environmental Pulse</h2>
        <p className="text-brand-brown/60 max-w-2xl mx-auto">
          Real-time air quality data mapped to your exact location. See what you&apos;re breathing, right now.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-brand-brown/10 relative z-10"
      >
        <MapCaller />
      </motion.div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
    </div>
  </section>
);

const FeatureShowcase = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.4", "end 0.7"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Sparkline for the risk card
  const sparklinePoints = [4, 5, 4.5, 5.5, 6, 5, 6.5, 7, 7.5, 7, 6.5, 7];
  const maxVal = Math.max(...sparklinePoints);
  const sparklineSvg = sparklinePoints
    .map((v, i) => `${(i / (sparklinePoints.length - 1)) * 100},${100 - (v / maxVal) * 80}`)
    .join(" ");

  // Bar chart data
  const barData = [
    { pm: 22, hr: 15 }, { pm: 28, hr: 12 }, { pm: 18, hr: 20 },
    { pm: 32, hr: 8 }, { pm: 25, hr: 18 }, { pm: 15, hr: 22 },
    { pm: 28, hr: 10 }, { pm: 35, hr: 6 }, { pm: 30, hr: 14 },
    { pm: 20, hr: 16 }, { pm: 26, hr: 12 }, { pm: 18, hr: 20 },
    { pm: 24, hr: 15 }, { pm: 30, hr: 8 }, { pm: 22, hr: 18 },
    { pm: 12, hr: 24 },
  ];

  const getBarColor = (pm: number) => {
    if (pm >= 30) return "#E07A5F";
    if (pm >= 22) return "#F4A259";
    return "#00A36C";
  };

  return (
    <section className="py-32 px-6 lg:px-20 relative overflow-hidden" ref={containerRef}>
      {/* Background Specs */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-brand-green/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-brand-brown/10 hidden md:block">
          <motion.div 
            style={{ height: lineHeight }}
            className="w-full bg-brand-green origin-top"
          />
        </div>

        <div className="space-y-32">
          {/* Step 1: Sense — Compound Risk Card */}
          <div className="flex flex-col md:flex-row gap-12 items-center relative">
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-8 h-8 bg-brand-cream border-4 border-brand-green rounded-full items-center justify-center z-10">
              <div className="w-2 h-2 bg-brand-green rounded-full" />
            </div>
            <div className="md:pl-24 flex-1">
              <span className="text-brand-orange font-bold tracking-wider text-sm uppercase mb-2 block">Step 01</span>
              <h3 className="text-3xl font-bold text-brand-brown mb-4">Sense.</h3>
              <p className="text-brand-brown/70 text-lg">Your Compound Risk, every five minutes. The Sentinel fuses subjective + objective signals into a single 1–10 score.</p>
            </div>
            <div className="flex-1 w-full">
              {/* Risk Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-brand-brown/5 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                      <span className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-wider">Live · Last sync 4s ago</span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-brown/30">1d_38a4f</span>
                  </div>
                  <div className="flex items-start gap-6">
                    {/* Gauge */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="relative w-20 h-20">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="#f0ebe3" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={`${Math.PI * 104 * 0.75} ${Math.PI * 104 * 0.25}`} />
                          <circle cx="60" cy="60" r="52" fill="none" stroke="url(#riskGrad)" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={`${Math.PI * 104 * 0.525} ${Math.PI * 104 * 0.475}`} />
                          <defs>
                            <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#00A36C" />
                              <stop offset="50%" stopColor="#F4A259" />
                              <stop offset="100%" stopColor="#E07A5F" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[8px] font-bold text-brand-brown/40 uppercase">Risk</span>
                          <span className="text-2xl font-black text-brand-brown leading-none">7.0</span>
                          <span className="text-[9px] font-bold text-brand-orange">Critical</span>
                        </div>
                      </div>
                    </div>
                    {/* Sparkline + Recommendation */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-wider">Trend · 24h</span>
                      <svg viewBox="0 0 100 30" className="w-full h-7 mt-1">
                        <polyline points={sparklineSvg} fill="none" stroke="#00A36C" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                        <circle cx="100" cy={`${100 - (sparklinePoints[sparklinePoints.length - 1] / maxVal) * 80}`} r="2" fill="#E07A5F" />
                      </svg>
                      <div className="bg-brand-green/10 rounded-lg p-2 mt-2 border border-brand-green/20">
                        <p className="text-[10px] text-brand-brown leading-relaxed">
                          <span className="font-bold text-brand-green">Sentinel:</span> Move your 18:00 walk to Herăstrău Park — 42% lower exposure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-brand-brown/5 border-t border-brand-brown/5">
                  <div className="p-3 text-center">
                    <div className="text-[9px] font-bold text-brand-brown/40 uppercase">PM2.5</div>
                    <div className="text-sm font-black text-brand-brown">34.2 <span className="text-[9px] font-normal text-brand-brown/40">µg/m³</span></div>
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-[9px] font-bold text-brand-brown/40 uppercase">HR Var</div>
                    <div className="text-sm font-black text-brand-brown">48 <span className="text-[9px] font-normal text-brand-brown/40">ms</span></div>
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-[9px] font-bold text-brand-brown/40 uppercase">Sleep Δ</div>
                    <div className="text-sm font-black text-brand-orange">−8 <span className="text-[9px] font-normal text-brand-brown/40">%</span></div>
                  </div>
                </div>
              </div>
              {/* Bar Chart */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-brown/5 mt-3">
                <div className="flex items-end gap-1 h-16">
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
                <div className="flex justify-between mt-2 text-[9px] font-mono text-brand-brown/40">
                  <span>06:00</span>
                  <span>now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Analyze — Chat Preview */}
          <div className="flex flex-col md:flex-row gap-12 items-center relative">
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-8 h-8 bg-brand-cream border-4 border-brand-green rounded-full items-center justify-center z-10">
              <div className="w-2 h-2 bg-brand-green rounded-full" />
            </div>
            <div className="md:pl-24 flex-1 order-1 md:order-none">
              <span className="text-brand-green font-bold tracking-wider text-sm uppercase mb-2 block">Step 02</span>
              <h3 className="text-3xl font-bold text-brand-brown mb-4">Analyze.</h3>
              <p className="text-brand-brown/70 text-lg">You log symptoms via secure chat. The AI correlates your data with the air you breathe, and cites every source.</p>
            </div>
            <div className="flex-1 w-full order-2 md:order-none">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-brand-brown/5 space-y-2">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-brand-green/10 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] border border-brand-green/20">
                    <p className="text-brand-brown text-sm">Wheezy since this morning&apos;s run.</p>
                  </div>
                </div>
                {/* AI response */}
                <div className="flex justify-start">
                  <div className="bg-brand-brown/5 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-brand-brown text-sm">
                      High PM2.5 spike at 07:14 in Sector 5.{" "}
                      <span className="text-brand-green/70 text-xs font-medium">[citation]</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-brand-brown/5 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-brand-brown text-sm">Suggesting Herăstrău route tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Act — AI Sentinel Action Card */}
          <div className="flex flex-col md:flex-row gap-12 items-center relative">
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-8 h-8 bg-brand-cream border-4 border-brand-green rounded-full items-center justify-center z-10">
              <div className="w-2 h-2 bg-brand-green rounded-full" />
            </div>
            <div className="md:pl-24 flex-1">
              <span className="text-brand-brown font-bold tracking-wider text-sm uppercase mb-2 block">Step 03</span>
              <h3 className="text-3xl font-bold text-brand-brown mb-4">Act.</h3>
              <p className="text-brand-brown/70 text-lg">The AI Sentinel doesn&apos;t just chat — it proposes and executes actions to protect your health.</p>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-brand-brown text-brand-cream p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-brand-cream/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand-cream" />
                  </div>
                  <span className="font-bold text-sm">AI Sentinel</span>
                </div>
                <button className="w-full bg-brand-green py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green/90 transition-colors shadow-lg shadow-brand-green/30">
                  Reroute Accepted
                </button>
                <p className="text-center text-brand-cream/50 text-xs mt-2">
                  Saved 18min · −42% PM2.5 exposure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



const Footer = () => (
  <footer className="bg-brand-cream border-t border-brand-brown/10 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-brand-brown">Eco-Neuro Sentinel</span>
      </div>
      <div className="text-brand-brown/60 text-sm">
        © 2025 Eco-Neuro Sentinel. All rights reserved.
      </div>
      <div className="flex gap-6 text-sm font-medium text-brand-brown/80">
        <Link href="#" className="hover:text-brand-green">Privacy</Link>
        <Link href="#" className="hover:text-brand-green">Terms</Link>
        <Link href="#" className="hover:text-brand-green">Contact</Link>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <main className="bg-brand-cream min-h-screen selection:bg-brand-green selection:text-white">
      <Navbar />
      <Hero />
      <AITrust />
      <BucharestReality />
      <LiveMapSection />
      <SentinelNetwork />
      <FeatureShowcase />
      <ValidatedPerformance />
      <ZeroTrustFAQ />
      <Footer />
    </main>
  );
}
