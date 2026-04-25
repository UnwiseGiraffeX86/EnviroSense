# ⌚ EnviroSense Sentinel: Wear OS Companion App

**Target Hardware:** Google Pixel Watch (Wear OS 4+, API 33+)
**Codename:** *Sentinel-W*
**Role:** Sensor-First Data Acquisition Node
**Date:** December 2025
**Status:** Specification — Hackathon Build Track

---

## 0. Executive Summary

The web app is the **Brain** (analysis, doctor handoff, RAG). The Android app is the **Nervous System** (mobile data router, GPS, foreground services). The Pixel Watch is the **Skin** — the layer that *touches* the user 24/7.

> **Sentinel-W is not a "tiny version of the app." It is a sensor probe with a glanceable alert surface.**

The watch's job is to:
1. **Acquire** continuous biometric, motion, and ambient signals.
2. **Pre-process** them on-device (privacy + battery).
3. **Stream** critical alerts in real-time / **batch** bulk telemetry every 15 min.
4. **Notify** the user when the Digital Twin detects a Compound Risk event.

It does **NOT** run the LLM, does **NOT** show charts, does **NOT** replace the phone. It is a **glanceable, ambient guardian**.

---

## 1. Architectural Position

```
┌───────────────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│   ⌚ SENTINEL-W       │    │  📱 ENVIROSENSE GO   │    │  🌐 ENVIROSENSE WEB│
│   (Wear OS / Pixel)   │◄──►│   (Android)          │◄──►│   (Next.js)        │
│                       │    │                      │    │                    │
│  • Sensors (HR/HRV)   │    │  • GPS / Sectors     │    │  • RAG / LLM       │
│  • Accelerometer      │    │  • Health Connect    │    │  • Doctor Console  │
│  • Barometer          │    │  • OpenAQ ingest     │    │  • Supabase RLS    │
│  • Microphone (cough) │    │  • BG Foreground Svc │    │  • Realtime WS     │
│  • Glanceable alerts  │    │  • Sync orchestrator │    │  • Risk scoring    │
└───────────────────────┘    └──────────────────────┘    └────────────────────┘
       Data Layer API              REST + Realtime
       (Wearable Bluetooth)        (HTTPS / WebSocket)
```

### 1.1 The "Skin → Nervous System → Brain" Hierarchy

| Layer | Device | Latency Tolerance | Compute Profile |
| :--- | :--- | :--- | :--- |
| **Skin** | Pixel Watch | < 100 ms (haptic alerts) | Ultra-low power, edge ML only |
| **Nervous System** | Android Phone | 1–5 s | Mid-tier, foreground services |
| **Brain** | Web / Supabase | 1–10 s | Server-side LLM, RAG, RLS |

### 1.2 Why Watch-First Acquisition Matters

From `DIGITAL_TWIN_2_0.md` §2: *"The user no longer needs to be a Data Entry Clerk."* The watch is the **ultimate passive observer** — it sees the user's HRV drop *before* they consciously feel anxious, and it correlates that with a PM2.5 spike that the phone has already detected via OpenAQ.

This is the **biological ground truth** referenced in `MOBILE_APP_ROADMAP.md` §2 (Bio-Sync Bridge), captured at the source instead of pulled retroactively from Health Connect.

---

## 2. Data Acquisition Specification

The watch operates a **Full Sensor Suite**. All sensor access requires runtime permissions and explicit onboarding consent (GDPR Art. 9 — health data is Special Category).

### 2.1 Biological Signals (Primary)

| Signal | Sensor / API | Sample Rate | Purpose | Maps to Digital Twin Field |
| :--- | :--- | :--- | :--- | :--- |
| **Heart Rate (HR)** | `Sensor.TYPE_HEART_RATE` | 1 Hz (continuous) | Stress baseline | `bio_state.hr_resting` |
| **Heart Rate Variability (HRV)** | Health Services API (`HEART_RATE_VARIABILITY_RMSSD`) | 5 min windows | ANS dysregulation → anxiety proxy | `bio_state.hrv_rmssd` |
| **SpO2** | `PassiveMonitoringClient` | On-demand + sleep | Respiratory stress (asthma trigger) | `bio_state.spo2` |
| **Skin Temperature** | Wear Health Services | 1 Hz when worn | Inflammation proxy | `bio_state.skin_temp_delta` |
| **Sleep Stages** | Health Services `SLEEP_*` | Nightly aggregate | Recovery score | `bio_state.deep_sleep_min` |

