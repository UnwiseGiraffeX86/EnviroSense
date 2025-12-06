"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Navigation } from "lucide-react";

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

// Brand Palette
const BRAND_COLORS = {
  green: "#00A36C",
  yellow: "#FFE6A7",
  orange: "#E07A5F",
  brown: "#562C2C",
};

const getColor = (pm25: number) => {
  if (pm25 < 10) return BRAND_COLORS.green;
  if (pm25 < 25) return BRAND_COLORS.yellow;
  if (pm25 < 50) return BRAND_COLORS.orange;
  return BRAND_COLORS.brown;
};

// Helper to calculate centroid of a polygon
const getCentroid = (coordinates: number[][]): [number, number] => {
  let latSum = 0;
  let lngSum = 0;
  const numPoints = coordinates.length;
  
  coordinates.forEach(coord => {
    lngSum += coord[0]; // GeoJSON is [lng, lat]
    latSum += coord[1];
  });
  
  return [latSum / numPoints, lngSum / numPoints]; // Leaflet is [lat, lng]
};

// Component to handle map view updates
const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 2 });
    }
  }, [center, map]);
  return null;
};

const Map = () => {
  const [sectors, setSectors] = useState<AirQualityData[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

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
      const { data, error } = await supabase
        .from("air_quality_public")
        .select("*");
      
      if (error) console.error("Error fetching air quality:", error);
      else if (data) setSectors(data);
    };

    fetchData();

    const channel = supabase
      .channel("air_quality_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "air_quality" },
        async (payload) => {
          if (payload.eventType === "DELETE") {
             setSectors((prev) => prev.filter((s) => s.id !== payload.old.id));
             return;
          }
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

  // Get User Location
  const handleLocateMe = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
          // Fallback to Bucharest center if denied
          setUserLocation([44.4268, 26.1025]); 
        }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  // Auto-locate on mount
  useEffect(() => {
    handleLocateMe();
  }, []);

  // Default Bucharest coordinates
  const defaultPosition: [number, number] = [44.4268, 26.1025];

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={defaultPosition} 
        zoom={11} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", background: "#FAF3DD" }} // Cream background for loading
        className="z-0"
      >
        {/* CartoDB Positron (Light/Clean) Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={userLocation} />

        {sectors.map((sector) => {
          try {
            const geoJson = sector.boundary_geojson;
            if (geoJson && geoJson.type === "Polygon") {
              // Calculate centroid for circular representation
              const coordinates = geoJson.coordinates[0];
              const center = getCentroid(coordinates);
              
              return (
                <Circle
                  key={sector.id}
                  center={center}
                  radius={1500} // Fixed radius for visual consistency (1.5km)
                  pathOptions={{
                    color: getColor(sector.pm25),
                    fillColor: getColor(sector.pm25),
                    fillOpacity: 0.4,
                    weight: 0, // No border for softer look
                  }}
                >
                  <Tooltip sticky className="bg-brand-cream text-brand-brown border-brand-brown/10 shadow-xl rounded-lg font-mono">
                    <div className="p-2">
                      <p className="font-bold text-sm mb-1">{sector.sector_name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ background: getColor(sector.pm25) }} />
                        <span>PM2.5: {sector.pm25.toFixed(1)}</span>
                      </div>
                    </div>
                  </Tooltip>
                </Circle>
              );
            }
          } catch (e) {
            console.error("Error parsing boundary for sector:", sector.sector_name, e);
          }
          return null;
        })}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup className="font-sans text-brand-brown">
              <span className="font-bold">You are here</span>
              <br />
              Monitoring local air quality...
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating Locate Button */}
      <button 
        onClick={handleLocateMe}
        className="absolute bottom-6 right-6 z-[400] bg-white text-brand-brown p-3 rounded-full shadow-xl hover:bg-brand-cream transition-colors border border-brand-brown/10"
        title="Locate Me"
      >
        {loadingLocation ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Map;
