"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Play
} from "lucide-react";
import Link from "next/link";

import MapCaller from "@/components/MapCaller";
import NeuroTree from "@/components/NeuroTree";

import { 
  BucharestReality, 
  AITrust, 
  SentinelNetwork, 
  CompoundRiskShowcase,
  ChatPreview,
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
      <CompoundRiskShowcase />
      <ChatPreview />
      <ValidatedPerformance />
      <ZeroTrustFAQ />
      <Footer />
    </main>
  );
}
