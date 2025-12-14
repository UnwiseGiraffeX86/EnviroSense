# AI_ARCHITECT_MANUAL.md

## Section 1: The "North Star" (Identity & Constraints)

### Project Name
**EnviroSense** (Eco-Neuro Sentinel).

### Core Philosophy
*   **"Privacy by Design" (Zero-Trust):** We assume the network is hostile. Data is secured at the row level (RLS). PII is redacted before leaving the "Airlock" (Edge Functions).
*   **"Human-Centric AI":** AI is a tool for augmentation, not replacement. It provides context (Neuro-Symbolic Reasoning), not final medical diagnoses.
*   **"Neuro-Symbolic Reasoning":** We combine neural networks (GPT-4o for unstructured text) with symbolic logic (SQL constraints, deterministic rules) to prevent hallucinations.

### Visual Identity System (Strict)
*   **Backgrounds:** Cream/Beige (`bg-[#FDFBF7]` / `bg-brand-cream`).
*   **Text:** Charcoal/Dark Earth (`text-[#3D3430]` / `text-brand-brown`).
*   **Primary Action:** Emerald Green (`text-[#00A36C]` / `bg-brand-green`).
*   **Secondary/Charts:** Muted Coral (`#E07A5F`), Soft Sage.
*   **Typography:** Sans-serif, clean, academic but modern.

### The "Do Not Hallucinate" List (Strict Boundaries)
*   **NO:** Apple Health/Fitbit syncing (Not implemented yet).
*   **NO:** Native iOS/Android apps (We are a PWA/Web Platform).
*   **NO:** Storing raw PII in the AI context (We use an "Airlock" pattern in Edge Functions).

---

## Section 2: The Tech Stack (The "Hard" Environment)

### Frontend
*   **Framework:** Next.js 16 (App Router).
*   **Language:** TypeScript (Strict Mode).
*   **Styling:** Tailwind CSS (v4 inline theme), Framer Motion (Animations), Lucide React (Icons).
*   **Visualization:** Recharts (Data Viz).

### Backend & BaaS
*   **Platform:** Supabase.
*   **Auth:** Google OAuth & Email Magic Links (SSR implemented).
*   **Database:** PostgreSQL 15 + `pgvector` (Embeddings) + `PostGIS` (Geolocation).
*   **Realtime:** WebSocket subscriptions for "Doctor-Patient Chat" and "Risk Alerts".
*   **Edge Functions:** Deno-based secure proxies for AI inference (`supabase/functions/analyze-risk`).

### AI Pipeline
*   **Reasoning:** OpenAI `gpt-4o`.
*   **Embeddings:** `text-embedding-3-small`.
*   **Orchestration:** LangChain (conceptually) / Direct OpenAI SDK.
*   **Optimization:** "Hybrid-AI" pattern.
    *   *Layer 1 (Local):* Python/Scikit-Learn script (`backend/scripts/analyze_symptoms.py`) filters low-risk cases.
    *   *Layer 2 (Cloud):* Edge Function calls GPT-4o for complex cases requiring RAG.

---

## Section 3: The System Architecture (Deep Dive)

### The "Digital Twin" Data Model
*   **Profile (`profiles` table):**
    *   `sector`: The user's primary location in Bucharest (e.g., "Sector 1").
    *   `respiratory_sensitivity`: (Future) Score 1-10 based on history.
*   **Evolution:** The profile is static, but the *state* evolves via `patient_logs`. Each log adds a data point (symptom + location + time), allowing the system to calculate a moving average of risk.

### The RAG Knowledge Base
*   **Source Material:** EU Air Quality Directive 2024/2881, WHO Guidelines.
*   **Chunking Strategy:** ~1000-char overlapping windows.
*   **Retrieval:** Cosine similarity search via `pgvector` (`match_documents` RPC function).

### The 3 Core Logic Flows (Step-by-Step)

#### Flow A (The Intake)
1.  **User Chat:** User submits symptom description via Frontend.
2.  **Local Filter:** `api/analyze` calls local Python script.
    *   *If Low Risk:* Returns immediate heuristic advice.
    *   *If High Risk/Complex:* Forwards to Edge Function.
3.  **Edge Function (`analyze-risk`):**
    *   Redacts PII.
    *   Retrieves RAG context (EU Directives).
    *   Fetches Realtime Air Quality for user's sector.
    *   **GPT-4o Inference:** Correlates Symptoms + Air Quality + Legal Limits.
    *   Returns **Risk Score (1-10)**.

#### Flow B (The Handoff)
1.  **Trigger:** If Risk Score > 7.
2.  **Action:** System creates a `consultations` record with `status = 'pending'`.
3.  **Alert:** Supabase Realtime broadcasts event to `doctors` channel.

#### Flow C (The Resolution)
1.  **Claim:** Doctor clicks "Accept Case".
2.  **Assignment:** `consultations.doctor_id` is updated.
3.  **Channel:** Private RLS-secured Chat Channel opens between `user_id` and `doctor_id`.

---

## Section 4: Database Schema & Security Strategy

### Key Tables
*   `profiles`: User identity & sector.
*   `patient_logs`: Symptom history with PostGIS `GEOGRAPHY(Point)`.
*   `air_quality`: Sector data with `GEOGRAPHY(Polygon)`.
*   `consultations`: Links users to doctors.
*   `messages`: Chat history.
*   `knowledge_base`: Vector store.

### Row Level Security (RLS)
*   **"Zero Trust" Policy:**
    *   `profiles`: Users can only `SELECT` their own row (`auth.uid() = id`).
    *   `patient_logs`: Strictly private. Only the owner can `INSERT`/`SELECT`.
*   **"Doctor View" Policy:**
    *   Doctors have a special role/claim.
    *   They can `SELECT` from `consultations` where `status = 'pending'` (Triage pool) OR `doctor_id = auth.uid()` (My patients).

---

## Section 5: Code Style & Development Standards

### Directory Structure
*   `/app`: Routes & Pages (Next.js App Router).
*   `/components`: Reusable UI (Atomic Design).
    *   `/components/landing`: Marketing pages.
    *   `/components/dashboard`: App internals.
*   `/lib/supabase`: Typed Clients (Server vs Client).
*   `/types`: Global TypeScript Interfaces (**No `any` allowed**).

### Component Rules
*   **"Client Components":** Push `use client` down to the leaves. Keep pages as Server Components where possible.
*   **Accessibility (ARIA):** Mandatory for all interactive elements.
*   **Styling:** No magic numbers (e.g., `w-[345px]`). Use Tailwind config tokens (`w-md`, `p-4`).

---

## Section 6: Implementation Roadmap (The "Truth")

### Current Status
*   **"Demo Ready":**
    *   Auth works (SSR).
    *   Map works (Live Sector Data).
    *   Chat works (Basic Analysis).
    *   Landing Page is compliant with EU 2024/2881.

### Next Steps (For the AI Agent)
1.  **Refining the "Doctor Dashboard" UI:** It needs to consume the Realtime alerts from Flow B.
2.  **Implementing the "Sector Notification" push system:** Alert users when their sector's PM2.5 exceeds the new EU limit (10 µg/m³).
