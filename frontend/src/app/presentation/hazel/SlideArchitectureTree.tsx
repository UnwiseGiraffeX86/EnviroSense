"use client";

import React from "react";
import { motion } from "framer-motion";

const SlideArchitectureTree = () => {
  return (
    <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-[#FDFBF7] overflow-hidden">
       {/* Title */}
       <div className="absolute top-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#3D3430] mb-3">The Living System</h2>
          <p className="text-lg text-[#3D3430]/60 font-mono">Neuro-Symbolic Ecology</p>
        </motion.div>
      </div>

      {/* The Tree Visualization */}
      <div className="relative w-full max-w-4xl h-[600px] mt-10 flex items-center justify-center">
         <svg className="w-full h-full overflow-visible" viewBox="0 0 800 800">
            
            {/* --- ROOTS (The Foundation) --- */}
            <g className="roots">
               {/* Root Paths - Extending Downwards from 600 */}
               {[
                 "M 400 600 C 400 700 300 750 200 780",
                 "M 400 600 C 400 700 350 750 300 790",
                 "M 400 600 C 400 750 400 780 400 800",
                 "M 400 600 C 400 700 450 750 500 790",
                 "M 400 600 C 400 700 500 750 600 780",
               ].map((d, i) => (
                 <motion.path
                   key={`root-${i}`}
                   d={d}
                   fill="none"
                   stroke="#E9C46A" // Amber-400
                   strokeWidth="2"
                   initial={{ pathLength: 0, opacity: 0 }}
                   whileInView={{ pathLength: 1, opacity: 0.6 }}
                   transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                 />
               ))}
               
               {/* Upward Pulse Animation (Golden Energy from Law) */}
               {[
                 "M 400 600 C 400 700 300 750 200 780",
                 "M 400 600 C 400 700 500 750 600 780",
               ].map((d, i) => (
                  <motion.circle
                    key={`pulse-${i}`}
                    r="4"
                    fill="#E9C46A"
                  >
                    <animateMotion
                      dur={`${3 + i}s`}
                      repeatCount="indefinite"
                      path={d}
                      keyPoints="1;0" // Move upwards (from tip to trunk)
                      keyTimes="0;1"
                    />
                  </motion.circle>
               ))}
            </g>

            {/* --- TRUNK (The Airlock) --- */}
            <g className="trunk">
               {/* Main Trunk Lines */}
               <motion.path
                 d="M 400 600 L 400 300"
                 stroke="#3D3430"
                 strokeWidth="12"
                 strokeLinecap="round"
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
                 transition={{ duration: 1, delay: 0 }}
               />
               
               {/* Data Sap Flow (Green) */}
               <motion.path
                 d="M 400 600 L 400 300"
                 stroke="#00A36C" // Emerald-500
                 strokeWidth="6"
                 strokeLinecap="round"
                 initial={{ pathLength: 0, opacity: 0 }}
                 whileInView={{ pathLength: 1, opacity: 1 }}
                 transition={{ duration: 1.5, delay: 1.5 }}
               />
               
               {/* Moving Sap Particles */}
               <motion.circle r="3" fill="#00A36C">
                  <animateMotion
                     path="M 400 600 L 400 300"
                     dur="2s"
                     repeatCount="indefinite"
                  />
               </motion.circle>
            </g>

            {/* --- CANOPY (The Intelligence) --- */}
            <g className="canopy">
               {/* Branches - Extending Upwards from 300 */}
               {[
                 "M 400 300 C 400 200 300 150 200 100", // Left
                 "M 400 300 C 400 150 350 100 300 50",  // Mid-Left
                 "M 400 300 C 400 100 400 50 400 20",   // Center
                 "M 400 300 C 400 150 450 100 500 50",  // Mid-Right
                 "M 400 300 C 400 200 500 150 600 100", // Right
               ].map((d, i) => (
                 <motion.path
                   key={`branch-${i}`}
                   d={d}
                   fill="none"
                   stroke="#00A36C"
                   strokeWidth="3"
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   transition={{ duration: 1.5, delay: 2 + i * 0.1 }}
                 />
               ))}

               {/* Blooming Nodes (Leaves/Output) */}
               {[
                 { cx: 200, cy: 100, label: "98%" },
                 { cx: 300, cy: 50, label: "Safe" },
                 { cx: 400, cy: 20, label: "Verified" },
                 { cx: 500, cy: 50, label: "Clean" },
                 { cx: 600, cy: 100, label: "Low Risk" },
               ].map((pos, i) => (
                 <motion.g key={`leaf-${i}`}>
                    {/* Glowing Leaf */}
                    <motion.circle
                      cx={pos.cx}
                      cy={pos.cy}
                      r="12"
                      fill="#00A36C"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 3.5 + i * 0.1 }}
                    />
                    {/* Pulse Effect */}
                    <motion.circle
                      cx={pos.cx}
                      cy={pos.cy}
                      r="20"
                      stroke="#00A36C"
                      strokeWidth="1"
                      fill="none"
                      initial={{ scale: 0, opacity: 1 }}
                      whileInView={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: 3.5 + i * 0.1 }}
                    />
                 </motion.g>
               ))}
            </g>

            {/* --- RAIN (Input Data) --- */}
            <g className="rain">
                {[...Array(15)].map((_, i) => (
                   <motion.circle
                     key={`rain-${i}`}
                     cx={300 + Math.random() * 200} // Fall around the canopy
                     cy={0}
                     r={2}
                     fill="#3D3430"
                     opacity={0.4}
                     animate={{ cy: [0, 300], opacity: [0, 1, 0] }}
                     transition={{ 
                       duration: 1.5 + Math.random(), 
                       repeat: Infinity, 
                       delay: Math.random() * 2,
                       ease: "linear"
                     }}
                   />
                ))}
            </g>

         </svg>

         {/* Labels Overlay */}
         <div className="absolute inset-0 pointer-events-none">
            {/* Roots Label */}
            <motion.div 
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-amber-400/50 px-4 py-2 rounded-xl text-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
               <h3 className="text-amber-600 font-bold text-sm">RAG Foundation</h3>
               <p className="text-[10px] text-amber-600/60 font-mono">EU Directive 2024/2881</p>
            </motion.div>

            {/* Trunk Label */}
            <motion.div 
              className="absolute top-[55%] left-[55%] bg-white/90 backdrop-blur-sm border border-[#3D3430]/10 px-4 py-2 rounded-xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5 }}
            >
               <h3 className="text-[#3D3430] font-bold text-sm">Zero-Trust Airlock</h3>
               <p className="text-[10px] text-[#3D3430]/60 font-mono">PII Stripped</p>
            </motion.div>

            {/* Canopy Label */}
            <motion.div 
              className="absolute top-[15%] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-emerald-500/50 px-4 py-2 rounded-xl text-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 4 }}
            >
               <h3 className="text-emerald-600 font-bold text-sm">GPT-4o Inference</h3>
               <p className="text-[10px] text-emerald-600/60 font-mono">Neuro-Symbolic Reasoning</p>
            </motion.div>
         </div>
      </div>
    </section>
  );
};

export default SlideArchitectureTree;
