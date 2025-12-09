# 📱 Product Roadmap: EnviroSense Go (Mobile App)

**Vision:** Moving from "Check the Dashboard" to "Always-On Protection."
The web app is for **Analysis** (Doctor/Patient deep dives). The mobile app is for **Acquisition** (Passive, continuous data collection). We want the Digital Twin to know the user is sick *before* they even open the app.

---

## 🚀 Feature Roadmap: Impact vs. Effort

### 1. Auto-Sector Drift (High Impact / Low Effort)
*   **The Concept:** "Your Digital Twin travels with you." Instead of manually setting "Sector 1," the app passively tracks your location to calculate your *exact* cumulative pollution exposure for the day.
*   **Digital Twin Evolution:** Moves from "Static Exposure" (Home address) to "Dynamic Exposure" (Commute + Work + Gym). The Twin can now say: *"Your asthma triggered because you spent 40 minutes in traffic in Sector 3."*
*   **Technical Implementation:**
    *   **API:** Native Background Geolocation (iOS/Android).
    *   **Logic:** Geofencing triggers that update the `current_sector` state in the DB without waking the UI.

### 2. Bio-Sync Bridge (High Impact / Medium Effort)
*   **The Concept:** "Your watch talks to the smog." Automatically pull Sleep Quality, Heart Rate Variability (HRV), and Resting Heart Rate from the user's wearable.
*   **Digital Twin Evolution:** Provides the "Ground Truth" for biological stress. We can mathematically prove the link: *"On days where PM2.5 > 30, your Deep Sleep drops by 15%."*
*   **Technical Implementation:**
    *   **API:** Apple HealthKit (iOS) / Google Health Connect (Android).
    *   **Logic:** Daily background sync job that pushes aggregated vitals to the `daily_logs` table.

### 3. AR Smog Lens (High Impact / High Effort)
*   **The Concept:** "Make the invisible, visible." Point your camera at the street, and an AR overlay tints the air (Green/Yellow/Red) based on real-time local sensor data.
*   **Digital Twin Evolution:** This is a **Behavioral Modification** tool. The Twin uses visual fear/confirmation to enforce compliance. Users are 80% more likely to wear a mask if they "see" the pollution.
*   **Technical Implementation:**
    *   **API:** ARKit (iOS) / ARCore (Android).
    *   **Logic:** Combine Compass/GPS data with the `air_quality` database to render a colored "fog" particle system in 3D space.

### 4. Cough Sentry (Medium Impact / High Effort)
*   **The Concept:** "Shazam for your lungs." A privacy-first background listener that detects and counts coughs throughout the day without recording conversations.
*   **Digital Twin Evolution:** Replaces subjective memory ("I think I coughed a bit") with objective data ("You coughed 42 times between 2 PM and 4 PM").
*   **Technical Implementation:**
    *   **API:** On-Device Microphone + CoreML / TensorFlow Lite.
    *   **Logic:** A lightweight edge model runs locally to classify audio events. Only the *count* and *timestamp* are sent to the server (Privacy Preserving).

### 5. Neuro-Steady Test (Medium Impact / Low Effort)
*   **The Concept:** "A neurological exam in your pocket." A 10-second test where the user holds the phone flat in their hand. The accelerometer measures micro-tremors.
*   **Digital Twin Evolution:** Detects subtle neurological decline (Neuro-toxicity) caused by long-term pollution exposure before the user notices cognitive fog.
*   **Technical Implementation:**
    *   **API:** CoreMotion (Accelerometer/Gyroscope).
    *   **Logic:** Calculate the variance in X/Y/Z axis stability and map it to the user's `focus_index`.

---

## 🏆 The "Killer Feature" Priority List

1.  **Auto-Sector Drift:** Essential. Without this, the data is inaccurate. Build first.
2.  **Bio-Sync Bridge:** High value. Users hate manual data entry. This automates the "Daily Log."
3.  **Neuro-Steady Test:** Unique differentiator. Easy to build, reinforces the "Neuro" aspect of the brand.
4.  **AR Smog Lens:** The "Viral" marketing feature. Build this for the launch trailer.
5.  **Cough Sentry:** R&D Heavy. Save for Version 2.0.