> **Critical:** Per `GOVERNING_PHYSICS.md` §3, the cumulative stress function `S(t)` requires a continuous biological signal. The watch supplies the `α · PM2.5(τ)`-coupled term in real-time.

### 2.2 Motion Signals (Cognitive & Behavioral)

| Signal | Sensor | Sample Rate | Purpose |
| :--- | :--- | :--- | :--- |
| **Accelerometer** | `Sensor.TYPE_ACCELEROMETER` | 50 Hz (test mode) / 5 Hz (passive) | **Neuro-Steady Test** (tremor variance) |
| **Gyroscope** | `Sensor.TYPE_GYROSCOPE` | 50 Hz (test mode) | Micro-tremor angular drift |
| **Step Count** | `Sensor.TYPE_STEP_COUNTER` | Event-driven | Activity-vs-pollution exposure |
| **Activity Recognition** | Health Services `EXERCISE_*` | State changes | Distinguishes "in traffic" vs "at home" |

The **Neuro-Steady Test** (`MOBILE_APP_ROADMAP.md` §5) is **upgraded** on the watch: instead of holding a phone, the user simply holds out their wrist for 10 seconds. The accelerometer logs X/Y/Z variance; the on-watch model classifies tremor severity.

### 2.3 Ambient Signals (Environmental Cross-Reference)

| Signal | Source | Purpose |
| :--- | :--- | :--- |
| **Barometric Pressure** | `Sensor.TYPE_PRESSURE` | Migraine risk (per `DIGITAL_TWIN_2_0.md` §4.2) |
| **Ambient Light** | `Sensor.TYPE_LIGHT` | Indoor/outdoor inference |
| **Microphone (Cough Detection)** | `AudioRecord` + on-device CoreML/TFLite | "Cough Sentry" passive count |

### 2.4 Cough Sentry — Privacy-First Audio

The microphone is the most sensitive sensor. The implementation MUST follow the model from `MOBILE_APP_ROADMAP.md` §4:

- Audio is processed in 2-second windows by a **TensorFlow Lite cough classifier** running entirely on-watch.
- **Raw audio is NEVER stored, NEVER transmitted, NEVER reaches the phone.**
- Only the **classification result** (`{timestamp, confidence, count_increment}`) is emitted to the Data Layer.
- A persistent foreground notification with the recording icon must be visible whenever the listener is active (Android compliance).
- Default state: **OFF**. User must opt-in via the phone app's settings, with a clear consent screen.

---

## 3. Sync Architecture: Hybrid Streaming

The watch uses a **two-channel sync model**: a real-time channel for alerts and a batched channel for bulk telemetry. This mirrors the "operational vs. analytical" split in `TECHNICAL_DOSSIER.md` §3.

### 3.1 Channel A — Real-Time Alert Bus

**Purpose:** Sub-second event delivery for time-critical signals.

**Mechanism:** Wear OS **Data Layer API** — `MessageClient.sendMessage()` over Bluetooth LE.

**Triggers (watch → phone):**
- HR > 120 bpm sustained > 60 s (acute stress)
- SpO2 < 92% (respiratory event)
- HRV drop > 30% from 24h baseline (anxiety onset)
- Cough rate > 10 events / 5 min (respiratory flare)
- User-initiated SOS (long-press crown)

**Triggers (phone → watch):**
- "High Pollution Plume Inbound" (from wind vector analysis)
- "Barometric Drop Detected → Migraine Risk"
- Doctor message received (see `TECHNICAL_DOSSIER.md` Flow C)

**Payload format:**
```json
{
  "event_type": "HRV_ANOMALY",
  "ts": 1733606400000,
  "value": 23.4,
  "baseline": 38.2,
  "severity": "medium",
  "schema_v": 1
}
```

### 3.2 Channel B — Batched Telemetry Sync

**Purpose:** Bulk biometric history with battery efficiency.

