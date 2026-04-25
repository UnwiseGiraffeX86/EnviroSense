# 🎨 Eco-Neuro Sentinel: Master UI/UX Design Brief

**Version:** 1.0 (Human-to-AI Pivot)
**Target:** Professional UI/UX Design Agency
**Project Goal:** Unified design language across Web (Desktop), Mobile App (iOS/Android), and Smartwatch (WearOS).

---

## 1. The Core Shift: Pure "Human-to-AI"
**Crucial Context for the Designer:**
EnviroSense has completely dropped all "Triage" and "Doctor-Patient" workflows. We are no longer waiting for medical professionals. We are building a purely **Neuro-Symbolic Health Guardian** — an AI Sentinel powered by OpenAI (gpt-4o) and OpenAQ that lives with the user and acts instantly.

**Design Implication:** 
The interface must feel like an omniscient, deeply personalized companion rather than a clinical waiting room. The tone is **predictive, protective, and empowering**, shifting user emotion from anxiety to control.

---

## 2. The Universal Theme: "Eco-Neuro"
The brand balances organic biological elements with hyper-modern data architecture.
*   **Aesthetic:** Clean, minimalist, data-dense but approachable. High use of negative space. Avoid sterile hospital vibes; lean into natural environment fusion.
*   **Typography:** Modern Sans-Serif (e.g., Inter, Roboto). We need extreme legibility for data-heavy readouts.

### Master Color Palette
| Token | Hex | Role | Platform Notes |
| :--- | :--- | :--- | :--- |
| **Canvas Dark** | `#2C241B` | High-contrast backdrops | **Default background for Watch** |
| **Cream Canvas** | `#FAF3DD` | Main background | **Default background for Web/Mobile** |
| **Tech Accent** | `#00A36C` | "All clear", Sentinel status, Primary CTA | Used for "Teal Pulse" Living Node |
| **Human Accent** | `#E07A5F` | Alerts, anomaly spikes, Action required | Used for "Coral Spark" warnings |
| **Deep Brown** | `#562C2C` | Primary text on Cream, Borders | High contrast legibility |

---

## 3. Platform Hierarchy: Skin ➔ Nervous System ➔ Brain

The UI must adapt strictly to the functional constraints and use-cases of each hardware surface. Do not duplicate features across all screens; treat them as part of one continuous body.

### A. The Skin: Pixel Watch (WearOS)
*   **Role:** Ambient, passive data collector. The ultimate "glanceable guardian."
*   **Theme:** STRICTLY Dark Mode (AMOLED battery saving).
*   **Iconography:** Line-only (2px stroke, rounded, no fills).
*   **UI Constraints:**
    *   No charts, no graphs, no chat keyboards.
    *   **Focus:** A single Compound Risk tile (1-10) with three glanceable stats (HR, PM2.5, Skin Δ).
    *   **Alert Sheets:** Minimalist full-screen popups (e.g., "Air Quality Dropping").
    *   **Neuro-Test Component:** A pulsing, meditative 10-second teal ring animation.

### B. The Nervous System: EnviroSense Go (Mobile App)
*   **Role:** Active engagement on the go. GPS routing, behavior modification, real-time sensing.
*   **Theme:** Cream Canvas with high-contrast data cards.
*   **Key "Hero" Screens for Design:**
    *   **AR Smog Lens:** Camera overlay screen tinting local space (Green/Yellow/Red) based on API data. Requires immersive glassmorphism UI.
    *   **Auto-Sector Drift Dashboard:** Daily timeline mapping the user's commute vs. pollution exposure.
    *   **Cough Sentry:** Minimalist background listening status with daily counts.
    *   **AI Chat (On-the-go):** Simplified conversational UI for quick voice-to-text subjective symptom logging.

### C. The Brain: Web Application (Desktop / Large Landscape)
*   **Role:** Deep analysis, historical correlation, and intense RAG interactions. 
*   **Theme:** Cream Canvas, expanding into multi-pane dashboard layouts for complex data.
*   **Key "Hero" Screens for Design:**
    *   **Digital Twin Dashboard:** Visualizing long-term respiratory sensitivity and focus indexes side-by-side with historical weather telemetry (using Recharts).
    *   **The Sentinel Chat Interface:** A deeply integrated "Agentic" chat panel that sits alongside charts, allowing users to converse with the AI about their exact data.
    *   **Landing Page (Acquisition):** Already somewhat established, but needs unification with the above palette, utilizing the "Living Node" mascot (NeuroTree).

---

## 4. UI/UX "Must-Haves"

1.  **The "Living Node" Mascot:** We need an abstract representation of the Digital Twin (e.g., the NeuroTree). It should subtly animate—breathing/pulsing when the user is healthy, and changing color/frequency when stress or pollution is detected.
2.  **Privacy Visualization (Zero-Trust):** On mobile and web, the UI must constantly reassure the user that data (like Cough Audio) is processed locally at the edge. A visual "Airlock" indicator should exist on sensitive data transfers.
3.  **Data Provenance:** In the AI chat, the Sentinel must be able to surface "Citation Bubbles" (showing exactly which EU Directive or OpenAQ API point informed its risk score).

---
**Summary for Designer:**
Think of designing an advanced telemetry dashboard for a Formula 1 race car, except the "car" is the human respiratory system, and the "driver" is an autonomous AI that lives to keep you out of the emergency room.
