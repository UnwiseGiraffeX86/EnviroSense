"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck, 
  Play
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import MapCaller from "@/components/MapCaller";
import NeuroTree from "@/components/NeuroTree";

import { 
  BucharestReality, 
  MedicalTrust, 
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
          <span className="text-brand-green">Live Safer.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-brand-brown/80 mb-10 leading-relaxed max-w-lg"
        >
          The first Neuro-Symbolic health guardian that correlates your respiratory health with Bucharest’s hyper-local air quality.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-4"
        >
          <Link href="/chat">
            <button className="flex items-center gap-2 bg-brand-green text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-brown transition-all shadow-xl shadow-brand-green/20 group">
              <ShieldCheck className="w-5 h-5" />
              Launch Sentinel
            </button>
          </Link>
          <button className="flex items-center gap-2 border border-brand-brown/20 text-brand-brown px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-brown/5 transition-all">
            <Play className="w-5 h-5" />
            How it Works
          </button>
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
          Real-time air quality data mapped to your exact location. See what you're breathing, right now.
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
          {/* Step 1: Sense */}
          <div className="flex flex-col md:flex-row gap-12 items-center relative">
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-8 h-8 bg-brand-cream border-4 border-brand-green rounded-full items-center justify-center z-10">
              <div className="w-2 h-2 bg-brand-green rounded-full" />
            </div>
            <div className="md:pl-24 flex-1">
              <span className="text-brand-orange font-bold tracking-wider text-sm uppercase mb-2 block">Step 01</span>
              <h3 className="text-3xl font-bold text-brand-brown mb-4">Sense.</h3>
              <p className="text-brand-brown/70 text-lg">We track PM2.5 & PM10 in real-time, creating a dense mesh of environmental data points around your location.</p>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-brand-brown/5">
                <div className="flex items-end gap-2 h-40">
                  {[40, 65, 45, 80, 55, 30, 60].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex-1 bg-brand-orange/80 rounded-t-md"
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-brand-brown/50 font-mono">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Analyze */}
          <div className="flex flex-col md:flex-row gap-12 items-center relative">
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-8 h-8 bg-brand-cream border-4 border-brand-green rounded-full items-center justify-center z-10">
              <div className="w-2 h-2 bg-brand-green rounded-full" />
            </div>
            <div className="md:pl-24 flex-1 order-1 md:order-none">
              <span className="text-brand-green font-bold tracking-wider text-sm uppercase mb-2 block">Step 02</span>
              <h3 className="text-3xl font-bold text-brand-brown mb-4">Analyze.</h3>
              <p className="text-brand-brown/70 text-lg">You log symptoms via secure chat. Our AI correlates your feelings with the air you breathe.</p>
            </div>
            <div className="flex-1 w-full order-2 md:order-none">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-brand-brown/5 relative">
                <div className="bg-brand-green/10 p-4 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl mb-4 max-w-[80%]">
                  <p className="text-brand-brown text-sm">I've been feeling a bit wheezy since I went for a run this morning...</p>
                </div>
                <div className="bg-brand-brown/5 p-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl ml-auto max-w-[80%]">
                  <p className="text-brand-brown text-sm">I see high PM2.5 levels in Sector 1. This correlates with your symptoms.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Connect */}
          <div className="flex flex-col md:flex-row gap-12 items-center relative">
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-8 h-8 bg-brand-cream border-4 border-brand-green rounded-full items-center justify-center z-10">
              <div className="w-2 h-2 bg-brand-green rounded-full" />
            </div>
            <div className="md:pl-24 flex-1">
              <span className="text-brand-brown font-bold tracking-wider text-sm uppercase mb-2 block">Step 03</span>
              <h3 className="text-3xl font-bold text-brand-brown mb-4">Act.</h3>
              <p className="text-brand-brown/70 text-lg">Our AI Sentinel instantly triages your symptoms and delivers actionable insights.</p>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-brand-brown text-brand-cream p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-cream/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-brand-cream" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">AI Sentinel</h4>
                    <p className="text-brand-cream/60 text-sm">Health Guardian</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-brand-green py-2 rounded-lg text-sm font-semibold hover:bg-brand-green/90 transition-colors">
                    View Insights
                  </button>
                </div>
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
      <MedicalTrust />
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
