"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    { name: "Iași", coordinates: [27.6014, 47.1585] as [number, number], label: "Iași" }
  ];

  // 1. Define Projection Manually
  // This allows us to use the exact same projection for the map and the custom motion paths.
  const width = 800;
  const height = 600;
  
  const projection = useMemo(() => {
    return geoMercator()
      .center([25.0, 46.0]) // Center on Romania
      .scale(3000)          // Zoom level
      .translate([width / 2, height / 2]);
  }, []);

  // 2. Path Generator
  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // 3. Fetch and Prepare Data (Client-Side Only to prevent Hydration Mismatch)
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
    <section className="h-screen w-full snap-start relative overflow-hidden bg-[#FDFBF7] flex flex-col items-center justify-center">
      
      {/* --- Background Texture --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(#3D3430 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* --- Typography Header --- */}
      <div className="relative z-20 text-center mb-4 max-w-4xl px-6 mt-12">
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

      {/* --- The Map Visualization --- */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center z-10 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          {/* We use a standard SVG but leverage d3-geo for paths */}
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            
            {/* Geographies */}
            <g>
              {geographies.map((geo, i) => {
                const name = geo.properties.name;
                const isRomania = name === "Romania";
                const isNeighbor = ["Hungary", "Bulgaria", "Serbia", "Ukraine", "Moldova"].includes(name);
                
                if (!isRomania && !isNeighbor) return null;

                return (
                  <path
                    key={geo.id || i}
                    d={pathGenerator(geo) || ""}
                    fill={isRomania ? "rgba(16, 185, 129, 0.1)" : "transparent"}
                    stroke={isRomania ? "#10B981" : "#CBD5E1"}
                    strokeWidth={isRomania ? 2 : 1}
                    style={{ pointerEvents: "none" }}
                  />
                );
              })}
            </g>

            {/* Connections (Custom Motion Paths) */}
            {cities.map((city, i) => {
              // Generate LineString GeoJSON
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
                  stroke="rgba(16, 185, 129, 0.4)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1 + (i * 0.3), ease: "easeOut" }}
                />
              );
            })}

            {/* Markers (Manually projected) */}
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
                r={20} 
                fill="rgba(16, 185, 129, 0.3)" 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text
                textAnchor="middle"
                y={30}
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
                      r={10} 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth={1} 
                      opacity={0.5}
                      animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <text
                      textAnchor="middle"
                      y={25}
                      className="font-bold text-[8px] fill-amber-600 uppercase tracking-wider"
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

      {/* --- Call to Action --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="relative z-20 mb-12"
      >
        <button className="group relative px-8 py-4 bg-[#3D3430] text-[#FDFBF7] rounded-full overflow-hidden shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-[#3D3430] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-3 font-bold tracking-wide">
            <span>Enter Live Environment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </motion.div>

    </section>
  );
};

export default SlideFuture;
