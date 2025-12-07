# EnviroSense - Development Task List

**Target:** Teo (Developer)
**Context:** We have established the core data models (Identity, Biometrics, Respiratory, Neuro) and the Onboarding Wizard. We now need to build the application pages that utilize this data.

---

## 1. Core "Digital Twin" Dashboard (Priority: High)
**Goal:** Create a home base for the user (`/dashboard`) that visualizes their profile data against real-time environmental factors.

- [ ] **Create `/dashboard` Route:**
    - Redirect users here after login (update `AuthWizard.tsx` redirect).
    - Implement a protected route layout.
- [ ] **Neuro-Resilience Card:**
    - Visualize the `focus_index` (Brain Fog) from the DB.
    - Show a "Focus Forecast" based on local Air Quality (mock logic for now).
- [ ] **Respiratory Status Card:**
    - Display `inhaler_usage_frequency` and `respiratory_conditions`.
    - Show a "Risk Level" (Low/Med/High) based on `pollution_sensitivity`.
- [ ] **Environmental Context:**
    - Fetch real-time AQI/Weather for the user's location.
    - Display "Trigger Warnings" if current conditions match user's `stress_triggers` (e.g., "Heatwave Alert" if user selected Heatwaves).

## 2. Profile Management (Priority: Medium)
**Goal:** Allow users to update their "Digital Twin" as their health changes.

- [ ] **Create `/profile` Route:**
    - Form to edit `full_name`, `sector`, `activity_level`.
- [ ] **Neuro-Profile Editor:**
    - Allow re-taking the "Neuro-Sensitivity" calibration (update `focus_index`, `sleep_type`, `stress_triggers`).
- [ ] **Medical Profile Editor:**
    - Update `respiratory_conditions` and `inhaler_usage`.

## 3. Symptom Tracker & Triage (Priority: Medium)
**Goal:** Feed the model with daily longitudinal data.

- [ ] **Create `/tracker` Route:**
    - Simple daily check-in interface.
    - **Inputs:**
        - "How is your focus today?" (Slider 0-10).
        - "Did you sleep well?" (Yes/No/Fragmented).
        - "Breathing difficulty?" (None/Mild/Severe).
- [ ] **Connect to DB:**
    - Create a new table `daily_logs` linked to `profiles`.

## 4. Chat Interface Refactor (Priority: Low/Cosmetic)
**Goal:** Bring the legacy Chat UI into the new "Eco-Neuro" design system.

- [ ] **Update `/chat` Styling:**
    - Replace Gray/Blue palette with Cream (`#FAF3DD`) and Brown (`#562C2C`).
    - Style message bubbles:
        - User: Green (`#00A36C`) + White Text.
        - AI: White/Glass + Brown Text.
    - Add the "Fireflies" particle background.

## 5. Data Visualization (Future)
- [ ] **Trends Graph:** Plot "Brain Fog" vs. "PM2.5 Levels" over time.
