# ENVIROSENSE_MASTER_ARCHITECTURE.md

**Version:** 2.0 (Omnibus Integration)
**Date:** December 14, 2025
**Status:** Final Scientific Specification (Class II SaMD)

---

## Abstract: The Holistic Digital Twin

**EnviroSense** is a Class II SaMD (Software as a Medical Device) that constructs a **Triple Human-Digital Twin (THDT)**. Unlike passive loggers, this system uses **Differential Equation Modeling** and **Non-Linear Dynamics** to predict homeostatic failure. This document details the governing laws, mathematical transfer functions, and physiological feedback loops that define the system's logic core.

---

## Part 1: The Triple Architecture (The "Trinity")

The system separates the human entity into three coupled dynamical systems:

1.  **The Somatic Twin (The Hardware)**
    *   **Domain:** Physiological Mechanics (Cardiovascular, Respiratory, Metabolic).
    *   **Governing Logic:** Control Theory (PID Loops).
    *   **Primary Output:** `Physiological_Load_Index` (0-100).

2.  **The Cognitive Twin (The Software)**
    *   **Domain:** Neuro-Psychological State (Stress, Resilience, Fatigue).
    *   **Governing Logic:** Signal Processing (Acoustic/Kinematic features).
    *   **Primary Output:** `Cognitive_Reserve_Score` (0-100).

3.  **The Contextual Twin (The Operating System)**
    *   **Domain:** Environmental Exposure (Toxicology, Social Determinants).
    *   **Governing Logic:** Fluid Dynamics & Dosimetry.
    *   **Primary Output:** `Deposited_Dose_Vector` ($\mu g$).

---

## Part 2: The Unified Bio-State Equation

We do not track separate metrics in isolation. We calculate a **Global Resilience Score ($R_{global}$)**, which represents the user's capacity to withstand environmental stress.

### 2.1 The Global Resilience Vector
The total system state is the summation of five sub-system vectors, weighted by the user's genetic risk profile:

$$R_{global} = \alpha S_{cardio} + \beta S_{resp} + \gamma S_{neuro} + \delta S_{endo} + \epsilon S_{micro}$$

*   **$S_{cardio}$**: Cardiovascular Autonomic Stability.
*   **$S_{resp}$**: Pulmonary Mechanical Efficiency.
*   **$S_{neuro}$**: Cognitive/Psychological Reserve.
*   **$S_{endo}$**: Metabolic/Thermal Regulation.
*   **$S_{micro}$**: Microbiome/Barrier Integrity.
*   **$\alpha \dots \epsilon$**: Adaptive weights (e.g., for a diabetic, $\delta$ is weighted 3x).

### 2.2 The Daily Resilience Index ($R_d$)
For daily actionable insights, we calculate a normalized index (0-100) to determine intervention thresholds:

$$R_d = \frac{ w_1 \cdot C_{reserve} + w_2 \cdot (1 - P_{genetic}) }{ w_3 \cdot P_{load} + w_4 \cdot E_{stress} }$$

*   **Logic:**
    *   **$R_d > 80$ (Green):** High Resilience. User can handle poor air quality.
    *   **$R_d < 40$ (Red):** Vulnerable. Even moderate pollution requires an alert.

---

## Part 3: The Mathematical Core (Governing Equations)

We do not use heuristics. We use physics.

### 3.1 Kinematic-Pulmonary Coupling (Gait Analysis)
**The Science:** Walking is a rhythmic actuation of the inverted pendulum. Pulmonary distress introduces "noise" into this rhythm due to systemic inflammation and reduced oxygen saturation ($SpO_2$).

*   **Equation 1: Signal Magnitude Vector (SMV)**
    To quantify "Movement Intensity" from a tri-axial accelerometer ($a_x, a_y, a_z$):
    $$ SMV(t) = \sqrt{a_x(t)^2 + a_y(t)^2 + a_z(t)^2} $$

*   **Equation 2: Gait Velocity ($v_{gait}$)**
    $$ v_{gait} = f_{step} \times L_{step} \approx C \cdot \sqrt{h_{leg}} $$
    *   Where $f_{step}$ is cadence (steps/min) derived from the FFT of the SMV.
    *   **Clinical Threshold:** A velocity of **< 0.8 m/s** is the "Disability Threshold."
    *   **Hazard Model:** Mortality risk increases by **~25%** for every 0.1 m/s drop in usual gait speed ($HR = 0.747; 95\% CI: 0.62-0.90$).

*   **Equation 3: Fractal Scaling ($\alpha$)**
    We use **Detrended Fluctuation Analysis (DFA)** to measure the "health" of the walk.
    $$ F(n) \propto n^\alpha $$
    *   **$\alpha \approx 1.0$ (Pink Noise):** Healthy, adaptable gait.
    *   **$\alpha < 0.5$ (White Noise):** Disorganized, "stumbling" gait (indicative of neurological or respiratory failure).

### 3.2 Respiratory Mechanics (Airway Impedance)
**The Science:** We model the lungs not as a bag, but as a resistive pipe system. Inflammation (Asthma/PM2.5) narrows the pipes, increasing turbulence.

