import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type DashboardData = {
  profile: {
    sector: string;
    focus_index: number;
    stress_triggers: string[];
    full_name: string;
  } | null;
  airQuality: {
    pm25: number;
    pm10: number;
    last_updated: string;
    sector_name: string;
  } | null;
  appointments: {
    id: string;
    doctor_name: string;
    clinic_name: string;
    appointment_time: string;
    status: string;
  }[];
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    forecast: { time: string; temp: number; condition: string }[];
  } | null;
  loading: boolean;
};

// Helper to calculate distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    profile: null,
    airQuality: null,
    appointments: [],
    weather: null,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn("No session found");
          setData(prev => ({ ...prev, loading: false }));
          return;
        }

        // 2. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("sector, full_name, focus_index, stress_triggers")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        // Add default values for missing columns
        const profile = profileData ? {
            ...profileData,
            focus_index: profileData.focus_index || 10,
            stress_triggers: profileData.stress_triggers || []
        } : null;

        // 3. Get Location (with timeout)
        let lat = 44.4268;
        let lon = 26.1025;
        let locationFound = false;

        if (typeof window !== 'undefined' && navigator.geolocation) {
            try {
                const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                    const timeoutId = setTimeout(() => reject(new Error("Timeout")), 5000);
                    navigator.geolocation.getCurrentPosition(
                        (p) => { clearTimeout(timeoutId); resolve(p); }, 
                        (e) => { clearTimeout(timeoutId); reject(e); }
                    );
                });
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
                locationFound = true;
            } catch (e) {
                console.warn("Location access denied or timed out, using default.");
            }
        }

        if (profile) {
          // 4. Parallel Fetch: Air Quality (All), Appointments, and Weather
          const [airQualityRes, appointmentsRes, weatherRes] = await Promise.all([
            supabase
              .from("air_quality_public")
              .select("*"), // Fetch all to find nearest
            supabase
              .from("appointments")
              .select("*")
              .eq("patient_id", session.user.id)
              .then(res => {
                if (res.error) {
                  console.warn("Appointments fetch error (ignoring):", res.error);
                  return { data: [], error: null };
                }
                
                // Map data to ensure compatibility with both schemas
                const mappedData = res.data.map((appt: any) => ({
                    id: appt.id,
                    doctor_name: appt.doctor_name || "Dr. Popa",
                    clinic_name: appt.clinic_name || "Regina Maria",
                    appointment_time: appt.appointment_time || appt.start_time || new Date().toISOString(),
                    status: appt.status
                })).sort((a: any, b: any) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime());

                return { data: mappedData, error: null };
              }),
            // Fetch real weather data from OpenMeteo (User coordinates)
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto`)
              .then(res => {
                if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`);
                return res.json();
              })
              .catch(err => {
                console.warn("Weather fetch failed:", err);
                return { current: null, hourly: null }; // Return fallback structure
              })
          ]);

          // Find nearest station
          let nearestStation = null;
          if (airQualityRes.data && airQualityRes.data.length > 0) {
              if (locationFound) {
                  let minDist = Infinity;
                  
                  // Prioritize stations with valid PM2.5 data (> 0)
                  const validStations = airQualityRes.data.filter((s: any) => s.pm25 > 0);
                  const searchPool = validStations.length > 0 ? validStations : airQualityRes.data;

                  searchPool.forEach((station: any) => {
                      if (station.boundary_geojson && station.boundary_geojson.coordinates) {
                          const coords = station.boundary_geojson.coordinates[0];
                          let sLat = 0, sLon = 0;
                          coords.forEach((c: any) => { sLon += c[0]; sLat += c[1]; });
                          sLat /= coords.length;
                          sLon /= coords.length;
                          
                          const dist = getDistanceFromLatLonInKm(lat, lon, sLat, sLon);
                          if (dist < minDist) {
                              minDist = dist;
                              nearestStation = station;
                          }
                      }
                  });
              }
              
              // Fallback if no location or calculation failed
              if (!nearestStation) {
                  // Try to find one with data first
                  nearestStation = airQualityRes.data.find((s: any) => s.sector_name === profile.sector && s.pm25 > 0) 
                                || airQualityRes.data.find((s: any) => s.sector_name === profile.sector)
                                || airQualityRes.data[0];
              }
          }

          // Map OpenMeteo WMO codes to conditions
          const getWeatherCondition = (code: number) => {
            if (code === undefined) return "Unknown";
            if (code === 0) return "Clear Sky";
            if (code <= 3) return "Partly Cloudy";
            if (code <= 48) return "Foggy";
            if (code <= 67) return "Rainy";
            if (code <= 77) return "Snowy";
            return "Stormy";
          };

          let forecast = [];
          if (weatherRes && weatherRes.hourly && weatherRes.hourly.time) {
            const currentHour = new Date().getHours();
            // Take next 5 hours
            for (let i = 0; i < 5; i++) {
              const index = currentHour + i;
              if (weatherRes.hourly.time[index]) {
                forecast.push({
                  time: i === 0 ? "Now" : `+${i}h`,
                  temp: weatherRes.hourly.temperature_2m[index],
                  condition: getWeatherCondition(weatherRes.hourly.weather_code[index])
                });
              }
            }
          }

          const weatherData = (weatherRes && weatherRes.current) ? {
            temperature: weatherRes.current.temperature_2m,
            humidity: weatherRes.current.relative_humidity_2m,
            windSpeed: weatherRes.current.wind_speed_10m,
            condition: getWeatherCondition(weatherRes.current.weather_code),
            forecast: forecast
          } : null;

          setData({
            profile,
            airQuality: nearestStation,
            appointments: appointmentsRes.data || [],
            weather: weatherData,
            loading: false,
          });
        } else {
            setData(prev => ({ ...prev, profile, loading: false }));
        }

      } catch (error: any) {
        console.error("Error fetching dashboard data:", error.message || error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  // Real-time subscription for Air Quality
  useEffect(() => {
    if (!data.profile?.sector) return;

    console.log(`Subscribing to air_quality changes for sector: ${data.profile.sector}`);
    const channel = supabase
      .channel('air-quality-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'air_quality',
          filter: `sector_name=eq.${data.profile.sector}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          const newRecord = payload.new as any;
          setData(prev => ({
            ...prev,
            airQuality: {
                ...prev.airQuality!,
                ...newRecord,
                pm25: Number(newRecord.pm25),
                pm10: Number(newRecord.pm10),
            },
          }));
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from air_quality changes');
      supabase.removeChannel(channel);
    };
  }, [data.profile?.sector]);

  return data;
};
