# EnviroSense - Project Status & Roadmap

**Date:** December 7, 2025
**Version:** 0.2.0 (Alpha)

## 1. Project Overview
**EnviroSense** is a precision neuro-optimization and environmental health platform. It creates a "Digital Twin" of the user's respiratory and biological profile to provide personalized health insights based on real-time environmental data (Air Quality, Weather).

### Core Tech Stack
- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Design System:** "Eco-Neuro" (Organic Futurism)

---

## 2. Current Status

### ✅ Completed Features
*   **Branding & Identity:**
    *   Renamed to **EnviroSense**.
    *   Implemented "Eco-Neuro" Design System.
    *   **Palette:** Cream (`#FAF3DD`), Deep Brown (`#562C2C`), Medical Green (`#00A36C`), Warm Orange (`#E07A5F`).
    *   **Visuals:** "Fireflies" particle background, Glassmorphism cards.

*   **Authentication & Onboarding:**
    *   **Auth Wizard:** 5-step onboarding flow (Identity -> Biometrics -> Respiratory -> Neuro -> Calibration).
    *   **Neuro-Sensitivity Step:** Added tracking for Brain Fog, Sleep Type, and Eco-Anxiety triggers.
    *   **Security:** Row Level Security (RLS) policies implemented and verified.
    *   **Database:** `profiles` table structure finalized and secured.
    *   **Edge Case Handling:** Session detection for email confirmation flows.

*   **Infrastructure:**
    *   Supabase Client configuration.
    *   Database reset and migration scripts (`fix_profile_rls.sql`, `reset_db.sql`).
    *   **Schema Update:** Added `neuro_profile` JSONB column for flexible cognitive data storage.

### ⚠️ In Progress / Needs Refactoring
*   **Chat Interface (`/chat`):**
    *   Currently functional but uses legacy styling (Gray/Blue palette).
    *   Needs to be updated to the Cream/Brown design system.
*   **Symptom Triage:**
    *   Logic exists but UI needs visual overhaul.

---

## 3. Web Interface Roadmap (Planned Features)

### Phase 1: Visual Consistency (Immediate Priority)
- [ ] **Refactor Chat Interface:**
    -   Apply `#FAF3DD` background and `#562C2C` typography.
    -   Update message bubbles to use `#00A36C` (User) and White/Glass (AI/System).
    -   Add "Fireflies" background to the chat view.
- [ ] **Refactor Symptom Triage:**
    -   Style the "Care Card" with the new design system.
    -   Replace standard icons with Lucide-React icons matching the Auth flow.

### Phase 2: Core Functionality
- [ ] **Real-Time Air Quality Dashboard:**
    -   Visual widget showing live PM2.5/AQI data for the user's sector.
    -   "Safe/Unsafe" indicators using the Green/Orange/Red status colors.
- [ ] **Doctor Dashboard:**
    -   Dedicated view for medical professionals to accept cases.
    -   Patient profile summary card (Digital Twin view).
- [ ] **Profile Management:**
    -   Settings page to update Biometrics and Respiratory conditions after onboarding.

### Phase 3: Advanced Features ("Digital Twin")
- [ ] **Neuro-Optimization Graphs:**
    -   Visualization of "Pollution Sensitivity" vs. "Activity Level".
    -   Predictive alerts for asthma/respiratory conditions.
- [ ] **Voice/Audio Integration:**
    -   Audio input for symptom description.
    -   Calming ambient soundscapes (optional feature).

---

## 4. Design System Reference

| Element | Color | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | Cream | `#FAF3DD` | Main page background |
| **Text/Borders** | Deep Brown | `#562C2C` | Headings, Body text, Inputs |
| **Primary Action** | Medical Green | `#00A36C` | Buttons, Active States, Success |
| **Accents** | Warm Orange | `#E07A5F` | Warnings, Highlights, Gradients |
| **Overlay** | Glass White | `rgba(255,255,255, 0.6)` | Cards, Modals |

