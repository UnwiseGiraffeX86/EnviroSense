"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const SlideFuture = () => {
  // Coordinates [Lon, Lat]
  const bucharestCoords = [26.1025, 44.4268];
  
  const cities = [
    { name: "Cluj-Napoca", coordinates: [23.6236, 46.7712], label: "Cluj" },
    { name: "Timișoara", coordinates: [21.2087, 45.7489], label: "Timișoara" },
    { name: "Iași", coordinates: [27.6014, 47.1585], label: "Iași" }
  ];

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
          <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{
              rotate: [-25.0, -46.0, 0],
              scale: 2800
            }}
            className="w-full h-full"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isRomania = geo.properties.name === "Romania";
                  // Filter for Europe context roughly by name or just render all and let zoom handle it.
                  // Since we are zoomed in, rendering all is fine, but we can style them.
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isRomania ? "rgba(16, 185, 129, 0.1)" : "transparent"}
                      stroke={isRomania ? "#10B981" : "#CBD5E1"}
                      strokeWidth={isRomania ? 2 : 0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: isRomania ? "rgba(16, 185, 129, 0.2)" : "transparent" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Connections */}
            {cities.map((city, i) => (
              <Line
                key={`line-${i}`}
                from={bucharestCoords}
                to={city.coordinates}
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth={2}
                strokeDasharray="4 4"
              >
                {(props: any) => (
                  <motion.path
                    {...props}
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1 + (i * 0.3), ease: "easeOut" }}
                  />
                )}
              </Line>
            ))}

            {/* Bucharest Hub */}
            <Marker coordinates={bucharestCoords}>
              <g transform="translate(-12, -24)"> {/* Adjust for centering if needed, but circle is centered at 0,0 usually */}
                 {/* Actually Marker places 0,0 at the coordinate. */}
              </g>
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
            </Marker>

            {/* Standby Nodes */}
            {cities.map((city, i) => (
              <Marker key={city.name} coordinates={city.coordinates}>
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
              </Marker>
            ))}

          </ComposableMap>
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
