import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

// ============================================================
// TYPES
// ============================================================

export type WatchData = {
  // Pixel Watch 4 Sensors
  heartRate: number;
  heartRateHistory: number[];
  hrvMs: number;
  spo2: number;
  ecgStatus: 'normal' | 'afib_detected' | 'inconclusive' | null;
  edaStressLevel: number;
  skinTempDelta: number;
  steps: number;
  sleepScore: number;
  sleepStages: { light: number; deep: number; rem: number; awake: number };
  dailyReadiness: number;
  cardioLoad: 'low' | 'optimal' | 'high' | 'overreaching';
  // HectorWatch Board (ESP32-S3)
  ambientTemp: number;
  ambientHumidity: number;
  ambientPressure: number;
  ambientLight: number;
  lastSynced: string;
};

export type StationData = {
  active: {
    id: number;
    displayName: string;
    pm25: number;
    pm10: number;
    lastUpdated: string;
  };
  history24h: { time: string; pm25: number }[];
};

export type DashboardData = {
  profile: {
    sector: string;
    focus_index: number;
    stress_triggers: string[];
    full_name: string;
    pollution_sensitivity?: number;
    respiratory_conditions?: string[];
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
  watchData: WatchData | null;
  stationData: StationData | null;
  loading: boolean;
};

// ============================================================
// MOCK WATCH DATA GENERATOR
// Designed to be swapped 1:1 with Health Connect / Fitbit API
// ============================================================

function generateMockWatchData(pm25: number): WatchData {
  const now = new Date();
  const hour = now.getHours();

  // Circadian heart rate: lower at night (60-70), higher during day (70-90)
  const isNight = hour < 6 || hour > 22;
  const baseHR = isNight ? 62 : 75;
  const hrVariance = (Math.sin(hour * 0.26) * 10) + (Math.random() * 6 - 3);
  const heartRate = Math.round(Math.max(52, Math.min(110, baseHR + hrVariance)));

  // HRV inversely correlates with PM2.5 pollution
  const baseHRV = isNight ? 65 : 45;
  const pollutionPenalty = Math.min(pm25 * 0.4, 20);
  const hrvMs = Math.round(Math.max(15, baseHRV - pollutionPenalty + (Math.random() * 10 - 5)));

  // SpO2: slightly reduced when PM2.5 > 15 (WHO threshold)
  const baseSpo2 = 97;
  const spo2Penalty = pm25 > 15 ? Math.min((pm25 - 15) * 0.05, 3) : 0;
  const spo2 = Math.round(Math.max(91, Math.min(100, baseSpo2 - spo2Penalty + (Math.random() * 1 - 0.5))));

  // cEDA stress: higher in afternoon, correlates with pollution
  const baseStress = 25 + (Math.sin((hour - 6) * 0.26) * 15);
  const stressPollution = pm25 > 25 ? (pm25 - 25) * 0.5 : 0;
  const edaStressLevel = Math.round(Math.max(5, Math.min(95, baseStress + stressPollution + (Math.random() * 10 - 5))));

  // Skin temp delta: slight variation
  const skinTempDelta = Math.round((Math.sin(hour * 0.13) * 0.8 + (Math.random() * 0.4 - 0.2)) * 10) / 10;

  // Steps: cumulative throughout the day
  const dayProgress = Math.max(0, (hour - 7)) / 15;
  const steps = Math.round(Math.max(0, dayProgress * 8500 + (Math.random() * 1000)));

  // Sleep data (from last night)
  const totalSleep = 420 + Math.round(Math.random() * 60 - 30); // ~7h ± 30min
  const deep = Math.round(totalSleep * (0.15 + Math.random() * 0.08));
  const rem = Math.round(totalSleep * (0.20 + Math.random() * 0.05));
  const awake = Math.round(10 + Math.random() * 20);
  const light = totalSleep - deep - rem - awake;
  const sleepScore = Math.round(Math.max(40, Math.min(100, 70 + (deep / totalSleep) * 40 - (awake / totalSleep) * 30 + (Math.random() * 10 - 5))));

  // Daily readiness: fuses sleep + HRV + previous recovery
  const dailyReadiness = Math.round(Math.max(20, Math.min(100,
    sleepScore * 0.4 + (hrvMs / 80) * 100 * 0.35 + (100 - edaStressLevel) * 0.25
  )));

  // Cardio load
  const cardioLoad: WatchData['cardioLoad'] =
    steps < 3000 ? 'low' :
    steps < 8000 ? 'optimal' :
    steps < 15000 ? 'high' : 'overreaching';

  // Heart rate history (24 data points — one per hour for last 24h)
  const heartRateHistory: number[] = [];
  for (let i = 0; i < 24; i++) {
    const h = (hour - 23 + i + 24) % 24;
    const hIsNight = h < 6 || h > 22;
    const hBase = hIsNight ? 60 : 73;
    const hVar = Math.sin(h * 0.26) * 8 + (Math.random() * 6 - 3);
    heartRateHistory.push(Math.round(Math.max(50, Math.min(105, hBase + hVar))));
  }

  // HectorWatch board ambient sensors
  const ambientTemp = Math.round((22 + Math.sin(hour * 0.26) * 3 + Math.random() * 1) * 10) / 10;
  const ambientHumidity = Math.round(45 + Math.sin(hour * 0.13) * 10 + Math.random() * 5);
  const ambientPressure = Math.round((1013 + Math.sin(hour * 0.1) * 3 + Math.random() * 2) * 10) / 10;
  const ambientLight = Math.round(
    isNight ? (5 + Math.random() * 15) : (200 + Math.sin((hour - 6) * 0.39) * 300 + Math.random() * 50)
  );

  return {
    heartRate,
    heartRateHistory,
    hrvMs,
    spo2,
    ecgStatus: 'normal',
    edaStressLevel,
    skinTempDelta,
    steps,
    sleepScore,
    sleepStages: { light, deep, rem, awake },
    dailyReadiness,
    cardioLoad,
    ambientTemp,
    ambientHumidity,
    ambientPressure,
    ambientLight,
    lastSynced: new Date(Date.now() - Math.round(Math.random() * 30000)).toISOString(),
  };
}

// ============================================================
// MOCK 24H STATION HISTORY GENERATOR
// ============================================================

function generate24hHistory(currentPm25: number): { time: string; pm25: number }[] {
  const history: { time: string; pm25: number }[] = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const h = t.getHours();
    // Traffic-correlated pattern: peaks at 8am and 6pm
    const trafficFactor = Math.sin((h - 2) * 0.26) * 0.3 + Math.sin((h - 14) * 0.39) * 0.2;
    const baseValue = currentPm25 * (0.6 + trafficFactor + Math.random() * 0.3);
    history.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pm25: Math.round(Math.max(2, baseValue) * 10) / 10,
    });
  }

  return history;
}