**Mechanism:** Wear OS **DataClient** with `PutDataMapRequest` — uses the synced data store, replicated every 15 min when in BLE range, opportunistically over Wi-Fi Direct on Pixel Watch.

**Schedule:**
- **Every 15 min:** Aggregated HR/HRV/Skin-Temp window stats (min/max/mean/p95).
- **Every 60 min:** Step count, activity classifications, ambient signals.
- **Once daily (post-sleep):** Sleep stages, full daily summary.

**Batch payload structure:**
```json
{
  "watch_session_id": "uuid",
  "window_start": 1733606400000,
  "window_end": 1733607300000,
  "samples": {
    "hr": { "mean": 72, "p95": 88, "n": 900 },
    "hrv_rmssd": 41.2,
    "skin_temp_delta": 0.3,
    "steps": 1247,
    "barometric_kpa": 101.2,
    "cough_count": 0
  },
  "schema_v": 1
}
```

### 3.3 Phone → Supabase Hop

The phone (`EnviroSense Go`) is the **only entity** that talks to Supabase. The watch never touches the network directly. Reasons:

1. **Auth:** The JWT lives in the phone's Encrypted SharedPreferences. Mirroring it to the watch doubles the attack surface.
2. **RLS:** All inserts are scoped by `auth.uid()` — that identity originates from the phone session.
3. **Battery:** Cellular/Wi-Fi radios on the watch are 5–10x more expensive than BLE.
4. **Offline tolerance:** Watch can buffer 48 h of telemetry locally; phone handles eventual delivery.

The phone enriches incoming watch data with `current_sector` (PostGIS lookup) before insertion. Schema additions to `medical_profiles` from `DIGITAL_TWIN_2_0.md` §3.1 (especially `exposure_profile` JSONB) accept the watch's cumulative signals natively.

### 3.4 Offline Buffering

If the phone is out of range:
- Real-time alerts are **queued** (max 100 events, FIFO eviction) and flushed on reconnect.
- Batched telemetry is **persisted** in a Room database on the watch (`watch_buffer.db`).
- Visible on-watch indicator: a small disconnect icon on the ambient face (see §5.4).

---

## 4. On-Device Processing

The watch is not a dumb sensor — it runs three lightweight algorithms locally to reduce both bandwidth and privacy exposure.

### 4.1 HRV Baseline Calibration

A 7-day rolling baseline of `hrv_rmssd` is maintained on the watch using exponential weighted moving average (`α = 0.1`). Anomaly detection compares the current 5-min reading to baseline ± 2σ before triggering an alert. This avoids spamming the phone with noise from individual outliers.

### 4.2 Tremor Variance Calculator

For Neuro-Steady tests, the watch computes:

```
σ_total = sqrt(σ_x² + σ_y² + σ_z²)
focus_index_delta = clip( (σ_total - σ_baseline) / σ_baseline, -1, 1 )
```

Only the resulting `focus_index_delta` is transmitted, not the raw 500-sample accelerometer trace.

### 4.3 Cough Classifier (TFLite)

- Model: ~250 KB int8-quantized CNN on log-mel spectrograms.
- Window: 2 s @ 16 kHz mono.
- Output: `{is_cough: bool, confidence: float}`.
- Inference: ~15 ms on Pixel Watch's Snapdragon W5+.
- Threshold: `confidence > 0.85` triggers a count increment.

### 4.4 Compound Risk Pre-Filter

The watch maintains a **"Triage Gate"** mirroring the Hybrid-AI architecture in `TECHNICAL_DOSSIER.md` §6. If both:
- Bio anomaly detected (HR or HRV out of band), AND
- Last known sector PM2.5 from cached phone state > 25 µg/m³,

then the watch **upgrades** the alert priority and triggers an immediate haptic. Otherwise, it queues the event for batched delivery.

This is the watch-side implementation of the EU Directive 2024/2881 threshold check.

---

## 5. UI / UX Specification

The watch UI is **minimalist by mandate** — it is a passive collector, not a full app. The user should feel its presence only when it matters.

### 5.1 Design System Compliance

The watch inherits the **Eco-Neuro / Organic Data** language from `PROJECT_STATUS.md` §4 and the `Graphics & Design.pdf` dossier, adapted for AMOLED and small displays.

