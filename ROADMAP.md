# 🗺️ EnviroSense Strategic Roadmap (12 Months)

**Current Status:** MVP Complete (Web Dashboard, Basic RAG Agent, Supabase Backend).
**Goal:** Evolve from a reactive web dashboard to a predictive, always-on "Digital Twin" ecosystem.

---

## 🏗️ Phase 1: Stabilization & Polish (Q1)
**Focus:** Hardening the MVP, reducing technical debt, and ensuring data integrity before scaling.
**Milestone:** 🚀 **Stable Beta Launch**

### Core Infrastructure
- [ ] **Security Audit:** Fix remaining RLS policies and API endpoint vulnerabilities.
- [ ] **Performance:** Optimize `match_documents` RPC for sub-200ms RAG responses.
- [ ] **Database:** Implement database triggers for automatic `updated_at` timestamps and role validation.
- [ ] **Testing:** Achieve 80% unit test coverage for critical paths (Auth, Data Ingestion).

### User Experience (Web)
- [ ] **Bug Fix:** Resolve "Fake ID" triage issue in Doctor Portal.
- [ ] **UI Polish:** Standardize Tailwind components and improve mobile responsiveness for the web view.
- [ ] **Onboarding:** Streamline the "Wizard" flow to reduce drop-off rates.
- [ ] **Feedback Loop:** Implement in-app feedback widget for Beta testers.

---

## 📱 Phase 2: The Mobile Leap (Q2)
**Focus:** Transitioning from "Check the site" to "Always in your pocket."
**Milestone:** 📲 **App Store Release (iOS/Android)**

### Mobile Development (React Native / Expo)
- [ ] **Repo Setup:** Initialize Monorepo (TurboRepo) to share logic between Web and Mobile.
- [ ] **Porting:** Migrate `BioWeatherCard`, `NeuroRadar`, and `ChatWidget` to React Native.
- [ ] **Navigation:** Implement native tab navigation (Dashboard, Map, Tracker, Profile).

### Native Capabilities
- [ ] **Geofencing:** Implement background location tracking for "Auto-Sector Drift."
- [ ] **Notifications:** Push alerts for "High Risk" air quality changes in the user's current sector.
- [ ] **Offline Mode:** Cache daily logs and air quality data for offline access.

---

## ⌚ Phase 3: The Connected Twin (Q3)
**Focus:** Closing the loop between Environmental Data and Biological Response.
**Milestone:** 🔗 **Bio-Metric Sync**

### Wearable Integration
- [ ] **HealthKit (iOS):** Sync Sleep Analysis, Resting Heart Rate, and HRV.
- [ ] **Health Connect (Android):** Sync basic vitals from Google Fit/Samsung Health.
- [ ] **Data Pipeline:** Create Edge Functions to aggregate high-frequency wearable data into daily summaries.

### Advanced Analytics
- [ ] **Correlation Engine:** Build logic to detect: *"When PM2.5 > X, HRV drops by Y%."*
- [ ] **Smart Journaling:** Auto-populate "Sleep Quality" in Daily Logs based on wearable data.
- [ ] **Neuro-Steady Test:** Implement accelerometer-based tremor detection feature.

---

## 🔮 Phase 4: Scale & Prediction (Q4)
**Focus:** Moving from Real-time Monitoring to Future Forecasting.
**Milestone:** 💼 **B2B Insurance API**

### Predictive AI
- [ ] **Forecasting Model:** Train a model to predict personal health risks 24 hours in advance.
- [ ] **Actionable Insights:** Generate proactive advice (e.g., "Pollution spike expected tomorrow at 8 AM. Reschedule run.").
- [ ] **Anomaly Detection:** Alert doctors to sudden deviations in a patient's baseline biometrics.

### B2B & Enterprise
- [ ] **Anonymization Layer:** Create a privacy-preserving API for aggregate population health data.
- [ ] **Insurance Portal:** Dashboard for insurers to view risk heatmaps (no PII).
- [ ] **API Gateway:** Monetizable API endpoints for third-party health apps.

---

## 🛠️ Tech Stack Evolution

| Component | Current State | Future State (12 Months) |
| :--- | :--- | :--- |
| **Frontend** | Next.js (Web) | Next.js (Web) + React Native (Mobile) |
| **Backend** | Supabase (PostgreSQL) | Supabase + Dedicated Vector DB (Pinecone/Weaviate) |
| **AI/LLM** | OpenAI GPT-4o | Fine-tuned Llama 3 (Self-hosted) for Privacy |
| **Orchestration** | Edge Functions | Temporal.io for complex workflows |
| **CI/CD** | GitHub Actions (Basic) | Full E2E Testing Pipeline (Detox/Cypress) |
