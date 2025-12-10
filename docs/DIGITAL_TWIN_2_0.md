# Digital Twin 2.0: The Zero-Friction Evolution

**Status:** Draft / Architecture Proposal  
**Target Release:** Q2 2026  
**Author:** Lead Product Architect  

---

## 1. Abstract
The initial iteration of EnviroSense relied heavily on **Active User Input** (e.g., "How do you feel?"). While valuable for calibration, this introduces friction and long-term churn. **Digital Twin 2.0** represents a paradigm shift towards **Passive Observation** and **Predictive Intervention**. By correlating implicit digital signals (browser focus, typing cadence) with hyper-local environmental telemetry, we can detect neurological impact ("Brain Fog") before the user is even consciously aware of it.

## 2. Core Philosophy: From Self-Reported to Passive Observation

The "Neuro-Symbolic" engine must evolve from a reactive chatbot to a proactive background process.

*   **Old Model (v1):** User feels bad -> User opens app -> User logs symptom -> AI correlates with Air Quality.
*   **New Model (v2):** AI detects erratic browser behavior (Focus Metric drop) -> AI checks Sector 1 PM2.5 levels -> AI infers "Cognitive Decline due to Pollution" -> AI pushes pre-emptive alert.

**Key Proxy Metrics:**
1.  **Cognitive Load Proxy:** Browser tab switching frequency & session duration (via Extension).
2.  **Physical Stress Proxy:** Typing cadence and error rate.
3.  **Environmental Exposure:** Geolocation-based "Time-at-Risk" accounting.

---

## 3. Architecture Upgrade (Technical Specs)

### 3.1 Data Layer Extensions
We are extending the `medical_profiles` schema to support cumulative tracking and dynamic sensitivity.

```sql
-- Proposed Schema Additions for Digital Twin 2.0

ALTER TABLE medical_profiles 
ADD COLUMN exposure_profile JSONB DEFAULT '{
  "daily_pm25_load": 0.0,
  "weekly_no2_load": 0.0,
  "last_reset": "2025-01-01T00:00:00Z"
}';

ALTER TABLE medical_profiles 
ADD COLUMN cumulative_toxicity_index FLOAT DEFAULT 0.0; 
-- A calculated score (0-100) representing aggregate organ stress

ALTER TABLE medical_profiles 
ADD COLUMN pollen_sensitivity JSONB DEFAULT '{
  "ragweed": "unknown",
  "birch": "unknown",
  "grass": "unknown",
  "confirmed_by_doctor": false
}';
```

### 3.2 External API Integration
To support the "Neuro-Symbolic" logic, we are expanding our sensor array beyond OpenAQ.

| API Service | Purpose | Data Points |
| :--- | :--- | :--- |
| **Ambee / BreezoMeter** | Pollen Data | Ragweed, Grass, Tree Pollen counts |
| **OpenMeteo** | Weather Patterns | Wind Vector, Barometric Pressure (Migraine trigger) |
| **Browser Extension API** | Cognitive Proxy | `tabs.onActivated`, `idle.queryState` |

### 3.3 The "Two-Step" RAG Pipeline
The inference engine will now perform a double-pass verification to ensure advice is both legally compliant and medically sound.

1.  **Pass 1 (The Guardrail):** Query `knowledge_base` for **Regulatory Documents** (EU Directives).
    *   *Check:* "Is current PM2.5 > 25µg/m³ (EU Limit)?"
2.  **Pass 2 (The Diagnosis):** Query `knowledge_base` for **Clinical Journals**.
    *   *Check:* "Does PM2.5 exposure correlate with the user's specific neuro-symptoms (e.g., anxiety)?"

---

## 4. Feature Deep Dive

### 4.1 Cumulative Sector Accounting
Pollution isn't instantaneous; it's cumulative. We are moving from "Spot Checks" to "Time-at-Risk".

*   **Mechanism:** The backend runs a cron job every 15 minutes.
*   **Logic:** If User is in `Sector 1` AND `PM2.5 > Threshold`, increment `exposure_profile.daily_pm25_load`.
*   **Outcome:** We can alert a user: *"You have reached 80% of your weekly safe nitrogen dioxide limit. Consider working from home tomorrow."*

### 4.2 Self-Healing Thresholds
The "High Risk" threshold is no longer static. It adapts to the individual's biological resilience.

*   **Scenario:** User reports "Feeling Great" despite PM2.5 being 35µg/m³ (High).
*   **Action:** The AI **downgrades** the user's specific sensitivity weight for PM2.5.
*   **Result:** Fewer false positives. The system learns that *this* specific user is resilient to particulate matter but perhaps sensitive to Barometric Pressure.

---

## 5. User Experience (The "Why")

### 5.1 Zero-Friction Monitoring
The user no longer needs to be a "Data Entry Clerk." By installing the browser extension or allowing background location, the Digital Twin builds itself. The value proposition shifts from "Tool" to "Guardian."

### 5.2 Proactive "Pre-emptive" Alerts
Instead of reporting *current* bad air (which the user can already smell), we predict *future* risk.

*   **Wind Vector Analysis:** "A high-pollution plume is moving from Sector 6 towards your location. Close windows in the next 20 minutes."
*   **Barometric Drop:** "Pressure is dropping rapidly. Migraine risk is elevated. Hydrate now."

---

## 6. Implementation Roadmap

1.  **Phase 1:** Database Migration & Schema Update (Week 1-2).
2.  **Phase 2:** Ingest Pollen & Weather Data Sources (Week 3).
3.  **Phase 3:** Build "Passive Signal" Browser Extension Prototype (Week 4-6).
4.  **Phase 4:** Train "Self-Healing" Weighting Algorithm (Week 7-8).