| Token | Hex | Wear OS Usage |
| :--- | :--- | :--- |
| **Canvas Dark** | `#2C241B` | Default watch face background (AMOLED black-equiv, battery-friendly) |
| **Cream Canvas** | `#FAF3DD` | Text on dark, alert sheet background |
| **Tech Accent (Teal Pulse)** | `#00A36C` | Primary action, "all clear" status, sync indicator |
| **Human Accent (Coral Spark)** | `#E07A5F` | Warnings, alerts, anomaly indicators |
| **Deep Brown** | `#562C2C` | Secondary text on Cream surfaces |

**Dark Mode is the only mode.** OLED displays burn power proportional to lit pixels — Cream backgrounds are reserved for transient alert sheets.

### 5.2 Surfaces (only four)

#### 5.2.1 Ambient Watch Face Complication
A single circular complication compatible with any Pixel Watch face:
- **Center icon:** The "Living Node" orb (per `Graphics & Design.pdf` §3) — a small Teal Pulse circle.
- **Pulse rate:** Mirrors the user's current HR (subtle, 60 bpm idle if unworn).
- **Color shift:** Goes from Teal → Coral as Compound Risk score rises.
- **Tap action:** Opens the Sentinel tile.

#### 5.2.2 Sentinel Tile
A single Wear OS Tile (no swipe-through carousel — keeps it focused):
- **Top:** Current Compound Risk Score (1–10), color-mapped.
- **Middle:** Three glanceable rows — `❤ HR` / `🌫 PM2.5 (last sync)` / `🌡 Skin Δ`.
- **Bottom:** "Last sync 3 min ago" + a teal sync dot (or coral if disconnected).
- **No buttons.** This is read-only by design.

#### 5.2.3 Alert Sheet (push-driven)
Triggered by Channel A events. Full-screen takeover with haptic.
- **Cream Canvas background**, Teal/Coral border depending on severity.
- **Plain-language headline** ("Air quality dropped — close windows" / "Heart rate elevated").
- **Two actions only:** "Got it" (dismiss) / "Open on phone" (deep link).
- **Auto-dismiss** after 30 s if untouched.

#### 5.2.4 Neuro-Steady Test Screen
The only interactive screen.
- Triggered from a notification or a phone-side "Run Test" command.
- 10-second countdown with a calming Teal ring animation.
- Result: a single number (`focus_index_delta`) + qualitative label ("Steady" / "Slightly Off" / "Significantly Off").
- Result auto-syncs to phone; no on-watch history view.

### 5.3 What the Watch Does NOT Show
Explicitly out-of-scope (route the user to the phone or web app):
- Charts, graphs, history.
- Doctor chat / messaging.
- Pollution maps.
- Symptom logging forms (a single voice memo is the future maximum).
- Settings (all configuration lives on the phone app).

### 5.4 Iconography

Per the `Graphics & Design.pdf` "Line & Splash" system, watch icons are **line-only** (no splash on AMOLED — it would burn pixels). Stroke: 2 px, rounded caps, Teal Pulse default. Icons used: Healthcare cross (HR), Pulse Leaf (HRV), Wind (air), Brain (Neuro-Steady), Cloud-with-disconnect (offline).

---

## 6. Background Execution Model

Wear OS battery is the binding constraint. The Pixel Watch has ~24-36 h on a charge under typical load — Sentinel-W targets adding **< 8% / day** to baseline drain.

### 6.1 The Three Execution Modes

| Mode | Trigger | Sensors Active | Drain Profile |
| :--- | :--- | :--- | :--- |
| **Active** | App in foreground | All | High (~5%/h) |
| **Ambient Passive** | Default 24/7 mode | HR (1 Hz), Accel (5 Hz), Pressure | Low (~0.3%/h) |
| **Sleep** | Detected sleep state | HR, SpO2, Skin Temp only | Very low (~0.15%/h) |

### 6.2 Foreground Service Strategy

A persistent `ForegroundService` runs at all times for sensor coordination, declared with `foregroundServiceType="health"` (Wear OS 4+). This is required for continuous HR access and is the cleanest way to comply with `Health Permission` lifecycle.

