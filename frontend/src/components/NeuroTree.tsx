"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration ---
const MAX_DEPTH = 8;
const TRUNK_LENGTH = 100;
const BRANCH_DECAY = 0.8;
const ANGLE_VARIANCE = 35; // degrees
const COLOR_BROWN = "rgba(86, 44, 44, 0.8)";
const COLOR_GREEN = "#00A36C";
const COLOR_ORANGE = "#E07A5F";
const COLOR_YELLOW = "#F4D35E";
const PARTICLE_COUNT = 40;

interface Branch {
  id: string;
  d: string; // SVG path data
  depth: number;
  width: number;
  color: string;
}

interface Leaf {
  id: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  isBlinking: boolean;
  blinkDuration: number;
  delay: number;
}

interface Particle {
  id: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  delay: number;
  duration: number;
}

// --- Helper: Degrees to Radians ---
const toRad = (deg: number) => (deg * Math.PI) / 180;

// --- Recursive Fractal Generator ---
const generateTree = (
  x: number,
  y: number,
  length: number,
  angle: number,
  depth: number,
  maxDepth: number,
  branches: Branch[],
  leaves: Leaf[],
  idPrefix: string
) => {
  if (depth === 0) {
    // Create a leaf node
    const leafColor =
      Math.random() > 0.8
        ? COLOR_ORANGE
        : Math.random() > 0.9
        ? COLOR_YELLOW
        : COLOR_GREEN;
        
    leaves.push({
      id: `leaf-${idPrefix}`,
      cx: x,
      cy: y,
      r: Math.random() * 3 + 2, // Random radius 2-5
      color: leafColor,
      isBlinking: Math.random() > 0.7,
      blinkDuration: 2 + Math.random() * 3,
      delay: MAX_DEPTH * 0.15 + 0.5 + Math.random() * 0.5,
    });
    return;
  }

  // Determine branching factor (2 or 3)
  // Higher depth (closer to trunk) -> less branching to keep structure clean? 
  // Or random. User said "randomly split into 2 or 3".
  const numBranches = Math.random() > 0.7 ? 3 : 2;

  for (let i = 0; i < numBranches; i++) {
    // Calculate deviation
    // Spread branches out. 
    // If 2 branches: -variance, +variance
    // If 3 branches: -variance, 0, +variance (with jitter)
    
    let angleOffset = 0;
    if (numBranches === 2) {
      angleOffset = i === 0 ? -ANGLE_VARIANCE : ANGLE_VARIANCE;
    } else {
      angleOffset = (i - 1) * ANGLE_VARIANCE;
    }
    
    // Add randomness
    const jitter = Math.random() * 15 - 7.5;
    const newAngle = angle + angleOffset + jitter;
    
    // Calculate end point
    const newLength = length * BRANCH_DECAY * (0.9 + Math.random() * 0.2); // Length variation
    const x2 = x + newLength * Math.sin(toRad(newAngle));
    const y2 = y - newLength * Math.cos(toRad(newAngle));

    // Bezier Control Point
    // Place it somewhere between start and end, offset to create curve
    // Simple curve: midpoint + slight offset perpendicular to direction
    const mx = (x + x2) / 2;
    const my = (y + y2) / 2;
    // No complex curve calculation for now, just a quadratic curve to the end point
    // Actually, for a tree, straight-ish or slightly curved is best.
    // Let's use the angle to determine control point.
    // Control point extends from start point at current angle, but shorter?
    const cpLength = newLength * 0.5;
    const cpx = x + cpLength * Math.sin(toRad(angle)); // Continue previous direction a bit
    const cpy = y - cpLength * Math.cos(toRad(angle));

    const pathData = `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    
    // Tapering width
    // depth goes from MAX down to 0.
    // currentDepth / maxDepth
    const width = 8 * (depth / maxDepth); 

    branches.push({
      id: `branch-${idPrefix}-${i}`,
      d: pathData,
      depth: depth,
      width: Math.max(0.5, width),
      color: COLOR_BROWN,
    });

    generateTree(
      x2,
      y2,
      newLength,
      newAngle,
      depth - 1,
      maxDepth,
      branches,
      leaves,
      idPrefix + i
    );
  }
};

const generateParticles = (count: number, width: number, height: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: `p-${i}`,
      cx: Math.random() * width,
      cy: Math.random() * height,
      r: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? COLOR_YELLOW : COLOR_ORANGE,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    });
  }
  return particles;
};

const NeuroTree = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [treeData, setTreeData] = useState<{ branches: Branch[]; leaves: Leaf[] }>({
    branches: [],
    leaves: [],
  });
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const b: Branch[] = [];
    const l: Leaf[] = [];
    // Start from bottom center
    // Trunk base
    generateTree(300, 600, TRUNK_LENGTH, 0, MAX_DEPTH, MAX_DEPTH, b, l, "root");
    setTreeData({ branches: b, leaves: l });
    setParticles(generateParticles(PARTICLE_COUNT, 600, 600));
  }, []);

  if (!isMounted) {
    // Render a placeholder or nothing to avoid hydration mismatch
    // A simple loading state or the static container
    return <div className="w-full h-full flex items-center justify-center opacity-0"></div>;
  }

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        className="overflow-visible"
        style={{ maxWidth: "600px", maxHeight: "600px" }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.circle
            key={p.id}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={p.color}
            opacity={0.6}
            filter="url(#glow)"
            animate={{
              x: [0, 10, -10, 0],
              y: [0, -20, -40],
              opacity: [0, 1, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Tree Container with Breathing Animation */}
        <motion.g
          animate={{
            scale: [1, 1.015, 1],
            translateY: [0, -2, 0],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{ transformOrigin: "300px 600px" }}
        >
          {/* Branches */}
          {treeData.branches.map((branch) => (
            <React.Fragment key={branch.id}>
              {/* Main Branch Line */}
              <motion.path
                d={branch.d}
                fill="none"
                stroke={branch.color}
                strokeWidth={branch.width}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.5,
                  delay: (MAX_DEPTH - branch.depth) * 0.15, // Stagger by depth
                  ease: "easeOut",
                }}
              />
              
              {/* Pulse Animation Layer - Only on thicker branches to save perf */}
              {branch.depth > 3 && (
                <motion.path
                  d={branch.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={branch.width * 0.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
                  animate={{ 
                    pathLength: [0, 0.3, 0],
                    opacity: [0, 1, 0],
                    pathOffset: [0, 1]
                  }}
                  transition={{
                    duration: 3,
                    delay: (MAX_DEPTH - branch.depth) * 0.15 + Math.random() * 5, // Random start
                    repeat: Infinity,
                    repeatDelay: Math.random() * 5 + 5,
                    ease: "linear",
                  }}
                />
              )}
            </React.Fragment>
          ))}

          {/* Leaves / Nodes */}
          {treeData.leaves.map((leaf) => (
            <motion.circle
              key={leaf.id}
              cx={leaf.cx}
              cy={leaf.cy}
              r={leaf.r}
              fill={leaf.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: leaf.isBlinking ? [0.8, 0.3, 0.8] : 0.8 
              }}
              transition={{
                scale: {
                  duration: 0.5,
                  delay: leaf.delay,
                },
                opacity: leaf.isBlinking ? {
                  duration: leaf.blinkDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: leaf.delay 
                } : {
                  duration: 0.5,
                  delay: leaf.delay
                }
              }}
            />
          ))}
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default NeuroTree;
