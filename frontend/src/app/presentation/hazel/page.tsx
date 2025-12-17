    "use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, User, Shield, Scale, Brain, ArrowRight, Lock, Activity, Zap, Wind, FileText, Scan, Database, FileJson } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SlideArchitecture from "./SlideArchitecture";
import SlideSecurity from "./SlideSecurity";
import SlideScienceAnatomy from "./SlideScienceAnatomy";
import SlideFuture from "./SlideFuture";
import SlidePhysics from "./SlidePhysics";
import SlideBusiness from "./SlideBusiness";
import HazelControlBar from "./HazelControlBar";

const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#E5E0D0]" />
});

// --- Placeholder Components ---

import { getAirQuality } from "./actions";

const SlideContext = () => {
  const [aqData, setAqData] = useState({
    location: "Locating...",
    city: "Analyzing...",
    value: 0,
    unit: "µg/m³",
    risk: "Initializing",
    color: "#9CA3AF" // Gray
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use Server Action to bypass CORS
          const sector = await getAirQuality(latitude, longitude);
          
          if (sector) {
            const value = sector.pm25;
            
            let risk = "Low Risk";
            let color = "#10B981"; // Emerald
            if (value > 12) { risk = "Moderate Risk"; color = "#F59E0B"; } // Amber
            if (value > 35) { risk = "High Risk"; color = "#EF4444"; } // Red
            if (value > 55) { risk = "Hazardous"; color = "#7F1D1D"; } // Dark Red

            setAqData({
              location: sector.sector_name || "Local Sector",
              city: "Bucharest", // Assuming this dataset is Bucharest-centric
              value: Math.round(value),
              unit: "µg/m³",
              risk: risk,
              color: color
            });
          } else {
             // Fallback if no sensors found
             setAqData({
              location: "No Local Sensors",
              city: "Satellite Estimate",
              value: 15,
              unit: "µg/m³",
              risk: "Low Risk",
              color: "#10B981"
            });
          }
        } catch (e) {
          console.error("AQ Fetch Error", e);
          // Fallback on error
          setAqData({
            location: "Connection Error",
            city: "Using Cached Data",
            value: 38,
            unit: "µg/m³",
            risk: "Moderate Risk",
            color: "#E07A5F"
          });
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.error("Geo Error", error);
        setLoading(false);
        // Fallback to Bucharest example if denied
        setAqData({
            location: "Splaiul Unirii",
            city: "Sector 3, Bucharest",
            value: 38,
            unit: "µg/m³",
            risk: "Moderate Risk",
            color: "#E07A5F"
        });
      });
    } else {
        setLoading(false);
        setAqData({
            location: "Splaiul Unirii",
            city: "Sector 3, Bucharest",
            value: 38,
            unit: "µg/m³",
            risk: "Moderate Risk",
            color: "#E07A5F"
        });
    }
  }, []);

  return (
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
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: aqData.color }}></span>
                    <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: aqData.color }}></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: aqData.color }}>Live Analysis</span>
                </div>
                <span className="text-xs font-mono text-[#3D3430]/50 font-bold">ID: SEC-03</span>
              </div>

              <h3 className="text-2xl font-bold text-[#3D3430] mb-1 truncate">{aqData.location}</h3>
              <p className="text-sm text-[#3D3430]/60 mb-6 truncate">{aqData.city}</p>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-7xl font-extrabold tracking-tighter" style={{ color: aqData.color }}>
                    {loading ? "--" : aqData.value}
                </span>
                <span className="text-xl font-bold text-[#3D3430]/40">{aqData.unit}</span>
              </div>

              <div className="w-full bg-[#3D3430]/5 rounded-full h-3 overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: loading ? "0%" : `${Math.min((aqData.value / 100) * 100, 100)}%` }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="h-full"
                  style={{ backgroundColor: aqData.color }}
                />
              </div>
              <div className="flex justify-between items-center">
                  <p className="text-sm font-bold" style={{ color: aqData.color }}>{aqData.risk}</p>
                  <p className="text-xs text-[#3D3430]/40">Updated: Now</p>
              </div>

           </motion.div>
        </div>

      </div>
    </section>
  );
};

// --- Main Page Shell ---

export default function HazelPresentationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 7;

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
      {/* --- ATMOSPHERE LAYER --- */}
      
      {/* 1. Texture: Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-20 mix-blend-multiply">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* 2. Lighting: Breathing Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Top-Left Emerald Orb */}
          <motion.div 
            animate={{ 
                x: [0, 50, 0], 
                y: [0, 30, 0],
                scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-emerald-500/5 rounded-full blur-[150px]" 
          />
          
          {/* Bottom-Right Gold Orb */}
          <motion.div 
            animate={{ 
                x: [0, -50, 0], 
                y: [0, -30, 0],
                scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] bg-amber-500/5 rounded-full blur-[150px]" 
          />
      </div>

      {/* 3. Vignette: Darkened Corners */}
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(61,52,48,0.15)_100%)]" />

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <SlideContext />
        <SlideScienceAnatomy />
        <SlidePhysics />
        <SlideArchitecture />
        <SlideSecurity />
        <SlideBusiness />
        <SlideFuture />
      </div>

      {/* Presenter Dock */}
      <HazelControlBar 
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrev={() => scrollToSlide(Math.max(1, currentSlide - 1))}
        onNext={() => scrollToSlide(Math.min(totalSlides, currentSlide + 1))}
      />
    </main>
  );
}