### 6.3 Cough Sentry Lifecycle

Cough Sentry is opt-in and has its own foreground service with `foregroundServiceType="microphone"`. It can be scheduled by the phone (e.g., "only run during waking hours") to limit drain.

---

## 7. Privacy & Compliance (GDPR + EU AI Act of 2030)

The watch is the **most sensitive node** in the system — it touches biometrics directly. The implementation MUST satisfy:

### 7.1 Data Minimization (GDPR Art. 5)
- No raw audio leaves the watch (Cough Sentry).
- No raw accelerometer traces leave the watch (Neuro-Steady).
- All transmitted bio signals are **aggregated** (mean/p95) over 15-min windows, not per-sample.

### 7.2 Consent (GDPR Art. 9 — Special Category)
- Each sensor category requires a separate opt-in screen on the phone during onboarding.
- Granular toggles: a user may enable HR but disable Cough Sentry.
- Consent is logged with timestamp and version in `medical_profiles.consent_ledger` (a JSONB column to be added).

### 7.3 PII Boundary
Per the "Airlock" pattern (`PRESENTATION.md` §4): the watch knows nothing about the user's identity. It uses only an opaque `device_pairing_id`. The phone joins this to `auth.uid()` server-side. If the watch is lost, the pairing can be revoked without touching the user record.

### 7.4 Microphone Disclosure
While Cough Sentry runs, a system notification with the microphone-active icon is permanently visible — non-dismissible. This is both an Android requirement and an ethical commitment.

### 7.5 Right to Erasure
A "Wipe Watch" command from the phone app:
1. Clears `watch_buffer.db`.
2. Revokes Data Layer pairing.
3. Triggers a server-side `DELETE` cascade on watch-sourced records (RLS-scoped).

---

## 8. Tech Stack

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| **Language** | Kotlin 2.0 + Jetpack Compose for Wear OS | Standard for modern Wear OS |
| **Min SDK** | API 33 (Wear OS 4) | Pixel Watch baseline |
| **Sensor Access** | Health Services Client API + SensorManager | Health Services = battery-optimized; SensorManager = raw access for tremor test |
| **Sync** | Wearable Data Layer API (`DataClient` + `MessageClient`) | Native, no third-party dep |
| **Local Storage** | Room (KSP) | Buffering + offline |
| **ML Inference** | TensorFlow Lite (with NNAPI delegate) | Cough classifier |
| **Tile** | `androidx.wear.tiles` | Standard Tile API |
| **Complications** | `androidx.wear.watchface.complications.data` | Watch face integration |
| **DI** | Hilt | Consistency with Android app |
| **Build** | Gradle KTS, Version Catalog | Shared with phone module |

The watch lives as a `:wear` Gradle module **inside the same multi-module project** as the Android app (`:app`, `:wear`, `:shared`). Schema definitions and Data Layer payload classes live in `:shared` to guarantee phone-watch wire compatibility.

---

## 9. Integration with Existing Architecture

### 9.1 New Tables / Schema Deltas

To `medical_profiles` (extends `DIGITAL_TWIN_2_0.md` §3.1):

```sql
ALTER TABLE medical_profiles
ADD COLUMN watch_pairing_id UUID,
ADD COLUMN watch_last_sync TIMESTAMPTZ,
ADD COLUMN consent_ledger JSONB DEFAULT '{}';
```

New table for high-resolution watch telemetry:

```sql
CREATE TABLE wearable_telemetry (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  hr_mean SMALLINT,
  hr_p95 SMALLINT,
  hrv_rmssd REAL,
  skin_temp_delta REAL,
  spo2 SMALLINT,
  steps INTEGER,
  cough_count SMALLINT,
  barometric_kpa REAL,
  current_sector TEXT,    -- enriched by phone before insert
  pm25_at_window REAL,    -- enriched by phone (from air_quality cache)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Standard RLS pattern from TECHNICAL_DOSSIER.md
ALTER TABLE wearable_telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_owns_telemetry ON wearable_telemetry
  FOR ALL USING (auth.uid() = user_id);
```

### 9.2 New Edge Function