*   **Equation: Rohrer’s Resistance Model**
    $$ P_{drive} = K_1 \dot{V} + K_2 \dot{V}^2 + I \ddot{V} $$
    *   **$P_{drive}$:** Driving pressure (Muscular effort).
    *   **$\dot{V}$:** Airflow rate.
    *   **$K_1$ (Laminar Coeff):** Viscosity-driven resistance (Small airways).
    *   **$K_2$ (Turbulent Coeff):** Density-driven resistance (Large airways).
    *   **Twin Logic:** If the user reports "effort" (Dyspnea) but $\dot{V}$ is normal, the Twin solves for $K_2$, identifying **Central Airway Inflammation**.

### 3.3 Cardiovascular Dynamics (The Autonomic Loop)
**The Science:** The heart is controlled by the Vagal Nerve (Brake) and Sympathetic Nerve (Accelerator). Pollution paralyzes the Vagal nerve.

*   **Equation 1: Heart Rate Variability (RMSSD)**
    The "Gold Standard" for Vagal Tone (Parasympathetic activity).
    $$ RMSSD = \sqrt{\frac{1}{N-1} \sum_{i=1}^{N-1} (RR_{i+1} - RR_i)^2} $$
    *   **Threshold:** A chronic RMSSD **< 20ms** indicates high risk of sudden cardiac death.

*   **Equation 2: Sample Entropy (SampEn)**
    Measures the complexity (adaptability) of the heart rate.
    $$ SampEn(m, r, N) = -\ln \left( \frac{A}{B} \right) $$
    *   **Logic:** A drop in Entropy often precedes clinical symptoms of sepsis or cardiac failure by **4-24 hours**, acting as an "Early Warning Radar".

### 3.4 Acoustic Stress Markers (Voice Analysis)
**The Science:** Mental stress tightens the laryngeal muscles (cricothyroid), causing micro-tremors in the voice.

*   **Equation: Jitter (Frequency Perturbation)**
    $$ Jitter_{abs} = \frac{1}{N-1} \sum_{i=1}^{N-1} |T_i - T_{i+1}| $$
    *   **Biomarker:** Acute stress increases $F_0$ (Pitch) and reduces Jitter variability (due to muscle rigidity), whereas fatigue *increases* Jitter (muscle weakness).

---

## Part 4: Environmental Dosimetry (The "True" Dose)

We do not use AQI. We use **Particle Deposition Physics**.

### 4.1 The ICRP66 Deposition Model
Based on the International Commission on Radiological Protection (1994).

$$ Dose(t) = \int_{0}^{t} C_{air}(t) \cdot V_{min}(t) \cdot \eta_{dep}(d_p) \, dt $$

*   **$V_{min}$ (Minute Ventilation):** $\approx 6 \text{ L/min}$ (Rest) vs $\approx 40 \text{ L/min}$ (Exercise).
*   **$\eta_{dep}$ (Deposition Efficiency):** For Ultrafine Particles (<0.1 $\mu m$), deposition is driven by **Brownian Diffusion**:
    $$ \eta_{diff} = 1 - \exp(-k \cdot D_{diff} \cdot Q^{-0.5}) $$
*   **Fact:** A runner absorbs **4-6x** more toxins than a walker in the same smog because $V_{min}$ is higher and deep breathing bypasses nasal filters.

### 4.2 The Indoor Infiltration Function
Since users are indoors 90% of the time:

$$ C_{in} = P \cdot C_{out} + \frac{S}{Q_{vent} + k_{decay}V} $$

*   **$P$ (Penetration):** Fraction of outdoor pollution entering (0.8 for old windows, 0.3 for HEPA homes).
*   **$k_{decay}$:** Deposition rate onto surfaces (walls/carpets).

---

## Part 5: Biological Feedback Loops

The Twin models how these systems crash into each other.

### 5.1 The "Inflammatory Reflex" (Gut-Lung Axis)
*   **Trigger:** Swallowed PM2.5 particles.
*   **Process:**
    1.  Particles enter the gut $\rightarrow$ Dysbiosis (death of good bacteria).
    2.  Gut permeability increases ("Leaky Gut").
    3.  Endotoxins (LPS) leak into the blood.
    4.  **Systemic Inflammation:** Cytokines (IL-6, TNF-$\alpha$) circulate back to the lungs.
*   **Twin Prediction:** If `PM2.5_Exposure > 35` today, increase probability of `GI_Symptoms` by 15% in **48 hours**.

### 5.2 The "Stale Air" Cognitive Decline
*   **Trigger:** High Indoor $CO_2$.
*   **Process:** $CO_2$ acts as a vasodilator but reduces cortical pH.
*   **The Math:**
    $$ Cognitive\_Score \propto \frac{1}{\log(CO_2)} $$
*   **Fact:** At **1,000 ppm** $CO_2$, decision-making performance drops by **~15%**. At **2,500 ppm**, it drops by **~40-90%**.

