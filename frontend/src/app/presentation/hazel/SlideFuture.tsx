"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

// Use a reliable TopoJSON source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const SlideFuture = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [geographies, setGeographies] = useState<any[]>([]);

  // Coordinates [Lon, Lat]
  const bucharestCoords: [number, number] = [26.1025, 44.4268];
  
  const cities = [
    { name: "Cluj-Napoca", coordinates: [23.6236, 46.7712] as [number, number], label: "Cluj" },
    { name: "Timișoara", coordinates: [21.2087, 45.7489] as [number, number], label: "Timișoara" },
    { name: "Iași", coordinates: [27.6014, 47.1585] as [number, number], label: "Iași" },
    { name: "Brașov", coordinates: [25.6012, 45.6427] as [number, number], label: "Brașov" },
    { name: "Constanța", coordinates: [28.6348, 44.1598] as [number, number], label: "Constanța" }
  ];

  // 1. Define Projection Manually
  const width = 800;
  const height = 600;
  
  const projection = useMemo(() => {
    return geoMercator()
      .center([25.0, 45.0]) // Shifted center slightly south to move map up
      .scale(5500)          // Significantly increased scale
      .translate([width / 2, height / 2]);
  }, []);

  // 2. Path Generator
  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // 3. Fetch and Prepare Data
  useEffect(() => {
    setIsMounted(true);
    fetch(geoUrl)
      .then((res) => res.json())
      .then((data) => {
        // Convert TopoJSON to GeoJSON
        // @ts-ignore
        const geojson = feature(data, data.objects.countries) as any;
        setGeographies(geojson.features);
      })
      .catch(err => console.error("Failed to load map data:", err));
  }, []);

  if (!isMounted) return <div className="h-screen w-full bg-[#FDFBF7]" />;

  return (
    <section className="h-screen w-full snap-start relative overflow-hidden bg-[#FDFBF7] flex flex-col">
      
      {/* --- Atmosphere: Background Texture --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#3D3430 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF7]/80" />
      </div>

      {/* --- Atmosphere: Map Glow (The Anchor) --- */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl opacity-60" />
      </div>

      {/* --- Section 1: The Header (Top) --- */}
      <div className="relative z-20 pt-16 pb-4 px-8 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-[#3D3430] tracking-tight mb-4"
        >
          City Scale is the Baseline.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 font-medium"
        >
          Bucharest is online. National integration logic is <span className="text-emerald-600 font-bold">pre-deployed</span>.
        </motion.p>
      </div>

      {/* --- Section 2: The Map (Middle - The Filling) --- */}
      <div className="relative flex-grow w-full z-0 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full max-w-6xl max-h-[80vh]"
        >
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            
            {/* Geographies */}
            <g>
              {geographies.map((geo, i) => {
                const name = geo.properties.name;
                const isRomania = name === "Romania";
                const isNeighbor = ["Hungary", "Bulgaria", "Serbia", "Ukraine", "Moldova", "Slovakia", "Greece", "Bosnia and Herzegovina", "Montenegro", "Croatia", "Kosovo", "Slovenia", "Austria", "Czech Republic", "Poland"].includes(name);
                
                if (!isRomania && !isNeighbor) return null;

                return (
                  <path
                    key={geo.id || i}
                    d={pathGenerator(geo) || ""}
                    fill={isRomania ? "rgba(16, 185, 129, 0.15)" : "transparent"}
                    stroke={isRomania ? "#10B981" : "#CBD5E1"}
                    strokeWidth={isRomania ? 2 : 1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}
            </g>

            {/* Connections (Custom Motion Paths) */}
            {cities.map((city, i) => {
              const lineData = {
                type: "LineString",
                coordinates: [bucharestCoords, city.coordinates]
              };
              const d = pathGenerator(lineData as any);

              return (
                <motion.path
                  key={`line-${i}`}
                  d={d || ""}
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.6)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1 + (i * 0.3), ease: "easeOut" }}
                />
              );
            })}

            {/* Markers */}
            {/* Bucharest Hub */}
            <g transform={`translate(${projection(bucharestCoords)?.join(",")})`}>
              <motion.circle 
                r={8} 
                fill="#10B981" 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring" }}
              />
              <motion.circle 
                r={24} 
                fill="rgba(16, 185, 129, 0.2)" 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text
                textAnchor="middle"
                y={35}
                className="font-bold text-[10px] fill-emerald-800 uppercase tracking-wider"
                style={{ textShadow: "0px 0px 10px rgba(255,255,255,0.8)" }}
              >
                Bucharest Grid [ONLINE]
              </text>
            </g>

            {/* Standby Nodes */}
            {cities.map((city, i) => {
              const pos = projection(city.coordinates);
              if (!pos) return null;

              return (
                <g key={city.name} transform={`translate(${pos.join(",")})`}>
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 2 + (i * 0.2) }}
                  >
                    <circle r={5} fill="#FDFBF7" stroke="#F59E0B" strokeWidth={2} />
                    <motion.circle 
                      r={12} 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth={1.5} 
                      opacity={0.5}
                      animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <text
                      textAnchor="middle"
                      y={28}
                      className="font-bold text-[9px] fill-amber-700 uppercase tracking-wider"
                      style={{ textShadow: "0px 0px 5px rgba(255,255,255,0.8)" }}
                    >
                      {city.label}
                    </text>
                  </motion.g>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default SlideFuture;