`/functions/v1/watch-alert-handler` — receives Channel A real-time alerts from the phone, runs the Triage Gate (lightweight Random Forest from `TECHNICAL_DOSSIER.md` §6), and either:
- Auto-dismisses (low risk),
- Logs to `patient_logs`,
- Or escalates to the existing `analyze-risk` function for full RAG triage.

This keeps the watch out of the LLM cost path (preserving the ~$0.008/interaction figure from `PRESENTATION.md` §5).

### 9.3 Doctor Console Impact
Doctor view (`PROJECT_STATUS.md` §3 Phase 2) gets a new **"Wearable Vitals Strip"** above the existing care card — a 24h sparkline of HR/HRV/SpO2 sourced from `wearable_telemetry`. This makes the "Compound Risk" alert in `Developer Blueprint.pdf` §4 immediately legible: doctor sees the bio signal *and* the environmental spike on one screen.

---

## 10. Build Roadmap (Hackathon-Pragmatic)

A 5-day execution plan, prioritizing the demoable killer feature (real-time biometric → environmental correlation) over breadth.

### Day 1 — Skeleton & Pairing
- `:wear` Gradle module scaffolded.
- Data Layer pairing handshake working (watch ↔ phone "hello world" message).
- Eco-Neuro theme tokens ported to Compose for Wear.
- Persistent foreground service with HR sensor live.

### Day 2 — Core Acquisition
- HR + HRV continuous capture via Health Services.
- Accelerometer + Barometer sampling.
- 15-min window aggregator with Room buffer.
- Batched sync (Channel B) flushing to phone.

### Day 3 — Real-Time Alerts
- Channel A `MessageClient` plumbing both directions.
- HRV anomaly detector (baseline + 2σ).
- Watch-side Alert Sheet UI.
- Phone-side "watch-alert-handler" edge function.

### Day 4 — Sentinel Tile + Neuro-Steady
- Sentinel Tile with risk score.
- Complication for any watch face.
- Neuro-Steady accelerometer test screen.
- Pre-fill `wearable_telemetry` table with seed data for demo.

### Day 5 — Polish & Demo
- Cough Sentry as **stretch goal** (TFLite model behind feature flag).
- Demo script: trigger fake PM2.5 spike → watch HRV "drops" → real-time alert fires → doctor console lights up.
- Battery profiling on physical Pixel Watch.
- README, screen recordings, final QA pass.

> If short on time, **drop Cough Sentry first** (highest implementation cost, lowest demo impact). The HR/HRV → environmental correlation is the killer demo.

---

## 11. Open Questions (Resolve Before Day 1)

1. **Pixel Watch model:** Pixel Watch 2/3 has the Snapdragon W5+, Pixel Watch 1 has Exynos 9110 — TFLite cough model needs benchmarking on the actual target device.
2. **Health Connect on phone vs. direct watch ingest:** For redundancy, should the phone *also* pull from Health Connect, or trust the watch as the sole source? Recommendation: trust the watch live, use Health Connect as a nightly reconciliation cross-check.
3. **Wake locks during sleep:** SpO2 nightly readings tradeoff — accuracy vs. drain. Recommendation: 4 readings/night, not continuous.
4. **Pairing UX:** QR-code pairing during phone onboarding, or out-of-band via Bluetooth picker? Recommendation: QR for the demo (cleaner narrative).

---

## 12. Reference Map

This document derives from and extends:
- `TECHNICAL_DOSSIER.md` — Backend, RLS, hybrid-AI cost model.
- `DIGITAL_TWIN_2_0.md` — Passive observation philosophy, schema deltas.
- `MOBILE_APP_ROADMAP.md` — Bio-Sync Bridge (§2), Cough Sentry (§4), Neuro-Steady (§5).
- `GOVERNING_PHYSICS.md` — Stress function `S(t)` consuming watch bio signals.
- `Graphics & Design.pdf` — Eco-Neuro design tokens, Living Node mascot, line iconography.
- `PROJECT_STATUS.md` — Color palette, current alpha state.
- `Developer Blueprint.pdf` (Eco-Neuro Sentinel) — Compound Risk Agent context.
- `PRESENTATION.md` — Demo narrative anchoring.

---

**End of specification.** Ship it.
