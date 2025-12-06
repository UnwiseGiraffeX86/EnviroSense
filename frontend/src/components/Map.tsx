"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
// import { parse } from "wellknown"; // Removed as we use GeoJSON from View

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AirQualityData {
  id: number;
  sector_name: string;
  pm25: number;
  pm10: number;
  boundary_geojson: any; // GeoJSON object
}

const getColor = (pm25: number) => {
  if (pm25 < 10) return "#22c55e"; // Green
  if (pm25 < 25) return "#eab308"; // Yellow
  if (pm25 < 50) return "#f97316"; // Orange
  return "#ef4444"; // Red
};

const Map = () => {
  const [sectors, setSectors] = useState<AirQualityData[]>([]);

  // Fix for default marker icon in Next.js
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Fetch Data & Subscribe
  useEffect(() => {
    const fetchData = async () => {
      // Query the VIEW 'air_quality_public' which returns GeoJSON
      const { data, error } = await supabase
        .from("air_quality_public")
        .select("*");
      
      if (error) console.error("Error fetching air quality:", error);
      else if (data) setSectors(data);
    };

    fetchData();

    // Realtime Subscription (Listen to the underlying TABLE 'air_quality')
    const channel = supabase
      .channel("air_quality_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "air_quality" },
        async (payload) => {
          console.log("Realtime update received:", payload);
          
          if (payload.eventType === "DELETE") {
             setSectors((prev) => prev.filter((s) => s.id !== payload.old.id));
             return;
          }

          // For INSERT or UPDATE, we need to fetch the GeoJSON from the view
          // because the payload only has the raw table data (WKB boundary)
          const { data } = await supabase
            .from("air_quality_public")
            .select("*")
            .eq("id", payload.new.id)
            .single();
            
          if (data) {
            setSectors((prev) => {
              const exists = prev.find((s) => s.id === data.id);
              if (exists) {
                return prev.map((s) => (s.id === data.id ? { ...s, ...data } : s));
              } else {
                return [...prev, data];
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Bucharest coordinates
  const position: [number, number] = [44.4268, 26.1025];

  return (
    <MapContainer center={position} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {sectors.map((sector) => {
        try {
          const geoJson = sector.boundary_geojson;
          if (geoJson && geoJson.type === "Polygon") {
            // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
            // @ts-ignore
            const positions: L.LatLngExpression[] = geoJson.coordinates[0].map((coord) => [coord[1], coord[0]]);
            
            return (
              <Polygon
                key={sector.id}
                positions={positions}
                pathOptions={{
                  color: getColor(sector.pm25),
                  fillColor: getColor(sector.pm25),
                  fillOpacity: 0.4,
                  weight: 2
                }}
              >
                <Tooltip sticky>
                  <div className="text-sm">
                    <p className="font-bold">{sector.sector_name}</p>
                    <p>PM2.5: {sector.pm25.toFixed(1)} µg/m³</p>
                    <p>PM10: {sector.pm10.toFixed(1)} µg/m³</p>
                  </div>
                </Tooltip>
              </Polygon>
            );
          }
        } catch (e) {
          console.error("Error parsing boundary for sector:", sector.sector_name, e);
        }
        return null;
      })}

      <Marker position={position}>
        <Popup>Bucharest Center</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;

