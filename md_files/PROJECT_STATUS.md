# Eco-Neuro Sentinel: Project Status Report

**Date:** December 6, 2025  
**Status:** Backend Operational & Verified  

---

## 1. Executive Summary
**Eco-Neuro Sentinel** is a privacy-first health monitoring platform designed to analyze the intersection of environmental factors (air pollution) and neurological health. The system leverages **Neuro-Symbolic AI** to combine strict regulatory frameworks (EU Directives) with generative AI inference, providing patients with actionable, context-aware health advice while maintaining strict data sovereignty.

## 2. System Architecture
The solution is built on a serverless, cloud-native stack ensuring scalability and security.

*   **Core Database:** Supabase (PostgreSQL)
*   **Extensions:** `pgvector` (Semantic Search), `PostGIS` (Geospatial Analysis)
*   **Compute:** Supabase Edge Functions (Deno / TypeScript)
*   **AI/ML:** OpenAI `gpt-4o` (Inference), `text-embedding-3-small` (Vectorization)
*   **ETL Pipeline:** Python (LangChain, BeautifulSoup, Pandas)

---

## 3. Key Features Implemented

### A. Privacy-First Database Design
*   **Row Level Security (RLS):** Implemented strict policies ensuring patients can only access their own data.
*   **Data Isolation:** `patient_logs` (High Sensitivity) are physically separated from `air_quality` (Public Utility) and `knowledge_base` (Public Reference) tables.
*   **PII Redaction:** An automated "Privacy Firewall" in the Edge Function strips names, emails, and phone numbers before data ever reaches the AI model.

### B. Dynamic Knowledge Ingestion (ETL)
*   **Automated Web Scraping:** A Python pipeline (`ingest_knowledge.py`) dynamically searches the web for the latest EU Air Quality Directives and clinical studies.
*   **Vectorization:** Content is chunked, embedded, and stored in the `knowledge_base` table for semantic retrieval.
*   **Status:** Successfully ingested EU 2024/2025 Air Quality Directives.

### C. Geospatial Intelligence
*   **Sector Mapping:** Bucharest sectors are mapped as geospatial polygons using WGS84 coordinates.
*   **Point-in-Polygon Analysis:** A custom RPC function (`get_air_quality_for_point`) determines a user's precise environmental context based on their GPS location without storing their history permanently.
*   **Status:** Verified accurate mapping of coordinates to Sector 1 pollution data.

### D. Neuro-Symbolic Edge Function (`analyze-risk`)
A serverless function that orchestrates the entire analysis workflow:
1.  **Input:** Receives patient symptoms and location.
2.  **Sanitization:** Redacts PII using regex patterns.
3.  **Context Retrieval (RAG):**
    *   Converts symptoms into a semantic query (e.g., *"coughing health risks particulate matter"*).
    *   Retrieves relevant EU regulations via Cosine Similarity Search (`match_documents`).
4.  **Environmental Lookup:** Fetches real-time PM2.5/PM10 data for the user's location.
5.  **Inference:** GPT-4o synthesizes the medical symptoms, environmental data, and legal regulations into a risk assessment.

---

## 4. Technical Deep Dive

### The "Neuro-Symbolic" Approach
Unlike standard chatbots that hallucinate, our system grounds its advice in retrieved facts.
*   **Symbolic Component:** Hard facts from the `knowledge_base` (e.g., "PM2.5 limit is 10 µg/m³").
*   **Neural Component:** GPT-4o reasoning (e.g., "High PM2.5 + Coughing = High Risk").

### Code Highlights
*   **`database/init_db.sql`**: Complete schema definition with GiST and HNSW indexes.
*   **`supabase/functions/analyze-risk/index.ts`**: The brain of the operation, handling the multi-step inference logic.
*   **`ingest_knowledge.py`**: The autonomous agent that keeps the knowledge base current.

---

## 5. Verification & Testing
We have successfully verified the system end-to-end.

*   **Test Scenario:** A user in **Bucharest Sector 1** reports "coughing and dizziness".
*   **Environmental Context:** System detected High PM2.5 levels in Sector 1.
*   **Regulatory Context:** System retrieved EU limits for Particulate Matter.
*   **Result:**
    ```json
    {
      "risk_level": "High",
      "advisory": "Minimize outdoor activities... consider wearing a mask...",
      "relevant_regulation": "Fine Particulate Matter (PM2.5)... limit 10 µg/m³..."
    }
    ```

## 6. Next Steps
*   **Frontend Development:** Build a React/Next.js dashboard for patients.
*   **Clinical Integration:** Ingest specific patient history (if consent granted).
*   **Alerting:** Implement real-time push notifications when air quality exceeds thresholds.