// ============================================================
// STATION NAME MASKING
// ============================================================

const SENSOR_LABELS = ['α', 'β', 'γ', 'δ', 'ε'];

function maskStationName(index: number): string {
  const label = SENSOR_LABELS[index % SENSOR_LABELS.length];
  return `Environmental Sensor ${label}`;
}

// ============================================================
// HELPERS
// ============================================================

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371;
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

// ============================================================
// MAIN HOOK
// ============================================================

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    profile: null,
    airQuality: null,
    appointments: [],
    weather: null,
    watchData: null,
    stationData: null,
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
          .select("sector, full_name, focus_index, stress_triggers, pollution_sensitivity, respiratory_conditions")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        // Add default values for missing columns
        const profile = profileData ? {
            ...profileData,
            focus_index: profileData.focus_index || 10,
            stress_triggers: profileData.stress_triggers || [],
            pollution_sensitivity: profileData.pollution_sensitivity || 5,
            respiratory_conditions: profileData.respiratory_conditions || [],
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

          let forecast: { time: string; temp: number; condition: string }[] = [];
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

          // Build station data with masking
          const activePm25 = nearestStation ? Number(nearestStation.pm25) || 0 : 0;
          const stationData: StationData | null = nearestStation ? {
            active: {
              id: nearestStation.id,
              displayName: maskStationName(0),
              pm25: activePm25,
              pm10: Number(nearestStation.pm10) || 0,
              lastUpdated: nearestStation.last_updated || new Date().toISOString(),
            },
            history24h: generate24hHistory(activePm25),
          } : null;

          // Generate mock watch data (correlated with current PM2.5)
          const watchData = generateMockWatchData(activePm25);

          setData({
            profile,
            airQuality: nearestStation,
            appointments: appointmentsRes.data || [],
            weather: weatherData,
            watchData,
            stationData,
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
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          const newRecord = payload.new as any;
          const newPm25 = Number(newRecord.pm25);
          
          setData(prev => ({
            ...prev,
            airQuality: {
                ...prev.airQuality!,
                ...newRecord,
                pm25: newPm25,
                pm10: Number(newRecord.pm10),
            },
            // Regenerate watch data with updated PM2.5 correlation
            watchData: generateMockWatchData(newPm25),
            stationData: prev.stationData ? {
              ...prev.stationData,
              active: {
                ...prev.stationData.active,
                pm25: newPm25,
                pm10: Number(newRecord.pm10),
                lastUpdated: newRecord.last_updated || new Date().toISOString(),
              },
            } : null,
          }));
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from air_quality changes');
      supabase.removeChannel(channel);
    };
  }, [data.profile?.sector]);

  // Periodic watch data refresh (simulate real-time wearable sync every 30s)
  useEffect(() => {
    if (!data.airQuality) return;
    
    const interval = setInterval(() => {
      const currentPm25 = data.airQuality?.pm25 || 0;
      setData(prev => ({
        ...prev,
        watchData: generateMockWatchData(currentPm25),
      }));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [data.airQuality?.pm25]);

  return data;
};
