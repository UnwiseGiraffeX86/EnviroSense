"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FirefliesBackground = () => {
  const [fireflies, setFireflies] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const count = 20;
    const newFireflies = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2, // 2px to 6px
      duration: Math.random() * 10 + 10, // 10s to 20s
    }));
    setFireflies(newFireflies);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          className="absolute rounded-full bg-[#00A36C] opacity-20 blur-sm"
          style={{
            width: firefly.size,
            height: firefly.size,
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: firefly.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Add a subtle gradient overlay to soften the background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3DD]/50 to-[#FAF3DD]/80 pointer-events-none" />
    </div>
  );
};

export default FirefliesBackground;