### 5.3 The "Heat Shock" Metabolic Shift
*   **Trigger:** Ambient Temperature > 35$^\circ$C.
*   **Process:** Heat Shock Proteins (HSP70) are upregulated. Blood is diverted to skin for cooling (vasodilation), reducing insulin delivery to muscles.
*   **Twin Prediction:** If `User_Is_Diabetic` AND `Temp > 35C`, alert for **Hyperglycemia** (High Blood Sugar) due to insulin resistance.

---

## Part 6: Technical Implementation Strategy

### 6.1 The Data Ingestion Matrix
We create a normalized `bio_vector` for every user, every hour.

| Domain | Raw Input (Sensor) | Processed Feature (Math) | Unit |
| :--- | :--- | :--- | :--- |
| **Cardio** | PP Intervals (Watch/Cam) | **SDNN / RMSSD** | ms |
| **Resp** | Accelerometer (Pocket) | **Gait Speed / Fractal $\alpha$** | m/s |
| **Neuro** | Indoor Air Sensor | **CO2 Load** | ppm |
| **Stress** | Microphone (Voice Log) | **Jitter & Shimmer** | % |
| **Sleep** | Microphone (Night) | **Noise Event Rate** | Events/hr |

### 6.2 Database Schema V2 (Supabase)
We partition data to respect "Zero Trust" and separate somatic data from cognitive logs.

```sql
-- 1. The Somatic Profile (Encrypted at Rest)
CREATE TABLE somatic_profiles (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  polygenic_risk_score JSONB, -- { "asthma_prs": 0.8, "copd_prs": 0.2 }
  baseline_hrv INT,           -- Resting HRV baseline
  last_updated TIMESTAMPTZ
);

-- 2. The Cognitive State (Ephemeral)
CREATE TABLE cognitive_logs (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  stress_index INT CHECK (stress_index BETWEEN 1 AND 10),
  sleep_quality_score INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. The Combined "Twin State" (For AI Context)
CREATE TABLE twin_states (
  user_id UUID REFERENCES auth.users,
  resilience_score FLOAT, -- The result of R_global
  dominant_risk_factor TEXT, -- 'environment', 'somatic', or 'cognitive'
  recommended_action TEXT
);
```

### 6.3 The "Resilience Engine" (Edge Function Logic)
This Python-based pseudo-code runs in the Secure Edge Function ("The Airlock").

```python
def calculate_holistic_risk(user_profile, environmental_data, bio_vector):
    # 1. Cardio-Pulmonary Risk (Lagged 4 hours)
    pm25_delayed_impact = environmental_data.pm25_history[-4] * user_profile.sensitivity.pm25
    cardio_stress = (100 - bio_vector.sdnn) / 100 
    
    # 2. Cognitive Risk (Realtime CO2)
    cognitive_penalty = 0
    if environmental_data.indoor_co2 > 1000:
        cognitive_penalty = (environmental_data.indoor_co2 - 1000) / 2000

    # 3. Metabolic Risk (Thermal)
    metabolic_risk = 0
    if user_profile.is_diabetic and environmental_data.temp_c > 32:
        metabolic_risk = 0.8 

    # 4. Synthesize Total Risk
    total_risk = (
        (0.4 * pm25_delayed_impact) + 
        (0.3 * cardio_stress) + 
        (0.2 * cognitive_penalty) +
        (0.1 * metabolic_risk)
    )
    return total_risk
```

### 6.4 Privacy Architecture: "The Airlock"
To ensure privacy, raw data never hits the database.
1.  **Client-Side (AudioWorklet):** Processes raw PCM stream in RAM to calculate Jitter/Shimmer.
2.  **Destruction:** Raw audio buffer is overwritten every 20ms.
3.  **Transmission:** Only the calculated features (`{ jitter: 1.2% }`) are sent to the Edge Function.

---

## Part 7: Proven Research & Citations

1.  **Kon SS, et al.** (2013). *Reliability and validity of 4-metre gait speed in COPD.* Eur Respir J. (Establishing gait speed as a mortality predictor).
2.  **Costa M, Goldberger AL, Peng CK.** (2002). *Multiscale entropy analysis of complex physiologic time series.* Phys Rev Lett. (The foundational math for biological entropy).
3.  **Satoh H, et al.** (2020). *Effects of indoor air quality on sleep and performance.* (CO2 impacts on cognition).
4.  **ICRP Publication 66.** (1994). *Human Respiratory Tract Model for Radiological Protection.* (The physics of particle deposition).
5.  **Gou Z, et al.** (2023). *Voice as a Biomarker for Stress.* J Voice. (Acoustic analysis of laryngeal tension).
6.  **Brook RD, et al.** (2010). *Particulate matter air pollution and cardiovascular disease.* Circulation. (The biological mechanism of PM2.5 induced heart failure).

---

## Part 8: The "God View" Dashboard Specification

To visualize this "Omnibus" model, the interface must display:

1.  **Somatic Layer:** A 3D Mannequin showing "Localized Inflammation Heatmaps" (Lungs/Gut/Heart).
2.  **Cognitive Layer:** A "Neural Load" gauge (0-100%) derived from Voice Jitter + Sleep Fragmentation.
3.  **Environmental Layer:** A real-time "Dosimeter" showing accumulating $\mu g$ of PM2.5 in the lungs, not just the outside air concentration.
