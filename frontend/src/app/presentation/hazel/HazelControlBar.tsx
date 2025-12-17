"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HazelControlBarProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
}

const HazelControlBar: React.FC<HazelControlBarProps> = ({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
}) => {
  const isLastSlide = currentSlide === totalSlides;

  return (
    <motion.div
      layout
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-white/30 backdrop-blur-md border border-white/50 px-6 py-3 rounded-full shadow-2xl shadow-[#3D3430]/10 transition-colors hover:bg-white/40"
      style={{ minWidth: isLastSlide ? "400px" : "auto" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Badge */}
      <motion.div layout className="flex items-center gap-2 px-3 py-1.5 bg-[#00A36C]/10 rounded-full border border-[#00A36C]/20">
        <ShieldCheck className="w-4 h-4 text-[#00A36C]" />
        <span className="text-[10px] font-bold text-[#00A36C] uppercase tracking-widest whitespace-nowrap">
          HazelHeartwood Mode
        </span>
      </motion.div>

      {/* The Expansion: Start Demo Button */}
      <AnimatePresence mode="popLayout">
        {isLastSlide && (
          <motion.div
            initial={{ width: 0, opacity: 0, scale: 0.8 }}
            animate={{ width: "auto", opacity: 1, scale: 1 }}
            exit={{ width: 0, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="overflow-hidden"
          >
            <Link
              href="/"
              className="flex items-center gap-2 bg-[#F97316] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105 whitespace-nowrap mx-2"
            >
              <span className="animate-pulse">Start Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <motion.div layout className="w-px h-8 bg-[#3D3430]/10" />

      {/* Controls */}
      <motion.div layout className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={currentSlide === 1}
          className="p-2 hover:bg-[#3D3430]/5 rounded-full transition-colors disabled:opacity-30 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-[#3D3430]" />
        </button>

        <span className="font-mono font-bold text-[#3D3430] text-sm min-w-[60px] text-center whitespace-nowrap">
          {String(currentSlide).padStart(2, "0")}{" "}
          <span className="text-[#3D3430]/30">/</span>{" "}
          {String(totalSlides).padStart(2, "0")}
        </span>

        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides}
          className="p-2 hover:bg-[#3D3430]/5 rounded-full transition-colors disabled:opacity-30 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 text-[#3D3430]" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HazelControlBar;
