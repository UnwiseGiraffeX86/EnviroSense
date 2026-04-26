import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

// ============================================================
// TYPES
// ============================================================

/** Raw reading pushed from Android native → WebView via window.onWatchData() */
export interface WatchReading {
  type:
    | "heart_rate"
    | "hrv"
    | "spo2"
    | "skin_temp"
    | "eda_stress"
    | "steps"
    | "ecg";
  value: number;
  /** ISO-8601 timestamp from the sensor, falls back to Date.now() */
  timestamp?: string;
}

/** Row shape for Supabase insert — matches `watch_readings` table */
interface WatchReadingRow {
  user_id: string;
  reading_type: WatchReading["type"];
  value: number;
  recorded_at: string;
  device_id: string;
}

/** Functions exposed by the Android native layer on `window.AndroidBridge` */
interface AndroidBridge {
  startScan(): void;
  stopScan(): void;
  connect(address: string): void;
  disconnect(): void;
}

/** Augment the global Window to include the bridge + callback */
declare global {
  interface Window {
    AndroidBridge?: AndroidBridge;
    onWatchData?: (reading: WatchReading) => void;
  }
}

// ============================================================
// CONSTANTS
// ============================================================

const FLUSH_INTERVAL_MS = 10_000;
const DEVICE_ID = "pixel_watch_4";

// ============================================================
// HOOK
// ============================================================

export function usePixelWatch() {
  // ── State ──────────────────────────────────────────────────
  const [isConnected, setIsConnected] = useState(false);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);
  const [latestReadings, setLatestReadings] = useState<
    Record<WatchReading["type"], number>
  >({
    heart_rate: 0,
    hrv: 0,
    spo2: 0,
    skin_temp: 0,
    eda_stress: 0,
    steps: 0,
    ecg: 0,
  });

  // ── Refs (stable across renders) ──────────────────────────
  const bufferRef = useRef<WatchReadingRow[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userIdRef = useRef<string | null>(null);

  // ── Resolve current user once ─────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      userIdRef.current = data.user?.id ?? null;
    });
  }, []);

  // ── Flush buffer → Supabase ───────────────────────────────
  const flushBuffer = useCallback(async () => {
    if (bufferRef.current.length === 0) return;

    const rows = [...bufferRef.current];
    bufferRef.current = [];

    const { error } = await supabase.from("watch_readings").insert(rows);

    if (error) {
      // Put rows back so we retry next cycle
      console.error("[usePixelWatch] Supabase insert failed:", error.message);
      bufferRef.current = [...rows, ...bufferRef.current];
    }
  }, []);

  // ── Register the global callback + flush timer ────────────
  useEffect(() => {
    // Callback invoked by Android native: window.onWatchData({ type, value })
    window.onWatchData = (reading: WatchReading) => {
      const ts = reading.timestamp ?? new Date().toISOString();

      // Update live state
      if (reading.type === "heart_rate") {
        setCurrentBpm(reading.value);
      }
      setLatestReadings((prev) => ({ ...prev, [reading.type]: reading.value }));
      setIsConnected(true);

      // Buffer for Supabase batch insert
      if (userIdRef.current) {
        bufferRef.current.push({
          user_id: userIdRef.current,
          reading_type: reading.type,
          value: reading.value,
          recorded_at: ts,
          device_id: DEVICE_ID,
        });
      }
    };

    // Start periodic flush
    timerRef.current = setInterval(flushBuffer, FLUSH_INTERVAL_MS);

    return () => {
      // Cleanup
      window.onWatchData = undefined;
      if (timerRef.current) clearInterval(timerRef.current);
      // Final flush on unmount
      flushBuffer();
    };
  }, [flushBuffer]);

  // ── Bridge helpers (with browser fallback) ────────────────
  const hasBridge = typeof window !== "undefined" && !!window.AndroidBridge;

  const startScan = useCallback(() => {
    if (hasBridge) {
      window.AndroidBridge!.startScan();
    } else {
      console.log("[usePixelWatch] startScan() — no AndroidBridge, running in browser");
    }
  }, [hasBridge]);

  const stopScan = useCallback(() => {
    if (hasBridge) {
      window.AndroidBridge!.stopScan();
    } else {
      console.log("[usePixelWatch] stopScan()");
    }
  }, [hasBridge]);

  const connect = useCallback(
    (address: string) => {
      if (hasBridge) {
        window.AndroidBridge!.connect(address);
      } else {
        console.log(`[usePixelWatch] connect(${address}) — simulated`);
        setIsConnected(true);
      }
    },
    [hasBridge]
  );

  const disconnect = useCallback(() => {
    if (hasBridge) {
      window.AndroidBridge!.disconnect();
    } else {
      console.log("[usePixelWatch] disconnect()");
    }
    setIsConnected(false);
    setCurrentBpm(null);
  }, [hasBridge]);

  // ── Return ────────────────────────────────────────────────
  return {
    isConnected,
    currentBpm,
    latestReadings,
    startScan,
    stopScan,
    connect,
    disconnect,
  };
}
