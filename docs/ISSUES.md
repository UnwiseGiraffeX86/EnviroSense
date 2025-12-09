# 🐛 Project Issues & Bugs

## 🔴 Active Issues

### 1. AI Features Disabled (Missing API Key)
**Status:** 🛑 Blocked
**Priority:** Critical
**Description:** The project currently lacks a valid `OPENAI_API_KEY`.
**Impact:**
*   **RAG Agent:** `analyze-risk` Edge Function returns a fallback "Service Unavailable" message.
*   **Voice Journal:** Transcription and analysis will fail.
*   **Knowledge Ingestion:** `ingest_knowledge.py` cannot generate embeddings.
*   **Text-to-SQL:** Doctor query tool will not function.
**Fix:** Obtain a new OpenAI API Key and update `.env.local` and Supabase Secrets.

### 2. Web Scraper (`ingest_knowledge.py`) Malfunction
**Status:** ⚠️ Open
**Priority:** Medium
**Description:** The dynamic knowledge ingestion pipeline encounters 403 Forbidden errors on target sites (`envira.global`, `coe.int`).
**Proposed Fix:**
*   Implement User-Agent rotation.
*   Switch to Playwright/Selenium for headless browsing.
*   **Note:** This script is currently blocked by Issue #1 (Missing API Key).

### 3. Text-to-SQL Logic Untested
**Status:** ⚠️ Open
**Priority:** High
**Description:** The `text-to-sql` Edge Function and `exec_sql` RPC have been implemented but not fully tested end-to-end due to the missing API key.
**Risk:** The generated SQL might hallucinate table names or fields despite the system prompt.

---

## ✅ Resolved Issues (Fixed in this Session)

### 1. 🔒 Security: Unauthenticated Patient Data Leak
**Status:** Fixed
**Fix:** Implemented strict Role-Based Access Control (RBAC) in `/api/patients`. Only users with `role: 'doctor'` can now access patient logs.

### 2. 🔒 Security: Remote Code Execution (RCE)
**Status:** Fixed
**Fix:** Replaced vulnerable `exec` calls with `execFile` in `/api/analyze` to prevent shell command injection.

### 3. 🔒 Security: Privilege Escalation
**Status:** Fixed
**Fix:** Added `prevent_role_change` database trigger to stop users from promoting themselves to 'doctor' via API manipulation.

### 4. 🔒 Security: Denial of Wallet (Resource Exhaustion)
**Status:** Fixed
**Fix:** Added file size limits (25MB) and MIME type validation to `/api/transcribe`. Added character limits to `/api/analyze-profile`.

### 5. 🔒 Security: Missing Data Integrity
**Status:** Fixed
**Fix:** Added `CHECK` constraints to the `profiles` table for `focus_index`, `pollution_sensitivity`, etc.
