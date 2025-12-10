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

        if (profile?.sector) {
          // 3. Parallel Fetch: Air Quality, Appointments, and Weather
          const [airQualityRes, appointmentsRes, weatherRes] = await Promise.all([
            supabase
              .from("air_quality")
              .select("pm25, pm10, last_updated, sector_name")
              .eq("sector_name", profile.sector)
              .maybeSingle(),
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
            // Fetch real weather data from OpenMeteo (Bucharest coordinates for demo)
            fetch("https://api.open-meteo.com/v1/forecast?latitude=44.4268&longitude=26.1025&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto")
              .then(res => res.json())
          ]);

          // Map OpenMeteo WMO codes to conditions
          const getWeatherCondition = (code: number) => {
            if (code === 0) return "Clear Sky";
            if (code <= 3) return "Partly Cloudy";
            if (code <= 48) return "Foggy";
            if (code <= 67) return "Rainy";
            if (code <= 77) return "Snowy";
            return "Stormy";
          };

          let forecast = [];
          if (weatherRes.hourly) {
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

          const weatherData = weatherRes.current ? {
            temperature: weatherRes.current.temperature_2m,
            humidity: weatherRes.current.relative_humidity_2m,
            windSpeed: weatherRes.current.wind_speed_10m,
            condition: getWeatherCondition(weatherRes.current.weather_code),
            forecast: forecast
          } : null;

          setData({
            profile,
            airQuality: airQualityRes.data,
            appointments: appointmentsRes.data || [],
            weather: weatherData,
            loading: false,
          });
        } else {
            setData(prev => ({ ...prev, profile, loading: false }));
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", JSON.stringify(error, null, 2));
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
          setData(prev => ({
            ...prev,
            airQuality: payload.new as any,
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
