# Technical Dossier: EnviroSense Platform

**Date:** December 7, 2025  
**Role:** Lead Systems Architect  
**Subject:** Final Technical Handover  

---

## 1. Technology Stack & Tooling

The platform utilizes a decoupled architecture separating the client-side presentation layer from the serverless backend and inference engine.

### Frontend
*   **Next.js 14 (App Router):** Serves as the application framework, utilizing React Server Components (RSC) to minimize client-side bundle size.
*   **Tailwind CSS:** Implements a utility-first styling methodology for consistent design tokens across the dashboard.
*   **Lucide React:** Provides lightweight, tree-shakeable SVG iconography.
*   **Recharts:** Renders time-series visualizations for environmental telemetry and symptom severity tracking.
*   **Framer Motion:** Manages UI state transitions and micro-interactions, specifically for the chat interface and modal states.

### Backend & Infrastructure
*   **Supabase (BaaS):** Acts as the primary backend infrastructure.
    *   **Auth:** Manages identity via JWTs, integrated directly with PostgreSQL Row Level Security (RLS) policies to enforce data isolation at the database layer.
    *   **Database:** PostgreSQL 15 extended with:
        *   `pgvector`: Stores 1536-dimensional vector embeddings for the RAG knowledge base.
        *   `PostGIS`: Handles geospatial indexing for mapping user locations to environmental sectors (Point-in-Polygon operations).
    *   **Realtime:** Utilizes PostgreSQL Replication (WAL) to broadcast database `INSERT` and `UPDATE` events to connected clients via WebSockets.
    *   **Edge Functions:** Deno-based serverless functions serve as the secure proxy for AI inference, preventing API key exposure on the client.

### AI & ML Pipeline
*   **OpenAI gpt-4o:** The primary reasoning engine for symptom analysis and triage logic.
*   **text-embedding-3-small:** Generates vector embeddings for the regulatory knowledge base.
*   **LangChain:** Orchestrates the retrieval and context injection workflow.
*   **Python / Scikit-Learn:** Utilized in the offline environment to generate synthetic datasets and validate correlation algorithms.

---

## 2. Project Description

**EnviroSense** is a Neuro-Symbolic Health Monitor designed to investigate and operationalize the correlation between environmental stressors and neuropsychiatric health. The system functions by ingesting two distinct data streams: subjective biological symptoms reported by users (via voice or text) and objective, hyper-local environmental telemetry (PM2.5, NO2, AQI).

The core architectural component is the "Digital Twin"—a dynamic JSON profile stored within the database that tracks a user's `respiratory_sensitivity` and `focus_index`. This profile evolves over time based on the frequency and severity of reported symptoms relative to atmospheric conditions. Unlike standard telemedicine platforms, EnviroSense enforces a "Privacy by Design" architecture where raw PII is stripped before inference, and data access is strictly controlled via database-level policies.

---

## 3. Business Logic & Flow Process

The system operates on an event-driven architecture defined by the following data lifecycles:

### Flow A: The Intake (Patient → AI)
1.  **Input:** Patient submits a symptom description via the `AIChatWidget`.
2.  **Context Retrieval:**
    *   System queries `air_quality` table for the patient's registered `sector`.
    *   System retrieves the patient's recent medical history from `patient_logs`.
3.  **RAG Execution:** The agent queries the `knowledge_base` for relevant EU Air Quality Directives using vector similarity search.
4.  **Inference:** The LLM analyzes the symptom against the environmental context and safety thresholds.
5.  **Output:** A `Risk Score` (integer 1-10) is generated.

### Flow B: The Handoff (AI → Doctor)
1.  **Condition:** If `Risk Score > 7`:
2.  **Action:** The AI generates a structured clinical summary.
3.  **Persistence:** A new record is inserted into the `consultations` table with `status: 'pending'`.
4.  **Notification:** The database emits a realtime event.
5.  **Reception:** Subscribed clients (Doctors) receive the alert instantly via the `consultations_room` channel.

### Flow C: The Resolution (Doctor → Patient)
1.  **Assignment:** A Doctor executes an `UPDATE` on the specific consultation record, setting `status: 'active'` and `doctor_id: {current_user}`.
2.  **Channel Initialization:** The frontend detects the status change and initializes a private `chat_messages` subscription.
3.  **Communication:** Bi-directional messages are exchanged via WebSocket, secured by RLS policies that restrict access to the two participant IDs.

---

## 4. AI Implementation & Agentic Capabilities

The system employs specific AI techniques to satisfy the "AI Challenge" requirements for autonomy and accuracy.

*   **RAG (Retrieval Augmented Generation):**
    *   **Ingestion:** The EU Air Quality Directive (PDF) was scraped and processed.
    *   **Chunking:** Text was segmented into 1000-character overlapping windows to preserve semantic context.
    *   **Storage:** Chunks were embedded using `text-embedding-3-small` and stored in the `knowledge_base` table with HNSW indices.
    *   **Retrieval:** At runtime, user queries are embedded and matched against stored vectors using cosine similarity to ground AI responses in regulatory fact.

*   **Agentic Data Retrieval:**
    *   The system utilizes an agentic pattern to autonomously query the database. Rather than relying on hard-coded filters, the agent extracts semantic keywords from the patient's complaint (e.g., "respiratory," "neurological") to identify the appropriate specialist category before initiating the handoff protocol.

*   **Synthetic Validation:**
    *   A Python script (`backend/tests/validator.py`) was developed to generate 10,000 rows of mock patient data.
    *   This dataset included randomized symptom severities correlated with historical weather patterns.
    *   The model was stress-tested against this data to verify that the risk scoring logic correctly identified high-risk correlations before deployment to production.
