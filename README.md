# EnviroSense: Eco-Neuro Sentinel

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?style=flat-square&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-blue?style=flat-square&logo=openai)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Prototype-orange?style=flat-square)

**A Neuro-Symbolic health monitoring platform that correlates real-time environmental telemetry with biological response.**

EnviroSense bridges the gap between Environmental Science and Clinical Medicine by creating a dynamic "Digital Twin" of the patient. It utilizes Agentic AI to autonomously triage high-risk patients based on hyper-local air quality data.

---

## 📉 The Problem: The Invisible Crisis

Modern healthcare treats symptoms (anxiety, asthma, cognitive fog) in isolation, ignoring environmental root causes. Conversely, environmental science tracks pollution (PM2.5, NO2) but lacks biological context.

**The Consequence:** Patients are medicated for symptoms that are actually triggered by their environment, leading to reactive rather than predictive care.

---

## 🛡️ The Solution: Agentic Digital Twin Architecture

EnviroSense operationalizes the **"Digital Twin"**—a dynamic JSON profile tracking `respiratory_sensitivity` and `focus_index`.

The system functions as an autonomous **Neuro-Symbolic Agent** that:
1.  **Perceives:** Ingests real-time environmental telemetry via OpenWeatherMap.
2.  **Reasons:** Uses RAG-grounded LLMs (OpenAI GPT-4o) to analyze health risks against EU Directives.
3.  **Acts:** Executes SQL actions to triage high-risk patients to specialists without human intervention.

---

## 🛠️ Technology Stack

### Frontend (Client Layer)
* **Next.js 14 (App Router):** React Server Components for minimized bundle size.
* **Tailwind CSS:** Utility-first styling for the "Organic Futurism" design system.
* **Recharts:** Time-series visualization for symptom/pollution correlation.

### Backend (Infrastructure Layer)
* **Supabase (BaaS):**
    * **Database:** PostgreSQL 15 with `pgvector` (Embeddings) and `PostGIS` (Geolocation).
    * **Auth:** Row Level Security (RLS) policies for Zero-Trust data isolation.
    * **Realtime:** WebSocket subscriptions for immediate doctor alerts.
    * **Edge Functions:** Deno runtime for secure AI proxying.

### AI & ML Pipeline
* **Reasoning:** OpenAI `gpt-4o` (Agentic Logic).
* **Embeddings:** `text-embedding-3-small` (RAG Knowledge Base).
* **Validation:** Python/Scikit-Learn (Synthetic Data Generation).

---

## 🚀 Key Features

### 1. Privacy-First Architecture
We utilize a "Zero-Trust" model. Raw PII is stripped at the Edge layer before inference. Database access is governed strictly by RLS policies—patients can only access their own rows.

### 2. Neuro-Symbolic Reasoning
To prevent hallucinations in a medical context, we fuse two paradigms:
* **Neural:** LLMs handle natural language parsing and probabilistic reasoning.
* **Symbolic:** Deterministic SQL constraints and Vector Search ground the AI in facts.

### 3. Synthetic Validation
The risk-scoring logic was stress-tested against **10,000 rows of synthetic patient data** generated via our custom `validator.py` script. This ensures the correlation algorithm holds up under diverse environmental scenarios.

---

## 🏆 AI Challenge Compliance

EnviroSense was architected specifically to meet the challenge requirements:

| Requirement | Implementation Details |
| :--- | :--- |
| **Agentic AI** | The system **executes actions**. If a risk threshold is breached, the Agent autonomously writes a summary to the `consultations` table and alerts a doctor. |
| **RAG Component** | The AI is grounded in the **EU Air Quality Directive 2024/2881**, utilizing vector search to retrieve safety thresholds. |
| **Text-to-SQL** | The Agent dynamically queries the `doctors` database table to find available specialists based on symptom keywords. |
| **Unstructured Data** | We implemented a PDF ingestion pipeline that scrapes and chunks regulatory documents for the Knowledge Base. |

---

## ⚡ Installation & Setup

### Prerequisites
* Node.js 18+
* Supabase CLI

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/envirosense.git
cd envirosense
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📚 Documentation & Resources

### 🗺️ Roadmaps & Strategy
*   [**Strategic Project Roadmap (12 Months)**](./ROADMAP.md) - The high-level vision and quarterly goals.
*   [**Mobile App Roadmap (EnviroSense Go)**](./docs/MOBILE_APP_ROADMAP.md) - Features and concepts for the mobile application.
*   [**Project Status**](./docs/PROJECT_STATUS.md) - Current implementation status of all modules.

### 📖 Technical Documentation
*   [**Technical Dossier**](./docs/TECHNICAL_DOSSIER.md) - Deep dive into architecture, database schema, and AI logic.
*   [**Presentation**](./docs/PRESENTATION.md) - Pitch deck and project overview.

### 🧠 Knowledge Base & Tasks
*   [**Teo's Tasks**](./docs/TEO_TASKS.md) - Specific task list for team members.
*   [**Known Issues**](./docs/knowledge_base/ISSUES.md) - Tracking current bugs and limitations.
*   [**Progress Log**](./docs/knowledge_base/PROGRESS.md) - Historical log of development progress.
