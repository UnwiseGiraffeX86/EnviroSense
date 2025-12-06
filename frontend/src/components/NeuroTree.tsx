"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- Configuration ---
const MAX_DEPTH = 5;
const TRUNK_LENGTH = 120;
const BRANCH_DECAY = 0.75;
const ANGLE_VARIANCE = 25; // degrees
const COLOR_BROWN = "#562C2C";
const COLOR_GREEN = "#00A36C";
const COLOR_ORANGE = "#E07A5F";

interface Branch {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
  angle: number;
  id: string;
}

interface Leaf {
  x: number;
  y: number;
  id: string;
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
  branches: Branch[],
  leaves: Leaf[],
  idPrefix: string
) => {
  if (depth === 0) {
    leaves.push({ x, y, id: `leaf-${idPrefix}` });
    return;
  }

  // Calculate end point
  // Note: SVG coordinate system, y decreases upwards.
  // Angle 0 is straight up.
  const x2 = x + length * Math.sin(toRad(angle));
  const y2 = y - length * Math.cos(toRad(angle));

  branches.push({
    x1: x,
    y1: y,
    x2,
    y2,
    depth,
    angle,
    id: `branch-${idPrefix}`,
  });

  // Randomize angles slightly for organic feel
  const leftAngle = angle - ANGLE_VARIANCE + (Math.random() * 10 - 5);
  const rightAngle = angle + ANGLE_VARIANCE + (Math.random() * 10 - 5);

  // Recursive calls
  generateTree(
    x2,
    y2,
    length * BRANCH_DECAY,
    leftAngle,
    depth - 1,
    branches,
    leaves,
    idPrefix + "L"
  );
  generateTree(
    x2,
    y2,
    length * BRANCH_DECAY,
    rightAngle,
    depth - 1,
    branches,
    leaves,
    idPrefix + "R"
  );
};

const NeuroTree = () => {
  // Memoize the tree data so it doesn't regenerate on every render
  const { branches, leaves } = useMemo(() => {
    const b: Branch[] = [];
    const l: Leaf[] = [];
    // Start from bottom center of a 600x600 viewBox
    generateTree(300, 550, TRUNK_LENGTH, 0, MAX_DEPTH, b, l, "root");
    return { branches: b, leaves: l };
  }, []);

  // --- Animation Variants ---

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.02, 1],
        transition: {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        },
      }}
    >
      <svg
        width="600"
        height="600"
        viewBox="0 0 600 600"
        className="overflow-visible"
      >
        {/* Branches */}
        {branches.map((branch, i) => {
          // Stagger growth based on depth (inverse) or index
          // We want the trunk (highest depth value in our logic, actually we passed MAX_DEPTH down)
          // Let's use the recursion level. Our logic passed MAX_DEPTH and decremented.
          // So trunk is depth 5, tips are depth 1.
          // We want trunk to draw first.
          const level = MAX_DEPTH - branch.depth; 
          
          return (
            <motion.line
              key={branch.id}
              x1={branch.x1}
              y1={branch.y1}
              x2={branch.x2}
              y2={branch.y2}
              stroke={COLOR_BROWN}
              strokeWidth={branch.depth * 1.5} // Thicker at bottom
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                delay: level * 0.3, // Stagger by level
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Leaves (Sensor Nodes) */}
        {leaves.map((leaf, i) => {
          // Randomize the "pollution spike" behavior
          const isSpiking = Math.random() > 0.8; // 20% chance to be a "sensor" that changes color
          const delay = MAX_DEPTH * 0.3 + Math.random(); // Start after tree grows

          return (
            <motion.circle
              key={leaf.id}
              cx={leaf.x}
              cy={leaf.y}
              r={4 + Math.random() * 3} // Random size 4-7
              initial={{ scale: 0, fill: COLOR_GREEN }}
              animate={{
                scale: [1, 1.2, 1],
                fill: isSpiking ? [COLOR_GREEN, COLOR_ORANGE, COLOR_GREEN] : COLOR_GREEN,
              }}
              transition={{
                scale: {
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: delay,
                },
                fill: {
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: delay,
                  times: [0, 0.5, 1]
                },
                default: { delay: delay, duration: 0.5 } // Initial appearance
              }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
};

export default NeuroTree;
