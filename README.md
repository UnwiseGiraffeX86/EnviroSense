#BESTEM
Here is a comprehensive `README.md` file tailored for a GitHub repository, based strictly on the provided technical specification and implementation report.

-----

# Eco-Neuro Sentinel: Bucharest

**A Privacy-First Platform correlating Ambient Air Quality with Neuropsychiatric Health.**

## 📖 Project Overview

The **Eco-Neuro Sentinel** is a digital platform designed to interrogate the causal links between environmental stressors—specifically particulate matter and atmospheric toxins—and the prevalence of mental health disorders.Operating within the specific urban context of Bucharest, Romania, the system serves as a precision diagnostic tool that correlates high-resolution environmental data with subjective neuropsychiatric reporting.

The project is grounded in the "neuro-inflammatory hypothesis," which posits that chronic exposure to fine particulate matter ($PM2.5$) and nitrogen oxides ($NO_x$) precipitates systemic inflammation that affects the central nervous system.

### Key Objectives

  * **Monitor Correlations:** Track the relationship between air quality spikes and mental health indicators (depression, anxiety).
  * **Regulatory Compliance:** Adhere to the revised **EU Directive 2024/2881**, which lowers the annual $PM2.5$ target to $10~\mu g/m^{3}$ by 2030.
  * **Privacy Sovereignty:** Implement a Zero-Trust, Edge-First architecture to ensure no PII reaches third-party AI processors.

-----

## 🏗️ Technical Architecture

The architecture prioritizes data privacy and GDPR compliance by prohibiting direct client-side calls to AI services.

### The "Sanitization Airlock" Pattern

To protect user privacy, we utilize Supabase Edge Functions as a secure gateway.

1.  **Ingestion:** Client sends encrypted journal entries to the Edge Function.
2.  **Scrubbing:** The function decrypts the payload and uses libraries like `redact-pii` to strip names, locations, and identifiers.
3. **Inference:** Only sanitized text is sent to the OpenAI API for embedding and sentiment analysis.
4.  **Persistence:** Original (encrypted) text and anonymized embeddings are stored in Supabase.

### Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Database** | PostgreSQL + `pgvector` | Native vector storage for relational and semantic queries. |
| **Backend** | Supabase Edge Functions (Deno) | Low-latency, EU-hosted, TypeScript-first environment. |
| **AI Model** | OpenAI `gpt-4o` & `text-embedding-3-small` |State-of-the-art triage reasoning and efficient 1536-dim embeddings. |
| **Frontend** | React + `react-leaflet` | Geospatial visualization of Bucharest's administrative sectors. |
| **External Data** | OpenAQ API v3 | Standardized aggregation of real-time sensor data. |

-----

## 🗄️ Database Design

The schema is designed to handle high-frequency time-series data, geospatial polygons, and high-dimensional vectors.

### Required Extensions

Run the following in the Supabase SQL Editor:

```sql
-- Geospatial querying
CREATE EXTENSION IF NOT EXISTS postgis;
-- Vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;
-- Encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Core Tables

#### 1\. `bucharest_sectors`

Maps the six administrative sectors of Bucharest using OpenStreetMap data.

  * **geometry:** Polygon/MultiPolygon defining the boundary.

#### 2\. `air_quality_logs`

Stores sensor readings.Includes a computed `sector_id` based on spatial joins.

  * **pm25:** Concentration in $\mu g/m^{3}$.
  * **Indexing:** Uses BRIN index for efficient timestamp querying.

#### 3\. `journal_entries`

Implements "Split-Knowledge" storage.

  * **content\_encrypted:** Raw text encrypted via `pgcrypto`.
  * **embedding:** 1536-dimensional vector generated from *sanitized* text.
  * **Security:** Row Level Security (RLS) is mandatory; users can only access their own UUID.

-----

## ⚡ Backend Logic (Edge Functions)

### PII Redaction Implementation

We utilize Deno's Node.js compatibility to import robust redaction libraries.

```typescript
// Example Logic
import { Redactor } from "npm:@redactpii/node";

// ... inside serve handler
const redactor = new Redactor();
const safe_text = await redactor.redact(journal_text); 

// Only safe_text is sent to OpenAI
const embeddingResponse = await openai.embeddings.create({
  model: "text-embedding-3-small", 
  input: safe_text,
});
```

*See the full implementation details in the Technical Report.*

### Automated Data Ingestion

A scheduled Edge Function (cron) performs the following:

1.  **Fetch:** Queries OpenAQ for sensors within Bucharest (44.43, 26.10).
2. **Spatial Join:** Maps sensor coordinates to a Bucharest Sector ID.
3.  **Upsert:** Stores the reading in `air_quality_logs`.

-----

## 🤖 AI Features & Semantic Search

### Medical Triage (Structured Outputs)

To ensure reliable UI rendering, we use OpenAI's **Structured Outputs** to force a strict JSON schema for analysis.

  * **Schema includes:** `clinical_sentiment`, `detected_symptoms`, `environmental_correlation`, and a boolean `risk_flag`.

### Semantic Search (RAG)

A custom RPC function enables users to query their past journals based on semantic meaning (e.g., "How does my mood change in smog?").

```sql
-- RPC Function Signature
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  filter_user_id uuid -- Critical security filter
)
-- ... calculates cosine distance (<=>)
```

*Note: The system uses `text-embedding-3-small` (1536 dims) for higher accuracy over storage efficiency.*

-----

## 🚀 Getting Started

### Prerequisites

  * Supabase Project (deployed in `eu-central-1` for GDPR).
  * OpenAI API Key.
  * OpenAQ API Key (optional for community access).

### Installation Roadmap

1.  **Foundation:** Set up Supabase project, enable extensions, and deploy the PII Redaction Edge Function.
2.  **Data Ingestion:** Configure OpenAQ cron jobs and backfill historical air quality data.
3.  **Frontend:** Build the React dashboard with Leaflet and integrate OpenAI Structured Outputs.
4.  **Validation:** Run synthetic data tests using Python `Faker` to verify correlation algorithms.

-----

## 📄 License & Regulatory Note

**EU Directive 2024/2881:** This project is calibrated to detect "moderate" pollution levels (annual PM2.5 \> $10~\mu g/m^{3}$) which are now recognized as hazardous under the new legal framework.

**Medical Disclaimer:** This tool provides health insights but does not replace professional medical advice. The `risk_flag` feature is a triage estimation only.